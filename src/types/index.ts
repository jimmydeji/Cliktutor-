export type GradeLevel = 'SS1' | 'SS2' | 'SS3';
export type Term = '1st Term' | '2nd Term' | '3rd Term';
export type SubjectId = 'mathematics' | 'english' | 'physics' | 'chemistry' | 'biology';
export type ExamType = 'WAEC' | 'JAMB' | 'NECO' | 'ALL';
export type VerificationStatus = 'VERIFIED_PAST_QUESTION' | 'AI_GENERATED_PRACTICE' | 'UNVERIFIED_SOURCE';
export type ThemeMode = 'dark' | 'light';

export interface StudentProfile {
  id: string;
  name: string;
  phoneNumber: string;
  email: string; // Added email
  state: string;
  lga: string;
  schoolName: string;
  grade: GradeLevel;
  targetExam: ExamType;
  registeredAt: string;
  avatarSeed?: string;
  avatarUrl?: string; // Uploaded profile image base64 data URL
  
  // Parent / Guardian Information
  parentName?: string;
  parentPhone?: string;
  parentAddress?: string;

  // Higher Education Aspirations
  targetUniversity?: string; // Choice of University (e.g. University of Lagos)
  proposedCourse?: string;   // Proposed Course of Study (e.g. Computer Science)
  targetJambScore?: number;  // Optional JAMB target score

  xp: number;
  streakDays: number;
  lastActiveDate: string;
  unlockedBadgeIds?: string[];
  level?: number;
  isPremium?: boolean;
  trialStartDate?: string;
  accessCode?: string;
  isActivated?: boolean;
  activationCodeHash?: string;
}

export interface TrialStatus {
  isPremium: boolean;
  daysRemaining: number;
  isTrialActive: boolean;
  isTrialExpired: boolean;
  maxQuestionsPerSubject: number;
}

export interface Question {
  id: string;
  subjectId: SubjectId;
  grade: GradeLevel;
  term: Term;
  topic: string;
  examType: 'WAEC' | 'JAMB' | 'NECO';
  year: number; // 2006 to 2026
  questionNumber?: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  formulaOrDiagram?: string;
  verificationStatus: VerificationStatus;
  sourceReference?: string;
  contentType: 'text' | 'image' | 'mixed';
  imageUrl?: string;
  imageAlt?: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  subjectId: SubjectId;
  grade: GradeLevel;
  term: Term | 'All Terms';
  examType: ExamType;
  year?: number;
  paperTitle?: string;
  totalQuestions: number;
  score: number;
  percentage: number;
  timeSpentSeconds: number;
  date: string;
  xpEarned?: number;
  answers: {
    questionId: string;
    selectedOption: string | null;
    isCorrect: boolean;
    topic: string;
  }[];
}

export interface SubjectStats {
  subjectId: SubjectId;
  questionsAttempted: number;
  questionsCorrect: number;
  accuracy: number;
  strongTopics: string[];
  weakTopics: string[];
  lastPracticed: string;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  schoolName: string;
  state: string;
  lga: string;
  grade: GradeLevel;
  xp: number;
  rank: number;
  accuracy: number;
  quizzesCompleted: number;
  streakDays: number;
  badgesCount?: number;
  isCurrentUser?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedAction?: {
    type: 'practice_topic' | 'view_formula' | 'open_quiz';
    payload: any;
    label: string;
  };
}

// Gamification Models
export interface Badge {
  id: string;
  name: string;
  description: string;
  category: 'streak' | 'accuracy' | 'milestone' | 'mastery' | 'challenge';
  icon: string;
  color: string;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
}

export interface TimedChallenge {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  subjectId: SubjectId | 'any';
  examType: 'WAEC' | 'JAMB' | 'NECO' | 'ALL';
  year?: number;
  timeLimitSeconds: number; // e.g. 180s (3m), 300s (5m), 1800s (30m)
  questionCount: number; // e.g. 5, 10, 40, 50
  bonusXp: number;
  badgeRewardId?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  badgeLabel: string;
  iconName: string;
}

export interface YearExamPaper {
  id: string;
  subjectId: SubjectId;
  examType: 'WAEC' | 'JAMB' | 'NECO';
  year: number; // 2006 to 2026
  questionCount: number; // e.g. 40 MCQs
  title: string; // e.g. "WAEC 2025 Mathematics (40 MCQs)"
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedMinutes: number;
}

export interface PaymentRequest {
  id: string;
  userId: string;
  studentName: string;
  phoneNumber: string;
  tier: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: string;
}
