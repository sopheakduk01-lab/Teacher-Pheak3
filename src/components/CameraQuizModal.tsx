import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, Trophy, Sparkles, RefreshCw, Camera, Volume2, VolumeX, Maximize2, 
  Settings, RotateCcw, ChevronRight, Play, CheckCircle2, Info, User,
  Gamepad2, Layers, Cpu, Globe, Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Quiz } from '../types';
import confetti from 'canvas-confetti';

interface Question {
  text: string;
  optA: string;
  optB: string;
  correct: 'A' | 'B';
}

interface CameraQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
  initialQuizzes?: Quiz[];
}

const DEFAULT_QUESTIONS: Question[] = [
  {
    text: "តើផ្នែករឹងណាមួយ (Hardware) ដែលចាត់ទុកជា «ខួរក្បាល» នៃកុំព្យូទ័រ?",
    optA: "RAM (Memory)",
    optB: "CPU (Processor)",
    correct: "B"
  },
  {
    text: "តើភាសា HTML ត្រូវបានប្រើប្រាស់ចម្បងសម្រាប់បង្កើតអ្វី?",
    optA: "គេហទំព័រ (Website)",
    optB: "ប្រព័ន្ធប្រតិបត្តិការ (OS)",
    correct: "A"
  },
  {
    text: "តើ 1 Gigabyte (GB) ស្មើនឹងប៉ុន្មាន Megabytes (MB)?",
    optA: "1,024 MB",
    optB: "1,000 MB",
    correct: "A"
  }
];

class SoundFx {
  ctx: AudioContext | null = null;
  enabled: boolean = true;

  init() {
    try {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    } catch (e) {}
  }

  playTone(freq: number, type: OscillatorType = 'sine', duration = 0.1, vol = 0.25) {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  playTick(urgent = false) {
    this.playTone(urgent ? 920 : 520, urgent ? 'triangle' : 'sine', 0.08, 0.2);
  }

  playVictory() {
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.3, 0.35), idx * 90);
    });
  }

  playVote(isA = true) {
    this.playTone(isA ? 480 : 620, 'sine', 0.07, 0.2);
  }

  playSwitch() {
    this.playTone(880, 'square', 0.15, 0.15);
  }
}

const sfx = new SoundFx();

export const CameraQuizModal: React.FC<CameraQuizModalProps> = ({
  isOpen,
  onClose,
  studentName = 'សិស្ស',
  initialQuizzes = []
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageCanvasRef = useRef<HTMLCanvasElement>(null);
  const motionCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const [questions, setQuestions] = useState<Question[]>(DEFAULT_QUESTIONS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'revealed'>('idle');
  const [timeLeft, setTimeLeft] = useState(10);
  const [roundDuration, setRoundDuration] = useState(10);
  const [cameraActive, setCameraActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [smoothedA, setSmoothedA] = useState(15);
  const [smoothedB, setSmoothedB] = useState(15);
  
  const gameRef = useRef({
    smoothedA: 15,
    smoothedB: 15,
    particles: [] as any[],
    prevFrame: null as Uint8ClampedArray | null,
    cameraStream: null as MediaStream | null,
    isRevealed: false
  });

  const loadQuestion = useCallback((idx: number) => {
    sfx.playSwitch();
    setCurrentIdx((idx + questions.length) % questions.length);
    setTimeLeft(roundDuration);
    setGameState('playing');
    gameRef.current.isRevealed = false;
  }, [questions.length, roundDuration]);

  const initCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      gameRef.current.cameraStream = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err) {
      console.warn('Camera failed:', err);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (gameRef.current.cameraStream) {
      gameRef.current.cameraStream.getTracks().forEach(t => t.stop());
      gameRef.current.cameraStream = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraActive(false);
  };

  useEffect(() => {
    if (!isOpen) return;
    sfx.init();
    initCamera();
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  useEffect(() => {
    if (gameState !== 'playing' || !isOpen) return;
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setGameState('revealed');
          gameRef.current.isRevealed = true;
          sfx.playVictory();
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#34d399', '#38bdf8', '#fbbf24']
          });
          return 0;
        }
        sfx.playTick(prev <= 4);
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [gameState, isOpen]);

  // Motion Detection Loop
  useEffect(() => {
    if (!isOpen) return;
    
    const motionCanvas = motionCanvasRef.current;
    if (!motionCanvas) return;
    motionCanvas.width = 160;
    motionCanvas.height = 120;
    const motionCtx = motionCanvas.getContext('2d', { willReadFrequently: true });
    
    let simulatedTime = 0;
    let animationId: number;

    const loop = () => {
      const g = gameRef.current;
      const ctx = stageCanvasRef.current?.getContext('2d');
      if (!ctx || !motionCtx) return;

      simulatedTime += 0.03;
      const canvasW = stageCanvasRef.current!.width;
      const canvasH = stageCanvasRef.current!.height;

      if (cameraActive && videoRef.current?.readyState === videoRef.current?.HAVE_ENOUGH_DATA) {
        motionCtx.drawImage(videoRef.current, 0, 0, motionCanvas.width, motionCanvas.height);
        const curr = motionCtx.getImageData(0, 0, motionCanvas.width, motionCanvas.height);
        const data = curr.data;

        if (g.prevFrame) {
          let leftDiff = 0, rightDiff = 0;
          const mid = motionCanvas.width / 2;
          for (let y = 0; y < motionCanvas.height; y += 4) {
            for (let x = 0; x < motionCanvas.width; x += 4) {
              const idx = (y * motionCanvas.width + x) * 4;
              const d = (Math.abs(data[idx] - g.prevFrame[idx]) + Math.abs(data[idx+1] - g.prevFrame[idx+1]) + Math.abs(data[idx+2] - g.prevFrame[idx+2])) / 3;
              if (d > 25) {
                if (x >= mid) {
                  leftDiff += d;
                  if (Math.random() < 0.1) g.particles.push({ x: (1 - (x / motionCanvas.width)) * canvasW, y: (y / motionCanvas.height) * canvasH, vx: (Math.random() - 0.5) * 6, vy: -Math.random() * 4 - 2, size: Math.random() * 6 + 2, alpha: 1, color: '#38bdf8' });
                } else {
                  rightDiff += d;
                  if (Math.random() < 0.1) g.particles.push({ x: (1 - (x / motionCanvas.width)) * canvasW, y: (y / motionCanvas.height) * canvasH, vx: (Math.random() - 0.5) * 6, vy: -Math.random() * 4 - 2, size: Math.random() * 6 + 2, alpha: 1, color: '#fbbf24' });
                }
              }
            }
          }
          g.smoothedA = g.smoothedA * 0.85 + Math.min(100, (leftDiff / 3200) * 100) * 0.15;
          g.smoothedB = g.smoothedB * 0.85 + Math.min(100, (rightDiff / 3200) * 100) * 0.15;
        }
        g.prevFrame = data;
      } else {
        const waveA = Math.sin(simulatedTime * 2.5) * 25 + 30;
        const waveB = Math.cos(simulatedTime * 2.3) * 25 + 30;
        g.smoothedA = Math.max(5, Math.min(95, g.smoothedA * 0.96 + waveA * 0.04));
        g.smoothedB = Math.max(5, Math.min(95, g.smoothedB * 0.96 + waveB * 0.04));
      }

      setSmoothedA(g.smoothedA);
      setSmoothedB(g.smoothedB);

      ctx.clearRect(0, 0, canvasW, canvasH);
      
      // Mirror Line Effect
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.setLineDash([5, 15]);
      ctx.beginPath();
      ctx.moveTo(canvasW / 2, 0);
      ctx.lineTo(canvasW / 2, canvasH);
      ctx.stroke();
      ctx.setLineDash([]);

      if (!cameraActive) {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.06)';
        ctx.beginPath(); ctx.arc(canvasW * 0.25, canvasH * 0.6, 150 + Math.sin(simulatedTime) * 20, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(245, 158, 11, 0.06)';
        ctx.beginPath(); ctx.arc(canvasW * 0.75, canvasH * 0.6, 150 + Math.cos(simulatedTime) * 20, 0, Math.PI * 2); ctx.fill();
      }

      for (let i = g.particles.length - 1; i >= 0; i--) {
        const p = g.particles[i];
        p.x += p.vx; p.y += p.vy; p.alpha -= 0.02;
        if (p.alpha <= 0) { g.particles.splice(i, 1); continue; }
        ctx.save(); 
        ctx.globalAlpha = Math.max(0, p.alpha); 
        ctx.fillStyle = p.color; 
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); 
        ctx.restore();
      }

      animationId = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(animationId);
  }, [isOpen, cameraActive]);

  useEffect(() => {
    const handleResize = () => {
      if (stageCanvasRef.current) {
        stageCanvasRef.current.width = window.innerWidth;
        stageCanvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTap = (isA: boolean) => {
    sfx.init();
    sfx.playVote(isA);
    if (isA) gameRef.current.smoothedA = Math.min(100, gameRef.current.smoothedA + 35);
    else gameRef.current.smoothedB = Math.min(100, gameRef.current.smoothedB + 35);
  };

  const handleSourceSelect = (quiz: Quiz) => {
    const newQs: Question[] = quiz.questions.map(q => ({
      text: q.question,
      optA: q.options[0]?.text || '?',
      optB: q.options[1]?.text || '?',
      correct: (q.options[0]?.isCorrect ? 'A' : 'B') as 'A' | 'B'
    })).slice(0, 15);
    setQuestions(newQs);
    setCurrentIdx(0);
    loadQuestion(0);
    setIsSettingsOpen(false);
  };

  if (!isOpen) return null;

  const currentQ = questions[currentIdx];
  const isCorrectA = currentQ?.correct === 'A';

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-slate-950 font-kantumruy select-none">
      <AnimatePresence>
        {/* BACKGROUND ARENA */}
        <div className="absolute inset-0 pointer-events-none">
          <video ref={videoRef} className="w-full h-full object-cover scale-x-[-1] opacity-90 transition-opacity duration-1000" autoPlay playsInline muted />
          <canvas ref={stageCanvasRef} className="absolute inset-0 w-full h-full scale-x-[-1]" />
          <canvas ref={motionCanvasRef} className="hidden" />
          
          {/* Laser Divider */}
          <div className="absolute top-0 bottom-0 left-1/2 w-1.5 bg-gradient-to-b from-sky-400 via-indigo-500 to-amber-400 opacity-60 shadow-[0_0_25px_rgba(56,189,248,1)] animate-pulse" />
          
          {/* Zone Glows */}
          <div className="absolute inset-y-0 left-0 w-1/2 transition-colors duration-500" style={{ backgroundColor: `rgba(59, 130, 246, ${Math.min(0.25, smoothedA / 250)})` }} />
          <div className="absolute inset-y-0 right-0 w-1/2 transition-colors duration-500" style={{ backgroundColor: `rgba(245, 158, 11, ${Math.min(0.25, smoothedB / 250)})` }} />

          {/* Letter Markers */}
          <div className="absolute top-1/2 left-[15%] -translate-y-1/2 text-[15rem] font-black text-blue-500/5 opacity-40">A</div>
          <div className="absolute top-1/2 right-[15%] -translate-y-1/2 text-[15rem] font-black text-amber-500/5 opacity-40">B</div>
        </div>

        {/* TOP HUD */}
        <header className="relative z-30 p-4 sm:p-6 flex flex-col items-center gap-4 sm:gap-6">
          <div className="w-full max-w-6xl flex items-center justify-between gap-3">
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-2">
              <div className="bg-slate-900/90 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-bold shadow-2xl">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-emerald-50 text-shadow-sm uppercase tracking-wider">សំណួរ {currentIdx + 1} / {questions.length}</span>
              </div>
              <button onClick={() => cameraActive ? stopCamera() : initCamera()} className={`p-3 rounded-2xl border transition-all duration-300 ${cameraActive ? 'bg-emerald-600/30 border-emerald-400/50 text-emerald-400' : 'bg-slate-900/80 border-white/10 text-slate-400'}`}>
                <Camera size={20} className={cameraActive ? 'animate-pulse' : ''} />
              </button>
            </motion.div>

            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative">
              <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white/90 flex items-center justify-center shadow-[0_0_40px_rgba(225,29,72,0.6)] transition-all duration-300 ${timeLeft <= 3 ? 'bg-rose-600 animate-bounce scale-110' : 'bg-slate-900/90'}`}>
                <span className="text-3xl sm:text-4xl font-black font-mono text-white tabular-nums">{timeLeft}</span>
              </div>
              {/* Pulse Ring */}
              {timeLeft <= 3 && (
                <div className="absolute inset-0 rounded-full border-4 border-rose-500 animate-ping opacity-50" />
              )}
            </motion.div>

            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-2">
              <button onClick={() => { setSoundEnabled(!soundEnabled); sfx.enabled = !soundEnabled; }} className="bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-white shadow-xl">
                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
              <button onClick={() => setIsSettingsOpen(true)} className="bg-indigo-600 p-3 rounded-2xl border border-indigo-400/40 text-white shadow-[0_0_20px_rgba(79,70,229,0.5)]">
                <Settings size={20} />
              </button>
              <button onClick={onClose} className="bg-rose-600/20 hover:bg-rose-600 transition-colors p-3 rounded-2xl border border-rose-500/40 text-rose-400 hover:text-white">
                <X size={20} />
              </button>
            </motion.div>
          </div>

          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            key={currentIdx}
            className="w-full max-w-4xl bg-slate-900/95 backdrop-blur-2xl border-2 border-white/20 rounded-[2.5rem] p-6 sm:p-8 text-center shadow-[0_30px_100px_rgba(0,0,0,0.8)]"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1 mb-4 rounded-full bg-blue-600/20 border border-blue-400/30 text-[10px] sm:text-xs font-black text-blue-300 uppercase tracking-widest">
              <Gamepad2 size={12} /> ឈរជ្រើសរើសចម្លើយ 🏃‍♂️
            </div>
            <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-white leading-tight drop-shadow-2xl">
              {currentQ?.text}
            </h1>
          </motion.div>
        </header>

        {/* CLICKABLE INTERACTIVE ZONES */}
        <div className="absolute inset-0 z-10 flex">
          <div onClick={() => handleTap(true)} className="flex-1 cursor-pointer group relative">
            <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors duration-300" />
          </div>
          <div onClick={() => handleTap(false)} className="flex-1 cursor-pointer group relative">
            <div className="absolute inset-0 bg-amber-600/0 group-hover:bg-amber-600/5 transition-colors duration-300" />
          </div>
        </div>

        {/* BOTTOM OPTION CARDS */}
        <footer className="absolute bottom-6 left-0 w-full p-4 sm:p-8 flex flex-col items-center gap-6 z-30">
          <div className="w-full max-w-6xl flex flex-col sm:flex-row gap-4 sm:gap-8">
            {/* OPTION A */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className={`flex-1 bg-gradient-to-br from-blue-900/90 to-indigo-950/90 backdrop-blur-2xl border-4 rounded-[2rem] p-5 sm:p-6 transition-all duration-500 shadow-2xl relative overflow-hidden ${
                gameState === 'revealed' 
                  ? (isCorrectA ? 'border-emerald-400 shadow-[0_0_60px_rgba(16,185,129,0.6)] scale-105' : 'border-slate-800 opacity-30 grayscale scale-95') 
                  : 'border-blue-400/60'
              }`}
            >
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500 border-2 border-white/40 rounded-2xl flex items-center justify-center font-black text-2xl sm:text-3xl text-white shadow-lg">A</div>
                <div className="text-left flex-1">
                  <div className="text-[10px] sm:text-xs text-blue-300 font-black uppercase tracking-widest mb-0.5">ខាងឆ្វេង (LEFT)</div>
                  <div className="text-lg sm:text-2xl font-black text-white leading-tight break-words">{currentQ?.optA}</div>
                </div>
              </div>
              <div className="relative h-3 bg-black/50 rounded-full overflow-hidden border border-blue-400/20">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${smoothedA}%` }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.8)]"
                />
              </div>
              <div className="mt-2 text-right text-[10px] font-mono text-cyan-400 font-bold">{Math.round(smoothedA)}% គាំទ្រ</div>
            </motion.div>

            {/* OPTION B */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className={`flex-1 bg-gradient-to-br from-amber-900/90 to-orange-950/90 backdrop-blur-2xl border-4 rounded-[2rem] p-5 sm:p-6 transition-all duration-500 shadow-2xl relative overflow-hidden ${
                gameState === 'revealed' 
                  ? (!isCorrectA ? 'border-emerald-400 shadow-[0_0_60px_rgba(16,185,129,0.6)] scale-105' : 'border-slate-800 opacity-30 grayscale scale-95') 
                  : 'border-amber-400/60'
              }`}
            >
              <div className="flex items-center justify-end gap-4 mb-4 relative z-10 text-right">
                <div className="flex-1">
                  <div className="text-[10px] sm:text-xs text-amber-300 font-black uppercase tracking-widest mb-0.5">ខាងស្ដាំ (RIGHT)</div>
                  <div className="text-lg sm:text-2xl font-black text-white leading-tight break-words">{currentQ?.optB}</div>
                </div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-500 border-2 border-white/40 rounded-2xl flex items-center justify-center font-black text-2xl sm:text-3xl text-white shadow-lg">B</div>
              </div>
              <div className="relative h-3 bg-black/50 rounded-full overflow-hidden border border-amber-400/20">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${smoothedB}%` }}
                  className="h-full bg-gradient-to-l from-yellow-500 to-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)] ml-auto"
                />
              </div>
              <div className="mt-2 text-left text-[10px] font-mono text-amber-400 font-bold">{Math.round(smoothedB)}% គាំទ្រ</div>
            </motion.div>
          </div>

          <div className="flex gap-4">
            <button onClick={() => loadQuestion(currentIdx)} className="bg-slate-800/90 hover:bg-slate-700 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-3 border border-slate-600 transition shadow-xl active:scale-95 group">
              <RotateCcw size={18} className="group-active:rotate-180 transition-transform duration-500" /> សាកល្បងម្ដងទៀត
            </button>
            <button onClick={() => loadQuestion(currentIdx + 1)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-12 py-3 rounded-2xl font-black flex items-center gap-3 shadow-[0_10px_30px_rgba(16,185,129,0.4)] transition transform hover:scale-105 active:scale-95">
              សំណួរបន្ទាប់ <ChevronRight size={22} />
            </button>
          </div>
        </footer>

        {/* SETTINGS OVERLAY */}
        <AnimatePresence>
          {isSettingsOpen && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                className="bg-slate-900 border border-white/10 w-full max-w-2xl rounded-[2.5rem] p-6 sm:p-10 flex flex-col max-h-[90vh] shadow-[0_50px_100px_rgba(0,0,0,0.9)]"
              >
                <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3"><Settings className="text-indigo-400" /> រៀបចំខ្លឹមសារសំណួរ</h3>
                    <p className="text-sm text-slate-400 mt-1 uppercase tracking-wider font-bold">ជ្រើសរើសមេរៀន ឬកម្រងសំណួរកម្មវិធី</p>
                  </div>
                  <button onClick={() => setIsSettingsOpen(false)} className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-slate-400"><X /></button>
                </div>
                
                <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                  <div className="grid grid-cols-1 gap-3">
                    {initialQuizzes.map((q, qIdx) => (
                      <motion.button 
                        key={q.id} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: qIdx * 0.05 }}
                        onClick={() => handleSourceSelect(q)} 
                        className="w-full bg-slate-800/50 hover:bg-indigo-600/20 p-5 rounded-3xl text-left border border-white/5 hover:border-indigo-500/50 transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                            {q.subject?.includes('គណិត') ? <Cpu size={24} /> : q.subject?.includes('អង់គ្លេស') ? <Globe size={24} /> : <Layers size={24} />}
                          </div>
                          <div>
                            <div className="font-black text-white text-base group-hover:text-indigo-300 transition-colors">{q.title}</div>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-bold uppercase tracking-tight">
                              <span className="bg-white/5 px-2 py-0.5 rounded-md">{q.subject}</span>
                              <span>•</span>
                              <span>{q.questions.length} សំណួរ</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-2 bg-indigo-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1">
                          <Play size={18} className="text-indigo-400" />
                        </div>
                      </motion.button>
                    ))}
                    {initialQuizzes.length === 0 && (
                      <div className="text-center py-20 bg-slate-800/20 rounded-[2rem] border-2 border-dashed border-white/5">
                        <Info size={40} className="mx-auto text-slate-600 mb-4" />
                        <div className="text-slate-500 text-sm font-bold uppercase">មិនទាន់មានកម្រងសំណួរឡើយ</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-800/50 border border-white/5">
                    <div className="text-[10px] text-slate-400 font-black uppercase mb-1 flex items-center gap-1"><Monitor size={12}/> Mode</div>
                    <div className="text-xs font-bold text-white">Full-Body Motion Sensing</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-800/50 border border-white/5">
                    <div className="text-[10px] text-slate-400 font-black uppercase mb-1 flex items-center gap-1"><User size={12}/> Player</div>
                    <div className="text-xs font-bold text-white truncate">{studentName}</div>
                  </div>
                </div>

                <button onClick={() => setIsSettingsOpen(false)} className="mt-6 w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-3xl shadow-2xl transition transform active:scale-95 uppercase tracking-widest text-sm">យល់ព្រម</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* REVEAL RESULT OVERLAY */}
        <AnimatePresence>
          {gameState === 'revealed' && (
            <motion.div 
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
              className="fixed inset-0 z-40 bg-slate-950/80 flex flex-col items-center justify-center p-6 text-center"
            >
              <motion.div 
                initial={{ scale: 0.5, y: 100, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                className="bg-slate-900/90 border border-white/10 rounded-[3rem] p-8 sm:p-12 max-w-2xl w-full shadow-[0_50px_100px_rgba(0,0,0,0.8)] border-t-emerald-500/30"
              >
                <div className="text-8xl sm:text-9xl mb-6 drop-shadow-2xl">🎉</div>
                <div className="text-xs sm:text-sm font-black text-indigo-400 uppercase tracking-[0.3em] mb-3">Official Result</div>
                <h3 className="text-2xl sm:text-4xl font-black text-white mb-6">ចម្លើយត្រឹមត្រូវគឺ ជម្រើស <span className="text-emerald-400">[{currentQ?.correct}]</span></h3>
                
                <motion.div 
                  initial={{ width: 0 }} animate={{ width: '100%' }}
                  className="bg-emerald-950/50 border-2 border-emerald-400/50 p-6 sm:p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(16,185,129,0.2)] mb-10 overflow-hidden relative"
                >
                  <div className="text-xl sm:text-3xl font-black text-emerald-300 relative z-10">
                    <span className="opacity-50 mr-2">[{currentQ?.correct}]</span> {isCorrectA ? currentQ?.optA : currentQ?.optB}
                  </div>
                  {/* Decorative Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent" />
                </motion.div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={() => loadQuestion(currentIdx)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-2xl font-black border border-white/5 transition-all shadow-xl active:scale-95">សាកល្បងម្ដងទៀត</button>
                  <button onClick={() => loadQuestion(currentIdx + 1)} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black shadow-[0_10px_40px_rgba(16,185,129,0.4)] transition-all transform hover:scale-105 active:scale-95 uppercase tracking-widest">សំណួរបន្ទាប់</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </AnimatePresence>

      <style>{`
        .font-kantumruy { font-family: 'Kantumruy Pro', sans-serif; }
        .text-shadow-sm { text-shadow: 0 1px 2px rgba(0,0,0,0.5); }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
};

