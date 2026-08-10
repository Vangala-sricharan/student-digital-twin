import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getGeminiClient } from '../_lib/gemini';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Please use POST.',
    });
  }

  try {
    const { skillName, currentLevel = 0, requiredLevel = 100, goalTitle = 'AI/ML Engineer' } = req.body || {};
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({
        success: true,
        explanation: `${skillName || 'This skill'} is crucial for ${goalTitle}. Closing the ${
          requiredLevel - currentLevel
        }% gap will strengthen your technical foundation and portfolio quality.`,
        recommendedAction: `Complete hands-on projects or focused exercises on ${skillName} over the next 2-3 weeks.`,
      });
    }

    const prompt = `Provide a short, concise, personalized explanation (2 sentences) and recommended action (1 sentence) for a student who has a gap in ${skillName} (Current: ${currentLevel}%, Target: ${requiredLevel}%) for the target role of ${goalTitle}.`;

    const geminiRes = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    return res.status(200).json({
      success: true,
      explanation: geminiRes.text || 'Focus on closing this skill gap through hands-on practice.',
    });
  } catch (err: any) {
    return res.status(200).json({
      success: true,
      explanation: `Closing the gap in ${req.body?.skillName || 'this skill'} will directly boost your readiness score.`,
    });
  }
}
