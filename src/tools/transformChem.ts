
import fs from 'fs';

// This is a helper script to transform the user provided JSON to our Question format
// Run it with: npx tsx src/tools/transformChem.ts

const inputPath = 'public/assets/aistudio/Paste_October_30__2026_-_12_04PM_73503244';
const outputPath = 'src/data/ss1ChemistryQuestionsTransformed.ts';

// The input file starts with ```json and ends with ```
let fileContent = fs.readFileSync(inputPath, 'utf-8');
fileContent = fileContent.replace('```json', '').replace('```', '');

const data = JSON.parse(fileContent);

const transformed = data.questions.map((q: any) => ({
  id: `chm-ss1-${q.id.toString().padStart(3, '0')}`,
  subjectId: 'chemistry',
  grade: 'SS1',
  term: '1st Term',
  topic: q.section,
  examType: 'JAMB',
  year: 2026,
  questionNumber: q.id,
  question: q.question,
  options: { 
    A: q.options[0], 
    B: q.options[1], 
    C: q.options[2], 
    D: q.options[3] 
  },
  correctOption: q.answer,
  explanation: '',
  difficulty: 'medium',
  verificationStatus: 'AI_GENERATED_PRACTICE',
  contentType: 'text',
}));

const tsContent = `import { Question } from '../types';

export const SS1_CHEMISTRY_QUESTIONS: Question[] = ${JSON.stringify(transformed, null, 2)};
`;

fs.writeFileSync(outputPath, tsContent);
console.log('Transformed chemistry questions saved to', outputPath);
