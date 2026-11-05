import React from 'react';
import { StudentProfile } from '../types';
import { useTheme } from '../context/ThemeContext';
import { getScholarLevel } from '../data/badges';
import { getTrialStatus } from '../services/storage';
import { Wifi, WifiOff, User, BookOpen, Sun, Moon, Lock, Crown, Clock } from 'lucide-react';

interface HeaderProps {
  profile: StudentProfile;
  isOnline: boolean;
  onToggleOnline: () => void;
  onOpenProfile: () => void;
  onOpenBadges: () => void;
  onOpenPayment: () => void;
  onOpenAdmin?: () => void;
  onGradeChange: (grade: 'SS1' | 'SS2' | 'SS3') => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  isOnline,
  onToggleOnline,
  onOpenProfile,
  onOpenPayment,
  onOpenAdmin,
  onGradeChange,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { currentLevel } = getScholarLevel(profile.xp || 0);
  const trialStatus = getTrialStatus(profile);

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3 py-2.5 transition-colors shadow-xs">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Brand & Class Switcher */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 flex items-center justify-center shadow-md shadow-emerald-500/15">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[9px] flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
                Clik<span className="text-emerald-600 dark:text-emerald-400">Tutor</span>
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Lvl {currentLevel.level}
              </span>
            </div>
            {/* Quick Grade Dropdown */}
            <div className="flex items-center text-[11px] text-slate-500 dark:text-slate-400">
              <span className="mr-1">Class:</span>
              <select
                value={profile.grade}
                onChange={(e) => onGradeChange(e.target.value as any)}
                aria-label="Select Senior Secondary Class"
                className="bg-transparent text-emerald-600 dark:text-emerald-400 font-bold focus:outline-none cursor-pointer py-0 text-[11px]"
              >
                <option value="SS1" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">SS1 Science</option>
                <option value="SS2" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">SS2 Science</option>
                <option value="SS3" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">SS3 Science</option>
              </select>
            </div>
          </div>
        </div>

        {/* Top Right Controls */}
        <div className="flex items-center space-x-1.5">
          {profile.email?.toLowerCase() === 'jimmydeji@gmail.com' && (
            <button
              onClick={onOpenAdmin}
              className="p-1.5 rounded-xl bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-[10px] font-bold cursor-pointer transition active:scale-95"
            >
              Admin
            </button>
          )}
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition active:scale-95"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-slate-600" />
            )}
          </button>

          {/* 5-Day Trial / Full Access Status Pill */}
          <button
            onClick={onOpenPayment}
            title={profile.isPremium ? 'Full Access Unlocked' : `${trialStatus.daysRemaining} days left of free trial`}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-[10px] font-bold border transition active:scale-95 shadow-2xs ${
              profile.isPremium
                ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700'
                : trialStatus.isTrialActive
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700'
                : 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700 animate-pulse'
            }`}
          >
            {profile.isPremium ? (
              <>
                <Crown className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span>Full Access</span>
              </>
            ) : trialStatus.isTrialActive ? (
              <>
                <Clock className="w-3 h-3 text-amber-500" />
                <span>Trial: {trialStatus.daysRemaining}d left</span>
              </>
            ) : (
              <>
                <Lock className="w-3 h-3 text-rose-500" />
                <span>Unlock Full</span>
              </>
            )}
          </button>

          {/* Offline/Online toggle pill */}
          <button
            onClick={onToggleOnline}
            title={isOnline ? 'Online mode active (Click to simulate offline)' : 'Offline mode active (Click to switch to online)'}
            className={`flex items-center space-x-1 text-[10px] font-medium p-1.5 rounded-xl border transition-colors ${
              isOnline
                ? 'bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-slate-700'
                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700'
            }`}
          >
            {isOnline ? (
              <Wifi className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            )}
          </button>

          {/* Profile Trigger */}
          <button
            onClick={onOpenProfile}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold shadow-xs hover:ring-2 hover:ring-emerald-400/50 transition-all shrink-0 cursor-pointer overflow-hidden border border-emerald-400/40"
            title={`${profile.name} (${profile.schoolName}) - Click to edit profile & photo`}
          >
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
            ) : profile.name ? (
              profile.name.slice(0, 1).toUpperCase()
            ) : (
              <User className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
