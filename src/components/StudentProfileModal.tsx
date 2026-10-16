import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  User,
  ShieldCheck,
  Phone,
  Calendar,
  MapPin,
  Users,
  KeyRound,
  FileText,
  Upload,
  Camera,
  Smile,
  Trash2,
  CheckCircle2,
  AlertCircle,
  SwitchCamera,
  Printer,
  QrCode,
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff,
  BookOpen,
  Image as ImageIcon,
  BadgeCheck,
  CreditCard,
  Edit3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Student, TeacherProfile } from '../types';
import { compressImageFile, isImageAvatar } from '../utils/imageCompressor';
import { QRCodeSVG } from 'qrcode.react';
import { getKhmerCombinedDate, toKhmerNum } from '../utils/khmerDate';
import {
  getActiveCustomFontFamily,
  getActiveCustomBackgroundTheme,
  getThemeBackgroundCss,
  getKhmerGoogleFontsLinkHtml,
} from '../utils/customPrintFont';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStudent?: Student;
  student?: Student;
  teacher?: TeacherProfile;
  onSaveStudent?: (updatedStudent: Student) => void;
  onSave?: (updatedStudent: Student) => void;
  onShowToast: (msg: string) => void;
}

const EMOJI_CATEGORIES = [
  {
    id: 'students',
    name: '🎓 សិស្ស & រៀនសូត្រ',
    emojis: ['🧑‍🎓', '👩‍🎓', '👨‍🎓', '🧑‍🏫', '🎒', '📚', '✏️', '🎨', '🧠', '🔬', '🔭', '🚀', '🏆', '⭐', '🥇', '🎖️'],
  },
  {
    id: 'animals',
    name: '🐾 សត្វឆ្លាតវៃ & ក្លាហាន',
    emojis: ['🦁', '🐯', '🦊', '🐼', '🐨', '🦉', '🐬', '🦅', '🦄', '🦖', '🐘', '🦒', '🐱', '🐶', '🐰', '🐸'],
  },
  {
    id: 'heroes',
    name: '🌟 វីរបុរស & តួអង្គ',
    emojis: ['🦸‍♂️', '🦸‍♀️', '🧙‍♂️', '🧙‍♀️', '🥷', '👑', '💎', '⚡', '🔥', '🌈', '🛸', '🤖', '👾', '🐲', '🧚‍♀️', '🧜‍♂️'],
  },
  {
    id: 'activities',
    name: '⚽ កីឡា & សកម្មភាព',
    emojis: ['⚽', '🏀', '🏐', '🏸', '🏊', '🚴', '🥋', '🎮', '🎸', '🥁', '🧩', '🛹', '🏹', '🎯', '♟️', '🎳'],
  },
];

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  currentStudent,
  student,
  teacher,
  onSaveStudent,
  onSave,
  onShowToast,
}) => {
  const effectiveStudent = currentStudent || student || {
    id: 1,
    name: 'សិស្ស',
    rollNo: 1,
    gender: 'ប្រុស',
  } as Student;

  const handleSaveCallback = onSaveStudent || onSave;

  const [activeTab, setActiveTab] = useState<'profile' | 'avatar' | 'idcard'>('profile');
  const [formData, setFormData] = useState<Student>({ ...effectiveStudent });
  const [avatarTab, setAvatarTab] = useState<'upload' | 'camera' | 'emojis'>('upload');
  const [showPin, setShowPin] = useState(false);

  // Image upload & camera states
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const directCameraInputRef = useRef<HTMLInputElement | null>(null);

  // Live Camera
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraFacingMode, setCameraFacingMode] = useState<'user' | 'environment'>('user');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({ ...effectiveStudent });
      setImageError(null);
      setCameraError(null);
    } else {
      stopCamera();
    }
  }, [isOpen, effectiveStudent]);

  const stopCamera = () => {
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach((track) => track.stop());
      } catch (e) {
        // ignore
      }
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    if (avatarTab !== 'camera' || activeTab !== 'avatar') {
      stopCamera();
    }
  }, [avatarTab, activeTab]);

  const startCamera = async (mode: 'user' | 'environment' = cameraFacingMode) => {
    stopCamera();
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('ឧបករណ៍មិនគាំទ្រ WebRTC Live Camera ទេ។ សូមប្រើប៊ូតុង «ថតរូបពីទូរសព្ទ» ខាងក្រោម។');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (e) {
          // ignore
        }
      }
      setIsCameraActive(true);
    } catch (err: any) {
      setCameraError('មិនអាចបើក Live Camera បានទេ។ សូមប្រើប៊ូតុង «ថតរូបពីទូរសព្ទផ្ទាល់» ឬ Upload រូបថត។');
      setIsCameraActive(false);
    }
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      const size = Math.min(video.videoWidth || 480, video.videoHeight || 480);
      canvas.width = 360;
      canvas.height = 360;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const sx = ((video.videoWidth || 480) - size) / 2;
      const sy = ((video.videoHeight || 480) - size) / 2;

      if (cameraFacingMode === 'user') {
        ctx.translate(360, 0);
        ctx.scale(-1, 1);
      }

      ctx.drawImage(video, sx, sy, size, size, 0, 0, 360, 360);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

      setFormData((prev) => ({ ...prev, avatar: dataUrl }));
      stopCamera();
      onShowToast('បានថតរូបសិស្សជោគជ័យ!');
    } catch (err) {
      setCameraError('មានបញ្ហាក្នុងការចាប់យករូបភាព');
    }
  };

  const processAndSetImage = async (file: File) => {
    setImageError(null);
    setIsProcessingImage(true);
    try {
      if (!file.type.startsWith('image/')) {
        throw new Error('សូមជ្រើសរើសឯកសាររូបភាព (JPG, PNG, WEBP)');
      }
      const compressed = await compressImageFile(file, {
        maxWidth: 400,
        maxHeight: 400,
        quality: 0.85,
        mimeType: 'image/jpeg',
      });
      setFormData((prev) => ({ ...prev, avatar: compressed }));
      onShowToast('បានបញ្ចូលរូបថតសិស្សជោគជ័យ!');
    } catch (err: any) {
      setImageError(err.message || 'មិនអាចផ្ទុករូបភាពបានទេ');
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processAndSetImage(file);
    if (e.target) e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processAndSetImage(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      onShowToast('សូមបញ្ចូលឈ្មោះសិស្ស');
      return;
    }
    handleSaveCallback?.(formData);
    onShowToast(`បានកែប្រែព័ត៌មានសិស្ស ${formData.name} ដោយជោគជ័យ!`);
    onClose();
  };

  const handlePrintStudentProfile = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const activeFont = getActiveCustomFontFamily();
    const activeTheme = getActiveCustomBackgroundTheme();
    const docBackgroundCss = getThemeBackgroundCss(activeTheme);
    const schoolName = teacher?.school || 'សាលាបឋមសិក្សាគំរូ';
    const gradeName = teacher?.grade || 'ថ្នាក់ទី ៤';
    const academicYear = teacher?.academicYear || '២០២៥ - ២០២៦';
    const teacherName = teacher?.name || 'លោកគ្រូ/អ្នកគ្រូ';

    const baseUrl = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : '';
    const studentQrUrl = `${baseUrl}?tab=student_portal&studentId=${formData.id}${formData.pin ? `&pin=${encodeURIComponent(formData.pin)}` : ''}`;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="km">
      <head>
        <meta charset="utf-8" />
        <title>ជីវប្រវត្តិរូបសិស្ស_${formData.name}_${gradeName}</title>
        ${getKhmerGoogleFontsLinkHtml()}
        <style>
          @page {
            size: A4 portrait;
            margin: 12mm 15mm;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            font-family: '${activeFont}', 'Kantumruy Pro', 'Battambang', 'Siemreap', sans-serif;
            margin: 0;
            padding: 0;
            ${docBackgroundCss}
            color: #0f172a;
            font-size: 10pt;
            line-height: 1.5;
          }
          .font-moul {
            font-family: 'Moul', cursive, serif !important;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 12px;
          }
          .header-left {
            text-align: left;
            font-size: 9pt;
          }
          .header-left .moeys {
            font-weight: bold;
            color: #1e1b4b;
          }
          .header-right {
            text-align: center;
          }
          .header-right .country {
            font-size: 10pt;
            color: #1e1b4b;
          }
          .header-right .motto {
            font-size: 8.5pt;
            color: #334155;
            margin-top: 2px;
          }
          .title-block {
            text-align: center;
            margin: 8px 0 16px 0;
            border-bottom: 2px solid #cbd5e1;
            padding-bottom: 8px;
          }
          .doc-title {
            font-size: 14pt;
            color: #1e1b4b;
            margin: 0;
          }
          .doc-sub {
            font-size: 10pt;
            color: #475569;
            margin-top: 4px;
          }
          .profile-grid {
            display: flex;
            gap: 16px;
            margin-bottom: 14px;
          }
          .photo-column {
            width: 130px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
          }
          .photo-frame {
            width: 120px;
            height: 150px;
            border: 1.5px solid #94a3b8;
            border-radius: 8px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #f8fafc;
          }
          .photo-frame img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .photo-placeholder {
            font-size: 32pt;
          }
          .photo-tag {
            font-size: 8.5pt;
            color: #64748b;
            margin-top: 4px;
          }
          .qr-box {
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            padding: 6px;
            text-align: center;
            background: #f8fafc;
            width: 120px;
          }
          .qr-box span {
            display: block;
            font-size: 7.5pt;
            font-family: monospace;
            font-weight: bold;
            color: #1e1b4b;
            margin-top: 4px;
          }
          .info-table {
            flex: 1;
            border-collapse: collapse;
            font-size: 9.5pt;
          }
          .info-table td {
            border: 1px solid #cbd5e1;
            padding: 6px 10px;
            vertical-align: middle;
          }
          .info-table .lbl {
            width: 140px;
            background: #f8fafc;
            font-weight: bold;
            color: #334155;
          }
          .info-table .val {
            color: #0f172a;
          }
          .section-heading {
            font-size: 10.5pt;
            color: #1e1b4b;
            font-weight: bold;
            background: #f1f5f9;
            padding: 5px 10px;
            border-left: 4px solid #4338ca;
            margin: 14px 0 8px 0;
          }
          .full-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9.5pt;
          }
          .full-table td {
            border: 1px solid #cbd5e1;
            padding: 6px 10px;
          }
          .full-table .lbl {
            width: 180px;
            background: #f8fafc;
            font-weight: bold;
            color: #334155;
          }
          .signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 25px;
            page-break-inside: avoid;
          }
          .sign-col {
            text-align: center;
            width: 220px;
          }
          .sign-date {
            font-size: 9pt;
            color: #475569;
          }
          .sign-title {
            font-size: 9.5pt;
            margin-top: 4px;
          }
          .sign-space {
            height: 55px;
          }
          .sign-name {
            font-size: 9.5pt;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="header-left">
            <div class="moeys font-moul">ក្រសួងអប់រំ យុវជន និងកីឡា</div>
            <div>មន្ទីរអប់រំ យុវជន និងកីឡា ខេត្ត/ក្រុង</div>
            <div style="font-weight: bold;">${schoolName}</div>
          </div>
          <div class="header-right">
            <div class="country font-moul">ព្រះរាជាណាចក្រកម្ពុជា</div>
            <div class="motto font-moul">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
          </div>
        </div>

        <div class="title-block">
          <h1 class="doc-title font-moul">ជីវប្រវត្តិរូបសង្ខេបសិស្ស</h1>
          <div class="doc-sub">${gradeName} &bull; ឆ្នាំសិក្សា ${academicYear}</div>
        </div>

        <div class="profile-grid">
          <div class="photo-column">
            <div class="photo-frame">
              ${formData.avatar && (formData.avatar.startsWith('http') || formData.avatar.startsWith('data:')) ? `
                <img src="${formData.avatar}" alt="${formData.name}" />
              ` : `
                <div class="photo-placeholder">${formData.gender === 'ស្រី' ? '👧' : '👦'}</div>
                <div class="photo-tag">រូបថត ៤x៦</div>
              `}
            </div>
            <div class="qr-box">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${encodeURIComponent(studentQrUrl)}" alt="QR Code" style="width: 80px; height: 80px;" />
              <span>PIN: ${formData.pin || '1234'}</span>
            </div>
          </div>

          <table class="info-table">
            <tr>
              <td class="lbl">អត្តលេខសិស្ស ៖</td>
              <td class="val font-mono" style="font-weight: bold; color: #1e1b4b;">${formData.civilId || `#${formData.rollNo || formData.id}`}</td>
              <td class="lbl">លេខរៀងក្នុងបញ្ជី ៖</td>
              <td class="val font-bold">លេខ ${toKhmerNum(formData.rollNo || 1)}</td>
            </tr>
            <tr>
              <td class="lbl">គោត្តនាម-នាម ៖</td>
              <td class="val font-moul" style="font-size: 11pt; color: #1e1b4b;">${formData.name}</td>
              <td class="lbl">អក្សរឡាតាំង ៖</td>
              <td class="val font-bold" style="font-family: sans-serif;">${formData.latinName ? formData.latinName.toUpperCase() : '-'}</td>
            </tr>
            <tr>
              <td class="lbl">ភេទ ៖</td>
              <td class="val font-bold" style="color: ${formData.gender === 'ស្រី' ? '#be185d' : '#1d4ed8'};">${formData.gender}</td>
              <td class="lbl">ថ្ងៃខែឆ្នាំកំណើត ៖</td>
              <td class="val font-bold">${formData.dob || '-'}</td>
            </tr>
            <tr>
              <td class="lbl">ទីកន្លែងកំណើត ៖</td>
              <td class="val" colspan="3">${formData.pob || formData.address || '-'}</td>
            </tr>
            <tr>
              <td class="lbl">អាសយដ្ឋានបច្ចុប្បន្ន ៖</td>
              <td class="val" colspan="3">${formData.address || formData.pob || '-'}</td>
            </tr>
            <tr>
              <td class="lbl">លេខទូរស័ព្ទទំនាក់ទំនង ៖</td>
              <td class="val font-mono font-bold" colspan="3">${formData.parentPhone || formData.phone || '-'}</td>
            </tr>
          </table>
        </div>

        <div class="section-heading">ព័ត៌មានមាតាបិតា និងអាណាព្យាបាល</div>
        <table class="full-table">
          <tr>
            <td class="lbl">ឈ្មោះឪពុក ៖</td>
            <td class="val font-bold">${formData.fatherName || '-'}</td>
            <td class="lbl">មុខរបរឪពុក ៖</td>
            <td class="val">${formData.fatherJob || '-'}</td>
          </tr>
          <tr>
            <td class="lbl">ឈ្មោះម្តាយ ៖</td>
            <td class="val font-bold">${formData.motherName || '-'}</td>
            <td class="lbl">មុខរបរម្តាយ ៖</td>
            <td class="val">${formData.motherJob || '-'}</td>
          </tr>
          <tr>
            <td class="lbl">ស្ថានភាពជីវភាពគ្រួសារ ៖</td>
            <td class="val font-bold" style="color: ${formData.familyStatus === 'ក្រ១' || formData.familyStatus === 'ក្រ២' ? '#b45309' : '#047857'};">
              ${formData.familyStatus || 'ទូទៅ'} ${formData.equityCardNumber ? `(ប័ណ្ណក្រ៖ ${formData.equityCardNumber})` : ''}
            </td>
            <td class="lbl">កម្រិតវប្បធម៌ឪពុកម្តាយ ៖</td>
            <td class="val">${formData.parentEducationLevel || 'មិនបានបញ្ជាក់'}</td>
          </tr>
        </table>

        <div class="section-heading">ស្ថានភាពសិក្សា & ស្ថិតិ MoEYS PRI</div>
        <table class="full-table">
          <tr>
            <td class="lbl">ស្ថានភាពឡើងថ្នាក់/ត្រួតថ្នាក់ ៖</td>
            <td class="val font-bold">
              ${formData.isRepeating || formData.note?.includes('ត្រួតថ្នាក់') ? '🔁 សិស្សត្រួតថ្នាក់' : '🌟 សិស្សឡើងថ្នាក់ / សិស្សថ្មី'}
            </td>
            <td class="lbl">គណនី PLP MoEYS ៖</td>
            <td class="val font-mono">${formData.plpAccount || 'PLP-ACTIVE'}</td>
          </tr>
          <tr>
            <td class="lbl">ប្រភេទពិការភាព (Disability) ៖</td>
            <td class="val">${formData.disabilityType || 'គ្មាន'}</td>
            <td class="lbl">ជនជាតិដើមភាគតិច ៖</td>
            <td class="val">${formData.indigenousEthnicity || 'គ្មាន'}</td>
          </tr>
          <tr>
            <td class="lbl">កំណត់សម្គាល់ផ្សេងៗ ៖</td>
            <td class="val" colspan="3">${formData.note || 'នៅរស់ / សិក្សាទៀងទាត់'}</td>
          </tr>
        </table>

        <div class="signatures">
          <div class="sign-col">
            <div class="sign-title font-moul">បានឃើញ និងឯកភាព<br/>នាយកសាលា</div>
            <div class="sign-space"></div>
          </div>
          <div class="sign-col">
            <div class="sign-date">${getKhmerCombinedDate(new Date())}</div>
            <div class="sign-title font-moul">គ្រូបន្ទុកថ្នាក់</div>
            <div class="sign-space"></div>
            <div class="sign-name">${teacherName}</div>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 350);
          };
        </script>
      </body>
      </html>
    `);

    printWindow.document.close();
  };

  const handlePrintIdCard = () => {
    window.print();
  };

  if (!isOpen) return null;

  const isGirl = formData.gender === 'ស្រី';
  const hasCustomAvatar = formData.avatar && isImageAvatar(formData.avatar);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto no-print">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        className="bg-white dark:bg-slate-900 rounded-[32px] max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-pink-500 text-slate-950 flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg font-moul leading-tight">
                  ព័ត៌មានផ្ទាល់ខ្លួនរបស់សិស្ស
                </h3>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full font-mono">
                  #{formData.rollNo}
                </span>
              </div>
              <p className="text-xs text-indigo-200 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                ស៊ីសង្វាក់ជាមួយបញ្ជីវត្តមាន និងពិន្ទុរដ្ឋបាលគ្រូ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrintStudentProfile}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer shrink-0"
              title="បោះពុម្ពជីវប្រវត្តិរូបសង្ខេបសិស្សម្នាក់នេះជាក្រដាស A4 ផ្លូវការ"
            >
              <Printer className="w-4 h-4 text-slate-950" />
              <span className="hidden sm:inline">បោះពុម្ពប្រវត្តិរូប</span>
            </button>
            <button
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 pt-2.5 gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-2xl text-xs font-bold transition border-b-2 cursor-pointer ${
              activeTab === 'profile'
                ? 'border-purple-600 text-purple-700 dark:text-purple-300 bg-white dark:bg-slate-900 font-moul'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>១. ព័ត៌មាន & ប្រវត្តិរូប</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('avatar')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-2xl text-xs font-bold transition border-b-2 cursor-pointer ${
              activeTab === 'avatar'
                ? 'border-indigo-600 text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-900 font-moul'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>២. ប្តូររូបថតសិស្ស</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('idcard')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-2xl text-xs font-bold transition border-b-2 cursor-pointer ${
              activeTab === 'idcard'
                ? 'border-amber-500 text-amber-700 dark:text-amber-300 bg-white dark:bg-slate-900 font-moul'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>៣. កាតសិស្សឌីជីថល</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* ================= TAB 1: EDIT PROFILE FORM ================= */}
          {activeTab === 'profile' && (
            <form id="student-edit-form" onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Top Mini Avatar Bar */}
              <div className="p-4 rounded-3xl bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 dark:from-slate-800 dark:to-slate-800 border border-purple-100 dark:border-slate-700 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 via-purple-600 to-indigo-600 p-0.5 shadow-md shrink-0">
                    <div className="w-full h-full rounded-[14px] bg-slate-950 overflow-hidden flex items-center justify-center text-white">
                      {hasCustomAvatar ? (
                        <img
                          src={formData.avatar}
                          alt={formData.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="text-3xl">{formData.avatar || (isGirl ? '👧' : '👦')}</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white font-moul">
                      {formData.name || 'ឈ្មោះសិស្ស'}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {formData.latinName ? formData.latinName.toUpperCase() : 'NO LATIN NAME'} &bull; ភេទ ៖ <strong>{formData.gender}</strong>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('avatar')}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition active:scale-95 flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>ប្តូររូបថត</span>
                </button>
              </div>

              {/* Name & Latin Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    គោត្តនាម និងនាមសិស្ស (Khmer Name) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-3.5 py-2.5 font-medium focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    placeholder="ឧ. សុខ ពិសី"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    អក្សរឡាតាំង (Latin Name)
                  </label>
                  <input
                    type="text"
                    value={formData.latinName || ''}
                    onChange={(e) => setFormData({ ...formData, latinName: e.target.value.toUpperCase() })}
                    className="w-full border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-3.5 py-2.5 font-mono uppercase font-medium focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    placeholder="SOK PISEY"
                  />
                </div>
              </div>

              {/* Gender, Roll No, Student ID */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ភេទ (Gender)
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'ប្រុស' | 'ស្រី' })}
                    className="w-full border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-3.5 py-2.5 font-bold focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  >
                    <option value="ប្រុស">ប្រុស (Male)</option>
                    <option value="ស្រី">ស្រី (Female)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    លេខរៀងក្នុងបញ្ជី (Roll No)
                  </label>
                  <input
                    type="number"
                    value={formData.rollNo}
                    onChange={(e) => setFormData({ ...formData, rollNo: Number(e.target.value) || 1 })}
                    className="w-full border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-3.5 py-2.5 font-mono font-bold focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    អត្តលេខ / សម្គាល់ខ្លួន
                  </label>
                  <input
                    type="text"
                    value={formData.civilId || ''}
                    onChange={(e) => setFormData({ ...formData, civilId: e.target.value })}
                    className="w-full border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-3.5 py-2.5 font-mono focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    placeholder="STD-001"
                  />
                </div>
              </div>

              {/* Date of Birth & Place of Birth */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    ថ្ងៃខែឆ្នាំកំណើត (Date of Birth)
                  </label>
                  <input
                    type="text"
                    value={formData.dob || ''}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-3.5 py-2.5 font-medium focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    placeholder="ឧ. ០១/០៥/២០១៤"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-600" />
                    ទីកន្លែងកំណើត (Place of Birth)
                  </label>
                  <input
                    type="text"
                    value={formData.pob || ''}
                    onChange={(e) => setFormData({ ...formData, pob: e.target.value })}
                    className="w-full border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-3.5 py-2.5 font-medium focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    placeholder="ឧ. ភូមិ..., ឃុំ..., ស្រុក..., ខេត្ត..."
                  />
                </div>
              </div>

              {/* Parents & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    ឈ្មោះឪពុក & មុខរបរ
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.fatherName || ''}
                      onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                      className="w-1/2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                      placeholder="ឈ្មោះឪពុក"
                    />
                    <input
                      type="text"
                      value={formData.fatherJob || ''}
                      onChange={(e) => setFormData({ ...formData, fatherJob: e.target.value })}
                      className="w-1/2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                      placeholder="មុខរបរឪពុក"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-pink-600" />
                    ឈ្មោះម្តាយ & មុខរបរ
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.motherName || ''}
                      onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                      className="w-1/2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                      placeholder="ឈ្មោះម្តាយ"
                    />
                    <input
                      type="text"
                      value={formData.motherJob || ''}
                      onChange={(e) => setFormData({ ...formData, motherJob: e.target.value })}
                      className="w-1/2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                      placeholder="មុខរបរម្តាយ"
                    />
                  </div>
                </div>
              </div>

              {/* Current Address & Parent Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    អាសយដ្ឋានបច្ចុប្បន្ន (Current Address)
                  </label>
                  <input
                    type="text"
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-3.5 py-2.5 font-medium focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    placeholder="ភូមិ... ឃុំ... ស្រុក... ខេត្ត..."
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    លេខទូរស័ព្ទអាណាព្យាបាល (Parent Phone)
                  </label>
                  <input
                    type="text"
                    value={formData.parentPhone || ''}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    className="w-full border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-3.5 py-2.5 font-mono focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    placeholder="012 345 678"
                  />
                </div>
              </div>

              {/* Academic Progression & MoEYS PRI (ត្រួតថ្នាក់ / ឡើងថ្នាក់ & ពិការភាព) */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/60 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-700 dark:text-indigo-400" />
                    <h5 className="font-black text-indigo-950 dark:text-indigo-200 text-xs">
                      ស្ថានភាពសិក្សា & ស្ថិតិ MoEYS PRI
                    </h5>
                  </div>
                  <span className="text-[10px] text-indigo-800 dark:text-indigo-300 font-bold bg-indigo-200/70 dark:bg-indigo-900/50 px-2 py-0.5 rounded-full">
                    📊 ស៊ីគ្នានឹងទម្រង់ស្ថិតិ PRI
                  </span>
                </div>

                {/* Repeating vs New/Promotion Toggle */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    ស្ថានភាពឡើងថ្នាក់ / ត្រួតថ្នាក់ (MoEYS PRI):
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const noteClean = (formData.note || '').replace(/ត្រួតថ្នាក់|រៀនឡើងវិញ/g, '').trim() || 'នៅរស់';
                        setFormData({
                          ...formData,
                          isRepeating: false,
                          note: noteClean,
                        });
                      }}
                      className={`p-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition ${
                        !formData.isRepeating && !formData.note?.includes('ត្រួតថ្នាក់') && !formData.familyStatus?.includes('ត្រួតថ្នាក់')
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>🌟 សិស្សថ្មី / ឡើងថ្នាក់</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const currentNote = formData.note || '';
                        const updatedNote = currentNote && currentNote !== 'នៅរស់'
                          ? (currentNote.includes('ត្រួតថ្នាក់') ? currentNote : `${currentNote} ត្រួតថ្នាក់`)
                          : 'ត្រួតថ្នាក់';
                        setFormData({
                          ...formData,
                          isRepeating: true,
                          note: updatedNote,
                        });
                      }}
                      className={`p-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition ${
                        formData.isRepeating || formData.note?.includes('ត្រួតថ្នាក់') || formData.familyStatus?.includes('ត្រួតថ្នាក់')
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>🔁 សិស្សត្រួតថ្នាក់</span>
                    </button>
                  </div>
                </div>

                {/* Disability & Indigenous in PRI */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      ពិការភាព / ការលំបាកពិសេស (PRI តារាងទី៣)
                    </label>
                    <select
                      value={formData.disabilityType || 'គ្មាន'}
                      onChange={(e) => setFormData({ ...formData, disabilityType: e.target.value === 'គ្មាន' ? undefined : e.target.value })}
                      className="w-full border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="គ្មាន">គ្មាន (សិស្សទូទៅ)</option>
                      <option value="ពិបាកមើល">ពិបាកមើល (គំហើញ/ភ្នែក)</option>
                      <option value="ពិបាកស្តាប់">ពិបាកស្តាប់ (សោតវិញ្ញាណ/ត្រចៀក)</option>
                      <option value="ពិបាកនិយាយ">ពិបាកនិយាយ (ការបញ្ចេញសំឡេង)</option>
                      <option value="ពិបាកធ្វើចលនា">ពិបាកធ្វើចលនា (ដៃ/ជើង/កាយសម្បទា)</option>
                      <option value="ពិការសតិបញ្ញា">ពិការសតិបញ្ញា / រៀនយឺត</option>
                      <option value="ពិការផ្លូវចិត្ត">ពិការផ្លូវចិត្ត / អូទីសឹម</option>
                      <option value="ពិការសរីរាង្គខាងក្នុង">ពិការសរីរាង្គខាងក្នុង</option>
                      <option value="ពិការផ្សេងៗ">ពិការភាពផ្សេងៗ</option>
                      <option value="កុមារកំព្រា">កុមារកំព្រា</option>
                      <option value="កុមារងាយរងគ្រោះ">កុមារងាយរងគ្រោះ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      ជនជាតិដើមភាគតិច (PRI តារាងទី៤)
                    </label>
                    <select
                      value={formData.indigenousEthnicity || 'គ្មាន'}
                      onChange={(e) => setFormData({ ...formData, indigenousEthnicity: e.target.value === 'គ្មាន' ? undefined : e.target.value })}
                      className="w-full border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="គ្មាន">គ្មាន (ជនជាតិខ្មែរទូទៅ)</option>
                      <option value="ព្នង">ជនជាតិដើម ព្នង</option>
                      <option value="ទំពួន">ជនជាតិដើម ទំពួន</option>
                      <option value="គ្រឹង">ជនជាតិដើម គ្រឹង</option>
                      <option value="ព្រៅ">ជនជាតិដើម ព្រៅ</option>
                      <option value="កួយ">ជនជាតិដើម កួយ</option>
                      <option value="ចារាយ">ជនជាតិដើម ចារាយ</option>
                      <option value="កាចក់">ជនជាតិដើម កាចក់</option>
                      <option value="ផ្សេងៗ">ជនជាតិដើមភាគតិចផ្សេងៗ</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Student Secret PIN & PLP Account */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                    <h5 className="font-black text-amber-950 dark:text-amber-200 text-xs">
                      លេខកូដសម្ងាត់សិស្ស (Student PIN) & គណនី PLP
                    </h5>
                  </div>
                  <span className="text-[10px] text-amber-800 font-bold bg-amber-200/70 dark:bg-amber-900/50 px-2 py-0.5 rounded-full">
                    🔑 សម្រាប់ចូលរៀនរហ័ស
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      លេខកូដ PIN សម្ងាត់ (៤ ខ្ទង់)
                    </label>
                    <div className="relative">
                      <input
                        type={showPin ? 'text' : 'password'}
                        maxLength={6}
                        value={formData.pin || '1234'}
                        onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })}
                        className="w-full border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 rounded-xl px-3.5 py-2 font-mono font-bold tracking-widest text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        placeholder="1234"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      គណនី PLP / Digital MoEYS ID
                    </label>
                    <input
                      type="text"
                      value={formData.plpAccount || ''}
                      onChange={(e) => setFormData({ ...formData, plpAccount: e.target.value })}
                      className="w-full border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 rounded-xl px-3.5 py-2 font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      placeholder="student.plp@moeys.gov.kh"
                    />
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* ================= TAB 2: PHOTO & AVATAR EDITOR ================= */}
          {activeTab === 'avatar' && (
            <div className="space-y-4">
              {/* Current Avatar Live Preview & Quick Apply */}
              <div className="p-4 rounded-3xl bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 dark:from-slate-800 dark:to-slate-800 border border-purple-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-400 via-purple-600 to-indigo-600 p-0.5 shadow-lg shrink-0">
                    <div className="w-full h-full rounded-[14px] bg-slate-950 overflow-hidden flex items-center justify-center text-white">
                      {hasCustomAvatar ? (
                        <img
                          src={formData.avatar}
                          alt={formData.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="text-4xl">{formData.avatar || (isGirl ? '👧' : '👦')}</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold bg-purple-200 dark:bg-purple-900/60 text-purple-900 dark:text-purple-200 px-2 py-0.5 rounded-full">
                      រូបតំណាងបច្ចុប្បន្ន
                    </span>
                    <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mt-1">
                      {formData.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {hasCustomAvatar ? 'រូបថតឌីជីថលពិត' : 'រូបតួអង្គ Emoji'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleSubmit(e)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>យល់ព្រម & រក្សាទុករូបនេះ</span>
                </button>
              </div>

              {/* Mini Sub-tabs */}
              <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 pb-2">
                <button
                  type="button"
                  onClick={() => setAvatarTab('upload')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    avatarTab === 'upload'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload ឯកសារ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAvatarTab('camera')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    avatarTab === 'camera'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>ថតរូបផ្ទាល់ (Camera)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAvatarTab('emojis')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    avatarTab === 'emojis'
                      ? 'bg-pink-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Smile className="w-3.5 h-3.5" />
                  <span>រូបតួអង្គ (Emojis)</span>
                </button>
              </div>

              {/* Sub-tab: Upload */}
              {avatarTab === 'upload' && (
                <div className="space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                      isDragging
                        ? 'border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/50 scale-[1.01]'
                        : 'border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-indigo-50/40 hover:border-indigo-400'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
                      {isProcessingImage ? (
                        <RefreshCw className="w-6 h-6 animate-spin" />
                      ) : (
                        <ImageIcon className="w-6 h-6" />
                      )}
                    </div>

                    <div className="text-center space-y-1">
                      <p className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {isProcessingImage ? 'កំពុងបង្រួមរូបភាព...' : 'ចុចជ្រើសរើសរូបថត ឬអូសទម្លាក់រូបភាព (Drag & Drop)'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        គាំទ្រគ្រប់ប្រភេទរូបភាពពីទូរស័ព្ទ & កុំព្យូទ័រ (JPG, PNG, WEBP)
                      </p>
                    </div>

                    <button
                      type="button"
                      className="mt-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm pointer-events-none"
                    >
                      <Upload className="w-3.5 h-3.5 inline mr-1.5" />
                      <span>ជ្រើសរើសរូបថតពីឧបករណ៍</span>
                    </button>
                  </div>

                  {imageError && (
                    <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs font-bold">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{imageError}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Sub-tab: Camera */}
              {avatarTab === 'camera' && (
                <div className="space-y-4">
                  <input
                    ref={directCameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="user"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 aspect-square max-w-[300px] mx-auto flex items-center justify-center shadow-lg">
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      autoPlay
                      className={`w-full h-full object-cover ${cameraFacingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                    />

                    {!isCameraActive && !cameraError && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-slate-900/95 text-white space-y-3 text-center">
                        <Camera className="w-8 h-8 text-indigo-400" />
                        <p className="text-xs font-bold">ថតរូបផ្ទាល់ពីឧបករណ៍ ឬ Live Camera</p>
                        <div className="flex flex-col gap-2 w-full max-w-[200px]">
                          <button
                            type="button"
                            onClick={() => directCameraInputRef.current?.click()}
                            className="w-full px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5 active:scale-95"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span>📸 ថតរូបពីទូរស័ព្ទ</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => startCamera()}
                            className="w-full px-3 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700"
                          >
                            <span>បើក Live Camera</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {isCameraActive && (
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          const next = cameraFacingMode === 'user' ? 'environment' : 'user';
                          setCameraFacingMode(next);
                          startCamera(next);
                        }}
                        className="px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold flex items-center gap-1.5"
                      >
                        <SwitchCamera className="w-4 h-4 text-purple-600" />
                        <span>ប្តូរកាមេរ៉ា</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCapturePhoto}
                        className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-xs shadow-lg flex items-center gap-1.5 active:scale-95 cursor-pointer"
                      >
                        <Camera className="w-4 h-4" />
                        <span>📸 ថតយករូប</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Sub-tab: Emojis */}
              {avatarTab === 'emojis' && (
                <div className="space-y-4">
                  {EMOJI_CATEGORIES.map((cat) => (
                    <div key={cat.id} className="space-y-1.5">
                      <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 font-moul">
                        {cat.name}
                      </h5>
                      <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                        {cat.emojis.map((em, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, avatar: em });
                              onShowToast(`បានជ្រើសរើសតួអង្គ ${em}`);
                            }}
                            className={`h-11 rounded-2xl text-2xl flex items-center justify-center transition active:scale-90 cursor-pointer ${
                              formData.avatar === em
                                ? 'bg-gradient-to-tr from-purple-500 to-indigo-600 text-white scale-105 shadow-md ring-2 ring-indigo-500'
                                : 'bg-slate-50 dark:bg-slate-800 hover:bg-purple-50 border border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            <span>{em}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 3: DIGITAL STUDENT ID CARD ================= */}
          {activeTab === 'idcard' && (
            <div className="space-y-5">
              {/* The Visual ID Card */}
              <div className="relative rounded-3xl bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-950 text-white p-5 sm:p-6 shadow-2xl border border-purple-500/30 overflow-hidden">
                {/* Background decorative watermark */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-amber-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

                {/* Header of the ID Card */}
                <div className="border-b border-white/15 pb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm shadow-md">
                      🇰🇭
                    </div>
                    <div>
                      <h4 className="font-moul text-xs sm:text-sm text-amber-300 leading-tight">
                        {teacher?.school || 'សាលាបឋមសិក្សា'}
                      </h4>
                      <p className="text-[10px] text-indigo-200 uppercase tracking-widest font-mono font-bold">
                        Digital Student ID Card &bull; {teacher?.academicYear || '២០២៥-២០២៦'}
                      </p>
                    </div>
                  </div>

                  <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <BadgeCheck className="w-3 h-3" /> សកម្ម
                  </span>
                </div>

                {/* Card Content Row */}
                <div className="py-4 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
                  {/* Photo with golden frame */}
                  <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-2xl p-0.5 bg-gradient-to-tr from-amber-300 via-amber-500 to-yellow-200 shadow-xl overflow-hidden shrink-0">
                    <div className="w-full h-full rounded-[14px] bg-slate-950 overflow-hidden flex items-center justify-center">
                      {hasCustomAvatar ? (
                        <img
                          src={formData.avatar}
                          alt={formData.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="text-4xl">{formData.avatar || (isGirl ? '👧' : '👦')}</span>
                      )}
                    </div>
                  </div>

                  {/* Student Details */}
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <div>
                      <h3 className="text-lg sm:text-xl font-black font-moul text-white drop-shadow-xs">
                        {formData.name}
                      </h3>
                      <p className="text-xs font-mono font-bold uppercase text-amber-300 tracking-wider">
                        {formData.latinName || 'STUDENT'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-indigo-100">
                      <div>
                        <span className="text-indigo-300 text-[10px] block">ថ្នាក់រៀន</span>
                        <strong className="text-white font-moul text-xs">{teacher?.grade || 'ថ្នាក់ទី ៦ក'}</strong>
                      </div>
                      <div>
                        <span className="text-indigo-300 text-[10px] block">លេខរៀងតុ</span>
                        <strong className="text-amber-300 font-mono text-sm font-black">#{formData.rollNo}</strong>
                      </div>
                      <div>
                        <span className="text-indigo-300 text-[10px] block">ភេទ</span>
                        <strong className="text-white">{formData.gender}</strong>
                      </div>
                      <div>
                        <span className="text-indigo-300 text-[10px] block">ថ្ងៃខែឆ្នាំកំណើត</span>
                        <strong className="text-white font-mono">{formData.dob || '០១/០១/២០១៤'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* QR Code for Student Link & Verification */}
                  {(() => {
                    const baseUrl = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : '';
                    const studentQrUrl = `${baseUrl}?tab=student_portal&studentId=${formData.id}${formData.pin ? `&pin=${encodeURIComponent(formData.pin)}` : ''}`;
                    return (
                      <div className="bg-white p-2 rounded-2xl shadow-lg shrink-0 flex flex-col items-center">
                        <QRCodeSVG
                          value={studentQrUrl}
                          size={72}
                          level="M"
                        />
                        <span className="text-[8px] text-slate-800 font-mono font-bold mt-1">ID: #{formData.rollNo}</span>
                      </div>
                    );
                  })()}
                </div>

                {/* Card Footer */}
                <div className="border-t border-white/10 pt-2.5 flex items-center justify-between text-[10px] text-indigo-300 font-sans">
                  <span>គ្រូបន្ទុកថ្នាក់ ៖ <strong>{teacher?.name || 'លោកគ្រូ-អ្នកគ្រូ'}</strong></span>
                  <span className="font-mono text-slate-400">MoEYS Cambodia</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handlePrintIdCard}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-indigo-600" />
                  <span>បោះពុម្ពកាតសិស្ស</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-600 transition"
          >
            បោះបង់
          </button>

          <button
            type="button"
            onClick={(e) => {
              handleSubmit(e);
            }}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 text-white font-bold text-xs shadow-lg shadow-purple-900/30 flex items-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>រក្សាទុកព័ត៌មានសិស្ស</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
