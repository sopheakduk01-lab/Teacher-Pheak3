import React, { useState, useEffect, useRef } from 'react';
import { 
  Lightbulb, Volume2, VolumeX, User, Lock, Mail, IdCard, 
  ArrowRight, UserPlus, Eye, EyeOff, Check, X, ShieldCheck, 
  FileText, TriangleAlert, Info, CircleCheck
} from 'lucide-react';
import { TeacherProfile } from '../types';

interface TeacherAuthLampModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: TeacherProfile;
  onUpdateTeacher: (updated: TeacherProfile) => void;
  onShowToast: (msg: string) => void;
}

type ThemeKey = 'amber' | 'cyan' | 'violet' | 'emerald' | 'rose';

const themes: Record<ThemeKey, { hex: string; rgb: string; beam: string }> = {
  amber: { hex: '#ffd54f', rgb: '255, 213, 79', beam: 'rgba(255, 224, 130, 0.18)' },
  cyan: { hex: '#22d3ee', rgb: '34, 211, 238', beam: 'rgba(34, 211, 238, 0.18)' },
  violet: { hex: '#c084fc', rgb: '192, 132, 252', beam: 'rgba(192, 132, 252, 0.18)' },
  emerald: { hex: '#34d399', rgb: '52, 211, 153', beam: 'rgba(52, 211, 153, 0.18)' },
  rose: { hex: '#fb7185', rgb: '251, 113, 133', beam: 'rgba(251, 113, 133, 0.18)' },
};

export const TeacherAuthLampModal: React.FC<TeacherAuthLampModalProps> = ({
  isOpen,
  onClose,
  teacher,
  onUpdateTeacher,
  onShowToast,
}) => {
  const [isLightOn, setIsLightOn] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [currentThemeKey, setCurrentThemeKey] = useState<ThemeKey>('amber');
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

  // Form states
  const [username, setUsername] = useState(teacher.name || '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Signup states
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword1, setShowRegPassword1] = useState(false);
  const [showRegPassword2, setShowRegPassword2] = useState(false);

  // Modals & animations
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [cordY, setCordY] = useState(255);
  const [isLoading, setIsLoading] = useState(false);

  // Audio synthesis helper
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playSwitchSound = (turnOn: boolean) => {
    if (!isSoundEnabled) return;
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(turnOn ? 440 : 220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(turnOn ? 880 : 110, ctx.currentTime + 0.07);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.07);
    } catch (e) {}
  };

  const playKeySound = () => {
    if (!isSoundEnabled) return;
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600 + Math.random() * 200, ctx.currentTime);

      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch (e) {}
  };

  // Toggle Lamp with Cord Physics Animation
  const toggleLamp = () => {
    const nextState = !isLightOn;
    setIsLightOn(nextState);
    playSwitchSound(nextState);

    // Cord pull animation sequence
    let startY = 255;
    let targetY = 295;
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.2;
      let currentY = startY + (targetY - startY) * progress;
      setCordY(currentY);

      if (progress >= 1) {
        clearInterval(interval);
        let bounceProg = 0;
        const bounceInt = setInterval(() => {
          bounceProg += 0.15;
          let springY = targetY - (targetY - startY) * Math.sin(bounceProg * Math.PI);
          setCordY(springY);

          if (bounceProg >= 1) {
            clearInterval(bounceInt);
            setCordY(startY);
          }
        }, 16);
      }
    }, 16);

    if (nextState) {
      onShowToast('ពន្លឺត្រូវបានបើក! សូមស្វាគមន៍');
    } else {
      onShowToast('ពន្លឺត្រូវបានបិទ!');
    }
  };

  // Canvas Dust Particles
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles: Array<{ x: number; y: number; size: number; speedY: number; speedX: number; alpha: number }> = [];
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: canvas.width * 0.25 + (Math.random() - 0.5) * 180,
        y: 160 + Math.random() * 300,
        size: Math.random() * 2.5 + 0.8,
        speedY: -(Math.random() * 0.4 + 0.1),
        speedX: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.6 + 0.2,
      });
    }

    let animationFrameId: number;
    const theme = themes[currentThemeKey];

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (isLightOn) {
        particles.forEach((p) => {
          p.y += p.speedY;
          p.x += p.speedX;
          if (p.y < 160 || p.alpha <= 0) {
            p.y = 160 + Math.random() * 300;
            p.x = canvas.width * 0.25 + (Math.random() - 0.5) * 180;
          }
          ctx.fillStyle = `rgba(${theme.rgb}, ${p.alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
      }
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isLightOn, currentThemeKey]);

  // Password Strength calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 5) score++;
    if (pass.length > 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strengthScore = getPasswordStrength(regPassword);
  const strengthWidth = regPassword.length === 0 ? '0%' : strengthScore <= 2 ? '30%' : strengthScore <= 4 ? '65%' : '100%';
  const strengthColor = strengthScore <= 2 ? 'bg-red-500' : strengthScore <= 4 ? 'bg-amber-400' : 'bg-emerald-400';
  const strengthText = regPassword.length === 0 ? 'Too Weak' : strengthScore <= 2 ? 'Weak' : strengthScore <= 4 ? 'Medium' : 'Strong';

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLightOn) {
      onShowToast('សូមបើកពន្លឺអំពូលជាមុនសិន!');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const updated = { ...teacher, name: username || teacher.name };
      onUpdateTeacher(updated);
      onShowToast(`សូមស្វាគមន៍មកវិញ, ${updated.name}! 🎉`);
      onClose();
    }, 1000);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLightOn) {
      onShowToast('សូមបើកពន្លឺអំពូលជាមុនសិន!');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      onShowToast('ពាក្យសម្ងាត់ និងការបញ្ជាក់ពាក្យសម្ងាត់មិនត្រូវគ្នាទេ!');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const updated = { ...teacher, name: regFullName, email: regUsername.includes('@') ? regUsername : teacher.email };
      onUpdateTeacher(updated);
      onShowToast(`បង្កើតគណនីជោគជ័យសម្រាប់ ${regFullName}! 🎉`);
      setUsername(regUsername);
      setActiveTab('signin');
    }, 1200);
  };

  const activeTheme = themes[currentThemeKey];

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col justify-between items-center overflow-y-auto transition-colors duration-800 ${
        isLightOn ? 'light-on bg-[#07080a]' : 'light-off bg-[#07080a]'
      }`}
      style={{
        '--glow-color': activeTheme.hex,
        '--glow-color-rgb': activeTheme.rgb,
        '--glow-beam': activeTheme.beam,
      } as React.CSSProperties}
    >
      {/* Ambient background glow */}
      <div className={`fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--glow-color-rgb),0.08)_0%,transparent_60%)] transition-opacity duration-1000 pointer-events-none ${isLightOn ? 'opacity-100' : 'opacity-0'}`} />

      {/* Top Header */}
      <header className="w-full max-w-6xl px-6 py-4 flex flex-wrap justify-between items-center gap-4 z-30">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20 backdrop-blur-md shadow-inner">
            <Lightbulb className={`w-5 h-5 ${isLightOn ? 'text-amber-300 animate-pulse' : 'text-gray-400'}`} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Lamp Login & Sign Up UI</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30">Pro Edition</span>
            </h1>
            <p className="text-xs text-gray-400 font-light">ទាញ ឬចុចលើខ្សែអំពូលភ្លើង ដើម្បីបើក/បិទពន្លឺ និងបំភ្លឺទម្រង់</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-amber-400 hover:bg-white/10 transition backdrop-blur-md cursor-pointer"
            title="បិទ/បើកសំឡេង"
          >
            {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
          </button>

          {/* Theme switcher pills */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            {(['amber', 'cyan', 'violet', 'emerald', 'rose'] as ThemeKey[]).map((key) => (
              <button
                key={key}
                onClick={() => {
                  setCurrentThemeKey(key);
                  onShowToast(`បានប្តូរទៅ Theme ${key.toUpperCase()}`);
                }}
                className={`w-5 h-5 rounded-full transition-transform hover:scale-125 cursor-pointer ${currentThemeKey === key ? 'ring-2 ring-white scale-110 shadow-md' : 'opacity-70'}`}
                style={{ backgroundColor: themes[key].hex }}
              />
            ))}
          </div>

          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            title="បិទ / ចាកចេញ"
          >
            <X className="w-4 h-4" />
            <span>បិទ</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-5xl px-4 flex-1 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 relative z-20 py-4">
        {/* Glow & Light Beam */}
        <div 
          className={`absolute -top-12 left-[20%] md:left-[23%] w-[440px] h-[440px] rounded-full bg-[radial-gradient(circle,rgba(var(--glow-color-rgb),0.9)_0%,rgba(var(--glow-color-rgb),0.25)_45%,transparent_70%)] blur-[20px] pointer-events-none transition-opacity duration-500 z-50 ${isLightOn ? 'opacity-100 animate-pulse' : 'opacity-0'}`} 
        />
        <div 
          className={`absolute top-[135px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[340px] border-l-transparent border-r-[340px] border-r-transparent border-b-[650px] border-b-[var(--glow-beam)] blur-[25px] pointer-events-none transition-opacity duration-600 z-40 ${isLightOn ? 'opacity-100' : 'opacity-0'}`} 
        />

        <canvas ref={canvasRef} className={`absolute inset-0 pointer-events-none z-30 transition-opacity duration-800 ${isLightOn ? 'opacity-85' : 'opacity-0'}`} />

        {/* Lamp SVG Structure */}
        <div className="relative flex flex-col items-center justify-center w-full md:w-1/2 h-[380px] md:h-[480px]">
          <svg viewBox="0 0 340 440" className="w-full h-full max-w-[340px] drop-shadow-2xl">
            <defs>
              <linearGradient id="shadeMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="30%" stopColor="#d6d6d6" />
                <stop offset="70%" stopColor="#8e8e8e" />
                <stop offset="100%" stopColor="#4a4a4a" />
              </linearGradient>
              <linearGradient id="standChrome" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#666666" />
                <stop offset="40%" stopColor="#ffffff" />
                <stop offset="70%" stopColor="#cccccc" />
                <stop offset="100%" stopColor="#444444" />
              </linearGradient>
              <filter id="bulbGlowFilter" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="shadowFilter" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="10" />
              </filter>
            </defs>

            {/* Base shadow */}
            <ellipse cx="170" cy="405" rx="100" ry="14" fill="#000000" opacity="0.6" filter="url(#shadowFilter)" />
            <ellipse cx="170" cy="395" rx="80" ry="16" fill="url(#shadeMetallic)" stroke="#444" strokeWidth="1.5" />
            <ellipse cx="170" cy="391" rx="70" ry="10" fill="#222224" />

            {/* Pole */}
            <rect x="164" y="160" width="12" height="232" rx="6" fill="url(#standChrome)" />
            <rect x="166" y="160" width="4" height="230" rx="2" fill="#ffffff" opacity="0.5" />
            <rect x="156" y="152" width="28" height="14" rx="4" fill="#333333" stroke="#666" strokeWidth="1" />

            {/* Light bulb */}
            <circle 
              cx="170" 
              cy="165" 
              r="30" 
              fill={isLightOn ? activeTheme.hex : '#333333'} 
              filter={isLightOn ? 'url(#bulbGlowFilter)' : undefined}
              className="transition-all duration-400"
            />

            {/* Shade */}
            <path d="M 75 160 Q 170 30 265 160 Z" fill="url(#shadeMetallic)" stroke="#555555" strokeWidth="2" />
            <ellipse cx="170" cy="160" rx="95" ry="18" fill="#e5e5e5" stroke="#aaaaaa" strokeWidth="1.5" />
            <ellipse cx="170" cy="160" rx="88" ry="13" fill="#141518" />

            {/* Pull cord */}
            <path 
              d={`M 225 160 Q 225 ${(160 + cordY) / 2} 225 ${cordY - 5}`} 
              stroke="#bbbbbb" 
              strokeWidth="2.5" 
              fill="none" 
              strokeLinecap="round" 
            />
            <g 
              transform={`translate(225, ${cordY})`} 
              onClick={toggleLamp} 
              className="cursor-pointer group"
            >
              <circle cx="0" cy="0" r="16" fill="transparent" />
              <circle 
                cx="0" 
                cy="0" 
                r="9" 
                fill={activeTheme.hex} 
                stroke="#ffb300" 
                strokeWidth="2" 
                className="transition-all group-hover:drop-shadow-[0_0_8px_var(--glow-color)]" 
              />
              <circle cx="-2" cy="-2" r="3" fill="#ffffff" opacity="0.7" />
            </g>
          </svg>

          {!isLightOn && (
            <div 
              onClick={toggleLamp}
              className="absolute bottom-2 bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs px-4 py-2 rounded-full flex items-center gap-2 animate-bounce cursor-pointer backdrop-blur-md shadow-lg"
            >
              <span>ទាញ ឬចុចលើខ្សែអំពូលភ្លើងដើម្បីបំភ្លឺ</span>
            </div>
          )}
        </div>

        {/* Login / Signup Card */}
        <div className={`w-full max-w-md md:w-1/2 z-20 transition-all duration-700 ${isLightOn ? 'opacity-100 translate-y-0 filter-none' : 'opacity-120 translate-y-5 filter brightness-25 blur-xs pointer-events-none'}`}>
          <div className="bg-[#12141a]/65 backdrop-blur-[30px] border border-white/12 rounded-[32px] p-6 md:p-8 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.75)] relative overflow-hidden">
            
            {/* Tab switch */}
            <div className="flex bg-white/5 border border-white/10 p-1 rounded-2xl mb-6 backdrop-blur-md relative">
              <button
                onClick={() => { setActiveTab('signin'); playKeySound(); }}
                className={`w-1/2 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 z-10 cursor-pointer ${
                  activeTab === 'signin' ? 'text-amber-400 bg-white/10 shadow-sm' : 'text-gray-400 hover:text-white'
                }`}
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>Sign In / ចូលប្រើ</span>
              </button>
              <button
                onClick={() => { setActiveTab('signup'); playKeySound(); }}
                className={`w-1/2 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 z-10 cursor-pointer ${
                  activeTab === 'signup' ? 'text-amber-400 bg-white/10 shadow-sm' : 'text-gray-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up / បង្កើតគណនី</span>
              </button>
            </div>

            {activeTab === 'signin' ? (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="text-center mb-5">
                  <h2 className="text-2xl font-extrabold text-white mb-1">Welcome Back</h2>
                  <p className="text-xs text-gray-400 font-light">សូមបញ្ចូលព័ត៌មានរបស់អ្នកដើម្បីចូលប្រព័ន្ធបង្រៀន</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5 pl-1">Username or Teacher Name</label>
                  <div className="relative flex items-center">
                    <User className="absolute left-4 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onKeyDown={playKeySound}
                      placeholder="បញ្ចូលឈ្មោះគ្រូ"
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/12 focus:border-[var(--glow-color)] rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5 pl-1">
                    <label className="block text-xs font-semibold text-gray-300">Password / ពាក្យសម្ងាត់</label>
                    <span 
                      onClick={() => onShowToast('សូមទាក់ទងអ្នកគ្រប់គ្រងប្រព័ន្ធដើម្បីកំណត់ពាក្យសម្ងាត់ឡើងវិញ!')} 
                      className="text-xs text-amber-400/90 hover:underline cursor-pointer"
                    >
                      ភ្លេចពាក្យសម្ងាត់?
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-4 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={playKeySound}
                      placeholder="បញ្ចូលពាក្យសម្ងាត់"
                      className="w-full pl-11 pr-11 py-3 bg-white/5 border border-white/12 focus:border-[var(--glow-color)] rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 text-gray-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-xs text-gray-300 pt-1">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
                  />
                  <label htmlFor="remember" className="cursor-pointer">ចងចាំខ្ញុំ (Remember me)</label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-2xl font-bold text-sm tracking-wide uppercase transition duration-300 mt-2 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${activeTheme.hex} 0%, #ffab00 100%)`,
                    color: '#0d0e12',
                  }}
                >
                  <span>{isLoading ? 'កំពុងចូល...' : 'Sign In & Enter Dashboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-3">
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-extrabold text-white mb-1">Create Account</h2>
                  <p className="text-xs text-gray-400 font-light">បំពេញព័ត៌មានដើម្បីបង្កើតគណនីគ្រូបង្រៀនថ្មី</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1 pl-1">Full Name / ឈ្មោះពេញ</label>
                  <div className="relative flex items-center">
                    <IdCard className="absolute left-4 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      onKeyDown={playKeySound}
                      placeholder="ឧ. លោកគ្រូ សុខ ចាន់"
                      className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/12 focus:border-[var(--glow-color)] rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1 pl-1">Email or Username</label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-4 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      onKeyDown={playKeySound}
                      placeholder="teacher@gmail.com"
                      className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/12 focus:border-[var(--glow-color)] rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1 pl-1">
                    <label className="block text-xs font-semibold text-gray-300">Password</label>
                    <span className="text-[10px] font-bold uppercase text-gray-400">{strengthText}</span>
                  </div>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-4 w-4 h-4 text-gray-400" />
                    <input
                      type={showRegPassword1 ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      onKeyDown={playKeySound}
                      placeholder="ពាក្យសម្ងាត់យ៉ាងតិច ៦ខ្ទង់"
                      className="w-full pl-11 pr-11 py-2.5 bg-white/5 border border-white/12 focus:border-[var(--glow-color)] rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword1(!showRegPassword1)}
                      className="absolute right-4 text-gray-400 hover:text-white cursor-pointer"
                    >
                      {showRegPassword1 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="w-full bg-white/10 h-1 rounded-full mt-1.5 overflow-hidden">
                    <div className={`h-full transition-all duration-300 ${strengthColor}`} style={{ width: strengthWidth }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1 pl-1">
                    <label className="block text-xs font-semibold text-gray-300">Confirm Password</label>
                    {regConfirmPassword && regPassword === regConfirmPassword && (
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
                        <Check className="w-3 h-3" /> Matched
                      </span>
                    )}
                  </div>
                  <div className="relative flex items-center">
                    <ShieldCheck className="absolute left-4 w-4 h-4 text-gray-400" />
                    <input
                      type={showRegPassword2 ? 'text' : 'password'}
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      onKeyDown={playKeySound}
                      placeholder="វាយបញ្ជាក់ពាក្យសម្ងាត់ម្ដងទៀត"
                      className="w-full pl-11 pr-11 py-2.5 bg-white/5 border border-white/12 focus:border-[var(--glow-color)] rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword2(!showRegPassword2)}
                      className="absolute right-4 text-gray-400 hover:text-white cursor-pointer"
                    >
                      {showRegPassword2 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-300 pt-1 pl-1">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
                  />
                  <label htmlFor="terms" className="cursor-pointer">
                    ខ្ញុំយល់ព្រមតាម{' '}
                    <span onClick={() => setShowTermsModal(true)} className="text-amber-400 underline cursor-pointer">
                      លក្ខខណ្ឌសេវាកម្ម
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-2xl font-bold text-sm tracking-wide uppercase transition duration-300 mt-2 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${activeTheme.hex} 0%, #ffab00 100%)`,
                    color: '#0d0e12',
                  }}
                >
                  <span>{isLoading ? 'កំពុងបង្កើត...' : 'Create Account & Start'}</span>
                  <UserPlus className="w-4 h-4" />
                </button>
              </form>
            )}

          </div>
        </div>
      </main>

      {/* Terms Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-white/15 w-full max-w-lg rounded-3xl p-6 relative shadow-2xl text-white">
            <button onClick={() => setShowTermsModal(false)} className="absolute top-5 right-5 text-gray-400 hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-amber-400">
              <FileText className="w-5 h-5" />
              <span>លក្ខខណ្ឌសេវាកម្ម / Terms of Service</span>
            </h3>
            <div className="text-xs text-gray-300 space-y-3 max-h-60 overflow-y-auto pr-2 font-light leading-relaxed">
              <p>១. គណនីរបស់អ្នកនឹងត្រូវការពារដោយសុវត្ថិភាពខ្ពស់បំផុត និងប្រើប្រាស់តែក្នុងប្រព័ន្ធផ្លូវការប៉ុណ្ណោះ។</p>
              <p>២. អ្នកត្រូវរក្សាពាក្យសម្ងាត់របស់អ្នកជាការសម្ងាត់ និងមិនត្រូវចែករំលែកទៅកាន់អ្នកដទៃឡើយ។</p>
              <p>៣. ប្រព័ន្ធរក្សាសិទ្ធិក្នុងការកែប្រែ ឬអភិវឌ្ឍបន្ថែមលើមុខងារសេវាកម្មដើម្បីភាពងាយស្រួលរបស់អ្នកប្រើប្រាស់។</p>
            </div>
            <div className="mt-6 text-right">
              <button 
                onClick={() => { setAgreeTerms(true); setShowTermsModal(false); }}
                className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase cursor-pointer"
                style={{ backgroundColor: activeTheme.hex, color: '#0d0e12' }}
              >
                យល់ព្រម / Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-gray-500 font-light z-20">
        <p>© 2026 Interactive Lamp Login & Sign Up UI • Design & Artistry</p>
      </footer>
    </div>
  );
};
