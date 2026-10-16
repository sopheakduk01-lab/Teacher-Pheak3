import React, { useState, useEffect } from 'react';
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
  AttendanceStatus,
} from './types';
import {
  initialTeacherProfile,
  initialStudents,
  initialAttendance,
  initialGrades,
  initialLogbook,
  initialInventory,
  initialPLC,
  initialQuizzes,
  initialLibraryBooks,
} from './data/initialData';
import {
  getActiveAcademicYear,
  setActiveAcademicYear,
  getAcademicYearsList,
  loadCompleteYearBundle,
  loadYearScopedData,
  saveYearScopedData,
  saveCompleteYearBundle,
  AcademicYearDataBundle,
  exportAllAcademicYearsBackup,
  importAcademicYearsBackup,
} from './utils/academicYearStorage';
import {
  requestPersistentStorage,
  saveBackupToIndexedDB,
  loadBackupFromIndexedDB,
  isStandaloneMode,
} from './utils/pwaStorageSync';
import {
  auth,
  saveYearBundleToFirestore,
  loadYearBundleFromFirestore,
} from './lib/firebaseFirestore';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { updateStudentGradeRecord } from './utils/gradeManager';
import { PrintHeader } from './components/PrintHeader';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MobileBottomDock } from './components/MobileBottomDock';
import { HomeTab } from './components/HomeTab';
import { AdminTab } from './components/AdminTab';
import { DiscoverTab } from './components/DiscoverTab';
import { CreateQuizTab } from './components/CreateQuizTab';
import { LibraryTab } from './components/LibraryTab';
import { JoinPinTab } from './components/JoinPinTab';
import { GamesTab } from './components/GamesTab';
import { HonorRollManager } from './components/HonorRollManager';
import { StudentPortalView } from './components/StudentPortalView';
import { TeacherProfileModal } from './components/TeacherProfileModal';
import { GoogleAccountSyncModal } from './components/GoogleAccountSyncModal';
import { AcademicYearManagerModal } from './components/AcademicYearManagerModal';
import { LiveQuizModal } from './components/LiveQuizModal';
import { CustomizeModal } from './components/CustomizeModal';
import { ClassGroupChatModal } from './components/ClassGroupChatModal';
import { TeacherAuthLampModal } from './components/TeacherAuthLampModal';
import { MobileSlideRemoteController } from './components/MobileSlideRemoteController';
import { TeacherOfficialNoticeModal } from './components/TeacherOfficialNoticeModal';
import { CivilServantHolidaysModal } from './components/CivilServantHolidaysModal';
import { MathLesson1ExamModal } from './components/MathLesson1ExamModal';
import { HealthEducationInteractiveViewer } from './components/HealthEducationInteractiveViewer';
import { HealthEducation40ExamModal } from './components/HealthEducation40ExamModal';
import { ScienceLesson1InteractiveViewer } from './components/ScienceLesson1InteractiveViewer';
import { CheckCircle2, Sparkles, X, Palette, Smartphone } from 'lucide-react';

const STORAGE_KEY = 'primary_teacher_admin_v2';

export default function App() {
  // Check if opened as mobile remote control from QR code
  const [remoteSessionId, setRemoteSessionId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('remote') || params.get('session') || null;
    }
    return null;
  });

  // Navigation & Direct Student Link Mode Detection
  const [currentTab, setCurrentTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      const isStudentPortal =
        params.get('studentPortal') === 'true' ||
        params.get('portal') === 'true' ||
        params.get('student') !== null ||
        params.get('studentId') !== null ||
        params.get('mode') === 'student' ||
        tabParam === 'student_portal' ||
        tabParam === 'student';

      if (isStudentPortal) {
        return 'student_portal';
      }
      if (tabParam) {
        return tabParam;
      }
    }
    return 'home';
  });

  // Active Academic Year State
  const [activeAcademicYear, setActiveAcademicYearState] = useState<string>(() => {
    return getActiveAcademicYear();
  });
  const [isYearManagerModalOpen, setIsYearManagerModalOpen] = useState<boolean>(false);

  // Teacher Profile
  const [teacher, setTeacher] = useState<TeacherProfile>(() => {
    const activeYear = getActiveAcademicYear();
    const bundle = loadCompleteYearBundle(activeYear);
    return bundle.teacher;
  });

  // Students List
  const [students, setStudents] = useState<Student[]>(() => {
    const activeYear = getActiveAcademicYear();
    const bundle = loadCompleteYearBundle(activeYear);
    return bundle.students;
  });

  // Attendance
  const [attendance, setAttendance] = useState<AttendanceDatabase>(() => {
    const activeYear = getActiveAcademicYear();
    const bundle = loadCompleteYearBundle(activeYear);
    return bundle.attendance;
  });

  // Grades
  const [grades, setGrades] = useState<GradeDatabase>(() => {
    const activeYear = getActiveAcademicYear();
    const bundle = loadCompleteYearBundle(activeYear);
    return bundle.grades;
  });

  // Logbook
  const [logbook, setLogbook] = useState<LogbookEntry[]>(() => {
    const activeYear = getActiveAcademicYear();
    const bundle = loadCompleteYearBundle(activeYear);
    return bundle.logbook;
  });

  // Inventory
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const activeYear = getActiveAcademicYear();
    const bundle = loadCompleteYearBundle(activeYear);
    return bundle.inventory;
  });

  // PLC Meetings
  const [plc, setPlc] = useState<PLCMeeting[]>(() => {
    const activeYear = getActiveAcademicYear();
    const bundle = loadCompleteYearBundle(activeYear);
    return bundle.plc;
  });

  // Quizzes / Lessons
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const activeYear = getActiveAcademicYear();
    const bundle = loadCompleteYearBundle(activeYear);
    return bundle.quizzes;
  });

  // Library Books
  const [libraryBooks, setLibraryBooks] = useState<LibraryBook[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_library_books`);
    if (!saved) return initialLibraryBooks;
    try {
      const parsed: LibraryBook[] = JSON.parse(saved);
      const initialMap = new Map(initialLibraryBooks.map((b) => [b.id, b]));
      const updated = parsed.map((b) => {
        const defaultBook = initialMap.get(b.id);
        if (defaultBook && b.id === 'book-math-6' && (!b.fileData || b.fileData.length < (defaultBook.fileData?.length || 0))) {
          return defaultBook;
        }
        return b;
      });
      const existingIds = new Set(updated.map((b) => b.id));
      const missingDefaults = initialLibraryBooks.filter((b) => !existingIds.has(b.id));
      if (missingDefaults.length > 0) {
        return [...missingDefaults, ...updated];
      }
      return updated;
    } catch {
      return initialLibraryBooks;
    }
  });

  // Switch academic year and refresh loaded data
  const handleAcademicYearChange = (newYear: string) => {
    setActiveAcademicYear(newYear);
    setActiveAcademicYearState(newYear);
    const bundle = loadCompleteYearBundle(newYear, teacher);
    setTeacher(bundle.teacher);
    setStudents(bundle.students);
    setAttendance(bundle.attendance);
    setGrades(bundle.grades);
    setLogbook(bundle.logbook);
    setInventory(bundle.inventory);
    setPlc(bundle.plc);
    setQuizzes(bundle.quizzes);
  };

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_library_books`, JSON.stringify(libraryBooks));
    } catch (err) {
      console.warn('LocalStorage quota exceeded:', err);
      showToast('ទំហំឯកសារធំពេក! សូមជ្រើសរើសឯកសារទំហំតូចជាង ឬកត់ត្រាតាមអត្ថបទ។');
    }
  }, [libraryBooks]);

  const handleAddBook = (bookData: Omit<LibraryBook, 'id' | 'uploadedDate'>) => {
    const newBook: LibraryBook = {
      ...bookData,
      id: `book-${Date.now()}`,
      uploadedDate: new Date().toISOString().split('T')[0],
    };
    setLibraryBooks([newBook, ...libraryBooks]);
    showToast('បានទាញយក និងរក្សាទុកសៀវភៅក្នុងបណ្ណាល័យដោយជោគជ័យ!');
  };

  const handleDeleteBook = (id: string) => {
    setLibraryBooks(libraryBooks.filter(b => b.id !== id));
    showToast('បានលុបសៀវភៅចេញពីបណ្ណាល័យ!');
  };

  // Full Restore Data Handler (Students, Attendance, Grades, Logbook, PLC, Inventory, Quizzes)
  const handleRestoreFullBundle = (bundle: AcademicYearDataBundle, fullBackupJson?: string) => {
    if (!bundle) return;
    if (bundle.year) {
      setActiveAcademicYear(bundle.year);
      setActiveAcademicYearState(bundle.year);
    }
    if (bundle.teacher) setTeacher(bundle.teacher);
    if (bundle.students) setStudents(bundle.students);
    if (bundle.attendance) setAttendance(bundle.attendance);
    if (bundle.grades) setGrades(bundle.grades);
    if (bundle.logbook) setLogbook(bundle.logbook);
    if (bundle.inventory) setInventory(bundle.inventory);
    if (bundle.plc) setPlc(bundle.plc);
    if (bundle.quizzes) setQuizzes(bundle.quizzes);
    if (bundle.libraryBooks) setLibraryBooks(bundle.libraryBooks);

    saveCompleteYearBundle(bundle);
    if (fullBackupJson) {
      saveBackupToIndexedDB(fullBackupJson);
    }
  };

  // Customization States
  const [fontFamily, setFontFamily] = useState<string>(() => {
    return localStorage.getItem(`${STORAGE_KEY}_font`) || 'Battambang';
  });
  const [backgroundTheme, setBackgroundTheme] = useState<string>(() => {
    return localStorage.getItem(`${STORAGE_KEY}_theme`) || 'default';
  });
  const [fontSizeScale, setFontSizeScale] = useState<string>(() => {
    return localStorage.getItem(`${STORAGE_KEY}_fontsize`) || 'base';
  });
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState<boolean>(false);
  const [isAccountSyncModalOpen, setIsAccountSyncModalOpen] = useState<boolean>(false);
  const [isLampAuthModalOpen, setIsLampAuthModalOpen] = useState<boolean>(false);

  // Sidebar Collapse / Toggle States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem(`${STORAGE_KEY}_sidebar_collapsed`) === 'true';
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(`${STORAGE_KEY}_sidebar_collapsed`, String(next));
      showToast(next ? 'បានបង្រួមរបាចំហៀង!' : 'បានពង្រីករបាចំហៀង!');
      return next;
    });
  };

  // Active Live Session State
  const [activeSession, setActiveSession] = useState<{
    pin: string;
    active: boolean;
    quizTitle: string;
    studentCount: number;
  }>({
    pin: '859 204',
    active: false,
    quizTitle: 'តេស្តសមត្ថភាពការអាន និងយល់ន័យ ភាសាខ្មែរ ថ្នាក់ទី៤',
    studentCount: 12,
  });

  // Modals
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isClassGroupChatOpen, setIsClassGroupChatOpen] = useState(false);
  const [isLiveQuizModalOpen, setIsLiveQuizModalOpen] = useState(false);
  const [currentActiveQuiz, setCurrentActiveQuiz] = useState<Quiz>(quizzes[0]);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isTeacherNoticesModalOpen, setIsTeacherNoticesModalOpen] = useState(false);
  const [isCivilServantHolidaysModalOpen, setIsCivilServantHolidaysModalOpen] = useState(false);
  const [isHealthInteractiveOpen, setIsHealthInteractiveOpen] = useState(false);
  const [isHealthExamOpen, setIsHealthExamOpen] = useState(false);
  const [healthExamLessonNumber, setHealthExamLessonNumber] = useState(1);
  const [isScienceLesson1Open, setIsScienceLesson1Open] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Sync state to year-scoped local storage
  useEffect(() => {
    if (activeAcademicYear) {
      saveYearScopedData(activeAcademicYear, 'teacher', teacher);
      try {
        localStorage.setItem(`${STORAGE_KEY}_teacher`, JSON.stringify(teacher));
      } catch {}
    }
  }, [teacher, activeAcademicYear]);

  useEffect(() => {
    if (activeAcademicYear) {
      saveYearScopedData(activeAcademicYear, 'students', students);
      try {
        localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(students));
      } catch {}
    }
  }, [students, activeAcademicYear]);

  useEffect(() => {
    if (activeAcademicYear) {
      saveYearScopedData(activeAcademicYear, 'attendance', attendance);
      try {
        localStorage.setItem(`${STORAGE_KEY}_attendance`, JSON.stringify(attendance));
      } catch {}
    }
  }, [attendance, activeAcademicYear]);

  useEffect(() => {
    if (activeAcademicYear) {
      saveYearScopedData(activeAcademicYear, 'grades', grades);
      try {
        localStorage.setItem(`${STORAGE_KEY}_grades`, JSON.stringify(grades));
      } catch {}
    }
  }, [grades, activeAcademicYear]);

  useEffect(() => {
    if (activeAcademicYear) {
      saveYearScopedData(activeAcademicYear, 'logbook', logbook);
      try {
        localStorage.setItem(`${STORAGE_KEY}_logbook`, JSON.stringify(logbook));
      } catch {}
    }
  }, [logbook, activeAcademicYear]);

  useEffect(() => {
    if (activeAcademicYear) {
      saveYearScopedData(activeAcademicYear, 'inventory', inventory);
      try {
        localStorage.setItem(`${STORAGE_KEY}_inventory`, JSON.stringify(inventory));
      } catch {}
    }
  }, [inventory, activeAcademicYear]);

  useEffect(() => {
    if (activeAcademicYear) {
      saveYearScopedData(activeAcademicYear, 'plc', plc);
      try {
        localStorage.setItem(`${STORAGE_KEY}_plc`, JSON.stringify(plc));
      } catch {}
    }
  }, [plc, activeAcademicYear]);

  useEffect(() => {
    if (activeAcademicYear) {
      saveYearScopedData(activeAcademicYear, 'quizzes', quizzes);
      try {
        const nonMath = quizzes.filter(
          (q) => !q.id || !String(q.id).startsWith('quiz-math-lesson')
        );
        localStorage.setItem(`${STORAGE_KEY}_quizzes`, JSON.stringify(nonMath));
      } catch {}
    }
  }, [quizzes, activeAcademicYear]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_font`, fontFamily);
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--app-font-family', `"${fontFamily}", 'Kantumruy Pro', 'Battambang', 'Siemreap', sans-serif`);
      document.body.style.fontFamily = `"${fontFamily}", 'Kantumruy Pro', 'Battambang', 'Siemreap', sans-serif`;
    }
  }, [fontFamily]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_theme`, backgroundTheme);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', backgroundTheme);
    }
  }, [backgroundTheme]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_fontsize`, fontSizeScale);
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--app-font-size', getFontSizePx(fontSizeScale));
    }
  }, [fontSizeScale]);

  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(auth.currentUser);

  // Request Persistent Storage, Sync IndexedDB and Listen to Firebase Firestore
  useEffect(() => {
    requestPersistentStorage();

    // 1. Check if running on Home Screen / Standalone and sync from IndexedDB if localStorage was empty
    const initStorage = async () => {
      try {
        const idbBackup = await loadBackupFromIndexedDB();
        if (idbBackup) {
          const currentList = localStorage.getItem('moeys_teacher_academic_years_list_v1');
          if (!currentList) {
            const res = importAcademicYearsBackup(idbBackup);
            if (res.success) {
              const restored = loadCompleteYearBundle(activeAcademicYear);
              handleRestoreFullBundle(restored, idbBackup);
              showToast('បានស្តារទិន្នន័យពី IndexedDB ស្វ័យប្រវត្តិ! 📲✨');
            }
          }
        }
      } catch (e) {
        console.warn('IDB init error:', e);
      }
    };
    initStorage();

    // 2. Firebase Auth listener & Firestore live data restore
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const cloudBundle = await loadYearBundleFromFirestore(user.uid, activeAcademicYear);
          if (cloudBundle && (cloudBundle.students?.length > 0 || Object.keys(cloudBundle.grades || {}).length > 0)) {
            const localBundle = loadCompleteYearBundle(activeAcademicYear);
            const localTime = localBundle.lastModified || 0;
            const cloudTime = cloudBundle.lastModified || (cloudBundle.updatedAt ? new Date(cloudBundle.updatedAt).getTime() : 0);

            // Only restore if cloud data is strictly newer or local has no data
            if (cloudTime > localTime || (!localBundle.students?.length && cloudBundle.students?.length > 0)) {
              handleRestoreFullBundle(cloudBundle);
              showToast(`បានទាញយកទិន្នន័យពី Cloud Firestore (${user.email}) រួចរាល់! ☁️✅`);
            } else if (localTime > cloudTime) {
              // Local is newer: upload local bundle to cloud so cloud stays up to date
              await saveYearBundleToFirestore(user.uid, localBundle);
            }
          }
        } catch (err) {
          console.warn('Firestore auto-fetch on mount:', err);
        }
      }
    });

    return () => unsubscribe();
  }, [activeAcademicYear]);

  // Background Mirror to IndexedDB and Firestore whenever critical data updates
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const fullBackup = exportAllAcademicYearsBackup();
        await saveBackupToIndexedDB(fullBackup);

        // If user is authenticated, automatically sync to Firestore Cloud
        if (auth.currentUser?.uid) {
          const priFormData = loadYearScopedData<any>(activeAcademicYear, 'moeys_pri_form_data', undefined);
          const priLiveSyncActive = loadYearScopedData<boolean | undefined>(activeAcademicYear, 'moeys_pri_live_sync_active', undefined);
          const liveBundle: AcademicYearDataBundle = {
            year: activeAcademicYear,
            teacher,
            students,
            attendance,
            grades,
            logbook,
            inventory,
            plc,
            quizzes,
            libraryBooks,
            priFormData,
            priLiveSyncActive,
            lastModified: Date.now(),
          };
          await saveYearBundleToFirestore(auth.currentUser.uid, liveBundle);
        }
      } catch (err) {
        console.warn('Auto backup write error:', err);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [students, attendance, grades, logbook, inventory, plc, quizzes, teacher, activeAcademicYear, libraryBooks]);

  // Handlers
  const handleAddStudent = (studentData: Omit<Student, 'id' | 'rollNo'>) => {
    const newId = Date.now();
    const newStudent: Student = {
      id: newId,
      rollNo: students.length + 1,
      ...studentData,
    };
    const nextStudents = [...students, newStudent];
    setStudents(nextStudents);
    saveYearScopedData(activeAcademicYear, 'students', nextStudents);
    saveYearScopedData(activeAcademicYear, 'last_modified', Date.now());
    localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(nextStudents));
    showToast(`បានបញ្ចូលសិស្ស ${newStudent.name} និងរក្សាទុកជោគជ័យ!`);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    const nextStudents = students.map(s => s.id === updatedStudent.id ? updatedStudent : s);
    setStudents(nextStudents);
    saveYearScopedData(activeAcademicYear, 'students', nextStudents);
    saveYearScopedData(activeAcademicYear, 'last_modified', Date.now());
    localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(nextStudents));
    showToast('បានកែប្រែ និងរក្សាទុកទិន្នន័យសិស្សជោគជ័យ');
  };

  const handleImportStudents = (newStudentsList: Student[], replaceAll = false) => {
    const nextStudents = replaceAll ? newStudentsList : [...students, ...newStudentsList];
    setStudents(nextStudents);
    saveYearScopedData(activeAcademicYear, 'students', nextStudents);
    saveYearScopedData(activeAcademicYear, 'last_modified', Date.now());
    localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(nextStudents));
    showToast(`បាននាំចូលសិស្សចំនួន ${newStudentsList.length} នាក់ និងរក្សាទុកដោយជោគជ័យ!`);
  };

  const handleDeleteStudent = (id: number) => {
    if (window.confirm('តើអ្នកពិតជាចង់លុបឈ្មោះសិស្សនេះមែនទេ?')) {
      const nextStudents = students.filter((s) => s.id !== id);
      setStudents(nextStudents);
      saveYearScopedData(activeAcademicYear, 'students', nextStudents);
      saveYearScopedData(activeAcademicYear, 'last_modified', Date.now());
      localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(nextStudents));
      showToast('បានលុបឈ្មោះសិស្សដោយជោគជ័យ');
    }
  };

  const handleUpdateAttendance = (date: string, studentId: number, status: AttendanceStatus) => {
    setAttendance((prev) => ({
      ...prev,
      [date]: {
        ...(prev[date] || {}),
        [studentId]: status,
      },
    }));
  };

  const handleSaveAttendance = () => {
    showToast('បានរក្សាទុកបញ្ជីវត្តមានដោយជោគជ័យ!');
  };

  const handleBatchUpdateAttendance = (newDb: AttendanceDatabase) => {
    setAttendance(newDb);
    showToast('បានធ្វើបច្ចុប្បន្នភាពទិន្នន័យវត្តមានជាក្រុមដោយជោគជ័យ!');
  };

  const handleUpdateGrade = (
    studentId: number,
    subject: 'khmer' | 'math' | 'science' | 'social',
    value: number,
    periodKey: string = 'm10'
  ) => {
    setGrades((prev) => updateStudentGradeRecord(prev, periodKey, studentId, subject, value));
  };

  const handleBatchUpdateGrades = (newGrades: GradeDatabase) => {
    setGrades(newGrades);
  };

  const handleSaveGrades = () => {
    showToast('បានរក្សាទុកតារាងពិន្ទុ និងចំណាត់ថ្នាក់សិស្ស!');
  };

  const handleAddLogbook = (entry: Omit<LogbookEntry, 'id'>) => {
    const newEntry: LogbookEntry = {
      id: Date.now(),
      ...entry,
    };
    setLogbook([newEntry, ...logbook]);
  };

  const handleAddInventory = (item: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      id: Date.now(),
      ...item,
    };
    setInventory([newItem, ...inventory]);
  };

  const handleUpdateInventory = (updatedItem: InventoryItem) => {
    setInventory(inventory.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
  };

  const handleDeleteInventory = (id: number) => {
    setInventory(inventory.filter((item) => item.id !== id));
  };

  const handleSavePLCMeeting = (meeting: PLCMeeting) => {
    setPlc((prev) => {
      const exists = prev.some((m) => m.id === meeting.id);
      if (exists) {
        return prev.map((m) => (m.id === meeting.id ? meeting : m));
      }
      return [meeting, ...prev];
    });
  };

  const handleSaveQuiz = (newQuiz: Quiz) => {
    setQuizzes((prev) => {
      const idx = prev.findIndex((q) => q.id === newQuiz.id);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = newQuiz;
        return copy;
      }
      return [newQuiz, ...prev];
    });
  };

  const handleDeleteQuiz = (id: string) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
  };

  const handleStartLiveSession = (quizTitle?: string) => {
    const randomPin = `${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}`;
    const matched = quizzes.find((q) => q.title === quizTitle) || quizzes[0];
    setActiveSession({
      pin: randomPin,
      active: true,
      quizTitle: matched.title,
      studentCount: 12,
    });
    setCurrentActiveQuiz(matched);
    setIsLiveQuizModalOpen(true);
    showToast(`បានបើកបន្ទប់ប្រឡងផ្ទាល់ (Game PIN: ${randomPin})!`);
  };

  const handleEndLiveSession = () => {
    setActiveSession((prev) => ({ ...prev, active: false }));
    showToast('បានបញ្ចប់ការប្រឡងផ្ទាល់');
  };

  const handlePlayQuiz = (quiz: Quiz) => {
    setCurrentActiveQuiz(quiz);
    setIsLiveQuizModalOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const getAppBgClass = (theme: string) => {
    switch (theme) {
      case 'notebook-grid':
      case 'grid':
        return 'theme-notebook-grid text-slate-900';
      case 'notebook-lines':
        return 'theme-notebook-lines text-slate-900';
      case 'notebook-seyes':
        return 'theme-notebook-seyes text-slate-900';
      case 'notebook-dots':
        return 'theme-notebook-dots text-slate-900';
      case 'parchment':
        return 'theme-parchment text-amber-950';
      case 'blackboard':
        return 'theme-chalkboard text-emerald-100';
      case 'mint':
        return 'bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 text-slate-900';
      case 'lavender':
        return 'bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 text-slate-900';
      case 'royal':
        return 'bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-950 text-amber-100';
      case 'emerald':
        return 'bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-950 text-emerald-50';
      case 'sunset':
        return 'bg-gradient-to-br from-amber-950 via-orange-950 to-rose-950 text-amber-50';
      case 'blue':
        return 'bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-950 text-blue-50';
      case 'pink':
        return 'bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 text-slate-900';
      case 'cosmic':
        return 'bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 text-purple-100';
      default:
        return 'bg-gradient-to-br from-[#f1f3f9] via-[#edf1f8] to-[#e4e9f3] text-slate-800';
    }
  };

  const getFontSizePx = (scale: string) => {
    switch (scale) {
      case 'sm': return '14px';
      case 'lg': return '17px';
      case 'xl': return '18px';
      case '2xl': return '20px';
      default: return '16px';
    }
  };

  if (remoteSessionId || currentTab === 'remote') {
    return (
      <MobileSlideRemoteController
        initialSessionId={remoteSessionId || ''}
        onExit={() => {
          setRemoteSessionId(null);
          setCurrentTab('home');
          if (typeof window !== 'undefined') {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }}
        onShowToast={showToast}
      />
    );
  }

  if (currentTab === 'student_portal') {
    return (
      <StudentPortalView
        teacher={teacher}
        students={students}
        grades={grades}
        attendance={attendance}
        quizzes={quizzes}
        onUpdateStudent={handleUpdateStudent}
        onUpdateStudents={setStudents}
        onTeacherModeExit={() => {
          setCurrentTab('home');
          if (typeof window !== 'undefined') {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }}
        onShowToast={showToast}
        teacherFontFamily={fontFamily}
        teacherBackgroundTheme={backgroundTheme}
        teacherFontSizeScale={fontSizeScale}
      />
    );
  }

  return (
    <div 
      className={`w-full min-h-screen flex flex-col md:flex-row relative overflow-x-hidden pb-24 md:pb-0 transition-colors duration-300 ${getAppBgClass(backgroundTheme)} print:overflow-visible print:h-auto print:min-h-0 print:p-0 print:m-0 print:block print:bg-white`}
      style={{ fontFamily, fontSize: getFontSizePx(fontSizeScale) }}
    >
      {/* Official Government Print Header */}
      <PrintHeader teacher={teacher} />

      {/* PC Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        teacher={teacher}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenGroupChat={() => setIsClassGroupChatOpen(true)}
        onOpenCustomize={() => setIsCustomizeModalOpen(true)}
        onOpenAccountSync={() => setIsAccountSyncModalOpen(true)}
        onOpenLampAuth={() => setIsLampAuthModalOpen(true)}
        onOpenHealthEducation={() => setIsHealthInteractiveOpen(true)}
        onPrint={handlePrint}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 max-w-full print-area print:overflow-visible print:h-auto print:block print:m-0 print:p-0">
        <Header
          teacher={teacher}
          currentYear={activeAcademicYear}
          onOpenYearManager={() => setIsYearManagerModalOpen(true)}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenUpgrade={() => setIsUpgradeModalOpen(true)}
          onOpenCustomize={() => setIsCustomizeModalOpen(true)}
          onPrint={handlePrint}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={toggleSidebar}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          onOpenAccountSync={() => setIsAccountSyncModalOpen(true)}
          onOpenLampAuth={() => setIsLampAuthModalOpen(true)}
          onOpenTeacherNotices={() => setIsTeacherNoticesModalOpen(true)}
        />

        <main className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 space-y-6 max-w-7xl w-full mx-auto print:overflow-visible print:h-auto print:max-h-none print:p-0 print:m-0 print:max-w-none print:w-full print:block">
          {currentTab === 'home' && (
            <HomeTab
              teacher={teacher}
              currentYear={activeAcademicYear}
              onOpenYearManager={() => setIsYearManagerModalOpen(true)}
              quizzes={quizzes}
              activeSession={activeSession}
              onStartLiveSession={handleStartLiveSession}
              onEndLiveSession={handleEndLiveSession}
              onPlayQuiz={handlePlayQuiz}
              onOpenProfile={() => setIsProfileModalOpen(true)}
              onNavigateTab={setCurrentTab}
              onShowToast={showToast}
              onOpenTeacherNotices={() => setIsTeacherNoticesModalOpen(true)}
            />
          )}

          {currentTab === 'admin' && (
            <AdminTab
              teacher={teacher}
              currentYear={activeAcademicYear}
              onOpenYearManager={() => setIsYearManagerModalOpen(true)}
              onOpenAccountSync={() => setIsAccountSyncModalOpen(true)}
              students={students}
              onAddStudent={handleAddStudent}
              onUpdateStudent={handleUpdateStudent}
              onImportStudents={handleImportStudents}
              onDeleteStudent={handleDeleteStudent}
              attendance={attendance}
              onUpdateAttendance={handleUpdateAttendance}
              onSaveAttendance={handleSaveAttendance}
              onBatchUpdateAttendance={handleBatchUpdateAttendance}
              grades={grades}
              onUpdateGrade={handleUpdateGrade}
              onBatchUpdateGrades={handleBatchUpdateGrades}
              onSaveGrades={handleSaveGrades}
              logbook={logbook}
              onAddLogbook={handleAddLogbook}
              inventory={inventory}
              onAddInventory={handleAddInventory}
              onUpdateInventory={handleUpdateInventory}
              onDeleteInventory={handleDeleteInventory}
              plc={plc}
              onSavePLC={handleSavePLCMeeting}
              libraryBooks={libraryBooks}
              onOpenProfile={() => setIsProfileModalOpen(true)}
              onPrint={handlePrint}
              onShowToast={showToast}
              fontFamily={fontFamily}
              backgroundTheme={backgroundTheme}
              fontSizeScale={fontSizeScale}
            />
          )}

          {currentTab === 'create' && (
            <CreateQuizTab
              teacherName={teacher.name}
              quizzes={quizzes}
              onSaveQuiz={handleSaveQuiz}
              onDeleteQuiz={handleDeleteQuiz}
              onPlayQuiz={handlePlayQuiz}
              onShowToast={showToast}
              onNavigateHome={() => setCurrentTab('home')}
            />
          )}

          {currentTab === 'library' && (
            <LibraryTab
              books={libraryBooks}
              onAddBook={handleAddBook}
              onDeleteBook={handleDeleteBook}
              onShowToast={showToast}
            />
          )}

          {currentTab === 'student_portal' && (
            <StudentPortalView
              teacher={teacher}
              students={students}
              grades={grades}
              attendance={attendance}
              quizzes={quizzes}
              onUpdateStudent={handleUpdateStudent}
              onTeacherModeExit={() => setCurrentTab('home')}
              onShowToast={showToast}
              teacherFontFamily={fontFamily}
              teacherBackgroundTheme={backgroundTheme}
              teacherFontSizeScale={fontSizeScale}
            />
          )}

          {currentTab === 'discover' && (
            <DiscoverTab quizzes={quizzes} onPlayQuiz={handlePlayQuiz} />
          )}

          {currentTab === 'honor_roll' && (
            <HonorRollManager
              teacher={teacher}
              students={students}
              grades={grades}
              currentYear={activeAcademicYear}
              onShowToast={showToast}
            />
          )}

          {currentTab === 'join' && (
            <JoinPinTab
              quizzes={quizzes}
              activeSessionPin={activeSession.active ? activeSession.pin : ''}
              onJoinSuccess={(quiz) => handlePlayQuiz(quiz)}
              onShowToast={showToast}
              onOpenSlideRemote={(pin) => setRemoteSessionId(pin)}
            />
          )}

          {currentTab === 'games' && (
            <GamesTab
              quizzes={quizzes}
              onPlayQuiz={handlePlayQuiz}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Floating Glass Bottom Navigation Dock on Mobile */}
      <MobileBottomDock currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* Teacher Profile Edit Modal */}
      <TeacherProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={teacher}
        onSave={(updated) => {
          if (updated.academicYear && updated.academicYear !== activeAcademicYear) {
            handleAcademicYearChange(updated.academicYear);
          }
          setTeacher(updated);
          showToast('បានកែប្រែប្រវត្តិរូបគ្រូដោយជោគជ័យ!');
        }}
        onOpenCustomize={() => setIsCustomizeModalOpen(true)}
      />

      {/* Academic Year Management & Backup Modal */}
      <AcademicYearManagerModal
        isOpen={isYearManagerModalOpen}
        onClose={() => setIsYearManagerModalOpen(false)}
        currentYear={activeAcademicYear}
        onYearChanged={handleAcademicYearChange}
        onShowToast={showToast}
        teacherProfile={teacher}
      />

      {/* Customize Font & Background Modal */}
      <CustomizeModal
        isOpen={isCustomizeModalOpen}
        onClose={() => setIsCustomizeModalOpen(false)}
        fontFamily={fontFamily}
        onFontChange={setFontFamily}
        backgroundTheme={backgroundTheme}
        onThemeChange={setBackgroundTheme}
        fontSizeScale={fontSizeScale}
        onFontSizeChange={setFontSizeScale}
      />

      {/* Live Quiz Modal */}
      <LiveQuizModal
        isOpen={isLiveQuizModalOpen}
        onClose={() => setIsLiveQuizModalOpen(false)}
        quiz={currentActiveQuiz}
        pin={activeSession.pin}
      />

      {/* Class Group Chat Modal (Teacher Mode) */}
      <ClassGroupChatModal
        isOpen={isClassGroupChatOpen}
        onClose={() => setIsClassGroupChatOpen(false)}
        currentUserRole="teacher"
        teacher={teacher}
        students={students}
        onShowToast={showToast}
      />

      {/* Google Account Gmail Cloud Sync & Backup Modal */}
      <GoogleAccountSyncModal
        isOpen={isAccountSyncModalOpen}
        onClose={() => setIsAccountSyncModalOpen(false)}
        teacher={teacher}
        onUpdateTeacher={setTeacher}
        onShowToast={showToast}
        activeAcademicYear={activeAcademicYear}
        students={students}
        attendance={attendance}
        grades={grades}
        logbook={logbook}
        inventory={inventory}
        plc={plc}
        quizzes={quizzes}
        libraryBooks={libraryBooks}
        onRestoreFullBundle={handleRestoreFullBundle}
      />

      {/* Lamp Login & Sign Up UI Modal */}
      <TeacherAuthLampModal
        isOpen={isLampAuthModalOpen}
        onClose={() => setIsLampAuthModalOpen(false)}
        teacher={teacher}
        onUpdateTeacher={setTeacher}
        onShowToast={showToast}
      />

      {/* Official Teacher Notification Center Modal (Real-time Guidelines & Holiday Calendar Updates) */}
      <TeacherOfficialNoticeModal
        isOpen={isTeacherNoticesModalOpen}
        onClose={() => setIsTeacherNoticesModalOpen(false)}
        teacher={teacher}
        onOpenHolidaysModal={() => setIsCivilServantHolidaysModalOpen(true)}
        onNavigateTab={setCurrentTab}
        onOpenGuidelineModal={() => setCurrentTab('home')}
      />

      {/* Full Civil Servant Holiday Calendar Modal (Sub-decree 198) */}
      <CivilServantHolidaysModal
        isOpen={isCivilServantHolidaysModalOpen}
        onClose={() => setIsCivilServantHolidaysModalOpen(false)}
      />

      {/* Health Education Interactive Lessons Viewer Modal */}
      <HealthEducationInteractiveViewer
        isOpen={isHealthInteractiveOpen}
        onClose={() => setIsHealthInteractiveOpen(false)}
        onShowToast={showToast}
        onOpenExam={(lessonNum) => {
          setIsHealthInteractiveOpen(false);
          setHealthExamLessonNumber(lessonNum !== undefined ? lessonNum : 1);
          setIsHealthExamOpen(true);
        }}
      />

      {/* Health Education 40-Question QCM Exam Modal */}
      <HealthEducation40ExamModal
        isOpen={isHealthExamOpen}
        onClose={() => setIsHealthExamOpen(false)}
        onShowToast={showToast}
        initialLessonNumber={healthExamLessonNumber}
      />

      {/* Science Lesson 1 Interactive Viewer Modal */}
      <ScienceLesson1InteractiveViewer
        isOpen={isScienceLesson1Open}
        onClose={() => setIsScienceLesson1Open(false)}
        onShowToast={showToast}
      />

      {/* VIP Upgrade Modal */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 text-center">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-500 text-purple-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-400/30">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900">ដំឡើងគណនី VIP (រដ្ឋបាលគ្រូបឋម)</h3>
              <p className="text-xs text-slate-500 mt-1">
                ទទួលបានសិទ្ធិប្រើប្រាស់សំណួរមិនកំណត់ បង្កើតកោះថ្នាក់រៀនច្រើន និងទាញយករបាយការណ៍ពិន្ទុសិស្សជា PDF/Excel ផ្លូវការ
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 text-xs text-purple-900 space-y-1 text-left">
              <p className="font-bold">✓ គ្រប់គ្រងសិស្ស និងពិន្ទុមិនកំណត់ចំនួន</p>
              <p className="font-bold">✓ ភ្ជាប់ប្រព័ន្ធវាយតម្លៃ PLP MoEYS ផ្ទាល់</p>
              <p className="font-bold">✓ បង្កើតបន្ទប់ប្រឡងផ្ទាល់ (Live Quiz) មិនកំណត់</p>
            </div>
            <button
              onClick={() => {
                setIsUpgradeModalOpen(false);
                showToast('គណនីរបស់អ្នកត្រូវបានដំឡើង VIP ដោយឥតគិតថ្លៃ!');
              }}
              className="w-full py-3 bg-purple-900 hover:bg-purple-800 text-white font-bold rounded-2xl shadow-md shadow-purple-900/20 transition active:scale-95 text-xs"
            >
              បើកដំណើរការ VIP ឥឡូវនេះ
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-12 md:top-5 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl z-50 transition flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2 no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
