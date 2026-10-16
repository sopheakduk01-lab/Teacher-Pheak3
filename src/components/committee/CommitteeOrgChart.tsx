import React, { useState } from 'react';
import { Layers, Edit3, Check, UserCheck, ShieldCheck, Sparkles, Building2, Users } from 'lucide-react';
import { CommitteeMember, OfficialCommitteeData } from '../../types/committeeTypes';

interface Props {
  data: OfficialCommitteeData;
  onUpdateData: (newData: OfficialCommitteeData) => void;
  onEditMember: (member: CommitteeMember) => void;
  onShowToast: (msg: string) => void;
}

export const CommitteeOrgChart: React.FC<Props> = ({
  data,
  onUpdateData,
  onEditMember,
  onShowToast,
}) => {
  const [isEditingIntro, setIsEditingIntro] = useState(false);
  const [introDraft, setIntroDraft] = useState(data.introDescription);

  const handleSaveIntro = () => {
    onUpdateData({ ...data, introDescription: introDraft });
    setIsEditingIntro(false);
    onShowToast('✨ បានកែសម្រួលសេចក្តីផ្តើមរចនាសម្ព័ន្ធរួចរាល់!');
  };

  const president = data.members.find((m) => m.roleTitle.includes('ប្រធាន') && !m.roleTitle.includes('អនុ') && !m.roleTitle.includes('ថ្នាក់')) || data.members[0];
  const vp1 = data.members.find((m) => m.roleTitle.includes('អនុប្រធានទី១') || m.id === 'mem_2') || data.members[1];
  const vp2 = data.members.find((m) => m.roleTitle.includes('អនុប្រធានទី២') || m.id === 'mem_3') || data.members[2];
  const teacherMember = data.members.find((m) => m.category === 'teacher' || m.id === 'mem_4') || data.members[3];
  const otherMembers = data.members.filter((m) => m.category === 'student' || (m.roleTitle.includes('សមាជិក') && m.id !== 'mem_1' && m.id !== 'mem_2' && m.id !== 'mem_3' && m.id !== 'mem_4'));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest block">
                ផ្នែកទី ១ • {data.schoolName} • {data.gradeName}
              </span>
              <h2 className="text-lg sm:text-xl font-black font-moul text-slate-900 dark:text-white mt-0.5">
                ១. រចនាសម្ព័ន្ធគណៈកម្មការគ្រប់គ្រងថ្នាក់រៀន (គំនូសបំព្រួញ)
              </h2>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 bg-amber-50 dark:bg-slate-800 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-slate-700 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs">
            <Users className="w-3.5 h-3.5 text-amber-500" />
            <span>សមាជិកសរុប {data.members.length} រូប</span>
          </span>
        </div>
      </div>

      {/* Intro Description Editor Box */}
      <div className="bg-amber-50/70 dark:bg-slate-800/60 p-4 sm:p-5 rounded-2xl border border-amber-200/80 dark:border-slate-700 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-black font-moul text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>សេចក្តីផ្តើម & និយមន័យរចនាសម្ព័ន្ធ</span>
          </span>
          <button
            onClick={() => {
              if (isEditingIntro) {
                handleSaveIntro();
              } else {
                setIntroDraft(data.introDescription);
                setIsEditingIntro(true);
              }
            }}
            className="px-2.5 py-1 bg-white dark:bg-slate-700 hover:bg-amber-100 text-amber-900 dark:text-amber-300 rounded-lg text-xs font-bold border border-amber-300 dark:border-slate-600 transition flex items-center gap-1"
          >
            {isEditingIntro ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span>{isEditingIntro ? 'រក្សាទុក' : 'កែសម្រួលសេចក្តីផ្តើម'}</span>
          </button>
        </div>

        {isEditingIntro ? (
          <div className="space-y-2 pt-1">
            <textarea
              value={introDraft}
              onChange={(e) => setIntroDraft(e.target.value)}
              rows={3}
              className="w-full p-3 text-xs sm:text-sm rounded-xl border border-amber-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
            />
            <p className="text-[11px] text-slate-500">
              💡 អ្នកអាចកែសម្រួលខ្លឹមសារសេចក្តីផ្តើមនេះដើម្បីបង្ហាញលើទំព័ររចនាសម្ព័ន្ធ និងទម្រង់បោះពុម្ព។
            </p>
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-serif">
            {data.introDescription}
          </p>
        )}
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 text-center italic">
        👉 ចុចលើប្រអប់តួនាទីណាមួយដើម្បីកែសម្រួលឈ្មោះ តួនាទី ឬការតំណាង
      </p>

      {/* Hierarchical Tree Diagram */}
      <div className="py-6 flex flex-col items-center space-y-6 max-w-4xl mx-auto overflow-x-auto">
        
        {/* LEVEL 1: PRESIDENT (ប្រធាន) */}
        {president && (
          <div className="relative flex flex-col items-center group">
            <div
              onClick={() => onEditMember(president)}
              className="cursor-pointer bg-gradient-to-br from-amber-500 via-amber-400 to-yellow-500 p-0.5 rounded-2xl shadow-xl hover:scale-105 transition-all duration-200 w-64 sm:w-72 text-center"
            >
              <div className="bg-white dark:bg-slate-900 p-4 rounded-[14px] space-y-1">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="px-3 py-0.5 rounded-full bg-red-100 text-red-700 font-moul text-xs font-black border border-red-200 shadow-2xs">
                    {president.roleTitle}
                  </span>
                  <Edit3 className="w-3.5 h-3.5 text-amber-500 opacity-0 group-hover:opacity-100 transition" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-moul">
                  {president.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {president.representation}
                </p>
                <div className="text-[10px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-amber-200/50 mt-1">
                  {president.dutySummary}
                </div>
              </div>
            </div>
            {/* Connector line down */}
            <div className="w-0.5 h-6 bg-amber-400/80 dark:bg-slate-600" />
          </div>
        )}

        {/* LEVEL 2: VICE PRESIDENTS & TEACHER (អនុប្រធាន & គ្រូបន្ទុកថ្នាក់) */}
        <div className="relative w-full">
          {/* Horizontal Connecting Branch */}
          <div className="hidden sm:block absolute top-0 left-16 right-16 h-0.5 bg-amber-300 dark:bg-slate-700" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            {/* VP 1 (Left) */}
            {vp1 && (
              <div
                onClick={() => onEditMember(vp1)}
                className="cursor-pointer bg-white dark:bg-slate-800 p-4 rounded-2xl border-2 border-red-300 dark:border-red-800/60 shadow-md hover:scale-102 hover:border-red-500 transition text-center flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="text-xs font-moul text-red-600 dark:text-red-400 font-bold block">
                      {vp1.roleTitle}
                    </span>
                    <Edit3 className="w-3 h-3 text-red-400 opacity-0 group-hover:opacity-100 transition" />
                  </div>
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    {vp1.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {vp1.representation}
                  </p>
                </div>
                <span className="text-[10px] text-red-800 dark:text-red-300 bg-red-50 dark:bg-slate-900 p-2 rounded-xl mt-2 border border-red-100 dark:border-slate-700">
                  {vp1.dutySummary}
                </span>
              </div>
            )}

            {/* Teacher / Secretary (Middle) */}
            {teacherMember && (
              <div
                onClick={() => onEditMember(teacherMember)}
                className="cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800 p-4 rounded-2xl border-2 border-blue-400 dark:border-blue-600 shadow-md hover:scale-102 hover:border-blue-500 transition text-center flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="text-xs font-moul text-blue-700 dark:text-blue-300 font-bold block">
                      {teacherMember.roleTitle}
                    </span>
                    <Edit3 className="w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100 transition" />
                  </div>
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    {teacherMember.name}
                  </h4>
                  <p className="text-[11px] text-blue-600 dark:text-blue-300 font-bold mt-0.5">
                    {teacherMember.representation}
                  </p>
                </div>
                <span className="text-[10px] text-blue-800 dark:text-blue-200 bg-white dark:bg-slate-900 p-2 rounded-xl mt-2 border border-blue-200 dark:border-slate-700">
                  {teacherMember.dutySummary}
                </span>
              </div>
            )}

            {/* VP 2 (Right) */}
            {vp2 && (
              <div
                onClick={() => onEditMember(vp2)}
                className="cursor-pointer bg-white dark:bg-slate-800 p-4 rounded-2xl border-2 border-red-300 dark:border-red-800/60 shadow-md hover:scale-102 hover:border-red-500 transition text-center flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="text-xs font-moul text-red-600 dark:text-red-400 font-bold block">
                      {vp2.roleTitle}
                    </span>
                    <Edit3 className="w-3 h-3 text-red-400 opacity-0 group-hover:opacity-100 transition" />
                  </div>
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    {vp2.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {vp2.representation}
                  </p>
                </div>
                <span className="text-[10px] text-red-800 dark:text-red-300 bg-red-50 dark:bg-slate-900 p-2 rounded-xl mt-2 border border-red-100 dark:border-slate-700">
                  {vp2.dutySummary}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* LEVEL 3: MEMBERS (សមាជិក) */}
        <div className="w-full pt-4">
          <div className="text-center mb-3">
            <span className="text-xs font-black font-moul text-slate-600 dark:text-slate-400">
              សមាជិក គណៈកម្មការគ្រប់គ្រងថ្នាក់រៀន
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {otherMembers.map((m) => (
              <div
                key={m.id}
                onClick={() => onEditMember(m)}
                className="cursor-pointer bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs hover:border-amber-400 hover:shadow-md transition text-center flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="text-xs font-moul text-slate-800 dark:text-slate-200 font-bold block">
                      {m.roleTitle}
                    </span>
                    <Edit3 className="w-3 h-3 text-amber-500 opacity-0 group-hover:opacity-100 transition" />
                  </div>
                  <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {m.name}
                  </h5>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {m.representation}
                  </p>
                </div>
                <p className="text-[10px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/80 p-2 rounded-xl mt-2 border border-slate-100 dark:border-slate-700">
                  {m.dutySummary}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
