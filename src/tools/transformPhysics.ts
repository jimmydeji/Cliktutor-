
import fs from 'fs';

// This is a helper script to transform the user provided JSON to our Question format
// Run it with: npx tsx src/tools/transformPhysics.ts

const inputPath = 'public/assets/aistudio/ClikTutor_SS1_Physics_Question_Bank_deef119b.json';
const outputPath = 'src/data/ss1PhysicsQuestionsTransformed.ts';

const data = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

function mapTerm(term: string) {
    if (term === 'First Term') return '1st Term';
    if (term === 'Second Term') return '2nd Term';
    if (term === 'Third Term') return '3rd Term';
    return '1st Term';
}

const transformed = data.questions.map((q: any) => ({
  id: q.id,
  subjectId: 'physics',
  grade: q.class, // SS1
  term: mapTerm(q.term),
  topic: q.topic,
  examType: 'JAMB',
  year: 2026,
  questionNumber: parseInt(q.id.split('-').pop() || '1'),
  question: q.question,
  options: q.options,
  correctOption: q.correctAnswer,
  explanation: q.explanation || q.answerText,
  difficulty: 'medium',
  verificationStatus: 'AI_GENERATED_PRACTICE',
  contentType: 'text',
}));

const fileContent = `import { Question } from '../types';

export const SS1_PHYSICS_QUESTIONS: Question[] = ${JSON.stringify(transformed, null, 2)};
`;

fs.writeFileSync(outputPath, fileContent);
console.log('Transformed questions saved to', outputPath);
