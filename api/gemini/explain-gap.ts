import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateGeminiText } from '../_lib/gemini';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Please use POST.',
    });
  }

  try {
    const { skillName = 'this skill', currentLevel = 0, requiredLevel = 100, goalTitle = 'AI/ML Engineer' } = req.body || {};

    const fallbackExplanation = `${skillName} is crucial for target role ${goalTitle}. Closing the ${Math.max(
      0,
      requiredLevel - currentLevel
    )}% gap will strengthen your technical foundation and portfolio readiness.`;

    const prompt = `Provide a short, concise, personalized explanation (2 sentences) and recommended action (1 sentence) for a student who has a gap in ${skillName} (Current: ${currentLevel}%, Target: ${requiredLevel}%) for the target role of ${goalTitle}.`;

    const { text } = await generateGeminiText({
      contents: prompt,
    });

    return res.status(200).json({
      success: true,
      explanation: text || fallbackExplanation,
    });
  } catch (err: any) {
    return res.status(200).json({
      success: true,
      explanation: `Closing the gap in ${req.body?.skillName || 'this skill'} will directly boost your readiness score.`,
    });
  }
}

