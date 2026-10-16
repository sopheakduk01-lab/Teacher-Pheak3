import React, { useState, useRef } from 'react';
import { TeacherProfile } from '../types';
import { X, UserCheck, School, Phone, Mail, Award, BookOpen, Palette, Upload, FileText, ShieldCheck, Trash2, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { compressImageFile, isImageAvatar } from '../utils/imageCompressor';
import { TeacherAvatar } from './TeacherAvatar';
import { PrimarySubSubject, getCustomSubSubjects, saveCustomSubSubjects } from '../utils/gradeManager';

interface TeacherProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: TeacherProfile;
  onSave: (updated: TeacherProfile) => void;
  onOpenCustomize: () => void;
}

export const TeacherProfileModal: React.FC<TeacherProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
  onOpenCustomize,
}) => {
  const [formData, setFormData] = useState<TeacherProfile>({ ...profile });
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [customSubjects, setCustomSubjects] = useState<PrimarySubSubject[]>(() => getCustomSubSubjects());
  const [newSubName, setNewSubName] = useState('');
  const [newSubCategory, setNewSubCategory] = useState<'khmer' | 'math' | 'science' | 'social' | 'other'>('khmer');
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [editingSubName, setEditingSubName] = useState('');

  const handleAddCustomSub = () => {
    if (!newSubName.trim()) return;
    const newId = 'custom_' + Date.now();
    const updated = [...customSubjects, { id: newId, name: newSubName.trim(), category: newSubCategory, defaultSelected: true }];
    setCustomSubjects(updated);
    saveCustomSubSubjects(updated);
    setNewSubName('');
  };

  const handleDeleteCustomSub = (id: string) => {
    const updated = customSubjects.filter(s => s.id !== id);
    setCustomSubjects(updated);
    saveCustomSubSubjects(updated);
  };

  const handleUpdateCustomSub = (id: string) => {
    if (!editingSubName.trim()) return;
    const updated = customSubjects.map(s => s.id === id ? { ...s, name: editingSubName.trim() } : s);
    setCustomSubjects(updated);
    saveCustomSubSubjects(updated);
    setEditingSubId(null);
    setEditingSubName('');
  };

  if (!isOpen) return null;

  const processAndSetImage = async (file: File) => {
    setImageError(null);
    setIsProcessingImage(true);
    try {
      if (!file.type.startsWith('image/')) {
        throw new Error('សូមជ្រើសរើសឯកសាររូបភាព (JPG, PNG, WEBP)');
      }

      // Auto-compress and scale down for optimal PC/mobile storage
      const compressed = await compressImageFile(file, {
        maxWidth: 480,
        maxHeight: 480,
        quality: 0.88,
        mimeType: 'image/jpeg',
      });

      setFormData((prev) => ({ ...prev, avatar: compressed }));
    } catch (err: any) {
      console.error('Image upload failed:', err);
      setImageError(err.message || 'មិនអាចផ្ទុករូបភាពបានទេ សូមសាកល្បងម្ដងទៀត');
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAndSetImage(file);
    }
    // reset input value so re-selecting same file works
    if (e.target) e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processAndSetImage(file);
    }
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, avatar: '👨‍🏫' }));
    setImageError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
      <div className="bg-white rounded-[32px] p-6 md:p-8 w-full max-w-xl shadow-2xl border border-slate-100 space-y-5 max-h-[92vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-700 text-white flex items-center justify-center shadow-md">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base md:text-lg">កែប្រែប្រវត្តិរូបគ្រូបង្រៀន</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                ព័ត៌មានរដ្ឋបាលផ្លូវការសម្រាប់ចេញរបាយការណ៍ក្រសួង
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-2xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick button to open font & background customizer */}
        <div className="bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-blue-500/10 p-4 rounded-2xl border border-amber-500/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center shadow-md">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs">កែសម្រួលទម្រង់អក្សរ & ផ្ទៃក្រោយ</h4>
              <p className="text-[10px] text-slate-600">ប្ដូរពុម្ពអក្សរ ពណ៌ផ្ទៃក្រោយ និងទំហំ</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenCustomize();
            }}
            className="px-3.5 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs shadow-sm transition active:scale-95 shrink-0"
          >
            កំណត់ផ្ទាល់ខ្លួន
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Profile Picture Upload Section */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`p-4 rounded-3xl border-2 transition-all duration-200 flex flex-col sm:flex-row items-center gap-4 ${
              isDragging
                ? 'bg-purple-50/90 border-dashed border-purple-500 ring-4 ring-purple-200'
                : 'bg-slate-50/90 border-slate-200/80 hover:border-slate-300'
            }`}
          >
            {/* Avatar Preview Squircle */}
            <div className="relative group shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl p-1 bg-gradient-to-tr from-amber-400 via-purple-600 to-indigo-600 shadow-xl shadow-purple-950/20">
                <div className="w-full h-full rounded-[22px] bg-slate-900 overflow-hidden flex items-center justify-center relative text-white">
                  {isProcessingImage ? (
                    <div className="flex flex-col items-center justify-center p-2 text-center">
                      <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-1"></div>
                      <span className="text-[9px] text-amber-200 font-bold">កំពុងបង្រួម...</span>
                    </div>
                  ) : (
                    <TeacherAvatar
                      avatar={formData.avatar}
                      name={formData.name}
                      fallbackIcon="👨‍🏫"
                      imgClassName="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>

              {isImageAvatar(formData.avatar) && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  title="លុបរូបថតនេះចេញ"
                  className="absolute -top-1.5 -right-1.5 bg-rose-600 hover:bg-rose-700 text-white p-1.5 rounded-full shadow-md transition active:scale-95"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Upload Controls & Actions */}
            <div className="flex-1 space-y-2.5 text-center sm:text-left w-full">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <label className="block font-black text-slate-800 text-xs sm:text-sm">
                    រូបថតផ្ទាល់ខ្លួន ឬ រូបនិមិត្តសញ្ញា (Teacher Avatar)
                  </label>
                  {isImageAvatar(formData.avatar) && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> បានដាក់រូប
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  អាចចុចជ្រើសរើស ឬអូសទម្លាក់រូបភាព (Drag & Drop) ពីលើ PC ចូលទីនេះបានភ្លាមៗ
                </p>
              </div>

              {imageError && (
                <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl font-bold">
                  ⚠️ {imageError}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessingImage}
                  className="px-3.5 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 disabled:bg-purple-400 text-white font-black text-xs shadow-md shadow-purple-900/20 transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isProcessingImage ? 'កំពុងដំណើរការ...' : 'ជ្រើសរើសរូបពី PC / ឧបករណ៍'}</span>
                </button>

                {isImageAvatar(formData.avatar) && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition flex items-center gap-1 active:scale-95"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>លុបរូបថត</span>
                  </button>
                )}

                {/* Preset Emojis */}
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2 py-1 shadow-2xs">
                  <span className="text-[10px] text-slate-400 font-bold ml-0.5">Emoji:</span>
                  {['👨‍🏫', '👩‍🏫', '👨‍💼', '👩‍💼', '👑', '⭐', '🇰🇭'].map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, avatar: em });
                        setImageError(null);
                      }}
                      className="w-6 h-6 rounded-lg hover:bg-purple-100 flex items-center justify-center text-sm transition"
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">គោត្តនាម និងនាមគ្រូ (Full Name)</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium focus:ring-2 focus:ring-purple-600 focus:outline-none bg-white"
                placeholder="ឧ. ឌុក សុភ័ក្រ"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                អត្តលេខមន្ត្រីរាជការ (Civil ID)
              </label>
              <input
                type="text"
                value={(formData as any).civilId || ''}
                onChange={(e) => setFormData({ ...formData, civilId: e.target.value } as any)}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium focus:ring-2 focus:ring-purple-600 focus:outline-none bg-white"
                placeholder="ឧ. 0123456"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <School className="w-3.5 h-3.5 text-purple-700" />
              គ្រឹះស្ថានសិក្សា / សាលាបឋមសិក្សា (School Name)
            </label>
            <input
              type="text"
              required
              value={formData.school}
              onChange={(e) => setFormData({ ...formData, school: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium focus:ring-2 focus:ring-purple-600 focus:outline-none bg-white"
              placeholder="ឧ. សាលាបឋមសិក្សា..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                ថ្នាក់ទទួលបន្ទុក
              </label>
              <input
                type="text"
                required
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium focus:ring-2 focus:ring-purple-600 focus:outline-none bg-white"
                placeholder="ឧ. ថ្នាក់ទី ៤អ"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">ឆ្នាំសិក្សា</label>
              <input
                type="text"
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium focus:ring-2 focus:ring-purple-600 focus:outline-none bg-white"
                placeholder="ឧ. ២០២៥-២០២៦"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">តួនាទីរដ្ឋបាល</label>
              <input
                type="text"
                value={(formData as any).position || 'គ្រូបន្ទុកថ្នាក់'}
                onChange={(e) => setFormData({ ...formData, position: e.target.value } as any)}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium focus:ring-2 focus:ring-purple-600 focus:outline-none bg-white"
                placeholder="ឧ. គ្រូបន្ទុកថ្នាក់"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                លេខទូរស័ព្ទទំនាក់ទំនង
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium focus:ring-2 focus:ring-purple-600 focus:outline-none bg-white"
                placeholder="ឧ. 012 345 678"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-rose-600" />
                អ៊ីមែលផ្លូវការ (MoEYS Email)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium focus:ring-2 focus:ring-purple-600 focus:outline-none bg-white"
                placeholder="teacher@moeys.gov.kh"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              កម្រិតវប្បធម៌ / គរុកោសល្យ និងសញ្ញាបត្រ
            </label>
            <input
              type="text"
              value={formData.degree}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium focus:ring-2 focus:ring-purple-600 focus:outline-none bg-white"
              placeholder="ឧ. បរិញ្ញាបត្រអប់រំ / វិញ្ញាបនបត្រគរុកោសល្យ"
            />
          </div>

          {/* Teacher Security Master PIN for Student Lockout */}
          <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>លេខកូដសម្ងាត់គ្រូ (Teacher Master PIN) — ការពារសិស្សមិនឱ្យចូលកន្លែងគ្រូ</span>
              </label>
              <span className="text-[10px] text-amber-800 font-black bg-amber-200/70 px-2 py-0.5 rounded-md">
                🔒 ការពារកម្រិតខ្ពស់
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              នៅពេលសិស្សចុច Link ចូលរៀន ឬប្រើប្រាស់ផ្ទាំងសិស្ស ប្រព័ន្ធនឹងចាក់សោរារាំងមិនឱ្យសិស្សចូលមកកាន់ផ្ទាំងរដ្ឋបាលគ្រូឡើយ។ មានតែលោកគ្រូ-អ្នកគ្រូដែលមានលេខកូដនេះប៉ុណ្ណោះ ទើបអាចបើកមើលរដ្ឋបាលបាន។
            </p>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={formData.adminPin || '8888'}
                onChange={(e) => setFormData({ ...formData, adminPin: e.target.value.replace(/\s+/g, '').slice(0, 8) })}
                className="w-44 border border-amber-300 rounded-xl px-3.5 py-2 text-sm font-mono font-black tracking-widest text-amber-950 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-2xs"
                placeholder="8888"
              />
              <span className="text-[11px] text-amber-700 font-bold">
                (Default ៖ <code className="bg-amber-100 px-1.5 py-0.5 rounded">8888</code>)
              </span>
            </div>
          </div>

          {/* Custom Subject & Competency Manager */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-700" />
                <h4 className="font-black text-amber-950 text-xs">បន្ថែម ឬកែសម្រួលមុខវិជ្ជា និងសមត្ថភាពផ្ទាល់ខ្លួន</h4>
              </div>
              <span className="text-[10px] text-amber-800 font-bold bg-amber-200/60 px-2 py-0.5 rounded-full">
                {customSubjects.length} បានបង្កើត
              </span>
            </div>
            <p className="text-[11px] text-amber-900/80">
              មុខវិជ្ជា ឬសមត្ថភាពដែលលោកគ្រូ-អ្នកគ្រូបន្ថែមទីនេះ នឹងបង្ហាញជាជួរឈរក្នុងតារាងពិន្ទុដោយស្វ័យប្រវត្តិ។
            </p>

            {/* Add new custom subject form */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newSubName}
                onChange={(e) => setNewSubName(e.target.value)}
                placeholder="ឈ្មោះមុខវិជ្ជា ឬសមត្ថភាពថ្មី (ឧ. គំនិតច្នៃប្រឌិត)"
                className="flex-1 bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              <select
                value={newSubCategory}
                onChange={(e) => setNewSubCategory(e.target.value as any)}
                className="bg-white border border-amber-300 rounded-xl px-2 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="khmer">ភាសាខ្មែរ</option>
                <option value="math">គណិតវិទ្យា</option>
                <option value="science">វិទ្យាសាស្ត្រ</option>
                <option value="social">សិក្សាសង្គម</option>
                <option value="other">ផ្សេងៗ</option>
              </select>
              <button
                type="button"
                onClick={handleAddCustomSub}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-xl shadow-xs transition active:scale-95 shrink-0 text-xs cursor-pointer"
              >
                + បន្ថែម
              </button>
            </div>

            {/* List of custom subjects */}
            {customSubjects.length > 0 && (
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {customSubjects.map(sub => (
                  <div key={sub.id} className="flex items-center justify-between bg-white border border-amber-200/80 px-3 py-1.5 rounded-xl text-xs">
                    {editingSubId === sub.id ? (
                      <div className="flex items-center gap-2 flex-1 mr-2">
                        <input
                          type="text"
                          value={editingSubName}
                          onChange={(e) => setEditingSubName(e.target.value)}
                          className="flex-1 border border-amber-300 rounded-lg px-2 py-1 text-xs font-bold"
                        />
                        <button
                          type="button"
                          onClick={() => handleUpdateCustomSub(sub.id)}
                          className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg text-[11px] cursor-pointer"
                        >
                          រក្សាទុក
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingSubId(null)}
                          className="px-2 py-1 bg-slate-200 text-slate-700 font-bold rounded-lg text-[11px] cursor-pointer"
                        >
                          បោះបង់
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{sub.name}</span>
                          <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-semibold">
                            {sub.category === 'khmer' ? 'ភាសាខ្មែរ' : sub.category === 'math' ? 'គណិតវិទ្យា' : sub.category === 'science' ? 'វិទ្យាសាស្ត្រ' : sub.category === 'social' ? 'សិក្សាសង្គម' : 'ផ្សេងៗ'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingSubId(sub.id);
                              setEditingSubName(sub.name);
                            }}
                            className="px-2 py-1 text-purple-700 hover:bg-purple-50 rounded-lg font-bold text-[11px] cursor-pointer"
                          >
                            កែសម្រួល
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCustomSub(sub.id)}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                            title="លុប"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition"
            >
              បោះបង់
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 text-white rounded-2xl font-bold shadow-lg shadow-purple-900/30 transition active:scale-95"
            >
              រក្សាទុកព័ត៌មានរដ្ឋបាល
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
