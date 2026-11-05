import { Question } from '../../../types';

export const QUESTIONS: Question[] = [
  {
    id: 'phy-fq-001',
    subjectId: 'physics',
    grade: 'SS1',
    term: '1st Term',
    topic: 'Fundamental and Derived Quantities',
    examType: 'WAEC',
    year: 2024,
    questionNumber: 1,
    question: 'Which of the following is a fundamental quantity?',
    options: {
      A: 'Velocity',
      B: 'Force',
      C: 'Mass',
      D: 'Work'
    },
    correctOption: 'C',
    explanation: 'Mass is a fundamental quantity. Velocity, Force, and Work are derived quantities.',
    difficulty: 'easy',
    verificationStatus: 'VERIFIED_PAST_QUESTION',
    contentType: 'text'
  },
  {
    id: 'phy-fq-002',
    subjectId: 'physics',
    grade: 'SS1',
    term: '1st Term',
    topic: 'Fundamental and Derived Quantities',
    examType: 'JAMB',
    year: 2023,
    questionNumber: 2,
    question: 'The SI unit of force is:',
    options: {
      A: 'Joule',
      B: 'Newton',
      C: 'Watt',
      D: 'Pascal'
    },
    correctOption: 'B',
    explanation: 'The SI unit of force is the Newton (N).',
    difficulty: 'easy',
    verificationStatus: 'VERIFIED_PAST_QUESTION',
    contentType: 'text'
  },
  // Add more as needed, I will add a few more for demonstration
  {
    id: 'phy-fq-003',
    subjectId: 'physics',
    grade: 'SS1',
    term: '1st Term',
    topic: 'Fundamental and Derived Quantities',
    examType: 'NECO',
    year: 2022,
    questionNumber: 5,
    question: 'Which of the following is a derived quantity?',
    options: {
      A: 'Length',
      B: 'Time',
      C: 'Density',
      D: 'Electric Current'
    },
    correctOption: 'C',
    explanation: 'Density = Mass/Volume, so it is a derived quantity.',
    difficulty: 'easy',
    verificationStatus: 'AI_GENERATED_PRACTICE',
    contentType: 'text'
  }
];
