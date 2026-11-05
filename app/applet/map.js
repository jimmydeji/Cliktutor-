const fs = require('fs');
const questions = JSON.parse(fs.readFileSync('/app/applet/public/assets/aistudio/Paste_October_29__2026_-_3_25PM_962c7b96', 'utf8'));

const mapped = questions.map((q, idx) => ({
  id: `phy-ss1-${idx}`,
  subjectId: 'physics',
  grade: 'SS1',
  term: idx < 70 ? '1st Term' : (idx < 135 ? '2nd Term' : '3rd Term'),
  topic: q.topic,
  examType: 'WAEC',
  year: q.year,
  questionNumber: idx + 1,
  question: q.question,
  options: { A: q.options[0], B: q.options[1], C: q.options[2], D: q.options[3] },
  correctOption: q.answer,
  explanation: q.explanation,
  difficulty: 'medium',
  verificationStatus: 'AI_GENERATED_PRACTICE',
  contentType: 'text'
}));

console.log(JSON.stringify(mapped, null, 2));
