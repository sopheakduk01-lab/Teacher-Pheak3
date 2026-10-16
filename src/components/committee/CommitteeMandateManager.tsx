import React, { useState } from 'react';
import {
  ShieldCheck,
  Edit3,
  Check,
  Plus,
  Trash2,
  Printer,
  Sparkles,
  Building,
  FileText,
  X,
  RotateCcw,
} from 'lucide-react';
import { OfficialCommitteeData } from '../../types/committeeTypes';
import { printIsolatedCommitteeBooklet } from '../../utils/committeePrintService';

interface Props {
  data: OfficialCommitteeData;
  onUpdateData: (newData: OfficialCommitteeData) => void;
  onShowToast: (msg: string) => void;
}

export const CommitteeMandateManager: React.FC<Props> = ({
  data,
  onUpdateData,
  onShowToast,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<OfficialCommitteeData>(data);
  const [newRefInput, setNewRefInput] = useState('');
  const [newDutyInput, setNewDutyInput] = useState('');

  const handleOpenEdit = () => {
    setFormData({
      ...data,
      mandateReferences: data.mandateReferences || [
        'សេចក្តីណែនាំលេខ ៥៤ អយក.សណន ចុះថ្ងៃទី១៧ ខែតុលា ឆ្នាំ២០២៤ របស់ក្រសួងអប់រំ យុវជន និងកីឡា។',
        `ស្មារតីអង្គប្រជុំចុះ${data.meetingDateKhmer} ត្រូវនឹង${data.meetingDateSolar} ស្តីពីការបោះឆ្នោតជ្រើសរើសគណៈកម្មការគ្រប់គ្រងថ្នាក់រៀន (គ. គ. ថ.)។`,
      ],
      mandateDuties: data.mandateDuties || [
        'កំណត់តម្រូវការ និងបញ្ហាប្រឈមទាក់ទងនឹងការរៀននិងបង្រៀនក្នុងថ្នាក់',
        'កសាងផែនការអភិវឌ្ឍថ្នាក់រៀន ផែនការបង្រៀន និងផែនការសិស្សរៀន',
        'កៀរគរធនធានសម្ភារៈនិងថវិកា ពីមាតាបិតាអ្នកអាណាព្យាបាល សប្បុរសជនដើម្បីអភិវឌ្ឍថ្នាក់រៀន និងបង្រៀន',
        'ផ្តើមគំនិតក្នុងការកែលម្អថ្នាក់រៀន និងជួយផលិតសម្ភារៈរៀននិងបង្រៀន',
        'ចូលរួមរៀបចំនិងសង្កេតមើលដំណើរការតេស្តសិស្ស ប្រចាំខែ ឆមាស ឆ្នាំ',
        'សហការជាមួយគ្រូបន្ទុកថ្នាក់ជួយអប់រំមាតាបិតាជួយជំរុញកូនឱ្យមកសាលារៀននិងបង្រៀនបន្ថែម',
        'ដោះស្រាយបញ្ហាទាក់ទងនឹងការរៀននិងបង្រៀន ជាពិសេសកុមារជួបការលំបាក',
        'តាមដាននិងផ្តល់ព័ត៌មានត្រឡប់ចំពោះការរៀននិងបង្រៀន ការធ្វើតេស្តសិស្សនិងលទ្ធផលនៃការសិក្សា',
        'បែងចែកវេនប្រចាំការនៅថ្នាក់រៀនដើម្បីពិនិត្យមើលអំពីដំណើរការរៀនរបស់កូនៗ',
      ],
    });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    onUpdateData(formData);
    setIsEditing(false);
    onShowToast('💾 បានកែសម្រួលលិខិតបង្គាប់ការដោយជោគជ័យ!');
  };

  const handleAddReference = () => {
    if (!newRefInput.trim()) return;
    setFormData({
      ...formData,
      mandateReferences: [...(formData.mandateReferences || []), newRefInput.trim()],
    });
    setNewRefInput('');
  };

  const handleRemoveReference = (index: number) => {
    setFormData({
      ...formData,
      mandateReferences: formData.mandateReferences.filter((_, idx) => idx !== index),
    });
  };

  const handleAddDuty = () => {
    if (!newDutyInput.trim()) return;
    setFormData({
      ...formData,
      mandateDuties: [...(formData.mandateDuties || []), newDutyInput.trim()],
    });
    setNewDutyInput('');
  };

  const handleRemoveDuty = (index: number) => {
    setFormData({
      ...formData,
      mandateDuties: formData.mandateDuties.filter((_, idx) => idx !== index),
    });
  };

  const handlePrint = () => {
    printIsolatedCommitteeBooklet('official-mandate-document-canvas');
  };

  const mandateReferences = data.mandateReferences?.length
    ? data.mandateReferences
    : [
        'សេចក្តីណែនាំលេខ ៥៤ អយក.សណន ចុះថ្ងៃទី១៧ ខែតុលា ឆ្នាំ២០២៤ របស់ក្រសួងអប់រំ យុវជន និងកីឡា។',
        `ស្មារតីអង្គប្រជុំចុះ${data.meetingDateKhmer} ត្រូវនឹង${data.meetingDateSolar} ស្តីពីការបោះឆ្នោតជ្រើសរើសគណៈកម្មការគ្រប់គ្រងថ្នាក់រៀន (គ. គ. ថ.)។`,
      ];

  const mandateDuties = data.mandateDuties?.length
    ? data.mandateDuties
    : [
        'កំណត់តម្រូវការ និងបញ្ហាប្រឈមទាក់ទងនឹងការរៀននិងបង្រៀនក្នុងថ្នាក់',
        'កសាងផែនការអភិវឌ្ឍថ្នាក់រៀន ផែនការបង្រៀន និងផែនការសិស្សរៀន',
        'កៀរគរធនធានសម្ភារៈនិងថវិកា ពីមាតាបិតាអ្នកអាណាព្យាបាល សប្បុរសជនដើម្បីអភិវឌ្ឍថ្នាក់រៀន និងបង្រៀន',
        'ផ្តើមគំនិតក្នុងការកែលម្អថ្នាក់រៀន និងជួយផលិតសម្ភារៈរៀននិងបង្រៀន',
        'ចូលរួមរៀបចំនិងសង្កេតមើលដំណើរការតេស្តសិស្ស ប្រចាំខែ ឆមាស ឆ្នាំ',
        'សហការជាមួយគ្រូបន្ទុកថ្នាក់ជួយអប់រំមាតាបិតាជួយជំរុញកូនឱ្យមកសាលារៀននិងបង្រៀនបន្ថែម',
        'ដោះស្រាយបញ្ហាទាក់ទងនឹងការរៀននិងបង្រៀន ជាពិសេសកុមារជួបការលំបាក',
        'តាមដាននិងផ្តល់ព័ត៌មានត្រឡប់ចំពោះការរៀននិងបង្រៀន ការធ្វើតេស្តសិស្សនិងលទ្ធផលនៃការសិក្សា',
        'បែងចែកវេនប្រចាំការនៅថ្នាក់រៀនដើម្បីពិនិត្យមើលអំពីដំណើរការរៀនរបស់កូនៗ',
      ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest block">
                ផ្នែកទី ៣ • ឯកសាររដ្ឋបាលផ្លូវការ
              </span>
              <h2 className="text-base sm:text-xl font-black font-moul text-slate-900 dark:text-white mt-0.5">
                ៣. លិខិតបង្គាប់ការផ្លូវការ (Official Mandate Letter)
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            ស្តីពីការចាត់តាំងគណៈកម្មការគ្រប់គ្រងថ្នាក់រៀន {data.gradeName} ឆ្នាំសិក្សា {data.academicYear}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleOpenEdit}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-500/20 active:scale-95"
          >
            <Edit3 className="w-4 h-4" />
            <span>កែសម្រួលលិខិតបង្គាប់ការ</span>
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
      <div id="official-mandate-document-canvas" className="bg-white text-slate-900 rounded-3xl p-6 sm:p-10 md:p-12 border border-slate-300 dark:border-slate-700 shadow-xl max-w-4xl mx-auto space-y-6 font-serif">
        
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

        {/* Administration Header */}
        <div className="flex justify-between items-start text-xs font-bold text-slate-700 border-b border-slate-200 pb-4 pt-2">
          <div className="space-y-0.5">
            <p>រដ្ឋបាល{data.districtName}</p>
            <p>ការិយាល័យអប់រំ យុវជន និងកីឡា</p>
            <p className="font-moul text-slate-900 text-sm">{data.schoolName}</p>
          </div>
          <div className="text-right text-[11px] text-slate-500">
            <p>លេខ៖ .................... អយក</p>
          </div>
        </div>

        {/* Title */}
        <div className="text-center py-2 space-y-1.5">
          <h2 className="text-lg sm:text-xl font-black font-moul text-slate-900">
            លិខិតបង្គាប់ការ
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 font-bold italic">
            ស្តីពីការចាត់តាំងគណៈកម្មការគ្រប់គ្រងថ្នាក់រៀន {data.gradeName} ឆ្នាំសិក្សា {data.academicYear}
          </p>
        </div>

        {/* References Section */}
        <div className="text-xs space-y-2 leading-relaxed bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
          <p className="font-bold text-slate-900 flex items-start gap-2">
            <span>យោង ៖</span>
            <span className="font-normal">{mandateReferences[0]}</span>
          </p>
          {mandateReferences.slice(1).map((ref, rIdx) => (
            <p key={rIdx} className="pl-12 text-slate-800">
              - {ref}
            </p>
          ))}
          <p className="mt-3 text-slate-800 font-medium pt-2 border-t border-slate-200">
            លោក លោកស្រីដែលជាអាណាព្យាបាលសិស្សត្រូវបានចាត់តាំងជាគណៈកម្មការថ្នាក់រៀនសម្រាប់ <strong>{data.gradeName}</strong> ក្នុងឆ្នាំសិក្សា <strong>{data.academicYear}</strong> ដូចខាងក្រោម៖
          </p>
        </div>

        {/* Section I: Members */}
        <div className="space-y-3 pt-2">
          <h3 className="font-black font-moul text-sm text-amber-800 border-b-2 border-amber-500 pb-1">
            I. សមាសភាព
          </h3>
          <div className="space-y-2 text-xs">
            {data.members.map((m, idx) => (
              <div
                key={m.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-500 w-5">{idx + 1}.</span>
                  <span className="font-bold text-slate-900 font-moul text-xs">{m.name}</span>
                  <span className="text-red-700 font-bold">({m.roleTitle})</span>
                </div>
                <span className="text-slate-600 text-[11px] font-medium sm:text-right pl-7 sm:pl-0">
                  {m.dutySummary}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section II: Mandate Duties */}
        <div className="space-y-3 pt-2">
          <h3 className="font-black font-moul text-sm text-amber-800 border-b-2 border-amber-500 pb-1">
            II. តួនាទី និងភារកិច្ច ({mandateDuties.length} ចំណុច)
          </h3>
          <ul className="space-y-2 text-xs text-slate-800 leading-relaxed pl-2">
            {mandateDuties.map((duty, dIdx) => (
              <li key={dIdx} className="flex items-start gap-2.5">
                <span className="text-amber-600 font-bold shrink-0">•</span>
                <span>{duty}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Effectivity clause */}
        <p className="text-xs font-bold text-center italic py-3 text-slate-700 border-t border-slate-200">
          លិខិតបង្គាប់ការនេះមានប្រសិទ្ធភាពចាប់ពីថ្ងៃចុះហត្ថលេខាតទៅ។
        </p>

        {/* Signatures */}
        <div className="flex justify-between items-end pt-6 text-xs text-center font-bold">
          <div className="space-y-16">
            <p className="font-moul text-slate-800">បានឃើញ និងឯកភាព</p>
            <p className="font-moul text-sm text-slate-900">{data.principalName}</p>
          </div>

          <div className="space-y-16">
            <div>
              <p>{data.mandateDateKhmer}</p>
              <p>{data.mandateDateSolar}</p>
              <p className="font-moul text-slate-800 mt-1">ប្រធានគណៈកម្មការគ្រប់គ្រងសាលា</p>
            </div>
            <p className="font-moul text-sm text-slate-900">{data.principalName}</p>
          </div>
        </div>
      </div>

      {/* Edit Mandate Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 my-8">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-moul flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-500" />
                <span>កែសម្រួលលិខិតបង្គាប់ការផ្លូវការ</span>
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
                    value={formData.mandateDateKhmer}
                    onChange={(e) => setFormData({ ...formData, mandateDateKhmer: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    កាលបរិច្ឆេទសុរិយគតិ (Solar Date)
                  </label>
                  <input
                    type="text"
                    value={formData.mandateDateSolar}
                    onChange={(e) => setFormData({ ...formData, mandateDateSolar: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* References Editor */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <label className="block font-bold text-amber-700 dark:text-amber-400 font-moul">
                  សេចក្តីយោង (References) ៖
                </label>
                <div className="space-y-2">
                  {formData.mandateReferences?.map((ref, rIdx) => (
                    <div key={rIdx} className="flex items-center gap-2">
                      <span className="w-5 text-center font-bold text-slate-400">{rIdx + 1}.</span>
                      <input
                        type="text"
                        value={ref}
                        onChange={(e) => {
                          const updated = [...formData.mandateReferences];
                          updated[rIdx] = e.target.value;
                          setFormData({ ...formData, mandateReferences: updated });
                        }}
                        className="flex-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveReference(rIdx)}
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
                    value={newRefInput}
                    onChange={(e) => setNewRefInput(e.target.value)}
                    placeholder="បញ្ចូលសេចក្តីយោងថ្មី..."
                    className="flex-1 p-2.5 rounded-xl border border-dashed border-blue-400 bg-blue-50/40 dark:bg-slate-800 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddReference}
                    className="px-3.5 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>បន្ថែម</span>
                  </button>
                </div>
              </div>

              {/* Mandate Duties Editor */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <label className="block font-bold text-amber-700 dark:text-amber-400 font-moul">
                  តួនាទី និងភារកិច្ចក្នុងលិខិត (Mandate Duties) ៖
                </label>
                <div className="space-y-2">
                  {formData.mandateDuties?.map((duty, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-2">
                      <span className="w-5 text-center font-bold text-slate-400">{dIdx + 1}.</span>
                      <input
                        type="text"
                        value={duty}
                        onChange={(e) => {
                          const updated = [...formData.mandateDuties];
                          updated[dIdx] = e.target.value;
                          setFormData({ ...formData, mandateDuties: updated });
                        }}
                        className="flex-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveDuty(dIdx)}
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
                    value={newDutyInput}
                    onChange={(e) => setNewDutyInput(e.target.value)}
                    placeholder="បញ្ចូលភារកិច្ចថ្មី..."
                    className="flex-1 p-2.5 rounded-xl border border-dashed border-amber-400 bg-amber-50/40 dark:bg-slate-800 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddDuty}
                    className="px-3.5 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 shrink-0"
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
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold"
              >
                បោះបង់
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black transition shadow-xs flex items-center gap-1.5"
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
