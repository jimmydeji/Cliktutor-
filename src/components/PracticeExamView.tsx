import React, { useState, useEffect } from 'react';
import { SubjectId, GradeLevel, Term, ExamType, Question, QuizAttempt, StudentProfile } from '../types';
import { SUBJECTS } from '../data/curriculum';
import { queryQuestions, getAvailableYears, getYearPaperQuestions } from '../data/questionBank';
import { toggleBookmarkInFirestore, getBookmarksFromFirestore, getTrialStatus } from '../services/storage';
import {
  Timer,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Bot,
  Search,
  BookOpen,
  Calendar,
  Zap,
  Lock,
  Unlock,
  Clock,
  Sparkles,
  AlertTriangle,
  CreditCard
} from 'lucide-react';

interface PracticeExamViewProps {
  initialSubjectId?: SubjectId;
  initialTerm?: Term | 'All Terms';
  initialExamType?: ExamType;
  initialYear?: number;
  initialQuestionCount?: number;
  initialTimeLimitSeconds?: number;
  initialTitle?: string;
  studentGrade: GradeLevel;
  profile: StudentProfile;
  onOpenPayment: () => void;
  onFinishQuiz: (attempt: QuizAttempt) => void;
  onAskAiAboutQuestion: (question: Question, selectedOption: string | null) => void;
  onBackToHome: () => void;
  topic?: string;
  autoStart?: boolean;
}

export const PracticeExamView: React.FC<PracticeExamViewProps> = ({
  initialSubjectId = 'mathematics',
  initialTerm = 'All Terms',
  initialExamType = 'ALL',
  initialYear = 2025,
  initialQuestionCount = 40,
  initialTimeLimitSeconds = 1800,
  initialTitle,
  studentGrade,
  profile,
  onOpenPayment,
  onFinishQuiz,
  onAskAiAboutQuestion,
  onBackToHome,
  topic,
  autoStart,
}) => {
  // Navigation tabs in practice screen
  const [practiceTab, setPracticeTab] = useState<'year_papers' | 'curriculum_topics'>('year_papers');

  // Filters
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>(initialSubjectId);
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(studentGrade);
  
  useEffect(() => {
    setSelectedGrade(studentGrade);
  }, [studentGrade]);

  const [selectedTerm, setSelectedTerm] = useState<Term | 'All Terms'>(initialTerm);
  const [selectedExamType, setSelectedExamType] = useState<ExamType>(initialExamType === 'ALL' ? 'WAEC' : initialExamType);
  const [selectedYear, setSelectedYear] = useState<number>(initialYear);
  const [searchQuery, setSearchQuery] = useState('');
  const [questionCount, setQuestionCount] = useState<number>(initialQuestionCount);
  const [customTimeLimitMinutes, setCustomTimeLimitMinutes] = useState<number>(Math.round(initialTimeLimitSeconds / 60) || 30);
  const [sessionTitle, setSessionTitle] = useState<string>(initialTitle || '');
  const [questionMode, setQuestionMode] = useState<'authentic' | 'practice' | 'all'>('all');

  // Mode: 'practice' (immediate feedback) vs 'cbt_mock' (timed simulation)
  const [mode, setMode] = useState<'practice' | 'cbt_mock'>('cbt_mock');

  // Active Quiz State
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(1800);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);
  const [earnedPointsLive, setEarnedPointsLive] = useState(0);
  const [recentAnswerFeedback, setRecentAnswerFeedback] = useState<string | null>(null);

  const availableYears = getAvailableYears(); // 2026 down to 2006
  const trialStatus = getTrialStatus(profile);

  useEffect(() => {
    const loadBookmarks = async () => {
      setBookmarkedIds(await getBookmarksFromFirestore());
    };
    loadBookmarks();
  }, []);

  // Timer for CBT Mock mode
  useEffect(() => {
    if (!isQuizActive) return;

    const timer = setInterval(() => {
      setTimeSpentSeconds(prev => prev + 1);
      if (mode === 'cbt_mock') {
        setTimeLeftSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isQuizActive, mode]);

  const handleStartSession = async (customQuestions?: Question[], customTitle?: string) => {
    let qList: Question[] = [];

    if (customQuestions && customQuestions.length > 0) {
      qList = customQuestions;
    } else if (practiceTab === 'year_papers') {
      const examBody = selectedExamType === 'ALL' ? 'WAEC' : selectedExamType;
      const count = selectedSubject === 'english' ? 100 : 50;
      qList = getYearPaperQuestions(selectedSubject, examBody, selectedYear, count);
      setSessionTitle(customTitle || `${examBody} ${selectedYear} ${selectedSubject.toUpperCase()} (${qList.length} MCQs)`);
    } else {
      const count = questionCount;
      qList = await queryQuestions({
        subjectId: selectedSubject,
        grade: selectedGrade,
        term: selectedTerm,
        examType: selectedExamType,
        year: selectedYear,
        topic: topic,
        count: count,
        searchQuery: searchQuery.trim() || undefined,
        mode: questionMode,
      });
      console.log('qList fetched for topic:', topic, ':', qList.length, 'questions');

      if (qList.length === 0 && !topic) {
        qList = await queryQuestions({
          subjectId: selectedSubject,
          count: count,
          mode: questionMode,
        });
      }
    }

    // 5-Day Free Trial Policy:
    // If trial is expired and user has not activated full access (isPremium === false),
    // strictly limit to 10 questions per subject!
    if (trialStatus.isTrialExpired && !profile.isPremium) {
      qList = qList.slice(0, 10);
      setSessionTitle(`${sessionTitle || selectedSubject.toUpperCase()} (Trial: 10 MCQs Available)`);
    }

    setQuestions(qList);
    setCurrentIndex(0);
    setUserAnswers({});
    setFlaggedQuestions({});
    setTimeSpentSeconds(0);
    setEarnedPointsLive(0);
    
    // Set time limit: 50 minutes for English, otherwise use customTimeLimitMinutes
    const timeLimitMinutes = selectedSubject === 'english' ? 50 : customTimeLimitMinutes;
    setTimeLeftSeconds(timeLimitMinutes * 60);
    
    setIsQuizActive(true);
  };

  useEffect(() => {
    if (autoStart) {
      handleStartSession();
    }
  }, [autoStart]);

  const handleSelectOption = (optionKey: string) => {
    if (!currentQuestion) return;

    const isFirstAttempt = userAnswers[currentQuestion.id] === undefined;
    const isAnsCorrect = optionKey === currentQuestion.correctOption;

    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionKey,
    }));

    if (isFirstAttempt && isAnsCorrect) {
      const points = currentQuestion.difficulty === 'hard' ? 20 : 15;
      setEarnedPointsLive(prev => prev + points);
      setRecentAnswerFeedback(`+${points} XP!`);
      setTimeout(() => setRecentAnswerFeedback(null), 1500);
    }
  };

  const handleToggleBookmark = async (id: string) => {
    await toggleBookmarkInFirestore(id);
    setBookmarkedIds(await getBookmarksFromFirestore());
  };

  const handleToggleFlag = (id: string) => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    const answersBreakdown = questions.map(q => {
      const selected = userAnswers[q.id] || null;
      const isCorrect = selected === q.correctOption;
      if (isCorrect) score += 1;
      return {
        questionId: q.id,
        selectedOption: selected,
        isCorrect,
        topic: q.topic,
      };
    });

    const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const bonusXp = percentage >= 75 ? 100 : percentage >= 50 ? 50 : 20;

    const attempt: QuizAttempt = {
      id: `quiz-${Date.now()}`,
      userId: profile.id,
      subjectId: selectedSubject,
      grade: selectedGrade,
      term: selectedTerm,
      examType: selectedExamType,
      year: selectedYear,
      paperTitle: sessionTitle,
      totalQuestions: questions.length,
      score,
      percentage,
      timeSpentSeconds,
      date: new Date().toISOString(),
      xpEarned: (score * 15) + bonusXp,
      answers: answersBreakdown,
    };

    setIsQuizActive(false);
    onFinishQuiz(attempt);
  };

  const currentQuestion = questions[currentIndex];
  const selectedOption = currentQuestion ? userAnswers[currentQuestion.id] : null;
  const isAnswered = selectedOption !== undefined && selectedOption !== null;
  const isCorrect = isAnswered && selectedOption === currentQuestion?.correctOption;
  const isBookmarked = currentQuestion ? bookmarkedIds.includes(currentQuestion.id) : false;
  const isFlagged = currentQuestion ? !!flaggedQuestions[currentQuestion.id] : false;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- Configuration Screen (Pre-quiz) ---
  if (!isQuizActive) {
    return (
      <div className="space-y-4 pb-24 pt-2">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            2006 – 2026 Question Banks
          </span>
        </div>

        {/* Trial Status Banner */}
        {!profile.isPremium && (
          <div className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between space-x-3 transition shadow-xs ${
            trialStatus.isTrialExpired
              ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
              : 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
          }`}>
            <div className="flex items-center space-x-2.5 min-w-0">
              {trialStatus.isTrialExpired ? (
                <Lock className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              ) : (
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              )}
              <div className="min-w-0">
                <span className="font-extrabold block truncate">
                  {trialStatus.isTrialExpired
                    ? 'Free Trial Expired (10 MCQs / Subject Available)'
                    : `5-Day Free Trial Active (${trialStatus.daysRemaining} days left)`}
                </span>
                <span className="text-[10px] opacity-85 block truncate">
                  {trialStatus.isTrialExpired
                    ? 'Only 10 questions per subject in free mode. Unlock all 2,000+ MCQs with an access code.'
                    : 'Full unrestricted access to all 2,000+ MCQs per subject across 2006-2026.'}
                </span>
              </div>
            </div>

            <button
              onClick={onOpenPayment}
              className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] shrink-0 shadow-sm transition active:scale-95 cursor-pointer ${
                trialStatus.isTrialExpired
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-slate-900'
              }`}
            >
              {trialStatus.isTrialExpired ? 'Unlock Full' : 'Upgrade'}
            </button>
          </div>
        )}

        {/* Practice Mode Navigator Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => {
              setPracticeTab('year_papers');
              setMode('cbt_mock');
              setQuestionCount(40);
              setCustomTimeLimitMinutes(30);
            }}
            className={`py-2 text-center rounded-xl text-xs font-extrabold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
              practiceTab === 'year_papers'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Year Papers (40 MCQs)</span>
          </button>

          <button
            onClick={() => {
              setPracticeTab('curriculum_topics');
              setMode('practice');
              setQuestionCount(10);
              setCustomTimeLimitMinutes(15);
            }}
            className={`py-2 text-center rounded-xl text-xs font-extrabold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
              practiceTab === 'curriculum_topics'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Topic / Term Practice</span>
          </button>
        </div>

        {/* Question Mode Selector */}
        <div className="grid grid-cols-3 gap-2">
            {(['authentic', 'practice', 'all'] as const).map(modeOpt => (
                <button 
                  key={modeOpt}
                  onClick={() => setQuestionMode(modeOpt)}
                  className={`py-2 rounded-xl text-[10px] font-bold border ${questionMode === modeOpt ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}
                >
                  {modeOpt.toUpperCase()}
                </button>
            ))}
        </div>

        {/* Grade Selector Pills */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Select Class Level
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['SS1', 'SS2', 'SS3'] as const).map(grade => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                  selectedGrade === grade
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {grade}
              </button>
            ))}
          </div>
        </div>

        {/* Subject Selector Pills */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Select Science Subject
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SUBJECTS.map(sub => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubject(sub.id)}
                className={`p-2.5 rounded-xl text-left border transition cursor-pointer ${
                  selectedSubject === sub.id
                    ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-900 dark:text-emerald-100 ring-1 ring-emerald-500'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-bold">{sub.name}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {trialStatus.isTrialExpired && !profile.isPremium ? '10 Free MCQs' : '2,000+ MCQs'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Year Papers (2006 to 2026) */}
        {practiceTab === 'year_papers' && (
          <div className="space-y-3 bg-white dark:bg-slate-800/90 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                Exam Body & Year (2006 - 2026)
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                40 Questions per Paper
              </span>
            </div>

            {/* Exam Body Switcher */}
            <div className="grid grid-cols-3 gap-2">
              {(['WAEC', 'JAMB', 'NECO'] as const).map(exam => (
                <button
                  key={exam}
                  onClick={() => setSelectedExamType(exam)}
                  className={`py-2 text-center rounded-xl text-xs font-extrabold border transition cursor-pointer ${
                    selectedExamType === exam
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  {exam}
                </button>
              ))}
            </div>

            {/* Year Selector (2006 to 2026) */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Select Past Paper Year:
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {availableYears.map(yr => (
                  <option key={yr} value={yr}>
                    {selectedExamType} {yr} Past Questions Paper ({selectedSubject.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            {/* Paper Preview Card */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between">
              <div>
                <span className="font-extrabold text-slate-900 dark:text-white block">
                  {selectedExamType} {selectedYear} {selectedSubject.toUpperCase()}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  {trialStatus.isTrialExpired && !profile.isPremium ? (
                    <span className="text-rose-600 dark:text-rose-400 font-semibold">
                      🔒 Trial limit: First 10 of 40 questions available
                    </span>
                  ) : (
                    'Complete 40 standard MCQs with NERDC solutions'
                  )}
                </span>
              </div>

              <div className="text-right">
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold block text-xs">
                  30 Mins
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  {trialStatus.isTrialExpired && !profile.isPremium ? '10 MCQs' : '40 MCQs'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Curriculum Topics & Term Filters */}
        {practiceTab === 'curriculum_topics' && (
          <div className="space-y-3 bg-white dark:bg-slate-800/90 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search topics (e.g., Photosynthesis, Stoichiometry)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Term Selector */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Academic Term:
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['All Terms', '1st Term', '2nd Term', '3rd Term'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedTerm(t)}
                    className={`py-1.5 text-center rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                      selectedTerm === t
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {t === 'All Terms' ? 'All' : t.replace(' Term', '')}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count Selector */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Question Count:
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[10, 20, 30, 40, 200].map(cnt => {
                  const isLocked = trialStatus.isTrialExpired && !profile.isPremium && cnt > 10;
                  return (
                    <button
                      key={cnt}
                      disabled={isLocked}
                      onClick={() => setQuestionCount(cnt)}
                      className={`py-1.5 text-center rounded-xl text-xs font-bold border transition relative cursor-pointer ${
                        questionCount === cnt && !isLocked
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : isLocked
                          ? 'bg-slate-100 dark:bg-slate-900/40 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-800 cursor-not-allowed opacity-60'
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {cnt} Qs
                      {isLocked && (
                        <Lock className="w-2.5 h-2.5 text-rose-500 absolute top-1 right-1" />
                      )}
                    </button>
                  );
                })}
              </div>
              {trialStatus.isTrialExpired && !profile.isPremium && (
                <p className="text-[10px] text-rose-600 dark:text-rose-400 mt-1">
                  * Questions 11-40 are locked in trial mode.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Start Button */}
        <button
          onClick={() => handleStartSession()}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-extrabold text-sm shadow-md shadow-emerald-600/20 active:scale-[0.99] transition flex items-center justify-center space-x-2 cursor-pointer"
        >
          <BookOpen className="w-4 h-4" />
          <span>
            {practiceTab === 'year_papers'
              ? `Launch ${selectedExamType} ${selectedYear} (${trialStatus.isTrialExpired && !profile.isPremium ? '10 Trial MCQs' : '40 MCQs Exam'})`
              : `Start Practice Session (${trialStatus.isTrialExpired && !profile.isPremium ? '10 Trial Qs' : `${questionCount} Questions`})`}
          </span>
        </button>
      </div>
    );
  }

  // --- Active Quiz / Exam Screen ---
  return (
    <div className="space-y-4 pb-24 pt-1">
      {/* Quiz Top Bar */}
      <div className="bg-white dark:bg-slate-800/95 rounded-2xl border border-slate-200 dark:border-slate-700 p-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-extrabold text-slate-900 dark:text-white">
            Q {currentIndex + 1} <span className="text-slate-400">/ {questions.length}</span>
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-slate-600">
            {currentQuestion?.examType} {currentQuestion?.year}
          </span>
        </div>

        {/* Live Points Tracker & Feedback */}
        <div className="flex items-center space-x-1.5">
          {recentAnswerFeedback && (
            <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 animate-bounce">
              {recentAnswerFeedback}
            </span>
          )}
          <div className="flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold border border-emerald-200 dark:border-emerald-800">
            <span>{earnedPointsLive} XP</span>
          </div>
        </div>

        {/* Timer */}
        {mode === 'cbt_mock' ? (
          <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border ${
            timeLeftSeconds < 180
              ? 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-700 animate-pulse'
              : 'bg-slate-50 dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 border-slate-200 dark:border-slate-700'
          }`}>
            <Timer className="w-3.5 h-3.5" />
            <span>{formatTime(timeLeftSeconds)}</span>
          </div>
        ) : (
          <span className="text-[11px] font-semibold text-slate-500">
            Study Mode
          </span>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => handleToggleFlag(currentQuestion?.id || '')}
            title="Flag question for review"
            className={`p-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              isFlagged ? 'bg-amber-100 text-amber-700 border border-amber-300 dark:bg-amber-900/40 dark:text-amber-300' : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
            }`}
          >
            🏳️
          </button>
          <button
            onClick={() => handleToggleBookmark(currentQuestion?.id || '')}
            title="Bookmark"
            className={`p-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              isBookmarked ? 'bg-emerald-100 text-emerald-700 border border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300' : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-emerald-600 text-emerald-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Trial Notification Banner inside Quiz if in trial limit */}
      {trialStatus.isTrialExpired && !profile.isPremium && (
        <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-between text-[11px] text-amber-800 dark:text-amber-200">
          <span className="flex items-center space-x-1.5 font-medium">
            <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Trial Mode: Limited to 10 questions per subject</span>
          </span>
          <button
            onClick={onOpenPayment}
            className="text-[10px] font-extrabold px-2 py-0.5 rounded-lg bg-amber-600 text-white hover:bg-amber-700 cursor-pointer shadow-xs"
          >
            Unlock 2,000+
          </button>
        </div>
      )}

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-emerald-600 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      {currentQuestion && (
        <div className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm space-y-4">
          {/* Topic Badge */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-100 dark:border-slate-700 pb-2">
            <span className="font-semibold text-emerald-700 dark:text-emerald-400 truncate max-w-[150px]">
              {currentQuestion.topic}
            </span>
            <span className={`font-bold px-1.5 py-0.5 rounded ${
              currentQuestion.verificationStatus === 'VERIFIED_PAST_QUESTION'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {currentQuestion.verificationStatus === 'VERIFIED_PAST_QUESTION' ? 'Authentic' : 'AI-Practice'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">{currentQuestion.term}</span>
          </div>

          {/* Question Text */}
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
            {currentQuestion.question}
          </div>

          {/* Question Image */}
          {(currentQuestion.contentType === 'image' || currentQuestion.contentType === 'mixed') && currentQuestion.imageUrl && (
            <div className="my-2 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
              <img 
                src={currentQuestion.imageUrl} 
                alt={currentQuestion.imageAlt || 'Question diagram'} 
                className="w-full h-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Optional Formula or Diagram Cue */}
          {currentQuestion.formulaOrDiagram && (
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs text-amber-700 dark:text-amber-400 overflow-x-auto">
              {currentQuestion.formulaOrDiagram}
            </div>
          )}

          {/* Multiple Choice Options */}
          <div className="space-y-2 pt-1">
            {(['A', 'B', 'C', 'D'] as const).map((key) => {
              const isSelected = selectedOption === key;
              const isCorrectOption = currentQuestion.correctOption === key;
              const optionText = currentQuestion.options[key];

              let optionStyle = 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-800 dark:text-slate-200';
              if (mode === 'practice' && isAnswered) {
                if (isCorrectOption) {
                  optionStyle = 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 text-emerald-900 dark:text-emerald-100 shadow-xs';
                } else if (isSelected && !isCorrect) {
                  optionStyle = 'bg-rose-50 dark:bg-rose-950/80 border-rose-400 text-rose-900 dark:text-rose-100';
                }
              } else if (isSelected) {
                optionStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-100 ring-1 ring-emerald-500';
              }

              return (
                <button
                  key={key}
                  onClick={() => handleSelectOption(key)}
                  className={`w-full text-left p-3 rounded-2xl border text-xs font-medium transition flex items-start space-x-3 cursor-pointer ${optionStyle}`}
                >
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 ${
                    isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    {key}
                  </span>
                  <span className="flex-1 leading-normal">{optionText}</span>

                  {mode === 'practice' && isAnswered && isCorrectOption && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                  {mode === 'practice' && isAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Immediate Explanation in Study Mode */}
          {mode === 'practice' && isAnswered && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>NERDC Step-by-Step Breakdown</span>
                </span>
                <button
                  onClick={() => onAskAiAboutQuestion(currentQuestion, selectedOption)}
                  className="text-[10px] font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center space-x-1 transition cursor-pointer"
                >
                  <Bot className="w-3 h-3" />
                  <span>Ask EasyTutor</span>
                </button>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/70 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                {currentQuestion.explanation}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 transition flex items-center space-x-1 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {currentIndex === questions.length - 1 ? (
          <button
            onClick={handleSubmitQuiz}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white font-extrabold text-xs shadow-md transition flex items-center space-x-1.5 active:scale-95 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Submit Exam Paper</span>
          </button>
        ) : (
          <button
            onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm transition flex items-center space-x-1 active:scale-95 cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Question Palette (Numbers at bottom) */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200 dark:border-slate-700 p-3.5 shadow-xs">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-2">
          <span>Question Navigation Palette</span>
          <span>{Object.keys(userAnswers).length} / {questions.length} answered</span>
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
          {questions.map((q, idx) => {
            const hasAns = userAnswers[q.id] !== undefined;
            const isCurr = idx === currentIndex;
            const flagged = flaggedQuestions[q.id];

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition flex items-center justify-center relative cursor-pointer ${
                  isCurr
                    ? 'ring-2 ring-emerald-500 bg-emerald-600 text-white'
                    : hasAns
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-slate-700 dark:text-emerald-300 dark:border-slate-600'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {idx + 1}
                {flagged && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
