import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { SubjectId } from '../types';

interface AISearchViewProps {
  onBackToHome: () => void;
}

export const AISearchView: React.FC<AISearchViewProps> = ({ onBackToHome }) => {
  const [subject, setSubject] = useState<SubjectId>('mathematics');
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      // Server-side call to search/generate questions
      const response = await fetch("/api/ai/search-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, query }),
      });
      const data = await response.json();
      setResult(data.answer);
    } catch (error) {
      setResult('Error searching for questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">AI Exam Search</h2>
      <select value={subject} onChange={(e) => setSubject(e.target.value as SubjectId)} className="w-full p-2 border rounded-xl">
        <option value="mathematics">Mathematics</option>
        <option value="english">English Language</option>
        <option value="physics">Physics</option>
        <option value="chemistry">Chemistry</option>
        <option value="biology">Biology</option>
      </select>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter exam year or topic (e.g., 'WAEC 2025 Geometry')"
        className="w-full p-2 border rounded-xl"
      />
      <button
        onClick={handleSearch}
        disabled={isLoading}
        className="w-full py-2 bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center space-x-2"
      >
        {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
        <span>Search & Solve</span>
      </button>
      {result && (
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl mt-4 whitespace-pre-wrap text-sm">
          {result}
        </div>
      )}
    </div>
  );
};
