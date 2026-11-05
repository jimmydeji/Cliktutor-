import { Badge, StudentProfile, QuizAttempt, SubjectId } from '../types';

export const ALL_BADGES: Omit<Badge, 'progress' | 'isUnlocked'>[] = [
  {
    id: 'badge_first_win',
    name: 'First Blood Scholar',
    description: 'Answer your first exam question correctly',
    category: 'milestone',
    icon: 'Sparkles',
    color: 'from-amber-400 to-yellow-600',
    maxProgress: 1,
  },
  {
    id: 'badge_streak_3',
    name: 'Ignited Flame',
    description: 'Maintain a 3-day continuous study streak',
    category: 'streak',
    icon: 'Flame',
    color: 'from-orange-500 to-amber-600',
    maxProgress: 3,
  },
  {
    id: 'badge_streak_7',
    name: 'Weekly Titan',
    description: 'Maintain a 7-day continuous study streak',
    category: 'streak',
    icon: 'Flame',
    color: 'from-rose-500 to-red-600',
    maxProgress: 7,
  },
  {
    id: 'badge_streak_14',
    name: 'Unstoppable Habit',
    description: 'Maintain a 14-day continuous study streak',
    category: 'streak',
    icon: 'Flame',
    color: 'from-purple-500 to-indigo-600',
    maxProgress: 14,
  },
  {
    id: 'badge_centurion_100',
    name: 'The Centurion',
    description: 'Complete 100 exam practice questions',
    category: 'milestone',
    icon: 'Award',
    color: 'from-emerald-400 to-teal-600',
    maxProgress: 100,
  },
  {
    id: 'badge_marksman_90',
    name: 'Sharp Shooter',
    description: 'Score 90% or above in any 40-MCQ mock exam',
    category: 'accuracy',
    icon: 'Target',
    color: 'from-sky-400 to-blue-600',
    maxProgress: 1,
  },
  {
    id: 'badge_perfect_waec',
    name: 'WAEC A1 Alpha',
    description: 'Score 100% on a full timed exam practice session',
    category: 'accuracy',
    icon: 'Trophy',
    color: 'from-amber-400 to-yellow-500',
    maxProgress: 1,
  },
  {
    id: 'badge_speed_blitz',
    name: 'Speed Lightning',
    description: 'Complete a timed challenge with over 60 seconds to spare',
    category: 'challenge',
    icon: 'Zap',
    color: 'from-yellow-400 to-amber-500',
    maxProgress: 1,
  },
  {
    id: 'badge_maths_virtuoso',
    name: 'Pythagoras Heir',
    description: 'Answer 30 Mathematics questions correctly',
    category: 'mastery',
    icon: 'Calculator',
    color: 'from-amber-500 to-orange-600',
    maxProgress: 30,
  },
  {
    id: 'badge_chem_alchemist',
    name: 'Alchemist Supreme',
    description: 'Answer 30 Chemistry questions correctly',
    category: 'mastery',
    icon: 'FlaskConical',
    color: 'from-emerald-500 to-teal-600',
    maxProgress: 30,
  },
  {
    id: 'badge_physics_dynamo',
    name: 'Newtonian Prodigy',
    description: 'Answer 30 Physics questions correctly',
    category: 'mastery',
    icon: 'Atom',
    color: 'from-indigo-500 to-violet-600',
    maxProgress: 30,
  },
  {
    id: 'badge_bio_conqueror',
    name: 'Mendel Disciple',
    description: 'Answer 30 Biology questions correctly',
    category: 'mastery',
    icon: 'Dna',
    color: 'from-rose-500 to-pink-600',
    maxProgress: 30,
  },
  {
    id: 'badge_english_rhetoric',
    name: 'Grammar Virtuoso',
    description: 'Answer 30 English Language questions correctly',
    category: 'mastery',
    icon: 'BookOpen',
    color: 'from-blue-500 to-cyan-600',
    maxProgress: 30,
  },
  {
    id: 'badge_jamb_300',
    name: 'JAMB 300+ Club',
    description: 'Achieve distinction level across 3 CBT mock exams',
    category: 'challenge',
    icon: 'GraduationCap',
    color: 'from-teal-400 to-emerald-700',
    maxProgress: 3,
  },
];

export interface ScholarLevel {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
  perk: string;
}

export const SCHOLAR_LEVELS: ScholarLevel[] = [
  { level: 1, title: 'Science Novice', minXp: 0, maxXp: 299, perk: 'Basic Question Access' },
  { level: 2, title: 'Curious Apprentice', minXp: 300, maxXp: 699, perk: 'Unlocked Daily Speed Drills' },
  { level: 3, title: 'Junior Scientist', minXp: 700, maxXp: 1499, perk: '1.2x Streak XP Multiplier' },
  { level: 4, title: 'Senior Science Scholar', minXp: 1500, maxXp: 2999, perk: 'Unlocked JAMB 40-MCQ Sprints' },
  { level: 5, title: 'Distinction Master', minXp: 3000, maxXp: 4999, perk: '1.5x Multiplier & Elite Rank' },
  { level: 6, title: 'WAEC Laureate', minXp: 5000, maxXp: 7999, perk: 'Gold Shield & National Podium' },
  { level: 7, title: 'National Olympiad Champion', minXp: 8000, maxXp: 99999, perk: 'Legendary Status' },
];

export function getScholarLevel(xp: number): {
  currentLevel: ScholarLevel;
  nextLevel: ScholarLevel | null;
  progressPercent: number;
} {
  const currentLevel = SCHOLAR_LEVELS.slice().reverse().find(l => xp >= l.minXp) || SCHOLAR_LEVELS[0];
  const nextLevel = SCHOLAR_LEVELS.find(l => l.level === currentLevel.level + 1) || null;

  if (!nextLevel) {
    return { currentLevel, nextLevel: null, progressPercent: 100 };
  }

  const range = nextLevel.minXp - currentLevel.minXp;
  const progress = xp - currentLevel.minXp;
  const progressPercent = Math.min(100, Math.max(0, Math.round((progress / range) * 100)));

  return { currentLevel, nextLevel, progressPercent };
}

export function evaluateBadges(
  profile: StudentProfile,
  history: QuizAttempt[]
): { badges: Badge[]; newlyUnlocked: Badge[] } {
  const unlockedIds = new Set(profile.unlockedBadgeIds || []);
  const newlyUnlocked: Badge[] = [];

  // Compute metrics
  const totalAttempted = history.reduce((sum, h) => sum + h.totalQuestions, 0);
  const totalCorrect = history.reduce((sum, h) => sum + h.score, 0);
  const streak = profile.streakDays || 1;

  const subjectCorrectMap: Record<SubjectId, number> = {
    mathematics: 0,
    english: 0,
    physics: 0,
    chemistry: 0,
    biology: 0,
  };

  let has90Percent40Mcq = false;
  let hasPerfectScore = false;
  let distinctionCount = 0;

  for (const h of history) {
    if (h.percentage >= 75) distinctionCount++;
    if (h.totalQuestions >= 40 && h.percentage >= 90) has90Percent40Mcq = true;
    if (h.percentage === 100 && h.totalQuestions >= 5) hasPerfectScore = true;

    for (const ans of h.answers) {
      if (ans.isCorrect && h.subjectId) {
        subjectCorrectMap[h.subjectId] = (subjectCorrectMap[h.subjectId] || 0) + 1;
      }
    }
  }

  const evaluatedBadges: Badge[] = ALL_BADGES.map((b) => {
    let progress = 0;
    let isUnlocked = unlockedIds.has(b.id);

    switch (b.id) {
      case 'badge_first_win':
        progress = totalCorrect > 0 ? 1 : 0;
        break;
      case 'badge_streak_3':
        progress = Math.min(streak, 3);
        break;
      case 'badge_streak_7':
        progress = Math.min(streak, 7);
        break;
      case 'badge_streak_14':
        progress = Math.min(streak, 14);
        break;
      case 'badge_centurion_100':
        progress = Math.min(totalAttempted, 100);
        break;
      case 'badge_marksman_90':
        progress = has90Percent40Mcq ? 1 : 0;
        break;
      case 'badge_perfect_waec':
        progress = hasPerfectScore ? 1 : 0;
        break;
      case 'badge_speed_blitz':
        progress = isUnlocked ? 1 : 0;
        break;
      case 'badge_maths_virtuoso':
        progress = Math.min(subjectCorrectMap.mathematics, 30);
        break;
      case 'badge_chem_alchemist':
        progress = Math.min(subjectCorrectMap.chemistry, 30);
        break;
      case 'badge_physics_dynamo':
        progress = Math.min(subjectCorrectMap.physics, 30);
        break;
      case 'badge_bio_conqueror':
        progress = Math.min(subjectCorrectMap.biology, 30);
        break;
      case 'badge_english_rhetoric':
        progress = Math.min(subjectCorrectMap.english, 30);
        break;
      case 'badge_jamb_300':
        progress = Math.min(distinctionCount, 3);
        break;
      default:
        progress = isUnlocked ? b.maxProgress : 0;
    }

    if (!isUnlocked && progress >= b.maxProgress) {
      isUnlocked = true;
      const unlockedBadge: Badge = {
        ...b,
        progress,
        isUnlocked: true,
        unlockedAt: new Date().toISOString(),
      };
      newlyUnlocked.push(unlockedBadge);
    }

    return {
      ...b,
      progress,
      isUnlocked,
      unlockedAt: isUnlocked ? (profile.registeredAt || new Date().toISOString()) : undefined,
    };
  });

  return { badges: evaluatedBadges, newlyUnlocked };
}
