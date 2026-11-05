
import * as fs from 'fs';
import { Question, SubjectId, GradeLevel, Term, ExamType, VerificationStatus } from '../types';

interface InputQuestion {
  id: number;
  section: string;
  question: string;
  options: string[];
  answer: 'A' | 'B' | 'C' | 'D';
}

const inputFile = 'public/assets/aistudio/Paste_October_31__2026_-_12_03PM_d90dcc0f';
const outputFile = 'src/data/ss2Physics3rdTermQuestions.ts';

const fileContentRaw = fs.readFileSync(inputFile, 'utf-8');
const jsonContent = fileContentRaw.replace(/^```json\s*/, '').replace(/\s*```$/, '');
const rawData = JSON.parse(jsonContent);
const inputQuestions: InputQuestion[] = rawData.questions;

const questions: Question[] = inputQuestions.map((q) => ({
  id: `phys-ss2-3rd-${q.id}`,
  subjectId: 'physics' as SubjectId,
  grade: 'SS2' as GradeLevel,
  term: '3rd Term' as Term,
  topic: q.section,
  examType: 'WAEC' as 'WAEC' | 'JAMB' | 'NECO',
  year: 2026,
  questionNumber: q.id,
  question: q.question,
  options: {
    A: q.options[0],
    B: q.options[1],
    C: q.options[2],
    D: q.options[3],
  },
  correctOption: q.answer,
  explanation: 'Explanation will be added later.',
  difficulty: 'medium',
  verificationStatus: 'AI_GENERATED_PRACTICE' as VerificationStatus,
  contentType: 'text',
}));

const fileContent = `import { Question } from '../types';

export const SS2_PHYSICS_3RD_TERM_QUESTIONS: Question[] = ${JSON.stringify(questions, null, 2)};
`;

fs.writeFileSync(outputFile, fileContent);
console.log(`Generated ${questions.length} questions in ${outputFile}`);
