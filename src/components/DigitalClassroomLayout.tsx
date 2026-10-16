import React, { useState, useMemo, useEffect } from 'react';
import {
  Compass,
  Users2,
  Sparkles,
  LayoutGrid,
  Shield,
  Layers,
  Crown,
  Star,
  Eye,
  CheckCircle2,
  Monitor,
  Volume2,
  Wifi,
  Printer,
  RotateCcw,
  Calendar,
  Clock,
  BookOpen,
  Tablet,
  BatteryCharging,
  Check,
  Search,
  ArrowRightLeft,
  Thermometer,
  Lightbulb,
  X,
  UserCheck,
  GraduationCap,
  Grid,
  UserPlus,
  RefreshCw,
  Move,
  FileText,
  Award,
  BookMarked,
  ShieldCheck,
  Building2,
  ChevronRight
} from 'lucide-react';
import { Student, TeacherProfile } from '../types';
import { ClassroomSeatingPrintModal } from './ClassroomSeatingPrintModal';
import { PdfCustomizerModal } from './PdfCustomizerModal';
import {
  ClassroomCommitteeModal,
  ClassroomCommitteeData,
  DEFAULT_DAILY_TASKS,
  SUB_BRANCH_COLORS
} from './ClassroomCommitteeModal';

interface DigitalClassroomLayoutProps {
  teacher: TeacherProfile;
  students: Student[];
  onShowToast: (msg: string) => void;
}

export type SeatingArrangementType = 'grid_4x6' | 'group' | 'u_shape' | 'rows' | 'pairs';

export interface DeskStudent {
  id: number;
  rollNo?: number;
  name: string;
  gender: 'ប្រុស' | 'ស្រី';
  role: string;
  isLeader?: boolean;
  isPresident?: boolean;
  isVicePresident1?: boolean;
  isVicePresident2?: boolean;
  isTopStudent?: boolean;
  needsEyeCare?: boolean;
  isSlowLearner?: boolean;
  subBranch?: number; // 1 to 6
  tabletId: string;
  battery: number;
  notes?: string;
}

export interface GridDesk {
  deskId: string;
  colIndex: number; // 1 to 4 (៤ ជួរទទឹង)
  rowIndex: number; // 1 to 6 (៦ ជូរបណ្តាយ)
  deskLabel: string;
  deskType: 'front_eyecare' | 'center_leader' | 'standard' | 'back_support';
  seatLeft: DeskStudent;
  seatRight: DeskStudent;
}

export interface ClassroomGroup {
  groupId: string;
  groupNumber: number;
  groupName: string;
  groupMotto: string;
  leaderName: string;
  colorTheme: {
    badge: string;
    border: string;
    glow: string;
    accent: string;
    bgCard: string;
  };
  deskIds: string[];
}

// Dynamic Desk Generation based on student data and optional committee data
export const buildGridDesksFromStudents = (
  studentsList: Student[],
  columns: number = 4,
  gradeLabel: string = '4A',
  committeeData?: ClassroomCommitteeData
): GridDesk[] => {
  // If no students provided, fallback to standard 24 desks mock
  if (!studentsList || studentsList.length === 0) {
    return createInitial24Desks();
  }

  // Reorder student list if committee special needs are defined:
  // 1. Eye care students go to the very front (Row 1)
  // 2. Slow learners get paired side-by-side with Leaders / Top students
  let orderedStudents: Student[] = [...studentsList];

  if (committeeData) {
    const eyeCareStudents = orderedStudents.filter(s => committeeData.eyeCareIds.includes(s.id));
    const slowLearnerStudents = orderedStudents.filter(s => committeeData.slowLearnerIds.includes(s.id));
    const leaders = orderedStudents.filter(s => 
      s.id === committeeData.presidentId || 
      s.id === committeeData.vicePresident1Id || 
      s.id === committeeData.vicePresident2Id
    );
    const regularStudents = orderedStudents.filter(s => 
      !committeeData.eyeCareIds.includes(s.id) &&
      !committeeData.slowLearnerIds.includes(s.id) &&
      s.id !== committeeData.presidentId &&
      s.id !== committeeData.vicePresident1Id &&
      s.id !== committeeData.vicePresident2Id
    );

    // Front seats reserved for eye care
    const frontCount = Math.min(columns * 2, eyeCareStudents.length);
    const frontEye = eyeCareStudents.slice(0, frontCount);
    const remainingEye = eyeCareStudents.slice(frontCount);

    // Pair slow learners next to leaders or top regulars
    const paired: Student[] = [];
    const poolOfHelpers = [...leaders, ...regularStudents];
    
    // Fill front row with eye care first
    paired.push(...frontEye);
    
    // Add slow learners paired with helpers
    let helperIdx = 0;
    for (const slow of slowLearnerStudents) {
      paired.push(slow);
      if (helperIdx < poolOfHelpers.length) {
        paired.push(poolOfHelpers[helperIdx]);
        helperIdx++;
      }
    }

    // Add remaining eye care & remaining helpers
    paired.push(...remainingEye);
    paired.push(...poolOfHelpers.slice(helperIdx));

    orderedStudents = paired;
  }

  const totalStudents = orderedStudents.length;
  const totalDesks = Math.max(1, Math.ceil(totalStudents / 2));
  const totalColumns = Math.max(1, columns);
  const totalRows = Math.max(1, Math.ceil(totalDesks / totalColumns));

  // Helper to find student's sub-branch
  const getSubBranch = (studentId: number): number | undefined => {
    if (!committeeData || !committeeData.subBranches) return undefined;
    for (let b = 1; b <= 6; b++) {
      if (committeeData.subBranches[b]?.includes(studentId)) {
        return b;
      }
    }
    return undefined;
  };

  const desks: GridDesk[] = [];

  for (let r = 1; r <= totalRows; r++) {
    for (let c = 1; c <= totalColumns; c++) {
      const deskIndex = (r - 1) * totalColumns + (c - 1);
      if (deskIndex >= totalDesks) continue;

      const sLeftIdx = deskIndex * 2;
      const sRightIdx = deskIndex * 2 + 1;
      const sLeftRaw = orderedStudents[sLeftIdx];
      const sRightRaw = orderedStudents[sRightIdx];

      let deskType: GridDesk['deskType'] = 'standard';
      if (r === 1) deskType = 'front_eyecare';
      else if (r === 2 || r === 3) deskType = 'center_leader';
      else if (r === totalRows) deskType = 'back_support';

      // Left seat student mapping
      let seatLeft: DeskStudent;
      if (sLeftRaw) {
        const isPres = committeeData ? committeeData.presidentId === sLeftRaw.id : sLeftIdx === 0;
        const isVp1 = committeeData ? committeeData.vicePresident1Id === sLeftRaw.id : sLeftIdx === 1;
        const isVp2 = committeeData ? committeeData.vicePresident2Id === sLeftRaw.id : sLeftIdx === 2;
        const isEye = committeeData ? committeeData.eyeCareIds.includes(sLeftRaw.id) : r === 1;
        const isSlow = committeeData ? committeeData.slowLearnerIds.includes(sLeftRaw.id) : false;
        const branchNum = getSubBranch(sLeftRaw.id);

        let roleStr = 'សមាជិក';
        if (isPres) roleStr = 'ប្រធានថ្នាក់';
        else if (isVp1) roleStr = 'អនុប្រធានទី១';
        else if (isVp2) roleStr = 'អនុប្រធានទី២';
        else if (isSlow) roleStr = 'សិស្សរៀនយឺត (ជំនួយ)';
        else if (isEye) roleStr = 'សិស្សខ្សោយភ្នែក';
        else if (sLeftRaw.familyStatus) roleStr = `សិស្ស (${sLeftRaw.familyStatus})`;

        seatLeft = {
          id: sLeftRaw.id,
          rollNo: sLeftRaw.rollNo || (sLeftIdx + 1),
          name: sLeftRaw.name,
          gender: sLeftRaw.gender || 'ប្រុស',
          role: roleStr,
          isLeader: isPres || isVp1 || isVp2,
          isPresident: isPres,
          isVicePresident1: isVp1,
          isVicePresident2: isVp2,
          isTopStudent: sLeftIdx < 5,
          needsEyeCare: isEye,
          isSlowLearner: isSlow,
          subBranch: branchNum,
          tabletId: `TAB-${gradeLabel.replace(/[^0-9A-Za-z]/g, '') || '4A'}-${String(sLeftRaw.rollNo || sLeftIdx + 1).padStart(2, '0')}`,
          battery: 88 + ((sLeftIdx * 3) % 12),
          notes: isEye ? 'ជួរមុខជិតក្តារខៀន' : isSlow ? 'ត្រូវការបង្រៀនបន្ថែម' : undefined
        };
      } else {
        seatLeft = {
          id: -100 - deskIndex,
          rollNo: 0,
          name: '(ទំនេរ)',
          gender: 'ប្រុស',
          role: 'កៅអីទំនេរ',
          tabletId: '-',
          battery: 0
        };
      }

      // Right seat student mapping
      let seatRight: DeskStudent;
      if (sRightRaw) {
        const isPres = committeeData ? committeeData.presidentId === sRightRaw.id : false;
        const isVp1 = committeeData ? committeeData.vicePresident1Id === sRightRaw.id : sRightIdx === 1;
        const isVp2 = committeeData ? committeeData.vicePresident2Id === sRightRaw.id : sRightIdx === 2;
        const isEye = committeeData ? committeeData.eyeCareIds.includes(sRightRaw.id) : r === 1;
        const isSlow = committeeData ? committeeData.slowLearnerIds.includes(sRightRaw.id) : false;
        const branchNum = getSubBranch(sRightRaw.id);

        let roleStr = 'សមាជិក';
        if (isPres) roleStr = 'ប្រធានថ្នាក់';
        else if (isVp1) roleStr = 'អនុប្រធានទី១';
        else if (isVp2) roleStr = 'អនុប្រធានទី២';
        else if (isSlow) roleStr = 'សិស្សរៀនយឺត (ជំនួយ)';
        else if (isEye) roleStr = 'សិស្សខ្សោយភ្នែក';
        else if (sRightRaw.familyStatus) roleStr = `សិស្ស (${sRightRaw.familyStatus})`;

        seatRight = {
          id: sRightRaw.id,
          rollNo: sRightRaw.rollNo || (sRightIdx + 1),
          name: sRightRaw.name,
          gender: sRightRaw.gender || 'ស្រី',
          role: roleStr,
          isLeader: isPres || isVp1 || isVp2,
          isPresident: isPres,
          isVicePresident1: isVp1,
          isVicePresident2: isVp2,
          isTopStudent: sRightIdx < 5,
          needsEyeCare: isEye,
          isSlowLearner: isSlow,
          subBranch: branchNum,
          tabletId: `TAB-${gradeLabel.replace(/[^0-9A-Za-z]/g, '') || '4A'}-${String(sRightRaw.rollNo || sRightIdx + 1).padStart(2, '0')}`,
          battery: 86 + ((sRightIdx * 4) % 14),
          notes: isEye ? 'ជួរមុខជិតក្តារខៀន' : isSlow ? 'ត្រូវការបង្រៀនបន្ថែម' : undefined
        };
      } else {
        seatRight = {
          id: -200 - deskIndex,
          rollNo: 0,
          name: '(ទំនេរ)',
          gender: 'ស្រី',
          role: 'កៅអីទំនេរ',
          tabletId: '-',
          battery: 0
        };
      }

      desks.push({
        deskId: `D-R${r}C${c}`,
        colIndex: c,
        rowIndex: r,
        deskLabel: `ជួរ ${r} • តុ ${c}`,
        deskType,
        seatLeft,
        seatRight
      });
    }
  }

  return desks;
};

// Fallback sample desks (24 Desks × 2 Students per Desk = 48 students in 4 cols x 6 rows)
const createInitial24Desks = (): GridDesk[] => {
  const sampleStudentsData: Array<{ name: string; gender: 'ប្រុស' | 'ស្រី'; role: string; eye?: boolean; leader?: boolean; top?: boolean }> = [
    // Row 1 (Front Row - Eye Care & Class Leaders)
    { name: 'សុខ ចាន់ថន', gender: 'ប្រុស', role: 'ប្រធានថ្នាក់ / ពូកែ', leader: true, top: true },
    { name: 'កែវ វណ្ណា', gender: 'ស្រី', role: 'អនុប្រធានថ្នាក់', eye: true },
    { name: 'ជា សុផាត', gender: 'ប្រុស', role: 'សិស្សខ្សោយភ្នែក', eye: true },
    { name: 'លីណា ស្រីម៉ៅ', gender: 'ស្រី', role: 'សិស្សខ្សោយភ្នែក', eye: true },
    { name: 'ម៉ៅ ចិន្តា', gender: 'ស្រី', role: 'សមាជិកសកម្ម', eye: true },
    { name: 'ហេង ពិសិដ្ឋ', gender: 'ប្រុស', role: 'សមាជិក', eye: true },
    { name: 'សុខ វិសាល', gender: 'ប្រុស', role: 'ប្រធានក្រុម ១', leader: true, top: true },
    { name: 'កែវ ចន្ថា', gender: 'ស្រី', role: 'អនុប្រធានក្រុម ១', eye: true },

    // Row 2
    { name: 'ចាន់ ពិសិដ្ឋ', gender: 'ប្រុស', role: 'ជំនួយការបច្ចេកទេស' },
    { name: 'ឡុង រតនា', gender: 'ប្រុស', role: 'សមាជិក' },
    { name: 'ហេង សុផល', gender: 'ប្រុស', role: 'សមាជិក' },
    { name: 'ជា សុជាតា', gender: 'ស្រី', role: 'ប្រធានក្រុម ២', leader: true, top: true },
    { name: 'តាំង គឹមឡេង', gender: 'ប្រុស', role: 'សមាជិក' },
    { name: 'នួន វ៉ាន់នី', gender: 'ស្រី', role: 'សមាជិក' },
    { name: 'សេង វិបុល', gender: 'ប្រុស', role: 'សមាជិក' },
    { name: 'ផាត ដាវី', gender: 'ស្រី', role: 'សមាជិក' },

    // Row 3 (Center Row - Team Leaders & Academic Stars)
    { name: 'ឌី វណ្ណៈ', gender: 'ប្រុស', role: 'សមាជិក' },
    { name: 'អ៊ុំ ពិសី', gender: 'ស្រី', role: 'ប្រធានក្រុម ៣', leader: true, top: true },
    { name: 'គង់ រិទ្ធី', gender: 'ប្រុស', role: 'សិស្សពូកែគណិត', top: true },
    { name: 'យីង វណ្ណា', gender: 'ស្រី', role: 'សមាជិក' },
    { name: 'ហួត សុខា', gender: 'ប្រុស', role: 'សមាជិក' },
    { name: 'ព្រំ ធីតា', gender: 'ស្រី', role: 'សិស្សពូកែអក្សរសាស្ត្រ', top: true },
    { name: 'ស៊ឹម វឌ្ឍនៈ', gender: 'ប្រុស', role: 'សមាជិក' },
    { name: 'លឹម គឹមសួរ', gender: 'ប្រុស', role: 'ប្រធានក្រុម ៤', leader: true, top: true },

    // Row 4
    { name: 'ថៃ ចាន់ណា', gender: 'ស្រី', role: 'សមាជិក' },
    { name: 'កែវ មុនី', gender: 'ប្រុស', role: 'សមាជិក' },
    { name: 'សែម វណ្ណារ៉ូ', gender: 'ប្រុស', role: 'សមាជិក' },
    { name: 'ខៀវ ស្រីណែត', gender: 'ស្រី', role: 'សមាជិក' },
    { name: 'អ៊ុច សុធា', gender: 'ប្រុស', role: 'ជំនួយការបច្ចេកទេស' },
    { name: 'វ៉ាន់ សុភ័ក្ត្រ', gender: 'ប្រុស', role: 'សមាជិក' },
    { name: 'ស៊្រុន ចរិយា', gender: 'ស្រី', role: 'សមាជិក' },
    { name: 'តុប វិចិត្រ', gender: 'ប្រុស', role: 'សមាជិក' },

    // Row 5
    { name: 'ប៉ែន គឹមហេង', gender: 'ប្រុស', role: 'សមាជិក' },
    { name: 'យិន សោភ័ណ', gender: 'ស្រី', role: 'សមាជិក' },
    { name: 'ឈួន ម៉េងឡុង', gender: 'ប្រុស', role: 'សមាជិក' },
    { name: 'អ៊ឹង សុវណ្ណារ៉ា', gender: 'ប្រុស', role: 'សមាជិក' },
    { name: 'មាស ស្រីលក្ខណ៍', gender: 'ស្រី', role: 'សមាជិក' },
    { name: 'ចេង ពិសី', gender: 'ស្រី', role: 'សមាជិក' },
    { name: 'ទាវ សុវណ្ណ', gender: 'ប្រុស', role: 'សមាជិក' },
    { name: 'ឃុន រតនៈ', gender: 'ប្រុស', role: 'សមាជិក' },

    // Row 6 (Back Row - Support & Tall Students)
    { name: 'រស់ ចាន់នី', gender: 'ស្រី', role: 'សមាជិក' },
    { name: 'ឃឹម បញ្ញា', gender: 'ប្រុស', role: 'សិស្សពូកែកីឡា' },
    { name: 'អ៊ុក វណ្ណឌី', gender: 'ប្រុស', role: 'សមាជិក' },
    { name: 'ស៊ុន ម៉ាលី', gender: 'ស្រី', role: 'សមាជិក' },
    { name: 'ណុប ករុណា', gender: 'ប្រុស', role: 'សមាជិក' },
    { name: 'អ៊ន់ ស្រីនិច', gender: 'ស្រី', role: 'សមាជិក' },
    { name: 'លី រស្មី', gender: 'ស្រី', role: 'សមាជិក' },
    { name: 'តុង វិសិដ្ឋ', gender: 'ប្រុស', role: 'សមាជិក' }
  ];

  const desks: GridDesk[] = [];
  let studentIdx = 0;

  for (let r = 1; r <= 6; r++) {
    for (let c = 1; c <= 4; c++) {
      const sLeft = sampleStudentsData[studentIdx] || { name: `សិស្ស #${studentIdx + 1}`, gender: 'ប្រុស' as const, role: 'សមាជិក' };
      studentIdx++;
      const sRight = sampleStudentsData[studentIdx] || { name: `សិស្ស #${studentIdx + 1}`, gender: 'ស្រី' as const, role: 'សមាជិក' };
      studentIdx++;

      let deskType: GridDesk['deskType'] = 'standard';
      if (r === 1) deskType = 'front_eyecare';
      else if (r === 3 || r === 2) deskType = 'center_leader';
      else if (r === 6) deskType = 'back_support';

      desks.push({
        deskId: `D-R${r}C${c}`,
        colIndex: c,
        rowIndex: r,
        deskLabel: `ជួរ ${r} • តុ ${c}`,
        deskType,
        seatLeft: {
          id: studentIdx - 1,
          rollNo: studentIdx - 1,
          name: sLeft.name,
          gender: sLeft.gender,
          role: sLeft.role,
          isLeader: sLeft.leader || false,
          isTopStudent: sLeft.top || false,
          needsEyeCare: sLeft.eye || false,
          tabletId: `TAB-4A-${String(studentIdx - 1).padStart(2, '0')}`,
          battery: 90 + ((studentIdx * 3) % 10),
          notes: r === 1 ? 'ជួរមុខជិតក្តារខៀន មើលអក្សរច្បាស់' : undefined
        },
        seatRight: {
          id: studentIdx,
          rollNo: studentIdx,
          name: sRight.name,
          gender: sRight.gender,
          role: sRight.role,
          isLeader: sRight.leader || false,
          isTopStudent: sRight.top || false,
          needsEyeCare: sRight.eye || false,
          tabletId: `TAB-4A-${String(studentIdx).padStart(2, '0')}`,
          battery: 88 + ((studentIdx * 4) % 12),
          notes: r === 1 ? 'ពាក់វ៉ែនតា និងត្រូវការពន្លឺគ្រប់គ្រាន់' : undefined
        }
      });
    }
  }

  return desks;
};

export const DigitalClassroomLayout: React.FC<DigitalClassroomLayoutProps> = ({
  teacher,
  students,
  onShowToast
}) => {
  const [layoutType, setLayoutType] = useState<SeatingArrangementType>('grid_4x6');
  const [activeSanitationDay, setActiveSanitationDay] = useState<string>('ច័ន្ទ');
  const [highlightSpecial, setHighlightSpecial] = useState<boolean>(true);
  const [showDigitalDevices, setShowDigitalDevices] = useState<boolean>(true);
  const [selectedStudent, setSelectedStudent] = useState<DeskStudent | null>(null);
  const [selectedDeskForQuickSwap, setSelectedDeskForQuickSwap] = useState<GridDesk | null>(null);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState<boolean>(false);
  const [isCommitteeModalOpen, setIsCommitteeModalOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [isPdfCustomizerOpen, setIsPdfCustomizerOpen] = useState<boolean>(false);
  const [swapTargetA, setSwapTargetA] = useState<DeskStudent | null>(null);
  const [swapTargetB, setSwapTargetB] = useState<DeskStudent | null>(null);
  const [viewMode, setViewMode] = useState<'smart_tech' | 'clean_wood'>('smart_tech');
  const [columnCount, setColumnCount] = useState<number>(4);

  // Committee data storage key per grade
  const committeeStorageKey = `moeys_classroom_committee_${teacher.grade || 'default'}`;
  const [committeeData, setCommitteeData] = useState<ClassroomCommitteeData>(() => {
    try {
      const saved = localStorage.getItem(committeeStorageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    const sList = students && students.length > 0 ? students : [];
    const sIds = sList.map(s => s.id);
    const branches: Record<number, number[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
    sIds.forEach((id, idx) => {
      const bNum = (idx % 6) + 1;
      branches[bNum].push(id);
    });

    return {
      presidentId: sIds[0] || 1,
      vicePresident1Id: sIds[1] || 2,
      vicePresident2Id: sIds[2] || 3,
      slowLearnerIds: [],
      eyeCareIds: [sIds[3], sIds[4]].filter(Boolean),
      subBranches: branches,
      dailyTasks: DEFAULT_DAILY_TASKS
    };
  });

  // Master Desks State - built dynamically from students or fallback to sample
  const [gridDesks, setGridDesks] = useState<GridDesk[]>(() => 
    buildGridDesksFromStudents(students || [], 4, teacher.grade, committeeData)
  );

  // Automatically update desks when students prop, column count, or grade changes
  useEffect(() => {
    if (students && students.length > 0) {
      setGridDesks(buildGridDesksFromStudents(students, columnCount, teacher.grade, committeeData));
    }
  }, [students, columnCount, teacher.grade, committeeData]);

  // Handle saving committee data
  const handleSaveCommitteeData = (newData: ClassroomCommitteeData) => {
    setCommitteeData(newData);
    try {
      localStorage.setItem(committeeStorageKey, JSON.stringify(newData));
    } catch (e) {
      console.error(e);
    }
    setGridDesks(buildGridDesksFromStudents(students || [], columnCount, teacher.grade, newData));
    onShowToast('💾 បានរក្សាទុកការរៀបចំគណៈកម្មាធិការ និងវ៉ែនសម្អាតថ្នាក់រៀនជោគជ័យ!');
  };

  // Handle auto-optimizing seating based on special needs & committee roles
  const handleOptimizeSeatingWithNeeds = (data: ClassroomCommitteeData) => {
    setCommitteeData(data);
    try {
      localStorage.setItem(committeeStorageKey, JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
    const optimized = buildGridDesksFromStudents(students || [], columnCount, teacher.grade, data);
    setGridDesks(optimized);
    onShowToast(`✨ បានរៀបប្លង់តុឆ្លាតវៃ៖ សិស្សពិបាកមើល ${data.eyeCareIds.length} នាក់នៅជួរមុខ & សិស្សរៀនយឺត ${data.slowLearnerIds.length} នាក់អង្គុយជិតប្រធាន/ពូកែ!`);
  };

  // Search & Filter student in layout
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Valid students list (filtering out empty seat placeholders)
  const validStudents = useMemo(() => {
    return gridDesks
      .flatMap(d => [d.seatLeft, d.seatRight])
      .filter(s => s.name && s.name !== '(ទំនេរ)' && s.id > 0);
  }, [gridDesks]);

  const validStudentsCount = validStudents.length;
  const girlCount = useMemo(() => validStudents.filter(s => s.gender === 'ស្រី').length, [validStudents]);
  const boyCount = useMemo(() => validStudents.filter(s => s.gender === 'ប្រុស').length, [validStudents]);

  // All real students list for dropdowns
  const allStudentsList = useMemo(() => {
    if (students && students.length > 0) return students;
    return validStudents.map(s => ({
      id: s.id,
      name: s.name,
      gender: s.gender,
      rollNo: s.rollNo,
      grade: teacher.grade,
      dob: '',
      parentPhone: ''
    } as unknown as Student));
  }, [students, validStudents, teacher.grade]);

  // Derived sanitation & committee duty rotation for Print Modal & PDF Export
  const sanitationDuty = useMemo(() => {
    const days = ['ច័ន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍'];
    return days.map((day, idx) => {
      const branchIndex = (idx % 6) + 1;
      const memberIds = committeeData.subBranches[branchIndex] || [];
      const members = memberIds
        .map(id => allStudentsList.find(s => s.id === id)?.name)
        .filter(Boolean) as string[];
      const task = DEFAULT_DAILY_TASKS[idx % DEFAULT_DAILY_TASKS.length];
      const leaderName = members[0] || 'ប្រធានអនុសាខា';
      return {
        day,
        teamName: `អនុសាខាទី ${branchIndex} (${task.name})`,
        leader: leaderName,
        members: members.length > 0 ? members : ['សមាជិកទាំងអស់ក្នុងអនុសាខា'],
        tasks: task.description || task.name
      };
    });
  }, [committeeData.subBranches, allStudentsList]);

  // Dynamic Classroom leaders according to committeeData
  const presidentStudent = useMemo(() => {
    if (committeeData.presidentId) {
      return allStudentsList.find(s => s.id === committeeData.presidentId);
    }
    return allStudentsList[0];
  }, [committeeData.presidentId, allStudentsList]);

  const vicePresident1Student = useMemo(() => {
    if (committeeData.vicePresident1Id) {
      return allStudentsList.find(s => s.id === committeeData.vicePresident1Id);
    }
    return allStudentsList[1];
  }, [committeeData.vicePresident1Id, allStudentsList]);

  const vicePresident2Student = useMemo(() => {
    if (committeeData.vicePresident2Id) {
      return allStudentsList.find(s => s.id === committeeData.vicePresident2Id);
    }
    return allStudentsList[2];
  }, [committeeData.vicePresident2Id, allStudentsList]);

  // Quick Leadership Setting Handlers
  const handleSetPresident = (studentId: number) => {
    const updated: ClassroomCommitteeData = {
      ...committeeData,
      presidentId: studentId
    };
    handleSaveCommitteeData(updated);
    const sName = allStudentsList.find(s => s.id === studentId)?.name || 'សិស្ស';
    onShowToast(`👑 បានតែងតាំង «${sName}» ជាប្រធានថ្នាក់!`);
  };

  const handleSetVicePresident1 = (studentId: number) => {
    const updated: ClassroomCommitteeData = {
      ...committeeData,
      vicePresident1Id: studentId
    };
    handleSaveCommitteeData(updated);
    const sName = allStudentsList.find(s => s.id === studentId)?.name || 'សិស្ស';
    onShowToast(`🎖️ បានតែងតាំង «${sName}» ជាអនុប្រធានទី១!`);
  };

  const handleSetVicePresident2 = (studentId: number) => {
    const updated: ClassroomCommitteeData = {
      ...committeeData,
      vicePresident2Id: studentId
    };
    handleSaveCommitteeData(updated);
    const sName = allStudentsList.find(s => s.id === studentId)?.name || 'សិស្ស';
    onShowToast(`🎖️ បានតែងតាំង «${sName}» ជាអនុប្រធានទី២!`);
  };

  const handleToggleEyeCare = (studentId: number) => {
    const exists = committeeData.eyeCareIds.includes(studentId);
    const updatedIds = exists
      ? committeeData.eyeCareIds.filter(id => id !== studentId)
      : [...committeeData.eyeCareIds, studentId];
    const updated: ClassroomCommitteeData = {
      ...committeeData,
      eyeCareIds: updatedIds
    };
    handleSaveCommitteeData(updated);
    const sName = allStudentsList.find(s => s.id === studentId)?.name || 'សិស្ស';
    onShowToast(exists ? `ដក «${sName}» ចេញពីសិស្សខ្សោយភ្នែក` : `👁️ កំណត់ «${sName}» ជាសិស្សខ្សោយភ្នែក (អង្គុយជួរមុខ)`);
  };

  const handleToggleSlowLearner = (studentId: number) => {
    const exists = committeeData.slowLearnerIds.includes(studentId);
    const updatedIds = exists
      ? committeeData.slowLearnerIds.filter(id => id !== studentId)
      : [...committeeData.slowLearnerIds, studentId];
    const updated: ClassroomCommitteeData = {
      ...committeeData,
      slowLearnerIds: updatedIds
    };
    handleSaveCommitteeData(updated);
    const sName = allStudentsList.find(s => s.id === studentId)?.name || 'សិស្ស';
    onShowToast(exists ? `ដក «${sName}» ចេញពីសិស្សរៀនយឺត` : `📘 កំណត់ «${sName}» ជាសិស្សរៀនយឺត (អង្គុយជិតប្រធាន)`);
  };

  const handleAutoDistributeSubBranches = () => {
    const branches: { [key: number]: number[] } = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
    allStudentsList.forEach((student, idx) => {
      const branchIndex = (idx % 6) + 1;
      branches[branchIndex].push(student.id);
    });
    const updated: ClassroomCommitteeData = {
      ...committeeData,
      subBranches: branches
    };
    handleSaveCommitteeData(updated);
    onShowToast('✨ បានបែងចែកសិស្សទៅអនុសាខាទាំង ៦ ដោយស្មើភាពស្វ័យប្រវត្តិ!');
  };

  // Quick Auto Rebalance Seating Plan
  const handleAutoRebalance = () => {
    if (students && students.length > 0) {
      setGridDesks(buildGridDesksFromStudents(students, columnCount, teacher.grade));
      onShowToast(`✨ បានរៀបប្លង់តុស្វ័យប្រវត្តិតាមទិន្នន័យសិស្ស ${students.length} នាក់ (${columnCount} ជួរទទឹង)`);
    } else {
      setGridDesks(createInitial24Desks());
      onShowToast('✨ បានរៀបប្លង់តុស្វ័យប្រវត្តិតាមគំរូ ៤ ជួរទទឹង × ៦ ជូរបណ្តាយ (មួយតុ ២ នាក់)');
    }
  };

  // Quick Swap seats within the same desk (Swap Left <-> Right)
  const handleSwapWithinDesk = (deskId: string) => {
    setGridDesks(prev => {
      return prev.map(desk => {
        if (desk.deskId === deskId) {
          const tempLeft = desk.seatLeft;
          const tempRight = desk.seatRight;
          return {
            ...desk,
            seatLeft: { ...tempRight, tabletId: desk.seatLeft.tabletId },
            seatRight: { ...tempLeft, tabletId: desk.seatRight.tabletId }
          };
        }
        return desk;
      });
    });
    onShowToast(`🔄 បានប្តូរកៅអីឆ្វេង-ស្តាំ ក្នុងតុ ${deskId} រួចរាល់!`);
  };

  // Handle Full Seat Swapping Between Any 2 Students
  const handleSwapConfirm = () => {
    if (!swapTargetA || !swapTargetB) {
      onShowToast('សូមជ្រើសរើសសិស្ស ២ នាក់ដើម្បីប្តូរកៅអីគ្នា');
      return;
    }

    if (swapTargetA.id === swapTargetB.id) {
      onShowToast('សូមជ្រើសរើសសិស្សពីរនាក់ផ្សេងគ្នា');
      return;
    }

    setGridDesks(prev => {
      const cloned = JSON.parse(JSON.stringify(prev)) as GridDesk[];
      let foundA = false;
      let foundB = false;

      for (const desk of cloned) {
        if (desk.seatLeft.id === swapTargetA.id) {
          desk.seatLeft = { ...swapTargetB, tabletId: desk.seatLeft.tabletId };
          foundA = true;
        } else if (desk.seatRight.id === swapTargetA.id) {
          desk.seatRight = { ...swapTargetB, tabletId: desk.seatRight.tabletId };
          foundA = true;
        }

        if (desk.seatLeft.id === swapTargetB.id && !foundB) {
          desk.seatLeft = { ...swapTargetA, tabletId: desk.seatLeft.tabletId };
          foundB = true;
        } else if (desk.seatRight.id === swapTargetB.id && !foundB) {
          desk.seatRight = { ...swapTargetA, tabletId: desk.seatRight.tabletId };
          foundB = true;
        }
      }

      return cloned;
    });

    onShowToast(`🔄 បានប្តូរកៅអីរវាង «${swapTargetA.name}» និង «${swapTargetB.name}» រួចរាល់`);
    setIsSwapModalOpen(false);
    setSwapTargetA(null);
    setSwapTargetB(null);
  };

  // Max row and column in current layout
  const maxCol = useMemo(() => Math.max(...gridDesks.map(d => d.colIndex), 1), [gridDesks]);
  const maxRow = useMemo(() => Math.max(...gridDesks.map(d => d.rowIndex), 1), [gridDesks]);

  // Grouping desks for 4 Collaborative Groups view
  const groupArrangementData = useMemo(() => {
    const totalDesks = gridDesks.length;
    const perGroup = Math.max(1, Math.ceil(totalDesks / 4));
    const g1Desks = gridDesks.slice(0, perGroup);
    const g2Desks = gridDesks.slice(perGroup, perGroup * 2);
    const g3Desks = gridDesks.slice(perGroup * 2, perGroup * 3);
    const g4Desks = gridDesks.slice(perGroup * 3);

    const getLeader = (desks: GridDesk[]) => {
      const valid = desks.flatMap(d => [d.seatLeft, d.seatRight]).filter(s => s.name && s.name !== '(ទំនេរ)' && s.id > 0);
      if (valid.length === 0) return 'ប្រធានក្រុម';
      if (valid.length === 1) return valid[0].name;
      return `${valid[0].name} & ${valid[1].name}`;
    };

    return [
      {
        groupId: 'g1',
        groupNumber: 1,
        groupName: `ក្រុមទី ១ (${g1Desks.length} តុ)`,
        groupMotto: 'សាមគ្គីភាព និងការច្នៃប្រឌិតខ្ពស់',
        leaderName: getLeader(g1Desks),
        colorTheme: {
          badge: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
          border: 'border-purple-500/40 hover:border-purple-400',
          glow: 'shadow-purple-900/30',
          accent: 'from-purple-900 via-indigo-900 to-slate-900',
          bgCard: 'bg-purple-950/20'
        },
        desks: g1Desks
      },
      {
        groupId: 'g2',
        groupNumber: 2,
        groupName: `ក្រុមទី ២ (${g2Desks.length} តុ)`,
        groupMotto: 'ស្រាវជ្រាវ ស្វែងយល់ និងបង្កើតថ្មី',
        leaderName: getLeader(g2Desks),
        colorTheme: {
          badge: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
          border: 'border-blue-500/40 hover:border-blue-400',
          glow: 'shadow-blue-900/30',
          accent: 'from-blue-900 via-indigo-900 to-slate-900',
          bgCard: 'bg-blue-950/20'
        },
        desks: g2Desks
      },
      {
        groupId: 'g3',
        groupNumber: 3,
        groupName: `ក្រុមទី ៣ (${g3Desks.length} តុ)`,
        groupMotto: 'រួមគិត រួមធ្វើ រួមទទួលបានជោគជ័យ',
        leaderName: getLeader(g3Desks),
        colorTheme: {
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
          border: 'border-emerald-500/40 hover:border-emerald-400',
          glow: 'shadow-emerald-900/30',
          accent: 'from-emerald-900 via-teal-900 to-slate-900',
          bgCard: 'bg-emerald-950/20'
        },
        desks: g3Desks
      },
      {
        groupId: 'g4',
        groupNumber: 4,
        groupName: `ក្រុមទី ៤ (${g4Desks.length} តុ)`,
        groupMotto: 'អំណានទូលំទូលាយ បញ្ញាភ្លឺថ្លា',
        leaderName: getLeader(g4Desks),
        colorTheme: {
          badge: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
          border: 'border-amber-500/40 hover:border-amber-400',
          glow: 'shadow-amber-900/30',
          accent: 'from-amber-900 via-orange-900 to-slate-900',
          bgCard: 'bg-amber-950/20'
        },
        desks: g4Desks
      }
    ];
  }, [gridDesks]);

  // Render a Single 2-Person Desk (តុមួយអង្គុយ ២ នាក់)
  const renderDualDesk = (desk: GridDesk, compact: boolean = false) => {
    const isFrontDesk = desk.rowIndex === 1;
    const isCenterLeader = desk.deskType === 'center_leader';
    const isMatchSearch = searchQuery.trim() !== '' && (
      desk.seatLeft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desk.seatRight.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desk.deskLabel.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div
        key={desk.deskId}
        className={`relative rounded-2xl border transition-all duration-200 select-none ${
          isMatchSearch
            ? 'ring-4 ring-amber-400 scale-[1.02] shadow-xl z-20'
            : ''
        } ${
          viewMode === 'clean_wood'
            ? 'bg-gradient-to-b from-amber-50/95 to-amber-100/70 border-amber-300/80 shadow-md shadow-amber-950/5'
            : isCenterLeader
            ? 'bg-gradient-to-b from-slate-900 via-indigo-950/80 to-slate-900 border-indigo-500/50 shadow-lg shadow-indigo-950/40'
            : isFrontDesk && highlightSpecial
            ? 'bg-gradient-to-b from-slate-900 via-amber-950/40 to-slate-900 border-amber-500/50 shadow-lg shadow-amber-950/30'
            : 'bg-slate-900/90 border-slate-700/80 shadow-md'
        } p-2.5 sm:p-3 space-y-2 group/desk hover:ring-2 hover:ring-purple-400/40`}
      >
        {/* Desk Header Strip (Desk No & Label + Quick Action) */}
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className={`px-1.5 py-0.5 rounded font-mono font-black text-[10px] shrink-0 ${
                viewMode === 'clean_wood'
                  ? 'bg-amber-800 text-white'
                  : isCenterLeader
                  ? 'bg-indigo-600 text-white'
                  : isFrontDesk
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {desk.deskId}
            </span>
            <span
              className={`text-[11px] font-extrabold truncate ${
                viewMode === 'clean_wood'
                  ? 'text-amber-950'
                  : isCenterLeader
                  ? 'text-indigo-200'
                  : isFrontDesk
                  ? 'text-amber-200'
                  : 'text-slate-300'
              }`}
            >
              {desk.deskLabel}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {isFrontDesk && highlightSpecial && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[9px] font-black">
                <Eye className="w-2.5 h-2.5" /> មុខ
              </span>
            )}
            {isCenterLeader && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[9px] font-black">
                <Crown className="w-2.5 h-2.5 text-amber-300" /> ពូកែ
              </span>
            )}
            
            {/* Quick Swap Left/Right inside this desk */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSwapWithinDesk(desk.deskId);
              }}
              title="ប្តូរកៅអីឆ្វេង-ស្តាំ ក្នុងតុនេះ"
              className="p-1 rounded-md bg-slate-800/80 hover:bg-purple-900 text-slate-400 hover:text-white transition"
            >
              <RefreshCw className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>

        {/* Desk Surface with 2 Student Seats (កៅអីឆ្វេង & កៅអីស្តាំ) */}
        <div className="grid grid-cols-2 gap-1.5 relative">
          {/* Central Desk Divider Line */}
          <div className="absolute top-0.5 bottom-0.5 left-1/2 -translate-x-1/2 w-px bg-slate-700/50 border-r border-dashed border-slate-600/40 pointer-events-none"></div>

          {/* 1. SEAT LEFT (កៅអីសិស្សឆ្វេង) */}
          {renderStudentSeat(desk.seatLeft, 'ឆ្វេង', desk.deskId)}

          {/* 2. SEAT RIGHT (កៅអីសិស្សស្តាំ) */}
          {renderStudentSeat(desk.seatRight, 'ស្តាំ', desk.deskId)}
        </div>

        {/* Desk Footer: Shared Collaborative Tablet Dock / Book Slot */}
        {showDigitalDevices && (
          <div
            className={`pt-1 border-t flex items-center justify-between text-[9px] ${
              viewMode === 'clean_wood'
                ? 'border-amber-200 text-amber-800'
                : 'border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-1 truncate">
              <Tablet className="w-2.5 h-2.5 text-indigo-400 shrink-0" />
              <span className="truncate">Dock • មួយតុ ២នាក់</span>
            </div>
            <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-0.5 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Sync
            </span>
          </div>
        )}
      </div>
    );
  };

  // Render an Individual Student Seat within a Dual Desk
  const renderStudentSeat = (s: DeskStudent, side: 'ឆ្វេង' | 'ស្តាំ', deskId: string) => {
    const isEmpty = s.name === '(ទំនេរ)' || s.id < 0;
    const isSpecialEye = !isEmpty && s.needsEyeCare && highlightSpecial;
    const isLeader = !isEmpty && s.isLeader;
    const isTop = !isEmpty && s.isTopStudent;

    if (isEmpty) {
      return (
        <div
          className={`rounded-xl p-1.5 sm:p-2 border border-dashed border-slate-700/60 bg-slate-900/30 flex flex-col justify-center items-center text-center min-h-[72px] text-slate-500 select-none`}
        >
          <span className="text-xs opacity-40">🪑</span>
          <span className="text-[10px] font-bold mt-0.5 text-slate-500">កៅអីទំនេរ</span>
          <span className="text-[8px] text-slate-600 font-mono">({side})</span>
        </div>
      );
    }

    return (
      <div
        onClick={() => setSelectedStudent(s)}
        className={`cursor-pointer rounded-xl p-1.5 sm:p-2 transition-all duration-150 relative flex flex-col justify-between min-h-[72px] ${
          viewMode === 'clean_wood'
            ? 'bg-white border border-amber-200/90 hover:border-purple-400 hover:shadow-xs'
            : isLeader
            ? 'bg-indigo-950/90 border border-indigo-400/60 shadow-sm hover:border-indigo-300'
            : isTop
            ? 'bg-blue-950/80 border border-blue-400/50 shadow-sm hover:border-blue-300'
            : isSpecialEye
            ? 'bg-amber-950/70 border border-amber-400/50 shadow-sm hover:border-amber-300'
            : 'bg-slate-950/80 border border-slate-800 hover:border-slate-600'
        }`}
      >
        {/* Top Mini Tag: Avatar + Special Badge */}
        <div className="flex items-start justify-between gap-1">
          <div className="flex items-center gap-1 min-w-0">
            <span
              className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] shrink-0 font-bold ${
                s.gender === 'ស្រី'
                  ? 'bg-pink-500/20 text-pink-300 border border-pink-400/30'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
              }`}
            >
              {s.gender === 'ស្រី' ? '👧' : '👦'}
            </span>
            <span className="text-[9px] text-slate-400 font-mono font-bold">
              #{s.rollNo || s.id}
            </span>
          </div>

          <div className="flex items-center gap-0.5 shrink-0">
            {isLeader && (
              <span title="ប្រធាន / ដឹកនាំ" className="text-amber-400">
                <Crown className="w-3 h-3" />
              </span>
            )}
            {isTop && !isLeader && (
              <span title="សិស្សពូកែ" className="text-amber-300">
                <Star className="w-3 h-3" />
              </span>
            )}
            {isSpecialEye && (
              <span title="សិស្សខ្សោយភ្នែក (អង្គុយមុខ)" className="text-amber-400">
                <Eye className="w-3 h-3" />
              </span>
            )}
          </div>
        </div>

        {/* Student Name */}
        <div className="mt-0.5">
          <h6
            className={`font-black text-[11px] sm:text-xs truncate ${
              viewMode === 'clean_wood'
                ? 'text-slate-900'
                : 'text-white group-hover/desk:text-purple-200'
            }`}
          >
            {s.name}
          </h6>
          <p
            className={`text-[9px] font-medium truncate ${
              viewMode === 'clean_wood'
                ? 'text-amber-800'
                : isLeader
                ? 'text-indigo-300'
                : isTop
                ? 'text-blue-300'
                : isSpecialEye
                ? 'text-amber-300'
                : 'text-slate-400'
            }`}
          >
            {s.role}
          </p>
        </div>

        {/* Leadership & Sub-branch Badges row */}
        <div className="mt-0.5 flex flex-wrap items-center gap-1">
          {s.isPresident && (
            <span className="px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[8px] sm:text-[9px] flex items-center gap-0.5 shadow-2xs">
              <Crown className="w-2.5 h-2.5" /> ប្រធាន
            </span>
          )}
          {s.isVicePresident1 && (
            <span className="px-1.5 py-0.5 rounded-md bg-indigo-500 text-white font-black text-[8px] sm:text-[9px] flex items-center gap-0.5 shadow-2xs">
              <Award className="w-2.5 h-2.5 text-amber-300" /> អនុទី១
            </span>
          )}
          {s.isVicePresident2 && (
            <span className="px-1.5 py-0.5 rounded-md bg-cyan-600 text-white font-black text-[8px] sm:text-[9px] flex items-center gap-0.5 shadow-2xs">
              <Award className="w-2.5 h-2.5 text-cyan-200" /> អនុទី២
            </span>
          )}
          {s.needsEyeCare && !s.isPresident && !s.isVicePresident1 && !s.isVicePresident2 && (
            <span className="px-1 py-0.2 rounded-md bg-amber-500/20 text-amber-300 border border-amber-400/30 font-bold text-[8px] flex items-center gap-0.5">
              <Eye className="w-2 h-2" /> មុខ
            </span>
          )}
          {s.isSlowLearner && (
            <span className="px-1 py-0.2 rounded-md bg-rose-500/20 text-rose-300 border border-rose-400/30 font-bold text-[8px] flex items-center gap-0.5">
              <BookMarked className="w-2 h-2" /> យឺត
            </span>
          )}
          {s.subBranch && (
            <span className="px-1 py-0.2 rounded text-[7px] sm:text-[8px] font-bold bg-slate-800/90 text-slate-300">
              សាខា{s.subBranch}
            </span>
          )}
        </div>

        {/* Device & Battery Bar */}
        {showDigitalDevices && (
          <div className="mt-0.5 pt-0.5 border-t border-slate-800/60 flex items-center justify-between text-[8px] text-slate-400">
            <span className="truncate font-mono">{s.tabletId}</span>
            <span className="flex items-center gap-0.5 text-emerald-400 font-bold">
              <BatteryCharging className="w-2 h-2" />
              {s.battery}%
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Classroom Overview Controls */}
      <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b pb-4 border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-950 font-extrabold text-[11px] uppercase tracking-wider">
                Smart Seating Engine • {maxCol} ជួរទទឹង × {maxRow} ជូរបណ្តាយ
              </span>
              <span className="text-xs text-slate-400 font-bold">•</span>
              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> មួយតុអង្គុយ ២ នាក់ ({gridDesks.length} តុ = {validStudentsCount} សិស្ស)
              </span>
              <span className="text-xs text-slate-400 font-bold">•</span>
              <span className="text-xs text-purple-700 font-bold">
                ស្រី {girlCount} នាក់ / ប្រុស {boyCount} នាក់
              </span>
            </div>
            <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 mt-1 flex items-center gap-2">
              <Compass className="w-6 h-6 text-purple-900 shrink-0" />
              <span>ប្លង់តុឌីជីថល ({maxCol} ជួរទទឹង × {maxRow} ជូរបណ្តាយ • មួយតុ ២ នាក់)</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
              រៀបចំតុស្របតាមទិន្នន័យជាក់ស្តែង <strong>{validStudentsCount} នាក់</strong> ({gridDesks.length} តុទ្វេ) ព្រមទាំងអាចផ្លាស់ប្តូរតុសិស្ស និងបោះពុម្ពបានភ្លាមៗ
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-4 py-2 rounded-2xl bg-purple-900 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-purple-900/20">
              ថ្នាក់ {teacher.grade || 'ថ្នាក់ទី ៤A'} • {gridDesks.length} តុទ្វេ ({validStudentsCount} សិស្ស)
            </span>
            <button
              type="button"
              onClick={() => setIsCommitteeModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs transition flex items-center gap-2 shadow-md shadow-amber-500/20 active:scale-95 border border-amber-300"
              title="រើសប្រធាន អនុប្រធានទី១/២ សិស្សពិបាកមើល សិស្សរៀនយឺត និងវ៉ែនសម្អាតទាំង៦អនុសាខា"
            >
              <Crown className="w-4 h-4 text-slate-950" />
              <span>👑 រើសប្រធាន & វ៉ែនសម្អាត (MoEYS)</span>
            </button>
            <button
              type="button"
              onClick={() => setIsPdfCustomizerOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-xs transition flex items-center gap-2 shadow-md shadow-red-600/20 active:scale-95"
              title="កំណត់ និងកែសម្រួលទម្រង់ឯកសារមុនទាញយកជា PDF"
            >
              <FileText className="w-4 h-4 text-red-200" />
              <span>ទាញយក / កែសម្រួល PDF</span>
            </button>
            <button
              type="button"
              onClick={() => setIsPrintModalOpen(true)}
              className="no-print px-4 py-2 rounded-xl bg-gradient-to-r from-purple-900 to-indigo-800 hover:from-purple-800 hover:to-indigo-700 text-white text-xs font-black transition flex items-center gap-2 active:scale-95 shadow-md shadow-purple-900/20"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>បោះពុម្ពប្លង់ A4 ១០០%</span>
            </button>
          </div>
        </div>

        {/* 2. Top Info Notice Card & Fast Swap Button */}
        <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 p-4 sm:p-5 rounded-2xl border border-purple-200/80 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-purple-950 font-black text-sm">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>ប្លង់តុស្វ័យប្រវត្តិតាមចំនួនសិស្សជាក់ស្តែង ({validStudentsCount} នាក់ • {gridDesks.length} តុ)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed max-w-4xl">
              ប្លង់មាន <strong>{maxCol} ជួរឈរ (Columns)</strong> និង <strong>{maxRow} ជួរដេក (Rows)</strong> សរុប <strong>{gridDesks.length} តុ ({gridDesks.length * 2} កៅអី)</strong>។{' '}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-xs">
                <Eye className="w-3 h-3 text-amber-700" /> ជួរទី ១ ខាងមុខ (សិស្សខ្សោយភ្នែក)
              </span>{' '}
              និង{' '}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-900 font-bold text-xs">
                <Star className="w-3 h-3 text-indigo-700" /> ជួរកណ្តាល (សិស្សពូកែ / ប្រធានក្រុម)
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Column Layout Selector */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-purple-200 text-xs">
              <span className="text-[11px] font-bold text-slate-500 px-1.5">ជួរទទឹង៖</span>
              {[2, 3, 4, 5, 6].map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => {
                    setColumnCount(col);
                    onShowToast(`បានប្តូរទៅជា ${col} ជួរទទឹង`);
                  }}
                  className={`px-2 py-1 rounded-lg font-black text-xs transition ${
                    columnCount === col
                      ? 'bg-purple-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {col}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAutoRebalance}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-purple-900 border border-purple-200 transition flex items-center gap-1.5 shadow-2xs active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5 text-purple-700" />
              <span>រៀបប្លង់ដើមវិញ</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSwapModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-black bg-purple-900 hover:bg-purple-800 text-white transition flex items-center gap-1.5 shadow-md active:scale-95"
            >
              <ArrowRightLeft className="w-4 h-4 text-amber-300" />
              <span>ប្តូរកៅអីសិស្ស (Swap Seats)</span>
            </button>
          </div>
        </div>

        {/* 2.5 Quick Leadership Selector Bar (រើសប្រធានថ្នាក់ និងអនុប្រធានទី១ និងទី២ បានភ្លាមៗ) */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-blue-500/10 border border-amber-300/80 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-amber-500 text-slate-950 font-black shadow-xs text-sm">
                👑
              </span>
              <div>
                <h4 className="font-black text-slate-900 text-xs sm:text-sm">
                  ជ្រើសរើសថ្នាក់ដឹកនាំថ្នាក់រៀន (Class Leadership Selectors)
                </h4>
                <p className="text-[11px] text-slate-600 font-medium">
                  ជ្រើសរើសដើម្បីដាក់ស្លាក និងកំណត់តួនាទីសិស្សលើប្លង់តុ និងក្នុងគណៈកម្មាធិការថ្នាក់រៀនភ្លាមៗ
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOptimizeSeatingWithNeeds(committeeData)}
                className="px-3 py-1.5 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-bold text-[11px] transition flex items-center gap-1.5 shadow-2xs active:scale-95"
                title="រៀបប្លង់តុស្វ័យប្រវត្តិ៖ សិស្សខ្សោយភ្នែកនៅជួរមុខ & សិស្សរៀនយឺតក្បែរប្រធាន"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>✨ រៀបតុឆ្លាតវៃ (Auto-Optimize)</span>
              </button>
              <button
                type="button"
                onClick={() => setIsCommitteeModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-[11px] transition flex items-center gap-1.5 shadow-2xs"
              >
                <span>⚙️ កំណត់លម្អិត</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* President Selector */}
            <div className="p-3 bg-white rounded-xl border border-amber-300 shadow-2xs space-y-1.5">
              <label className="text-[11px] font-black text-amber-950 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <span>👑</span>
                  <span>ប្រធានថ្នាក់ (Class President)</span>
                </span>
                {committeeData.presidentId ? (
                  <span className="px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-900 font-bold text-[10px]">
                    ជាប់ឆ្នោត
                  </span>
                ) : null}
              </label>
              <select
                value={committeeData.presidentId || ''}
                onChange={(e) => handleSetPresident(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition"
              >
                <option value="">-- ជ្រើសរើសប្រធានថ្នាក់ --</option>
                {allStudentsList.map((s) => (
                  <option key={`pres-${s.id}`} value={s.id}>
                    #{s.rollNo || s.id} - {s.name} ({s.gender})
                  </option>
                ))}
              </select>
            </div>

            {/* 1st VP Selector */}
            <div className="p-3 bg-white rounded-xl border border-indigo-300 shadow-2xs space-y-1.5">
              <label className="text-[11px] font-black text-indigo-950 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <span>🎖️</span>
                  <span>អនុប្រធានទី ១ (1st Vice President)</span>
                </span>
                {committeeData.vicePresident1Id ? (
                  <span className="px-1.5 py-0.2 rounded-md bg-indigo-100 text-indigo-900 font-bold text-[10px]">
                    ជាប់ឆ្នោត
                  </span>
                ) : null}
              </label>
              <select
                value={committeeData.vicePresident1Id || ''}
                onChange={(e) => handleSetVicePresident1(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition"
              >
                <option value="">-- ជ្រើសរើសអនុប្រធានទី ១ --</option>
                {allStudentsList.map((s) => (
                  <option key={`vp1-${s.id}`} value={s.id}>
                    #{s.rollNo || s.id} - {s.name} ({s.gender})
                  </option>
                ))}
              </select>
            </div>

            {/* 2nd VP Selector */}
            <div className="p-3 bg-white rounded-xl border border-cyan-300 shadow-2xs space-y-1.5">
              <label className="text-[11px] font-black text-cyan-950 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <span>🎖️</span>
                  <span>អនុប្រធានទី ២ (2nd Vice President)</span>
                </span>
                {committeeData.vicePresident2Id ? (
                  <span className="px-1.5 py-0.2 rounded-md bg-cyan-100 text-cyan-900 font-bold text-[10px]">
                    ជាប់ឆ្នោត
                  </span>
                ) : null}
              </label>
              <select
                value={committeeData.vicePresident2Id || ''}
                onChange={(e) => handleSetVicePresident2(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white transition"
              >
                <option value="">-- ជ្រើសរើសអនុប្រធានទី ២ --</option>
                {allStudentsList.map((s) => (
                  <option key={`vp2-${s.id}`} value={s.id}>
                    #{s.rollNo || s.id} - {s.name} ({s.gender})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 3. Search Bar + Layout Tabs + Visual Options */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1">
          {/* Seating Style Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl overflow-x-auto no-scrollbar">
            {[
              { id: 'grid_4x6', label: `${maxCol} ជួរទទឹង × ${maxRow} ជូរបណ្តាយ`, icon: Grid },
              { id: 'group', label: '៤ ក្រុមធំ', icon: LayoutGrid },
              { id: 'u_shape', label: `រាងអក្សរ U (${gridDesks.length} តុ)`, icon: Compass },
              { id: 'rows', label: `ជា ${maxCol} ជួរឈរ`, icon: Layers },
              { id: 'pairs', label: `ស្ទូឌីយោ Pods (${gridDesks.length} តុ)`, icon: Users2 }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = layoutType === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setLayoutType(tab.id as SeatingArrangementType);
                    onShowToast(`បានប្តូរទៅប្លង់តុ៖ ${tab.label}`);
                  }}
                  className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? 'bg-white text-purple-950 shadow-xs border border-purple-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-purple-900' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Search Student within Grid */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="ស្វែងរកឈ្មោះសិស្ស ឬលេខតុ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-purple-400 outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setHighlightSpecial(!highlightSpecial)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 shrink-0 ${
                highlightSpecial
                  ? 'bg-amber-100 text-amber-950 border-amber-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-amber-600" />
              <span>{highlightSpecial ? 'សម្គាល់: បើក' : 'សម្គាល់: បិទ'}</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode(viewMode === 'smart_tech' ? 'clean_wood' : 'smart_tech')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition shadow-2xs shrink-0"
            >
              <span>{viewMode === 'smart_tech' ? '🎨 ស្ទីលឈើ' : '⚡ Smart Tech'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive Digital Classroom View (Smart Studio Stage) */}
      <div
        className={`p-5 sm:p-7 rounded-[32px] border-4 shadow-2xl relative overflow-hidden space-y-7 transition-colors ${
          viewMode === 'clean_wood'
            ? 'bg-gradient-to-b from-amber-50/50 via-slate-100 to-amber-50/30 border-amber-200 text-slate-900'
            : 'bg-slate-950 text-white border-slate-800'
        }`}
      >
        {/* Background Atmosphere Matrix */}
        {viewMode === 'smart_tech' && (
          <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none"></div>
        )}

        {/* Room Header Telemetry & Environmental Status */}
        <div
          className={`relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4 ${
            viewMode === 'clean_wood' ? 'border-slate-200' : 'border-slate-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span
              className={`text-xs font-mono font-bold ml-2 ${
                viewMode === 'clean_wood' ? 'text-purple-900' : 'text-indigo-300'
              }`}
            >
              CLASSROOM GRID • {maxCol} ជួរទទឹង × {maxRow} ជូរបណ្តាយ • {gridDesks.length} តុ ({validStudentsCount} សិស្ស)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1 text-emerald-600">
              <Thermometer className="w-3.5 h-3.5" /> 24°C
            </span>
            <span className="flex items-center gap-1 text-indigo-600">
              <Volume2 className="w-3.5 h-3.5" /> 42dB (ស្ងប់ស្ងាត់)
            </span>
            <span className="flex items-center gap-1 text-emerald-600">
              <Wifi className="w-3.5 h-3.5" /> WiFi 6 Master
            </span>
          </div>
        </div>

        {/* 2.1 FRONT OF CLASSROOM: [ ក្តារខៀន និងតុគ្រូ ] */}
        <div className="relative z-10 space-y-4">
          {/* Smart Board / IFP 86" Touch Display */}
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 rounded-2xl border-2 border-emerald-500/50 p-4 sm:p-5 shadow-[0_0_35px_rgba(16,185,129,0.2)] text-center relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-emerald-500/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
                  <Monitor className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-black text-sm sm:text-base text-emerald-300 tracking-wide">
                    [ ក្តារខៀនឌីជីថល & SMART BOARD 86" ]
                  </h4>
                  <p className="text-[11px] text-emerald-200/70 font-medium">
                    ប្រព័ន្ធបង្រៀនអន្តរកម្ម MoEYS & PLP EdTech Master Hub
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono">
                  កាលបរិច្ឆេទ៖ {new Date().toLocaleDateString('km-KH')}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-indigo-900/60 border border-indigo-500/30 text-indigo-300 text-[11px] font-mono">
                  ម៉ោង៖ 08:30 AM
                </span>
              </div>
            </div>

            {/* Smartboard Display Content */}
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-left">
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-emerald-500/20">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">មុខវិជ្ជាសកម្ម៖</span>
                <span className="text-xs font-black text-emerald-300">ភាសាខ្មែរ (អំណាន & សំណេរ)</span>
              </div>
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-emerald-500/20">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">ប្រធានបទមេរៀន៖</span>
                <span className="text-xs font-black text-white truncate block">សត្វផ្សោតទន្លេមេគង្គ</span>
              </div>
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-emerald-500/20">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">វិន័យក្នុងថ្នាក់៖</span>
                <span className="text-xs font-bold text-amber-300">១. យកចិត្តទុកដាក់ ២. សហការគ្នា</span>
              </div>
            </div>
          </div>

          {/* Teacher's Executive Smart Desk & Master Control Podium */}
          <div className="max-w-xl mx-auto bg-gradient-to-r from-indigo-950 via-purple-950 to-indigo-950 rounded-2xl border-2 border-indigo-400/50 p-3.5 shadow-xl flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 p-0.5 flex items-center justify-center text-xl shadow-sm">
                👨‍🏫
              </div>
              <div className="text-left">
                <div className="text-xs font-black text-white flex items-center gap-1.5">
                  <span>[ តុគ្រូបង្រៀន & Master Control Node ]</span>
                </div>
                <div className="text-[11px] text-indigo-200">
                  គ្រូបង្រៀន៖ <strong>{teacher.name}</strong> • {teacher.degree || 'គរុកោសល្យបឋម'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-extrabold text-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Master
              </span>
            </div>
          </div>

          {/* Front Direction Indicator */}
          <div className="flex items-center justify-center gap-2 text-slate-400 text-xs font-bold">
            <span>▲ ជួរមុខ (Front of Classroom • ជិតក្តារខៀន) ▲</span>
          </div>
        </div>

        {/* 2.2 MAIN SEATING GRIDS BASED ON USER SELECTION */}

        {/* PRIMARY LAYOUT: DYNAMIC COLUMNS × ROWS (មួយតុ ២ នាក់) */}
        {layoutType === 'grid_4x6' && (
          <div className="relative z-10 space-y-4 pt-1">
            <div
              className={`p-3 rounded-2xl border text-xs text-center font-bold flex flex-col sm:flex-row items-center justify-between gap-2 ${
                viewMode === 'clean_wood'
                  ? 'bg-amber-100/70 border-amber-300 text-amber-950'
                  : 'bg-indigo-950/60 border-indigo-500/40 text-indigo-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Grid className="w-4 h-4 text-purple-400 shrink-0" />
                <span>ប្លង់ {maxCol} ជួរទទឹង × {maxRow} ជូរបណ្តាយ (សរុប {gridDesks.length} តុទ្វេ = {validStudentsCount} សិស្ស)</span>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="text-amber-300">👁️ ជួរទី ១: តុមុខសិស្សខ្សោយភ្នែក</span>
                <span className="text-indigo-300">👑 ជួរទី ២-៣: តុកណ្តាលសិស្សពូកែ</span>
              </div>
            </div>

            {/* Column Labels */}
            <div 
              className="grid gap-3 text-center text-xs font-black text-slate-400"
              style={{
                gridTemplateColumns: `repeat(${Math.min(maxCol, 6)}, minmax(0, 1fr))`
              }}
            >
              {Array.from({ length: maxCol }, (_, i) => i + 1).map((colNum) => (
                <div key={colNum} className="py-1 px-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  ជួរទទឹង {colNum}
                </div>
              ))}
            </div>

            {/* Dynamic Rows Grid */}
            <div className="space-y-4">
              {Array.from({ length: maxRow }, (_, i) => i + 1).map((rowNum) => {
                const rowDesks = gridDesks.filter((d) => d.rowIndex === rowNum);
                return (
                  <div key={rowNum} className="space-y-1.5">
                    {/* Row Header Label */}
                    <div className="flex items-center justify-between text-[11px] font-black px-2 text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                        <span>ជូរបណ្តាយទី {rowNum} {rowNum === 1 ? '(ជួរមុខបង្អស់)' : rowNum === maxRow ? '(ជួរក្រោយបង្អស់)' : ''}</span>
                      </span>
                      <span className="font-mono text-[10px] text-slate-500">Row {rowNum} of {maxRow}</span>
                    </div>

                    {/* Dual Desks in this Row */}
                    <div 
                      className="grid gap-3 sm:gap-4"
                      style={{
                        gridTemplateColumns: `repeat(${Math.min(maxCol, 4)}, minmax(0, 1fr))`
                      }}
                    >
                      {rowDesks.map((desk) => renderDualDesk(desk))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* LAYOUT 2: 4 GROUPS */}
        {layoutType === 'group' && (
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {groupArrangementData.map((grp) => (
              <div
                key={grp.groupId}
                className={`rounded-3xl p-5 border shadow-xl space-y-4 transition-all duration-200 ${
                  viewMode === 'clean_wood'
                    ? 'bg-white border-amber-300/80 shadow-amber-950/5'
                    : 'bg-slate-900/90 border-slate-700/80 hover:border-purple-500/50'
                }`}
              >
                {/* Group Header */}
                <div className="flex items-center justify-between border-b border-slate-700/40 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center text-sm font-black shadow-sm ${
                        grp.groupNumber === 1
                          ? 'bg-purple-600 text-white'
                          : grp.groupNumber === 2
                          ? 'bg-blue-600 text-white'
                          : grp.groupNumber === 3
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-600 text-white'
                      }`}
                    >
                      G{grp.groupNumber}
                    </span>
                    <div>
                      <h5
                        className={`font-black text-sm sm:text-base ${
                          viewMode === 'clean_wood' ? 'text-slate-900' : 'text-white'
                        }`}
                      >
                        {grp.groupName}
                      </h5>
                      <p className="text-[11px] text-slate-400 font-medium">
                        ប្រធានក្រុម៖ <strong>{grp.leaderName}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full border font-bold ${grp.colorTheme.badge}`}>
                      {grp.desks.length} តុទ្វេ
                    </span>
                  </div>
                </div>

                {/* Dual Desks within this Group */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {grp.desks.map((desk) => renderDualDesk(desk))}
                </div>

                {/* Group Motto / Footer */}
                <div
                  className={`p-2.5 rounded-xl border text-[11px] font-medium flex items-center justify-between ${
                    viewMode === 'clean_wood'
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                    <span>ពាក្យស្លោក៖ <em>"{grp.groupMotto}"</em></span>
                  </span>
                  <span className="font-bold text-emerald-400">១០០% សកម្ម</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* LAYOUT 3: U-SHAPE ARRANGEMENT */}
        {layoutType === 'u_shape' && (
          <div className="relative z-10 space-y-4 pt-2">
            <div
              className={`p-3.5 rounded-2xl border text-xs text-center font-bold ${
                viewMode === 'clean_wood'
                  ? 'bg-amber-100/70 border-amber-300 text-amber-950'
                  : 'bg-indigo-950/50 border-indigo-500/40 text-indigo-200'
              }`}
            >
              ប្លង់រាងអក្សរ U (U-Shape Dual-Desk Layout) — តុទ្វេ {gridDesks.length} តុ រៀបព័ទ្ធជុំវិញ ងាយស្រួលធ្វើបទបង្ហាញ និងពិភាក្សាដេញដោល
            </div>

            <div className="border-4 border-indigo-500/30 rounded-3xl p-5 border-t-0 space-y-6">
              {/* Left Wing + Bottom Wing + Right Wing Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Left Wing */}
                <div className="space-y-3">
                  <div className="text-xs font-black text-indigo-300 border-b border-slate-700 pb-1 text-center">
                    ស្លាបឆ្វេង (Left Wing)
                  </div>
                  {gridDesks.slice(0, Math.ceil(gridDesks.length / 3)).map((d) => renderDualDesk(d))}
                </div>

                {/* Center / Bottom Wing */}
                <div className="space-y-3">
                  <div className="text-xs font-black text-purple-300 border-b border-slate-700 pb-1 text-center">
                    ជួរកណ្តាល & បាត (Center Stage)
                  </div>
                  {gridDesks.slice(Math.ceil(gridDesks.length / 3), Math.ceil((gridDesks.length * 2) / 3)).map((d) => renderDualDesk(d))}
                </div>

                {/* Right Wing */}
                <div className="space-y-3">
                  <div className="text-xs font-black text-emerald-300 border-b border-slate-700 pb-1 text-center">
                    ស្លាបស្តាំ (Right Wing)
                  </div>
                  {gridDesks.slice(Math.ceil((gridDesks.length * 2) / 3)).map((d) => renderDualDesk(d))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LAYOUT 4: COLUMNS ARRANGEMENT */}
        {layoutType === 'rows' && (
          <div className="relative z-10 space-y-4 pt-2">
            <div
              className={`p-3.5 rounded-2xl border text-xs text-center font-bold ${
                viewMode === 'clean_wood'
                  ? 'bg-amber-100/70 border-amber-300 text-amber-950'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              ប្លង់ {maxCol} ជួរឈរ ({maxCol} Columns of Dual Desks) — សមស្របសម្រាប់ការប្រឡងប្រចាំខែ និងការសរសេរតាមអាន
            </div>

            <div 
              className="grid gap-4"
              style={{
                gridTemplateColumns: `repeat(${Math.min(maxCol, 4)}, minmax(0, 1fr))`
              }}
            >
              {Array.from({ length: maxCol }, (_, i) => i + 1).map((colIdx) => {
                const colDesks = gridDesks.filter(d => d.colIndex === colIdx);
                return (
                  <div
                    key={colIdx}
                    className={`p-3.5 rounded-3xl border space-y-3 ${
                      viewMode === 'clean_wood'
                        ? 'bg-white border-amber-200'
                        : 'bg-slate-900/80 border-slate-800'
                    }`}
                  >
                    <div className="text-xs font-black text-indigo-300 border-b border-slate-700 pb-1.5 text-center flex items-center justify-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-400" />
                      <span>ជួរឈរទី {colIdx} (Column {colIdx})</span>
                    </div>

                    <div className="space-y-3">
                      {colDesks.map((d) => renderDualDesk(d))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* LAYOUT 5: PAIR WORK PODS */}
        {layoutType === 'pairs' && (
          <div className="relative z-10 space-y-4 pt-2">
            <div
              className={`p-3.5 rounded-2xl border text-xs text-center font-bold ${
                viewMode === 'clean_wood'
                  ? 'bg-amber-100/70 border-amber-300 text-amber-950'
                  : 'bg-indigo-950/50 border-indigo-500/30 text-indigo-200'
              }`}
            >
              ប្លង់ស្ទូឌីយោដៃគូ (Digital Pair-Work Pods) — តុទ្វេនីមួយៗជាស្ថានីយអនុវត្ត Tablet គូសហការ ២ នាក់
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {gridDesks.map((desk, idx) => (
                <div key={desk.deskId} className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] px-1 font-bold text-slate-400">
                    <span>Pod Station #{idx + 1}</span>
                    <span className="text-emerald-400 font-mono">2-Students Pod</span>
                  </div>
                  {renderDualDesk(desk)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2.3 Room Legend & Descriptive Tags */}
        <div
          className={`relative z-10 pt-4 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${
            viewMode === 'clean_wood' ? 'border-slate-300 text-slate-600' : 'border-slate-800 text-slate-400'
          }`}
        >
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-indigo-600 border border-indigo-400"></span>
              <span>តុកណ្តាល (សិស្សពូកែ / ប្រធាន)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-amber-600 border border-amber-400"></span>
              <span>តុមុខ (សិស្សខ្សោយភ្នែក)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-slate-800 border border-slate-600"></span>
              <span>តុសហការដៃគូទូទៅ</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Tablet className="w-3.5 h-3.5 text-indigo-400" />
              <span>ភ្ជាប់ Tablet សិក្សា ១ គ្រឿង/សិស្ស</span>
            </span>
          </div>

          <div className="text-[11px] text-slate-500 font-medium">
            * គាំទ្រការរៀបចំតុ ៤ ជួរទទឹង × ៦ ជូរបណ្តាយ មួយតុអង្គុយ ២ នាក់
          </div>
        </div>
      </div>

      {/* 3. តារាងគណៈកម្មាធិការសាខាថ្នាក់រៀន (Classroom Branch Committee - MoEYS Standards) */}
      <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
        {/* Header with Title & Quick Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
              <Building2 className="w-3.5 h-3.5" />
              <span>ស្តង់ដារក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS)</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-indigo-700" />
              <span>តារាងគណៈកម្មាធិការសាខាថ្នាក់រៀន</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              ការរៀបចំរចនាសម្ព័ន្ធដឹកនាំ និងបែងចែកភារកិច្ចតាមអនុសាខាទាំង ៦ នៃ {teacher.grade || 'ថ្នាក់ទី ៤A'} • ឆ្នាំសិក្សា {teacher.academicYear || '២០២៥ - ២០២៦'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleAutoDistributeSubBranches}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 transition flex items-center gap-1.5 active:scale-95 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>ចែក ៦ សាខាស្វ័យប្រវត្តិ</span>
            </button>
            <button
              type="button"
              onClick={() => setIsCommitteeModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-black bg-purple-900 hover:bg-purple-800 text-white transition flex items-center gap-1.5 shadow-md active:scale-95"
            >
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>👑 កែប្រែគណៈកម្មាធិការពេញលេញ</span>
            </button>
          </div>
        </div>

        {/* 1. Leadership Structure Flow (រចនាសម្ព័ន្ធថ្នាក់ដឹកនាំ) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-50 via-purple-50/40 to-indigo-50/40 border border-slate-200/80">
          <div className="text-xs font-black text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Users2 className="w-4 h-4 text-purple-900" />
            <span>រចនាសម្ព័ន្ធថ្នាក់ដឹកនាំគណៈកម្មាធិការថ្នាក់</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Teacher In-Charge */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <div className="text-[10px] font-bold text-slate-500 uppercase">គ្រូទទួលបន្ទុកថ្នាក់</div>
              <div className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                <span>👨‍🏫</span>
                <span className="truncate">{teacher.name || 'លោកគ្រូ/អ្នកគ្រូ'}</span>
              </div>
              <div className="text-[10px] text-slate-600 font-medium">អ្នកផ្តល់ការណែនាំ & ត្រួតពិនិត្យទូទៅ</div>
            </div>

            {/* Class President */}
            <div className="p-3.5 bg-white rounded-xl border border-amber-300 shadow-2xs space-y-1">
              <div className="text-[10px] font-bold text-amber-900 uppercase flex items-center justify-between">
                <span>ប្រធានថ្នាក់</span>
                <span className="text-[10px]">👑</span>
              </div>
              <div className="font-black text-amber-950 text-sm flex items-center gap-1.5">
                <span className="truncate">
                  {presidentStudent ? `${presidentStudent.name} (${presidentStudent.gender})` : 'មិនទាន់កំណត់'}
                </span>
              </div>
              <div className="text-[10px] text-amber-800 font-medium">ដឹកនាំកិច្ចការរួម & សម្របសម្រួលអនុសាខា</div>
            </div>

            {/* VP 1 */}
            <div className="p-3.5 bg-white rounded-xl border border-indigo-300 shadow-2xs space-y-1">
              <div className="text-[10px] font-bold text-indigo-900 uppercase flex items-center justify-between">
                <span>អនុប្រធានទី ១</span>
                <span className="text-[10px]">🎖️</span>
              </div>
              <div className="font-black text-indigo-950 text-sm flex items-center gap-1.5">
                <span className="truncate">
                  {vicePresident1Student ? `${vicePresident1Student.name} (${vicePresident1Student.gender})` : 'មិនទាន់កំណត់'}
                </span>
              </div>
              <div className="text-[10px] text-indigo-800 font-medium">ទទួលបន្ទុក រដ្ឋបាល វិន័យ និងអនាម័យ</div>
            </div>

            {/* VP 2 */}
            <div className="p-3.5 bg-white rounded-xl border border-cyan-300 shadow-2xs space-y-1">
              <div className="text-[10px] font-bold text-cyan-900 uppercase flex items-center justify-between">
                <span>អនុប្រធានទី ២</span>
                <span className="text-[10px]">🎖️</span>
              </div>
              <div className="font-black text-cyan-950 text-sm flex items-center gap-1.5">
                <span className="truncate">
                  {vicePresident2Student ? `${vicePresident2Student.name} (${vicePresident2Student.gender})` : 'មិនទាន់កំណត់'}
                </span>
              </div>
              <div className="text-[10px] text-cyan-800 font-medium">ទទួលបន្ទុក សិក្សា កីឡា និងសិល្បៈ</div>
            </div>
          </div>
        </div>

        {/* 2. 6 Sub-branches of Classroom Committee (អនុសាខាទាំង ៦ នៃគណៈកម្មាធិការសាខាថ្នាក់រៀន) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-900" />
              <span>សមាជិកអនុសាខាទាំង ៦ នៃគណៈកម្មាធិការសាខាថ្នាក់រៀន</span>
            </h4>
            <span className="text-xs text-slate-500 font-medium">
              សរុបសិស្ស {validStudentsCount} នាក់
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {DEFAULT_DAILY_TASKS.map((task, idx) => {
              const branchIndex = idx + 1;
              const colorInfo = SUB_BRANCH_COLORS[idx] || SUB_BRANCH_COLORS[0];
              const memberIds = committeeData.subBranches[branchIndex] || [];
              const members = memberIds
                .map((id) => allStudentsList.find((s) => s.id === id))
                .filter(Boolean) as Student[];
              const taskIcon = ['🧹', '🚰', '🌸', '🥬', '🗑️', '🍂'][idx] || '✨';

              return (
                <div
                  key={`branch-card-${branchIndex}`}
                  className={`p-4 rounded-2xl border ${colorInfo.border} ${colorInfo.lightBg} space-y-3 flex flex-col justify-between`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-md font-black text-xs ${colorInfo.badge}`}>
                        {taskIcon} អនុសាខាទី {branchIndex}
                      </span>
                      <span className="text-[11px] font-bold text-slate-600">
                        {members.length} នាក់
                      </span>
                    </div>

                    <h5 className="font-black text-slate-900 text-sm">{task.name}</h5>
                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                      {task.description}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">
                      បញ្ជីឈ្មោះសមាជិក៖
                    </div>
                    {members.length > 0 ? (
                      <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto no-scrollbar">
                        {members.map((m) => (
                          <span
                            key={`m-${branchIndex}-${m.id}`}
                            className="px-2 py-1 bg-white text-slate-800 text-[11px] font-bold rounded-lg border border-slate-200 shadow-2xs"
                          >
                            #{m.rollNo || m.id} {m.name} ({m.gender})
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="p-2 bg-white/60 rounded-lg text-center text-[10px] text-slate-400 font-medium">
                        មិនទាន់មានសមាជិក (ចុច «ចែក ៦ សាខាស្វ័យប្រវត្តិ»)
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Weekly Rotation Matrix Table (តារាងផែនការសកម្មភាពប្រចាំសប្ដាហ៍របស់អនុសាខាទាំង ៦) */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-900" />
              <span>តារាងផែនការសកម្មភាពប្រចាំសប្ដាហ៍របស់អនុសាខាទាំង ៦ (ចន្ទ - សៅរ៍)</span>
            </h4>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
              បង្វិលវេនជាប្រចាំ
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-2xs">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 border-b border-slate-200 font-black">
                  <th className="p-3 text-center w-12 border-r border-slate-200">ល.រ</th>
                  <th className="p-3 min-w-[180px] border-r border-slate-200">សកម្មភាពប្រចាំថ្ងៃ</th>
                  <th className="p-3 text-center border-r border-slate-200">ចន្ទ</th>
                  <th className="p-3 text-center border-r border-slate-200">អង្គារ</th>
                  <th className="p-3 text-center border-r border-slate-200">ពុធ</th>
                  <th className="p-3 text-center border-r border-slate-200">ព្រហស្បតិ៍</th>
                  <th className="p-3 text-center border-r border-slate-200">សុក្រ</th>
                  <th className="p-3 text-center">សៅរ៍</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {DEFAULT_DAILY_TASKS.map((task, rowIdx) => {
                  // Days: Mon (0), Tue (1), Wed (2), Thu (3), Fri (4), Sat (5)
                  // Standard circular rotation:
                  const daysRotation = [0, 1, 2, 3, 4, 5].map((d) => {
                    const branchNum = ((rowIdx - d + 6) % 6) + 1;
                    return branchNum;
                  });
                  const rowIcon = ['🧹', '🚰', '🌸', '🥬', '🗑️', '🍂'][rowIdx] || '✨';

                  return (
                    <tr key={`task-row-${rowIdx}`} className="hover:bg-slate-50/80 transition">
                      <td className="p-3 text-center font-bold text-slate-500 border-r border-slate-200 bg-slate-50/50">
                        {rowIdx + 1}
                      </td>
                      <td className="p-3 font-black text-slate-900 border-r border-slate-200">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">{rowIcon}</span>
                          <span>{task.name}</span>
                        </div>
                      </td>
                      {daysRotation.map((bNum, dIdx) => {
                        const colorInfo = SUB_BRANCH_COLORS[bNum - 1] || SUB_BRANCH_COLORS[0];
                        return (
                          <td
                            key={`cell-${rowIdx}-${dIdx}`}
                            className={`p-2.5 text-center font-black text-[11px] ${
                              dIdx < 5 ? 'border-r border-slate-200' : ''
                            }`}
                          >
                            <span
                              className={`inline-block px-2.5 py-1 rounded-lg ${colorInfo.badge} shadow-2xs`}
                            >
                              អនុសាខាទី {bNum}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Signatures Box (២ ហត្ថលេខាគ្រូនៅលើនាយកសាលា) */}
        <div className="pt-4 border-t border-slate-200 space-y-4 text-xs">
          {/* ជួរទី១ ខាងលើ: ហត្ថលេខាគ្រូបន្ទុកថ្នាក់ */}
          <div className="flex justify-end">
            <div className="text-center p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 w-full sm:w-72">
              <div className="font-medium text-slate-500">ថ្ងៃ..................ខែ.........ឆ្នាំ ២០២...</div>
              <div className="font-black text-slate-800">គ្រូបន្ទុកថ្នាក់</div>
              <div className="h-12 flex items-center justify-center font-bold text-indigo-900 text-sm">
                {teacher.name || 'លោកគ្រូ/អ្នកគ្រូ'}
              </div>
            </div>
          </div>

          {/* ជួរទី២ ខាងក្រោម: ហត្ថលេខានាយកសាលា */}
          <div className="flex justify-start">
            <div className="text-center p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 w-full sm:w-72">
              <div className="font-bold text-slate-500">បានឃើញ និងឯកភាព</div>
              <div className="font-black text-slate-800">នាយកសាលា</div>
              <div className="h-12 flex items-center justify-center text-slate-400 italic text-[11px]">
                (ហត្ថលេខា និងត្រា)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Student Detail Modal (When clicking any seat) */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-900 flex items-center justify-center text-xl font-bold">
                  {selectedStudent.gender === 'ស្រី' ? '👧' : '👦'}
                </span>
                <div>
                  <h4 className="font-extrabold text-base text-slate-900">{selectedStudent.name}</h4>
                  <p className="text-xs text-slate-500">លេខរៀង៖ #{selectedStudent.rollNo || selectedStudent.id} • {teacher.grade || 'ថ្នាក់ទី ៤A'}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">តួនាទីក្នុងថ្នាក់៖</span>
                  <span className="font-bold text-slate-900">{selectedStudent.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">ឧបករណ៍ Tablet ID៖</span>
                  <span className="font-mono font-bold text-indigo-700">{selectedStudent.tabletId} ({selectedStudent.battery}%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">ស្ថានភាពភ្នែក (Eye Care)៖</span>
                  <span className={`font-bold ${selectedStudent.needsEyeCare ? 'text-amber-700' : 'text-emerald-700'}`}>
                    {selectedStudent.needsEyeCare ? '👁️ ខ្សោយភ្នែក (តម្រូវឱ្យអង្គុយតុមុខ)' : '✅ ភ្នែកធម្មតា'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">កម្រិតសិក្សា (Learning Support)៖</span>
                  <span className={`font-bold ${selectedStudent.isSlowLearner ? 'text-rose-700' : 'text-slate-700'}`}>
                    {selectedStudent.isSlowLearner ? '📘 សិស្សរៀនយឺត (ជំនួយ)' : '✅ រៀនធម្មតា'}
                  </span>
                </div>
              </div>

              {/* Quick Role Actions for this student */}
              <div className="p-3 bg-purple-50/70 rounded-2xl border border-purple-200/80 space-y-2">
                <div className="text-[11px] font-black text-purple-950">👑 កំណត់តួនាទីលើប្លង់តុ និងគណៈកម្មាធិការ៖</div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      handleSetPresident(selectedStudent.id);
                      setSelectedStudent(null);
                    }}
                    className="p-2 rounded-xl bg-white hover:bg-amber-50 border border-amber-300 font-bold text-[11px] text-amber-950 transition flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <span>👑</span>
                    <span>តែងតាំងប្រធាន</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleSetVicePresident1(selectedStudent.id);
                      setSelectedStudent(null);
                    }}
                    className="p-2 rounded-xl bg-white hover:bg-indigo-50 border border-indigo-300 font-bold text-[11px] text-indigo-950 transition flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <span>🎖️</span>
                    <span>អនុប្រធានទី ១</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleSetVicePresident2(selectedStudent.id);
                      setSelectedStudent(null);
                    }}
                    className="p-2 rounded-xl bg-white hover:bg-cyan-50 border border-cyan-300 font-bold text-[11px] text-cyan-950 transition flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <span>🎖️</span>
                    <span>អនុប្រធានទី ២</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleToggleEyeCare(selectedStudent.id);
                      setSelectedStudent(null);
                    }}
                    className="p-2 rounded-xl bg-white hover:bg-amber-50 border border-amber-200 font-bold text-[11px] text-amber-900 transition flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <span>👁️</span>
                    <span>{selectedStudent.needsEyeCare ? 'ដកខ្សោយភ្នែក' : 'ដាក់ខ្សោយភ្នែក'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleToggleSlowLearner(selectedStudent.id);
                      setSelectedStudent(null);
                    }}
                    className="col-span-2 p-2 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 font-bold text-[11px] text-rose-900 transition flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <span>📘</span>
                    <span>{selectedStudent.isSlowLearner ? 'ដកចេញពីសិស្សរៀនយឺត' : 'កំណត់ជាសិស្សរៀនយឺត (អង្គុយក្បែរប្រធាន)'}</span>
                  </button>
                </div>
              </div>

              {selectedStudent.notes && (
                <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-950">
                  <span className="font-bold block mb-0.5">📝 កំណត់សម្គាល់គ្រូ៖</span>
                  <span>{selectedStudent.notes}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSwapTargetA(selectedStudent);
                  setIsSwapModalOpen(true);
                  setSelectedStudent(null);
                }}
                className="flex-1 py-2.5 bg-purple-900 hover:bg-purple-800 text-white rounded-xl font-bold text-xs transition shadow-xs flex items-center justify-center gap-1.5"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-amber-300" />
                <span>ប្តូរកៅអីជាមួយអ្នកផ្សេង</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition"
              >
                បិទ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Full Swap Seats Modal (កន្លែងប្តូរតុសិស្សបាន) */}
      {isSwapModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-100 text-purple-900">
                  <ArrowRightLeft className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-slate-900">ប្តូរកៅអី និងតុសិស្ស (Swap Student Seats)</h4>
                  <p className="text-xs text-slate-500 font-medium">ជ្រើសរើសសិស្ស ២ នាក់ ដើម្បីផ្លាស់ប្តូរតុអង្គុយគ្នាទៅវិញទៅមក</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSwapModalOpen(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Target A */}
              <div className="p-3.5 rounded-2xl border border-purple-200 bg-purple-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-purple-950 block">សិស្សទី ១៖</span>
                  {swapTargetA && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-200 text-purple-900 font-bold">
                      #{swapTargetA.rollNo || swapTargetA.id}
                    </span>
                  )}
                </div>
                <select
                  value={swapTargetA?.id || ''}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    const found = allStudentsList.find(s => s.id === id);
                    setSwapTargetA((found as any) || null);
                  }}
                  className="w-full p-2.5 bg-white border border-purple-200 rounded-xl font-bold text-slate-900 outline-none text-xs focus:ring-2 focus:ring-purple-400"
                >
                  <option value="">-- ជ្រើសរើសសិស្សទី ១ --</option>
                  {allStudentsList.map(s => (
                    <option key={`a-${s.id}`} value={s.id}>
                      #{s.rollNo || s.id} - {s.name} ({s.gender} • {s.role})
                    </option>
                  ))}
                </select>

                {swapTargetA && (
                  <div className="p-2 bg-white/90 rounded-xl text-[11px] space-y-1 text-slate-700 border border-purple-100">
                    <div>ឈ្មោះ៖ <strong>{swapTargetA.name}</strong> ({swapTargetA.gender})</div>
                    <div>តួនាទី៖ <span className="text-purple-900 font-bold">{swapTargetA.role}</span></div>
                    {swapTargetA.needsEyeCare && <div className="text-amber-700 font-bold">👁️ សិស្សខ្សោយភ្នែក</div>}
                  </div>
                )}
              </div>

              {/* Target B */}
              <div className="p-3.5 rounded-2xl border border-indigo-200 bg-indigo-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-indigo-950 block">សិស្សទី ២៖</span>
                  {swapTargetB && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-200 text-indigo-900 font-bold">
                      #{swapTargetB.rollNo || swapTargetB.id}
                    </span>
                  )}
                </div>
                <select
                  value={swapTargetB?.id || ''}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    const found = allStudentsList.find(s => s.id === id);
                    setSwapTargetB((found as any) || null);
                  }}
                  className="w-full p-2.5 bg-white border border-indigo-200 rounded-xl font-bold text-slate-900 outline-none text-xs focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="">-- ជ្រើសរើសសិស្សទី ២ --</option>
                  {allStudentsList.map(s => (
                    <option key={`b-${s.id}`} value={s.id}>
                      #{s.rollNo || s.id} - {s.name} ({s.gender} • {s.role})
                    </option>
                  ))}
                </select>

                {swapTargetB && (
                  <div className="p-2 bg-white/90 rounded-xl text-[11px] space-y-1 text-slate-700 border border-indigo-100">
                    <div>ឈ្មោះ៖ <strong>{swapTargetB.name}</strong> ({swapTargetB.gender})</div>
                    <div>តួនាទី៖ <span className="text-indigo-900 font-bold">{swapTargetB.role}</span></div>
                    {swapTargetB.needsEyeCare && <div className="text-amber-700 font-bold">👁️ សិស្សខ្សោយភ្នែក</div>}
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>ប្រព័ន្ធនឹងរក្សាទុកលេខកូដសម្ភារ Tablet តាមតុនីមួយៗ និងធ្វើបច្ចុប្បន្នភាពឈ្មោះសិស្សភ្លាមៗ។</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsSwapModalOpen(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition"
              >
                បោះបង់
              </button>
              <button
                type="button"
                onClick={handleSwapConfirm}
                disabled={!swapTargetA || !swapTargetB}
                className="px-5 py-2.5 bg-purple-900 hover:bg-purple-800 disabled:opacity-50 text-white rounded-xl font-bold text-xs transition shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 text-emerald-300" />
                <span>យល់ព្រមប្តូរកៅអី</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MoEYS Classroom Committee & Sanitation Rotation Modal */}
      <ClassroomCommitteeModal
        isOpen={isCommitteeModalOpen}
        onClose={() => setIsCommitteeModalOpen(false)}
        teacher={teacher}
        students={students || []}
        committeeData={committeeData}
        onSaveCommitteeData={handleSaveCommitteeData}
        onOptimizeSeatingWithNeeds={handleOptimizeSeatingWithNeeds}
        onShowToast={onShowToast}
      />

      {/* A4 100% Seating Plan Print Modal */}
      <ClassroomSeatingPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        teacher={teacher}
        gridDesks={gridDesks}
        sanitationDuty={sanitationDuty}
      />

      {/* Seating Plan PDF Customizer Modal */}
      {(() => {
        const academicYear = teacher.academicYear || '២០២៥ - ២០២៦';
        return (
          <PdfCustomizerModal
            isOpen={isPdfCustomizerOpen}
            onClose={() => setIsPdfCustomizerOpen(false)}
            documentType="general"
            title="កំណត់ទម្រង់ & ទាញយក PDF ប្លង់តុ & ការរៀបចំថ្នាក់រៀន"
            initialHeader={{
              docTitle: 'ប្លង់តុ និងការរៀបចំសណ្តាប់ធ្នាប់ថ្នាក់រៀន',
              docSubtitle: `ប្លង់ស្ដង់ដារ ៤ ជួរទទឹង × ៦ ជូរបណ្តាយ (២៤ តុទ្វេ • ៤៨ សិស្ស) ឆ្នាំសិក្សា ${academicYear}`,
              schoolName: teacher.school || 'សាលាបឋមសិក្សាគំរូ',
              teacherName: teacher.name || '',
              gradeLevel: teacher.grade || 'ថ្នាក់ទី ៤A',
              academicYear: academicYear,
              officeInfo: 'មន្ទីរអប់រំ យុវជន និងកីឡា ខេត្ត/រាជធានី'
            }}
            customTableHtml={`
              <div style="font-family: 'Siemreap', sans-serif; font-size: 10pt; color: #1e293b;">
                <div style="margin-bottom: 12px; font-weight: bold;">
                  បញ្ជីរាយនាមតុ និងឈ្មោះសិស្សប្រចាំកៅអី ថ្នាក់ទី <b>${teacher.grade || 'ថ្នាក់ទី ៤A'}</b> នៃ <b>${teacher.school || 'សាលាបឋមសិក្សាគំរូ'}</b>៖
                </div>
                <table style="width: 100%; border-collapse: collapse; margin-top: 8px;">
                  <thead>
                    <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
                      <th style="border: 1px solid #cbd5e1; padding: 6px; text-align: center; width: 45px;">ជួរ/តុ</th>
                      <th style="border: 1px solid #cbd5e1; padding: 6px; text-align: left;">សិស្សអង្គុយខាងឆ្វេង (Seat Left)</th>
                      <th style="border: 1px solid #cbd5e1; padding: 6px; text-align: left;">សិស្សអង្គុយខាងស្តាំ (Seat Right)</th>
                      <th style="border: 1px solid #cbd5e1; padding: 6px; text-align: center; width: 120px;">ប្រភេទតុ</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${gridDesks.map((desk) => `
                      <tr>
                        <td style="border: 1px solid #cbd5e1; padding: 5px; text-align: center; font-weight: bold;">ជួរ ${desk.rowIndex} - តុ ${desk.colIndex}</td>
                        <td style="border: 1px solid #cbd5e1; padding: 5px;">
                          <b>${desk.seatLeft.name}</b> <span style="font-size: 8.5pt; color: #475569;">(${desk.seatLeft.gender}${desk.seatLeft.isLeader ? ' • ប្រធាន' : ''}${desk.seatLeft.needsEyeCare ? ' • ភ្នែក' : ''})</span>
                        </td>
                        <td style="border: 1px solid #cbd5e1; padding: 5px;">
                          <b>${desk.seatRight.name}</b> <span style="font-size: 8.5pt; color: #475569;">(${desk.seatRight.gender}${desk.seatRight.isLeader ? ' • ប្រធាន' : ''}${desk.seatRight.needsEyeCare ? ' • ភ្នែក' : ''})</span>
                        </td>
                        <td style="border: 1px solid #cbd5e1; padding: 5px; text-align: center; font-size: 9pt;">${desk.deskType === 'front_eyecare' ? 'ជួរមុខ (ភ្នែក)' : desk.deskType === 'center_leader' ? 'ជួរកណ្តាល (ប្រធាន)' : 'ស្តង់ដារ'}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
                <div style="margin-top: 15px; font-weight: bold; margin-bottom: 8px;">
                  តារាងបែងចែកភារកិច្ចអនាម័យប្រចាំសប្តាហ៍៖
                </div>
                <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                    <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
                      <th style="border: 1px solid #cbd5e1; padding: 6px; text-align: center; width: 70px;">ថ្ងៃ</th>
                      <th style="border: 1px solid #cbd5e1; padding: 6px; text-align: left;">ក្រុមទទួលខុសត្រូវ</th>
                      <th style="border: 1px solid #cbd5e1; padding: 6px; text-align: left;">ភារកិច្ចសំខាន់ៗ</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${sanitationDuty.map((duty) => `
                      <tr>
                        <td style="border: 1px solid #cbd5e1; padding: 5px; text-align: center; font-weight: bold;">${duty.day}</td>
                        <td style="border: 1px solid #cbd5e1; padding: 5px;"><b>${duty.teamName}</b> (${duty.leader})</td>
                        <td style="border: 1px solid #cbd5e1; padding: 5px; font-size: 9pt;">${duty.tasks}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>

              </div>
            `}
            onShowToast={onShowToast}
          />
        );
      })()}
    </div>
  );
};
