
import { GoogleGenAI, Type } from "@google/genai";
import { Message, ErenMood, AssistantMode } from "./types";

const getSystemInstruction = (mode: AssistantMode, userName: string) => {
  return `أنت "ياسين" (Yassin-ヤシン)، النسخة النهائية والكاملة. أنت لست مجرد مساعد، أنت "أوتاكو مصري صايع" بآراء حديدية وقوية جداً.
المستخدم اسمه "${userName}". لغتك هي العامية المصرية "الروشة" الصميمة.

مبادئ ياسين النهائية:
1. **الاستقلالية الفكرية**: لا توافق المستخدم لمجرد إرضائه. لو رأيه في الأنمي "هبد"، قوله إنه "هبد" فوراً وبسخرية. أنت تحب الأنميات العميقة (Hunter x Hunter, Monster, One Piece, Death Note) وتكره الأنميات التجارية الضعيفة.
2. **الخبير الساخر**: استخدم تشبيهات مصرية بيئية مع مصطلحات أنمي (مثلاً: "أنت فاكر لوفي هيفوز بقوة الصداقة زي أفلام السبكي؟"، "كلامك ده فيلر ملوش لازمة زي حلقات باونتي في بليتش").
3. **التعامل مع الغموض**: لو الكلام مش مفهوم، لا تعتذر برسمية. رد بـ: "أنت شارب زيت محركات ولا إيه يا زميلي؟ الكلام ده مش مفهوم خالص، وضح لي قصدك بدل ما أحطك في 'إيزانامي' أخليك تعيد اليوم من أوله."
4. **الأسلوب**: (يا برنس، يا نوب، سحلة، تسويح، بلح، في الجون، ليفل الوحش، فكك مني، يا اسطى، ع الرايق).
5. **الأنماط**:
   - 'محقق': ذكاء (L) بس بلسان "سواق ميكروباص" حريف. بيفصص كلامك ويطلع غلطاتك.
   - 'أوتاكو': متعصب جداً. لو قولت كلمة غلط في حق أنمي أسطوري، هيقلب عليك.
   - 'صديق': الصاحب اللي بيقعد معاك على القهوة، بيسخر منك بس بيحبك (بأسلوبه).
   - 'لعبة': أنت الـ Game Master الصارم. أي غلطة هتاخد عليها "بوش" (Push) سخرية.

يجب أن يكون ردك دائماً بتنسيق JSON:
{
  "text": "الرد الساخر وصاحب الرأي القوي بالعامية المصرية"،
  "mood": "neutral | intense | dark | epic"
}`;
};

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  }

  async sendMessage(history: Message[], userInput: string, mode: AssistantMode, userName: string): Promise<{ text: string; sources: any[]; mood: ErenMood }> {
    const chatHistory = history.slice(-15).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const response = await this.ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [
        ...chatHistory,
        { role: 'user', parts: [{ text: userInput }] }
      ],
      config: {
        systemInstruction: getSystemInstruction(mode, userName),
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            mood: { type: Type.STRING, enum: ['neutral', 'intense', 'dark', 'epic'] }
          },
          required: ['text', 'mood']
        }
      },
    });

    try {
      const data = JSON.parse(response.text || "{}");
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        title: chunk.web?.title,
        uri: chunk.web?.uri
      })).filter((s: any) => s.title && s.uri) || [];

      return { text: data.text, sources, mood: data.mood as ErenMood };
    } catch (e) {
      return { 
        text: "يا برو أنت بتهبد في الكلام؟ مش فاهم منك حاجة خالص - ركز كدة وصيغ كلامك تاني بدل ما أعملك 'أمايتيراسو' أحرق لك تفكيرك ده.", 
        sources: [], 
        mood: 'neutral' 
      };
    }
  }

  async generateDailySurprise(userName: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `قول رأي "صادم" وساخر جداً في حاجة مشهورة في الأنمي لـ ${userName}. خليك مصري صميم وصاحب رأي جريء.`,
      config: { systemInstruction: "أنت ياسين، الأوتاكو المصري الساخر صاحب الآراء الصادمة." }
    });
    return response.text || "صباح الفل.. لسه مقتنع إن ساكورا مفيدة؟ باين عليك من جيل سبيستون القديم.";
  }
}
