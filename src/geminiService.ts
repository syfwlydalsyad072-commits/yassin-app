import { GoogleGenerativeAI } from "@google/generative-ai";
export const GeminiService = {
  async generateResponse(userPrompt: string) {
    try {
      const apiKey = localStorage.getItem('sahar_api_key');
      if (!apiKey) return "⚠️ يا سهر، البرنامج محتاج مفتاح الـ API الأول. ادخلي على الإعدادات ⚙️ وحطيه.";
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(userPrompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      return "🛑 حصلت مشكلة: تأكدي إن المفتاح شغال أو إن فيه إنترنت.";
    }
  }
};
