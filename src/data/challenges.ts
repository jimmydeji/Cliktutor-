import { TimedChallenge, YearExamPaper, SubjectId, ExamType } from '../types';

export const TIMED_CHALLENGES: TimedChallenge[] = [
  {
    id: 'challenge_daily_sprint',
    title: 'Daily Speed Sprint',
    subtitle: '5 Questions • 3 Minutes',
    description: 'Fast-paced drill to ignite your brain cells and secure your daily streak bonus.',
    subjectId: 'any',
    examType: 'ALL',
    timeLimitSeconds: 180, // 3 mins
    questionCount: 5,
    bonusXp: 75,
    badgeLabel: '+75 XP & Streak Protection',
    difficulty: 'easy',
    iconName: 'Zap',
  },
  {
    id: 'challenge_lightning_blitz',
    title: 'Lightning Formula Blitz',
    subtitle: '10 Questions • 5 Minutes',
    description: 'High-intensity calculations test in Physics, Math & Chemistry. Quick recall is key!',
    subjectId: 'physics',
    examType: 'JAMB',
    year: 2025,
    timeLimitSeconds: 300, // 5 mins
    questionCount: 10,
    bonusXp: 150,
    badgeRewardId: 'badge_speed_blitz',
    badgeLabel: '+150 XP & Speed Badge',
    difficulty: 'medium',
    iconName: 'Flame',
  },
  {
    id: 'challenge_waec_2025_40',
    title: 'WAEC 2025 40-MCQ Paper 1',
    subtitle: '40 Questions • 30 Minutes',
    description: 'Authentic 2025 WASSCE objective simulation under strict examination hall pressure.',
    subjectId: 'mathematics',
    examType: 'WAEC',
    year: 2025,
    timeLimitSeconds: 1800, // 30 mins
    questionCount: 40,
    bonusXp: 300,
    badgeRewardId: 'badge_marksman_90',
    badgeLabel: '+300 XP & A1 Badge',
    difficulty: 'hard',
    iconName: 'Award',
  },
  {
    id: 'challenge_jamb_2026_cbt',
    title: 'JAMB 2026 UTME CBT Marathon',
    subtitle: '40 Questions • 25 Minutes',
    description: 'Ultra-fast pace simulating the JAMB computer-based test environment for top percentiles.',
    subjectId: 'chemistry',
    examType: 'JAMB',
    year: 2026,
    timeLimitSeconds: 1500, // 25 mins
    questionCount: 40,
    bonusXp: 350,
    badgeRewardId: 'badge_jamb_300',
    badgeLabel: '+350 XP & 300+ Club',
    difficulty: 'hard',
    iconName: 'Timer',
  },
  {
    id: 'challenge_neco_2024_40',
    title: 'NECO 2024 SSCE Master Exam',
    subtitle: '40 Questions • 30 Minutes',
    description: 'Comprehensive test covering national NERDC Senior Secondary questions from NECO 2024.',
    subjectId: 'biology',
    examType: 'NECO',
    year: 2024,
    timeLimitSeconds: 1800, // 30 mins
    questionCount: 40,
    bonusXp: 280,
    badgeLabel: '+280 XP & Distinction',
    difficulty: 'medium',
    iconName: 'GraduationCap',
  },
  {
    id: 'challenge_english_concord_dash',
    title: 'English Lexis & Concord Dash',
    subtitle: '20 Questions • 10 Minutes',
    description: 'Master WAEC & JAMB grammar traps, nearest in meaning, and oral stress patterns.',
    subjectId: 'english',
    examType: 'WAEC',
    year: 2025,
    timeLimitSeconds: 600, // 10 mins
    questionCount: 20,
    bonusXp: 200,
    badgeLabel: '+200 XP & Lexis Crown',
    difficulty: 'medium',
    iconName: 'BookOpen',
  },
];

// Helper to generate full catalog of 2006 to 2026 exam papers separated by year
export function generateYearPapers(subjectId: SubjectId, examType?: ExamType): YearExamPaper[] {
  const years: number[] = [];
  // 2026 down to 2006 (21 years)
  for (let y = 2026; y >= 2006; y--) {
    years.push(y);
  }

  const bodies: ('WAEC' | 'JAMB' | 'NECO')[] = examType && examType !== 'ALL'
    ? [examType]
    : ['WAEC', 'JAMB', 'NECO'];

  const papers: YearExamPaper[] = [];

  for (const year of years) {
    for (const body of bodies) {
      const difficulty = year >= 2022 ? 'hard' : year >= 2014 ? 'medium' : 'easy';
      papers.push({
        id: `paper-${body.toLowerCase()}-${year}-${subjectId}`,
        subjectId,
        examType: body,
        year,
        questionCount: 40,
        title: `${body} ${year} ${subjectId.toUpperCase()} (40 MCQs)`,
        difficulty,
        estimatedMinutes: body === 'JAMB' ? 25 : 30,
      });
    }
  }

  return papers;
}
