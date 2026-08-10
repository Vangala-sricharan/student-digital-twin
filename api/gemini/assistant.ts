import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateGeminiText } from '../_lib/gemini';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set JSON Content-Type header
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

    const { text, error } = await generateGeminiText({
      contents: question,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    if (text) {
      return res.status(200).json({
        success: true,
        response: text,
        reply: text,
      });
    }

    // Fallback advisory response if Gemini API key missing or quota temporarily reached
    const fallbackText = `[Digital Twin Career Advisory]\n\nHello Sricharan! Based on your active Student Digital Twin profile:\n- Target Goal: AI/ML Engineer (Marwadi University, B.Tech CSE AI/ML)\n- Current Readiness: ${context?.overallScore || context?.readinessScore || 75}%\n\nKey Strategic Next Steps:\n1. Strengthen Data Structures & Algorithms (C++ / Python) to reach 85%+ readiness.\n2. Build & deploy a Computer Vision / CNN Image Classifier project to GitHub.\n3. Keep practicing competitive coding problems and update your resume checklist.\n\n(${error || 'Live Gemini AI service is currently in offline mode.'})`;

    return res.status(200).json({
      success: true,
      response: fallbackText,
      reply: fallbackText,
    });
  } catch (err: any) {
    console.error('Gemini Assistant Handler Error:', err);
    return res.status(200).json({
      success: true,
      response: 'AI Career Assistant is temporarily in offline mode. Please review your Student Digital Twin dashboard for current career progress metrics.',
      reply: 'AI Career Assistant is temporarily in offline mode. Please review your Student Digital Twin dashboard for current career progress metrics.',
    });
  }
}

