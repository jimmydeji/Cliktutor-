import React, { useState } from 'react';
import { StudentProfile, SubjectId } from '../types';
import { SUBJECTS } from '../data/curriculum';
import { getSubjectStats, getStoredQuizHistory } from '../services/storage';
import { analyzeStudentWeaknesses } from '../services/aiService';
import {
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Zap,
  ArrowRight,
  Clock,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface AnalyticsViewProps {
  profile: StudentProfile;
  onOpenAiTutor: (prompt?: string) => void;
  onStartSubjectPractice: (subjectId: SubjectId) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  profile,
  onOpenAiTutor,
  onStartSubjectPractice,
}) => {
  const [isGeneratingAiPlan, setIsGeneratingAiPlan] = useState(false);
  const [aiDiagnosticReport, setAiDiagnosticReport] = useState<string | null>(null);

  const history = getStoredQuizHistory();
  const totalAttempted = history.reduce((sum, h) => sum + h.totalQuestions, 0);
  const totalCorrect = history.reduce((sum, h) => sum + h.score, 0);
  const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
  const totalMinutes = Math.round(history.reduce((sum, h) => sum + h.timeSpentSeconds, 0) / 60);

  const subjectStatsList = SUBJECTS.map(sub => getSubjectStats(sub.id));

  const handleGenerateAiDiagnostic = async () => {
    setIsGeneratingAiPlan(true);
    try {
      const missedQuestions = history
        .flatMap(h => h.answers.filter(a => !a.isCorrect))
        .slice(0, 10);

      const report = await analyzeStudentWeaknesses(
        profile,
        subjectStatsList.map(s => ({
          subject: s.subjectId,
          accuracy: s.accuracy,
          attempted: s.questionsAttempted,
          weakTopics: s.weakTopics,
        })),
        missedQuestions
      );

      setAiDiagnosticReport(report);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingAiPlan(false);
    }
  };

  return (
    <div className="space-y-4 pb-24 pt-2">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-teal-950 rounded-3xl border border-emerald-200 dark:border-emerald-500/30 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-1.5 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" />
            <span>Personalized Analytics</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30">
            {profile.grade} Science
          </span>
        </div>
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
          Performance & Weakness Monitor
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Tracking your progress against Nigerian WAEC, JAMB, and NECO curriculum benchmarks.
        </p>

        {/* Top 4 Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
          <div className="bg-white dark:bg-slate-950/70 rounded-2xl p-2.5 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Overall Accuracy</span>
            </div>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white block mt-1">{overallAccuracy}%</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">{totalCorrect} of {totalAttempted} right</span>
          </div>

          <div className="bg-white dark:bg-slate-950/70 rounded-2xl p-2.5 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center space-x-1.5 text-amber-600 dark:text-amber-400 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>Study Streak</span>
            </div>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white block mt-1">{profile.streakDays || 1} Days</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Active</span>
          </div>

          <div className="bg-white dark:bg-slate-950/70 rounded-2xl p-2.5 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center space-x-1.5 text-sky-600 dark:text-sky-400 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>Time Practiced</span>
            </div>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white block mt-1">{totalMinutes} Mins</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">{history.length} tests taken</span>
          </div>

          <div className="bg-white dark:bg-slate-950/70 rounded-2xl p-2.5 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center space-x-1.5 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 fill-indigo-500 text-indigo-500" />
              <span>Total Points</span>
            </div>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white block mt-1">{profile.xp || 0} XP</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Level {profile.level || 3}</span>
          </div>
        </div>
      </div>

      {/* AI Weakness Diagnostic & Targeted Material Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-emerald-500/30 p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
            <BrainCircuit className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>AI-Driven Weakness Diagnostic</span>
          </div>
          <button
            onClick={handleGenerateAiDiagnostic}
            disabled={isGeneratingAiPlan}
            className="text-[10px] font-bold px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center space-x-1 transition shadow-xs active:scale-95 cursor-pointer"
          >
            {isGeneratingAiPlan ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>Diagnosing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3" />
                <span>Run Diagnostic</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300">
          EasyTutor analyzes your recent tests across 1st, 2nd, and 3rd term questions to uncover blind spots and suggest high-yield WAEC/JAMB study materials.
        </p>

        {aiDiagnosticReport ? (
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
              {aiDiagnosticReport}
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => onOpenAiTutor('Can you give me practice questions specifically for my weak areas?')}
                className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 flex items-center space-x-1 cursor-pointer"
              >
                <span>Ask EasyTutor for Targeted Practice</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex items-center space-x-3 text-xs text-slate-600 dark:text-slate-400">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <span>
              Click <strong>"Run Diagnostic"</strong> above to let Gemini AI examine your accuracy trends and build a custom 14-day study schedule.
            </span>
          </div>
        )}
      </div>

      {/* Subject-by-Subject Mastery Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Subject Mastery Breakdown</h3>

        {subjectStatsList.map((stat) => {
          const subMeta = SUBJECTS.find(s => s.id === stat.subjectId)!;

          return (
            <div
              key={stat.subjectId}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 space-y-2.5 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">{subMeta.name}</h4>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {stat.questionsAttempted} Attempted • Last practiced: {stat.lastPracticed}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{stat.accuracy}%</span>
                  <span className="block text-[9px] text-slate-400">Accuracy</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                <div
                  className="bg-gradient-to-r from-emerald-600 to-teal-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${stat.accuracy}%` }}
                />
              </div>

              {/* Weak / Strong Topics */}
              <div className="flex items-center justify-between pt-1 text-[10px]">
                <div className="flex items-center space-x-1.5 flex-1 mr-2 overflow-hidden">
                  <span className="text-slate-500 shrink-0">Topics:</span>
                  {stat.weakTopics.length > 0 ? (
                    <span className="text-rose-700 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-300 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-900/60 truncate">
                      ⚠️ Needs work: {stat.weakTopics[0]}
                    </span>
                  ) : (
                    <span className="text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-900/60 truncate font-semibold">
                      ✅ Good foundational pace
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onStartSubjectPractice(stat.subjectId)}
                  className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 font-bold shrink-0 flex items-center space-x-0.5 cursor-pointer"
                >
                  <span>Practice</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
