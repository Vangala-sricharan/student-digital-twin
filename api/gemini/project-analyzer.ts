import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Type } from '@google/genai';
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
    const { projectDescription, techStack = [], githubUrl = '' } = req.body || {};
    if (!projectDescription || typeof projectDescription !== 'string' || projectDescription.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Project description is required.',
      });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(200).json({
        success: true,
        technologies: techStack.length ? techStack : ['C++', 'OOP', 'File Handling'],
        skillsDemonstrated: ['Object-Oriented Programming', 'Data Storage', 'System Architecture'],
        difficulty: 'Intermediate',
        careerRelevance: 'High for Software Engineering and Systems Development.',
        missingSkills: ['REST API integration', 'Cloud Deployment', 'Automated Testing'],
        resumeValue: 82,
        githubQualityScore: 75,
        suggestedImprovements: [
          'Add a detailed README with screenshot animations and installation guide.',
          'Containerize with Docker or create a web frontend wrapper.',
          'Add unit tests and exception handling documentation.',
        ],
      });
    }

    const prompt = `Evaluate this student project for an AI/ML Engineer portfolio:\nDescription: ${projectDescription}\nTechnologies: ${techStack.join(
      ', '
    )}\nGitHub URL: ${githubUrl}`;

    const geminiRes = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
            skillsDemonstrated: { type: Type.ARRAY, items: { type: Type.STRING } },
            difficulty: { type: Type.STRING },
            careerRelevance: { type: Type.STRING },
            missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            resumeValue: { type: Type.INTEGER },
            githubQualityScore: { type: Type.INTEGER },
            suggestedImprovements: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: [
            'technologies',
            'skillsDemonstrated',
            'difficulty',
            'careerRelevance',
            'missingSkills',
            'resumeValue',
            'githubQualityScore',
            'suggestedImprovements',
          ],
        },
      },
    });

    const parsed = JSON.parse(geminiRes.text || '{}');
    return res.status(200).json({
      success: true,
      ...parsed,
    });
  } catch (err: any) {
    console.error('Project Analyzer Error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to analyze project. Please try again later.',
    });
  }
}
