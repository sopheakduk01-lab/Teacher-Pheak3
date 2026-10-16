import React, { useState } from 'react';
import {
  FileText,
  Edit3,
  Check,
  Plus,
  Trash2,
  Printer,
  Sparkles,
  Users,
  Vote,
  X,
} from 'lucide-react';
import { OfficialCommitteeData } from '../../types/committeeTypes';
import { printIsolatedCommitteeBooklet } from '../../utils/committeePrintService';

interface Props {
  data: OfficialCommitteeData;
  onUpdateData: (newData: OfficialCommitteeData) => void;
  onShowToast: (msg: string) => void;
}

export const CommitteeMinutesManager: React.FC<Props> = ({
  data,
  onUpdateData,
  onShowToast,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<OfficialCommitteeData>(data);
  const [newAgendaInput, setNewAgendaInput] = useState('');

  const handleOpenEdit = () => {
    setFormData({
      ...data,
      meetingAgendas: data.meetingAgendas || [
        'ចុះវត្តមានសមាសភាពចូលរួម',
        'មតិសំណេះសំណាលជាមួយលោកគ្រូអ្នកគ្រូ និងមាតាបិតា អ្នកអាណាព្យាបាលសិស្ស',
        'ការបង្ហាញពីគោលបំណងនៃការបង្កើតគណៈកម្មការគ្រប់គ្រងថ្នាក់រៀន',
        'ការបង្ហាញពីសមាសភាពដែលអាចឈរឈ្មោះបោះឆ្នោត គ. គ. ថ. និងរចនាសម្ព័ន្ធ តួនាទី គ. គ. ថ.',
        'ការបោះឆ្នោតជ្រើសរើស គ. គ. ថ. ដោយសម្ងាត់ និងស្ម័គ្រចិត្ត',
        'ផែនការបន្ត និងការប្តេជ្ញាចិត្តរួមគ្នា',
      ],
    });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    onUpdateData(formData);
    setIsEditing(false);
    onShowToast('💾 បានកែសម្រួលកំណត់ហេតុប្រជុំដោយជោគជ័យ!');
  };

  const handleAddAgenda = () => {
    if (!newAgendaInput.trim()) return;
    setFormData({
      ...formData,
      meetingAgendas: [...(formData.meetingAgendas || []), newAgendaInput.trim()],
    });
    setNewAgendaInput('');
  };

  const handleRemoveAgenda = (index: number) => {
    setFormData({
      ...formData,
      meetingAgendas: formData.meetingAgendas.filter((_, idx) => idx !== index),
    });
  };

  const handleMemberVoteChange = (memberId: string, votes: number) => {
    const updatedMembers = formData.members.map((m) =>
      m.id === memberId ? { ...m, votesCount: votes } : m
    );
    setFormData({ ...formData, members: updatedMembers });
  };

  const handlePrint = () => {
    printIsolatedCommitteeBooklet('official-minutes-document-canvas');
  };

  const meetingAgendas = data.meetingAgendas?.length
    ? data.meetingAgendas
    : [
        'ចុះវត្តមានសមាសភាពចូលរួម',
        'មតិសំណេះសំណាលជាមួយលោកគ្រូអ្នកគ្រូ និងមាតាបិតា អ្នកអាណាព្យាបាលសិស្ស',
        'ការបង្ហាញពីគោលបំណងនៃការបង្កើតគណៈកម្មការគ្រប់គ្រងថ្នាក់រៀន',
        'ការបង្ហាញពីសមាសភាពដែលអាចឈរឈ្មោះបោះឆ្នោត គ. គ. ថ. និងរចនាសម្ព័ន្ធ តួនាទី គ. គ. ថ.',
        'ការបោះឆ្នោតជ្រើសរើស គ. គ. ថ. ដោយសម្ងាត់ និងស្ម័គ្រចិត្ត',
        'ផែនការបន្ត និងការប្តេជ្ញាចិត្តរួមគ្នា',
      ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">
                ផ្នែកទី ៤ • ឯកសារអង្គប្រជុំ & សំឡេងឆ្នោត
              </span>
              <h2 className="text-base sm:text-xl font-black font-moul text-slate-900 dark:text-white mt-0.5">
                ៤. កំណត់ហេតុប្រជុំបោះឆ្នោតជ្រើសរើស គ. គ. ថ.
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            កត់ត្រាដំណើរការប្រជុំ របៀបវារៈ សមាសភាពចូលរួម និងលទ្ធផលបោះឆ្នោតផ្លូវការ
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleOpenEdit}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95"
          >
            <Edit3 className="w-4 h-4" />
            <span>កែសម្រួលកំណត់ហេតុ</span>
          </button>
          <button
            onClick={handlePrint}
            className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition border border-slate-200 dark:border-slate-700"
            title="បោះពុម្ព"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Official A4 Document Canvas */}
      <div id="official-minutes-document-canvas" className="bg-white text-slate-900 rounded-3xl p-6 sm:p-10 md:p-12 border border-slate-300 dark:border-slate-700 shadow-xl max-w-4xl mx-auto space-y-6 font-serif">
        
        {/* National Emblem & Slogan */}
        <div className="text-center space-y-1">
          <h3 className="font-moul text-base sm:text-lg text-amber-700">
            ព្រះរាជាណាចក្រកម្ពុជា
          </h3>
          <h4 className="font-moul text-xs sm:text-sm text-slate-900">
            ជាតិ សាសនា ព្រះមហាក្សត្រ
          </h4>
          <div className="w-24 h-0.5 bg-amber-500 mx-auto mt-2" />
        </div>

        {/* Title */}
        <div className="text-center py-2 space-y-1">
          <h2 className="text-lg sm:text-xl font-black font-moul text-slate-900">
            កំណត់ហេតុប្រជុំ
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 font-bold italic">
            ស្តីពីការបោះឆ្នោតជ្រើសរើសគណៈកម្មការគ្រប់គ្រងថ្នាក់រៀន (គ. គ. ថ.) {data.gradeName}
          </p>
        </div>

        {/* Opening Paragraph */}
        <div className="text-xs space-y-3 leading-relaxed bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
          <p>
            នៅ<strong>{data.meetingDateKhmer}</strong> ត្រូវនឹង<strong>{data.meetingDateSolar}</strong> {data.meetingTime || 'វេលាម៉ោង ៧:៣០ នាទីព្រឹក'} បានដំណើរការប្រជុំនៅ<strong>{data.meetingLocation || data.schoolName}</strong> ដោយមានការចូលរួម និងដឹកនាំពីលោក <strong>{data.principalName}</strong> ជានាយកសាលា។
          </p>

          <div>
            <h4 className="font-bold text-amber-800 font-moul text-xs mb-1.5 flex items-center gap-1">
              <span>➤</span> <span>របៀបវារៈនៃអង្គប្រជុំ ({meetingAgendas.length} ចំណុច) ៖</span>
            </h4>
            <ol className="list-decimal pl-6 space-y-1 text-slate-800">
              {meetingAgendas.map((agenda, aIdx) => (
                <li key={aIdx}>{agenda}</li>
              ))}
            </ol>
          </div>
        </div>

        {/* Section: Attendees */}
        <div className="space-y-2 text-xs">
          <h4 className="font-bold text-amber-800 font-moul text-xs flex items-center gap-1">
            <span>➤</span> <span>សមាសភាពចូលរួម ៖</span>
          </h4>
          <p className="text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200/80 leading-relaxed">
            {data.meetingAttendeesSummary || `១. លោក ${data.principalName} នាយកសាលា | ២. លោក ${data.vicePrincipalName} នាយករង | ៣. លោកគ្រូអ្នកគ្រូ | ៤. សិស្សានុសិស្ស | ៥. អាណាព្យាបាលសិស្សទាំងអស់`}
          </p>
        </div>

        {/* Section: Election Process & Votes Results */}
        <div className="space-y-3 pt-2 text-xs">
          <h4 className="font-bold text-amber-800 font-moul text-xs flex items-center gap-1">
            <span>➤</span> <span>ដំណើរការ និងលទ្ធផលនៃការបោះឆ្នោត ៖</span>
          </h4>
          <p className="text-slate-800">
            អង្គប្រជុំបានដំណើរការបោះឆ្នោតជាសម្ងាត់ និងស្ម័គ្រចិត្ត ដើម្បីជ្រើសរើសសមាសភាព គ. គ. ថ. សម្រាប់បម្រើការងារក្នុងឆ្នាំសិក្សា {data.academicYear} ដោយទទួលបានលទ្ធផលសំឡេងឆ្នោតដូចខាងក្រោម៖
          </p>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#071539] text-amber-300 font-bold">
                <tr>
                  <th className="p-3 w-12 text-center border-r border-amber-400/20">ល.រ</th>
                  <th className="p-3 border-r border-amber-400/20">ឈ្មោះបេក្ខជន</th>
                  <th className="p-3 border-r border-amber-400/20">តួនាទីជាប់ឆ្នោត</th>
                  <th className="p-3 border-r border-amber-400/20">ការតំណាង</th>
                  <th className="p-3 text-center w-28">សំឡេងឆ្នោត</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {data.members.map((m, idx) => (
                  <tr key={m.id} className="hover:bg-amber-50/40">
                    <td className="p-2.5 text-center font-bold border-r border-slate-100">{idx + 1}</td>
                    <td className="p-2.5 font-bold border-r border-slate-100 font-moul">{m.name}</td>
                    <td className="p-2.5 font-bold text-red-700 border-r border-slate-100">{m.roleTitle}</td>
                    <td className="p-2.5 text-slate-600 border-r border-slate-100">{m.representation}</td>
                    <td className="p-2.5 text-center font-black text-amber-800 bg-amber-50/50">
                      {m.votesCount !== undefined ? `${m.votesCount} សំឡេង` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="italic text-slate-600 text-[11px] pt-1">
            * អង្គប្រជុំបានបញ្ចប់នៅវេលាម៉ោង ១០:៣០ នាទីព្រឹក នាថ្ងៃខែឆ្នាំដដែល ប្រកបដោយបរិយាកាសរីករាយ ស្និទ្ធស្នាល និងស្មារតីទទួលខុសត្រូវខ្ពស់។
          </p>
        </div>

        {/* Signatures */}
        <div className="flex justify-between items-end pt-8 text-xs text-center font-bold">
          <div className="space-y-16">
            <p className="font-moul text-slate-800">បានឃើញ និងឯកភាព<br/>នាយកសាលា</p>
            <p className="font-moul text-sm text-slate-900">{data.principalName}</p>
          </div>

          <div className="space-y-16">
            <div>
              <p>{data.mandateDateKhmer}</p>
              <p>{data.mandateDateSolar}</p>
              <p className="font-moul text-slate-800 mt-1">អ្នកធ្វើកំណត់ហេតុ</p>
            </div>
            <p className="font-moul text-sm text-slate-900">{data.recorderName}</p>
          </div>
        </div>
      </div>

      {/* Edit Minutes Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 my-8">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-moul flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-500" />
                <span>កែសម្រួលកំណត់ហេតុប្រជុំបោះឆ្នោត</span>
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs max-h-[65vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    កាលបរិច្ឆេទចន្ទគតិ (Khmer Lunar)
                  </label>
                  <input
                    type="text"
                    value={formData.meetingDateKhmer}
                    onChange={(e) => setFormData({ ...formData, meetingDateKhmer: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    កាលបរិច្ឆេទសុរិយគតិ (Solar Date)
                  </label>
                  <input
                    type="text"
                    value={formData.meetingDateSolar}
                    onChange={(e) => setFormData({ ...formData, meetingDateSolar: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ពេលវេលាប្រជុំ (Time)
                  </label>
                  <input
                    type="text"
                    value={formData.meetingTime || 'វេលាម៉ោង ៧:៣០ នាទីព្រឹក'}
                    onChange={(e) => setFormData({ ...formData, meetingTime: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ទីតាំងប្រជុំ (Location)
                  </label>
                  <input
                    type="text"
                    value={formData.meetingLocation || formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, meetingLocation: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  អ្នកកត់ត្រាកំណត់ហេតុ
                </label>
                <input
                  type="text"
                  value={formData.recorderName}
                  onChange={(e) => setFormData({ ...formData, recorderName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  សមាសភាពចូលរួម (Attendees Summary)
                </label>
                <textarea
                  value={formData.meetingAttendeesSummary}
                  onChange={(e) => setFormData({ ...formData, meetingAttendeesSummary: e.target.value })}
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {/* Agenda Editor */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <label className="block font-bold text-amber-700 dark:text-amber-400 font-moul">
                  របៀបវារៈប្រជុំ (Agendas) ៖
                </label>
                <div className="space-y-2">
                  {formData.meetingAgendas?.map((agenda, aIdx) => (
                    <div key={aIdx} className="flex items-center gap-2">
                      <span className="w-5 text-center font-bold text-slate-400">{aIdx + 1}.</span>
                      <input
                        type="text"
                        value={agenda}
                        onChange={(e) => {
                          const updated = [...formData.meetingAgendas];
                          updated[aIdx] = e.target.value;
                          setFormData({ ...formData, meetingAgendas: updated });
                        }}
                        className="flex-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveAgenda(aIdx)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newAgendaInput}
                    onChange={(e) => setNewAgendaInput(e.target.value)}
                    placeholder="បញ្ចូលរបៀបវារៈថ្មី..."
                    className="flex-1 p-2.5 rounded-xl border border-dashed border-emerald-400 bg-emerald-50/40 dark:bg-slate-800 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddAgenda}
                    className="px-3.5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>បន្ថែម</span>
                  </button>
                </div>
              </div>

              {/* Member Votes Editor */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <label className="block font-bold text-amber-700 dark:text-amber-400 font-moul">
                  កែសំឡេងឆ្នោតសមាជិក (Votes Count) ៖
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {formData.members.map((m) => (
                    <div key={m.id} className="flex items-center justify-between gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <span className="font-bold truncate">{m.name} ({m.roleTitle})</span>
                      <input
                        type="number"
                        value={m.votesCount || 0}
                        onChange={(e) => handleMemberVoteChange(m.id, parseInt(e.target.value) || 0)}
                        className="w-16 p-1 text-center font-black rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold"
              >
                បោះបង់
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition shadow-xs flex items-center gap-1.5"
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
