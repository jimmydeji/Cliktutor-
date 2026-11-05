import React, { useState } from 'react';
import { StudentProfile, GradeLevel } from '../types';
import { getLeaderboard } from '../services/storage';
import {
  Trophy,
  Zap,
  Search,
} from 'lucide-react';

interface LeaderboardViewProps {
  profile: StudentProfile;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ profile }) => {
  const [scope, setScope] = useState<'National' | 'State' | 'School'>('National');
  const [gradeFilter, setGradeFilter] = useState<GradeLevel | 'ALL'>('ALL');
  const [searchFilter, setSearchFilter] = useState('');

  const rawLeaderboard = getLeaderboard(scope, profile.state, profile.schoolName);

  const filteredLeaderboard = rawLeaderboard.filter(user => {
    if (gradeFilter !== 'ALL' && user.grade !== gradeFilter) return false;
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      const matchName = user.name.toLowerCase().includes(q);
      const matchSchool = user.schoolName.toLowerCase().includes(q);
      const matchState = user.state.toLowerCase().includes(q);
      if (!matchName && !matchSchool && !matchState) return false;
    }
    return true;
  });

  const currentUserRank = rawLeaderboard.find(u => u.isCurrentUser);
  const topThree = filteredLeaderboard.slice(0, 3);

  return (
    <div className="space-y-4 pb-24 pt-2">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-amber-500/15 via-emerald-500/10 to-teal-500/15 dark:from-amber-950/60 dark:via-slate-900 dark:to-emerald-950 p-4 border border-amber-500/30 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-1.5 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-0.5">
              <Trophy className="w-4 h-4" />
              <span>Real-Time Scholar Leaderboard</span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              National & State Rankings
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Compete with Nigerian secondary science students across 36 states and FCT.
            </p>
          </div>

          {currentUserRank && (
            <div className="text-right shrink-0 bg-white dark:bg-slate-900/90 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] text-slate-500 block font-medium">Your Rank</span>
              <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">#{currentUserRank.rank}</span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 block font-bold">{currentUserRank.xp} XP</span>
            </div>
          )}
        </div>
      </div>

      {/* Scope Switcher: National, State, School */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
        {(['National', 'State', 'School'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setScope(s)}
            className={`py-2 text-center rounded-xl text-xs font-bold transition cursor-pointer ${
              scope === s
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            {s === 'State' ? `${profile.state || 'State'}` : s}
          </button>
        ))}
      </div>

      {/* Class Level Filters */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
        {(['ALL', 'SS1', 'SS2', 'SS3'] as const).map((g) => (
          <button
            key={g}
            onClick={() => setGradeFilter(g)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              gradeFilter === g
                ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {g === 'ALL' ? 'All Classes' : `${g} Science`}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder="Search by student, school or state..."
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Top 3 Podium (If available) */}
      {topThree.length >= 3 && !searchFilter && (
        <div className="grid grid-cols-3 gap-2 pt-2 items-end">
          {/* 2nd Place */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 p-3 text-center relative flex flex-col items-center shadow-xs">
            <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-extrabold text-xs flex items-center justify-center mb-1">
              2
            </span>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-300 to-slate-100 text-slate-800 font-bold flex items-center justify-center text-xs mb-1.5 overflow-hidden">
              {topThree[1].isCurrentUser && profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                topThree[1].name.slice(0, 1)
              )}
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{topThree[1].name}</span>
            <span className="text-[10px] text-slate-500 line-clamp-1">{topThree[1].state}</span>
            <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 mt-1">{topThree[1].xp} XP</span>
          </div>

          {/* 1st Place */}
          <div className="bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/50 dark:to-slate-900 rounded-2xl border border-amber-300 dark:border-amber-500/40 p-3.5 text-center relative flex flex-col items-center -mt-3 shadow-sm">
            <span className="w-7 h-7 rounded-full bg-amber-400 text-amber-950 font-extrabold text-xs flex items-center justify-center mb-1 shadow-xs">
              👑
            </span>
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 text-amber-950 font-bold flex items-center justify-center text-sm mb-1.5 ring-2 ring-amber-400/50 overflow-hidden">
              {topThree[0].isCurrentUser && profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                topThree[0].name.slice(0, 1)
              )}
            </div>
            <span className="text-xs font-extrabold text-slate-900 dark:text-white line-clamp-1">{topThree[0].name}</span>
            <span className="text-[10px] text-amber-700 dark:text-amber-400 line-clamp-1">{topThree[0].state}</span>
            <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 mt-1">{topThree[0].xp} XP</span>
          </div>

          {/* 3rd Place */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 p-3 text-center relative flex flex-col items-center shadow-xs">
            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-extrabold text-xs flex items-center justify-center mb-1">
              3
            </span>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-white font-bold flex items-center justify-center text-xs mb-1.5 overflow-hidden">
              {topThree[2].isCurrentUser && profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                topThree[2].name.slice(0, 1)
              )}
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{topThree[2].name}</span>
            <span className="text-[10px] text-slate-500 line-clamp-1">{topThree[2].state}</span>
            <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 mt-1">{topThree[2].xp} XP</span>
          </div>
        </div>
      )}

      {/* Leaderboard List */}
      <div className="space-y-2">
        {filteredLeaderboard.map((user) => {
          const isUser = user.isCurrentUser;

          return (
            <div
              key={user.id}
              className={`rounded-2xl p-3 border flex items-center justify-between transition ${
                isUser
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 shadow-xs ring-1 ring-emerald-400/50'
                  : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={`w-6 text-center font-extrabold text-xs ${
                  user.rank === 1 ? 'text-amber-600' : user.rank === 2 ? 'text-slate-500' : user.rank === 3 ? 'text-amber-700' : 'text-slate-400'
                }`}>
                  #{user.rank}
                </span>

                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold overflow-hidden shrink-0 ${
                  isUser ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                }`}>
                  {isUser && profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name.slice(0, 1)
                  )}
                </div>

                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className={`font-bold text-xs ${
                      isUser
                        ? 'text-emerald-800 dark:text-emerald-300'
                        : 'text-slate-900 dark:text-white'
                    }`}>
                      {user.name} {isUser && '(You)'}
                    </span>
                    <span className="text-[9px] px-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                      {user.grade}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 block">
                    {user.schoolName} • {user.state}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="flex items-center space-x-1 text-xs font-extrabold text-amber-600 dark:text-amber-400">
                  <span>{user.xp} XP</span>
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                  {user.accuracy}% Acc
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
