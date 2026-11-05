import React, { useState, useEffect } from 'react';
import { StudentProfile, SubjectId, Term, ExamType, QuizAttempt, Question, Badge } from './types';
import { getStoredProfile, saveProfile, updateStudentXP, saveQuizAttemptToFirestore, DEFAULT_PROFILE, getProfileFromFirestore, saveProfileToFirestore } from './services/storage';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { HomeDashboard } from './components/HomeDashboard';
import { PracticeExamView } from './components/PracticeExamView';
import { ResultModal } from './components/ResultModal';
import { AITutorView } from './components/AITutorView';
import { LeaderboardView } from './components/LeaderboardView';
import { AnalyticsView } from './components/AnalyticsView';
import { RegistrationModal } from './components/RegistrationModal';
import { BadgesModal } from './components/BadgesModal';
import { PaymentModal } from './components/PaymentModal';
import { AdminPanel } from './components/AdminPanel';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { JAMBPracticeView } from './components/JAMBPracticeView';
import { DeviceFrameWrapper } from './components/DeviceFrameWrapper';

function AppContent() {
  const [profile, setProfile] = useState<StudentProfile>(DEFAULT_PROFILE);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isInitialSetup, setIsInitialSetup] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [authView, setAuthView] = useState<'login' | 'signup' | 'app'>('login');

  // Practice state
  const [practiceConfig, setPracticeConfig] = useState<{
    subjectId: SubjectId;
    term: Term | 'All Terms';
    examType: ExamType;
    year: number;
    questionCount: number;
    timeLimitSeconds: number;
    title?: string;
    topic?: string;
    autoStart?: boolean;
  }>({
    subjectId: 'mathematics',
    term: 'All Terms',
    examType: 'WAEC',
    year: 2025,
    questionCount: 50,
    timeLimitSeconds: 1800,
    title: 'WAEC 2025 Mathematics (40 MCQs)',
    topic: undefined,
  });

  // Active quiz results modal
  const [completedAttempt, setCompletedAttempt] = useState<QuizAttempt | null>(null);
  const [newlyUnlockedBadges, setNewlyUnlockedBadges] = useState<Badge[]>([]);

  // Initial prompt for AI tutor
  const [tutorInitialPrompt, setTutorInitialPrompt] = useState<string>('');

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // User is logged in, fetch profile
        const saved = await getProfileFromFirestore();
        console.log('App: User logged in, profile fetched:', saved);
        if (saved) {
          setProfile(saved);
          setAuthView('app');
        }
      } else {
        // User is logged out
        setProfile(DEFAULT_PROFILE);
        setAuthView('login');
      }
    });

    // Network status listeners
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        unsubscribe();
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  const handleToggleOnline = () => {
    setIsOnline(prev => !prev);
  };

  const handleSaveProfile = async (newProfile: StudentProfile) => {
    try {
      await saveProfileToFirestore(newProfile);
      setProfile(newProfile);
      setIsInitialSetup(false);
      setAuthView('app');
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile. Please check your connection and try again.');
    }
  };

  const handleLogout = async () => {
    console.log('handleLogout called');
    try {
      // 1. Sign out from Firebase
      await signOut(auth);
      console.log('Successfully signed out from Firebase');
      
      // 2. Clear application state
      setIsRegistrationOpen(false); // Close registration modal
      setProfile(DEFAULT_PROFILE);
      
      // 3. Force UI redirect to login
      setAuthView('login');
      
      // 4. Clear all ClikTutor-related data
      localStorage.clear(); 
      console.log('Local storage cleared');
    } catch (error) {
      console.error('Error signing out:', error);
      // Even if Firebase signout fails, force local state clear to allow recovery
      setIsRegistrationOpen(false); // Close registration modal
      setProfile(DEFAULT_PROFILE);
      setAuthView('login');
      localStorage.clear();
    }
  };

  const handleGradeChange = (grade: 'SS1' | 'SS2' | 'SS3') => {
    const updated: StudentProfile = {
      ...profile,
      grade,
    };
    saveProfile(updated);
    setProfile(updated);
  };

  const handleStartPractice = (
    subjectId: SubjectId,
    term: Term | 'All Terms' = 'All Terms',
    examType: ExamType = 'WAEC',
    year: number = 2025,
    questionCount: number = 50,
    timeLimitSeconds: number = 1800,
    challengeTitle?: string,
    topic?: string,
    autoStart: boolean = false
  ) => {
    const defaultCount = subjectId === 'english' ? 100 : 50;
    const finalCount = questionCount === 50 ? defaultCount : questionCount;

    setPracticeConfig({
      subjectId,
      term,
      examType,
      year,
      questionCount: finalCount,
      timeLimitSeconds: finalCount * 60,
      title: challengeTitle || `${examType} ${year} ${subjectId.toUpperCase()} (${finalCount} MCQs)`,
      topic,
      autoStart
    });
    setCompletedAttempt(null);
    setCurrentTab('practice');
  };

  const handleFinishQuiz = async (attempt: QuizAttempt) => {
    if (auth.currentUser) {
      try {
        await saveQuizAttemptToFirestore(attempt);
        const xpPoints = attempt.xpEarned || (attempt.score * 15);
        const { updatedProfile, newlyUnlockedBadges: earnedBadges } = await updateStudentXP(xpPoints);
        setProfile(updatedProfile);
        setNewlyUnlockedBadges(earnedBadges);
      } catch (error) {
        console.error('Error saving quiz attempt or updating XP:', error);
      }
    } else {
      console.warn('Skipping Firestore quiz save: No user logged in');
    }
    setCompletedAttempt(attempt);
  };

  const handleAskAiAboutQuestion = (question: Question, selectedOption: string | null) => {
    const prompt = `Please explain this ${question.grade} ${question.subjectId.toUpperCase()} question (${question.examType} ${question.year}):
"${question.question}"

Options:
A: ${question.options.A}
B: ${question.options.B}
C: ${question.options.C}
D: ${question.options.D}

The student chose: ${selectedOption || 'None (Skipped)'}
The correct answer is: ${question.correctOption}

Can you break down the concept step-by-step according to the NERDC curriculum and give me a memorable exam tip?`;

    setTutorInitialPrompt(prompt);
    setCompletedAttempt(null);
    setCurrentTab('tutor');
  };

  return (
    <DeviceFrameWrapper>
      <div className="flex flex-col min-h-full">
        {/* Header - ONLY show when authenticated */}
        {authView === 'app' && (
          <Header
            profile={profile}
            isOnline={isOnline}
            onToggleOnline={handleToggleOnline}
            onOpenProfile={() => setIsRegistrationOpen(true)}
            onOpenBadges={() => setIsBadgesModalOpen(true)}
            onOpenPayment={() => setIsPaymentModalOpen(true)}
            onOpenAdmin={() => setIsAdminModalOpen(true)}
            onGradeChange={handleGradeChange}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 px-1">
          {authView === 'login' ? (
            <LoginPage onLogin={() => setAuthView('app')} onNavigateToSignup={() => setAuthView('signup')} />
          ) : authView === 'signup' ? (
            <SignupPage onSignup={() => setAuthView('app')} onNavigateToLogin={() => setAuthView('login')} />
          ) : (
            <>
              {completedAttempt ? (
                <ResultModal
                  attempt={completedAttempt}
                  newlyUnlockedBadges={newlyUnlockedBadges}
                  onRetake={() => {
                    setCompletedAttempt(null);
                    setCurrentTab('practice');
                  }}
                  onBackToHome={() => {
                    setCompletedAttempt(null);
                    setCurrentTab('home');
                  }}
                  onAskAiAboutQuestion={handleAskAiAboutQuestion}
                />
              ) : (
                <>
                  {currentTab === 'home' && (
                    <HomeDashboard
                      profile={profile}
                      onStartPractice={handleStartPractice}
                      onOpenAiTutor={(prompt) => {
                        if (prompt) setTutorInitialPrompt(prompt);
                        setCurrentTab('tutor');
                      }}
                      onOpenLeaderboard={() => setCurrentTab('leaderboard')}
                      onOpenBadges={() => setIsBadgesModalOpen(true)}
                      onOpenProfile={() => setIsRegistrationOpen(true)}
                    />
                  )}

                  {currentTab === 'practice' && (
                    <PracticeExamView
                      initialSubjectId={practiceConfig.subjectId}
                      initialTerm={practiceConfig.term}
                      initialExamType={practiceConfig.examType}
                      initialYear={practiceConfig.year}
                      initialQuestionCount={practiceConfig.questionCount}
                      initialTimeLimitSeconds={practiceConfig.timeLimitSeconds}
                      initialTitle={practiceConfig.title}
                      autoStart={practiceConfig.autoStart}
                      studentGrade={profile.grade}
                      profile={profile}
                      onOpenPayment={() => setIsPaymentModalOpen(true)}
                      onFinishQuiz={handleFinishQuiz}
                      onAskAiAboutQuestion={handleAskAiAboutQuestion}
                      onBackToHome={() => setCurrentTab('home')}
                      topic={practiceConfig.topic}
                    />
                  )}

                  {currentTab === 'tutor' && (
                    <AITutorView
                      profile={profile}
                      initialPrompt={tutorInitialPrompt}
                      isOnline={isOnline}
                    />
                  )}

                  {currentTab === 'leaderboard' && (
                    <LeaderboardView profile={profile} />
                  )}

                  {currentTab === 'jamb' && (
                    <JAMBPracticeView onBackToHome={() => setCurrentTab('home')} />
                  )}
                </>
              )}
            </>
          )}
        </main>
        {authView === 'app' && (
          /* Mobile Bottom Navigation */
          <BottomNav
            currentTab={currentTab}
            onSelectTab={(tab) => {
              setCompletedAttempt(null);
              setCurrentTab(tab);
            }}
          />
        )}

        {/* Registration & Profile Modal */}
        <RegistrationModal
          isOpen={isRegistrationOpen}
          onClose={() => setIsRegistrationOpen(false)}
          currentProfile={profile}
          onSaveProfile={handleSaveProfile}
          onLogout={handleLogout}
          isInitialSetup={isInitialSetup}
        />

        {/* Badges & Achievements Modal */}
        <BadgesModal
          isOpen={isBadgesModalOpen}
          onClose={() => setIsBadgesModalOpen(false)}
          profile={profile}
        />

        {/* Payment & Access Code Modal */}
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          profile={profile}
          onUpdateProfile={(updated) => {
            saveProfile(updated);
            setProfile(updated);
          }}
        />
        {isAdminModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="w-full max-w-lg">
              <AdminPanel />
              <button 
                onClick={() => setIsAdminModalOpen(false)}
                className="mt-4 w-full p-2 bg-white dark:bg-slate-900 rounded-xl"
              >
                Close Admin
              </button>
            </div>
          </div>
        )}
      </div>
    </DeviceFrameWrapper>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
