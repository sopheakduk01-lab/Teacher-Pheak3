import React from 'react';
import { ExternalLink } from 'lucide-react';

interface MoeysCpdCardProps {
  className?: string;
}

export const MoeysCpdCard: React.FC<MoeysCpdCardProps> = ({ className = '' }) => {
  const targetUrl = 'https://sala.moeys.gov.kh/kh';

  return (
    <a
      href={targetUrl}
      target="_blank"
      rel="noreferrer"
      className={`min-w-[270px] sm:min-w-[295px] h-44 bg-white dark:bg-slate-800 rounded-[30px] p-5 text-slate-900 dark:text-white flex flex-col justify-between shadow-xs border border-blue-200/90 dark:border-blue-700/60 hover:border-blue-400 shrink-0 snap-start relative group hover:scale-[1.01] transition-all duration-300 ${className}`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
         <img src="https://img.freepik.com/free-vector/modern-business-data-analysis-concept_114360-3161.jpg" alt="Decoration" className="w-full h-full object-cover" />
      </div>

      <div className="flex items-center justify-between relative z-10">
        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
          <span className="text-2xl">🏛️</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-extrabold text-[10px]">
          <span className="font-semibold uppercase tracking-wider">MOEYS CPD</span>
          <ExternalLink className="w-3 h-3" />
        </div>
      </div>

      <div className="relative z-10 space-y-1">
        <h3 className="font-extrabold text-lg text-slate-800 dark:text-white leading-tight">
          វិបសាយ MOEYS CPD
        </h3>
        <p className="text-xs text-slate-500 font-medium">
          sala.moeys.gov.kh/kh
        </p>
      </div>
    </a>
  );
};
