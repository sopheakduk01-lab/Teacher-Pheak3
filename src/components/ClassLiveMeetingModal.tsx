import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  Hand,
  PhoneOff,
  Users,
  MessageSquare,
  Sparkles,
  Volume2,
  Maximize2,
  Minimize2,
  ShieldCheck,
  Award,
  Radio,
  Share2,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Student, TeacherProfile } from '../types';
import { isImageAvatar } from '../utils/imageCompressor';
import { ChatMessage } from './ClassGroupChatModal';

interface ClassLiveMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher?: TeacherProfile;
  students: Student[];
  currentStudent?: Student | null;
  isTeacherMode: boolean;
  onShowToast: (msg: string) => void;
  onSendChatMessage: (text: string) => void;
  messages: ChatMessage[];
}

export const ClassLiveMeetingModal: React.FC<ClassLiveMeetingModalProps> = ({
  isOpen,
  onClose,
  teacher,
  students,
  currentStudent,
  isTeacherMode,
  onShowToast,
  onSendChatMessage,
  messages,
}) => {
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [meetingSeconds, setMeetingSeconds] = useState(0);
  const [raisedHands, setRaisedHands] = useState<string[]>([]);
  const [activeSpeakerIndex, setActiveSpeakerIndex] = useState<number>(0);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  const myName = isTeacherMode
    ? (teacher?.name || 'លោកគ្រូ/អ្នកគ្រូ')
    : (currentStudent?.name || 'សិស្ស');

  const myAvatar = isTeacherMode
    ? (teacher?.avatar || '👨‍🏫')
    : (currentStudent?.avatar || (currentStudent?.gender === 'ស្រី' ? '👧' : '👦'));

  // Timer
  useEffect(() => {
    if (!isOpen) {
      setMeetingSeconds(0);
      return;
    }
    const interval = setInterval(() => {
      setMeetingSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Simulated active speaker change for realistic classroom ambiance
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      // randomly pick teacher (0) or one of students
      const rand = Math.floor(Math.random() * (students.length > 0 ? 4 : 1));
      setActiveSpeakerIndex(rand);
    }, 4500);
    return () => clearInterval(interval);
  }, [isOpen, students.length]);

  // Start Camera Stream
  useEffect(() => {
    let active = true;

    async function setupCamera() {
      if (!isOpen) return;
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 640 }, height: { ideal: 480 } },
            audio: true,
          });
          if (!active) {
            stream.getTracks().forEach((t) => t.stop());
            return;
          }
          localStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        }
      } catch (err) {
        // Camera unavailable or permission denied, fallback smoothly
        console.warn('Live meeting camera fallback to avatar:', err);
      }
    }

    if (isOpen) {
      setupCamera();
    }

    return () => {
      active = false;
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
        screenStreamRef.current = null;
      }
    };
  }, [isOpen]);

  // Toggle Mic
  const toggleMic = () => {
    const nextMuted = !isMicMuted;
    setIsMicMuted(nextMuted);
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !nextMuted;
      });
    }
    onShowToast(nextMuted ? '🔇 បានបិទមីក្រូហ្វូន' : '🎙️ បានបើកមីក្រូហ្វូន');
  };

  // Toggle Camera
  const toggleVideo = () => {
    const nextVideoOff = !isVideoOff;
    setIsVideoOff(nextVideoOff);
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !nextVideoOff;
      });
    }
    onShowToast(nextVideoOff ? '📷 បានបិទកាមេរ៉ា' : '📹 បានបើកកាមេរ៉ា');
  };

  // Toggle Screen Sharing
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
        screenStreamRef.current = null;
      }
      setIsScreenSharing(false);
      onShowToast('បានបញ្ឈប់ការចែករំលែកអេក្រង់');
      return;
    }

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = stream;
        setIsScreenSharing(true);
        onShowToast('🖥️ កំពុងចែករំលែកអេក្រង់មេរៀន');

        if (screenVideoRef.current) {
          screenVideoRef.current.srcObject = stream;
        }

        stream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          screenStreamRef.current = null;
          onShowToast('បានបញ្ឈប់ការចែករំលែកអេក្រង់');
        };
      } else {
        onShowToast('កម្មវិធីរុករកនេះមិនគាំទ្រការចែករំលែកអេក្រង់ទេ');
      }
    } catch (e) {
      console.warn('Screen share cancelled/denied', e);
    }
  };

  // Raise Hand
  const toggleRaiseHand = () => {
    const nextState = !isHandRaised;
    setIsHandRaised(nextState);

    // Audio chime
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {
      // ignore
    }

    if (nextState) {
      setRaisedHands((prev) => [...prev, myName]);
      onShowToast(`✋ ${myName} បានលើកដៃសួរ!`);
      onSendChatMessage(`✋ ${myName} បានលើកដៃសួរក្នុងអង្គប្រជុំថ្នាក់រៀន`);
    } else {
      setRaisedHands((prev) => prev.filter((n) => n !== myName));
      onShowToast('បានដាក់ដៃចុះវិញ');
    }
  };

  const handleSendMeetingChat = () => {
    if (!chatInput.trim()) return;
    onSendChatMessage(chatInput.trim());
    setChatInput('');
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-hidden no-print">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-slate-700/80 rounded-[32px] w-full max-w-5xl h-[94vh] max-h-[860px] text-white flex flex-col overflow-hidden shadow-2xl relative"
      >
        {/* Top Header Bar */}
        <div className="p-3.5 sm:p-4 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-500 animate-ping absolute" />
              <span className="w-3.5 h-3.5 rounded-full bg-rose-600 relative" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base font-moul text-white">
                  ការប្រជុំថ្នាក់រៀនផ្ទាល់ (Live Classroom Meeting)
                </h3>
                <span className="bg-rose-500/20 border border-rose-400/40 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  LIVE
                </span>
              </div>
              <p className="text-[11px] text-purple-200/80 flex items-center gap-2 mt-0.5">
                <span>គ្រូបង្រៀន ៖ <strong>{teacher?.name || 'លោកគ្រូ/អ្នកគ្រូ'}</strong></span>
                <span>&bull;</span>
                <span className="font-mono text-emerald-400 font-bold">
                  ⏱️ {formatTimer(meetingSeconds)}
                </span>
                <span>&bull;</span>
                <span className="text-amber-300 font-semibold flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> {students.length + 1} នាក់
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {raisedHands.length > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 bg-amber-500/20 border border-amber-400/40 text-amber-300 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                <Hand className="w-3.5 h-3.5" />
                <span>លើកដៃ ៖ {raisedHands[0]}</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowChatPanel(!showChatPanel)}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                showChatPanel
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title="បើក/បិទ ប្រអប់ Chat"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">សារជជែក</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-rose-600/80 text-white transition"
              title="បិទ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Meeting Room Area */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Main Stage & Participant Grid */}
          <div className="flex-1 flex flex-col p-3 sm:p-5 overflow-y-auto space-y-4">
            {/* Screen Share Window (if active) */}
            {isScreenSharing && (
              <div className="bg-black rounded-3xl overflow-hidden border-2 border-indigo-500 shadow-xl relative aspect-video w-full max-h-[360px] flex items-center justify-center">
                <video
                  ref={screenVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold text-white flex items-center gap-2 border border-white/20">
                  <Monitor className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                  <span>កំពុងចែករំលែកអេក្រង់មេរៀន...</span>
                </div>
              </div>
            )}

            {/* Video Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 flex-1">
              {/* 1. Host / Teacher Tile (Large Focus) */}
              <div
                className={`bg-slate-950 rounded-3xl overflow-hidden border relative flex flex-col justify-between p-3.5 min-h-[220px] sm:min-h-[260px] transition-all shadow-xl ${
                  activeSpeakerIndex === 0
                    ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-amber-500/20'
                    : 'border-slate-800'
                }`}
              >
                {/* Background Video / Avatar */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-purple-950/40 to-slate-950">
                  {isTeacherMode && !isVideoOff ? (
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative">
                        <div
                          className={`w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-purple-500 to-pink-500 shadow-2xl flex items-center justify-center ${
                            activeSpeakerIndex === 0 ? 'animate-pulse' : ''
                          }`}
                        >
                          <div className="w-full h-full rounded-full bg-slate-900 overflow-hidden flex items-center justify-center">
                            {teacher?.avatar && isImageAvatar(teacher.avatar) ? (
                              <img
                                src={teacher.avatar}
                                alt={teacher.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <span className="text-4xl">{teacher?.avatar || '👨‍🏫'}</span>
                            )}
                          </div>
                        </div>

                        {activeSpeakerIndex === 0 && (
                          <span className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 text-[10px] px-2 py-0.5 rounded-full font-black flex items-center gap-1 shadow-md">
                            <Radio className="w-3 h-3 animate-spin" /> កំពុងនិយាយ
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-bold font-moul text-amber-300">
                        {teacher?.name || 'គ្រូបន្ទុកថ្នាក់'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                    👑 គ្រូបង្រៀន (Host)
                  </span>
                  <span
                    className={`p-1.5 rounded-xl text-xs backdrop-blur-md ${
                      isTeacherMode && isMicMuted
                        ? 'bg-rose-500/80 text-white'
                        : 'bg-emerald-500/80 text-white'
                    }`}
                  >
                    {isTeacherMode && isMicMuted ? (
                      <MicOff className="w-3.5 h-3.5" />
                    ) : (
                      <Mic className="w-3.5 h-3.5 animate-pulse" />
                    )}
                  </span>
                </div>

                {/* Bottom Overlay Label */}
                <div className="relative z-10 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 flex items-center justify-between">
                  <span className="font-bold text-xs truncate text-white">
                    {teacher?.name || 'លោកគ្រូ/អ្នកគ្រូ'}
                  </span>
                  {activeSpeakerIndex === 0 && (
                    <div className="flex items-center gap-0.5">
                      <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce" />
                      <span className="w-1 h-4 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                      <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                    </div>
                  )}
                </div>
              </div>

              {/* 2. My Student / Peer Tile (if in student mode) */}
              {!isTeacherMode && currentStudent && (
                <div
                  className={`bg-slate-950 rounded-3xl overflow-hidden border relative flex flex-col justify-between p-3.5 min-h-[220px] sm:min-h-[260px] transition-all shadow-xl ${
                    isHandRaised
                      ? 'border-amber-400 ring-2 ring-amber-400/50'
                      : 'border-slate-800'
                  }`}
                >
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-indigo-950/40 to-slate-950">
                    {!isVideoOff ? (
                      <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 p-1 flex items-center justify-center shadow-lg">
                          <div className="w-full h-full rounded-full bg-slate-900 overflow-hidden flex items-center justify-center">
                            {currentStudent.avatar && isImageAvatar(currentStudent.avatar) ? (
                              <img
                                src={currentStudent.avatar}
                                alt={currentStudent.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <span className="text-3xl">
                                {currentStudent.avatar || (currentStudent.gender === 'ស្រី' ? '👧' : '👦')}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-xs font-bold text-white">{currentStudent.name} (ខ្ញុំ)</span>
                      </div>
                    )}
                  </div>

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="bg-indigo-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full">
                      #{currentStudent.rollNo} ខ្ញុំ
                    </span>
                    <span
                      className={`p-1.5 rounded-xl text-xs backdrop-blur-md ${
                        isMicMuted ? 'bg-rose-500/80 text-white' : 'bg-emerald-500/80 text-white'
                      }`}
                    >
                      {isMicMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    </span>
                  </div>

                  <div className="relative z-10 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 flex items-center justify-between">
                    <span className="font-bold text-xs truncate">{currentStudent.name}</span>
                    {isHandRaised && (
                      <span className="text-amber-400 flex items-center gap-1 text-xs font-bold">
                        <Hand className="w-3.5 h-3.5" /> លើកដៃ
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* 3. Classmates Tiles */}
              {students
                .filter((s) => isTeacherMode || s.id !== currentStudent?.id)
                .slice(0, isTeacherMode ? 5 : 4)
                .map((st, idx) => {
                  const isSpeaking = activeSpeakerIndex === idx + 1;
                  const isRaised = raisedHands.includes(st.name);

                  return (
                    <div
                      key={st.id}
                      className={`bg-slate-950 rounded-3xl overflow-hidden border relative flex flex-col justify-between p-3.5 min-h-[220px] sm:min-h-[260px] transition-all shadow-md ${
                        isSpeaking
                          ? 'border-emerald-400 ring-2 ring-emerald-400/40'
                          : 'border-slate-800/80'
                      }`}
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900/60 to-slate-950 p-4">
                        <div
                          className={`w-18 h-18 rounded-full p-1 bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center shadow-lg transition-transform ${
                            isSpeaking ? 'scale-110 ring-4 ring-emerald-400/30' : ''
                          }`}
                        >
                          <div className="w-full h-full rounded-full bg-slate-900 overflow-hidden flex items-center justify-center">
                            {st.avatar && isImageAvatar(st.avatar) ? (
                              <img
                                src={st.avatar}
                                alt={st.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <span className="text-2xl">
                                {st.avatar || (st.gender === 'ស្រី' ? '👧' : '👦')}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-xs font-bold text-slate-200 mt-2 truncate max-w-[120px]">
                          {st.name}
                        </span>
                      </div>

                      <div className="relative z-10 flex items-center justify-between">
                        <span className="bg-slate-800/80 text-slate-300 font-mono text-[10px] px-2 py-0.5 rounded-full border border-white/10">
                          #{st.rollNo}
                        </span>
                        <span
                          className={`p-1.5 rounded-xl text-xs backdrop-blur-md ${
                            isSpeaking ? 'bg-emerald-500/80 text-white' : 'bg-slate-800/80 text-slate-400'
                          }`}
                        >
                          {isSpeaking ? (
                            <Mic className="w-3.5 h-3.5 animate-pulse" />
                          ) : (
                            <MicOff className="w-3.5 h-3.5" />
                          )}
                        </span>
                      </div>

                      <div className="relative z-10 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 flex items-center justify-between">
                        <span className="font-bold text-xs truncate text-slate-300">{st.name}</span>
                        {isRaised ? (
                          <span className="text-amber-400 flex items-center gap-1 text-[11px] font-bold">
                            <Hand className="w-3 h-3" /> លើកដៃ
                          </span>
                        ) : isSpeaking ? (
                          <div className="flex items-center gap-0.5">
                            <span className="w-1 h-2.5 bg-emerald-400 rounded-full animate-bounce" />
                            <span className="w-1 h-3.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* In-Meeting Live Chat Drawer */}
          <AnimatePresence>
            {showChatPanel && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="border-l border-slate-800 bg-slate-950 flex flex-col shrink-0 shadow-2xl overflow-hidden"
              >
                <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900">
                  <span className="font-bold text-xs font-moul text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-purple-400" /> សារក្នុងអង្គប្រជុំ
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowChatPanel(false)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Messages stream */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {messages.slice(-15).map((m) => {
                    const isTeach = m.senderRole === 'teacher';
                    return (
                      <div key={m.id} className="text-xs space-y-0.5">
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                          <span className="font-bold text-purple-300">{m.senderName}</span>
                          {isTeach && (
                            <span className="bg-amber-400 text-slate-950 px-1 py-0.2 rounded text-[8px] font-black">
                              គ្រូ
                            </span>
                          )}
                          <span>&bull;</span>
                          <span>{m.timestamp.replace('ថ្ងៃនេះ ម៉ោង ', '')}</span>
                        </div>
                        <div
                          className={`p-2.5 rounded-2xl ${
                            isTeach
                              ? 'bg-purple-900/60 border border-purple-500/40 text-purple-100'
                              : 'bg-slate-900 border border-slate-800 text-slate-200'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{m.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Send chat */}
                <div className="p-3 border-t border-slate-800 bg-slate-900 flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendMeetingChat();
                    }}
                    placeholder="ផ្ញើសារក្នុងអង្គប្រជុំ..."
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                  <button
                    type="button"
                    onClick={handleSendMeetingChat}
                    className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition"
                  >
                    ផ្ញើ
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Meeting Controls Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0 flex-wrap">
          <div className="flex items-center gap-2">
            {/* Mic Toggle */}
            <button
              type="button"
              onClick={toggleMic}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-lg active:scale-95 ${
                isMicMuted
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              }`}
            >
              {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-400" />}
              <span>{isMicMuted ? 'បើក Mic' : 'បិទ Mic'}</span>
            </button>

            {/* Camera Toggle */}
            <button
              type="button"
              onClick={toggleVideo}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-lg active:scale-95 ${
                isVideoOff
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              }`}
            >
              {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4 text-indigo-400" />}
              <span>{isVideoOff ? 'បើកកាមេរ៉ា' : 'បិទកាមេរ៉ា'}</span>
            </button>

            {/* Screen Sharing Toggle */}
            <button
              type="button"
              onClick={toggleScreenShare}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-lg active:scale-95 ${
                isScreenSharing
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              }`}
            >
              <Monitor className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline">
                {isScreenSharing ? 'ឈប់ចែករំលែក' : 'ចែករំលែកអេក្រង់'}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Raise Hand Toggle */}
            <button
              type="button"
              onClick={toggleRaiseHand}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-lg active:scale-95 ${
                isHandRaised
                  ? 'bg-amber-400 text-slate-950 font-black'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              }`}
            >
              <Hand className="w-4 h-4" />
              <span>{isHandRaised ? 'ទម្លាក់ដៃចុះ' : 'លើកដៃសួរ'}</span>
            </button>

            {/* End / Leave Meeting Button */}
            <button
              type="button"
              onClick={() => {
                if (confirm('តើអ្នកពិតជាចង់ចាកចេញពីការប្រជុំថ្នាក់រៀនមែនទេ?')) {
                  onClose();
                  onShowToast('បានចាកចេញពីការប្រជុំ');
                }
              }}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-rose-900/30 cursor-pointer active:scale-95"
            >
              <PhoneOff className="w-4 h-4" />
              <span>ចាកចេញពីការប្រជុំ</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
