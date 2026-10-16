import React, { useState } from 'react';
import { Search, Play, BookOpen, Calculator, Sparkles, Laptop, Globe } from 'lucide-react';
import { Quiz } from '../types';
import { PLPTabletBanner } from './PLPTabletBanner';

interface DiscoverTabProps {
  quizzes: Quiz[];
  onPlayQuiz: (quiz: Quiz) => void;
}

export const DiscoverTab: React.FC<DiscoverTabProps> = ({ quizzes, onPlayQuiz }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'ទាំងអស់', icon: Sparkles },
    { id: 'គណិតវិទ្យា', label: 'គណិតវិទ្យា', icon: Calculator },
    { id: 'ភាសាខ្មែរ', label: 'ភាសាខ្មែរ', icon: BookOpen },
    { id: 'វិទ្យាសាស្ត្រ', label: 'វិទ្យាសាស្ត្រ', icon: Globe },
    { id: 'អប់រំសុខភាព', label: 'អប់រំសុខភាព', icon: Sparkles },
    { id: 'ភាសាអង់គ្លេស', label: 'ភាសាអង់គ្លេស', icon: BookOpen },
    { id: 'ព័ត៌មានវិទ្យា', label: 'ព័ត៌មានវិទ្យា', icon: Laptop },
  ];

  const filtered = quizzes.filter((q) => {
    const matchSearch =
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat =
      selectedCategory === 'all' ||
      (selectedCategory === 'អប់រំសុខភាព'
        ? q.subject.includes('សុខភាព') || q.title.includes('សុខភាព')
        : selectedCategory === 'ភាសាអង់គ្លេស'
        ? q.subject.includes('អង់គ្លេស') || q.title.toLowerCase().includes('english')
        : q.subject.includes(selectedCategory));
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-4">
      {/* Self Study Kru Banner Card */}
      <PLPTabletBanner />

      {/* Search Input */}
      <div className="relative max-w-xl">
        <input
          type="text"
          placeholder="ស្វែងរកប្រធានបទ លំហាត់ ឬមេរៀន..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-xs"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar text-xs font-semibold">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full shrink-0 flex items-center gap-1.5 transition ${
                isActive
                  ? 'bg-purple-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      <h3 className="font-bold text-slate-800 text-sm pt-2">
        មេរៀនពេញនិយមពីគ្រូ និងក្រសួង ({filtered.length})
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filtered.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-white p-4 rounded-3xl border border-slate-200/80 flex gap-3.5 items-center shadow-xs hover:border-purple-300 transition"
          >
            <img
              src={quiz.imageUrl}
              alt={quiz.title}
              className="w-20 h-20 rounded-2xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] bg-purple-100 text-purple-900 font-bold px-2 py-0.5 rounded-md">
                {quiz.subject}
              </span>
              <h4 className="font-bold text-xs text-slate-800 mt-1 line-clamp-2">{quiz.title}</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                {quiz.questionCount} សំណួរ • {quiz.grade}
              </p>
            </div>
            <button
              onClick={() => onPlayQuiz(quiz)}
              className="bg-purple-50 hover:bg-purple-100 text-purple-900 p-3 rounded-2xl transition active:scale-95 shrink-0"
              aria-label="Play Quiz"
            >
              <Play className="w-4 h-4 fill-current" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
