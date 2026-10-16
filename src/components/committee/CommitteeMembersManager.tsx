import React, { useState } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Edit3,
  Upload,
  Check,
  Phone,
  Sparkles,
  UserCheck,
  ShieldCheck,
  X,
  ListPlus,
  ArrowUpDown,
} from 'lucide-react';
import { CommitteeMember, OfficialCommitteeData } from '../../types/committeeTypes';
import { compressImageFile } from '../../utils/imageCompressor';

interface Props {
  data: OfficialCommitteeData;
  onUpdateData: (newData: OfficialCommitteeData) => void;
  onShowToast: (msg: string) => void;
}

export const CommitteeMembersManager: React.FC<Props> = ({
  data,
  onUpdateData,
  onShowToast,
}) => {
  const [editingMember, setEditingMember] = useState<CommitteeMember | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newDutyInput, setNewDutyInput] = useState('');

  const handleOpenAddModal = () => {
    const newMem: CommitteeMember = {
      id: `mem_${Date.now()}`,
      roleTitle: 'សមាជិក',
      name: '',
      category: 'parent',
      representation: `ជាតំណាងមាតាបិតាសិស្ស${data.gradeName}`,
      dutySummary: 'ចូលរួមគ្រប់សកម្មភាពរបស់ថ្នាក់រៀន និងតាមដានការរៀនរបស់កូន',
      dutyDetails: [
        'ជំរុញកូនឱ្យមករៀនទៀងទាត់',
        'ចូលរួមគ្រប់សកម្មភាពរបស់ថ្នាក់រៀន',
        'ទំនាក់ទំនងជាមួយគ្រូបន្ទុកថ្នាក់',
      ],
      votesCount: 0,
      phone: '',
      photoUrl: '',
    };
    setEditingMember(newMem);
    setIsAddingNew(true);
  };

  const handleSaveMember = (mem: CommitteeMember) => {
    if (!mem.name.trim()) {
      onShowToast('⚠️ សូមបញ្ចូលឈ្មោះសមាជិក!');
      return;
    }

    let updatedMembers = [...data.members];
    if (isAddingNew) {
      updatedMembers.push(mem);
      onShowToast(`✨ បានបន្ថែម «${mem.name}» ជាសមាជិកថ្មី!`);
    } else {
      updatedMembers = updatedMembers.map((m) => (m.id === mem.id ? mem : m));
      onShowToast(`💾 បានកែសម្រួលព័ត៌មាន «${mem.name}» រួចរាល់!`);
    }

    onUpdateData({ ...data, members: updatedMembers });
    setEditingMember(null);
    setIsAddingNew(false);
  };

  const handleDeleteMember = (id: string, name: string) => {
    if (confirm(`តើអ្នកពិតជាចង់លុបសមាជិក «${name}» ចេញពី គ. គ. ថ. មែនទេ?`)) {
      const updatedMembers = data.members.filter((m) => m.id !== id);
      onUpdateData({ ...data, members: updatedMembers });
      onShowToast(`🗑️ បានលុបសមាជិក «${name}» រួចរាល់!`);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, memberId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await compressImageFile(file, { maxWidth: 500, maxHeight: 500, quality: 0.85 });
      const updated = data.members.map((m) => (m.id === memberId ? { ...m, photoUrl: base64 } : m));
      onUpdateData({ ...data, members: updated });
      onShowToast('📷 បានបញ្ចូលរូបថតសមាជិករួចរាល់!');
    } catch {
      onShowToast('បរាជ័យក្នុងការបញ្ចូលរូបភាព');
    }
  };

  const handleAddDutyDetail = () => {
    if (!newDutyInput.trim() || !editingMember) return;
    setEditingMember({
      ...editingMember,
      dutyDetails: [...editingMember.dutyDetails, newDutyInput.trim()],
    });
    setNewDutyInput('');
  };

  const handleRemoveDutyDetail = (index: number) => {
    if (!editingMember) return;
    const updatedDetails = editingMember.dutyDetails.filter((_, idx) => idx !== index);
    setEditingMember({
      ...editingMember,
      dutyDetails: updatedDetails,
    });
  };

  const handleEditDutyDetail = (index: number, val: string) => {
    if (!editingMember) return;
    const updatedDetails = [...editingMember.dutyDetails];
    updatedDetails[index] = val;
    setEditingMember({
      ...editingMember,
      dutyDetails: updatedDetails,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl">
              <Users className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest block">
                ផ្នែកទី ២ • សមាសភាព & ភារកិច្ចលម្អិត
              </span>
              <h2 className="text-base sm:text-xl font-black font-moul text-slate-900 dark:text-white mt-0.5">
                ២. បំណែងចែកភារកិច្ច & រូបថតសមាជិក (គ. គ. ថ.)
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            អ្នកអាចកែសម្រួលព័ត៌មាន បន្ថែម/លុបសមាជិក បញ្ចូលរូបថត និងកែសម្រួលចំនុចភារកិច្ចលម្អិត
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-red-500/20 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>បន្ថែមសមាជិកថ្មី</span>
        </button>
      </div>

      {/* Grid of Members */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {data.members.map((member, idx) => (
          <div
            key={member.id}
            className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5 relative group hover:border-amber-400 dark:hover:border-amber-500/50 transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5">
                {/* Photo with upload overlay */}
                <div className="relative group/avatar shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-50 to-slate-100 dark:from-slate-800 dark:to-slate-800 border-2 border-amber-400/70 overflow-hidden flex items-center justify-center shadow-inner">
                    {member.photoUrl ? (
                      <img
                        src={member.photoUrl}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl sm:text-3xl">
                        {member.category === 'teacher' ? '👨‍🏫' : member.category === 'student' ? '👧' : '👤'}
                      </span>
                    )}
                  </div>
                  <label className="absolute inset-0 bg-slate-950/70 text-white opacity-0 group-hover/avatar:opacity-100 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition text-[10px] font-bold">
                    <Upload className="w-3.5 h-3.5 mb-0.5" />
                    <span>ប្តូររូប</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handlePhotoUpload(e, member.id)}
                    />
                  </label>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-black font-moul text-red-600 dark:text-amber-400">
                      {idx + 1}- {member.roleTitle}
                    </span>
                    {member.votesCount !== undefined && member.votesCount > 0 && (
                      <span className="text-[10px] bg-amber-100 dark:bg-slate-800 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-200 dark:border-slate-700">
                        🗳️ {member.votesCount} សំឡេង
                      </span>
                    )}
                  </div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white mt-0.5">
                    {member.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-1">
                    {member.representation}
                  </p>
                  {member.phone && (
                    <p className="text-[11px] text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3" />
                      <span>{member.phone}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setEditingMember({ ...member });
                    setIsAddingNew(false);
                  }}
                  className="p-2 text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                  title="កែសម្រួល"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteMember(member.id, member.name)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition"
                  title="លុប"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Duty Summary */}
            <div className="text-xs font-bold text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-slate-800/90 p-3 rounded-xl border border-amber-200/70 dark:border-slate-700">
              <span className="font-moul text-[11px] text-amber-800 dark:text-amber-400 block mb-0.5">
                📌 ភារកិច្ចទទួលខុសត្រូវ៖
              </span>
              {member.dutySummary}
            </div>

            {/* Detailed Duties list */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                ភារកិច្ចលម្អិត ({member.dutyDetails?.length || 0} ចំណុច) ៖
              </span>
              <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                {member.dutyDetails?.map((d, dIdx) => (
                  <li key={dIdx} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold shrink-0">•</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Full Member Edit / Add Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 my-8">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-moul flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-amber-500" />
                <span>{isAddingNew ? 'បន្ថែមសមាជិកថ្មី' : `កែសម្រួល ${editingMember.roleTitle}`}</span>
              </h3>
              <button
                onClick={() => setEditingMember(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs max-h-[65vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    តួនាទី (ឧ. ប្រធាន, អនុប្រធាន...) *
                  </label>
                  <input
                    type="text"
                    value={editingMember.roleTitle}
                    onChange={(e) => setEditingMember({ ...editingMember, roleTitle: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ឈ្មោះពេញ *
                  </label>
                  <input
                    type="text"
                    value={editingMember.name}
                    onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                    placeholder="ឈ្មោះ..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ប្រភេទសមាជិក
                  </label>
                  <select
                    value={editingMember.category}
                    onChange={(e) => setEditingMember({ ...editingMember, category: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="parent">មាតាបិតា / អាណាព្យាបាល</option>
                    <option value="teacher">គ្រូបន្ទុកថ្នាក់</option>
                    <option value="student">សិស្ស / ប្រធានថ្នាក់</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    សំឡេងឆ្នោតទទួលបាន
                  </label>
                  <input
                    type="number"
                    value={editingMember.votesCount || 0}
                    onChange={(e) => setEditingMember({ ...editingMember, votesCount: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    លេខទូរស័ព្ទ (បើមាន)
                  </label>
                  <input
                    type="text"
                    value={editingMember.phone || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                    placeholder="012 345 678"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ការតំណាង (ឧ. ជាតំណាងមាតាបិតាសិស្សថ្នាក់ទី៦ក)
                </label>
                <input
                  type="text"
                  value={editingMember.representation}
                  onChange={(e) => setEditingMember({ ...editingMember, representation: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ភារកិច្ចសង្ខេប (បង្ហាញក្នុងតារាង និងលិខិត)
                </label>
                <input
                  type="text"
                  value={editingMember.dutySummary}
                  onChange={(e) => setEditingMember({ ...editingMember, dutySummary: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {/* Duty Details Bullet List with Add/Remove */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <label className="block font-bold text-amber-700 dark:text-amber-400 font-moul">
                  ភារកិច្ចលម្អិត (ចំណុចៗ) ៖
                </label>

                <div className="space-y-2">
                  {editingMember.dutyDetails?.map((duty, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-2">
                      <span className="w-5 text-center font-bold text-slate-400">{dIdx + 1}.</span>
                      <input
                        type="text"
                        value={duty}
                        onChange={(e) => handleEditDutyDetail(dIdx, e.target.value)}
                        className="flex-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveDutyDetail(dIdx)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition"
                        title="លុបចំណុចនេះ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newDutyInput}
                    onChange={(e) => setNewDutyInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddDutyDetail();
                      }
                    }}
                    placeholder="បញ្ចូលភារកិច្ចថ្មី..."
                    className="flex-1 p-2.5 rounded-xl border border-dashed border-amber-400 dark:border-amber-600 bg-amber-50/50 dark:bg-slate-800 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddDutyDetail}
                    className="px-3.5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>បន្ថែម</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditingMember(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold"
              >
                បោះបង់
              </button>
              <button
                type="button"
                onClick={() => handleSaveMember(editingMember)}
                className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black transition shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>រក្សាទុក</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
