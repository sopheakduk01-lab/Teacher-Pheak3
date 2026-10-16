import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, Trophy, Sparkles, RefreshCw, Play, Pause, Heart, Star, 
  Target, Shield, Snowflake, Magnet, Zap, Home, ChevronRight,
  CircleCheck, Crown, Calculator, BookMarked, Languages, Landmark, HeartPulse, FlaskConical, RotateCw
} from 'lucide-react';
import { ALL_MATH_LESSONS_PACKAGES } from '../data/mathLessonQcm';

interface VijjaNavaGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
}

interface Character {
  id: string;
  name: string;
  icon: string;
  color: string;
  ability: string;
  desc: string;
  speedMultiplier: number;
  magnetPassive: boolean;
  scoreBonus: number;
  startLives: number;
  startShield: boolean;
}

interface Prompt {
  prompt: string;
  isCorrect: (val: any) => boolean;
  generatePool: () => any[];
}

interface Topic {
  id: string;
  title: string;
  prompts: Prompt[];
}

interface SubjectData {
  [key: string]: Topic[];
}

const CHARACTERS: Character[] = [
  {
    id: 'morakot',
    name: 'មរកត',
    icon: '👑',
    color: '#facc15',
    ability: 'មាសបូកពិន្ទុ',
    desc: 'សមត្ថភាព៖ ទទួលបានពិន្ទុបន្ថែម +៥០%',
    speedMultiplier: 1.0,
    magnetPassive: false,
    scoreBonus: 1.5,
    startLives: 3,
    startShield: false
  },
  {
    id: 'manee',
    name: 'មណី',
    icon: '🐱',
    color: '#c084fc',
    ability: 'មេដែកចិន្តា',
    desc: 'សមត្ថភាព៖ មានមេដែកស្រូបចម្លើយត្រូវជានិច្ច',
    speedMultiplier: 1.0,
    magnetPassive: true,
    scoreBonus: 1.0,
    startLives: 3,
    startShield: false
  },
  {
    id: 'ratanak',
    name: 'រតនៈ',
    icon: '🐸',
    color: '#4ade80',
    ability: 'ល្បឿនស្ទុះរហ័ស',
    desc: 'សមត្ថភាព៖ ផ្លាស់ទីលឿន និងស្ទុះទាន់ចិត្ត',
    speedMultiplier: 1.45,
    magnetPassive: false,
    scoreBonus: 1.0,
    startLives: 3,
    startShield: false
  },
  {
    id: 'sovan',
    name: 'សុវណ្ណ',
    icon: '🐻',
    color: '#fb923c',
    ability: 'ខែលមាសការពារ',
    desc: 'សមត្ថភាព៖ ទទួលបានខែលការពារស្រាប់តាំងពីដើម',
    speedMultiplier: 1.0,
    magnetPassive: false,
    scoreBonus: 1.0,
    startLives: 3,
    startShield: true
  },
  {
    id: 'bopha',
    name: 'បុប្ផា',
    icon: '🐰',
    color: '#f472b6',
    ability: 'បេះដូងបន្ថែម',
    desc: 'សមត្ថភាព៖ បន្ថែមជីវិតបេះដូង +១ (៤ ជីវិត)',
    speedMultiplier: 1.1,
    magnetPassive: false,
    scoreBonus: 1.0,
    startLives: 4,
    startShield: false
  }
];

const PRAISE_WORDS = ["អស្ចារ្យណាស់!", "លឿនមែន!", "ឆ្លាតណាស់!", "ឥតខ្ចោះ! (PERFECT)"];

// Helper to generate pool for math lessons
function generateMathPool(questions: any[], currentQuestion: any) {
  const correctOption = currentQuestion.options.find((o: any) => o.isCorrect)?.text;
  const incorrectOptions = currentQuestion.options.filter((o: any) => !o.isCorrect).map((o: any) => o.text);
  
  // Mix in some other questions' options for more variety
  const otherOptions = questions
    .filter(q => q.id !== currentQuestion.id)
    .flatMap(q => q.options.map((o: any) => o.text))
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);

  return [correctOption, ...incorrectOptions, ...otherOptions].filter(v => v);
}

const MATH_TOPICS: Topic[] = ALL_MATH_LESSONS_PACKAGES.map((pkg) => ({
  id: `math-l${pkg.lessonNumber}`,
  title: pkg.title,
  prompts: pkg.questions.slice(0, 5).map((q) => ({
    prompt: q.question,
    isCorrect: (val: any) => {
      const correct = q.options.find((o: any) => o.isCorrect)?.text;
      return val === correct;
    },
    generatePool: () => generateMathPool(pkg.questions, q)
  }))
}));

const GAME_SUBJECTS: SubjectData = {
  khmer: [
    {
      id: 'k1', title: '១. ថ្នាក់ពាក្យ - នាម',
      prompts: [
        { prompt: "ស្វែងរក៖ ពាក្យជានាមទីកន្លែង", isCorrect: v => ['សាលារៀន', 'មន្ទីរពេទ្យ', 'វត្តអារាម', 'ផ្សារ', 'ផ្ទះ'].includes(v), generatePool: () => ['សាលារៀន', 'មន្ទីរពេទ្យ', 'វត្តអារាម', 'ផ្សារ', 'រត់', 'ស្អាត', 'លឿន'] },
        { prompt: "ស្វែងរក៖ ពាក្យជានាមវត្ថុ/សត្វ", isCorrect: v => ['សៀវភៅ', 'ដើមឈើ', 'ឆ្មា', 'កុំព្យូទ័រ', 'តុ'].includes(v), generatePool: () => ['សៀវភៅ', 'ដើមឈើ', 'ឆ្មា', 'កុំព្យូទ័រ', 'សរសេរ', 'អាន', 'ដើរ'] }
      ]
    }
  ],
  english: [
    {
      id: 'e1', title: '1. Nouns (នាម)',
      prompts: [
        { prompt: "Find: Nouns (Thing/Place)", isCorrect: v => ['Book', 'School', 'Dog', 'House', 'Apple'].includes(v), generatePool: () => ['Book', 'School', 'Dog', 'House', 'Run', 'Fast', 'Big'] }
      ]
    }
  ],
  math: MATH_TOPICS,
  science: [
    { id: 's1', title: '១. ស្ថានភាពធាតុ - ធាតុរឹង', prompts: [{ prompt: "ស្វែងរក៖ ធាតុរឹង (Solids 🧊)", isCorrect: v => ['ទឹកកក', 'ឈើ', 'ដែក', 'ថ្ម'].includes(v), generatePool: () => ['ទឹកកក', 'ឈើ', 'ដែក', 'ថ្ម', 'ទឹក', 'ប្រេង', 'ខ្យល់'] }] }
  ],
  social: [
    { id: 'so1', title: '១. ប្រវត្តិសាស្ត្រ - អង្គរវត្ត', prompts: [{ prompt: "ព្រះមហាក្សត្រកសាង «អង្គរវត្ត»", isCorrect: v => ['សុរិយវរ្ម័នទី២'].includes(v), generatePool: () => ['សុរិយវរ្ម័នទី២', 'ជ័យវរ្ម័នទី៧', 'ជ័យវរ្ម័នទី២'] }] }
  ],
  health: [
    { id: 'h1', title: '១. អាហាររូបត្ថម្ភ - វីតាមីន A', prompts: [{ prompt: "ស្វែងរក៖ អាហារសម្បូរ «វីតាមីន A» (ភ្នែក)", isCorrect: v => ['ការ៉ុត', 'ល្ពៅ', 'ពពាយ', 'ថ្លើម'].includes(v), generatePool: () => ['ការ៉ុត', 'ល្ពៅ', 'ពពាយ', 'ថ្លើម', 'បាយ', 'ប្រេង', 'ស្ករ'] }] }
  ]
};

class SoundFx {
  ctx: AudioContext | null = null;
  init() {
    try {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    } catch(e) {}
  }
  playCatch() {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch(e) {}
  }
  playPowerup() {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch(e) {}
  }
  playWrong() {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(70, this.ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch(e) {}
  }
  playSwitchAlert() {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.setValueAtTime(880, this.ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(1760, this.ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    } catch(e) {}
  }
  playFever() {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(1000, this.ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.4);
    } catch(e) {}
  }
}

const sfx = new SoundFx();

export const VijjaNavaGameModal: React.FC<VijjaNavaGameModalProps> = ({
  isOpen,
  onClose,
  studentName = 'សិស្ស',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'MENU' | 'PLAYING' | 'PAUSED' | 'GAMEOVER'>('MENU');
  const [selectedChar, setSelectedChar] = useState<Character>(CHARACTERS[0]);
  const [selectedSub, setSelectedSub] = useState<string>('math');
  const [selectedTopId, setSelectedTopId] = useState<string>(MATH_TOPICS[0].id);
  
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [maxCombo, setMaxCombo] = useState(1);
  const [lives, setLives] = useState(3);
  const [feverProgress, setFeverProgress] = useState(0);
  const [isFeverActive, setIsFeverActive] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState<Prompt | null>(null);
  const [questionNum, setQuestionNum] = useState(1);
  
  const [hasShield, setHasShield] = useState(false);
  const [freezeTimer, setFreezeTimer] = useState(0);
  const [magnetTimer, setMagnetTimer] = useState(0);
  
  const gameDataRef = useRef({
    score: 0,
    combo: 1,
    maxCombo: 1,
    lives: 3,
    maxLives: 3,
    feverProgress: 0,
    isFeverActive: false,
    feverTimer: 0,
    freezeTimer: 0,
    magnetTimer: 0,
    hasShield: false,
    gameTime: 0,
    correctCatch: 0,
    items: [] as any[],
    powerups: [] as any[],
    particles: [] as any[],
    floatingTexts: [] as any[],
    shockwaves: [] as any[],
    player: { x: 0, y: 0, targetX: 0, r: 36, bob: 0 },
    width: 0,
    height: 0,
    stars: [] as any[],
    lastSpawnTime: 0,
    char: CHARACTERS[0]
  });

  const updateLivesUI = useCallback((l: number, maxL: number) => {
    setLives(l);
  }, []);

  const switchPrompt = useCallback(() => {
    const topics = GAME_SUBJECTS[selectedSub] || [];
    const topic = topics.find(t => t.id === selectedTopId) || topics[0];
    const prompts = topic.prompts;
    
    let newPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setCurrentPrompt(newPrompt);
    setQuestionNum(prev => prev + 1);
    gameDataRef.current.correctCatch = 0;
    
    sfx.playSwitchAlert();
    gameDataRef.current.shockwaves.push({
      x: gameDataRef.current.width / 2,
      y: 90,
      r: 10,
      maxR: Math.max(gameDataRef.current.width, gameDataRef.current.height) * 0.7,
      color: '#facc15',
      alpha: 1
    });
  }, [selectedSub, selectedTopId]);

  const startGame = () => {
    sfx.init();
    const char = selectedChar;
    gameDataRef.current = {
      ...gameDataRef.current,
      score: 0,
      combo: 1,
      maxCombo: 1,
      lives: char.startLives,
      maxLives: char.startLives,
      hasShield: char.startShield,
      feverProgress: 0,
      isFeverActive: false,
      feverTimer: 0,
      freezeTimer: 0,
      magnetTimer: 0,
      gameTime: 0,
      correctCatch: 0,
      items: [],
      powerups: [],
      particles: [],
      floatingTexts: [],
      shockwaves: [],
      lastSpawnTime: 0,
      char: char
    };
    
    setScore(0);
    setCombo(1);
    setMaxCombo(1);
    setLives(char.startLives);
    setFeverProgress(0);
    setIsFeverActive(false);
    setHasShield(char.startShield);
    setQuestionNum(0);
    
    switchPrompt();
    setGameState('PLAYING');
  };

  useEffect(() => {
    if (!isOpen) return;
    
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      gameDataRef.current.width = w;
      gameDataRef.current.height = h;
      gameDataRef.current.player.x = w / 2;
      gameDataRef.current.player.targetX = w / 2;
      gameDataRef.current.player.y = h - 90;
      
      const stars = [];
      for (let i = 0; i < 70; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.8 + 0.5,
          alpha: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 0.4 + 0.1
        });
      }
      gameDataRef.current.stars = stars;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    let animationId: number;
    const loop = (timestamp: number) => {
      const g = gameDataRef.current;
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx || gameState !== 'PLAYING') {
        animationId = requestAnimationFrame(loop);
        return;
      }

      g.gameTime++;

      // Background
      const bgGrad = ctx.createRadialGradient(g.width / 2, g.height / 2, 50, g.width / 2, g.height / 2, Math.max(g.width, g.height));
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(0.6, '#090d16');
      bgGrad.addColorStop(1, '#020408');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, g.width, g.height);

      ctx.fillStyle = '#ffffff';
      g.stars.forEach((star: any) => {
        star.y += star.speed * (g.freezeTimer > 0 ? 0.3 : 1);
        if (star.y > g.height) star.y = 0;
        ctx.save();
        ctx.globalAlpha = star.alpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Grid
      ctx.save();
      ctx.strokeStyle = g.freezeTimer > 0 ? 'rgba(56, 189, 248, 0.2)' : 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1;
      const horizonY = g.height * 0.75;
      for (let x = -g.width; x < g.width * 2; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, g.height);
        ctx.lineTo(g.width / 2 + (x - g.width / 2) * 0.1, horizonY);
        ctx.stroke();
      }
      for (let y = horizonY; y < g.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(g.width, y);
        ctx.stroke();
      }
      ctx.restore();

      // Spawn
      if (timestamp - g.lastSpawnTime > Math.max(600, 1400 - g.score)) {
        if (currentPrompt) {
          const pool = currentPrompt.generatePool();
          const val = pool[Math.floor(Math.random() * pool.length)];
          g.items.push({
            x: Math.random() * (g.width - 100) + 50,
            y: -40,
            r: Math.min(g.width * 0.06, 32) + 4,
            baseSpeed: Math.random() * 1.5 + 2.0 + (g.score / 700),
            value: val,
            isCorrect: currentPrompt.isCorrect(val),
            pulse: Math.random() * Math.PI,
            color: ['#c084fc', '#818cf8', '#38bdf8', '#2dd4bf', '#34d399', '#f472b6'][Math.floor(Math.random() * 6)],
            rotAngle: Math.random() * Math.PI * 2
          });
        }
        if (Math.random() < 0.05 && g.powerups.length < 2) {
          const types = ['shield', 'freeze', 'magnet', 'heart'];
          g.powerups.push({
            x: Math.random() * (g.width - 100) + 50,
            y: -40,
            r: 24,
            speed: 2.2,
            type: types[Math.floor(Math.random() * types.length)]
          });
        }
        g.lastSpawnTime = timestamp;
      }

      // Logic
      if (g.freezeTimer > 0) {
        g.freezeTimer--;
        if (g.freezeTimer <= 0) setFreezeTimer(0);
      }
      if (g.magnetTimer > 0) {
        g.magnetTimer--;
        if (g.magnetTimer <= 0) setMagnetTimer(0);
      }
      if (g.isFeverActive) {
        g.feverTimer--;
        g.feverProgress = (g.feverTimer / 300) * 100;
        setFeverProgress(g.feverProgress);
        if (g.feverTimer <= 0) {
          g.isFeverActive = false;
          g.feverProgress = 0;
          setIsFeverActive(false);
          setFeverProgress(0);
        }
      }

      // Updates & Drawing
      g.shockwaves.forEach((sw: any, idx: number) => {
        sw.r += (sw.maxR - sw.r) * 0.12;
        sw.alpha -= 0.025;
        if (sw.alpha <= 0) g.shockwaves.splice(idx, 1);
        ctx.save();
        ctx.globalAlpha = Math.max(0, sw.alpha);
        ctx.strokeStyle = sw.color;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      g.particles.forEach((p: any, idx: number) => {
        p.x += p.vx; p.y += p.vy; p.alpha -= p.decay;
        if (p.alpha <= 0) g.particles.splice(idx, 1);
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      g.floatingTexts.forEach((ft: any, idx: number) => {
        ft.y += ft.vy; ft.alpha -= 0.018;
        if (ft.alpha <= 0) g.floatingTexts.splice(idx, 1);
        ctx.save();
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.fillStyle = ft.color;
        ctx.font = `bold ${ft.fontSize}px "Kantumruy Pro", sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      });

      g.powerups.forEach((p: any, idx: number) => {
        p.y += p.speed;
        const dist = Math.hypot(p.x - g.player.x, p.y - g.player.y);
        if (dist < p.r + g.player.r + 10) {
          sfx.playPowerup();
          if (p.type === 'shield') { g.hasShield = true; setHasShield(true); }
          else if (p.type === 'freeze') { g.freezeTimer = 300; setFreezeTimer(300); }
          else if (p.type === 'magnet') { g.magnetTimer = 300; setMagnetTimer(300); }
          else if (p.type === 'heart') { if (g.lives < g.maxLives) { g.lives++; setLives(g.lives); } }
          g.powerups.splice(idx, 1);
        } else if (p.y > g.height + 50) g.powerups.splice(idx, 1);
        
        ctx.save();
        ctx.translate(p.x, p.y);
        const icons: any = { shield: '🛡️', freeze: '⏱️', magnet: '🧲', heart: '💖' };
        const colors: any = { shield: '#38bdf8', freeze: '#0284c7', magnet: '#f59e0b', heart: '#ec4899' };
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = colors[p.type];
        ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(0, 0, p.r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.font = '16px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(icons[p.type], 0, 0);
        ctx.restore();
      });

      g.items.forEach((item: any, idx: number) => {
        let speed = item.baseSpeed * (g.freezeTimer > 0 ? 0.35 : 1);
        if ((g.isFeverActive || g.magnetTimer > 0 || g.char.magnetPassive) && item.isCorrect) {
          item.x += (g.player.x - item.x) * 0.1;
          item.y += (g.player.y - item.y) * 0.1;
        } else {
          item.y += speed;
        }
        item.pulse += 0.06; item.rotAngle += 0.03;

        const dist = Math.hypot(item.x - g.player.x, item.y - g.player.y);
        if (dist < item.r + g.player.r + 10) {
          if (item.isCorrect) {
            sfx.playCatch();
            const bonus = Math.round(10 * g.combo * g.char.scoreBonus);
            g.score += bonus; setScore(g.score);
            g.combo++; setCombo(g.combo);
            g.correctCatch++;
            if (g.combo > g.maxCombo) { g.maxCombo = g.combo; setMaxCombo(g.combo); }
            if (g.combo % 3 === 0) g.floatingTexts.push({ x: g.width / 2, y: g.height / 2, text: PRAISE_WORDS[Math.floor(Math.random() * 4)], color: '#facc15', fontSize: 26, alpha: 1, vy: -2.2 });
            if (!g.isFeverActive) {
              g.feverProgress = Math.min(100, g.feverProgress + 12);
              setFeverProgress(g.feverProgress);
              if (g.feverProgress >= 100) { g.isFeverActive = true; g.feverTimer = 300; setIsFeverActive(true); sfx.playFever(); }
            }
            if (g.correctCatch >= 5) switchPrompt();
          } else {
            if (g.hasShield) { g.hasShield = false; setHasShield(false); sfx.playPowerup(); }
            else {
              sfx.playWrong(); g.combo = 1; setCombo(1); g.lives--; setLives(g.lives);
              if (g.lives <= 0) setGameState('GAMEOVER');
            }
          }
          g.items.splice(idx, 1);
        } else if (item.y > g.height + 50) {
          if (item.isCorrect && !g.isFeverActive) { g.combo = 1; setCombo(1); }
          g.items.splice(idx, 1);
        }

        // Draw item
        ctx.save();
        const glowR = item.r + Math.sin(item.pulse) * 4;
        const grad = ctx.createRadialGradient(item.x, item.y, item.r * 0.2, item.x, item.y, glowR + 10);
        grad.addColorStop(0, item.color + 'ee'); grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(item.x, item.y, glowR + 10, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#0f172a'; ctx.strokeStyle = item.color; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(item.x, item.y, item.r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#ffffff'; ctx.font = `bold ${Math.max(11, item.r * 0.5)}px "Kantumruy Pro"`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(item.value, item.x, item.y);
        ctx.restore();
      });

      // Player
      const lerp = 0.4 * g.char.speedMultiplier;
      g.player.x += (g.player.targetX - g.player.x) * lerp;
      g.player.bob += 0.08;
      const bobY = g.player.y + Math.sin(g.player.bob) * 3;
      ctx.save();
      if (g.hasShield) {
        ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(g.player.x, bobY, g.player.r + 14, 0, Math.PI * 2); ctx.stroke();
      }
      const auraGrad = ctx.createRadialGradient(g.player.x, bobY, g.player.r * 0.3, g.player.x, bobY, g.player.r + 20);
      auraGrad.addColorStop(0, g.char.color + 'dd'); auraGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = auraGrad; ctx.beginPath(); ctx.arc(g.player.x, bobY, g.player.r + 20, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = g.char.color; ctx.beginPath(); ctx.arc(g.player.x, bobY, g.player.r, 0, Math.PI * 2); ctx.fill();
      ctx.font = `${g.player.r * 1.1}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(g.char.icon, g.player.x, bobY);
      ctx.restore();

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, [gameState, isOpen, currentPrompt, switchPrompt, selectedChar]);

  const handlePointer = (clientX: number) => {
    if (gameState !== 'PLAYING') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    gameDataRef.current.player.targetX = Math.max(gameDataRef.current.player.r, Math.min(gameDataRef.current.width - gameDataRef.current.player.r, x));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-slate-950 font-kantumruy">
      <canvas 
        ref={canvasRef} 
        className="block w-full h-full"
        onMouseMove={(e) => handlePointer(e.clientX)}
        onTouchMove={(e) => handlePointer(e.touches[0].clientX)}
        onMouseDown={() => sfx.init()}
      />

      {/* TOP MARQUEE */}
      <div className="absolute top-0 left-0 w-full bg-slate-950/90 border-b border-amber-500/40 text-amber-300 py-1 px-2 z-20 flex items-center shadow-lg backdrop-blur-md">
        <div className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded text-[10px] font-black mr-2 uppercase shrink-0">ការណែនាំ</div>
        <div className="overflow-hidden whitespace-nowrap relative flex-1 text-xs font-bold animate-marquee">
          <span>💡 គួរលេងត្រឹមតែ ១៥ ទៅ ៣០ នាទីក្នុងមួយថ្ងៃ • 👁️ រក្សាចម្ងាយភ្នែកពីអេក្រង់យ៉ាងតិច ៣០ សង់ទីម៉ែត្រ • 🎓 ផ្តោតអារម្មណ៍អានសំណួរឱ្យច្បាស់លាស់!</span>
        </div>
      </div>

      {/* HUD UI */}
      {gameState === 'PLAYING' && (
        <div className="absolute top-10 left-0 w-full p-4 flex justify-between items-start pointer-events-none z-10">
          <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-3 border border-sky-500/50 min-w-[120px]">
            <span className="text-[10px] text-sky-400 font-bold uppercase flex items-center gap-1"><Star className="w-3 h-3" /> ពិន្ទុ</span>
            <div className="text-2xl font-black text-white">{score}</div>
            <div className="text-xs font-bold text-amber-400">COMBO x{combo}</div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl px-5 py-3 border border-amber-500/50 max-w-[60%] text-center pointer-events-auto">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Target className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="text-[10px] text-amber-400 font-black uppercase">សំណួរទី {questionNum}</span>
              <button onClick={switchPrompt} className="bg-amber-500/20 text-amber-300 text-[9px] px-2 py-0.5 rounded border border-amber-500/50 active:scale-95"><RotateCw className="w-2.5 h-2.5" /></button>
            </div>
            <div className="text-sm sm:text-base font-black text-amber-200 line-clamp-2">{currentPrompt?.prompt}</div>
          </div>

          <div className="flex flex-col items-end gap-2 pointer-events-auto">
            <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-3 border border-pink-500/50 text-right">
              <div className="flex items-center justify-end gap-2 mb-1">
                {hasShield && <Shield className="w-3.5 h-3.5 text-sky-400 animate-pulse" />}
                <span className="text-[10px] text-pink-400 font-bold uppercase">LIVES</span>
              </div>
              <div className="flex gap-1">
                {[...Array(selectedChar.startLives)].map((_, i) => (
                  <Heart key={i} className={`w-4 h-4 ${i < lives ? 'text-pink-500 fill-current' : 'text-slate-700'}`} />
                ))}
              </div>
            </div>
            <button onClick={() => setGameState('PAUSED')} className="bg-slate-900/80 backdrop-blur-md rounded-xl p-2 border border-slate-700 text-white active:scale-90"><Pause className="w-5 h-5" /></button>
          </div>
        </div>
      )}

      {/* POWERUPS & FEVER */}
      {gameState === 'PLAYING' && (
        <>
          <div className="absolute top-36 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-none z-10">
            {freezeTimer > 0 && <div className="bg-sky-500/20 border border-sky-400/60 px-3 py-1 rounded-full text-[10px] font-bold text-sky-300 backdrop-blur-md flex items-center gap-1"><Snowflake className="w-3 h-3 animate-spin" /> ពេលវេលាយឺត</div>}
            {magnetTimer > 0 && <div className="bg-amber-500/20 border border-amber-400/60 px-3 py-1 rounded-full text-[10px] font-bold text-amber-300 backdrop-blur-md flex items-center gap-1"><Magnet className="w-3 h-3 animate-bounce" /> មេដែកស្រូប</div>}
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[80%] max-w-md pointer-events-none z-10">
            <div className="flex justify-between items-center text-[10px] font-black text-amber-300 mb-1 px-1">
              <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-yellow-400 fill-current" /> FEVER MODE</span>
              <span>{isFeverActive ? 'ACTIVE!' : `${Math.floor(feverProgress)}%`}</span>
            </div>
            <div className="w-full h-2.5 bg-slate-950 rounded-full border border-amber-500/50 p-0.5 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-300 rounded-full transition-all duration-200" style={{ width: `${feverProgress}%` }} />
            </div>
          </div>
        </>
      )}

      {/* MODALS */}
      {gameState === 'MENU' && (
        <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4 z-30">
          <div className="max-w-md w-full bg-slate-900/80 border border-yellow-500/50 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="w-12 h-12 bg-amber-500/20 rounded-2xl border border-amber-500/40 flex items-center justify-center text-amber-400 mb-2 mx-auto"><Crown /></div>
            <h1 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-400 to-yellow-500 text-center">វិជ្ជានាវា៖ ល្បងប្រាជ្ញាចិន្តា</h1>
            <p className="text-[10px] text-slate-400 text-center mb-4 uppercase tracking-widest">Vijja Nava Grade 6 Educational Arcade</p>
            
            <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-left custom-scrollbar">
              <div>
                <label className="text-[10px] font-black text-yellow-400 uppercase block mb-2">១. ជ្រើសរើសតួអង្គ</label>
                <div className="grid grid-cols-5 gap-2">
                  {CHARACTERS.map(c => (
                    <button key={c.id} onClick={() => { sfx.init(); setSelectedChar(c); }} className={`flex flex-col items-center p-2 rounded-2xl border transition ${selectedChar.id === c.id ? 'border-yellow-400 bg-yellow-500/20 scale-105 shadow-lg' : 'border-slate-800 bg-slate-900/60'}`}>
                      <span className="text-2xl">{c.icon}</span>
                      <span className="text-[9px] font-bold text-white mt-1">{c.name}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-2 p-2 rounded-xl bg-slate-800/50 border border-amber-500/20 text-[10px] text-amber-200">{selectedChar.desc}</div>
              </div>

              <div>
                <label className="text-[10px] font-black text-sky-400 uppercase block mb-2">២. ជ្រើសរើសមុខវិជ្ជា</label>
                <div className="grid grid-cols-3 gap-2">
                  <button onClick={() => setSelectedSub('khmer')} className={`flex items-center gap-1.5 p-2 rounded-xl border text-[10px] font-bold transition ${selectedSub === 'khmer' ? 'border-yellow-500 bg-yellow-500/20 text-white' : 'border-slate-800 bg-slate-800/40 text-slate-400'}`}><BookMarked className="w-3 h-3" />ភាសាខ្មែរ</button>
                  <button onClick={() => setSelectedSub('math')} className={`flex items-center gap-1.5 p-2 rounded-xl border text-[10px] font-bold transition ${selectedSub === 'math' ? 'border-yellow-500 bg-yellow-500/20 text-white' : 'border-slate-800 bg-slate-800/40 text-slate-400'}`}><Calculator className="w-3 h-3" />គណិតវិទ្យា</button>
                  <button onClick={() => setSelectedSub('english')} className={`flex items-center gap-1.5 p-2 rounded-xl border text-[10px] font-bold transition ${selectedSub === 'english' ? 'border-yellow-500 bg-yellow-500/20 text-white' : 'border-slate-800 bg-slate-800/40 text-slate-400'}`}><Languages className="w-3 h-3" />អង់គ្លេស</button>
                  <button onClick={() => setSelectedSub('science')} className={`flex items-center gap-1.5 p-2 rounded-xl border text-[10px] font-bold transition ${selectedSub === 'science' ? 'border-yellow-500 bg-yellow-500/20 text-white' : 'border-slate-800 bg-slate-800/40 text-slate-400'}`}><FlaskConical className="w-3 h-3" />វិទ្យាសាស្ត្រ</button>
                  <button onClick={() => setSelectedSub('social')} className={`flex items-center gap-1.5 p-2 rounded-xl border text-[10px] font-bold transition ${selectedSub === 'social' ? 'border-yellow-500 bg-yellow-500/20 text-white' : 'border-slate-800 bg-slate-800/40 text-slate-400'}`}><Landmark className="w-3 h-3" />សិក្សាសង្គម</button>
                  <button onClick={() => setSelectedSub('health')} className={`flex items-center gap-1.5 p-2 rounded-xl border text-[10px] font-bold transition ${selectedSub === 'health' ? 'border-yellow-500 bg-yellow-500/20 text-white' : 'border-slate-800 bg-slate-800/40 text-slate-400'}`}><HeartPulse className="w-3 h-3" />សុខភាព</button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-amber-300 uppercase block mb-2">៣. ជ្រើសរើសប្រធានបទ ({GAME_SUBJECTS[selectedSub]?.length || 0})</label>
                <div className="grid grid-cols-1 gap-1.5 max-h-32 overflow-y-auto custom-scrollbar pr-1">
                  {(GAME_SUBJECTS[selectedSub] || []).map(t => (
                    <button key={t.id} onClick={() => setSelectedTopId(t.id)} className={`flex items-center justify-between p-2 rounded-xl border text-[10px] font-bold transition ${selectedTopId === t.id ? 'border-amber-400 bg-amber-400/20 text-white' : 'border-slate-800 bg-slate-900/60 text-slate-400'}`}>
                      <span className="line-clamp-1">{t.title}</span>
                      {selectedTopId === t.id && <CircleCheck className="w-3 h-3 text-amber-400" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={startGame} className="w-full mt-4 py-3 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-500 text-slate-950 font-black rounded-2xl shadow-xl active:scale-95 transition flex items-center justify-center gap-2"><Play className="w-4 h-4 fill-current" /> ចាប់ផ្តើមប្រកួត</button>
            <button onClick={onClose} className="w-full mt-2 py-2 text-slate-500 text-[10px] font-bold hover:text-slate-300 transition">ចាកចេញពីកម្មវិធី</button>
          </div>
        </div>
      )}

      {gameState === 'PAUSED' && (
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-30">
          <div className="max-w-xs w-full bg-slate-900/90 border border-slate-700 rounded-3xl p-8 text-center shadow-2xl">
            <h2 className="text-xl font-black text-white mb-6 flex items-center justify-center gap-2"><Pause className="text-amber-400" /> ផ្អាកហ្គេម</h2>
            <div className="flex flex-col gap-3">
              <button onClick={() => setGameState('PLAYING')} className="py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black rounded-2xl shadow-lg">បន្តលេង</button>
              <button onClick={startGame} className="py-3 bg-slate-800 text-slate-200 font-bold rounded-2xl border border-slate-600">លេងឡើងវិញ</button>
              <button onClick={() => setGameState('MENU')} className="py-3 bg-rose-500/20 text-rose-300 font-bold rounded-2xl border border-rose-500/40">ទំព័រដើម</button>
            </div>
          </div>
        </div>
      )}

      {gameState === 'GAMEOVER' && (
        <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4 z-30">
          <div className="max-w-md w-full bg-slate-900/90 border border-rose-500/50 rounded-3xl p-8 text-center shadow-2xl">
            <div className="w-16 h-16 bg-rose-500/20 rounded-2xl border border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto mb-4"><Trophy size={32} /></div>
            <h2 className="text-2xl font-black text-white mb-1">បញ្ចប់ហ្គេម</h2>
            <p className="text-xs text-slate-400 mb-6">ការប្រកួតត្រូវបានបញ្ចប់! នេះជាលទ្ធផលរបស់អ្នក៖</p>
            <div className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800 mb-6 grid grid-cols-2 gap-4 text-left">
              <div><span className="text-[10px] text-slate-500 font-black block uppercase">ពិន្ទុសរុប</span><div className="text-2xl font-black text-sky-400">{score}</div></div>
              <div><span className="text-[10px] text-slate-500 font-black block uppercase">កម្ពស់កុំបូ</span><div className="text-2xl font-black text-amber-400">x{maxCombo}</div></div>
            </div>
            <div className="flex gap-3">
              <button onClick={startGame} className="flex-1 py-3.5 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-500 text-slate-950 font-black rounded-2xl shadow-xl flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4" /> លេងម្តងទៀត</button>
              <button onClick={() => setGameState('MENU')} className="p-3.5 bg-slate-800 text-slate-300 rounded-2xl border border-slate-600"><Home /></button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee 25s linear infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(250,204,21,0.3); border-radius: 10px; }
        .font-kantumruy { font-family: 'Kantumruy Pro', sans-serif; }
      `}</style>
    </div>
  );
};
