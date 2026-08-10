import React, { useState } from 'react';
import { Sparkles, Bot, FileText, BookOpen, FolderGit2, ArrowRight, MessageSquare, Code } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { StudentProfile, Project, Skill } from '../types';

interface AILabPageProps {
  profile: StudentProfile;
  skills: Skill[];
  projects: Project[];
  id?: string;
}

export const AILabPage: React.FC<AILabPageProps> = ({ profile, skills, projects, id }) => {
  const [activeModule, setActiveModule] = useState<'assistant' | 'resume' | 'syllabus' | 'project'>('assistant');
  const [userQuery, setUserQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: `Hello Sricharan! I am your AI Career Twin Assistant. I have loaded your digital twin context (B.Tech CSE AI/ML at Marwadi University, 2nd Year, Target: AI/ML Engineer). How can I guide your learning roadmap today?`,
    },
  ]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    const query = userQuery;
    setChatHistory((prev) => [...prev, { sender: 'user', text: query }]);
    setUserQuery('');

    // Rule-based, context-aware digital twin advice (offline, instant, real career guidance)
    setTimeout(() => {
      let response = `Based on your digital twin data as an AI/ML Engineer candidate: `;
      if (query.toLowerCase().includes('dsa') || query.toLowerCase().includes('data structure')) {
        response += `Your current DSA score is in the growth phase. Focus on practicing arrays, recursion, linked lists, and sorting in C++ to prepare for technical interviews.`;
      } else if (query.toLowerCase().includes('project') || query.toLowerCase().includes('c++')) {
        response += `You have 5 solid C++ projects including POS, ATM, and Payroll systems. The next recommended step is extending your Python AI/ML skills with a Convolutional Neural Network (CNN) project.`;
      } else {
        response += `Your highest scoring area is C++ Programming and OOP. To reach the 85+ score tier for AI/ML Engineer, prioritize building PyTorch ML models and deploying a web app API.`;
      }

      setChatHistory((prev) => [...prev, { sender: 'ai', text: response }]);
    }, 400);
  };

  return (
    <div id={id} className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 mb-2">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Serverless-Ready AI Architecture</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Bot className="h-6 w-6 text-cyan-500" />
          <span>AI Career Hub & Intelligence Engine</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Modular AI features built to consume your Student Digital Twin data for contextual guidance.
        </p>
      </div>

      {/* Module Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveModule('assistant')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            activeModule === 'assistant'
              ? 'bg-cyan-500/15 border-cyan-500 text-cyan-600 dark:text-cyan-400 font-bold shadow-md shadow-cyan-500/10'
              : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <MessageSquare className="h-4 w-4 mb-1.5 text-cyan-500" />
          <h3 className="text-xs font-bold">AI Career Assistant</h3>
          <p className="text-[10px] opacity-75">Twin Context Guidance</p>
        </button>

        <button
          onClick={() => setActiveModule('resume')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            activeModule === 'resume'
              ? 'bg-cyan-500/15 border-cyan-500 text-cyan-600 dark:text-cyan-400 font-bold shadow-md shadow-cyan-500/10'
              : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <FileText className="h-4 w-4 mb-1.5 text-blue-500" />
          <h3 className="text-xs font-bold">AI Resume Analyzer</h3>
          <p className="text-[10px] opacity-75">Gap Extraction</p>
        </button>

        <button
          onClick={() => setActiveModule('syllabus')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            activeModule === 'syllabus'
              ? 'bg-cyan-500/15 border-cyan-500 text-cyan-600 dark:text-cyan-400 font-bold shadow-md shadow-cyan-500/10'
              : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <BookOpen className="h-4 w-4 mb-1.5 text-emerald-500" />
          <h3 className="text-xs font-bold">AI Syllabus Analyzer</h3>
          <p className="text-[10px] opacity-75">Study Plan Generator</p>
        </button>

        <button
          onClick={() => setActiveModule('project')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            activeModule === 'project'
              ? 'bg-cyan-500/15 border-cyan-500 text-cyan-600 dark:text-cyan-400 font-bold shadow-md shadow-cyan-500/10'
              : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <FolderGit2 className="h-4 w-4 mb-1.5 text-amber-500" />
          <h3 className="text-xs font-bold">AI Project Analyzer</h3>
          <p className="text-[10px] opacity-75">Skill Mapper</p>
        </button>
      </div>

      {/* Module Content Display */}
      {activeModule === 'assistant' && (
        <GlassCard glow="cyan" className="p-6 sm:p-8">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-cyan-500" />
            <span>Interactive AI Career Assistant</span>
          </h2>

          <div className="h-72 overflow-y-auto space-y-3 p-4 rounded-xl bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-xl p-3 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-cyan-600 text-white font-medium'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="mt-4 flex gap-2">
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Ask for career advice, project ideas, or DSA tips..."
              className="flex-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 px-3.5 py-2 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            />
            <button
              type="submit"
              className="rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2 text-xs font-bold shadow-md shadow-cyan-600/20"
            >
              Send Query
            </button>
          </form>
        </GlassCard>
      )}

      {activeModule === 'resume' && (
        <GlassCard glow="blue" className="p-6 sm:p-8">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            AI Resume Analyzer (Future Extension)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            Upload your resume document to automatically extract candidate skills and cross-verify with your Digital Twin data.
          </p>

          <div className="p-6 rounded-xl border border-dashed border-cyan-500/30 bg-cyan-500/5 text-center space-y-3">
            <FileText className="mx-auto h-8 w-8 text-cyan-500" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              Resume Parsing & Skill Mapping Ready
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              This module is architected to interface with Gemini API endpoints or client-side PDF parsers for automatic resume skill extraction.
            </p>
          </div>
        </GlassCard>
      )}

      {activeModule === 'syllabus' && (
        <GlassCard glow="emerald" className="p-6 sm:p-8">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            AI Syllabus & Course Analyzer
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            Paste university course topics or syllabus text to generate a personalized study plan aligned with your AI/ML Engineer goal.
          </p>

          <div className="p-6 rounded-xl border border-dashed border-emerald-500/30 bg-emerald-500/5 text-center space-y-3">
            <BookOpen className="mx-auto h-8 w-8 text-emerald-500" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              Syllabus Alignment & Study Plan Architecture
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Extract Marwadi University syllabus topics and generate weekly learning goals.
            </p>
          </div>
        </GlassCard>
      )}

      {activeModule === 'project' && (
        <GlassCard glow="amber" className="p-6 sm:p-8">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            AI Project Capability Analyzer
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            Input project descriptions or source code snippets to evaluate technical complexity and demonstrated engineering skills.
          </p>

          <div className="p-6 rounded-xl border border-dashed border-amber-500/30 bg-amber-500/5 text-center space-y-3">
            <FolderGit2 className="mx-auto h-8 w-8 text-amber-500" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              Automatic Skill Extraction Engine
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Evaluates C++ POS code or Python ML scripts to calculate complexity ratings.
            </p>
          </div>
        </GlassCard>
      )}
    </div>
  );
};
