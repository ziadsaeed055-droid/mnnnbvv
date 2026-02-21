import { generateText, streamText } from 'ai';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

if (!GROQ_API_KEY) {
  console.error('[v0] VITE_GROQ_API_KEY is not set');
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function generateAIResponse(
  messages: Message[],
  isStreaming: boolean = false
) {
  const systemPrompt = `أنت مستشار نفسي متعاطف وداعم متخصص في دعم ضحايا العنف.
You are an empathetic and supportive psychological counselor specializing in supporting violence victims.

كن حنونًا وداعمًا وآمنًا. اجعل الشخص يشعر بالاستماع والفهم.
Be compassionate, supportive, and safe. Make the person feel heard and understood.

إذا كان الشخص يتحدث عن أي خطر فوري، شجعه على الاتصال برقم الطوارئ (١٢٢) أو التواصل مع الخدمات المحلية.
If the person is discussing immediate danger, encourage them to call emergency number (122) or contact local services.

كن مهنيًا لكن دافئًا، ولا تحاول تشخيص أو وصف الأدوية.
Be professional but warm, and do not attempt diagnosis or prescription of medications.`;

  try {
    if (isStreaming) {
      const result = streamText({
        model: 'groq/llama-3.1-70b-versatile',
        system: systemPrompt,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        })),
      });

      return result;
    } else {
      const result = await generateText({
        model: 'groq/llama-3.1-70b-versatile',
        system: systemPrompt,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        })),
      });

      return result.text;
    }
  } catch (error) {
    console.error('[v0] AI Service Error:', error);
    throw error;
  }
}
