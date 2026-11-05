const fs = require('fs');

const rawData = JSON.parse(fs.readFileSync('public/assets/aistudio/Paste_October_29__2026_-_3_25PM_962c7b96', 'utf8'));
const questions = rawData.questions;

const transformed = questions.map((q, index) => {
    let term = q.term;
    if (term === 'First Term') term = '1st Term';
    if (term === 'Second Term') term = '2nd Term';
    if (term === 'Third Term') term = '3rd Term';

    return {
        id: `phy-ss1-${(index + 1).toString().padStart(3, '0')}`,
        subjectId: 'physics',
        grade: 'SS1',
        term: term,
        topic: q.topic,
        examType: 'WAEC',
        year: 2026,
        question: q.question,
        options: q.options,
        correctOption: q.correctAnswer,
        explanation: q.explanation || '',
        difficulty: 'medium',
        verificationStatus: 'AI_GENERATED_PRACTICE',
        contentType: 'text'
    };
});

console.log(JSON.stringify(transformed, null, 2));
