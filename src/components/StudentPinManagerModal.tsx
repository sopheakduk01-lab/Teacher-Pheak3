import React, { useState, useMemo } from 'react';
import { Student, TeacherProfile } from '../types';
import { toKhmerNum } from '../utils/khmerDate';
import { QRCodeSVG } from 'qrcode.react';
import {
  KeyRound,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Printer,
  Share2,
  Lock,
  Eye,
  EyeOff,
  Search,
  Users,
  ShieldCheck,
  ExternalLink,
  QrCode,
  X,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StudentPinManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  teacher: TeacherProfile;
  onUpdateStudents: (updatedList: Student[]) => void;
  onShowToast: (msg: string) => void;
}

export const StudentPinManagerModal: React.FC<StudentPinManagerModalProps> = ({
  isOpen,
  onClose,
  students,
  teacher,
  onUpdateStudents,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [pinDrafts, setPinDrafts] = useState<Record<number, string>>(() => {
    const map: Record<number, string> = {};
    students.forEach((s) => {
      map[s.id] = s.pin || '1234';
    });
    return map;
  });

  const [showPinMap, setShowPinMap] = useState<Record<number, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeQrStudent, setActiveQrStudent] = useState<Student | null>(null);
  const [showGlobalQr, setShowGlobalQr] = useState(false);
  const [showPrintCards, setShowPrintCards] = useState(false);

  // Sync draft when students change
  React.useEffect(() => {
    const map: Record<number, string> = {};
    students.forEach((s) => {
      map[s.id] = s.pin || '1234';
    });
    setPinDrafts(map);
  }, [students]);

  // Base URL calculation for student links
  const baseUrl = useMemo(() => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${window.location.pathname}`;
    }
    return '';
  }, []);

  const globalStudentPortalUrl = `${baseUrl}?tab=student_portal`;

  const getStudentDirectUrl = (studentId: number, pin?: string) => {
    const studentPin = pin || pinDrafts[studentId] || '1234';
    return `${baseUrl}?tab=student_portal&studentId=${studentId}&pin=${encodeURIComponent(studentPin)}`;
  };

  const handleCopyText = (text: string, identifier: string, label: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(identifier);
      onShowToast(`បានចម្លង ${label} ជោគជ័យ!`);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Change individual student pin draft
  const handlePinChange = (studentId: number, val: string) => {
    // Only allow alphanumeric or digits, max 8 chars
    const cleaned = val.replace(/\s+/g, '').slice(0, 8);
    setPinDrafts((prev) => ({ ...prev, [studentId]: cleaned }));
  };

  // Save single student pin
  const handleSaveSinglePin = (student: Student) => {
    const newPin = (pinDrafts[student.id] || '1234').trim();
    const updated = students.map((s) => (s.id === student.id ? { ...s, pin: newPin } : s));
    onUpdateStudents(updated);
    onShowToast(`បានរក្សាទុកលេខកូដសម្ងាត់សិស្ស "${student.name}" ជោគជ័យ! (${newPin})`);
  };

  // Bulk set all PINs to '1234'
  const handleSetAllDefault = () => {
    if (window.confirm('តើអ្នកពិតជាចង់កំណត់លេខកូដសិស្សទាំងអស់ជា "1234" មែនទេ?')) {
      const updated = students.map((s) => ({ ...s, pin: '1234' }));
      const newDrafts: Record<number, string> = {};
      updated.forEach((s) => {
        newDrafts[s.id] = '1234';
      });
      setPinDrafts(newDrafts);
      onUpdateStudents(updated);
      onShowToast('បានកំណត់លេខកូដសិស្សទាំងអស់ជា 1234 ជោគជ័យ!');
    }
  };

  // Bulk generate random 4-digit PINs
  const handleGenerateRandomAll = () => {
    if (window.confirm('តើអ្នកពិតជាចង់បង្កើតលេខកូដចៃដន្យ ៤ ខ្ទង់ សម្រាប់សិស្សទាំងអស់មែនទេ?')) {
      const newDrafts: Record<number, string> = {};
      const updated = students.map((s) => {
        const rand = Math.floor(1000 + Math.random() * 9000).toString();
        newDrafts[s.id] = rand;
        return { ...s, pin: rand };
      });
      setPinDrafts(newDrafts);
      onUpdateStudents(updated);
      onShowToast('បានបង្កើតលេខកូដចៃដន្យ ៤ ខ្ទង់ សម្រាប់សិស្សទាំងអស់ជោគជ័យ!');
    }
  };

  // Bulk set PINs from Date of Birth (DDMM)
  const handleSetFromDOB = () => {
    if (window.confirm('តើអ្នកពិតជាចង់កំណត់លេខកូដសិស្សតាមថ្ងៃខែកំណើត (DDMM) មែនទេ?')) {
      const newDrafts: Record<number, string> = {};
      const updated = students.map((s) => {
        let pin = '1234';
        if (s.dob) {
          try {
            const parts = s.dob.split('-');
            if (parts.length === 3) {
              const mm = parts[1].padStart(2, '0');
              const dd = parts[2].padStart(2, '0');
              pin = `${dd}${mm}`;
            }
          } catch {}
        }
        newDrafts[s.id] = pin;
        return { ...s, pin };
      });
      setPinDrafts(newDrafts);
      onUpdateStudents(updated);
      onShowToast('បានកំណត់លេខកូដសិស្សតាមថ្ងៃខែកំណើត (DDMM) ជោគជ័យ!');
    }
  };

  // Bulk set PINs from Roll Number (0001, 0002...)
  const handleSetFromRollNo = () => {
    if (window.confirm('តើអ្នកពិតជាចង់កំណត់លេខកូដតាមលេខរៀងតុ (0001, 0002...) មែនទេ?')) {
      const newDrafts: Record<number, string> = {};
      const updated = students.map((s) => {
        const pin = String(s.rollNo).padStart(4, '0');
        newDrafts[s.id] = pin;
        return { ...s, pin };
      });
      setPinDrafts(newDrafts);
      onUpdateStudents(updated);
      onShowToast('បានកំណត់លេខកូដតាមលេខរៀងតុជោគជ័យ!');
    }
  };

  // Save all current drafts
  const handleSaveAllDrafts = () => {
    const updated = students.map((s) => ({
      ...s,
      pin: (pinDrafts[s.id] || '1234').trim(),
    }));
    onUpdateStudents(updated);
    onShowToast('បានរក្សាទុកលេខកូដសម្ងាត់សិស្សទាំងអស់ជោគជ័យ!');
  };

  // Filtered student list
  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.latinName && s.latinName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      String(s.rollNo).includes(searchQuery)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-md overflow-y-auto no-print">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-slate-900 rounded-[32px] w-full max-w-5xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/20 shrink-0 font-black">
              🔑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black font-moul">
                  គ្រប់គ្រងលេខកូដសម្ងាត់ (PIN) & Link សម្រាប់សិស្ស
                </h3>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                  ថ្នាក់ {teacher.grade}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                កំណត់លេខកូដសម្ងាត់ឱ្យសិស្សម្នាក់ៗ ចម្លង Link ចែករំលែក និងបោះពុម្ពប័ណ្ណកូដជូនអាណាព្យាបាល
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition active:scale-95 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Universal Link Sharing Card */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-slate-900 border border-indigo-200/80 dark:border-indigo-800/60 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shrink-0">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>🔗 Link ច្រកចូលរៀនរួមសម្រាប់សិស្សក្នុងថ្នាក់ (Universal Student Link)</span>
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    សិស្សបើក Link នេះ នឹងឃើញបញ្ជីឈ្មោះទាំងអស់ក្នុងថ្នាក់ រួចចុចឈ្មោះខ្លួនឯង និងវាយ PIN ចូលរៀនភ្លាមៗ!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowGlobalQr(true)}
                  className="px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 text-indigo-700 dark:text-indigo-300 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-indigo-200 dark:border-slate-700 transition shadow-xs cursor-pointer"
                >
                  <QrCode className="w-4 h-4" />
                  <span>QR Code</span>
                </button>

                <button
                  onClick={() =>
                    handleCopyText(globalStudentPortalUrl, 'global-link', 'Link ច្រកចូលសិស្សរួម')
                  }
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition active:scale-95 cursor-pointer"
                >
                  {copiedId === 'global-link' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>បានចម្លង Link!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>ចម្លង Link ផ្ញើតាម Telegram</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* URL Display box */}
            <div className="p-2.5 bg-white/90 dark:bg-slate-800/90 rounded-2xl border border-indigo-100 dark:border-slate-700 flex items-center justify-between gap-3 text-xs font-mono">
              <span className="text-indigo-900 dark:text-indigo-200 truncate select-all">
                {globalStudentPortalUrl}
              </span>
              <a
                href={globalStudentPortalUrl}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1 transition"
                title="បើកមើលក្នុងផ្ទាំងថ្មី"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Bulk Generation Toolbar */}
          <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>បង្កើត ឬកំណត់លេខកូដ PIN ជាក្រុម (Bulk Fast Tools) ៖</span>
              </span>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleSetAllDefault}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition cursor-pointer shadow-2xs"
                  title="កំណត់សិស្សទាំងអស់ជា 1234"
                >
                  🔒 កំណត់ទាំងអស់ជា "1234"
                </button>

                <button
                  onClick={handleGenerateRandomAll}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition cursor-pointer shadow-2xs"
                  title="បង្កើតលេខកូដចៃដន្យ ៤ ខ្ទង់ផ្សេងៗគ្នា"
                >
                  🎲 បង្កើតចៃដន្យ (Random 4-Digit)
                </button>

                <button
                  onClick={handleSetFromDOB}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition cursor-pointer shadow-2xs"
                  title="កំណត់តាមថ្ងៃខែកំណើត DDMM"
                >
                  🎂 តាមថ្ងៃខែកំណើត (DDMM)
                </button>

                <button
                  onClick={handleSetFromRollNo}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition cursor-pointer shadow-2xs"
                  title="កំណត់តាមលេខតុ 0001, 0002..."
                >
                  🔢 តាមលេខតុ (0001...)
                </button>

                <button
                  onClick={() => setShowPrintCards(true)}
                  className="px-3.5 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>បោះពុម្ពប័ណ្ណកូដសិស្ស (A4 Print)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Search Bar & Table */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="ស្វែងរកឈ្មោះសិស្ស ឬលេខតុ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={handleSaveAllDrafts}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 transition active:scale-95 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>រក្សាទុកលេខកូដទាំងអស់ ({students.length} នាក់)</span>
                </button>
              </div>
            </div>

            {/* Students Table */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto max-h-[420px]">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
                    <tr>
                      <th className="py-3 px-3 text-center w-14">លេខតុ</th>
                      <th className="py-3 px-4 min-w-[160px]">ឈ្មោះសិស្ស</th>
                      <th className="py-3 px-3 text-center w-16">ភេទ</th>
                      <th className="py-3 px-3 min-w-[110px]">ថ្ងៃខែកំណើត</th>
                      <th className="py-3 px-4 min-w-[190px]">លេខកូដសម្ងាត់ (PIN)</th>
                      <th className="py-3 px-4 min-w-[200px]">Link ផ្ទាល់ខ្លួនសម្រាប់សិស្ស</th>
                      <th className="py-3 px-3 text-center w-24">រក្សាទុក</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filtered.map((st) => {
                      const pin = pinDrafts[st.id] || '1234';
                      const isRevealed = !!showPinMap[st.id];
                      const directUrl = getStudentDirectUrl(st.id);
                      const isDefaultPin = pin === '1234';

                      return (
                        <tr
                          key={st.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition"
                        >
                          <td className="py-3 px-3 text-center font-mono font-bold text-slate-600 dark:text-slate-400">
                            #{toKhmerNum(st.rollNo)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-black flex items-center justify-center text-xs shrink-0 border border-indigo-200 dark:border-indigo-800">
                                {st.avatar ? (
                                  <img
                                    src={st.avatar}
                                    alt={st.name}
                                    className="w-full h-full object-cover rounded-xl"
                                  />
                                ) : (
                                  st.rollNo
                                )}
                              </div>
                              <div>
                                <span className="font-bold text-slate-900 dark:text-white block">
                                  {st.name}
                                </span>
                                {st.latinName && (
                                  <span className="text-[10px] text-slate-400 font-mono block">
                                    {st.latinName}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-center text-slate-600 dark:text-slate-400">
                            {st.gender}
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                            {st.dob || '-'}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5">
                              <div className="relative flex-1 max-w-[130px]">
                                <input
                                  type={isRevealed ? 'text' : 'password'}
                                  value={pin}
                                  onChange={(e) => handlePinChange(st.id, e.target.value)}
                                  className="w-full pl-3 pr-8 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-center tracking-wider"
                                  maxLength={8}
                                  placeholder="PIN"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setShowPinMap((prev) => ({
                                      ...prev,
                                      [st.id]: !prev[st.id],
                                    }))
                                  }
                                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                  {isRevealed ? (
                                    <EyeOff className="w-3.5 h-3.5" />
                                  ) : (
                                    <Eye className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>

                              {/* Quick Random Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  const r = Math.floor(1000 + Math.random() * 9000).toString();
                                  handlePinChange(st.id, r);
                                }}
                                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300"
                                title="បង្កើតកូដ ៤ ខ្ទង់ចៃដន្យ"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                              </button>

                              {isDefaultPin && (
                                <span className="text-[9px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                                  Default
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() =>
                                  handleCopyText(
                                    directUrl,
                                    `direct-${st.id}`,
                                    `Link សិស្ស ${st.name}`
                                  )
                                }
                                className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 rounded-xl text-[11px] font-bold flex items-center gap-1 border border-slate-200 dark:border-slate-700 transition cursor-pointer shrink-0"
                                title="ចម្លង Link ផ្ទាល់ខ្លួនរបស់សិស្សនេះ"
                              >
                                {copiedId === `direct-${st.id}` ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    <span>បានចម្លង</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>ចម្លង Link</span>
                                  </>
                                )}
                              </button>

                              <button
                                onClick={() => setActiveQrStudent(st)}
                                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-400 cursor-pointer"
                                title="មើល QR Code សិស្សនេះ"
                              >
                                <QrCode className="w-3.5 h-3.5" />
                              </button>

                              <a
                                href={directUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-400"
                                title="សាកល្បងចូល"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <button
                              onClick={() => handleSaveSinglePin(st)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[11px] transition shadow-2xs active:scale-95 cursor-pointer"
                            >
                              រក្សាទុក
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>
              ចំណាំ ៖ លេខកូដសម្ងាត់លំនាំដើមគឺ <strong>1234</strong>។ លោកគ្រូអាចកែប្រែលេខកូដសិស្សគ្រប់ពេលវេលា។
            </span>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 font-bold text-xs text-slate-700 dark:text-slate-300 transition cursor-pointer"
            >
              បិទផ្ទាំង
            </button>
            <button
              onClick={() => {
                handleSaveAllDrafts();
                onClose();
              }}
              className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition active:scale-95 cursor-pointer"
            >
              យល់ព្រម និងរក្សាទុក
            </button>
          </div>
        </div>
      </motion.div>

      {/* Single Student QR Code Modal */}
      {activeQrStudent && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 rounded-[32px] p-6 max-w-sm w-full text-center space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="font-moul text-xs text-slate-800 dark:text-slate-200">
                QR Code សិស្ស ៖ {activeQrStudent.name}
              </span>
              <button
                onClick={() => setActiveQrStudent(null)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 inline-block shadow-inner">
              <QRCodeSVG
                value={getStudentDirectUrl(activeQrStudent.id)}
                size={180}
                level="H"
                includeMargin
              />
            </div>

            <div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                {activeQrStudent.name} (តុ #{activeQrStudent.rollNo})
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                លេខកូដសម្ងាត់ PIN ៖{' '}
                <strong className="text-indigo-600 text-sm font-mono">
                  {pinDrafts[activeQrStudent.id] || '1234'}
                </strong>
              </p>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() =>
                  handleCopyText(
                    getStudentDirectUrl(activeQrStudent.id),
                    'qr-link',
                    'Link សិស្ស'
                  )
                }
                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>ចម្លង Link</span>
              </button>
              <button
                onClick={() => setActiveQrStudent(null)}
                className="py-2.5 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs"
              >
                បិទ
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Global Class QR Code Modal */}
      {showGlobalQr && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 rounded-[32px] p-6 max-w-sm w-full text-center space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="font-moul text-xs text-slate-800 dark:text-slate-200">
                QR Code ច្រកចូលសិស្សរួម
              </span>
              <button
                onClick={() => setShowGlobalQr(false)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 inline-block shadow-inner">
              <QRCodeSVG
                value={globalStudentPortalUrl}
                size={200}
                level="H"
                includeMargin
              />
            </div>

            <div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                ថ្នាក់{teacher.grade} &bull; {teacher.school}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                ស្កែន QR កូដនេះ ដើម្បីចូលទៅកាន់ទំព័រជ្រើសរើសឈ្មោះសិស្ស និងវាយ PIN ចូលរៀន
              </p>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() =>
                  handleCopyText(globalStudentPortalUrl, 'global-qr-link', 'Link សិស្សរួម')
                }
                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>ចម្លង Link</span>
              </button>
              <button
                onClick={() => setShowGlobalQr(false)}
                className="py-2.5 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs"
              >
                បិទ
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Printable Cards Modal */}
      {showPrintCards && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-[32px] max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[94vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-4 border-slate-100 no-print">
              <div>
                <h3 className="text-lg font-bold font-moul text-slate-900">
                  ប័ណ្ណលេខកូដសម្ងាត់សិស្ស (Student Login Slips)
                </h3>
                <p className="text-xs text-slate-500">
                  អាចកាត់ចែកជូនសិស្ស ឬអាណាព្យាបាលម្នាក់មួយប័ណ្ណ
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>បោះពុម្ព (Print)</span>
                </button>
                <button
                  onClick={() => setShowPrintCards(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs"
                >
                  បិទ
                </button>
              </div>
            </div>

            {/* Printable Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-900">
              {students.map((st) => {
                const pin = pinDrafts[st.id] || '1234';
                const directUrl = getStudentDirectUrl(st.id);

                return (
                  <div
                    key={st.id}
                    className="p-4 rounded-2xl border-2 border-dashed border-indigo-300 bg-gradient-to-br from-indigo-50/50 to-white flex gap-3.5 items-center relative overflow-hidden"
                  >
                    <div className="bg-white p-1.5 rounded-xl border border-slate-200 shrink-0">
                      <QRCodeSVG value={directUrl} size={75} level="M" />
                    </div>

                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-moul text-[11px] text-indigo-950 truncate">
                          {st.name}
                        </span>
                        <span className="text-[10px] font-black px-1.5 py-0.2 bg-indigo-100 text-indigo-800 rounded-md">
                          តុ #{st.rollNo}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        ថ្នាក់{teacher.grade} &bull; {teacher.school}
                      </div>
                      <div className="pt-1 flex items-center gap-2">
                        <span className="text-[10px] text-slate-600 font-bold">លេខកូដ PIN ៖</span>
                        <span className="px-2 py-0.5 bg-slate-900 text-white font-mono font-bold text-xs rounded-lg">
                          {pin}
                        </span>
                      </div>
                      <div className="text-[8px] text-slate-400 truncate mt-0.5">
                        Scan QR ឬចូល ៖ {globalStudentPortalUrl}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
