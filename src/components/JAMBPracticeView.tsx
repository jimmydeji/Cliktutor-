import React, { useState, useEffect } from 'react';
import { SubjectId, Question } from '../types';
import { queryQuestions } from '../data/questionBank';

interface JAMBPracticeViewProps {
  onBackToHome: () => void;
}

export const JAMBPracticeView: React.FC<JAMBPracticeViewProps> = ({ onBackToHome }) => {
  const subjects: SubjectId[] = ['mathematics', 'physics', 'chemistry', 'biology', 'english'];
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectId[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [questionMode, setQuestionMode] = useState<'authentic' | 'practice' | 'all'>('all');

  const toggleSubject = (subject: SubjectId) => {
    setSelectedSubjects(prev => {
      const updated = prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject];
      console.log('Selected subjects updated:', updated);
      return updated;
    });
  };

  const startPractice = async () => {
    console.log('Fetching questions for subjects:', selectedSubjects, 'Mode:', questionMode);
    setIsLoading(true);
    
    // Fetch 50 questions per selected subject
    const allQuestions: Question[] = [];
    for (const subjectId of selectedSubjects) {
      const subjectQuestions = await queryQuestions({ subjectId, examType: 'JAMB', count: 50, mode: questionMode });
      allQuestions.push(...subjectQuestions);
    }
    
    console.log('Questions fetched:', allQuestions.length);
    if (allQuestions.length === 0) {
      alert("No questions found for selected subjects.");
      setIsLoading(false);
      return;
    }
    
    setQuestions(allQuestions.sort(() => 0.5 - Math.random()));
    setTimeLeft(selectedSubjects.length * 50 * 60); // 1 min per question
    setIsLoading(false);
    setIsStarted(true);
    setIsSubmitted(false);
    setUserAnswers({});
    setScore(0);
    setCurrentIndex(0);
  };

  const handleSubmit = () => {
    const finalScore = questions.filter(q => userAnswers[q.id] === q.correctOption).length;
    setScore(finalScore);
    setIsSubmitted(true);
  };

  useEffect(() => {
    if (isStarted && !isSubmitted && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && isStarted && !isSubmitted) {
      handleSubmit();
    }
  }, [isStarted, isSubmitted, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) return <div className="p-4 text-center">Loading...</div>;

  if (isSubmitted) {
    return (
      <div className="p-4 pb-24">
        <h2 className="text-2xl font-bold mb-4">Exam Results</h2>
        <div className="text-3xl font-bold mb-6 text-emerald-600">Score: {score} / {questions.length}</div>
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div key={q.id} className={`p-4 border rounded-xl ${userAnswers[q.id] === q.correctOption ? 'bg-emerald-50' : 'bg-rose-50'}`}>
              <p className="font-semibold">{idx + 1}. {q.question}</p>
              <p>Your Answer: {userAnswers[q.id] || 'Not answered'}</p>
              <p>Correct Answer: {q.correctOption}</p>
            </div>
          ))}
        </div>
        <button onClick={startPractice} className="mt-6 w-full py-3 bg-emerald-600 text-white rounded-lg font-bold">Retake Exam</button>
        <button onClick={onBackToHome} className="mt-2 w-full py-3 bg-slate-200 rounded-lg font-bold">Back to Home</button>
      </div>
    );
  }

  if (isStarted) {
    const currentQuestion = questions[currentIndex];
    return (
      <div className="p-4 pb-24">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">JAMB Exam</h2>
          <div className="font-mono font-bold text-lg text-rose-600">{formatTime(timeLeft)}</div>
        </div>
        
        <div className="p-4 border rounded-xl mb-4">
          <p className="font-semibold mb-4">{currentQuestion.question}</p>
          <div className="space-y-2">
            {Object.entries(currentQuestion.options).map(([key, value]) => (
              <button 
                key={key} 
                onClick={() => setUserAnswers(prev => ({...prev, [currentQuestion.id]: key}))}
                className={`w-full p-3 border rounded-xl text-left ${userAnswers[currentQuestion.id] === key ? 'bg-emerald-100 border-emerald-500' : ''}`}
              >
                {key}: {value}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between">
          <button disabled={currentIndex === 0} onClick={() => setCurrentIndex(prev => prev - 1)} className="px-4 py-2 bg-slate-200 rounded-lg">Prev</button>
          <span>{currentIndex + 1} / {questions.length}</span>
          <button disabled={currentIndex === questions.length - 1} onClick={() => setCurrentIndex(prev => prev + 1)} className="px-4 py-2 bg-slate-200 rounded-lg">Next</button>
        </div>
        <button onClick={handleSubmit} className="mt-6 w-full py-3 bg-rose-600 text-white rounded-lg font-bold">Submit Exam</button>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24">
      <h2 className="text-2xl font-bold mb-4">Select JAMB Subjects</h2>
      
      <div className="flex mb-6 border-b">
        <button
          onClick={() => setQuestionMode('authentic')}
          className={`flex-1 py-2 text-sm font-semibold ${questionMode === 'authentic' ? 'border-b-2 border-emerald-600 text-emerald-700' : 'text-slate-500'}`}
        >
          Authentic Past Questions
        </button>
        <button
          onClick={() => setQuestionMode('practice')}
          className={`flex-1 py-2 text-sm font-semibold ${questionMode === 'practice' ? 'border-b-2 border-emerald-600 text-emerald-700' : 'text-slate-500'}`}
        >
          AI Simulation Practice
        </button>
        <button
          onClick={() => setQuestionMode('all')}
          className={`flex-1 py-2 text-sm font-semibold ${questionMode === 'all' ? 'border-b-2 border-emerald-600 text-emerald-700' : 'text-slate-500'}`}
        >
          All
        </button>
      </div>

      <p className="text-slate-600 mb-6">Select up to 4 subjects to practice together (50 questions each).</p>
      <div className="grid grid-cols-2 gap-4">
        {subjects.map(subject => (
          <button
            key={subject}
            onClick={() => toggleSubject(subject)}
            disabled={!selectedSubjects.includes(subject) && selectedSubjects.length >= 4}
            className={`p-4 rounded-lg border font-medium ${selectedSubjects.includes(subject) ? 'bg-emerald-100 border-emerald-500' : 'bg-white border-slate-200'} disabled:opacity-50`}
          >
            {subject.charAt(0).toUpperCase() + subject.slice(1)}
          </button>
        ))}
      </div>
      <button
        disabled={selectedSubjects.length === 0}
        onClick={startPractice}
        className="mt-6 w-full py-3 bg-emerald-600 text-white rounded-lg font-bold disabled:bg-slate-300"
      >
        Start Practice Simulation ({selectedSubjects.length * 50} Questions, {selectedSubjects.length * 50} mins)
      </button>
    </div>
  );
};
