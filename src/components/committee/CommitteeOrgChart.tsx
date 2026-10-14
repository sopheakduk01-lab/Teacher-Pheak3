import React from 'react';
import { Users, Edit3, ShieldCheck } from 'lucide-react';
import { OfficialCommitteeData, CommitteeMember } from '../../types/committeeTypes';

interface Props {
  data: OfficialCommitteeData;
  onUpdateData: (data: OfficialCommitteeData) => void;
  onEditMember?: (member: CommitteeMember) => void;
  onShowToast?: (msg: string) => void;
}

export const CommitteeOrgChart: React.FC<Props> = ({
  data,
  onEditMember,
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" />
            រចនាសម្ព័ន្ធគណៈកម្មការគ្រប់គ្រងថ្នាក់រៀន
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {data.schoolName} — {data.gradeName} (ឆ្នាំសិក្សា {data.academicYear})
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {data.members.map((m, idx) => (
          <div
            key={m.id || idx}
            onClick={() => onEditMember && onEditMember(m)}
            className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 dark:bg-slate-750 dark:border-slate-600 hover:shadow-md transition cursor-pointer relative group"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-800 dark:text-amber-300">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-amber-900 dark:text-amber-200 truncate">
                {m.role}
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{m.name}</h4>
            <p className="text-xs text-slate-500 mt-1">ភេទ: {m.gender}</p>
            {m.phone && <p className="text-xs text-slate-400 mt-0.5">ទូរស័ព្ទ: {m.phone}</p>}
            {m.duties && (
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 bg-white/70 dark:bg-slate-800/80 p-1.5 rounded-md">
                {m.duties}
              </p>
            )}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
              <Edit3 className="w-3.5 h-3.5 text-amber-700" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
