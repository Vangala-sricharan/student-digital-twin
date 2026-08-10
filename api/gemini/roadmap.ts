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
    const { skills, goalTitle = 'AI/ML Engineer' } = req.body || {};
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({
        success: true,
        targetGoal: goalTitle,
        stages: [
          {
            phase: 'Phase 1: Foundations',
            title: 'Master Core Programming & C++/Python',
            status: 'Completed',
            items: ['C++ OOP & File Handling', 'Basic Python Scripting', 'Git & Version Control'],
          },
          {
            phase: 'Phase 2: Data Structures',
            title: 'DSA & Algorithmic Problem Solving',
            status: 'In Progress',
            items: ['Arrays, Linked Lists & Stacks', 'Trees & Searching/Sorting', 'Solve 50+ LeetCode problems'],
          },
          {
            phase: 'Phase 3: Machine Learning',
            title: 'Statistical ML & Data Wrangling',
            status: 'Next Up',
            items: ['NumPy, Pandas & Scikit-Learn', 'Linear Regression & Classification', 'CNN Image Classifier Project'],
          },
          {
            phase: 'Phase 4: Deep Learning & Deployment',
            title: 'PyTorch & API Model Deployment',
            status: 'Future',
            items: ['PyTorch / TensorFlow Neural Networks', 'FastAPI Web Service Wrapper', 'Deploy to Cloud / Render'],
          },
          {
            phase: 'Phase 5: Career & Internship',
            title: 'Portfolio & Interview Preparation',
            status: 'Future',
            items: ['GitHub README polish', 'Resume optimization', 'Mock interviews & applications'],
          },
        ],
      });
    }

    const prompt = `Generate a 5-phase career roadmap toward becoming a ${goalTitle} for a 2nd year student with skills: ${JSON.stringify(
      skills || []
    )}.`;

    const geminiRes = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            targetGoal: { type: Type.STRING },
            stages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phase: { type: Type.STRING },
                  title: { type: Type.STRING },
                  status: { type: Type.STRING },
                  items: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['phase', 'title', 'status', 'items'],
              },
            },
          },
          required: ['targetGoal', 'stages'],
        },
      },
    });

    const parsed = JSON.parse(geminiRes.text || '{}');
    return res.status(200).json({
      success: true,
      ...parsed,
    });
  } catch (err: any) {
    console.error('AIRoadmap Error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate roadmap. Please try again later.',
    });
  }
}
