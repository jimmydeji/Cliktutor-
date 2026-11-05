import React, { useState } from 'react';
import { X, BookOpen, Search } from 'lucide-react';
import { InlineMath } from 'react-katex';
import { SubjectId } from '../types';
import { FORMULA_SHEET_DATA } from '../data/formulaSheet';

interface CheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectId: SubjectId;
}

export const CheatSheetModal: React.FC<CheatSheetModalProps> = ({ isOpen, onClose, subjectId }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const data = FORMULA_SHEET_DATA[subjectId] || { title: 'No Data', sections: [] };

  const filteredSections = data.sections.map((section: any) => ({
    ...section,
    formulas: section.formulas.filter((f: any) => 
      (f.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter((section: any) => section.formulas.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg max-h-[80vh] shadow-2xl p-5 relative flex flex-col">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 cursor-pointer">
          <X className="w-5 h-5 text-slate-500" />
        </button>
        
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center mb-4 shrink-0">
          <BookOpen className="w-5 h-5 mr-2 text-emerald-600" />
          {data.title}
        </h2>

        <div className="relative mb-4 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search formulas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="space-y-4 overflow-y-auto flex-1 pr-2">
          {filteredSections.map((section: any, idx: number) => (
            <div key={idx}>
              <h3 className="font-bold text-sm text-emerald-700 dark:text-emerald-400 mb-2">{section.topic}</h3>
              <div className="space-y-2">
                {section.formulas.map((f: any, fIdx: number) => (
                  <div key={fIdx} className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mb-3">
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{f.title}</div>
                    <div className="text-base text-emerald-800 dark:text-emerald-300 font-medium mt-2 p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                      <InlineMath math={f.value} />
                    </div>
                    {f.description && (
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">{f.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          {filteredSections.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-4">No formulas found.</p>
          )}
        </div>
      </div>
    </div>
  );
};
