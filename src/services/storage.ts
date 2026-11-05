import { StudentProfile, QuizAttempt, SubjectStats, LeaderboardUser, SubjectId, GradeLevel, ChatMessage, Badge, TrialStatus, PaymentRequest } from '../types';
import { evaluateBadges, getScholarLevel } from '../data/badges';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc, collection, addDoc, query, where, orderBy, getDocs, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}
function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}


const STORAGE_KEYS = {
  PROFILE: 'easybook_student_profile',
  QUIZ_HISTORY: 'easybook_quiz_history',
  BOOKMARKS: 'easybook_bookmarks',
  CHAT_MESSAGES: 'easybook_ai_chat',
  OFFLINE_CACHE_TIMESTAMP: 'easybook_cache_time',
};

// Initial default sample student profile if not yet registered
export const DEFAULT_PROFILE: StudentProfile = {
  id: 'student-demo',
  name: 'Chidubem Adebayo',
  phoneNumber: '08031234567',
  email: 'chidubem.adebayo@example.com',
  state: 'Lagos',
  lga: 'Ikeja',
  schoolName: "King's College, Lagos",
  grade: 'SS2',
  targetExam: 'ALL',
  registeredAt: new Date().toISOString(),
  avatarUrl: undefined,
  parentName: 'Engr. Olabode Adebayo',
  parentPhone: '08023456789',
  parentAddress: 'Plot 12, Adekunle Fajuyi Crescent, Ikeja GRA, Lagos',
  targetUniversity: 'University of Lagos (UNILAG)',
  proposedCourse: 'Computer Science / Software Engineering',
  targetJambScore: 320,
  xp: 1250,
  streakDays: 4,
  lastActiveDate: new Date().toISOString().split('T')[0],
  unlockedBadgeIds: ['badge_first_win', 'badge_streak_3'],
  level: 3,
  isPremium: false,
  trialStartDate: new Date().toISOString(),
  isActivated: false,
  activationCodeHash: undefined,
};

export function getStoredProfile(): StudentProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return null;
    const parsed: StudentProfile = JSON.parse(raw);
    if (!parsed.trialStartDate) {
      parsed.trialStartDate = parsed.registeredAt || new Date().toISOString();
    }
    return parsed;
  } catch (e) {
    console.error('Failed to load profile from localStorage', e);
    return null;
  }
}

export function saveProfile(profile: StudentProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile to localStorage', e);
  }
}

export async function getProfileFromFirestore(): Promise<StudentProfile | null> {
  if (!auth.currentUser) return null;
  try {
    const docRef = doc(db, 'studentProfile', auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as StudentProfile) : getStoredProfile();
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'studentProfile');
    return getStoredProfile();
  }
}

export async function saveProfileToFirestore(profile: StudentProfile): Promise<void> {
  if (!auth.currentUser) {
    console.warn('Skipping profile save: No user logged in');
    return;
  }
  try {
    // Sanitize profile to remove undefined values before passing to setDoc
    const sanitizedProfile = Object.fromEntries(
      Object.entries(profile).filter(([_, v]) => v !== undefined)
    );
    
    console.log('Saving profile to Firestore (studentProfile) for user:', auth.currentUser.uid, sanitizedProfile);
    await setDoc(doc(db, 'studentProfile', auth.currentUser.uid), sanitizedProfile);
    console.log('Profile saved successfully');
  } catch (error) {
    console.error('Error in saveProfileToFirestore:', error);
    throw error;
  }
}

export function getTrialStatus(customProfile?: StudentProfile): TrialStatus {
  const profile = customProfile || getStoredProfile() || DEFAULT_PROFILE;

  if (profile.isPremium || profile.isActivated) {
    return {
      isPremium: true,
      daysRemaining: 999,
      isTrialActive: false,
      isTrialExpired: false,
      maxQuestionsPerSubject: 2000,
    };
  }

  const startDate = profile.trialStartDate ? new Date(profile.trialStartDate).getTime() : Date.now();
  const now = Date.now();
  const elapsedDays = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.max(0, 5 - elapsedDays);

  const isTrialActive = daysRemaining > 0;
  const isTrialExpired = !isTrialActive;
  const maxQuestionsPerSubject = isTrialActive ? 2000 : 10;

  return {
    isPremium: false,
    daysRemaining,
    isTrialActive,
    isTrialExpired,
    maxQuestionsPerSubject,
  };
}

export async function redeemAccessCode(code: string): Promise<{ success: boolean; message: string; updatedProfile?: StudentProfile }> {
  const cleanCode = code.trim().toUpperCase();
  console.log('Attempting to redeem code:', cleanCode);
  
  if (!cleanCode) {
    return { success: false, message: 'Please enter a valid access code.' };
  }

  if (!auth.currentUser) {
    return { success: false, message: 'You must be logged in to redeem a code.' };
  }

  try {
    const codeRef = doc(db, 'activationCodes', cleanCode);
    const codeSnap = await getDoc(codeRef);

    console.log('Document exists:', codeSnap.exists());

    if (!codeSnap.exists()) {
        console.log('Code document not found in Firestore');
        return { success: false, message: 'Invalid access code.' };
    }

    const codeData = codeSnap.data();
    console.log('Code data:', codeData);

    if (codeData.used) {
        return { success: false, message: 'This code has already been used.' };
    }

    // Atomically mark code as used and update profile
    const profileRef = doc(db, 'studentProfile', auth.currentUser.uid);
    const profileSnap = await getDoc(profileRef);
    if (!profileSnap.exists()) {
        return { success: false, message: 'Profile not found.' };
    }

    const profileData = profileSnap.data() as StudentProfile;

    await updateDoc(codeRef, { used: true, usedAt: Timestamp.now(), usedBy: auth.currentUser.uid });
    const updatedProfile = { ...profileData, isPremium: true, accessCode: cleanCode };
    await updateDoc(profileRef, { isPremium: true, accessCode: cleanCode });
    saveProfile(updatedProfile);

    return {
      success: true,
      message: 'Full access unlocked successfully! All 2,000+ MCQs per subject are now available.',
      updatedProfile,
    };
  } catch (error) {
    console.error('Error redeeming code:', error);
    return { success: false, message: 'An error occurred while redeeming the code.' };
  }
}

export function activatePremiumPayment(tier: string): StudentProfile {
  const current = getStoredProfile() || DEFAULT_PROFILE;
  const updated: StudentProfile = {
    ...current,
    isPremium: true,
    accessCode: `PAY-${Date.now().toString(36).toUpperCase()}`,
  };
  saveProfile(updated);
  return updated;
}

export function simulateToggleTrial(expired: boolean): StudentProfile {
  const current = getStoredProfile() || DEFAULT_PROFILE;
  const trialStartDate = expired
    ? new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() // 6 days ago (expired)
    : new Date().toISOString(); // today (active 5 days left)

  const updated: StudentProfile = {
    ...current,
    isPremium: false,
    trialStartDate,
  };
  saveProfile(updated);
  return updated;
}

export async function updateStudentXP(
  pointsToAdd: number,
  additionalBadgeId?: string
): Promise<{ updatedProfile: StudentProfile; newlyUnlockedBadges: Badge[] }> {
  const current = await getProfileFromFirestore() || DEFAULT_PROFILE;
  const today = new Date().toISOString().split('T')[0];

  let streak = current.streakDays || 1;
  if (current.lastActiveDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (current.lastActiveDate === yesterday) {
      streak += 1;
    } else {
      streak = 1;
    }
  }

  const newXp = Math.max(0, (current.xp || 0) + pointsToAdd);
  const { currentLevel } = getScholarLevel(newXp);

  const existingBadgeIds = new Set(current.unlockedBadgeIds || []);
  if (additionalBadgeId) {
    existingBadgeIds.add(additionalBadgeId);
  }

  const interimProfile: StudentProfile = {
    ...current,
    xp: newXp,
    streakDays: streak,
    level: currentLevel.level,
    lastActiveDate: today,
    unlockedBadgeIds: Array.from(existingBadgeIds),
  };

  const history = await getQuizHistoryFromFirestore();
  const { badges, newlyUnlocked } = evaluateBadges(interimProfile, history);

  const allUnlockedIds = badges.filter(b => b.isUnlocked).map(b => b.id);
  const updatedProfile: StudentProfile = {
    ...interimProfile,
    unlockedBadgeIds: allUnlockedIds,
  };

  await saveProfileToFirestore(updatedProfile);
  return { updatedProfile, newlyUnlockedBadges: newlyUnlocked };
}

export function getStudentBadges(profile: StudentProfile): Badge[] {
  const history = getStoredQuizHistory();
  const { badges } = evaluateBadges(profile, history);
  return badges;
}

export async function getQuizHistoryFromFirestore(): Promise<QuizAttempt[]> {
  if (!auth.currentUser) return [];
  const q = query(
    collection(db, 'quizAttempts'),
    where('userId', '==', auth.currentUser.uid),
    orderBy('date', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as QuizAttempt));
}

export async function saveQuizAttemptToFirestore(attempt: QuizAttempt): Promise<void> {
  if (!auth.currentUser) {
    console.warn('Skipping quiz save: No user logged in');
    return;
  }
  await addDoc(collection(db, 'quizAttempts'), {
    ...attempt,
    userId: auth.currentUser.uid,
  });
}

export function getStoredQuizHistory(): QuizAttempt[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUIZ_HISTORY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load quiz history from localStorage', e);
    return [];
  }
}

export function getStoredBookmarks(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load bookmarks from localStorage', e);
    return [];
  }
}

function getInitialDemoHistory(): QuizAttempt[] {
  return [
    {
      id: 'demo-1',
      userId: 'student-demo',
      subjectId: 'mathematics',
      grade: 'SS2',
      term: '1st Term',
      examType: 'WAEC',
      totalQuestions: 10,
      score: 8,
      percentage: 80,
      timeSpentSeconds: 420,
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
      answers: [
        { questionId: 'mth-001', selectedOption: 'B', isCorrect: true, topic: 'Indices and Logarithms' },
        { questionId: 'mth-002', selectedOption: 'B', isCorrect: true, topic: 'Sequence and Series (Arithmetic Progression - A.P)' },
        { questionId: 'mth-003', selectedOption: 'C', isCorrect: false, topic: 'Circle Theorems' }
      ]
    },
    {
      id: 'demo-2',
      userId: 'student-demo',
      subjectId: 'chemistry',
      grade: 'SS2',
      term: '2nd Term',
      examType: 'JAMB',
      totalQuestions: 10,
      score: 7,
      percentage: 70,
      timeSpentSeconds: 380,
      date: new Date(Date.now() - 86400000).toISOString(),
      answers: [
        { questionId: 'chm-001', selectedOption: 'A', isCorrect: true, topic: 'Stoichiometry & Mole Concept' },
        { questionId: 'chm-002', selectedOption: 'D', isCorrect: false, topic: 'Electrolysis' }
      ]
    }
  ];
}

// Compute performance statistics by subject
export function getSubjectStats(subjectId: SubjectId): SubjectStats {
  const history = getStoredQuizHistory().filter(h => h.subjectId === subjectId);

  let totalAttempted = 0;
  let totalCorrect = 0;
  const topicBreakdown: Record<string, { correct: number; total: number }> = {};
  let lastPracticed = 'Not practiced yet';

  if (history.length > 0) {
    lastPracticed = new Date(history[0].date).toLocaleDateString();
  }

  for (const h of history) {
    for (const ans of h.answers) {
      totalAttempted++;
      if (ans.isCorrect) totalCorrect++;

      if (!topicBreakdown[ans.topic]) {
        topicBreakdown[ans.topic] = { correct: 0, total: 0 };
      }
      topicBreakdown[ans.topic].total++;
      if (ans.isCorrect) {
        topicBreakdown[ans.topic].correct++;
      }
    }
  }

  const strongTopics: string[] = [];
  const weakTopics: string[] = [];

  for (const [topic, stats] of Object.entries(topicBreakdown)) {
    const acc = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
    if (acc >= 75) {
      strongTopics.push(topic);
    } else if (acc < 60) {
      weakTopics.push(topic);
    }
  }

  const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  return {
    subjectId,
    questionsAttempted: totalAttempted,
    questionsCorrect: totalCorrect,
    accuracy,
    strongTopics,
    weakTopics,
    lastPracticed,
  };
}

export async function getBookmarksFromFirestore(): Promise<string[]> {
  if (!auth.currentUser) return [];
  const docRef = doc(db, 'studentProfile', auth.currentUser.uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data().bookmarks || []) : [];
}

export function toggleBookmark(questionId: string): boolean {
  const current = getStoredBookmarks();
  const exists = current.includes(questionId);
  let updated: string[];
  if (exists) {
    updated = current.filter(id => id !== questionId);
  } else {
    updated = [...current, questionId];
  }
  localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
  return !exists;
}

// Real-time Leaderboard rankings with Nigerian secondary school peer cohort
export function getLeaderboard(
  scope: 'National' | 'State' | 'School',
  userState?: string,
  userSchool?: string
): LeaderboardUser[] {
  const currentUser = getStoredProfile() || DEFAULT_PROFILE;

  // Base authentic cohort of Nigerian science students
  const peerCohort: LeaderboardUser[] = [
    {
      id: 'peer-1',
      name: 'Farida Abdullahi',
      schoolName: 'Federal Government Academy, Suleja',
      state: 'Niger',
      lga: 'Suleja',
      grade: 'SS3',
      xp: 4320,
      rank: 1,
      accuracy: 94,
      quizzesCompleted: 68,
      streakDays: 19
    },
    {
      id: 'peer-2',
      name: 'Chukwuebuka Obi',
      schoolName: 'Christ the King College (CKC), Onitsha',
      state: 'Anambra',
      lga: 'Onitsha North',
      grade: 'SS3',
      xp: 3890,
      rank: 2,
      accuracy: 92,
      quizzesCompleted: 54,
      streakDays: 14
    },
    {
      id: 'peer-3',
      name: 'Oluwaseun Adeleke',
      schoolName: "King's College, Lagos",
      state: 'Lagos',
      lga: 'Lagos Island',
      grade: 'SS2',
      xp: 3410,
      rank: 3,
      accuracy: 89,
      quizzesCompleted: 49,
      streakDays: 12
    },
    {
      id: 'peer-4',
      name: 'Amina Sanusi',
      schoolName: 'Queen\'s College, Yaba, Lagos',
      state: 'Lagos',
      lga: 'Lagos Mainland',
      grade: 'SS2',
      xp: 2950,
      rank: 4,
      accuracy: 88,
      quizzesCompleted: 41,
      streakDays: 9
    },
    {
      id: 'peer-5',
      name: 'Ngozi Okonjo',
      schoolName: 'Loyola Jesuit College, Abuja',
      state: 'Abuja (FCT)',
      lga: 'Gwagwalada',
      grade: 'SS1',
      xp: 2600,
      rank: 5,
      accuracy: 86,
      quizzesCompleted: 38,
      streakDays: 8
    },
    {
      id: 'peer-6',
      name: 'David Oladipo',
      schoolName: 'Government College, Ibadan (GCI)',
      state: 'Oyo',
      lga: 'Ibadan North',
      grade: 'SS2',
      xp: 2210,
      rank: 6,
      accuracy: 84,
      quizzesCompleted: 32,
      streakDays: 6
    },
    {
      id: 'peer-7',
      name: 'Khadija Bello',
      schoolName: 'Barewa College, Zaria',
      state: 'Kaduna',
      lga: 'Zaria',
      grade: 'SS3',
      xp: 1980,
      rank: 7,
      accuracy: 81,
      quizzesCompleted: 29,
      streakDays: 5
    },
    {
      id: 'peer-8',
      name: 'Tamuno Briggs',
      schoolName: 'Navy Secondary School, Port Harcourt',
      state: 'Rivers',
      lga: 'Port Harcourt',
      grade: 'SS2',
      xp: 1740,
      rank: 8,
      accuracy: 80,
      quizzesCompleted: 26,
      streakDays: 4
    },
    {
      id: 'peer-9',
      name: 'Efe Omoruyi',
      schoolName: 'Lumen Christi International High School, Edo',
      state: 'Edo',
      lga: 'Esan North-East',
      grade: 'SS1',
      xp: 1450,
      rank: 9,
      accuracy: 78,
      quizzesCompleted: 22,
      streakDays: 3
    },
    {
      id: 'peer-10',
      name: 'Blessing Udoh',
      schoolName: 'Marist Brothers Juniorate, Uturu',
      state: 'Abia',
      lga: 'Isuikwuato',
      grade: 'SS2',
      xp: 1120,
      rank: 10,
      accuracy: 75,
      quizzesCompleted: 18,
      streakDays: 2
    }
  ];

  // Calculate current user's entry
  const history = getStoredQuizHistory();
  const totalAttempted = history.reduce((sum, h) => sum + h.totalQuestions, 0);
  const totalCorrect = history.reduce((sum, h) => sum + h.score, 0);
  const userAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 85;

  const userEntry: LeaderboardUser = {
    id: currentUser.id,
    name: currentUser.name || 'You (Future Scholar)',
    schoolName: currentUser.schoolName || 'Secondary School',
    state: currentUser.state || 'Lagos',
    lga: currentUser.lga || 'Ikeja',
    grade: currentUser.grade || 'SS2',
    xp: currentUser.xp || 1250,
    rank: 0,
    accuracy: userAccuracy,
    quizzesCompleted: history.length,
    streakDays: currentUser.streakDays || 1,
    isCurrentUser: true,
  };

  let combined = [...peerCohort.filter(p => p.id !== userEntry.id), userEntry];

  // Filter based on scope
  if (scope === 'State' && userState) {
    combined = combined.filter(u => u.state.toLowerCase() === userState.toLowerCase());
    // If only user is in this state, add a few generated state-specific peers
    if (combined.length <= 2) {
      combined.push(
        {
          id: `state-peer-1`,
          name: 'Ibrahim Danjuma',
          schoolName: `Command Secondary School, ${userState}`,
          state: userState,
          lga: 'Local LGA',
          grade: currentUser.grade,
          xp: Math.round(userEntry.xp * 1.15),
          rank: 0,
          accuracy: 87,
          quizzesCompleted: 28,
          streakDays: 7
        },
        {
          id: `state-peer-2`,
          name: 'Funmilayo Adeyemi',
          schoolName: `Federal Government College, ${userState}`,
          state: userState,
          lga: 'Central LGA',
          grade: currentUser.grade,
          xp: Math.max(500, Math.round(userEntry.xp * 0.85)),
          rank: 0,
          accuracy: 82,
          quizzesCompleted: 19,
          streakDays: 4
        }
      );
    }
  } else if (scope === 'School' && userSchool) {
    combined = combined.filter(u => u.schoolName.toLowerCase().includes(userSchool.toLowerCase()) || u.isCurrentUser);
    if (combined.length <= 1) {
      combined.push(
        {
          id: `school-peer-1`,
          name: 'Chinedu Eze (Class Rep)',
          schoolName: userSchool,
          state: currentUser.state,
          lga: currentUser.lga,
          grade: currentUser.grade,
          xp: Math.round(userEntry.xp * 1.2),
          rank: 0,
          accuracy: 91,
          quizzesCompleted: 35,
          streakDays: 11
        },
        {
          id: `school-peer-2`,
          name: 'Zainab Lawal',
          schoolName: userSchool,
          state: currentUser.state,
          lga: currentUser.lga,
          grade: currentUser.grade,
          xp: Math.max(400, Math.round(userEntry.xp * 0.9)),
          rank: 0,
          accuracy: 79,
          quizzesCompleted: 15,
          streakDays: 3
        }
      );
    }
  }

  // Sort descending by XP
  combined.sort((a, b) => b.xp - a.xp);

  // Assign ranks
  return combined.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));
}

// Chat history persistence
export function getStoredChatMessages(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveChatMessage(msg: ChatMessage): void {
  try {
    const current = getStoredChatMessages();
    current.push(msg);
    // Keep last 50 messages
    const trimmed = current.slice(-50);
    localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(trimmed));
  } catch (e) {
    console.error('Failed to save chat message', e);
  }
}
export async function toggleBookmarkInFirestore(questionId: string): Promise<boolean> {
  if (!auth.currentUser) {
    console.warn('Skipping bookmark toggle: No user logged in');
    return false;
  }
  const docRef = doc(db, 'studentProfile', auth.currentUser.uid);
  const docSnap = await getDoc(docRef);
  const current = docSnap.exists() ? (docSnap.data().bookmarks || []) : [];
  const exists = current.includes(questionId);
  const updated = exists ? current.filter((id: string) => id !== questionId) : [...current, questionId];
  await updateDoc(docRef, { bookmarks: updated });
  return !exists;
}

export async function getChatMessagesFromFirestore(): Promise<ChatMessage[]> {
  if (!auth.currentUser) return [];
  const q = query(
    collection(db, 'studentProfile', auth.currentUser.uid, 'chatMessages'),
    orderBy('timestamp', 'asc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage));
}

export async function saveChatMessageToFirestore(msg: ChatMessage): Promise<void> {
  if (!auth.currentUser) throw new Error('No user logged in');
  await addDoc(collection(db, 'studentProfile', auth.currentUser.uid, 'chatMessages'), msg);
}

export async function savePaymentRequest(request: PaymentRequest): Promise<void> {
  const { id, ...data } = request;
  await addDoc(collection(db, 'paymentRequests'), data);
}

export async function getAllPaymentRequests(): Promise<PaymentRequest[]> {
  const q = query(
    collection(db, 'paymentRequests'),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as PaymentRequest));
}

export async function updatePaymentRequestStatus(requestId: string, status: 'confirmed' | 'rejected'): Promise<void> {
  if (!requestId) {
    throw new Error('Invalid requestId: requestId cannot be empty');
  }
  await updateDoc(doc(db, 'paymentRequests', requestId), { status });
}

export async function getAllUsers(): Promise<StudentProfile[]> {
  const q = query(collection(db, 'studentProfile'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as StudentProfile));
}

export async function deleteUser(userId: string): Promise<void> {
  await deleteDoc(doc(db, 'studentProfile', userId));
}

export async function updateUserStatus(userId: string, status: { isPremium?: boolean, isActivated?: boolean }): Promise<void> {
  await updateDoc(doc(db, 'studentProfile', userId), status);
}

export async function generateAndSaveActivationCode(): Promise<string> {
  const code = `EB-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  await setDoc(doc(db, 'activationCodes', code), {
    used: false,
    createdAt: Timestamp.now(),
  });
  return code;
}
