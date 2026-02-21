import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("[v0] AI Chat Function Called - Method:", req.method);
  
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    console.log("[v0] Request body received:", requestBody);
    
    const { messages } = requestBody;

    if (!messages || !Array.isArray(messages)) {
      console.error("[v0] Invalid messages format:", messages);
      return new Response(
        JSON.stringify({ error: "Invalid messages format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("[v0] Messages received:", messages.length);

    const groqApiKey = Deno.env.get("GROQ_API_KEY");
    if (!groqApiKey) {
      console.error("[v0] GROQ_API_KEY is not set in environment");
      throw new Error("GROQ_API_KEY is not set");
    }
    
    console.log("[v0] GROQ API Key found, making request...");

    const systemPrompt = `أنت مستشار نفسي متعاطف وداعم متخصص في دعم ضحايا العنف.
You are an empathetic and supportive psychological counselor specializing in supporting violence victims.

كن حنونًا وداعمًا وآمنًا. اجعل الشخص يشعر بالاستماع والفهم.
Be compassionate, supportive, and safe. Make the person feel heard and understood.

إذا كان الشخص يتحدث عن أي خطر فوري، شجعه على الاتصال برقم الطوارئ (١٢٢) أو التواصل مع الخدمات المحلية.
If the person is discussing immediate danger, encourage them to call emergency number (122) or contact local services.

كن مهنيًا لكن دافئًا، ولا تحاول تشخيص أو وصف الأدوية.
Be professional but warm, and do not attempt diagnosis or prescription of medications.`;

    // Call Groq API with streaming
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((msg: any) => ({
            role: msg.role,
            content: msg.content,
          })),
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!groqResponse.ok) {
      const errorBody = await groqResponse.text();
      console.error("[v0] Groq API error:", groqResponse.status, errorBody);
      throw new Error(`Groq API error: ${groqResponse.status} - ${errorBody}`);
    }

    console.log("[v0] Groq API response received, streaming...");

    // Stream the response
    return new Response(
      new ReadableStream({
        async start(controller) {
          const reader = groqResponse.body!.getReader();
          const decoder = new TextDecoder();

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              const text = decoder.decode(value);
              const lines = text.split("\n");

              for (const line of lines) {
                if (line.startsWith("data: ")) {
                  const data = line.slice(6);
                  if (data === "[DONE]") {
                    controller.enqueue("data: [DONE]\n\n");
                    continue;
                  }

                  try {
                    const parsed = JSON.parse(data);
                    const delta = parsed.choices?.[0]?.delta?.content;
                    if (delta) {
                      controller.enqueue(
                        `data: ${JSON.stringify({ type: "text-delta", delta })}\n\n`
                      );
                    }
                  } catch (e) {
                    // Skip invalid JSON
                  }
                }
              }
            }
          } finally {
            controller.close();
          }
        },
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[v0] AI Chat Error:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
