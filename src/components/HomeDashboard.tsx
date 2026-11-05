import React, { useState } from 'react';
import { StudentProfile, SubjectId, Term, ExamType, GradeLevel } from '../types';
import { SUBJECTS, NERDC_CURRICULUM } from '../data/curriculum';
import { getSubjectTotalCount, getAvailableYears } from '../data/questionBank';
import { TIMED_CHALLENGES } from '../data/challenges';
import { getScholarLevel } from '../data/badges';
import {
  Calculator,
  BookOpen,
  Atom,
  FlaskConical,
  Dna,
  Play,
  Flame,
  Award,
  Zap,
  Bot,
  ArrowRight,
  Timer,
  Trophy,
  Calendar,
  GraduationCap,
  User,
} from 'lucide-react';
import { CheatSheetModal } from './CheatSheetModal';

interface HomeDashboardProps {
  profile: StudentProfile;
  onStartPractice: (
    subjectId: SubjectId,
    term?: Term | 'All Terms',
    examType?: ExamType,
    year?: number,
    questionCount?: number,
    timeLimitSeconds?: number,
    challengeTitle?: string,
    topic?: string,
    autoStart?: boolean
  ) => void;
  onOpenAiTutor: (initialPrompt?: string) => void;
  onOpenLeaderboard: () => void;
  onOpenBadges: () => void;
  onOpenProfile?: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  Calculator,
  BookOpen,
  Atom,
  FlaskConical,
  Dna,
  Zap,
  Flame,
  Award,
  Timer,
  GraduationCap: Award,
};

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  profile,
  onStartPractice,
  onOpenAiTutor,
  onOpenLeaderboard,
  onOpenBadges,
  onOpenProfile,
}) => {
  const terms: (Term | 'All Terms')[] = ['All Terms', '1st Term', '2nd Term', '3rd Term'];
  const [selectedTerm, setSelectedTerm] = useState<Term | 'All Terms'>('All Terms');

  // Year Past Paper selection state (2006 to 2026)
  const availableYears = getAvailableYears(); // 2026 down to 2006
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [selectedPaperExam, setSelectedPaperExam] = useState<'WAEC' | 'JAMB' | 'NECO'>('WAEC');
  const [selectedPaperSubject, setSelectedPaperSubject] = useState<SubjectId>('mathematics');
  const [cheatSheetSubject, setCheatSheetSubject] = useState<SubjectId | null>(null);
  const [topicSubject, setTopicSubject] = useState<SubjectId | null>(null);
  const [topicGrade, setTopicGrade] = useState<GradeLevel | null>(null);
  const [topicSelection, setTopicSelection] = useState<string | null>(null);

  const { currentLevel, nextLevel, progressPercent } = getScholarLevel(profile.xp || 0);

  return (
    <div className="space-y-4 pb-24 pt-2">
      {/* Student Welcome & Gamification Level Banner (Light/Bright emerald gradient) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 dark:from-emerald-950 dark:via-slate-900 dark:to-teal-950 p-5 border border-emerald-400/30 dark:border-emerald-500/20 shadow-lg text-white">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-36 h-36 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/20 dark:bg-emerald-500/20 border border-white/30 dark:border-emerald-500/30 text-[11px] font-bold text-white dark:text-emerald-300">
              <span>🇳🇬 NERDC Curriculum Compliant</span>
            </div>
            <span className="text-[11px] text-emerald-100 dark:text-slate-300 font-semibold">{profile.grade} Science</span>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              {/* Student Photo */}
              <button
                type="button"
                onClick={onOpenProfile}
                className="w-12 h-12 rounded-full border-2 border-white/40 bg-white/20 overflow-hidden flex items-center justify-center shrink-0 shadow-md hover:scale-105 transition cursor-pointer"
                title="Click to view & edit student profile photo"
              >
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-extrabold text-base">
                    {profile.name ? profile.name.slice(0, 1).toUpperCase() : <User className="w-6 h-6" />}
                  </span>
                )}
              </button>

              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center space-x-1.5">
                  <span>Welcome back, {profile.name ? profile.name.split(' ')[0] : 'Scholar'}!</span>
                  <span>👋</span>
                </h1>
                <p className="text-xs text-emerald-100/90 mt-0.5 line-clamp-1">
                  {profile.schoolName || 'Senior Secondary School'} • {profile.lga}, {profile.state}
                </p>
              </div>
            </div>

            {/* Level Badge Trigger */}
            <button
              onClick={onOpenBadges}
              className="bg-black/20 hover:bg-black/30 dark:bg-slate-950/60 dark:hover:bg-slate-900/80 px-2.5 py-1.5 rounded-xl border border-white/25 dark:border-amber-500/40 text-right transition cursor-pointer shrink-0"
            >
              <div className="flex items-center space-x-1 text-amber-200 dark:text-amber-400 font-extrabold text-xs">
                <Trophy className="w-3.5 h-3.5 fill-amber-200 dark:fill-amber-400" />
                <span>Level {currentLevel.level}</span>
              </div>
              <span className="text-[9px] text-emerald-100 dark:text-slate-300 block">{currentLevel.title}</span>
            </button>
          </div>

          {/* Aspirations & Guardian Summary */}
          {(profile.targetUniversity || profile.proposedCourse || profile.parentName) && (
            <div className="mt-2.5 pt-2 border-t border-white/20 flex flex-wrap items-center justify-between gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={onOpenProfile}
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/25 transition cursor-pointer"
                title="Click to update university aspirations and parent details"
              >
                <GraduationCap className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="font-semibold line-clamp-1">
                  Target: {profile.proposedCourse || 'Science Degree'} {profile.targetUniversity ? `@ ${profile.targetUniversity}` : ''}
                </span>
              </button>

              {profile.parentName && (
                <span className="text-[10px] text-emerald-100/90 font-medium">
                  Guardian: {profile.parentName}
                </span>
              )}
            </div>
          )}

          {/* Gamification Progress Bar */}
          <div className="mt-3 pt-2 border-t border-white/20 dark:border-slate-800/60">
            <div className="flex items-center justify-between text-[10px] text-emerald-100 dark:text-slate-300 mb-1">
              <span>XP to {nextLevel?.title || 'Max Rank'}:</span>
              <span className="font-bold text-white dark:text-amber-300">{profile.xp || 0} / {nextLevel?.minXp || '8000+'} XP</span>
            </div>
            <div className="w-full bg-black/25 dark:bg-slate-950/70 h-2 rounded-full overflow-hidden border border-white/20 dark:border-slate-800">
              <div
                className="bg-gradient-to-r from-amber-300 to-white dark:from-amber-400 dark:to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-2">
            <div className="bg-black/20 dark:bg-slate-950/50 rounded-xl p-2 text-center border border-white/15 dark:border-slate-800/60">
              <div className="flex items-center justify-center space-x-1 text-amber-200 dark:text-amber-400 text-xs font-bold">
                <Flame className="w-3.5 h-3.5 fill-amber-200 dark:fill-amber-400" />
                <span>{profile.streakDays || 1}d Streak</span>
              </div>
              <span className="text-[9px] text-emerald-100 dark:text-slate-300 block mt-0.5">Study Focus</span>
            </div>

            <div
              onClick={onOpenBadges}
              className="bg-black/20 hover:bg-black/30 dark:bg-slate-950/50 dark:hover:bg-slate-900 rounded-xl p-2 text-center border border-white/15 dark:border-slate-800/60 cursor-pointer transition"
            >
              <div className="flex items-center justify-center space-x-1 text-emerald-100 dark:text-emerald-400 text-xs font-bold">
                <Award className="w-3.5 h-3.5" />
                <span>{(profile.unlockedBadgeIds || []).length} Badges</span>
              </div>
              <span className="text-[9px] text-emerald-100 dark:text-slate-300 block mt-0.5">Showcase</span>
            </div>

            <div
              onClick={onOpenLeaderboard}
              className="bg-black/20 hover:bg-black/30 dark:bg-slate-950/50 dark:hover:bg-slate-900 rounded-xl p-2 text-center border border-white/15 dark:border-slate-800/60 cursor-pointer transition"
            >
              <div className="flex items-center justify-center space-x-1 text-teal-100 dark:text-teal-400 text-xs font-bold">
                <Trophy className="w-3.5 h-3.5" />
                <span>Rankings</span>
              </div>
              <span className="text-[9px] text-emerald-100 dark:text-slate-300 block mt-0.5">Live Board</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timed Challenges Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Timer className="w-4 h-4 text-amber-600 dark:text-amber-500" />
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Timed Challenges & Speed Quizzes
            </h3>
          </div>
          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
            Bonus Points
          </span>
        </div>

        {/* Horizontal Scrollable Challenges Carousel */}
        <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none">
          {TIMED_CHALLENGES.map((ch) => {
            const Icon = iconMap[ch.iconName] || Zap;

            return (
              <div
                key={ch.id}
                onClick={() => {
                  const sub = ch.subjectId === 'any' ? 'mathematics' : ch.subjectId;
                    onStartPractice(
                      sub,
                      'All Terms',
                      ch.examType,
                      ch.year,
                      ch.questionCount,
                      ch.timeLimitSeconds,
                      ch.title,
                      undefined,
                      false
                    );
                }}
                className="w-64 shrink-0 bg-white dark:bg-slate-800/90 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500/50 transition cursor-pointer shadow-xs group relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                      {ch.badgeLabel}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-amber-400 transition">
                    {ch.title}
                  </h4>
                  <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 block mt-0.5">
                    ⏱️ {ch.subtitle}
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {ch.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <span>Start Challenge</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Revision Cheat Sheets Section */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200 dark:border-slate-700 p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Quick Revision Cheat Sheets
            </h3>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/30">
            Formulas & Concepts
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Access essential formulas, core concepts, and quick-reference summaries for all science subjects to boost your revision.
        </p>

        <div className="grid grid-cols-2 gap-2">
            {SUBJECTS.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setCheatSheetSubject(sub.id)}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 text-left transition cursor-pointer"
            >
              <span className="font-extrabold text-xs text-slate-900 dark:text-white block">
                {sub.name}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">View Sheet</span>
            </button>
          ))}
        </div>
      </div>

      <CheatSheetModal
        isOpen={!!cheatSheetSubject}
        onClose={() => setCheatSheetSubject(null)}
        subjectId={cheatSheetSubject || 'mathematics'}
      />

      {/* Practice by Topic Section */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200 dark:border-slate-700 p-4 space-y-3 shadow-xs">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Practice by Topic</h3>
        
        {!topicSubject ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SUBJECTS.map(sub => (
                    <button key={sub.id} onClick={() => setTopicSubject(sub.id)} className="p-3 bg-emerald-600 text-white rounded-xl text-xs font-extrabold hover:bg-emerald-700 transition">{sub.name}</button>
                ))}
            </div>
        ) : !topicGrade ? (
            <div className="space-y-2">
                <button onClick={() => setTopicSubject(null)} className="text-xs text-emerald-600 font-bold underline">← Back to Subjects</button>
                <div className="grid grid-cols-3 gap-2">
                    {(['SS1', 'SS2', 'SS3'] as GradeLevel[]).map(grade => (
                        <button key={grade} onClick={() => setTopicGrade(grade)} className="p-3 bg-emerald-600 text-white rounded-xl text-xs font-extrabold hover:bg-emerald-700 transition">{grade}</button>
                    ))}
                </div>
            </div>
        ) : !topicSelection ? (
            <div className="space-y-2">
                <button onClick={() => setTopicGrade(null)} className="text-xs text-emerald-600 font-bold underline">← Back to Classes</button>
                <div className="max-h-60 overflow-y-auto space-y-1">
                    {(NERDC_CURRICULUM[topicSubject]?.[topicGrade] ? Object.values(NERDC_CURRICULUM[topicSubject][topicGrade]).flat() : []).map(topic => (
                        <button key={topic} onClick={() => setTopicSelection(topic)} className="w-full text-left p-3 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-200 border-b border-emerald-100 dark:border-slate-700 transition">{topic}</button>
                    ))}
                </div>
            </div>
        ) : (
            <div className="space-y-3">
                <button onClick={() => setTopicSelection(null)} className="text-xs text-emerald-600 font-bold underline">← Back to Topics</button>
                <p className="text-xs font-extrabold text-emerald-900 dark:text-emerald-100 bg-emerald-100 dark:bg-emerald-900/50 p-3 rounded-lg border border-emerald-200">Selected: {topicSelection}</p>
                <div className="grid grid-cols-3 gap-2">
                    {[50, 100, 200].map(count => (
                        <button key={count} onClick={() => {
                            console.log('Starting practice with topic:', topicSelection);
                            onStartPractice(topicSubject, 'All Terms', 'WAEC', 2025, count, count * 60, `Topic Practice: ${topicSelection}`, topicSelection || undefined, true);
                        }} className="p-3 bg-emerald-600 text-white rounded-xl text-xs font-extrabold hover:bg-emerald-700 transition">{count} MCQs</button>
                    ))}
                </div>
            </div>
        )}
      </div>

      {/* Term Selector Filter */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Curriculum Term Selection</h3>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">NERDC Standards</span>
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {terms.map((term) => (
            <button
              key={term}
              onClick={() => setSelectedTerm(term)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedTerm === term
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {term}
            </button>
          ))}
        </div>
      </div>


      {/* AI Academic Support Feature Card */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-700 to-indigo-800 dark:from-emerald-950 dark:via-slate-900 dark:to-indigo-950 p-4 border border-emerald-400/30 text-white shadow-sm">
        <div className="flex items-center space-x-2 text-emerald-200 text-xs font-bold mb-1">
          <Bot className="w-4 h-4" />
          <span>EasyTutor AI Academic Support</span>
        </div>
        <h4 className="font-extrabold text-sm text-white">Stuck on a Math or Science calculation?</h4>
        <p className="text-xs text-emerald-100/90 mt-1">
          Our Gemini-powered AI Tutor provides step-by-step working, explains difficult organic chemistry mechanisms, and analyzes your weaknesses.
        </p>
        <div className="mt-3 flex items-center space-x-2">
          <button
            onClick={() => onOpenAiTutor('Can you explain Stoichiometry and the Mole Concept step by step?')}
            className="flex-1 py-2 px-3 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs flex items-center justify-center space-x-1 transition shadow-xs cursor-pointer"
          >
            <span>Ask EasyTutor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onOpenAiTutor('Diagnose my recent test weaknesses and give me a targeted 14-day study plan.')}
            className="py-2 px-3 rounded-xl bg-black/20 hover:bg-black/30 text-white font-semibold text-xs border border-white/20 transition cursor-pointer"
          >
            Diagnose Weaknesses
          </button>
        </div>
      </div>
      
      <div className="pt-6 pb-6 text-center">
          <p className="text-xs text-slate-500 font-medium">Customer Care</p>
          <a href="tel:08036151691" className="text-sm font-bold text-emerald-600 hover:underline">
            08036151691
          </a>
          <p className="text-[10px] text-slate-400 mt-1">WhatsApp & Call Available</p>
      </div>
    </div>
  );
};
