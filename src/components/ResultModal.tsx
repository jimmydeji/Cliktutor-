import React, { useEffect, useState } from 'react';
import { QuizAttempt, Question, Badge } from '../types';
import { getQuestionById } from '../data/questionBank';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Clock,
  RotateCcw,
  Home,
  CheckCircle2,
  XCircle,
  Bot,
  Zap,
  Sparkles
} from 'lucide-react';

interface ResultModalProps {
  attempt: QuizAttempt;
  newlyUnlockedBadges?: Badge[];
  onRetake: () => void;
  onBackToHome: () => void;
  onAskAiAboutQuestion: (question: Question, selectedOption: string | null) => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  attempt,
  newlyUnlockedBadges = [],
  onRetake,
  onBackToHome,
  onAskAiAboutQuestion,
}) => {
  const [filter, setFilter] = useState<'all' | 'correct' | 'incorrect'>('all');

  useEffect(() => {
    if (attempt.percentage >= 65) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  }, [attempt.percentage]);

  const getWaecGrade = (pct: number) => {
    if (pct >= 75) return { grade: 'A1', label: 'Distinction (Excellent)', color: 'text-emerald-700 bg-emerald-50 border-emerald-300 dark:text-emerald-300 dark:bg-emerald-950 dark:border-emerald-700' };
    if (pct >= 70) return { grade: 'B2', label: 'Very Good', color: 'text-emerald-700 bg-emerald-50 border-emerald-300 dark:text-emerald-300 dark:bg-emerald-950 dark:border-emerald-800' };
    if (pct >= 65) return { grade: 'B3', label: 'Good', color: 'text-teal-700 bg-teal-50 border-teal-300 dark:text-teal-300 dark:bg-teal-950 dark:border-teal-800' };
    if (pct >= 60) return { grade: 'C4', label: 'Credit', color: 'text-sky-700 bg-sky-50 border-sky-300 dark:text-sky-300 dark:bg-sky-950 dark:border-sky-800' };
    if (pct >= 55) return { grade: 'C5', label: 'Credit', color: 'text-sky-700 bg-sky-50 border-sky-300 dark:text-sky-300 dark:bg-sky-950 dark:border-sky-800' };
    if (pct >= 50) return { grade: 'C6', label: 'Credit', color: 'text-amber-700 bg-amber-50 border-amber-300 dark:text-amber-300 dark:bg-amber-950 dark:border-amber-800' };
    if (pct >= 45) return { grade: 'D7', label: 'Pass', color: 'text-amber-700 bg-amber-50 border-amber-300 dark:text-amber-300 dark:bg-amber-950 dark:border-amber-900' };
    if (pct >= 40) return { grade: 'E8', label: 'Pass', color: 'text-orange-700 bg-orange-50 border-orange-300 dark:text-orange-300 dark:bg-orange-950 dark:border-orange-900' };
    return { grade: 'F9', label: 'Fail (Needs Revision)', color: 'text-rose-700 bg-rose-50 border-rose-300 dark:text-rose-300 dark:bg-rose-950 dark:border-rose-800' };
  };

  const waecGrade = getWaecGrade(attempt.percentage);
  const earnedXp = attempt.xpEarned || (attempt.score * 15);

  const minutes = Math.floor(attempt.timeSpentSeconds / 60);
  const seconds = attempt.timeSpentSeconds % 60;

  const filteredAnswers = attempt.answers.filter(ans => {
    if (filter === 'correct') return ans.isCorrect;
    if (filter === 'incorrect') return !ans.isCorrect;
    return true;
  });

  return (
    <div className="space-y-4 pb-24 pt-2">
      {/* Score Summary Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 text-center shadow-sm relative overflow-hidden">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/40 flex items-center justify-center mx-auto mb-3">
          <Trophy className="w-7 h-7" />
        </div>

        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Exam Session Completed!
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 capitalize mt-0.5">
          {attempt.paperTitle || `${attempt.subjectId} • ${attempt.term} • ${attempt.examType} Standard`}
        </p>

        {/* Big Score & WAEC Grade */}
        <div className="my-4 flex items-center justify-center space-x-4">
          <div>
            <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
              {attempt.percentage}%
            </span>
            <span className="block text-[11px] text-slate-500">
              {attempt.score} of {attempt.totalQuestions} Correct
            </span>
          </div>

          <div className="h-10 w-px bg-slate-200 dark:bg-slate-700" />

          <div className="text-left">
            <span className={`text-xl font-extrabold px-3 py-1 rounded-xl border ${waecGrade.color}`}>
              WAEC {waecGrade.grade}
            </span>
            <span className="block text-[11px] text-slate-600 dark:text-slate-400 mt-1">
              {waecGrade.label}
            </span>
          </div>
        </div>

        {/* Newly Unlocked Badges Banner */}
        {newlyUnlockedBadges.length > 0 && (
          <div className="mb-3 p-3 rounded-2xl bg-amber-50 border border-amber-300 dark:bg-amber-500/10 dark:border-amber-500/40 text-amber-800 dark:text-amber-300 text-xs text-left flex items-center space-x-2.5">
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0 animate-spin" />
            <div>
              <span className="font-extrabold block text-amber-800 dark:text-amber-400">New Achievement Unlocked!</span>
              <span className="text-[11px] text-amber-700 dark:text-amber-200">
                You earned the <strong>"{newlyUnlockedBadges[0].name}"</strong> badge!
              </span>
            </div>
          </div>
        )}

        {/* Quick Metrics */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-950/60 rounded-xl p-2 border border-slate-200 dark:border-slate-800 flex items-center justify-center space-x-1.5 text-xs text-slate-700 dark:text-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Time: {minutes}m {seconds}s</span>
          </div>
          <div className="bg-emerald-50 dark:bg-slate-950/60 rounded-xl p-2 border border-emerald-200 dark:border-slate-800 flex items-center justify-center space-x-1.5 text-xs text-emerald-800 dark:text-emerald-400 font-bold">
            <Zap className="w-3.5 h-3.5 fill-emerald-600 dark:fill-emerald-400 text-emerald-600" />
            <span>+{earnedXp} Points Added</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex space-x-2">
          <button
            onClick={onRetake}
            className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold text-xs flex items-center justify-center space-x-1 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Exam</span>
          </button>
          <button
            onClick={onBackToHome}
            className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-1 shadow-sm transition active:scale-95 cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>

      {/* Review Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Question Review</h3>
          {/* Filters */}
          <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setFilter('all')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                filter === 'all' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-500'
              }`}
            >
              All ({attempt.answers.length})
            </button>
            <button
              onClick={() => setFilter('correct')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                filter === 'correct' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' : 'text-slate-500'
              }`}
            >
              Correct ({attempt.score})
            </button>
            <button
              onClick={() => setFilter('incorrect')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                filter === 'incorrect' ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300' : 'text-slate-500'
              }`}
            >
              Missed ({attempt.totalQuestions - attempt.score})
            </button>
          </div>
        </div>

        {/* Answer Cards */}
        <div className="space-y-2.5">
          {filteredAnswers.map((ans, idx) => {
            const questionData = getQuestionById(ans.questionId);
            if (!questionData) return null;

            return (
              <div
                key={ans.questionId}
                className={`bg-white dark:bg-slate-900 rounded-2xl border p-3.5 space-y-2 transition shadow-2xs ${
                  ans.isCorrect
                    ? 'border-emerald-200 dark:border-emerald-900/50'
                    : 'border-rose-200 dark:border-rose-900/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Q{idx + 1}. {questionData.question}
                  </span>
                  {ans.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2 mt-0.5" />
                  )}
                </div>

                <div className="text-[11px] space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-500">Your Answer:</span>
                    <span className={`font-semibold ${ans.isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {ans.selectedOption ? `${ans.selectedOption}: ${questionData.options[ans.selectedOption as 'A' | 'B' | 'C' | 'D']}` : 'Skipped'}
                    </span>
                  </div>

                  {!ans.isCorrect && (
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-500">Correct:</span>
                      <span className="font-semibold text-emerald-600">
                        {questionData.correctOption}: {questionData.options[questionData.correctOption]}
                      </span>
                    </div>
                  )}
                </div>

                {/* Explanation */}
                <p className="text-[11px] text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 leading-relaxed">
                  {questionData.explanation}
                </p>

                {/* Ask AI Button */}
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => onAskAiAboutQuestion(questionData, ans.selectedOption)}
                    className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center space-x-1 transition cursor-pointer"
                  >
                    <Bot className="w-3 h-3" />
                    <span>Ask EasyTutor to Explain This</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
