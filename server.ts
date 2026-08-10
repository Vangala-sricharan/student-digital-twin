import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client Lazily/Safely
function getGeminiClient(): GoogleGenAI | null {
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

async function generateGeminiTextServer(options: { contents: any; config?: any }): Promise<{ text: string | null; error?: string }> {
  const ai = getGeminiClient();
  if (!ai) {
    return { text: null, error: 'GEMINI_API_KEY environment variable is not configured.' };
  }

  let lastErr = '';
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
    } catch (e: any) {
      lastErr = e?.message || String(e);
      console.warn(`Server Gemini model ${model} attempt error:`, lastErr);
    }
  }

  return { text: null, error: lastErr || 'All Gemini models were temporarily unavailable.' };
}

// 1. AI Career Assistant Route
app.post(['/api/gemini/assistant', '/api/ai/career-assistant'], async (req: Request, res: Response) => {
  try {
    const body = req.body || {};
    let question = body.question;
    let context = body.context;
    const language = body.language || 'en';

    if (!question && Array.isArray(body.messages) && body.messages.length > 0) {
      const lastUserMsg = [...body.messages].reverse().find((m: any) => m.role === 'user' || m.sender === 'user');
      question = lastUserMsg?.content || lastUserMsg?.text || '';
    }
    if (!context && body.profileContext) {
      context = body.profileContext;
    }

    if (!question) {
      return res.status(400).json({ success: false, error: 'Question is required' });
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

    const { text, error } = await generateGeminiTextServer({
      contents: question,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    if (text) {
      return res.json({ success: true, response: text, reply: text });
    }

    const fallbackText = `[Digital Twin Career Advisory]\n\nHello Sricharan! Based on your active Student Digital Twin profile:\n- Target Goal: AI/ML Engineer (Marwadi University, B.Tech CSE AI/ML)\n- Current Readiness: ${context?.overallScore || context?.readinessScore || 75}%\n\nKey Strategic Next Steps:\n1. Strengthen Data Structures & Algorithms (C++ / Python) to reach 85%+ readiness.\n2. Build & deploy a Computer Vision / CNN Image Classifier project to GitHub.\n3. Keep practicing competitive coding problems and update your resume checklist.\n\n(${error || 'Live Gemini AI service is currently in offline mode.'})`;

    return res.json({ success: true, response: fallbackText, reply: fallbackText });
  } catch (err: any) {
    console.error('API Assistant Error:', err);
    return res.status(200).json({
      success: true,
      response: 'AI Career Assistant is temporarily in offline mode.',
      reply: 'AI Career Assistant is temporarily in offline mode.',
    });
  }
});


// 2. Resume Analyzer Route
app.post('/api/gemini/resume-analyzer', async (req: Request, res: Response) => {
  const fallbackData = {
    success: true,
    score: 78,
    strengths: [
      'Strong foundational coursework in C++ OOP and Python for AI/ML',
      'Solid academic background in B.Tech CSE AI/ML at Marwadi University',
      'Good technical project exposure (C++ Restaurant POS & ATM Management)',
    ],
    weaknesses: [
      'Lacks deployed live web application links',
      'Missing quantitative metrics on project outcomes',
    ],
    missingInfo: [
      'GitHub Profile repository URL in resume header',
      'LinkedIn Profile URL',
      'Deep Learning framework exposure (PyTorch / TensorFlow)',
    ],
    improvements: [
      'Add a GitHub section with direct links to C++ POS code',
      'Include CNN / computer vision project metrics (e.g. 92% classification accuracy)',
      'Add competitive programming / LeetCode profile link',
    ],
    careerAlignment: 'High alignment for Entry-level AI/ML Developer & Software Engineering roles.',
  };

  try {
    const { resumeText, language = 'en' } = req.body;
    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Resume text or document content is required.' });
    }

    const langInstruction = language !== 'en' ? `Output explanations in ${language} language.` : '';
    const prompt = `Analyze this student resume for an AI/ML Engineer role:\n\n${resumeText}\n\n${langInstruction}`;

    const { text } = await generateGeminiTextServer({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: 'Resume score from 0 to 100' },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingInfo: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
            careerAlignment: { type: Type.STRING },
          },
          required: ['score', 'strengths', 'weaknesses', 'missingInfo', 'improvements', 'careerAlignment'],
        },
      },
    });

    if (text) {
      try {
        const parsed = JSON.parse(text);
        return res.json({ success: true, ...parsed });
      } catch (e) {
        console.warn('Resume Analyzer Server parse warning');
      }
    }

    return res.json(fallbackData);
  } catch (err: any) {
    console.error('API Resume Analyzer Error:', err);
    return res.json(fallbackData);
  }
});

// 3. Syllabus Analyzer Route
app.post('/api/gemini/syllabus-analyzer', async (req: Request, res: Response) => {
  try {
    const { syllabusText, days = 14, hoursPerDay = 2, difficulty = 'Intermediate', language = 'en' } = req.body;
    if (!syllabusText) {
      return res.status(400).json({ error: 'Syllabus content is required' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback study roadmap
      return res.json({
        subjects: ['Data Structures & Algorithms', 'Machine Learning Foundations', 'Database Management Systems'],
        totalTopics: 12,
        roadmap: Array.from({ length: Math.min(days, 10) }, (_, i) => ({
          day: i + 1,
          topic: `Day ${i + 1}: ${
            ['Arrays & Pointers', 'OOP Concepts in C++', 'SQL Queries & Joins', 'Python NumPy & Pandas', 'Linear Regression', 'Logistic Regression', 'Decision Trees', 'CNN Architectures', 'Model Evaluation', 'Project Deployment'][i % 10]
          }`,
          activities: [
            `Study theory for ${hoursPerDay} hrs`,
            'Solve 2 practice problems or code snippets',
          ],
          difficulty,
        })),
      });
    }

    const prompt = `Analyze this syllabus and create a ${days}-day study roadmap (${hoursPerDay} hours/day, difficulty level: ${difficulty}):\n\n${syllabusText}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subjects: { type: Type.ARRAY, items: { type: Type.STRING } },
            totalTopics: { type: Type.INTEGER },
            roadmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.INTEGER },
                  topic: { type: Type.STRING },
                  activities: { type: Type.ARRAY, items: { type: Type.STRING } },
                  difficulty: { type: Type.STRING },
                },
                required: ['day', 'topic', 'activities', 'difficulty'],
              },
            },
          },
          required: ['subjects', 'totalTopics', 'roadmap'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('API Syllabus Analyzer Error:', err);
    return res.status(500).json({ error: 'Failed to analyze syllabus.' });
  }
});

// 4. Project Analyzer Route
app.post('/api/gemini/project-analyzer', async (req: Request, res: Response) => {
  try {
    const { projectDescription, techStack = [], githubUrl = '' } = req.body;
    if (!projectDescription) {
      return res.status(400).json({ error: 'Project description is required' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
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

    const response = await ai.models.generateContent({
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

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('API Project Analyzer Error:', err);
    return res.status(500).json({ error: 'Failed to analyze project.' });
  }
});

// 5. Skill Gap AI Explanation Route
app.post('/api/gemini/explain-gap', async (req: Request, res: Response) => {
  try {
    const { skillName, currentLevel, requiredLevel, category, goalTitle } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        explanation: `${skillName} is crucial for ${goalTitle || 'AI/ML Engineering'}. Closing the ${requiredLevel - currentLevel}% gap will strengthen your technical foundation and portfolio quality.`,
        recommendedAction: `Complete hands-on projects or focused exercises on ${skillName} over the next 2-3 weeks.`,
      });
    }

    const prompt = `Provide a short, concise, personalized explanation (2 sentences) and recommended action (1 sentence) for a student who has a gap in ${skillName} (Current: ${currentLevel}%, Target: ${requiredLevel}%) for the target role of ${goalTitle}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    return res.json({
      explanation: response.text || 'Focus on closing this skill gap through hands-on practice.',
    });
  } catch (err) {
    return res.json({
      explanation: `Closing the gap in ${req.body.skillName} will directly boost your readiness score.`,
    });
  }
});

// 6. AI Personalized Roadmap Route
app.post('/api/gemini/roadmap', async (req: Request, res: Response) => {
  try {
    const { profile, skills, goalTitle = 'AI/ML Engineer', language = 'en' } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
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

    const response = await ai.models.generateContent({
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

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('API Roadmap Error:', err);
    return res.status(500).json({ error: 'Failed to generate roadmap.' });
  }
});

// Vite Middleware for Development / Static serving for Production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Student Digital Twin Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
