import React, { useState } from 'react';
import { Bot, Send, User, Sparkles, RefreshCw, AlertCircle, Compass, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { DigitalTwinState } from '../types';
import { calculateCareerReadiness } from '../services/scoringEngine';
import { useLanguage } from '../context/LanguageContext';
import { useSubscription } from '../context/SubscriptionContext';
import { UpgradeModal } from '../components/UpgradeModal';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface AICareerAssistantPageProps {
  state: DigitalTwinState;
  onNavigateToUpgrade?: () => void;
}

export const AICareerAssistantPage: React.FC<AICareerAssistantPageProps> = ({ state, onNavigateToUpgrade }) => {
  const { t, language } = useLanguage();
  const { canAccess, incrementAiUsage, remainingAiUsage } = useSubscription();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeGoal = state.careerGoals.find((g) => g.id === state.activeCareerGoalId) || state.careerGoals[0];
  const readiness = calculateCareerReadiness(
    state.profile,
    state.skills,
    state.projects,
    state.achievements,
    activeGoal,
    state.resumeChecklist
  );

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: `Hello Vangala Sricharan! 👋 I am your Gemini-powered AI Career Assistant. I have analyzed your Student Digital Twin data:\n\n• Current Readiness Score: ${readiness.overallScore}%\n• Target Role: ${activeGoal.title}\n• Active Projects: ${state.projects.length} (${state.projects.filter(p => p.status === 'Completed').length} completed)\n\nHow can I help guide your AI/ML engineering roadmap today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const quickPrompts = [
    'What should I learn next?',
    'Am I ready for an AI/ML internship?',
    'How can I improve my Digital Twin score?',
    'What projects should I build next?',
    'Create a 30-day AI/ML study roadmap for me.',
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    if (!canAccess('ai_assistant')) {
      setShowUpgradeModal(true);
      return;
    }

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);
    setError(null);

    try {
      incrementAiUsage();
      const res = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          language,
          context: {
            overallScore: readiness.overallScore,
            categoryScores: readiness.categoryScores,
            skillGaps: readiness.skillGaps,
            skills: state.skills.map((s) => ({ name: s.name, score: s.numericScore })),
            projects: state.projects.map((p) => ({ name: p.name, tech: p.technologies, status: p.status })),
            recommendations: readiness.recommendations,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch AI response');
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.response || 'No response returned from Gemini.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setError(err.message || 'AI Assistant is currently unavailable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        featureName="AI Career Assistant"
        onOpenUpgradePage={onNavigateToUpgrade}
      />

      {/* Header Banner */}
      <GlassCard className="p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {t('ai_assistant_title')}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  <Sparkles className="h-3 w-3" /> GEMINI AI
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {t('ai_assistant_subtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs font-medium text-slate-600 dark:text-slate-300">
            <Compass className="h-4 w-4 text-cyan-500" />
            <span>Daily AI Limit: {remainingAiUsage} remaining</span>
          </div>
        </div>
      </GlassCard>

      {/* Quick Prompt Chips */}
      <div className="flex flex-wrap gap-2">
        {quickPrompts.map((promptText, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(promptText)}
            disabled={loading}
            className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/30 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-white/10 transition-all text-left flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="h-3 w-3 text-cyan-500" />
            <span>{promptText}</span>
          </button>
        ))}
      </div>

      {/* Chat Conversation Area */}
      <GlassCard className="p-4 sm:p-6 min-h-[420px] flex flex-col justify-between">
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-500 border border-cyan-500/30 text-xs font-bold">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-br-none shadow-md shadow-cyan-500/10'
                    : 'bg-slate-100/80 dark:bg-white/5 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-white/10 rounded-bl-none'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1 text-[10px] opacity-70">
                  <span className="font-semibold">
                    {msg.sender === 'user' ? 'Vangala Sricharan' : 'Gemini AI Assistant'}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>
                <div>{msg.text}</div>
              </div>

              {msg.sender === 'user' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white border border-slate-300 dark:border-white/10 text-xs font-bold">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-slate-500 dark:text-slate-400 italic">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-500 animate-spin">
                <RefreshCw className="h-4 w-4" />
              </div>
              <span>Gemini is analyzing your Student Digital Twin context...</span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => handleSend(messages[messages.length - 1]?.text)}
                className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-xs font-semibold"
              >
                Retry
              </button>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-white/10 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && handleSend()}
            placeholder={t('ai_ask_placeholder')}
            disabled={loading}
            className="flex-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />

          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-cyan-500/10 shrink-0"
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
        </div>
      </GlassCard>
    </div>
  );
};
