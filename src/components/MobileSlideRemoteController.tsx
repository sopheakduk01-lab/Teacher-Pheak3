import React, { useState, useEffect, useRef } from 'react';
import {
  Smartphone,
  ChevronLeft,
  ChevronRight,
  Zap,
  Eye,
  Clock,
  RotateCcw,
  Volume2,
  Bell,
  Sparkles,
  Lightbulb,
  PenTool,
  Eraser,
  Type,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Camera,
  X,
  Radio,
  ArrowRight,
  Home,
  RefreshCw,
  Layers,
  HelpCircle,
  Wifi,
  WifiOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Html5Qrcode } from 'html5-qrcode';
import {
  SlideRemoteState,
  ActiveSessionInfo,
  subscribeToSlideSession,
  sendRemoteCommand,
  getActiveSlideSessions
} from '../lib/slideRemoteSync';

interface MobileSlideRemoteControllerProps {
  initialSessionId?: string;
  onExit?: () => void;
  onShowToast?: (msg: string) => void;
}

export const MobileSlideRemoteController: React.FC<MobileSlideRemoteControllerProps> = ({
  initialSessionId = '',
  onExit,
  onShowToast
}) => {
  const [sessionId, setSessionId] = useState<string>(initialSessionId);
  const [inputSession, setInputSession] = useState<string>(initialSessionId);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [sessionState, setSessionState] = useState<SlideRemoteState | null>(null);
  const [showNotesDrawer, setShowNotesDrawer] = useState<boolean>(false);
  const [lastCommandSent, setLastCommandSent] = useState<string>('');
  const [viewMode, setViewMode] = useState<'control' | 'mirror'>('control');

  // Active Sessions on network
  const [activeSessions, setActiveSessions] = useState<ActiveSessionInfo[]>([]);
  const [isRefreshingSessions, setIsRefreshingSessions] = useState<boolean>(false);

  // In-app QR Scanner state
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [scannerError, setScannerError] = useState<string>('');
  const qrScannerRef = useRef<Html5Qrcode | null>(null);

  // Extract from URL query parameters if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlSession = urlParams.get('remote') || urlParams.get('session');
      if (urlSession) {
        const norm = urlSession.trim().toUpperCase();
        setSessionId(norm);
        setInputSession(norm);
      } else if (!sessionId) {
        const saved = localStorage.getItem('last_remote_session_id');
        if (saved && saved.startsWith('KM-')) {
          setInputSession(saved);
        }
      }
    }
  }, [sessionId]);

  // Load active sessions on mount and every 3 seconds if not connected
  const refreshActiveSessions = async () => {
    setIsRefreshingSessions(true);
    const list = await getActiveSlideSessions();
    setActiveSessions(list);
    setIsRefreshingSessions(false);
  };

  useEffect(() => {
    refreshActiveSessions();
    if (!sessionId) {
      const interval = setInterval(refreshActiveSessions, 3500);
      return () => clearInterval(interval);
    }
  }, [sessionId]);

  // Start QR Camera Scanner
  const startQrScanner = async () => {
    setIsScannerOpen(true);
    setScannerError('');
    setTimeout(async () => {
      try {
        const scannerElement = document.getElementById('qr-reader');
        if (!scannerElement) return;

        if (qrScannerRef.current) {
          try {
            await qrScannerRef.current.stop();
          } catch {
            // ignore
          }
        }

        const html5QrCode = new Html5Qrcode('qr-reader');
        qrScannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 240, height: 240 },
            aspectRatio: 1.0
          },
          (decodedText) => {
            // QR decoded successfully
            handleQrCodeScanned(decodedText);
          },
          () => {
            // parsing errors are normal while scanning
          }
        );
      } catch (err: any) {
        console.warn('Camera scanner start error:', err);
        setScannerError('មិនអាចបើកកាមេរ៉ាបានទេ។ សូមពិនិត្យការអនុញ្ញាត (Camera Permission) ឬបញ្ចូលលេខ PIN ជំនួសវិញ។');
      }
    }, 200);
  };

  const stopQrScanner = async () => {
    if (qrScannerRef.current) {
      try {
        await qrScannerRef.current.stop();
        qrScannerRef.current.clear();
      } catch {
        // ignore
      }
      qrScannerRef.current = null;
    }
    setIsScannerOpen(false);
    setScannerError('');
  };

  const handleQrCodeScanned = (scannedText: string) => {
    triggerHaptic([50, 50, 50]);
    stopQrScanner();

    let extractedSession = scannedText.trim().toUpperCase();

    // Check if it is a full URL containing ?remote=KM-xxxx
    if (scannedText.includes('remote=') || scannedText.includes('session=')) {
      try {
        const url = new URL(scannedText);
        extractedSession = url.searchParams.get('remote') || url.searchParams.get('session') || extractedSession;
      } catch {
        const match = scannedText.match(/(?:remote|session)=([A-Z0-9_-]+)/i);
        if (match && match[1]) {
          extractedSession = match[1].toUpperCase();
        }
      }
    }

    if (extractedSession) {
      setSessionId(extractedSession);
      setInputSession(extractedSession);
      if (onShowToast) onShowToast(`📷 ស្កែនបាន Session: ${extractedSession}`);
    }
  };

  // Subscribe to session state
  useEffect(() => {
    if (!sessionId) {
      setIsConnected(false);
      return;
    }

    const unsubscribe = subscribeToSlideSession(sessionId, (state) => {
      if (state) {
        setSessionState(state);
        setIsConnected(true);
      }
    });

    // Notify host that phone has joined
    sendRemoteCommand(sessionId, 'PHONE_JOINED', { timestamp: Date.now() });

    // Fallback: If no state received after 1.5s, provide mock default state so teacher can still control immediately
    const timer = setTimeout(() => {
      setSessionState((prev) => {
        if (!prev) {
          setIsConnected(true);
          return {
            sessionId: sessionId,
            lessonId: 'khmer_poem_1',
            lessonTitle: 'ភាសាខ្មែរ៖ កំណាព្យសិក្សាអាន និងស្វែងយល់',
            currentSlideIndex: 0,
            totalSlides: 10,
            activeStepPoint: 1,
            totalPoints: 5,
            slideTitle: 'ជំហានទី ១៖ ការណែនាំនិងការបំផុសគំនិត',
            stepBadge: 'ជំហានទី ១ (៥ ជំហានបង្រៀន)',
            fontSizeMode: 'normal',
            showTeacherNotes: true,
            drawMode: false,
            timerSeconds: 180,
            timerActive: false,
            soundEnabled: true,
            phoneConnected: true,
            revealedKeys: {}
          };
        }
        return prev;
      });
    }, 1500);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [sessionId]);

  // Haptic feedback helper
  const triggerHaptic = (pattern: number | number[] = 35) => {
    try {
      if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    } catch {
      // ignore
    }
  };

  const dispatch = (commandType: string, payload?: any) => {
    if (!sessionId) return;
    triggerHaptic(40);
    setLastCommandSent(commandType);
    sendRemoteCommand(sessionId, commandType, payload);
    if (onShowToast) {
      // optional toast
    }
  };

  // Connect to entered session
  const handleConnectSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputSession.trim()) {
      if (onShowToast) onShowToast('សូមបញ្ចូលលេខកូដ Session PIN');
      return;
    }
    const cleanId = inputSession.trim().toUpperCase();
    setSessionId(cleanId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('last_remote_session_id', cleanId);
    }
    if (onShowToast) onShowToast(`កំពុងភ្ជាប់ទៅកាន់ ${cleanId}...`);
  };

  const disconnectSession = () => {
    setSessionId('');
    setSessionState(null);
    setIsConnected(false);
  };

  // ================= NOT CONNECTED VIEW (PIN & QR SCANNER & DISCOVERY) =================
  if (!sessionId) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 flex flex-col justify-between max-w-lg mx-auto relative overflow-hidden">
        {/* Top Header */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onExit}
              className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-bold active:scale-95"
            >
              <Home className="w-4 h-4 text-amber-400" />
              <span>ត្រឡប់ទៅផ្ទាំងដើម (Home)</span>
            </button>

            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-full text-[11px] font-mono font-bold flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 animate-pulse text-amber-400" />
              <span>SMART REMOTE</span>
            </span>
          </div>

          <div className="text-center space-y-2 py-2">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 mx-auto flex items-center justify-center shadow-xl shadow-amber-500/20">
              <Smartphone className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white">តេឡេបញ្ជាស្លាយពីទូរស័ព្ទ</h1>
            <p className="text-xs text-slate-400 leading-relaxed px-4">
              ស្កែន QR កូដ ឬបញ្ចូលលេខកូដ Session PIN ដែលបង្ហាញលើស្លាយ PC ដើម្បីបញ្ជាពីចម្ងាយ
            </p>
          </div>

          {/* QR Scanner Big Action Button */}
          <button
            type="button"
            onClick={startQrScanner}
            className="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black rounded-3xl transition shadow-xl shadow-amber-500/25 active:scale-98 flex items-center justify-center gap-3 border-2 border-amber-200"
          >
            <Camera className="w-5 h-5 text-slate-950" />
            <span className="text-sm sm:text-base">📷 បើកកាមេរ៉ាស្កែន QR កូដ (Scan QR)</span>
          </button>

          {/* Active Sessions Auto-Discovery */}
          {activeSessions.length > 0 && (
            <div className="bg-slate-900/90 border-2 border-emerald-500/50 rounded-3xl p-4 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-black text-emerald-300">
                    រកឃើញស្លាយកំពុងចាក់លើ PC ({activeSessions.length})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={refreshActiveSessions}
                  className="p-1 text-slate-400 hover:text-white"
                  title="Refresh"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingSessions ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="space-y-2">
                {activeSessions.map((act) => (
                  <div
                    key={act.sessionId}
                    className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-2 hover:border-emerald-400 transition"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-amber-400 text-xs bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-400/20">
                          {act.sessionId}
                        </span>
                        <span className="text-[11px] text-slate-400 font-bold truncate">
                          ស្លាយ {act.currentSlideIndex + 1}/{act.totalSlides}
                        </span>
                      </div>
                      <h4 className="text-xs font-black text-white truncate">{act.lessonTitle}</h4>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSessionId(act.sessionId);
                        setInputSession(act.sessionId);
                        if (onShowToast) onShowToast(`កំពុងភ្ជាប់ទៅ ${act.sessionId}...`);
                      }}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition shrink-0 flex items-center gap-1 shadow-md shadow-emerald-500/20"
                    >
                      <span>ភ្ជាប់បញ្ជា</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Manual PIN Code Form */}
          <form onSubmit={handleConnectSession} className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-3.5 text-left">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-300">
                ឬបញ្ចូលលេខកូដសម្គាល់បន្ទប់ (Session PIN)
              </label>
              <span className="text-[10px] font-mono text-amber-400">ឧ. KM-8899</span>
            </div>

            <div className="relative">
              <input
                type="text"
                required
                value={inputSession}
                onChange={(e) => setInputSession(e.target.value.toUpperCase())}
                placeholder="KM-0000"
                className="w-full text-center font-mono font-black text-2xl tracking-widest py-3.5 bg-slate-950 border-2 border-slate-700 rounded-2xl focus:border-amber-400 focus:outline-none text-white uppercase placeholder:text-slate-600"
              />
            </div>

            {/* Quick Helper Keypad / Prefix Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setInputSession('KM-')}
                className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono text-xs font-bold rounded-xl border border-slate-700 transition"
              >
                + KM-
              </button>
              {localStorage.getItem('last_remote_session_id') && (
                <button
                  type="button"
                  onClick={() => setInputSession(localStorage.getItem('last_remote_session_id') || '')}
                  className="flex-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 transition truncate px-2"
                >
                  ចុងក្រោយ៖ {localStorage.getItem('last_remote_session_id')}
                </button>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-black rounded-2xl transition active:scale-98 flex items-center justify-center gap-2 text-sm shadow-md"
            >
              <span>ភ្ជាប់ជាតេឡេបញ្ជា (Connect)</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="pt-4 text-center text-[11px] text-slate-500 font-medium">
          ក្រសួងអប់រំ យុវជន និងកីឡា • ប្រព័ន្ធស្លាយបង្រៀនអន្តរកម្ម
        </div>

        {/* Camera QR Scanner Fullscreen Modal */}
        <AnimatePresence>
          {isScannerOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-black text-sm">
                  <Camera className="w-5 h-5 text-amber-400" />
                  <span>ស្កែន QR កូដលើអេក្រង់ស្លាយ PC</span>
                </div>
                <button
                  type="button"
                  onClick={stopQrScanner}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-2xl transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Viewport for html5-qrcode */}
              <div className="my-auto space-y-4">
                <div className="relative mx-auto max-w-xs overflow-hidden rounded-3xl border-4 border-amber-400/80 shadow-2xl bg-black aspect-square flex items-center justify-center">
                  <div id="qr-reader" className="w-full h-full" />
                </div>

                {scannerError && (
                  <div className="p-3 bg-rose-950/80 border border-rose-500/50 rounded-2xl text-xs text-rose-300 text-center max-w-xs mx-auto">
                    {scannerError}
                  </div>
                )}

                <p className="text-xs text-slate-400 text-center">
                  ដាក់កាមេរ៉ាឱ្យចំ QR កូដដែលបង្ហាញលើស្លាយកុំព្យូទ័រ PC
                </p>
              </div>

              <button
                type="button"
                onClick={stopQrScanner}
                className="w-full py-3 bg-slate-800 text-slate-300 hover:text-white font-bold rounded-2xl text-xs transition"
              >
                បិទកាមេរ៉ា (Close)
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ================= CONNECTED CONTROLLER VIEW =================
  const state = sessionState || {
    sessionId: sessionId,
    lessonId: '',
    lessonTitle: 'ភាសាខ្មែរ',
    currentSlideIndex: 0,
    totalSlides: 10,
    activeStepPoint: 0,
    totalPoints: 3,
    slideTitle: 'ស្លាយបង្រៀន',
    stepBadge: '',
    fontSizeMode: 'normal' as const,
    showTeacherNotes: true,
    drawMode: false,
    timerSeconds: 0,
    timerActive: false,
    soundEnabled: true,
    phoneConnected: true,
    revealedKeys: {}
  };

  const progressPercent = Math.round(((state.currentSlideIndex + 1) / (state.totalSlides || 1)) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between max-w-lg mx-auto select-none overflow-hidden pb-6">
      {/* ================= TOP STATUS BAR ================= */}
      <header className="px-4 py-3 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={disconnectSession}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1 active:scale-95"
            title="ប្តូរបន្ទប់"
          >
            <ChevronLeft className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-amber-300">{sessionId}</span>
          </button>

          {isConnected ? (
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>បានភ្ជាប់ (Live)</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-500/30">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>កំពុងភ្ជាប់...</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowNotesDrawer(true)}
            className="p-2 bg-purple-950/60 border border-purple-400/40 text-purple-300 hover:text-white rounded-xl transition flex items-center gap-1 text-xs font-bold active:scale-95"
            title="កំណត់សម្គាល់គ្រូ"
          >
            <Lightbulb className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline">កំណត់សម្គាល់</span>
          </button>

          <button
            type="button"
            onClick={onExit}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition text-xs font-bold"
            title="ផ្ទាំងដើម"
          >
            <Home className="w-4 h-4 text-slate-300" />
          </button>
        </div>
      </header>

      {/* ================= CURRENT SLIDE OVERVIEW CARD ================= */}
      <main className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-amber-400 font-mono">
              ស្លាយទី {state.currentSlideIndex + 1} នៃ {state.totalSlides}
            </span>
            <span className="text-slate-400 font-mono">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* View Mode Switcher: Controls vs Screen Mirroring */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl">
          <button
            type="button"
            onClick={() => setViewMode('control')}
            className={`py-2 px-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-1.5 ${
              viewMode === 'control'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🎛️ ប៊ូតុងបញ្ជា</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('mirror')}
            className={`py-2 px-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-1.5 ${
              viewMode === 'mirror'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>📺 មើលអេក្រង់ផ្ទាល់ (Mirror)</span>
          </button>
        </div>

        {/* ================= CONDITIONAL: SCREEN MIRRORING VIEW VS CONTROLS ================= */}
        {viewMode === 'mirror' ? (
          <div className="space-y-4 animate-fadeIn">
            {/* Live PC Mirror Container */}
            <div className="p-5 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 border-amber-400/50 rounded-3xl space-y-4 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-black text-emerald-300 uppercase tracking-wider">PC Screen Mirroring (Live)</span>
                </div>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  {state.sessionId}
                </span>
              </div>

              {/* Slide Header */}
              <div className="space-y-1.5">
                {state.stepBadge && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/25 text-amber-300 border border-amber-400/40 text-[10px] font-bold inline-block">
                    {state.stepBadge}
                  </span>
                )}
                <h3 className="text-lg font-black text-white leading-snug">
                  {state.slideTitle || state.lessonTitle}
                </h3>
              </div>

              {/* Active Step Point Indicator */}
              <div className="p-3 bg-amber-950/40 border border-amber-400/30 rounded-2xl flex items-center justify-between">
                <span className="text-xs font-bold text-amber-200">ចំណុចកំពុងបង្ហាញលើ PC៖</span>
                <span className="font-mono text-xs font-black text-amber-400 bg-slate-950 px-2.5 py-1 rounded-xl border border-amber-500/30">
                  ចំណុចទី {state.activeStepPoint || 1} / {state.totalPoints || 3}
                </span>
              </div>

              {/* Slide Content Mirror Details */}
              {state.slideContent && (
                <div className="space-y-3 pt-2 text-xs">
                  {/* Objectives Mirror */}
                  {state.slideContent.objectives && (
                    <div className="space-y-2">
                      <p className="text-amber-300 font-bold">🎯 គោលបំណងមេរៀន៖</p>
                      {state.activeStepPoint >= 1 && state.slideContent.objectives.knowledge && (
                        <div className="p-2.5 bg-blue-950/60 border border-blue-400/30 rounded-xl text-blue-100">
                          <span className="font-bold">១. វិជ្ជាសម្បទា៖ </span>{state.slideContent.objectives.knowledge}
                        </div>
                      )}
                      {state.activeStepPoint >= 2 && state.slideContent.objectives.skill && (
                        <div className="p-2.5 bg-purple-950/60 border border-purple-400/30 rounded-xl text-purple-100">
                          <span className="font-bold">២. បំណិនសម្បទា៖ </span>{state.slideContent.objectives.skill}
                        </div>
                      )}
                      {state.activeStepPoint >= 3 && state.slideContent.objectives.attitude && (
                        <div className="p-2.5 bg-pink-950/60 border border-pink-400/30 rounded-xl text-pink-100">
                          <span className="font-bold">៣. ចរិយាសម្បទា៖ </span>{state.slideContent.objectives.attitude}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Vocabulary Mirror */}
                  {state.slideContent.vocabList && state.slideContent.vocabList.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-amber-300 font-bold">📖 ពាក្យគន្លឹះ (Vocabulary):</p>
                      {state.slideContent.vocabList.map((vocab: any, idx: number) => (
                        <div key={idx} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                          <span className="font-bold text-amber-300 text-sm">{vocab.word}</span>
                          <span className="text-slate-300">{vocab.meaning}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Poem / Reading Mirror */}
                  {state.slideContent.poemLines && state.slideContent.poemLines.length > 0 && (
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5 text-center">
                      <p className="text-amber-300 font-bold mb-2">📜 អត្ថបទកំណាព្យ៖</p>
                      {state.slideContent.poemLines.map((line: string, idx: number) => (
                        <p key={idx} className="text-slate-200 font-serif">{line}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Prompt Question Mirror */}
              {state.promptQuestion && (
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                  <span className="font-bold text-amber-400 text-xs">❓ សំណួរពិភាក្សា៖</span>
                  <p className="text-slate-200 text-xs">{state.promptQuestion}</p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setViewMode('control')}
              className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs rounded-2xl border border-slate-700 transition"
            >
              ត្រឡប់ទៅផ្ទាំងបញ្ជាវិញ (Back to Controls)
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-slate-900 border-2 border-amber-400/30 rounded-3xl space-y-2 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              {state.stepBadge && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold inline-block">
                  {state.stepBadge}
                </span>
              )}

              <h2 className="text-base sm:text-lg font-black text-white leading-snug">
                {state.slideTitle || state.lessonTitle}
              </h2>

              {state.promptQuestion && (
                <div className="p-2.5 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs text-amber-200">
                  <span className="font-bold text-amber-400">❓ សំណួរ៖ </span>
                  {state.promptQuestion}
                </div>
              )}

              {/* Point animation status */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400 font-bold">
                  ចំណុចបង្ហាញ ៖{' '}
                  <span className="text-amber-400 font-mono font-black">
                    {state.activeStepPoint || 0} / {state.totalPoints || 3}
                  </span>
                </span>
                {lastCommandSent && (
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-500/30">
                    ⚡ {lastCommandSent}
                  </span>
                )}
              </div>
            </div>

            {/* ================= PRIMARY THUMB CONTROLS (NEXT / PREV / STEP) ================= */}
            <div className="space-y-3">
              {/* Main Huge Next / Point Trigger */}
              <button
                type="button"
                onClick={() => dispatch('NEXT_POINT')}
                className="w-full py-5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black rounded-3xl shadow-xl shadow-amber-500/25 active:scale-95 transition flex items-center justify-center gap-3 border-2 border-amber-200"
              >
                <Zap className="w-6 h-6 text-slate-950 fill-slate-950" />
                <span className="text-lg">បង្ហាញចំណុចបន្ទាប់ (Step / Next)</span>
              </button>

              {/* Previous Slide / Next Slide Split Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => dispatch('PREV_SLIDE')}
                  disabled={state.currentSlideIndex === 0}
                  className="py-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white font-black rounded-2xl border border-slate-700 transition active:scale-95 flex items-center justify-center gap-2 text-sm shadow-md"
                >
                  <ChevronLeft className="w-5 h-5 text-amber-400" />
                  <span>ស្លាយមុន</span>
                </button>

                <button
                  type="button"
                  onClick={() => dispatch('NEXT_SLIDE')}
                  disabled={state.currentSlideIndex === (state.totalSlides - 1)}
                  className="py-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-amber-300 font-black rounded-2xl border border-amber-400/40 transition active:scale-95 flex items-center justify-center gap-2 text-sm shadow-md"
                >
                  <span>ស្លាយបន្ទាប់</span>
                  <ChevronRight className="w-5 h-5 text-amber-400" />
                </button>
              </div>
            </div>

            {/* ================= QUICK CLASSROOM TOOLKIT (TIMER / SOUND / REVEAL) ================= */}
            <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-3">
              <div className="text-xs font-bold text-slate-400 flex items-center justify-between">
                <span>ឧបករណ៍ជំនួយគរុកោសល្យ (Teacher Toolkit)</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* Reveal All Points */}
                <button
                  type="button"
                  onClick={() => dispatch('REVEAL_ALL_POINTS')}
                  className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl border border-slate-700 flex flex-col items-center justify-center gap-1.5 transition active:scale-95"
                >
                  <Eye className="w-4 h-4 text-cyan-400" />
                  <span className="text-[11px] font-bold text-slate-200">បង្ហាញទាំងអស់</span>
                </button>

                {/* Cheer Sound */}
                <button
                  type="button"
                  onClick={() => dispatch('PLAY_SOUND', { sound: 'cheer' })}
                  className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl border border-slate-700 flex flex-col items-center justify-center gap-1.5 transition active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-[11px] font-bold text-slate-200">ទះដៃលើកទឹកចិត្ត</span>
                </button>

                {/* Bell Sound */}
                <button
                  type="button"
                  onClick={() => dispatch('PLAY_SOUND', { sound: 'bell' })}
                  className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl border border-slate-700 flex flex-col items-center justify-center gap-1.5 transition active:scale-95"
                >
                  <Bell className="w-4 h-4 text-emerald-400" />
                  <span className="text-[11px] font-bold text-slate-200">កណ្តឹងសញ្ញា</span>
                </button>

                {/* Toggle Pen Tool */}
                <button
                  type="button"
                  onClick={() => dispatch('TOGGLE_DRAW')}
                  className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl border border-slate-700 flex flex-col items-center justify-center gap-1.5 transition active:scale-95"
                >
                  <PenTool className="w-4 h-4 text-purple-400" />
                  <span className="text-[11px] font-bold text-slate-200">ប៊ិចគូសលើស្លាយ</span>
                </button>
              </div>

              {/* Quick Timer Triggers */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>ម៉ោងរាប់ថយ ៖</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => dispatch('START_TIMER', { seconds: 60 })}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-300 font-bold rounded-xl border border-slate-700 text-xs transition active:scale-95"
                  >
                    ១ នាទី
                  </button>
                  <button
                    type="button"
                    onClick={() => dispatch('START_TIMER', { seconds: 180 })}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-300 font-bold rounded-xl border border-slate-700 text-xs transition active:scale-95"
                  >
                    ៣ នាទី
                  </button>
                  <button
                    type="button"
                    onClick={() => dispatch('RESET_TIMER')}
                    className="p-1.5 bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white rounded-xl border border-slate-700 text-xs transition active:scale-95"
                    title="Reset Timer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= SPEAKER NOTES SLIDE-OVER DRAWER ================= */}
      <AnimatePresence>
        {showNotesDrawer && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col justify-end">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-slate-900 border-t-2 border-purple-500/50 rounded-t-3xl p-5 space-y-4 max-h-[80vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-300 font-black text-sm">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                  <span>កំណត់សម្គាល់គ្រូ (Speaker Notes)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNotesDrawer(false)}
                  className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-purple-500/30 text-slate-200 text-xs sm:text-sm leading-relaxed space-y-2">
                <p>{state.teacherNotes || 'គ្មានកំណត់សម្គាល់ពិសេសសម្រាប់ស្លាយនេះទេ។'}</p>
                {state.promptAnswer && (
                  <div className="pt-2 border-t border-slate-800 text-emerald-300 font-bold text-xs">
                    {state.promptAnswer}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowNotesDrawer(false)}
                className="w-full py-3 bg-purple-900 hover:bg-purple-800 text-white font-bold rounded-2xl text-xs transition"
              >
                យល់ព្រម (Close)
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
