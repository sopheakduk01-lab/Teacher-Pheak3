import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Upload,
  Camera,
  Smile,
  Check,
  Trash2,
  RefreshCw,
  Sparkles,
  User,
  AlertCircle,
  SwitchCamera,
  Image as ImageIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Student } from '../types';
import { compressImageFile, isImageAvatar } from '../utils/imageCompressor';

interface StudentAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStudent: Student;
  onSaveAvatar: (newAvatar: string) => void;
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

export const StudentAvatarModal: React.FC<StudentAvatarModalProps> = ({
  isOpen,
  onClose,
  currentStudent,
  onSaveAvatar,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'camera' | 'presets'>('upload');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(
    currentStudent.avatar || (currentStudent.gender === 'F' ? '👧' : '👦')
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Camera state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraFacingMode, setCameraFacingMode] = useState<'user' | 'environment'>('user');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const directCameraInputRef = useRef<HTMLInputElement | null>(null);

  // Reset modal state when opened
  useEffect(() => {
    if (isOpen) {
      setSelectedAvatar(currentStudent.avatar || (currentStudent.gender === 'F' ? '👧' : '👦'));
      setErrorMessage(null);
      setCameraError(null);
    } else {
      stopCamera();
    }
  }, [isOpen, currentStudent]);

  // Clean up camera on unmount or tab switch
  const stopCamera = () => {
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach((track) => track.stop());
      } catch (e) {
        // ignore cleanup errors
      }
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    if (activeTab !== 'camera') {
      stopCamera();
    }
  }, [activeTab]);

  // Start Camera safely
  const startCamera = async (mode: 'user' | 'environment' = cameraFacingMode) => {
    stopCamera();
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('ឧបករណ៍ ឬកម្មវិធីរុករកនេះមិនទាន់គាំទ្រ WebRTC Live Camera ទេ។ សូមប្រើប៊ូតុង «ថតរូបផ្ទាល់ពីឧបករណ៍» ខាងក្រោម។');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 640 },
          height: { ideal: 640 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (playErr) {
          // Playback might need user gesture in some contexts
        }
      }
      setIsCameraActive(true);
    } catch (err: any) {
      const errString = String(err?.message || err?.name || '');
      if (err?.name === 'NotAllowedError' || errString.includes('denied') || errString.includes('not allowed')) {
        setCameraError('ការអនុញ្ញាតកាមេរ៉ាត្រូវបានបដិសេធ (Camera Permission Denied)។ លោកអ្នកនៅតែអាចចុចប៊ូតុង «📸 ថតរូបផ្ទាល់ពីឧបករណ៍» ឬដាក់រូបភាពតាមការ Upload បានយ៉ាងងាយស្រួល។');
      } else {
        setCameraError('មិនអាចបើក Live Camera បានទេ។ សូមប្រើប៊ូតុង «📸 ថតរូបផ្ទាល់ពីឧបករណ៍» ខាងក្រោម។');
      }
      setIsCameraActive(false);
    }
  };

  // Switch Camera between front and back
  const handleToggleCamera = () => {
    const nextMode = cameraFacingMode === 'user' ? 'environment' : 'user';
    setCameraFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Capture Photo from Camera
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

      // Center crop square
      const sx = ((video.videoWidth || 480) - size) / 2;
      const sy = ((video.videoHeight || 480) - size) / 2;

      // If user camera, flip horizontally for mirror effect
      if (cameraFacingMode === 'user') {
        ctx.translate(360, 0);
        ctx.scale(-1, 1);
      }

      ctx.drawImage(video, sx, sy, size, size, 0, 0, 360, 360);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

      setSelectedAvatar(dataUrl);
      stopCamera();
      onShowToast('បានថតរូបជោគជ័យ! សូមចុចរក្សាទុក');
    } catch (err) {
      setCameraError('មានបញ្ហាក្នុងការចាប់យករូបភាពពីកាមេរ៉ា');
    }
  };

  // Handle File Input Selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processImageFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Process and compress image file
  const processImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('សូមជ្រើសរើសឯកសារជារូបភាព (JPG, PNG, WEBP)');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const compressedDataUrl = await compressImageFile(file, {
        maxWidth: 360,
        maxHeight: 360,
        quality: 0.82,
        mimeType: 'image/jpeg',
      });

      setSelectedAvatar(compressedDataUrl);
      onShowToast('បានបញ្ចូលរូបភាពជោគជ័យ! សូមចុចរក្សាទុក');
    } catch (err: any) {
      console.error('Image compression error:', err);
      setErrorMessage('មិនអាចទាញយករូបភាពនេះបានទេ សូមសាកល្បងរូបភាពផ្សេង');
    } finally {
      setIsProcessing(false);
    }
  };

  // Drag and Drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processImageFile(e.dataTransfer.files[0]);
    }
  };

  // Reset to default gender avatar
  const handleResetToDefault = () => {
    const defaultEmoji = currentStudent.gender === 'F' ? '👧' : '👦';
    setSelectedAvatar(defaultEmoji);
    onShowToast('បានកំណត់រូបសិស្សជាទម្រង់ដើមវិញ');
  };

  // Save changes
  const handleSave = () => {
    onSaveAvatar(selectedAvatar);
    stopCamera();
    onClose();
  };

  if (!isOpen) return null;

  const isImg = isImageAvatar(selectedAvatar);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 15 }}
        className="bg-white dark:bg-slate-900 rounded-[32px] max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-50/70 via-purple-50/70 to-pink-50/70 dark:from-slate-800/80 dark:to-slate-800/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base font-moul text-indigo-950 dark:text-white leading-tight">
                ប្តូររូបថតសិស្ស (Student Photo)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                សិស្ស ៖ <strong className="text-indigo-600 dark:text-indigo-400">{currentStudent.name}</strong> (តុ #{currentStudent.rollNo})
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center transition active:scale-95 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Preview Banner */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-md shadow-purple-500/20 overflow-hidden shrink-0 flex items-center justify-center">
                <div className="w-full h-full rounded-[14px] bg-slate-900 overflow-hidden flex items-center justify-center">
                  {isImg ? (
                    <img
                      src={selectedAvatar}
                      alt={currentStudent.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-3xl">{selectedAvatar}</span>
                  )}
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded-full border border-white dark:border-slate-900 shadow-2xs">
                រូបបច្ចុប្បន្ន
              </span>
            </div>

            <div>
              <div className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{currentStudent.name}</span>
                <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 font-bold px-2 py-0.5 rounded-full">
                  #{currentStudent.rollNo}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {isImg ? '📷 រូបថតពិត (Uploaded Photo)' : '🎨 រូបតួអង្គ (Emoji Avatar)'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetToDefault}
            className="text-[11px] font-bold text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition border border-transparent hover:border-rose-200"
            title="កំណត់ជារូបលំនាំដើមវិញ"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">លុបរូប / ប្រើទម្រង់ដើម</span>
          </button>
        </div>

        {/* 3 Main Mode Selection Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-2xl text-xs font-bold transition border-b-2 cursor-pointer ${
              activeTab === 'upload'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/40'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>១. ដាក់រូបថត (Upload)</span>
          </button>

          <button
            onClick={() => setActiveTab('camera')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-2xl text-xs font-bold transition border-b-2 cursor-pointer ${
              activeTab === 'camera'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400 bg-purple-50/50 dark:bg-purple-950/40'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>២. ថតរូបផ្ទាល់ (Camera)</span>
          </button>

          <button
            onClick={() => setActiveTab('presets')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-2xl text-xs font-bold transition border-b-2 cursor-pointer ${
              activeTab === 'presets'
                ? 'border-pink-600 text-pink-600 dark:text-pink-400 bg-pink-50/50 dark:bg-pink-950/40'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Smile className="w-4 h-4" />
            <span>៣. រូបតួអង្គ (Emojis)</span>
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: FILE UPLOAD (DRAG & DROP) */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="student-photo-upload-input"
              />

              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                  dragActive
                    ? 'border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/50 scale-[1.01]'
                    : 'border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-indigo-50/40 hover:border-indigo-400'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
                  {isProcessing ? (
                    <RefreshCw className="w-6 h-6 animate-spin" />
                  ) : (
                    <ImageIcon className="w-6 h-6" />
                  )}
                </div>

                <div className="text-center space-y-1">
                  <p className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {isProcessing ? 'កំពុងដំណើរការរូបភាព...' : 'ចុចជ្រើសរើសរូបថត ឬអូសទម្លាក់ទីនេះ (Drag & Drop)'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    គាំទ្រគ្រប់ប្រភេទរូបភាពពីទូរសព្ទ & កុំព្យូទ័រ (JPG, PNG, WEBP)
                  </p>
                </div>

                <button
                  type="button"
                  className="mt-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition active:scale-95 pointer-events-none"
                >
                  <Upload className="w-3.5 h-3.5 inline mr-1.5" />
                  <span>ជ្រើសរើសរូបថតពីឧបករណ៍</span>
                </button>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 rounded-2xl p-3 text-[11px] text-amber-900 dark:text-amber-200 space-y-1">
                <span className="font-bold flex items-center gap-1">
                  💡 គន្លឹះជ្រើសរើសរូបថតសិស្ស ៖
                </span>
                <p className="leading-relaxed">
                  ដើម្បីឱ្យរូបថតមើលទៅស្រស់ស្អាតលើព្រឹត្តិបត្រពិន្ទុ និងតារាងសិស្ស សូមជ្រើសរើសរូបថតមុខចំ ច្បាស់ និងមានពន្លឺគ្រប់គ្រាន់។
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE CAMERA CAPTURE */}
          {activeTab === 'camera' && (
            <div className="space-y-4">
              {/* Native device camera input (works on mobile/tablets directly) */}
              <input
                ref={directCameraInputRef}
                type="file"
                accept="image/*"
                capture="user"
                onChange={handleFileChange}
                className="hidden"
                id="student-direct-camera-input"
              />

              <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 aspect-square max-w-[320px] mx-auto flex items-center justify-center shadow-lg">
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  autoPlay
                  className={`w-full h-full object-cover ${cameraFacingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                />

                {/* Round target overlay */}
                {isCameraActive && (
                  <div className="absolute inset-0 border-4 border-indigo-500/40 rounded-full m-6 pointer-events-none border-dashed animate-pulse" />
                )}

                {!isCameraActive && !cameraError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-5 bg-slate-900/95 text-white space-y-3.5 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-200">ថតរូបផ្ទាល់ពីឧបករណ៍ ឬបើក Live Camera</p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        ជ្រើសរើសវិធីសាស្ត្រងាយស្រួលខាងក្រោម
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 w-full max-w-[220px]">
                      <button
                        type="button"
                        onClick={() => directCameraInputRef.current?.click()}
                        className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>📸 ថតរូបពីទូរសព្ទផ្ទាល់</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => startCamera()}
                        className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>បើក Live Camera</span>
                      </button>
                    </div>
                  </div>
                )}

                {cameraError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-slate-950/95 text-white text-center space-y-3">
                    <AlertCircle className="w-7 h-7 text-amber-400" />
                    <p className="text-xs text-slate-300 px-2 leading-relaxed">{cameraError}</p>
                    <div className="flex flex-col gap-2 w-full max-w-[220px]">
                      <button
                        type="button"
                        onClick={() => directCameraInputRef.current?.click()}
                        className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>📸 ថតរូបពីទូរសព្ទផ្ទាល់</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('upload')}
                        className="w-full px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700"
                      >
                        ← ដាក់រូបតាមការ Upload ឯកសារ
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Camera Action Buttons (When Live Camera is Active) */}
              {isCameraActive && (
                <div className="flex items-center justify-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleToggleCamera}
                    className="px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5"
                    title="ប្តូរកាមេរ៉ាមុខ/ក្រោយ"
                  >
                    <SwitchCamera className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>ប្តូរកាមេរ៉ា</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCapturePhoto}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black text-xs shadow-lg shadow-indigo-600/30 transition flex items-center gap-2 active:scale-95 cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>📸 ថតយករូប (Snap Photo)</span>
                  </button>
                </div>
              )}

              {/* Secondary Direct Camera option always accessible */}
              <div className="flex justify-center pt-1">
                <button
                  type="button"
                  onClick={() => directCameraInputRef.current?.click()}
                  className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 font-semibold underline underline-offset-4"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>ថតរូបភ្លាមៗតាមកម្មវិធី Camera របស់ទូរសព្ទ (Device Shutter)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: CARTOON CHARACTERS & PRESET EMOJIS */}
          {activeTab === 'presets' && (
            <div className="space-y-4">
              {EMOJI_CATEGORIES.map((cat) => (
                <div key={cat.id} className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 font-moul">
                    {cat.name}
                  </h4>
                  <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                    {cat.emojis.map((emoji, idx) => {
                      const isSelected = selectedAvatar === emoji;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setSelectedAvatar(emoji);
                            onShowToast(`បានជ្រើសរើសតួអង្គ ${emoji}`);
                          }}
                          className={`h-12 rounded-2xl text-2xl flex items-center justify-center transition active:scale-90 cursor-pointer ${
                            isSelected
                              ? 'bg-gradient-to-tr from-purple-500 to-indigo-600 text-white scale-110 shadow-md ring-2 ring-indigo-500 ring-offset-2'
                              : 'bg-slate-50 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/50 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <span>{emoji}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer / Save & Cancel */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-600 transition"
          >
            បោះបង់ (Cancel)
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-black text-xs shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>រក្សាទុករូបថត (Save Avatar)</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
