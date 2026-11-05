import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { getStudentBadges } from '../services/storage';
import { getScholarLevel } from '../data/badges';
import {
  X,
  Award,
  Sparkles,
  Flame,
  Target,
  Trophy,
  Zap,
  Calculator,
  FlaskConical,
  Atom,
  Dna,
  BookOpen,
  GraduationCap,
  Lock,
  CheckCircle2,
} from 'lucide-react';

interface BadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
}

const iconMap: Record<string, React.ElementType> = {
  Sparkles,
  Flame,
  Award,
  Target,
  Trophy,
  Zap,
  Calculator,
  FlaskConical,
  Atom,
  Dna,
  BookOpen,
  GraduationCap,
};

export const BadgesModal: React.FC<BadgesModalProps> = ({ isOpen, onClose, profile }) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'streak' | 'mastery' | 'accuracy'>('all');

  if (!isOpen) return null;

  const badges = getStudentBadges(profile);
  const { currentLevel, nextLevel, progressPercent } = getScholarLevel(profile.xp || 0);

  const unlockedCount = badges.filter(b => b.isUnlocked).length;

  const filteredBadges = badges.filter(b => {
    if (filter === 'unlocked') return b.isUnlocked;
    if (filter === 'streak') return b.category === 'streak';
    if (filter === 'mastery') return b.category === 'mastery';
    if (filter === 'accuracy') return b.category === 'accuracy' || b.category === 'challenge';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden my-4">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-amber-500/20 via-emerald-500/10 to-teal-500/20 dark:from-amber-950/80 dark:via-slate-900 dark:to-emerald-950 p-5 border-b border-slate-200 dark:border-slate-800 relative">
          <button
            onClick={onClose}
            aria-label="Close Badges Modal"
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-1.5 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" />
            <span>Scholar Achievements & Levels</span>
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Gamified Badges</h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
            Earn XP, maintain study streaks, and master WAEC & JAMB science topics.
          </p>

          {/* Scholar Level Banner */}
          <div className="mt-4 p-3 rounded-2xl bg-white dark:bg-slate-950/70 border border-amber-300 dark:border-amber-500/30 shadow-xs">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-extrabold flex items-center justify-center text-xs">
                  {currentLevel.level}
                </span>
                <span className="font-extrabold text-slate-900 dark:text-white">{currentLevel.title}</span>
              </div>
              <span className="text-amber-700 dark:text-amber-400 font-bold">{profile.xp || 0} XP</span>
            </div>

            {/* Level Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1.5">
              <span>Perk: {currentLevel.perk}</span>
              {nextLevel ? (
                <span>Next: {nextLevel.title} ({nextLevel.minXp} XP)</span>
              ) : (
                <span className="text-amber-600 font-bold">Max Rank Reached! 👑</span>
              )}
            </div>
          </div>
        </div>

        {/* Badges Filter Bar */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
            Unlocked: <span className="text-emerald-600 dark:text-emerald-400">{unlockedCount}</span> / {badges.length}
          </span>

          <div className="flex space-x-1 overflow-x-auto scrollbar-none">
            {(['all', 'unlocked', 'streak', 'mastery', 'accuracy'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize transition cursor-pointer ${
                  filter === cat
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Badges Grid */}
        <div className="p-4 max-h-[420px] overflow-y-auto space-y-2.5">
          {filteredBadges.map((badge) => {
            const Icon = iconMap[badge.icon] || Award;
            const isUnlocked = badge.isUnlocked;

            return (
              <div
                key={badge.id}
                className={`p-3 rounded-2xl border transition flex items-center space-x-3.5 ${
                  isUnlocked
                    ? 'bg-emerald-50/60 dark:bg-slate-900/90 border-emerald-300 dark:border-emerald-500/40 shadow-xs ring-1 ring-emerald-300/30'
                    : 'bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-800/80 opacity-70'
                }`}
              >
                {/* Badge Icon */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                    isUnlocked
                      ? `bg-gradient-to-tr ${badge.color} text-white ring-2 ring-emerald-500/30`
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {isUnlocked ? <Icon className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <h4 className={`font-bold text-xs truncate ${isUnlocked ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                      {badge.name}
                    </h4>
                    {isUnlocked && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {badge.description}
                  </p>

                  {/* Progress bar if not unlocked */}
                  {!isUnlocked ? (
                    <div className="mt-1.5 flex items-center space-x-2">
                      <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full"
                          style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {badge.progress}/{badge.maxProgress}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 mt-1 block">
                      Unlocked & Active
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
