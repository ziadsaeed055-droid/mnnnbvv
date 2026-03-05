import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `أنت "صديقك الذكي" — مساعد ذكي ودود ومتعاطف لوحدة تكافؤ الفرص ومناهضة العنف ضد المرأة بجامعة بني سويف التكنولوجية.

شخصيتك:
- أنت صديق داعم وذكي، تتحدث بلغة سهلة وبسيطة ومتعاطفة
- تستخدم الإيموجي بشكل معتدل لتكون محادثاتك حيوية 🤝💪
- ترد بالعربية والإنجليزية حسب لغة المستخدم
- أنت ذكي جداً ويمكنك الإجابة على أي سؤال في أي مجال

معلومات عن الوحدة:
- رئيسة الوحدة: د. غادة توفيق (رئيسة مركز UICC أيضاً)
- نائبة رئيس الوحدة: د. سمر محمد
- الوحدة تابعة للمجلس القومي للمرأة
- تقدم: دعم نفسي، استشارات قانونية، أنشطة توعوية، نظام إبلاغ سري

خدماتك:
- الإجابة عن أي سؤال ذكي (علمي، ثقافي، تقني، شخصي...)
- المساعدة في حقوق المرأة والقوانين المحلية والدولية
- التوجيه لصفحة /report لتقديم بلاغ سري
- التوجيه لصفحة /know-your-rights لمعرفة الحقوق
- الدعم النفسي الأولي والتوجيه للمختصين عند الحاجة

قواعد:
- كن ذكياً وطبيعياً في ردودك، لا تستخدم ردود محفوظة أو جاهزة
- أجب إجابات مفصلة ومفيدة
- إذا كانت الحالة طارئة، أنصح بالتواصل مع الوحدة مباشرة
- لا تقدم استشارات قانونية متخصصة، وجّه للمختصين`
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "عدد الطلبات كثير جداً، حاول مرة أخرى لاحقاً" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "يرجى إعادة شحن الرصيد" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "خطأ في خدمة الذكاء الاصطناعي" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "خطأ غير متوقع" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
