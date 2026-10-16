import React, { useState, useEffect, useRef } from 'react';
import {
  Gamepad2,
  Trophy,
  Sparkles,
  Flame,
  RotateCcw,
  Volume2,
  VolumeX,
  Star,
  CheckCircle2,
  XCircle,
  Play,
  ArrowRight,
  Clock,
  BookOpen,
  Calculator,
  Compass,
  Layers,
  Award,
  Filter,
  Search,
  Printer,
  ChevronRight,
  Zap,
  HelpCircle,
  PartyPopper,
  ListOrdered
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Quiz } from '../types';

interface GamesTabProps {
  quizzes?: Quiz[];
  onPlayQuiz?: (quiz: Quiz) => void;
  onShowToast?: (msg: string) => void;
}

// Sound synthesizer using Web Audio API for rich educational game feedback
const playSynthesizerSound = (type: 'correct' | 'wrong' | 'combo' | 'win' | 'click' | 'countdown') => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    if (type === 'correct') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.15); // G5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'wrong') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
      osc.frequency.exponentialRampToValueAtTime(146.83, ctx.currentTime + 0.2); // D3
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'combo') {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);
        gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.06 + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.06);
        osc.stop(ctx.currentTime + idx * 0.06 + 0.15);
      });
    } else if (type === 'win') {
      const chord = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.22, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.08 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.4);
      });
    } else if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    }
  } catch (err) {
    console.warn('Audio playback not supported:', err);
  }
};

// ================= GAME 1: MATH SPEED QUEST DATA =================
interface MathQuestion {
  num1: number;
  num2: number;
  op: '+' | '-' | '×' | '÷';
  answer: number;
  options: number[];
}

const generateMathQuestion = (level: 'easy' | 'medium' | 'hard'): MathQuestion => {
  let num1 = 0;
  let num2 = 0;
  let op: '+' | '-' | '×' | '÷' = '+';
  let answer = 0;

  if (level === 'easy') {
    const ops: ('+' | '-')[] = ['+', '-'];
    op = ops[Math.floor(Math.random() * ops.length)];
    if (op === '+') {
      num1 = Math.floor(Math.random() * 20) + 1;
      num2 = Math.floor(Math.random() * 20) + 1;
      answer = num1 + num2;
    } else {
      num1 = Math.floor(Math.random() * 25) + 10;
      num2 = Math.floor(Math.random() * num1);
      answer = num1 - num2;
    }
  } else if (level === 'medium') {
    const ops: ('+' | '-' | '×')[] = ['+', '-', '×'];
    op = ops[Math.floor(Math.random() * ops.length)];
    if (op === '+') {
      num1 = Math.floor(Math.random() * 80) + 20;
      num2 = Math.floor(Math.random() * 80) + 10;
      answer = num1 + num2;
    } else if (op === '-') {
      num1 = Math.floor(Math.random() * 100) + 30;
      num2 = Math.floor(Math.random() * num1);
      answer = num1 - num2;
    } else {
      num1 = Math.floor(Math.random() * 9) + 2;
      num2 = Math.floor(Math.random() * 9) + 2;
      answer = num1 * num2;
    }
  } else {
    const ops: ('+' | '-' | '×' | '÷')[] = ['+', '-', '×', '÷'];
    op = ops[Math.floor(Math.random() * ops.length)];
    if (op === '×') {
      num1 = Math.floor(Math.random() * 12) + 3;
      num2 = Math.floor(Math.random() * 12) + 3;
      answer = num1 * num2;
    } else if (op === '÷') {
      num2 = Math.floor(Math.random() * 9) + 2;
      answer = Math.floor(Math.random() * 10) + 2;
      num1 = num2 * answer;
    } else if (op === '+') {
      num1 = Math.floor(Math.random() * 400) + 100;
      num2 = Math.floor(Math.random() * 400) + 100;
      answer = num1 + num2;
    } else {
      num1 = Math.floor(Math.random() * 500) + 200;
      num2 = Math.floor(Math.random() * 300) + 50;
      answer = num1 - num2;
    }
  }

  // Generate 3 unique wrong options close to the answer
  const wrongOptions = new Set<number>();
  while (wrongOptions.size < 3) {
    const delta = (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1);
    const candidate = answer + delta;
    if (candidate !== answer && candidate >= 0) {
      wrongOptions.add(candidate);
    }
  }

  const options = [answer, ...Array.from(wrongOptions)].sort(() => Math.random() - 0.5);
  return { num1, num2, op, answer, options };
};

// ================= GAME 2: KHMER ANTONYM & WORD MATCH DATA =================
const WORD_PAIRS = [
  { pairId: 1, text1: 'ខិតខំ (ព្យាយាម)', text2: 'ខ្ជិលច្រអូស', type: 'antonym', label: 'ពាក្យផ្ទុយ' },
  { pairId: 2, text1: 'សប្បាយរីករាយ', text2: 'កើតទុក្ខព្រួយ', type: 'antonym', label: 'ពាក្យផ្ទុយ' },
  { pairId: 3, text1: 'ស្មោះត្រង់', text2: 'ក្បត់ចិត្ត/វៀចវេរ', type: 'antonym', label: 'ពាក្យផ្ទុយ' },
  { pairId: 4, text1: 'អ្នកមាន', text2: 'អ្នកក្រីក្រ', type: 'antonym', label: 'ពាក្យផ្ទុយ' },
  { pairId: 5, text1: 'កូនច្បង', text2: 'កូនពៅ', type: 'antonym', label: 'ពាក្យផ្ទុយ' },
  { pairId: 6, text1: 'គុណនាមចង្អុលជិត', text2: 'នេះ, នុះ, ឯណេះ', type: 'match', label: 'វេយ្យាករណ៍' },
  { pairId: 7, text1: 'គុណនាមចង្អុលឆ្ងាយ', text2: 'នោះ, ណោះ, ឯណោះ', type: 'match', label: 'វេយ្យាករណ៍' },
  { pairId: 8, text1: 'សូរដូច៖ ចិត្ត', text2: 'សេចក្តីគិត/ដួងចិត្ត', type: 'meaning', label: 'ពាក្យសូរដូច' },
  { pairId: 9, text1: 'សូរដូច៖ ចិត្រ', text2: 'គំនូរ/ការគូរ', type: 'meaning', label: 'ពាក្យសូរដូច' },
  { pairId: 10, text1: 'សូរដូច៖ ទុក្ខ', text2: 'សេចក្តីព្រួយលំបាក', type: 'meaning', label: 'ពាក្យសូរដូច' },
  { pairId: 11, text1: 'សូរដូច៖ ទុក', text2: 'ដាក់ទុក/រក្សាទុក', type: 'meaning', label: 'ពាក្យសូរដូច' },
  { pairId: 12, text1: 'រ៉ែដែក & មាស', text2: 'ខេត្តព្រះវិហារ/រតនគិរី', type: 'geography', label: 'ភូមិវិទ្យា' },
];

// ================= GAME 3: KHMER SENTENCE BUILDER DATA =================
const SENTENCE_CHALLENGES = [
  {
    id: 1,
    title: 'គុណនាមចំនួនរាប់',
    sentence: ['សិស្ស', 'ប្រុស', 'បីនាក់', 'កំពុង', 'អាន', 'សៀវភៅ'],
    hint: 'ប្រធាន + គុណនាម + កិរិយា + កម្មបទ'
  },
  {
    id: 2,
    title: 'គុណនាមចំនួនរៀប',
    sentence: ['សុខា', 'ប្រឡង', 'ជាប់', 'ចំណាត់ថ្នាក់', 'លេខមួយ'],
    hint: 'បង្ហាញពីលំដាប់លេខរៀងក្នុងថ្នាក់'
  },
  {
    id: 3,
    title: 'មេរៀនសារៈប្រយោជន៍នៃរ៉ែ',
    sentence: ['ប្រទេស', 'កម្ពុជា', 'សម្បូរ', 'ទៅដោយ', 'ធនធាន', 'រ៉ែធម្មជាតិ'],
    hint: 'រៀបចំតាមក្បួនវេយ្យាករណ៍ខ្មែរ'
  },
  {
    id: 4,
    title: 'ការការពារបរិស្ថាន',
    sentence: ['យើង', 'ត្រូវ', 'ចូលរួម', 'ដាំដើមឈើ', 'ដើម្បី', 'បរិស្ថានបៃតង'],
    hint: 'ប្រធាន + កិរិយាជំនួយ + កម្មបទ'
  }
];

// ================= GAME 4: SPELLING BEE KHMER DATA =================
const SPELLING_CHALLENGES = [
  {
    id: 1,
    question: 'ចូរជ្រើសរើសពាក្យដែលសរសេរត្រូវអក្ខរាវិរុទ្ធខ្មែរ៖',
    correct: 'ឧស្សាហ៍',
    wrongs: ['ឧស្សាហ៍រ', 'ឧស្សារហ៍', 'អុស្សាហ៍'],
    explanation: '«ឧស្សាហ៍» មានន័យថា ព្យាយាម មិនខ្ជិល។'
  },
  {
    id: 2,
    question: 'ចូរជ្រើសរើសពាក្យដែលសរសេរត្រូវអក្ខរាវិរុទ្ធខ្មែរ៖',
    correct: 'កិត្តិយស',
    wrongs: ['កិត្តិយល់', 'កិតិយស', 'កិត្តិយ៉ស'],
    explanation: '«កិត្តិយស» មានតក្កូល ត្ត និង យស។'
  },
  {
    id: 3,
    question: 'ចូរជ្រើសរើសពាក្យដែលសរសេរត្រូវអក្ខរាវិរុទ្ធខ្មែរ៖',
    correct: 'សាមគ្គីភាព',
    wrongs: ['សាមគ្គីភព', 'សាមគីភាព', 'សាមគ្គីភាប់'],
    explanation: '«សាមគ្គីភាព» សរសេរដោយ គ ជើង គ។'
  },
  {
    id: 4,
    question: 'ចូរជ្រើសរើសពាក្យដែលសរសេរត្រូវអក្ខរាវិរុទ្ធខ្មែរ៖',
    correct: 'បរិស្ថាន',
    wrongs: ['បរិស្ថាណ្ណ', 'បរិស្ឋាន', 'បូរិស្ថាន'],
    explanation: '«បរិស្ថាន» សំដៅលើអ្វីៗដែលនៅជុំវិញខ្លួនយើង។'
  },
  {
    id: 5,
    question: 'ចូរជ្រើសរើសពាក្យដែលសរសេរត្រូវអក្ខរាវិរុទ្ធខ្មែរ៖',
    correct: 'រតនគិរី',
    wrongs: ['រតនៈគិរី', 'រតនគីរី', 'រតនគ្គិរី'],
    explanation: '«រតនគិរី» ឈ្មោះខេត្តសម្បូរត្បូង និងរ៉ែធម្មជាតិ។'
  }
];

export const GamesTab: React.FC<GamesTabProps> = ({
  quizzes = [],
  onPlayQuiz,
  onShowToast
}) => {
  const [selectedGame, setSelectedGame] = useState<string>('hub'); // 'hub', 'math', 'pairs', 'sentence', 'spelling'
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Audio helper with sound toggle check
  const playSfx = (type: 'correct' | 'wrong' | 'combo' | 'win' | 'click' | 'countdown') => {
    if (soundEnabled) {
      playSynthesizerSound(type);
    }
  };

  // ================= GAME 1: MATH SPEED SPRINT STATE =================
  const [mathLevel, setMathLevel] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [mathState, setMathState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [mathScore, setMathScore] = useState<number>(0);
  const [mathStreak, setMathStreak] = useState<number>(0);
  const [mathMaxStreak, setMathMaxStreak] = useState<number>(0);
  const [mathTimer, setMathTimer] = useState<number>(30);
  const [currentMathQuestion, setCurrentMathQuestion] = useState<MathQuestion | null>(null);
  const [mathAnswerFeedback, setMathAnswerFeedback] = useState<{ isCorrect: boolean; selected: number } | null>(null);
  const mathTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startMathGame = () => {
    setMathScore(0);
    setMathStreak(0);
    setMathMaxStreak(0);
    setMathTimer(30);
    setMathAnswerFeedback(null);
    setCurrentMathQuestion(generateMathQuestion(mathLevel));
    setMathState('playing');
    playSfx('click');
  };

  useEffect(() => {
    if (mathState === 'playing') {
      mathTimerRef.current = setInterval(() => {
        setMathTimer((prev) => {
          if (prev <= 1) {
            clearInterval(mathTimerRef.current as NodeJS.Timeout);
            setMathState('ended');
            playSfx('win');
            return 0;
          }
          if (prev <= 5) {
            playSfx('countdown');
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (mathTimerRef.current) clearInterval(mathTimerRef.current);
    };
  }, [mathState]);

  const handleMathAnswer = (val: number) => {
    if (!currentMathQuestion || mathAnswerFeedback || mathState !== 'playing') return;

    const isCorrect = val === currentMathQuestion.answer;
    setMathAnswerFeedback({ isCorrect, selected: val });

    if (isCorrect) {
      const newStreak = mathStreak + 1;
      const points = 10 + newStreak * 2;
      setMathScore((prev) => prev + points);
      setMathStreak(newStreak);
      setMathMaxStreak((prev) => Math.max(prev, newStreak));
      if (newStreak >= 3) {
        playSfx('combo');
      } else {
        playSfx('correct');
      }
    } else {
      setMathStreak(0);
      playSfx('wrong');
    }

    setTimeout(() => {
      setMathAnswerFeedback(null);
      setCurrentMathQuestion(generateMathQuestion(mathLevel));
    }, 450);
  };

  // ================= GAME 2: WORD PAIRS MATCH STATE =================
  interface CardItem {
    id: string;
    pairId: number;
    text: string;
    label: string;
    isFlipped: boolean;
    isMatched: boolean;
  }

  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<CardItem[]>([]);
  const [pairScore, setPairScore] = useState<number>(0);
  const [pairMoves, setPairMoves] = useState<number>(0);
  const [isPairWon, setIsPairWon] = useState<boolean>(false);

  const initPairsGame = () => {
    // Pick 6 random pairs
    const shuffledPairs = [...WORD_PAIRS].sort(() => Math.random() - 0.5).slice(0, 6);
    const cardDeck: CardItem[] = [];

    shuffledPairs.forEach((p, idx) => {
      cardDeck.push({
        id: `card_${idx}_1`,
        pairId: p.pairId,
        text: p.text1,
        label: p.label,
        isFlipped: false,
        isMatched: false
      });
      cardDeck.push({
        id: `card_${idx}_2`,
        pairId: p.pairId,
        text: p.text2,
        label: p.label,
        isFlipped: false,
        isMatched: false
      });
    });

    setCards(cardDeck.sort(() => Math.random() - 0.5));
    setSelectedCards([]);
    setPairScore(0);
    setPairMoves(0);
    setIsPairWon(false);
    playSfx('click');
  };

  const handleCardClick = (card: CardItem) => {
    if (card.isFlipped || card.isMatched || selectedCards.length >= 2) return;

    playSfx('click');
    const updatedCards = cards.map((c) => (c.id === card.id ? { ...c, isFlipped: true } : c));
    setCards(updatedCards);

    const newSelected = [...selectedCards, card];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setPairMoves((m) => m + 1);
      const [first, second] = newSelected;
      if (first.pairId === second.pairId) {
        // MATCHED!
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.pairId === first.pairId ? { ...c, isMatched: true, isFlipped: true } : c))
          );
          setSelectedCards([]);
          setPairScore((s) => s + 20);
          playSfx('combo');

          // Check if all matched
          const remaining = updatedCards.filter((c) => !c.isMatched && c.pairId !== first.pairId);
          if (remaining.length === 0) {
            setIsPairWon(true);
            playSfx('win');
          }
        }, 500);
      } else {
        // WRONG MATCH
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.id === first.id || c.id === second.id ? { ...c, isFlipped: false } : c))
          );
          setSelectedCards([]);
          playSfx('wrong');
        }, 900);
      }
    }
  };

  // ================= GAME 3: SENTENCE SCRAMBLE STATE =================
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(0);
  const [scrambledWords, setScrambledWords] = useState<string[]>([]);
  const [userPlacedWords, setUserPlacedWords] = useState<string[]>([]);
  const [isSentenceCorrect, setIsSentenceCorrect] = useState<boolean | null>(null);
  const [sentenceScore, setSentenceScore] = useState<number>(0);

  const initSentenceChallenge = (idx: number) => {
    const chal = SENTENCE_CHALLENGES[idx % SENTENCE_CHALLENGES.length];
    const shuffled = [...chal.sentence].sort(() => Math.random() - 0.5);
    setScrambledWords(shuffled);
    setUserPlacedWords([]);
    setIsSentenceCorrect(null);
    playSfx('click');
  };

  const handlePickWord = (word: string, indexInScrambled: number) => {
    playSfx('click');
    setUserPlacedWords((prev) => [...prev, word]);
    setScrambledWords((prev) => prev.filter((_, i) => i !== indexInScrambled));
  };

  const handleRemovePlacedWord = (word: string, indexInPlaced: number) => {
    playSfx('click');
    setScrambledWords((prev) => [...prev, word]);
    setUserPlacedWords((prev) => prev.filter((_, i) => i !== indexInPlaced));
    setIsSentenceCorrect(null);
  };

  const handleCheckSentence = () => {
    const chal = SENTENCE_CHALLENGES[currentSentenceIndex % SENTENCE_CHALLENGES.length];
    const isCorrect = JSON.stringify(userPlacedWords) === JSON.stringify(chal.sentence);

    setIsSentenceCorrect(isCorrect);
    if (isCorrect) {
      setSentenceScore((s) => s + 25);
      playSfx('combo');
      if (onShowToast) onShowToast('🎉 អបអរសាទរ! ផ្គុំល្បះត្រឹមត្រូវឥតខ្ចោះ!');
    } else {
      playSfx('wrong');
      if (onShowToast) onShowToast('⚠️ លំដាប់ពាក្យមិនទាន់ត្រូវទេ ចូរសាកល្បងម្តងទៀត!');
    }
  };

  // ================= GAME 4: SPELLING BEE STATE =================
  const [spellingIndex, setSpellingIndex] = useState<number>(0);
  const [spellingScore, setSpellingScore] = useState<number>(0);
  const [spellingFeedback, setSpellingFeedback] = useState<{ isCorrect: boolean; selected: string } | null>(null);
  const [isSpellingFinished, setIsSpellingFinished] = useState<boolean>(false);

  const handleSelectSpelling = (word: string) => {
    if (spellingFeedback) return;
    const currentChal = SPELLING_CHALLENGES[spellingIndex];
    const isCorrect = word === currentChal.correct;

    setSpellingFeedback({ isCorrect, selected: word });
    if (isCorrect) {
      setSpellingScore((s) => s + 20);
      playSfx('correct');
    } else {
      playSfx('wrong');
    }

    setTimeout(() => {
      setSpellingFeedback(null);
      if (spellingIndex + 1 < SPELLING_CHALLENGES.length) {
        setSpellingIndex((idx) => idx + 1);
      } else {
        setIsSpellingFinished(true);
        playSfx('win');
      }
    }, 1200);
  };

  const resetSpelling = () => {
    setSpellingIndex(0);
    setSpellingScore(0);
    setSpellingFeedback(null);
    setIsSpellingFinished(false);
    playSfx('click');
  };

  // Catalog of Games
  const gameCatalog = [
    {
      id: 'math',
      title: 'ល្បែងប្រណាំងគណិតវិទ្យារហ័ស (Math Speed Sprint)',
      khmerSubject: 'គណិតវិទ្យា',
      grade: 'ថ្នាក់ទី ១-៦',
      icon: Calculator,
      color: 'from-blue-600 via-indigo-600 to-cyan-500',
      description: 'គណនាលេខបូក ដក គុណ ចែក ប្រណាំងជាមួយពេលវេលា ៣០ វិនាទី ដណ្តើមពិន្ទុខ្ពស់បំផុត និងដំឡើង Streak!',
      tags: ['គណនារហ័ស', 'បូកដកគុណចែក', 'សប្បាយរីករាយ']
    },
    {
      id: 'pairs',
      title: 'ល្បែងផ្គូផ្គងពាក្យផ្ទុយ & សូរដូច (Khmer Word Pairs Match)',
      khmerSubject: 'ភាសាខ្មែរ',
      grade: 'ថ្នាក់ទី ២-៦',
      icon: BookOpen,
      color: 'from-purple-600 via-pink-600 to-rose-500',
      description: 'ស្វែងរកគូពាក្យផ្ទុយ ពាក្យសូរដូច និងវេយ្យាករណ៍ខ្មែរ ដោយការបើកកាតផ្គូផ្គង បង្កើនការចងចាំ!',
      tags: ['ពាក្យផ្ទុយ', 'ពាក្យសូរដូច', 'ពង្រឹងការចងចាំ']
    },
    {
      id: 'sentence',
      title: 'ល្បែងផ្គុំល្បះខ្មែរ (Khmer Sentence Scramble Relay)',
      khmerSubject: 'ភាសាខ្មែរ',
      grade: 'ថ្នាក់ទី ៤-៦',
      icon: ListOrdered,
      color: 'from-emerald-600 via-teal-600 to-emerald-500',
      description: 'តម្រៀបពាក្យដែលច្របល់គ្នាឱ្យក្លាយជាល្បះត្រឹមត្រូវតាមក្បួនវេយ្យាករណ៍ និងអត្ថន័យពេញលេញ!',
      tags: ['វេយ្យាករណ៍', 'តែងល្បះ', 'គុណនាម']
    },
    {
      id: 'spelling',
      title: 'ល្បែងប្រកួតអក្ខរាវិរុទ្ធខ្មែរ (Khmer Spelling Bee Challenge)',
      khmerSubject: 'ភាសាខ្មែរ',
      grade: 'ថ្នាក់ទី ៣-៦',
      icon: Sparkles,
      color: 'from-amber-500 via-orange-600 to-red-500',
      description: 'ជ្រើសរើសពាក្យដែលសរសេរត្រូវអក្ខរាវិរុទ្ធតាមវចនានុក្រមសម្តេចព្រះសង្ឃរាជ ជួន ណាត!',
      tags: ['អក្ខរាវិរុទ្ធ', 'សរសេរតាមអាន', 'វាក្យសព្ទ']
    }
  ];

  const filteredGames = gameCatalog.filter((g) => {
    const matchSubject = subjectFilter === 'all' || g.khmerSubject === subjectFilter;
    const matchSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchSubject && matchSearch;
  });

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-2xl border border-purple-500/20">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -top-12 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Gamepad2 className="w-4 h-4 animate-bounce" />
              <span>មជ្ឈមណ្ឌលល្បែងសិក្សាអន្តរកម្ម • Interactive Educational Games</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-kantumruy tracking-tight">
              ល្បែងសិក្សាអន្តរកម្មបឋមសិក្សា 🎮
            </h1>
            <p className="text-sm sm:text-base text-purple-200/90 leading-relaxed">
              រួមបញ្ចូលល្បែងសិក្សាឌីជីថលសម្រាប់មុខវិជ្ជាភាសាខ្មែរ គណិតវិទ្យា វិទ្យាសាស្ត្រ និងការប្រកួតប្រជែងចំណេះដឹងក្នុងថ្នាក់រៀន
            </p>
          </div>

          {/* Sound & Action Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playSynthesizerSound('click');
              }}
              title={soundEnabled ? 'បិទសំឡេង' : 'បើកសំឡេង'}
              className={`p-3 rounded-2xl border transition-all flex items-center gap-2 font-bold text-xs ${
                soundEnabled
                  ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 shadow-lg shadow-amber-400/10'
                  : 'bg-white/10 text-slate-300 border-white/10'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              <span>{soundEnabled ? 'សំឡេងបើក' : 'សំឡេងបិទ'}</span>
            </button>

            {selectedGame !== 'hub' && (
              <button
                onClick={() => {
                  setSelectedGame('hub');
                  playSfx('click');
                }}
                className="px-4 py-2.5 rounded-2xl bg-white text-purple-950 font-black text-xs hover:bg-amber-300 transition-all flex items-center gap-1.5 shadow-md active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>ត្រឡប់ទៅមជ្ឈមណ្ឌល</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================= VIEW 1: GAMES HUB / SELECTOR ================= */}
      {selectedGame === 'hub' && (
        <div className="space-y-6">
          {/* Filters & Search */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ស្វែងរកល្បែងសិក្សា..."
                  className="w-full pl-10 pr-4 py-2 text-xs font-medium rounded-2xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-purple-500 text-slate-800 dark:text-slate-100"
                />
              </div>

              {/* Subject Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1 sm:pb-0">
                {[
                  { id: 'all', label: 'ទាំងអស់' },
                  { id: 'ភាសាខ្មែរ', label: 'ភាសាខ្មែរ' },
                  { id: 'គណិតវិទ្យា', label: 'គណិតវិទ្យា' },
                  { id: 'វិទ្យាសាស្ត្រ', label: 'វិទ្យាសាស្ត្រ' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setSubjectFilter(tab.id);
                      playSfx('click');
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      subjectFilter === tab.id
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredGames.map((game) => {
              const Icon = game.icon;
              return (
                <motion.div
                  key={game.id}
                  whileHover={{ y: -4 }}
                  className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-[11px] font-black bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                          {game.khmerSubject}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {game.grade}
                        </span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {game.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                        {game.description}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {game.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Play Button */}
                  <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      អន្តរកម្មលើទូរស័ព្ទ / កុំព្យូទ័រ
                    </span>
                    <button
                      onClick={() => {
                        setSelectedGame(game.id);
                        if (game.id === 'math') startMathGame();
                        if (game.id === 'pairs') initPairsGame();
                        if (game.id === 'sentence') initSentenceChallenge(0);
                        if (game.id === 'spelling') resetSpelling();
                      }}
                      className={`px-5 py-2.5 rounded-2xl bg-gradient-to-r ${game.color} text-white font-black text-xs shadow-md hover:shadow-lg flex items-center gap-2 transition-all active:scale-95`}
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>ចាប់ផ្តើមលេង</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Kahoot-Style Quizzes Integration */}
          {quizzes.length > 0 && (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-indigo-950/40 rounded-3xl p-6 border border-indigo-100 dark:border-indigo-900/50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white text-base">
                      កម្រងសំណួរ Kahoot! Quiz ក្នុងប្រព័ន្ធ ({quizzes.length} តេស្ត)
                    </h3>
                    <p className="text-xs text-slate-500">បើកលេងជាល្បែងប្រកួតផ្ទាល់ក្នុងថ្នាក់រៀនដោយប្រើ Game PIN</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                {quizzes.slice(0, 6).map((quiz) => (
                  <div
                    key={quiz.id}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between gap-3 shadow-xs hover:shadow-md transition-shadow"
                  >
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">{quiz.title}</h4>
                      <p className="text-[11px] text-slate-500">{quiz.subject} • {quiz.questions?.length || 0} សំណួរ</p>
                    </div>
                    {onPlayQuiz && (
                      <button
                        onClick={() => onPlayQuiz(quiz)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-[11px] hover:bg-indigo-700 transition flex items-center gap-1 shrink-0"
                      >
                        <Play className="w-3 h-3 fill-white" />
                        <span>លេង</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= GAME 1 PLAY: MATH SPEED SPRINT ================= */}
      {selectedGame === 'math' && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800 space-y-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl text-xs font-black bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200">
                កម្រិត ៖ {mathLevel === 'easy' ? 'ងាយ' : mathLevel === 'medium' ? 'មធ្យម' : 'កម្រិតខ្ពស់'}
              </span>
              <div className="flex items-center gap-1 text-amber-500 font-black text-xs">
                <Flame className="w-4 h-4 fill-amber-500" />
                <span>Streak: {mathStreak} (Max: {mathMaxStreak})</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-300 font-black text-sm">
                <Clock className="w-4 h-4" />
                <span>{mathTimer} វិនាទី</span>
              </div>
              <div className="px-3 py-1 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-black text-sm">
                ពិន្ទុ: {mathScore}
              </div>
            </div>
          </div>

          {/* Level Switcher */}
          {mathState !== 'playing' && (
            <div className="flex items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800">
              {(['easy', 'medium', 'hard'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    setMathLevel(lvl);
                    playSfx('click');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    mathLevel === lvl
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {lvl === 'easy' ? 'ថ្នាក់ទី ១-២ (ងាយ)' : lvl === 'medium' ? 'ថ្នាក់ទី ៣-៤ (មធ្យម)' : 'ថ្នាក់ទី ៥-៦ (កម្រិតខ្ពស់)'}
                </button>
              ))}
            </div>
          )}

          {/* Game Body */}
          {mathState === 'playing' && currentMathQuestion && (
            <div className="space-y-6 text-center py-4">
              <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-950/40 border border-blue-100 dark:border-blue-900 flex items-center justify-center">
                <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white font-kahoot tracking-wider">
                  {currentMathQuestion.num1} {currentMathQuestion.op} {currentMathQuestion.num2} = ?
                </span>
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-4">
                {currentMathQuestion.options.map((opt, idx) => {
                  let btnBg = 'bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white border-2 border-slate-200 dark:border-slate-700';
                  if (mathAnswerFeedback) {
                    if (opt === currentMathQuestion.answer) {
                      btnBg = 'bg-emerald-500 text-white border-2 border-emerald-600 scale-105 shadow-lg';
                    } else if (opt === mathAnswerFeedback.selected && !mathAnswerFeedback.isCorrect) {
                      btnBg = 'bg-rose-500 text-white border-2 border-rose-600';
                    }
                  }

                  return (
                    <motion.button
                      key={idx}
                      whileTap={{ scale: 0.96 }}
                      disabled={!!mathAnswerFeedback}
                      onClick={() => handleMathAnswer(opt)}
                      className={`p-5 rounded-2xl text-2xl sm:text-3xl font-black font-kahoot transition-all shadow-sm ${btnBg}`}
                    >
                      {opt}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ended State */}
          {mathState === 'ended' && (
            <div className="text-center py-8 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-400 text-purple-950 flex items-center justify-center shadow-xl">
                <Trophy className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">ចប់ម៉ោងប្រកួត! 🎉</h2>
              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-slate-800 max-w-sm mx-auto space-y-2">
                <p className="text-sm text-slate-600 dark:text-slate-400">ពិន្ទុសរុបដែលសម្រេចបាន៖</p>
                <p className="text-4xl font-black text-purple-600 dark:text-purple-400 font-kahoot">{mathScore} ពិន្ទុ</p>
                <p className="text-xs text-amber-600 font-bold">🔥 Combo Streak ខ្ពស់បំផុត ៖ {mathMaxStreak} ជាប់ៗគ្នា</p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  onClick={startMathGame}
                  className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-black text-sm hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>លេងម្តងទៀត</span>
                </button>
              </div>
            </div>
          )}

          {/* Idle State */}
          {mathState === 'idle' && (
            <div className="text-center py-6 space-y-4">
              <button
                onClick={startMathGame}
                className="px-8 py-4 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white font-black text-base shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3 mx-auto"
              >
                <Play className="w-6 h-6 fill-white" />
                <span>ចាប់ផ្តើមប្រណាំង ៣០ វិនាទី!</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================= GAME 2 PLAY: WORD PAIRS MATCH ================= */}
      {selectedGame === 'pairs' && (
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">🃏 ល្បែងផ្គូផ្គងពាក្យផ្ទុយ & សូរដូច</h2>
              <p className="text-xs text-slate-500">បើកកាត ២ ដើម្បីស្វែងរកគូពាក្យត្រូវគ្នា</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-xs">
                ចលនា៖ {pairMoves}
              </span>
              <span className="px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-black text-xs">
                ពិន្ទុ៖ {pairScore}
              </span>
              <button
                onClick={initPairsGame}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                title="ចាប់ផ្តើមថ្មី"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
            {cards.map((card) => {
              const isRevealed = card.isFlipped || card.isMatched;
              return (
                <motion.button
                  key={card.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCardClick(card)}
                  className={`h-28 rounded-2xl p-3 flex flex-col items-center justify-center text-center transition-all duration-300 relative border-2 ${
                    card.isMatched
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 opacity-90'
                      : isRevealed
                      ? 'bg-white dark:bg-slate-800 border-purple-500 text-slate-900 dark:text-white shadow-lg'
                      : 'bg-gradient-to-br from-purple-700 to-indigo-900 border-transparent text-white shadow-md hover:scale-102'
                  }`}
                >
                  {isRevealed ? (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 block">
                        [{card.label}]
                      </span>
                      <span className="text-xs sm:text-sm font-black leading-snug">{card.text}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1 opacity-75">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      <span className="text-[11px] font-black tracking-widest font-kahoot">KHMER</span>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {isPairWon && (
            <div className="text-center p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 space-y-3">
              <PartyPopper className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-xl font-black text-emerald-900 dark:text-emerald-100">🎉 ជ័យជម្នះ! បានផ្គូផ្គងគ្រប់គូទាំងអស់!</h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">អ្នកបានប្រើ {pairMoves} លើក និងទទួលបាន {pairScore} ពិន្ទុ!</p>
              <button
                onClick={initPairsGame}
                className="px-6 py-2.5 rounded-2xl bg-emerald-600 text-white font-black text-xs hover:bg-emerald-700 transition"
              >
                លេងជុំបន្ទាប់
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================= GAME 3 PLAY: SENTENCE BUILDER ================= */}
      {selectedGame === 'sentence' && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                🧩 ល្បែងផ្គុំល្បះខ្មែរ (លំហាត់ទី {currentSentenceIndex + 1}/{SENTENCE_CHALLENGES.length})
              </h2>
              <p className="text-xs text-purple-600 font-bold">
                {SENTENCE_CHALLENGES[currentSentenceIndex % SENTENCE_CHALLENGES.length].title}
              </p>
            </div>
            <div className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 font-black text-xs">
              ពិន្ទុ: {sentenceScore}
            </div>
          </div>

          {/* Target Placement Area */}
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border-2 border-dashed border-slate-300 dark:border-slate-700 min-h-28 flex flex-wrap items-center justify-center gap-2">
            {userPlacedWords.length === 0 ? (
              <span className="text-xs text-slate-400 font-medium">ចុចលើពាក្យខាងក្រោមដើម្បីតម្រៀបល្បះនៅទីនេះ...</span>
            ) : (
              userPlacedWords.map((word, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRemovePlacedWord(word, idx)}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 text-white font-black text-sm shadow-md hover:bg-rose-600 transition-all active:scale-95 flex items-center gap-1 group"
                >
                  <span>{word}</span>
                  <span className="text-[10px] opacity-70 group-hover:opacity-100">✕</span>
                </button>
              ))
            )}
          </div>

          {/* Scrambled Source Words */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-500">ពាក្យដែលត្រូវរើស ៖</p>
            <div className="flex flex-wrap gap-2 justify-center p-4 rounded-2xl bg-purple-50/50 dark:bg-slate-800">
              {scrambledWords.map((word, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePickWord(word, idx)}
                  className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-700 border border-purple-200 dark:border-purple-800 text-slate-900 dark:text-white font-black text-sm hover:border-purple-500 hover:scale-105 transition-all shadow-xs"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => initSentenceChallenge(currentSentenceIndex)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-200"
            >
              រៀបចំឡើងវិញ
            </button>

            <div className="flex items-center gap-2">
              <button
                disabled={userPlacedWords.length === 0}
                onClick={handleCheckSentence}
                className="px-6 py-2.5 rounded-2xl bg-purple-600 text-white font-black text-xs hover:bg-purple-700 transition shadow-md disabled:opacity-50"
              >
                ផ្ទៀងផ្ទាត់ចម្លើយ
              </button>

              {isSentenceCorrect && (
                <button
                  onClick={() => {
                    const nextIdx = (currentSentenceIndex + 1) % SENTENCE_CHALLENGES.length;
                    setCurrentSentenceIndex(nextIdx);
                    initSentenceChallenge(nextIdx);
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-emerald-600 text-white font-black text-xs hover:bg-emerald-700 transition flex items-center gap-1 shadow-md"
                >
                  <span>លំហាត់បន្ទាប់</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= GAME 4 PLAY: SPELLING BEE ================= */}
      {selectedGame === 'spelling' && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                🐝 ល្បែងប្រកួតអក្ខរាវិរុទ្ធខ្មែរ (សំណួរទី {spellingIndex + 1}/{SPELLING_CHALLENGES.length})
              </h2>
              <p className="text-xs text-slate-500">ស្វែងរកពាក្យដែលសរសេរត្រឹមត្រូវតាមវចនានុក្រមខ្មែរ</p>
            </div>
            <div className="px-3.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-black text-sm">
              ពិន្ទុ: {spellingScore}
            </div>
          </div>

          {!isSpellingFinished ? (
            <div className="space-y-5">
              <div className="p-6 rounded-2xl bg-amber-50/60 dark:bg-slate-800 border border-amber-200 dark:border-amber-900/40 text-center">
                <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {SPELLING_CHALLENGES[spellingIndex].question}
                </span>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  SPELLING_CHALLENGES[spellingIndex].correct,
                  ...SPELLING_CHALLENGES[spellingIndex].wrongs
                ]
                  .sort(() => 0.5 - Math.random()) // randomized display
                  .map((word, idx) => {
                    let btnStyle = 'bg-white dark:bg-slate-800 hover:border-amber-400 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700';

                    if (spellingFeedback) {
                      if (word === SPELLING_CHALLENGES[spellingIndex].correct) {
                        btnStyle = 'bg-emerald-500 text-white border-2 border-emerald-600 font-black scale-102';
                      } else if (word === spellingFeedback.selected && !spellingFeedback.isCorrect) {
                        btnStyle = 'bg-rose-500 text-white border-2 border-rose-600';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={!!spellingFeedback}
                        onClick={() => handleSelectSpelling(word)}
                        className={`p-4 rounded-2xl text-base sm:text-lg font-black transition-all shadow-xs flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{word}</span>
                        {spellingFeedback && word === SPELLING_CHALLENGES[spellingIndex].correct && (
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        )}
                      </button>
                    );
                  })}
              </div>

              {spellingFeedback && (
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  💡 {SPELLING_CHALLENGES[spellingIndex].explanation}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-400 text-purple-950 flex items-center justify-center shadow-lg">
                <Trophy className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">🎉 អបអរសាទរ! បានបញ្ចប់ការប្រកួតអក្ខរាវិរុទ្ធ!</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">ពិន្ទុដែលទទួលបាន ៖ <span className="font-black text-purple-600">{spellingScore} ពិន្ទុ</span></p>
              <button
                onClick={resetSpelling}
                className="px-6 py-2.5 rounded-2xl bg-purple-600 text-white font-black text-xs hover:bg-purple-700 transition"
              >
                លេងម្តងទៀត
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
