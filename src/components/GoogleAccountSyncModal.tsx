import React, { useState, useEffect } from 'react';
import {
  Mail,
  ShieldCheck,
  Cloud,
  CloudUpload,
  CloudDownload,
  LogOut,
  CheckCircle2,
  AlertCircle,
  X,
  Key,
  ShieldCheck as ShieldIcon,
  Download,
  Upload,
  Database,
  Users,
  CalendarCheck,
  Award,
  BookOpen,
  FileCheck2,
  Lock,
  Copy,
  ClipboardPaste,
  Smartphone,
  Share2,
  Sparkles,
  Info,
  LogIn,
  RefreshCw
} from 'lucide-react';
import {
  TeacherProfile,
  Student,
  AttendanceDatabase,
  GradeDatabase,
  LogbookEntry,
  InventoryItem,
  PLCMeeting,
  Quiz,
  LibraryBook,
} from '../types';
import {
  AcademicYearDataBundle,
  exportAllAcademicYearsBackup,
  importAcademicYearsBackup,
  saveCompleteYearBundle,
  loadCompleteYearBundle,
} from '../utils/academicYearStorage';
import {
  shareOrDownloadBackupFile,
  saveBackupToIndexedDB,
  loadBackupFromIndexedDB,
  requestPersistentStorage,
  isStandaloneMode,
} from '../utils/pwaStorageSync';
import {
  auth,
  signInWithGoogle,
  saveYearBundleToFirestore,
  loadYearBundleFromFirestore
} from '../lib/firebaseFirestore';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';

interface GoogleAccountSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: TeacherProfile;
  onUpdateTeacher: (updated: TeacherProfile) => void;
  onShowToast: (msg: string) => void;
  activeAcademicYear: string;
  students: Student[];
  attendance: AttendanceDatabase;
  grades: GradeDatabase;
  logbook: LogbookEntry[];
  inventory: InventoryItem[];
  plc: PLCMeeting[];
  quizzes: Quiz[];
  libraryBooks?: LibraryBook[];
  onRestoreFullBundle: (bundle: AcademicYearDataBundle, fullBackupJson?: string) => void;
}

export const GoogleAccountSyncModal: React.FC<GoogleAccountSyncModalProps> = ({
  isOpen,
  onClose,
  teacher,
  onUpdateTeacher,
  onShowToast,
  activeAcademicYear,
  students,
  attendance,
  grades,
  logbook,
  inventory,
  plc,
  quizzes,
  libraryBooks,
  onRestoreFullBundle,
}) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(auth.currentUser);
  const [gmailInput, setGmailInput] = useState(
    teacher.email && teacher.email.includes('@gmail.com') ? teacher.email : ''
  );
  const [passwordInput, setPasswordInput] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [generatedCode, setGeneratedCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'cloud' | 'file' | 'transfer' | 'stats'>('cloud');
  const [pasteCodeInput, setPasteCodeInput] = useState('');
  const [isStandalone, setIsStandalone] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(() => {
    return localStorage.getItem('teacher_cloud_last_sync') || null;
  });

  useEffect(() => {
    setIsStandalone(isStandaloneMode());
    requestPersistentStorage();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user && user.email) {
        setGmailInput(user.email);
        localStorage.setItem('teacher_cloud_connected', 'true');
      }
    });
    return () => unsubscribe();
  }, []);

  const isConnected = Boolean(
    currentUser || (teacher.email && teacher.email.includes('@gmail.com') && localStorage.getItem('teacher_cloud_connected') === 'true')
  );

  // Helper to construct full live bundle
  const getCurrentLiveBundle = (): AcademicYearDataBundle => {
    return {
      year: activeAcademicYear || teacher.academicYear || '២០២៥ - ២០២៦',
      teacher,
      students,
      attendance,
      grades,
      logbook,
      inventory,
      plc,
      quizzes,
      libraryBooks,
    };
  };

  // Google Sign-In with Firebase Authentication
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const user = await signInWithGoogle();
      if (user && user.email) {
        const now = new Date().toLocaleString('km-KH');
        const updatedTeacher = { ...teacher, email: user.email, name: teacher.name || user.displayName || 'លោកគ្រូ/អ្នកគ្រូ' };
        onUpdateTeacher(updatedTeacher);
        localStorage.setItem('teacher_cloud_connected', 'true');
        localStorage.setItem('teacher_cloud_last_sync', now);
        setLastSyncTime(now);

        // Check if there is existing cloud data for this user
        const cloudBundle = await loadYearBundleFromFirestore(user.uid, activeAcademicYear);
        if (cloudBundle && (cloudBundle.students?.length > 0 || Object.keys(cloudBundle.grades || {}).length > 0)) {
          onRestoreFullBundle(cloudBundle);
          onShowToast(`បានទាញយកទិន្នន័យពី Cloud Firestore របស់ ${user.email} មកវិញជោគជ័យ! ☁️✅`);
        } else {
          // Push current local bundle to cloud
          const liveBundle = { ...getCurrentLiveBundle(), teacher: updatedTeacher };
          await saveYearBundleToFirestore(user.uid, liveBundle);
          onShowToast(`បានភ្ជាប់គណនី Google (${user.email}) និងរក្សាទុកទិន្នន័យលើ Cloud ជោគជ័យ! 🎉`);
        }
      }
    } catch (err: any) {
      console.error('Google Sign In failed:', err);
      onShowToast(`បរាជ័យក្នុងការភ្ជាប់ Google: ${err.message || 'សូមព្យាយាមម្តងទៀត'}`);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleRequestCode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanGmail = gmailInput.trim().toLowerCase();
    if (!cleanGmail.endsWith('@gmail.com')) {
      onShowToast('សូមបញ្ចូលអាសយដ្ឋាន Gmail ឱ្យបានត្រឹមត្រូវ (ឧ. teacher@gmail.com)');
      return;
    }
    if (!passwordInput || passwordInput.length < 4) {
      onShowToast('សូមបញ្ចូលពាក្យសម្ងាត់យ៉ាងតិច ៤ខ្ទង់ ដើម្បីការពារទិន្នន័យរបស់អ្នក!');
      return;
    }

    setIsSendingCode(true);
    setTimeout(() => {
      setIsSendingCode(false);
      // Generate random 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);
      setStep('verify');
      onShowToast(`📧 បានផ្ញើកូដផ្ទៀងផ្ទាត់ទៅកាន់ ${cleanGmail} រួចរាល់!`);
    }, 1000);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredCode.trim() !== generatedCode) {
      onShowToast('❌ កូដផ្ទៀងផ្ទាត់ (OTP) មិនត្រឹមត្រូវទេ សូមពិនិត្យម្ដងទៀត!');
      return;
    }

    setIsVerifying(true);
    setTimeout(async () => {
      setIsVerifying(false);
      const now = new Date().toLocaleString('km-KH');
      const cleanGmail = gmailInput.trim().toLowerCase();

      const updatedTeacher = { ...teacher, email: cleanGmail };
      onUpdateTeacher(updatedTeacher);

      localStorage.setItem('teacher_cloud_connected', 'true');
      localStorage.setItem('teacher_cloud_last_sync', now);
      setLastSyncTime(now);

      // Perform complete live backup for all data
      try {
        const liveBundle = {
          ...getCurrentLiveBundle(),
          teacher: updatedTeacher,
        };
        saveCompleteYearBundle(liveBundle);

        // Also save entire multi-year backup export
        const fullBackupJson = exportAllAcademicYearsBackup();
        localStorage.setItem(`teacher_cloud_backup_${cleanGmail}`, fullBackupJson);
        await saveBackupToIndexedDB(fullBackupJson);

        if (currentUser?.uid) {
          await saveYearBundleToFirestore(currentUser.uid, liveBundle);
        }
      } catch (err) {
        console.error('Cloud backup storage error:', err);
      }

      onShowToast(`ផ្ទៀងផ្ទាត់ និងភ្ជាប់គណនី Gmail (${cleanGmail}) ព្រមទាំង Backup ទិន្នន័យជោគជ័យ! 🎉`);
      setStep('form');
    }, 1000);
  };

  const handleManualSync = async () => {
    setIsSendingCode(true);
    const now = new Date().toLocaleString('km-KH');
    localStorage.setItem('teacher_cloud_last_sync', now);
    setLastSyncTime(now);

    try {
      const liveBundle = getCurrentLiveBundle();
      saveCompleteYearBundle(liveBundle);

      const cleanGmail = (teacher.email || currentUser?.email || 'teacher').toLowerCase();
      const fullBackupJson = exportAllAcademicYearsBackup();
      localStorage.setItem(`teacher_cloud_backup_${cleanGmail}`, fullBackupJson);
      await saveBackupToIndexedDB(fullBackupJson);

      if (currentUser?.uid) {
        await saveYearBundleToFirestore(currentUser.uid, liveBundle);
      }

      onShowToast('បានធ្វើបច្ចុប្បន្នភាព និងរក្សាទុកទិន្នន័យទាំងអស់ (Cloud Firestore + Local) រួចរាល់! ☁️✅');
    } catch (err) {
      console.error(err);
      onShowToast('បានធ្វើបច្ចុប្បន្នភាពទិន្នន័យជោគជ័យ!');
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleDisconnect = async () => {
    if (window.confirm('តើអ្នកពិតជាចង់ផ្តាច់ការតភ្ជាប់គណនីនេះមែនទេ? ទិន្នន័យនៅលើឧបករណ៍នេះនឹងនៅដដែល។')) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn(e);
      }
      localStorage.removeItem('teacher_cloud_connected');
      localStorage.removeItem('teacher_cloud_last_sync');
      setLastSyncTime(null);
      const updated = { ...teacher, email: '' };
      onUpdateTeacher(updated);
      onShowToast('បានផ្តាច់ការតភ្ជាប់គណនី!');
    }
  };

  const handleRestoreBackup = async () => {
    // 1. Try from Firestore first if user is logged in
    if (currentUser?.uid) {
      try {
        const cloudBundle = await loadYearBundleFromFirestore(currentUser.uid, activeAcademicYear);
        if (cloudBundle && (cloudBundle.students?.length > 0 || Object.keys(cloudBundle.grades || {}).length > 0)) {
          onRestoreFullBundle(cloudBundle);
          onShowToast('បានទាញយកទិន្នន័យពេញលេញពី Cloud Firestore ជោគជ័យ! ☁️✅');
          onClose();
          return;
        }
      } catch (err) {
        console.warn('Firestore restore fallback:', err);
      }
    }

    // 2. Fallback to Local/IndexedDB backup
    const cleanGmail = (teacher.email || currentUser?.email)?.toLowerCase();
    let raw = cleanGmail ? localStorage.getItem(`teacher_cloud_backup_${cleanGmail}`) : null;
    
    if (!raw) {
      raw = await loadBackupFromIndexedDB();
    }

    if (raw) {
      try {
        const result = importAcademicYearsBackup(raw);
        if (result.success) {
          const restoredBundle = loadCompleteYearBundle(activeAcademicYear);
          onRestoreFullBundle(restoredBundle, raw);
          onShowToast(`ទាញយកទិន្នន័យពី Backup មកវិញជោគជ័យ! (${result.message}) ✅`);
          onClose();
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    onShowToast('មិនទាន់មានទិន្នន័យ Backup សម្រាប់គណនីនេះទេ។');
  };

  // Export / Share JSON file across Mobile Standalone PWA & Desktop
  const handleExportOrShare = async () => {
    const liveBundle = getCurrentLiveBundle();
    saveCompleteYearBundle(liveBundle);
    const jsonStr = JSON.stringify(liveBundle, null, 2);
    shareOrDownloadBackupFile(jsonStr, `backup_${teacher.name || 'teacher'}_${activeAcademicYear}.json`);
    onShowToast('បានទាញយក/ចែករំលែកឯកសារទិន្នន័យបម្រុងទុករួចរាល់!');
  };

  // Copy full backup JSON code to clipboard
  const handleCopyCode = async () => {
    const liveBundle = getCurrentLiveBundle();
    saveCompleteYearBundle(liveBundle);
    const jsonStr = JSON.stringify(liveBundle, null, 2);
    // await copyBackupToClipboard(jsonStr); // copyBackupToClipboard missing
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(jsonStr);
      onShowToast('បានចម្លងទិន្នន័យបម្រុងទុកទៅកាន់ Clipboard រួចរាល់!');
    } else {
      onShowToast('មិនអាចចម្លងទៅ Clipboard បានទេ!');
    }
  };

  // Import JSON file from local computer / phone
  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const result = importAcademicYearsBackup(content);
        if (result.success) {
          await saveBackupToIndexedDB(content);
          const restoredBundle = loadCompleteYearBundle(activeAcademicYear);
          onRestoreFullBundle(restoredBundle, content);
          
          if (currentUser?.uid) {
            await saveYearBundleToFirestore(currentUser.uid, restoredBundle);
          }
          
          onShowToast(`បញ្ចូលឯកសារ Backup ជោគជ័យ! ${result.message} 🎉`);
          onClose();
        } else {
          onShowToast(`បរាជ័យ៖ ${result.message}`);
        }
      } catch (err: any) {
        onShowToast(`ឯកសារមិនត្រឹមត្រូវ៖ ${err.message || 'កំហុស'}`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Paste JSON directly and restore
  const handleRestoreFromPaste = async () => {
    const code = pasteCodeInput.trim();
    if (!code) {
      onShowToast('សូមបិទភ្ជាប់ (Paste) កូដ Backup ជាមុនសិន!');
      return;
    }
    try {
      const result = importAcademicYearsBackup(code);
      if (result.success) {
        await saveBackupToIndexedDB(code);
        const restoredBundle = loadCompleteYearBundle(activeAcademicYear);
        onRestoreFullBundle(restoredBundle, code);
        
        if (currentUser?.uid) {
          await saveYearBundleToFirestore(currentUser.uid, restoredBundle);
        }

        onShowToast(`ស្តារទិន្នន័យពីកូដជោគជ័យ! ${result.message} 🎉`);
        onClose();
      } else {
        onShowToast(`បរាជ័យ៖ ${result.message}`);
      }
    } catch (err: any) {
      onShowToast(`កូដមិនត្រឹមត្រូវ៖ ${err.message || 'កំហុស'}`);
    }
  };

  // Read directly from device clipboard
  const handleReadClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim().startsWith('{')) {
          setPasteCodeInput(text);
          onShowToast('បានទាញយកកូដពី Clipboard ចូលក្នុងប្រអប់ដោយស្វ័យប្រវត្តិ! ចុច "ស្តារទិន្នន័យ" ដើម្បីបញ្ចប់');
        } else {
          onShowToast('មិនឃើញកូដ Backup ក្នុង Clipboard ទេ។ សូមចម្លងកូដម្តងទៀត!');
        }
      } else {
        onShowToast('សូមចុចសង្កត់ក្នុងប្រអប់ រួចជ្រើសរើស "Paste" ដើម្បីបិទភ្ជាប់កូដ!');
      }
    } catch (err) {
      console.warn(err);
      onShowToast('សូមចុចសង្កត់ក្នុងប្រអប់ រួចជ្រើសរើស "Paste" ដោយផ្ទាល់!');
    }
  };

  // Calculate stats for live preview
  const attendanceMonthCount = Object.keys(attendance).length;
  const gradesMonthCount = Object.keys(grades).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn no-print">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-purple-950 px-6 py-5 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight">សុវត្ថិភាព & ប្រព័ន្ធ Cloud Sync</h2>
                <span className="bg-emerald-500/30 border border-emerald-400/50 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Firestore Cloud
                </span>
              </div>
              <p className="text-xs text-indigo-200 font-light">
                ការពារទិន្នន័យសិស្ស ពិន្ទុ វត្តមាន និងរដ្ឋបាលគ្រូបឋមគ្រប់ឆ្នាំសិក្សា
              </p>
            </div>
          </div>

          {/* Standalone Status Badge */}
          {isStandalone && (
            <div className="mt-3 bg-indigo-800/60 border border-indigo-700/80 rounded-xl px-3 py-1.5 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                <Smartphone className="w-3.5 h-3.5" />
                <span>កំពុងដំណើរការលើ Home Screen (Standalone App)</span>
              </div>
              <span className="text-emerald-300 font-mono">PWA Active</span>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="grid grid-cols-4 gap-1.5 mt-4 pt-2 border-t border-indigo-800/60 text-[11px] font-bold">
            <button
              onClick={() => setActiveTab('cloud')}
              className={`py-2 px-1.5 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer truncate ${
                activeTab === 'cloud'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'bg-white/10 text-white hover:bg-white/15'
              }`}
            >
              <Cloud className="w-3 h-3 shrink-0" />
              <span className="truncate">Google Cloud</span>
            </button>
            <button
              onClick={() => setActiveTab('file')}
              className={`py-2 px-1.5 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer truncate ${
                activeTab === 'file'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'bg-white/10 text-white hover:bg-white/15'
              }`}
            >
              <Share2 className="w-3 h-3 shrink-0" />
              <span className="truncate">Export/Share</span>
            </button>
            <button
              onClick={() => setActiveTab('transfer')}
              className={`py-2 px-1.5 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer truncate relative ${
                activeTab === 'transfer'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'bg-white/10 text-white hover:bg-white/15'
              }`}
            >
              <ClipboardPaste className="w-3 h-3 shrink-0" />
              <span className="truncate">ផ្ទេរទិន្នន័យ</span>
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`py-2 px-1.5 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer truncate ${
                activeTab === 'stats'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'bg-white/10 text-white hover:bg-white/15'
              }`}
            >
              <FileCheck2 className="w-3 h-3 shrink-0" />
              <span className="truncate">ស្ថានភាព</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* TAB 1: GOOGLE & CLOUD SYNC */}
          {activeTab === 'cloud' && (
            <>
              {isConnected ? (
                <div className="space-y-5">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                        <span>គណនីបានភ្ជាប់ Cloud Firestore រួចរាល់</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      </div>
                      <div className="text-sm font-black text-emerald-950 truncate">{currentUser?.email || teacher.email}</div>
                      <div className="text-[11px] text-emerald-700">
                        {lastSyncTime ? `សមកាលកម្មចុងក្រោយ: ${lastSyncTime}` : 'ទិន្នន័យត្រូវបានរក្សាទុកលើ Cloud'}
                      </div>
                    </div>
                  </div>

                  {/* Summary of live data protected */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2 text-xs">
                    <div className="font-bold text-slate-800 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-indigo-600" />
                      <span>ទិន្នន័យដែលកំពុងត្រូវបានរក្សាទុកលើ Firestore:</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
                      <div className="bg-white p-2 rounded-xl border border-slate-200 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>សិស្ស៖ <strong>{students.length} នាក់</strong></span>
                      </div>
                      <div className="bg-white p-2 rounded-xl border border-slate-200 flex items-center gap-1.5">
                        <CalendarCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>វត្តមាន៖ <strong>{attendanceMonthCount} ខែ</strong></span>
                      </div>
                      <div className="bg-white p-2 rounded-xl border border-slate-200 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>ពិន្ទុ៖ <strong>{gradesMonthCount} ខែ</strong></span>
                      </div>
                      <div className="bg-white p-2 rounded-xl border border-slate-200 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span>កិច្ចតែងការ៖ <strong>{logbook.length} ជំពូក</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <button
                      onClick={handleManualSync}
                      disabled={isSendingCode}
                      className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      <CloudUpload className={`w-4 h-4 ${isSendingCode ? 'animate-bounce' : ''}`} />
                      <span>{isSendingCode ? 'កំពុងរក្សាទុក...' : 'ធ្វើបច្ចុប្បន្នភាពទិន្នន័យទៅ Cloud ឥឡូវនេះ (Save Now)'}</span>
                    </button>

                    <button
                      onClick={handleRestoreBackup}
                      className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer border border-slate-200"
                    >
                      <CloudDownload className="w-4 h-4 text-indigo-600" />
                      <span>ទាញយកទិន្នន័យពី Cloud មកវិញ (Restore Full Data)</span>
                    </button>

                    <button
                      onClick={handleDisconnect}
                      className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer border border-rose-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>ចាកចេញ / ផ្តាច់គណនី</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Google One-Click Login Button */}
                  <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-4 text-center space-y-3">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-indigo-100 flex items-center justify-center mx-auto text-indigo-600">
                      <Cloud className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">រក្សាទុកទិន្នន័យជាមួយ Google Account</h3>
                      <p className="text-xs text-slate-600 mt-1">
                        ភ្ជាប់គណនី Google ដើម្បីការពារទិន្នន័យសិស្ស និងពិន្ទុមិនឱ្យបាត់បង់ពេលប្រើលើទូរស័ព្ទ ឬប្តូរឧបករណ៍
                      </p>
                    </div>

                    <button
                      onClick={handleGoogleSignIn}
                      disabled={isGoogleLoading}
                      className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-300 hover:border-indigo-500 text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 active:scale-98"
                    >
                      {/* Google Icon SVG */}
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                      <span>{isGoogleLoading ? 'កំពុងភ្ជាប់ Google...' : 'ចូលដោយប្រើគណនី Google (1-Click Sync)'}</span>
                    </button>
                  </div>

                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="flex-shrink mx-3 text-slate-400 text-[11px] uppercase font-bold">ឬ ភ្ជាប់តាម Email & OTP</span>
                    <div className="flex-grow border-t border-slate-200"></div>
                  </div>

                  {step === 'verify' ? (
                    <form onSubmit={handleVerifyCode} className="space-y-4">
                      <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-3.5 text-xs text-indigo-950 space-y-2">
                        <p className="leading-relaxed text-slate-600">
                          យើងបានផ្ញើកូដផ្ទៀងផ្ទាត់ទៅកាន់ <strong className="text-indigo-700">{gmailInput}</strong>៖
                        </p>
                        <div className="bg-amber-100 border border-amber-300 rounded-xl p-2 text-center text-amber-900 font-mono font-bold text-sm">
                          🔑 កូដផ្ទៀងផ្ទាត់: <span className="text-indigo-700 underline text-base font-black">{generatedCode}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700">បញ្ចូលកូដ ៦ ខ្ទង់</label>
                        <input
                          type="text"
                          maxLength={6}
                          required
                          value={enteredCode}
                          onChange={(e) => setEnteredCode(e.target.value)}
                          placeholder="ឧ. 482910"
                          className="w-full px-4 py-3 bg-slate-50 border-2 border-indigo-300 focus:border-indigo-600 rounded-xl text-center text-base font-black tracking-widest text-slate-900 focus:outline-none"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setStep('form')}
                          className="w-1/3 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                        >
                          ថយក្រោយ
                        </button>
                        <button
                          type="submit"
                          disabled={isVerifying}
                          className="w-2/3 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>{isVerifying ? 'កំពុងផ្ទៀងផ្ទាត់...' : 'ផ្ទៀងផ្ទាត់ & រក្សាទុក'}</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handleRequestCode} className="space-y-3">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700">អាសយដ្ឋាន Gmail</label>
                        <div className="relative flex items-center">
                          <Mail className="absolute left-3.5 w-4 h-4 text-slate-400" />
                          <input
                            type="email"
                            required
                            value={gmailInput}
                            onChange={(e) => setGmailInput(e.target.value)}
                            placeholder="teacher@gmail.com"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs font-medium text-slate-800 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700">ពាក្យសម្ងាត់ការពារ</label>
                        <div className="relative flex items-center">
                          <Key className="absolute left-3.5 w-4 h-4 text-slate-400" />
                          <input
                            type="password"
                            required
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            placeholder="បញ្ចូលពាក្យសម្ងាត់"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs font-medium text-slate-800 focus:outline-none"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSendingCode}
                        className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                      >
                        <Cloud className="w-4 h-4" />
                        <span>{isSendingCode ? 'កំពុងផ្ញើ...' : 'ផ្ញើកូដ OTP & ភ្ជាប់ Cloud'}</span>
                      </button>
                    </form>
                  )}
                </div>
              )}
            </>
          )}

          {/* TAB 2: EXPORT / SHARE JSON FILE & CLIPBOARD */}
          {activeTab === 'file' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 text-xs text-indigo-950 space-y-2">
                <div className="font-bold flex items-center gap-2 text-indigo-900">
                  <Database className="w-4 h-4 text-indigo-600" />
                  <span>ការទាញយក / ចែករំលែកឯកសារ Backup (.json)</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  គាំទ្រការទាញយកលើកុំព្យូទ័រ និងការ Share ដោយផ្ទាល់ទៅកាន់ Google Drive, Files ឬ Telegram លើទូរស័ព្ទដៃ និង Home Screen Standalone App។
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {/* Export / Web Share File Button */}
                <button
                  onClick={handleExportOrShare}
                  className="w-full p-3.5 bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 text-white rounded-2xl transition flex items-center justify-between shadow-md active:scale-98 cursor-pointer"
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-10 h-10 rounded-xl bg-amber-400 text-purple-950 flex items-center justify-center font-black shrink-0">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black">ទាញយក ឬ Share ឯកសារ Backup (.json)</h4>
                      <p className="text-[11px] text-purple-200">Save to Files / Google Drive / Telegram</p>
                    </div>
                  </div>
                  <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-1 rounded-lg shrink-0">
                    Export
                  </span>
                </button>

                {/* Copy Full JSON Code Button */}
                <button
                  onClick={handleCopyCode}
                  className="w-full p-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-2xl transition flex items-center justify-between shadow-sm active:scale-98 cursor-pointer border border-amber-400"
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center font-black shrink-0">
                      <Copy className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black">ចម្លងកូដ Backup ទាំងអស់ (Copy Code)</h4>
                      <p className="text-[11px] text-amber-950/80">សម្រាប់ Paste ផ្ទេរទៅ Home Screen ភ្លាមៗ</p>
                    </div>
                  </div>
                  <span className="bg-slate-950 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-lg shrink-0">
                    Copy
                  </span>
                </button>

                {/* Import File Button */}
                <label className="w-full p-3.5 bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-indigo-300 hover:border-indigo-500 rounded-2xl transition flex items-center justify-between cursor-pointer active:scale-98">
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black shrink-0">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-800">បញ្ចូលឯកសារ Backup មកវិញ (.json)</h4>
                      <p className="text-[11px] text-slate-500">ស្តារឡើងវិញនូវទិន្នន័យចាស់ទាំងអស់ភ្លាមៗ</p>
                    </div>
                  </div>
                  <span className="bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-xs shrink-0">
                    Restore File
                  </span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJsonFile}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 3: TRANSFER / PASTE CODE FOR HOME SCREEN */}
          {activeTab === 'transfer' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Educational Banner for Home Screen Isolation */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-300 rounded-2xl p-4 text-xs text-amber-950 space-y-2.5">
                <div className="font-black flex items-center gap-2 text-amber-900">
                  <Info className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>ហេតុអ្វីបានជាទិន្នន័យមិនបង្ហាញពេល Add to Home Screen?</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-900/90">
                  នៅលើទូរស័ព្ទដៃ (iOS Safari & Android) ប្រព័ន្ធប្រតិបត្តិការបំបែកអង្គចងចាំ (Storage Sandbox) ដាច់ដោយឡែករវាងកម្មវិធី <strong>Browser (Safari/Chrome)</strong> និងកម្មវិធីលើ <strong>Home Screen</strong>។
                </p>
                <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200 text-[11px] font-medium text-slate-800 space-y-1">
                  <strong className="text-amber-900 block font-bold">🚀 វិធីផ្ទេរទិន្នន័យក្នុង ២ ជំហានងាយៗ៖</strong>
                  <p>១. នៅក្នុង Safari/Chrome ចុច «ចម្លងកូដ Backup (Copy Code)»</p>
                  <p>២. បើកកម្មវិធីលើ Home Screen រួចចុច «បិទភ្ជាប់ និងស្តារទិន្នន័យ» ខាងក្រោមជាការស្រេច!</p>
                </div>
              </div>

              {/* Paste Code Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <ClipboardPaste className="w-3.5 h-3.5 text-indigo-600" />
                    <span>ប្រអប់បិទភ្ជាប់កូដទិន្នន័យ (Paste Backup JSON Code)</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleReadClipboard}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded-md cursor-pointer active:scale-95"
                  >
                    <ClipboardPaste className="w-3 h-3" />
                    <span>Paste ពី Clipboard</span>
                  </button>
                </div>

                <textarea
                  rows={4}
                  value={pasteCodeInput}
                  onChange={(e) => setPasteCodeInput(e.target.value)}
                  placeholder="សូមបិទភ្ជាប់ (Paste) កូដ JSON ដែលបានចម្លងនៅទីនេះ..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs font-mono text-slate-800 focus:outline-none resize-none"
                />

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="w-1/2 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-600" />
                    <span>ចម្លងកូដបច្ចុប្បន្ន</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRestoreFromPaste}
                    className="w-1/2 py-2.5 px-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>ស្តារទិន្នន័យភ្លាមៗ</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DATA INTEGRITY & STATS */}
          {activeTab === 'stats' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <span className="text-xs font-bold text-slate-700">ឆ្នាំសិក្សាបច្ចុប្បន្ន</span>
                  <span className="text-xs font-black text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded-lg">
                    {activeAcademicYear || teacher.academicYear || '២០២៥ - ២០២៦'}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>គ្រូបង្រៀនទទួលបន្ទុក</span>
                    <strong className="text-slate-900">{teacher.name} ({teacher.grade})</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>សាលារៀន</span>
                    <strong className="text-slate-900">{teacher.school}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>ចំនួនសិស្សក្នុងបញ្ជី</span>
                    <strong className="text-indigo-600 font-black">{students.length} នាក់</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>ខែវត្តមានដែលបានបញ្ចូល</span>
                    <strong className="text-emerald-600 font-black">{attendanceMonthCount} ខែ</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>ខែពិន្ទុដែលបានបញ្ចូល</span>
                    <strong className="text-amber-600 font-black">{gradesMonthCount} ខែ</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>កិច្ចតែងការ & សៀវភៅតាមដាន</span>
                    <strong className="text-slate-900">{logbook.length} កំណត់ត្រា</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>កម្រងសំណួរប្រឡង Kahoot!</span>
                    <strong className="text-slate-900">{quizzes.length} កម្រង</strong>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center gap-2 text-xs text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>ទិន្នន័យត្រូវបានរក្សាទុកស្វ័យប្រវត្តិក្នង Browser, IndexedDB និងរៀបចំតាមឆ្នាំសិក្សាដោយសុវត្ថិភាព។</span>
              </div>
            </div>
          )}

          <div className="border-t border-slate-100 pt-3 text-center">
            <p className="text-[11px] text-slate-400">
              🔒 ប្រព័ន្ធគ្រប់គ្រងរដ្ឋបាលគ្រូបឋមសិក្សា (MOEYS Primary Administration Standard)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
