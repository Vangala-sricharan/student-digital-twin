import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getGeminiClient } from '../_lib/gemini';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set JSON Content-Type
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Please use POST.',
    });
  }

  try {
    const body = req.body || {};
    let question = body.question;
    let context = body.context;
    const language = body.language || 'en';

    // Support messages / profileContext payload format
    if (!question && Array.isArray(body.messages) && body.messages.length > 0) {
      const lastUserMsg = [...body.messages].reverse().find((m: any) => m.role === 'user' || m.sender === 'user');
      question = lastUserMsg?.content || lastUserMsg?.text || '';
    }
    if (!context && body.profileContext) {
      context = body.profileContext;
    }

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Question is required.',
      });
    }

    const ai = getGeminiClient();
    if (!ai) {
      const fallbackText = `[Gemini AI Offline Mode]\n\nBased on Vangala Sricharan's Student Digital Twin profile:\n- Current Career Readiness: ${context?.overallScore || context?.readinessScore || 75}%\n- Active Career Goal: AI/ML Engineer\n- Recommended Next Action: Strengthen Data Structures & Algorithms and build an ML Image Classifier model using Python & CNNs.\n\n(To enable live real-time Gemini responses, configure GEMINI_API_KEY in AI Studio Settings > Secrets or Vercel Environment Variables).`;

      return res.status(200).json({
        success: true,
        response: fallbackText,
        reply: fallbackText,
      });
    }

    const langInstruction =
      language === 'hi'
        ? 'Respond in Hindi (हिंदी).'
        : language === 'te'
        ? 'Respond in Telugu (తెలుగు).'
        : language === 'gu'
        ? 'Respond in Gujarati (ગુજરાતી).'
        : 'Respond in English.';

    const systemInstruction = `You are the AI Career Assistant for Student Digital Twin, powering career advisory for Vangala Sricharan (B.Tech CSE AI/ML, Marwadi University, 2nd Year).
Target Goal: AI/ML Engineer.
Analyze the provided Student Digital Twin state carefully:
- Overall Score: ${context?.overallScore || context?.readinessScore || '75'}%
- Top Skills: ${JSON.stringify(context?.skills || [])}
- Projects: ${JSON.stringify(context?.projects || [])}
- Skill Gaps: ${JSON.stringify(context?.skillGaps || [])}
- Career Recommendations: ${JSON.stringify(context?.recommendations || [])}

Provide actionable, supportive, encouraging, and specific guidance. Never guarantee employment or job offers. ${langInstruction}`;

    const geminiRes = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: question,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = geminiRes.text || 'No response generated.';

    return res.status(200).json({
      success: true,
      response: replyText,
      reply: replyText,
    });
  } catch (err: any) {
    console.error('Gemini Assistant Serverless Function Error:', err);
    return res.status(500).json({
      success: false,
      error: 'AI Career Assistant is temporarily unavailable. Please try again later.',
    });
  }
}
