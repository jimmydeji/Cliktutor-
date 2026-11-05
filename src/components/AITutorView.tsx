import React, { useState, useEffect, useRef } from 'react';
import { StudentProfile, ChatMessage } from '../types';
import { askAiTutor, analyzeStudentWeaknesses } from '../services/aiService';
import { getStoredChatMessages, saveChatMessage, getStoredQuizHistory } from '../services/storage';
import {
  Bot,
  Send,
  User,
  BrainCircuit,
} from 'lucide-react';

interface AITutorViewProps {
  profile: StudentProfile;
  initialPrompt?: string;
  isOnline: boolean;
}

export const AITutorView: React.FC<AITutorViewProps> = ({
  profile,
  initialPrompt,
  isOnline,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = getStoredChatMessages();
    if (stored.length > 0) {
      setMessages(stored);
    } else {
      // Default welcome greeting
      const defaultGreeting: ChatMessage = {
        id: 'msg-welcome',
        role: 'assistant',
        content: `Hello ${profile.name ? profile.name.split(' ')[0] : 'Scholar'}! 🇳🇬 I am **EasyTutor**, your AI Academic Support for **${profile.grade} Science**.

I can help you with:
• **Step-by-step Math & Physics calculations**
• **Chemistry equations, organic mechanisms & the mole concept**
• **Biology physiological diagrams and genetics**
• **WAEC & JAMB English concord, lexis and oral stress patterns**
• **Analyzing your quiz weaknesses and suggesting targeted study notes**

What topic or question are you working on today?`,
        timestamp: new Date().toISOString(),
      };
      setMessages([defaultGreeting]);
      saveChatMessage(defaultGreeting);
    }
  }, [profile.name, profile.grade]);

  // Handle external initialPrompt (e.g. from Home or Quiz click)
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim() !== '') {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, activeAnalysis]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    saveChatMessage(userMsg);
    setInputText('');
    setIsLoading(true);

    try {
      const reply = await askAiTutor(
        newHistory.map(m => ({ role: m.role, content: m.content })),
        {
          name: profile.name,
          grade: profile.grade,
          schoolName: profile.schoolName,
          state: profile.state,
          lga: profile.lga,
        }
      );

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMsg]);
      saveChatMessage(assistantMsg);
    } catch (e: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `I could not connect to EasyTutor right now. Please check your connection or continue in offline practice mode.`,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunWeaknessDiagnosis = async () => {
    setIsLoading(true);
    setActiveAnalysis(null);

    const history = getStoredQuizHistory();
    const missedQuestions = history
      .flatMap(h => h.answers.filter(a => !a.isCorrect))
      .slice(0, 10);

    const report = await analyzeStudentWeaknesses(profile, { quizCount: history.length }, missedQuestions);
    setActiveAnalysis(report);
    setIsLoading(false);
  };

  const samplePrompts = [
    'How do I calculate the mole of a gas at s.t.p?',
    'Solve: A car accelerates from rest at 2.5 m/s² for 8s',
    'Explain the rule of concord for "neither... nor" in WAEC',
    'What are the differences between plant and animal cells?',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-md mx-auto">
      {/* Tutor Top Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-3 flex items-center justify-between rounded-t-3xl shadow-xs">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 flex items-center justify-center shadow-md shadow-emerald-500/20">
            <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[9px] flex items-center justify-center">
              <Bot className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center space-x-1">
              <span>EasyTutor AI</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                Gemini 3.8
              </span>
            </h3>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              {isOnline ? 'Online • Instant Step-by-Step' : 'Offline • Smart Curriculum Cache'}
            </span>
          </div>
        </div>

        {/* Diagnosis Trigger Button */}
        <button
          onClick={handleRunWeaknessDiagnosis}
          disabled={isLoading}
          className="text-[10px] font-bold px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 dark:hover:bg-emerald-900 border border-emerald-200 dark:border-emerald-700/60 flex items-center space-x-1 transition active:scale-95 cursor-pointer"
        >
          <BrainCircuit className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Analyze Weaknesses</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/70 dark:bg-slate-950/40">
        {/* If Active Weakness Diagnostic Report is open */}
        {activeAnalysis && (
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-500/40 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                <BrainCircuit className="w-4 h-4" />
                <span>AI Diagnostic Report & Targeted Study Plan</span>
              </div>
              <button
                onClick={() => setActiveAnalysis(null)}
                className="text-[10px] text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                Dismiss
              </button>
            </div>
            <div className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
              {activeAnalysis}
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-2 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 shadow-2xs'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-xs ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <span className={`block text-[9px] mt-1 ${isUser ? 'text-emerald-100' : 'text-slate-400'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start space-x-2">
            <div className="w-7 h-7 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-emerald-600">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-slate-600 dark:text-slate-400 flex items-center space-x-2 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-[11px] text-slate-500">EasyTutor is solving...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-3 py-1.5 bg-slate-100/80 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 overflow-x-auto flex space-x-1.5 scrollbar-none">
        {samplePrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(prompt)}
            disabled={isLoading}
            className="text-[10px] whitespace-nowrap bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-white px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700 transition cursor-pointer shadow-2xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-b-3xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask a question in Math, Physics, Chem, Bio, or English..."
            disabled={isLoading}
            className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="w-10 h-10 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white flex items-center justify-center shadow-sm active:scale-95 transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
