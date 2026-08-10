import { GoogleGenAI } from '@google/genai';

export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey.trim(),
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const MODELS_TO_TRY = ['gemini-3.6-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];

export async function generateGeminiText(options: {
  contents: any;
  config?: any;
}): Promise<{ text: string | null; error?: string }> {
  const ai = getGeminiClient();
  if (!ai) {
    return { text: null, error: 'Gemini API key is not configured.' };
  }

  let lastError = '';
  for (const model of MODELS_TO_TRY) {
    try {
      const res = await ai.models.generateContent({
        model,
        contents: options.contents,
        config: options.config,
      });
      if (res && res.text) {
        return { text: res.text };
      }
    } catch (err: any) {
      lastError = err?.message || String(err);
      console.warn(`Gemini model ${model} attempt error:`, lastError);
    }
  }

  return { text: null, error: lastError || 'All Gemini models were temporarily unavailable.' };
}

