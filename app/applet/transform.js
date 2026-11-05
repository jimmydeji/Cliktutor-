const fs = require('fs');

const questions = JSON.parse(fs.readFileSync('/public/assets/aistudio/Paste_October_29__2026_-_3_25PM_962c7b96', 'utf8'));

const transformed = questions.map((q, index) => ({
  id: `phy-ss1-${(11 + index).toString().padStart(3, '0')}`,
  subjectId: 'physics',
  grade: 'SS1',
  term: '1st Term', // Simplified mapping for now
  topic: q.topic,
  examType: 'WAEC',
  year: q.year,
  question: q.question,
  options: {
    A: q.options[0],
    B: q.options[1],
    C: q.options[2],
    D: q.options[3]
  },
  correctOption: q.answer,
  explanation: q.explanation,
  difficulty: 'medium',
  verificationStatus: 'AI_GENERATED_PRACTICE',
  contentType: 'text'
}));

const fileContent = fs.readFileSync('/src/data/ss1PhysicsQuestions.ts', 'utf8');
const newContent = fileContent.replace('];', ',\n' + transformed.map(q => JSON.stringify(q, null, 2)).join(',\n') + '\n];');
fs.writeFileSync('/src/data/ss1PhysicsQuestions.ts', newContent);
