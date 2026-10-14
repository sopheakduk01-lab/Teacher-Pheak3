import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Volume2,
  VolumeX,
  Sparkles,
  Maximize2,
  Minimize2,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Award,
  HelpCircle,
  Lightbulb,
  Trophy,
  Check,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScienceLesson1InteractiveViewerProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'hero' | 'dispersal' | 'adaptation' | 'defense' | 'lab' | 'match' | 'quiz';
  onShowToast?: (msg: string) => void;
}

type TabType = 'hero' | 'dispersal' | 'adaptation' | 'defense' | 'lab' | 'match' | 'quiz';
type OrganType = 'root' | 'stem' | 'leaf';
type DispersalType = 'wind' | 'water' | 'animal' | 'human';
type HabitatType = 'water' | 'forest' | 'desert';

export const ScienceLesson1InteractiveViewer: React.FC<ScienceLesson1InteractiveViewerProps> = ({
  isOpen,
  onClose,
  initialTab = 'hero',
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Organ Inspector State
  const [selectedOrgan, setSelectedOrgan] = useState<OrganType>('root');

  // Dispersal Agent State
  const [selectedDispersal, setSelectedDispersal] = useState<DispersalType>('wind');

  // Habitat Tab State
  const [activeHabitat, setActiveHabitat] = useState<HabitatType>('water');

  // Virtual Lab Simulation State
  const [heatLevel, setHeatLevel] = useState<number>(2); // 1 = cool, 2 = medium, 3 = extreme
  const [isCurled, setIsCurled] = useState<boolean>(false);
  const [isWax, setIsWax] = useState<boolean>(false);
  const [isDropped, setIsDropped] = useState<boolean>(false);

  // Matching Game State
  const [matchSelections, setMatchSelections] = useState<Record<number, string>>({
    1: '',
    2: '',
    3: '',
    4: '',
    5: '',
  });
  const [matchResults, setMatchResults] = useState<Record<number, boolean>>({});

  // 40 QCM Quiz State
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [answeredQuiz, setAnsweredQuiz] = useState<Record<number, number>>({});
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);

  // Update initial tab when opening
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    }
  }, [isOpen, initialTab]);

  // Audio tone synthesizer using Web Audio API
  const playTone = (type: 'correct' | 'wrong' | 'click') => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'correct') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.15);
        osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.3);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(180, now + 0.25);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      }
    } catch {
      // AudioContext unavailable or blocked by autoplay
    }
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  const addScore = (points: number) => {
    setTotalScore((prev) => Math.min(100, prev + points));
  };

  // Text to Speech
  const toggleReadAloud = () => {
    if (!('speechSynthesis' in window)) {
      onShowToast?.('Browser របស់អ្នកមិនគាំទ្រមុខងារអានជាសំឡេងឡើយ។');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    let textToRead = 'មេរៀនទី ១ ៖ ការសម្របខ្លួនរបស់រុក្ខជាតិ វិទ្យាសាស្ត្រថ្នាក់ទី ៦។';
    if (activeTab === 'hero') {
      textToRead = 'មេរៀនទី ១ ៖ ការសម្របខ្លួនរបស់រុក្ខជាតិ។ គ្រប់ភាវៈមានជីវិតទាំងអស់អាចលូតលាស់និងបន្តពូជបាន។ កន្លែងដែលរុក្ខជាតិដុះលូតលាស់ត្រូវបានហៅថា ជម្រក។';
    } else if (activeTab === 'dispersal') {
      textToRead = 'របៀបពង្រាយគ្រាប់របស់រុក្ខជាតិ។ រុក្ខជាតិភាគច្រើនដុះលូតលាស់ចេញពីគ្រាប់។ ភ្នាក់ងារទាំង ៤ រួមមាន ខ្យល់ ចរន្តទឹក សត្វ និងមនុស្ស។';
    } else if (activeTab === 'adaptation') {
      textToRead = 'ការសម្របខ្លួនរបស់រុក្ខជាតិទៅតាមជម្រក។ ជម្រកក្នុងទឹកដូចជាកំប្លោកនិងឈូក។ ជម្រកព្រៃឈើ និងជម្រកវាលខ្សាច់ដូចជាដើមដំបងយក្ស។';
    } else if (activeTab === 'defense') {
      textToRead = 'ការការពារខ្លួនរបស់រុក្ខជាតិ។ រុក្ខជាតិបង្កើតបន្លាស្រួច រោមរមាស់ ឬជាតិពុលដើម្បីទប់ទល់មនុស្សនិងសត្វ និងជម្រុះស្លឹកឬខួរស្លឹកដើម្បីទប់ទល់នឹងកម្ដៅថ្ងៃ។';
    } else if (activeTab === 'lab') {
      textToRead = 'មន្ទីរពិសោធន៍និម្មិតរំហួតទឹក និងកម្ដៅថ្ងៃ។ ការប្រៀបធៀបដើមត្រែង និងដើមឈូក។';
    } else if (activeTab === 'match') {
      textToRead = 'ល្បែងផ្គូផ្គងឈ្មោះរុក្ខជាតិ និងឈ្មោះជម្រកទំព័រទី ៧។';
    } else if (activeTab === 'quiz') {
      textToRead = `សំណួរទី ${currentQuizIndex + 1}៖ ${fullQuizList[currentQuizIndex]?.question || ''}`;
    }

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'km-KH';
    utterance.rate = 0.9;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // Organ Data
  const organInfoMap: Record<OrganType, { title: string; desc: string; icon: string }> = {
    root: {
      title: '១. តួនាទីឫស (Roots)',
      desc: 'ឫសមានតួនាទីសំខាន់ក្នុងការស្រូបយកទឹក និងជីវជាតិ។ រុក្ខជាតិទឹក (ឈូក កំប្លោក) មានឫសខ្លីៗព្រោះងាយស្រួលស្រូបទឹកដែលមានស្រាប់។ ចំណែករុក្ខជាតិវាលខ្សាច់ (ដំបងយក្ស) មានឫសវែងៗចាក់ជ្រៅទៅក្រោមដី ដើម្បីស្វែងរកប្រភពទឹកក្រោមដី។ ឯដើមត្រែងមានឫសញឹកស្ញកដើម្បីទប់លំនឹងដើមក្នុងភក់។',
      icon: 'fa-network-wired',
    },
    stem: {
      title: '២. តួនាទីដើម (Stem)',
      desc: 'រុក្ខជាតិទឹកមានដើមប្រហោងខ្យល់ច្រើន ឬប៉ោង ដើម្បីជួយឱ្យដើមស្រាលអណ្តែតលើផ្ទៃទឹក និងសម្រាប់ចរន្តខ្យល់ឆ្លងកាត់ភ្ជាប់ទៅស្លឹក។ រុក្ខជាតិវាលខ្សាច់មានដើមសាច់ថ្លោសផ្ទុកជាតិទឹកច្រើន ជួយឱ្យរស់បានក្នុងរដូវរាំងស្ងួតយូរអង្វែង។',
      icon: 'fa-cubes-stacked',
    },
    leaf: {
      title: '៣. តួនាទីស្លឹក (Leaves)',
      desc: 'ស្លឹកដើរតួស្រូបយកពន្លឺព្រះអាទិត្យដើម្បីធ្វើរស្មីសំយោគ (ផលិតអាហារ)។ នៅរដូវប្រាំង រុក្ខជាតិខ្លះខួរស្លឹក ឬជម្រុះស្លឹកចោលអស់ ហើយរុក្ខជាតិវាលខ្សាច់បានប្លែងស្លឹកទៅជាបន្លា ដើម្បីការពារកុំឱ្យបាត់បង់ចំហាយទឹក។',
      icon: 'fa-leaf',
    },
  };

  // Dispersal Data
  const dispersalInfoMap: Record<DispersalType, { num: string; title: string; bg: string; icon: string; text: string; example: string }> = {
    wind: {
      num: '១',
      title: 'ការពង្រាយគ្រាប់ដោយខ្យល់ (Wind Dispersal)',
      bg: 'bg-sky-500',
      icon: 'fa-wind',
      text: 'ខ្យល់បក់បោកគ្រាប់រុក្ខជាតិដែលតូចៗ ស្រាល ឬមានស្លាប/រោម ឱ្យហោះហើររសាត់ទៅកាន់ទីឆ្ងាយ (ដូចជាគ្រាប់ដើមស្មៅ ផ្កាម៉ោងដប់ គ្រាប់ឈើព្រៃមួយចំនួន)។ នៅពេលខ្យល់ស្ងប់ គ្រាប់ធ្លាក់ចុះលើដីមានសំណើមរួចដុះពន្លកជាកូនរុក្ខជាតិថ្មី។',
      example: 'រូបភាពដើមឈើធំដែលខ្យល់បក់គ្រាប់ហោះជាជួរនៅលើអាកាស (សៀវភៅពុម្ពទំព័រទី ២)។',
    },
    water: {
      num: '២',
      title: 'ការពង្រាយគ្រាប់ដោយចរន្តទឹក (Water Dispersal)',
      bg: 'bg-cyan-600',
      icon: 'fa-water',
      text: 'រុក្ខជាតិដែលដុះក្បែរមាត់ស្ទឹង បឹង ទន្លេ ឬសមុទ្រ (ដូចជាផ្លែដូង ផ្លែឈូក កំប្លោក) តែងទម្លាក់ផ្លែឬគ្រាប់ចូលក្នុងទឹក។ ផ្លែទាំងនោះមានសំបកក្រាស់ មិនជ្រាបទឹក និងស្រាល អាចអណ្តែតតាមចរន្តទឹកទៅដុះនៅច្រាំងឆ្ងាយៗ។',
      example: 'ផ្លែឈូក និងផ្លែដូង ដែលអណ្តែតលើទឹកសាប និងទឹកប្រៃ។',
    },
    animal: {
      num: '៣',
      title: 'ការពង្រាយគ្រាប់ដោយសត្វ (Animal Dispersal)',
      bg: 'bg-amber-500',
      icon: 'fa-paw',
      text: 'សត្វកំប្រុក សត្វស្លាប ឬសត្វព្រៃស៊ីផ្លែឈើដែលមានរសជាតិឆ្ងាញ់ រួចទម្លាក់គ្រាប់ចោល ឬបញ្ចេញគ្រាប់មកក្រៅតាមលាមក។ គ្រាប់ខ្លះទៀតមានបន្លាឬទំពក់ស្អិតជាប់នឹងរោមសត្វ ហើយត្រូវបានសត្វនាំយកទៅទីឆ្ងាយ។',
      example: 'សត្វកំប្រុកពាំគ្រាប់ ឬសត្វស្លាបស៊ីផ្លែឈើរួចបន្ទោបង់គ្រាប់។',
    },
    human: {
      num: '៤',
      title: 'ការពង្រាយគ្រាប់ដោយមនុស្ស (Human Dispersal)',
      bg: 'bg-emerald-600',
      icon: 'fa-person-digging',
      text: 'មនុស្សជាភ្នាក់ងារពង្រាយគ្រាប់យ៉ាងទូលំទូលាយបំផុត តាមរយៈការធ្វើកសិកម្ម សាបព្រោះគ្រាប់ពូជស្រូវ បន្លែផ្លែឈើ និងការដោះដូរដឹកជញ្ជូនដំណាំកសិកម្មឆ្លងកាត់ពីខេត្តមួយទៅខេត្តមួយ ឬឆ្លងប្រទេស។',
      example: 'ការសាបព្រោះស្រូវ ការដាំដំណាំកសិកម្ម និងការដោះដូរពូជដំណាំ។',
    },
  };

  // Virtual Lab Simulation Calculation
  let baseLossRate = heatLevel === 1 ? 25 : heatLevel === 2 ? 60 : 100;
  if (isCurled) baseLossRate -= 20;
  if (isWax) baseLossRate -= 20;
  if (isDropped) baseLossRate -= 45;
  const currentWaterLoss = Math.max(5, Math.min(100, baseLossRate));

  // Matching Game Verification
  const matchSolutions: Record<number, string> = {
    1: 'forest',
    2: 'forest',
    3: 'mangrove',
    4: 'flood',
    5: 'desert',
  };

  const handleMatchChange = (plantId: number, selectedValue: string) => {
    setMatchSelections((prev) => ({ ...prev, [plantId]: selectedValue }));
    if (!selectedValue) return;

    if (selectedValue === matchSolutions[plantId]) {
      playTone('correct');
      setMatchResults((prev) => {
        const next = { ...prev, [plantId]: true };
        const correctCount = Object.values(next).filter(Boolean).length;
        if (correctCount === 5) {
          triggerConfetti();
          onShowToast?.('អបអរសាទរ! អ្នកបានផ្គូផ្គងជម្រករុក្ខជាតិទាំង ៥ ក្នុងតារាងទំព័រទី ៧ ត្រឹមត្រូវទាំងអស់!');
        }
        return next;
      });
      addScore(4);
    } else {
      playTone('wrong');
      setMatchResults((prev) => ({ ...prev, [plantId]: false }));
    }
  };

  const resetMatchGame = () => {
    playTone('click');
    setMatchSelections({ 1: '', 2: '', 3: '', 4: '', 5: '' });
    setMatchResults({});
    onShowToast?.('បានកំណត់ល្បែងផ្គូផ្គងឡើងវិញ!');
  };

  // 40 QCM Question List
  const fullQuizList = [
    // Q1 -> Correct: A (0)
    {
      question: 'តើកន្លែងដែលរុក្ខជាតិដុះលូតលាស់ត្រូវបានហៅថាអ្វី?',
      options: [
        { text: 'ជម្រក', isCorrect: true, exp: 'ជម្រក ជាកន្លែងដែលរុក្ខជាតិដុះលូតលាស់។' },
        { text: 'ជង្រុក', isCorrect: false, exp: 'ជង្រុក ជាកន្លែងសម្រាប់ស្តុកទុកស្រូវ។' },
        { text: 'សម្បុក', isCorrect: false, exp: 'សម្បុក ជាកន្លែងស្នាក់នៅរបស់សត្វ។' },
        { text: 'កសិដ្ឋាន', isCorrect: false, exp: 'កសិដ្ឋាន ជាកន្លែងដាំដុះរបស់កសិករ។' }
      ],
      hint: 'ពាក្យនេះចាប់ផ្តើមដោយអក្សរ «ជ» មានន័យថាកន្លែងសម្រាប់រស់នៅ។'
    },
    // Q2 -> Correct: B (1)
    {
      question: 'តើភ្នាក់ងារទាំង ៤ ក្នុងការពង្រាយគ្រាប់រុក្ខជាតិរួមមានអ្វីខ្លះ?',
      options: [
        { text: 'ដី ភ្លើង ពន្លឺ និងជីធម្មជាតិ', isCorrect: false, exp: 'ទាំងនេះជាកត្តាលូតលាស់ មិនមែនភ្នាក់ងារទេ។' },
        { text: 'មនុស្ស សត្វ ខ្យល់ និងចរន្តទឹក', isCorrect: true, exp: 'ទាំង ៤ នេះជាភ្នាក់ងារពង្រាយគ្រាប់រុក្ខជាតិ។' },
        { text: 'សត្វល្អិត សំណើម ផ្សែង និងដី', isCorrect: false, exp: 'ផ្សែងនិងសំណើមមិនមែនជាភ្នាក់ងារនាំគ្រាប់ទេ។' },
        { text: 'ភ្លៀង ផ្គរ ម៉ាស៊ីន និងពន្លឺថ្ងៃ', isCorrect: false, exp: 'ផ្គរនិងពន្លឺថ្ងៃមិនមែនជាភ្នាក់ងារនាំគ្រាប់ទេ។' }
      ],
      hint: 'ពិនិត្យចំណុចទី ១ នៃមេរៀនទំព័រទី ២។'
    },
    // Q3 -> Correct: C (2)
    {
      question: 'ហេតុអ្វីបានជារុក្ខជាតិទឹក (កំប្លោក, ឈូក) មានដើមប្រហោង ឬប៉ោង?',
      options: [
        { text: 'ដើម្បីទាក់ទាញសត្វល្អិតមកក្រេបផ្កា', isCorrect: false, exp: 'ផ្កាទេដែលទាក់ទាញសត្វល្អិត មិនមែនដើមទេ។' },
        { text: 'ដើម្បីការពារកុំឱ្យសត្វចង្រៃមកស៊ីដើម', isCorrect: false, exp: 'ដើមប្រហោងមិនអាចការពារសត្វស៊ីបានទេ។' },
        { text: 'ដើម្បីជួយឱ្យស្រាលអណ្តែត និងបញ្ជូនខ្យល់', isCorrect: true, exp: 'ប្រហោងជួយឱ្យស្រាលអណ្តែត និងដឹកនាំខ្យល់។' },
        { text: 'ដើម្បីឱ្យឫសអាចចាក់ជ្រៅទៅក្នុងភក់បាន', isCorrect: false, exp: 'ដើមប្រហោងមិនជួយឱ្យឫសចាក់ជ្រៅទេ។' }
      ],
      hint: 'គិតអំពីលក្ខណៈដែលធ្វើឱ្យកំប្លោកអណ្តែតទឹក។'
    },
    // Q4 -> Correct: D (3)
    {
      question: 'តើដើមដំបងយក្សប្លែងស្លឹកទៅជាអ្វី ដើម្បីរស់នៅវាលខ្សាច់?',
      options: [
        { text: 'ប្លែងទៅជាមែកឈើវែងៗ', isCorrect: false, exp: 'ដំបងយក្សមិនប្លែងស្លឹកជាមែកឈើទេ។' },
        { text: 'ប្លែងទៅជាផ្កាធំៗក្រាស់ៗ', isCorrect: false, exp: 'ផ្កាមាននាទីបន្តពូជ មិនមែនកាត់បន្ថយទឹកទេ។' },
        { text: 'ប្លែងទៅជាឫសខ្យល់តោង', isCorrect: false, exp: 'ឫសខ្យល់ជារបស់រុក្ខជាតិដទៃ មិនមែនដំបងយក្សទេ។' },
        { text: 'ប្លែងទៅជាបន្លាស្រួចៗ', isCorrect: true, exp: 'ស្លឹកប្លែងជាបន្លាដើម្បីកាត់បន្ថយការភាយទឹក។' }
      ],
      hint: 'សរីរាង្គនេះស្រួចៗ ហើយជួយទប់ស្កាត់ការភាយចំហាយទឹក។'
    },
    // Q5 -> Correct: A (0)
    {
      question: 'តើរុក្ខជាតិណាខ្លះដែលជ្រុះស្លឹកអស់នៅរដូវប្រាំង?',
      options: [
        { text: 'ដើមឫស្សី និងដើមក្រញូង', isCorrect: true, exp: 'ឫស្សីនិងក្រញូងជម្រុះស្លឹកដើម្បីទប់ស្កាត់ការហួតទឹក។' },
        { text: 'ដើមកំប្លោក និងដើមឈូក', isCorrect: false, exp: 'រុក្ខជាតិទឹកមិនជម្រុះស្លឹកចោលអស់ទេ។' },
        { text: 'ដើមដំបងយក្ស និងដើមចក', isCorrect: false, exp: 'ដំបងយក្សស្លឹកជាបន្លា ចកដុះក្នុងទឹក។' },
        { text: 'ដើមព្រលឹត និងដើមផ្តៅ', isCorrect: false, exp: 'ព្រលឹតដុះក្នុងទឹក ផ្តៅដុះក្នុងព្រៃ។' }
      ],
      hint: 'រុក្ខជាតិនេះមានដើមជាថ្នាំងៗ និងដុះជាគុម្ព។'
    },
    // Q6 -> Correct: B (1)
    {
      question: 'តើដើមចេកការពារខ្លួនទប់ទល់នឹងកម្ដៅថ្ងៃខ្លាំងដោយវិធីណា?',
      options: [
        { text: 'ដោយការជម្រុះស្លឹកចោលទាំងអស់', isCorrect: false, exp: 'ដើមចេកមិនជម្រុះស្លឹកចោលអស់ដូចឫស្សីទេ។' },
        { text: 'ដោយការខួរស្លឹក (រមូរស្លឹកចូលគ្នា)', isCorrect: true, exp: 'ចេកខួរស្លឹកដើម្បីកាត់បន្ថយផ្ទៃប៉ះពន្លឺថ្ងៃ។' },
        { text: 'ដោយការប្លែងស្លឹកឱ្យក្លាយជាបន្លា', isCorrect: false, exp: 'ចេកមិនប្លែងស្លឹកជាបន្លាស្រួចទេ។' },
        { text: 'ដោយការបញ្ចេញជ័រពុលមកលើផ្លែ', isCorrect: false, exp: 'ជ័រចេកមិនមែនសម្រាប់ទប់ទល់នឹងកម្ដៅទេ។' }
      ],
      hint: 'នៅពេលថ្ងៃក្តៅ ស្លឹកចេករមូរចូលគ្នាក្នុងពេលថ្ងៃត្រង់។'
    },
    // Q7 -> Correct: C (2)
    {
      question: 'តើរុក្ខជាតិណាខ្លះការពារខ្លួនពីសត្វដោយមានបន្លាស្រួច?',
      options: [
        { text: 'ដើមចេក ដើមល្ហុង និងដើមពោត', isCorrect: false, exp: 'រុក្ខជាតិទាំងនេះគ្មានបន្លាស្រួចទេ។' },
        { text: 'ដើមកំប្លោក ដើមចក និងដើមឈូក', isCorrect: false, exp: 'រុក្ខជាតិទឹកទាំងនេះគ្មានបន្លាការពារខ្លួនទេ។' },
        { text: 'ដើមខ្មែរ ដំបងយក្ស ក្រូច និងកុលាប', isCorrect: true, exp: 'រុក្ខជាតិទាំងនេះសុទ្ធតែមានបន្លាការពារខ្លួន។' },
        { text: 'ដើមស្មៅ ដើមត្រែង និងដើមស្លែ', isCorrect: false, exp: 'រុក្ខជាតិទាំងនេះមិនមានបន្លាការពារខ្លួនទេ។' }
      ],
      hint: 'រុក្ខជាតិទាំងនេះមានបន្លាស្រួចចាក់មុតដៃ។'
    },
    // Q8 -> Correct: D (3)
    {
      question: 'តើរុក្ខជាតិការពារខ្លួនពីមនុស្សឬសត្វដោយរបៀបណាខ្លះ?',
      options: [
        { text: 'ផ្លាស់ប្តូរទីតាំងរត់ចេញពីសត្រូវ', isCorrect: false, exp: 'រុក្ខជាតិមិនអាចដើររត់គេចខ្លួនបានទេ។' },
        { text: 'បង្កើតម្លប់ធំដើម្បីលាក់ពួនខ្លួន', isCorrect: false, exp: 'ម្លប់មិនអាចការពារខ្លួនពីសត្វស៊ីបានទេ។' },
        { text: 'ស្រូបយកជីជាតិឱ្យបានលឿនបំផុត', isCorrect: false, exp: 'ការស្រូបជីមិនមែនជាយន្តការការពារខ្លួនទេ។' },
        { text: 'មានបន្លា រោមរមាស់ និងជាតិពុល', isCorrect: true, exp: 'បន្លា រោមរមាស់ និងជាតិពុលជួយការពាររុក្ខជាតិ។' }
      ],
      hint: 'ពិនិត្យចំណុចទី ៣ នៃមេរៀនទំព័រទី ៤។'
    },
    // Q9 -> Correct: A (0)
    {
      question: 'តើឫសរុក្ខជាតិទឹក (កំប្លោក, ឈូក) មានលក្ខណៈដូចម្តេច?',
      options: [
        { text: 'មានឫសខ្លីៗព្រោះងាយស្រួលស្រូបទឹក', isCorrect: true, exp: 'រុក្ខជាតិទឹកមានឫសខ្លីៗព្រោះទឹកនៅជុំវិញស្រាប់។' },
        { text: 'មានឫសវែងៗចាក់ជ្រៅទៅក្រោមដី', isCorrect: false, exp: 'ឫសវែងចាក់ជ្រៅជារបស់រុក្ខជាតិវាលខ្សាច់។' },
        { text: 'មានឫសធំៗសម្រាប់ស្តុកទឹកសន្សើម', isCorrect: false, exp: 'រុក្ខជាតិទឹកមិនចាំបាច់ស្តុកទឹកសន្សើមទេ។' },
        { text: 'គ្មានឫសទាល់តែសោះគ្រប់ប្រភេទ', isCorrect: false, exp: 'កំប្លោកនិងឈូកសុទ្ធតែមានឫស។' }
      ],
      hint: 'ទឹកមានស្រាប់នៅជុំវិញ ដូច្នេះឫសមិនបាច់វែងទេ។'
    },
    // Q10 -> Correct: B (1)
    {
      question: 'តើរុក្ខជាតិវាលខ្សាច់មានឫសបែបណា ដើម្បីរស់នៅ?',
      options: [
        { text: 'មានឫសខ្លីៗទន់ៗនៅលើផ្ទៃដី', isCorrect: false, exp: 'ឫសខ្លីមិនអាចរកទឹកក្នុងដីខ្សាច់បានទេ។' },
        { text: 'មានឫសវែងៗចាក់ជ្រៅរកប្រភពទឹក', isCorrect: true, exp: 'ឫសវែងចាក់ជ្រៅដើម្បីស្វែងរកទឹកក្រោមដី។' },
        { text: 'មានឫសខ្យល់សម្រាប់ស្រូបខ្យល់អាកាស', isCorrect: false, exp: 'ឫសខ្យល់មិនជួយរកទឹកក្នុងវាលខ្សាច់ទេ។' },
        { text: 'គ្មានឫសទេដោយសារដីខ្សាច់ក្តៅពេក', isCorrect: false, exp: 'ដំបងយក្សមានឫសវែងៗរាលចាក់ជ្រៅ។' }
      ],
      hint: 'ទឹកក្រោមដីខ្សាច់នៅជ្រៅណាស់។'
    },
    // Q11 -> Correct: C (2)
    {
      question: 'តើដើមត្រែង និងដើមឈូក ខុសគ្នាដូចម្តេចត្រង់ផ្នែកស្លឹក?',
      options: [
        { text: 'ត្រែងមានស្លឹកមូល ឯឈូកមានស្លឹកស្រួច', isCorrect: false, exp: 'ការប្រៀបធៀបនេះបញ្ច្រាសគ្នាទាំងស្រុង។' },
        { text: 'ស្លឹកទាំងពីរដូចគ្នាមិនមានចំណុចខុសគ្នា', isCorrect: false, exp: 'ស្លឹកទាំងពីរមានរូបរាងខុសគ្នាស្រឡះ។' },
        { text: 'ត្រែងស្លឹកស្រួចវែង ឯឈូកស្លឹកធំទូលាយ', isCorrect: true, exp: 'ត្រែងស្លឹកវែងស្រួច ឯឈូកស្លឹកធំមូល។' },
        { text: 'ត្រែងគ្មានស្លឹកទេ ឯឈូកមានស្លឹកបន្លា', isCorrect: false, exp: 'ត្រែងមានស្លឹក ឯឈូកស្លឹកមិនមែនបន្លាទេ។' }
      ],
      hint: 'ពិនិត្យតារាងប្រៀបធៀបទំព័រទី ៦។'
    },
    // Q12 -> Correct: D (3)
    {
      question: 'តើដើមត្រែង និងដើមឈូក ខុសគ្នាដូចម្តេចត្រង់ផ្នែកដើម?',
      options: [
        { text: 'ដើមទាំងពីរទន់ដូចគ្នាគ្មានភាពរឹងមាំ', isCorrect: false, exp: 'ដើមត្រែងរឹងមាំទប់នឹងខ្យល់។' },
        { text: 'ដើមត្រែងមានប្រហោង ឯដើមឈូកគ្មានប្រហោង', isCorrect: false, exp: 'ដើមឈូកទេដែលមានប្រហោងខ្យល់ច្រើន។' },
        { text: 'ដើមទាំងពីរមានបន្លាធំៗដូចដំបងយក្ស', isCorrect: false, exp: 'ត្រែងនិងឈូកគ្មានបន្លាធំៗទេ។' },
        { text: 'ត្រែងដើមមានថ្នាំងរឹង ឯឈូកដើមប្រហោង', isCorrect: true, exp: 'ត្រែងមានថ្នាំងរឹងមាំ ឈូកមានដើមប្រហោងខ្យល់។' }
      ],
      hint: 'ដើមត្រែងរឹងមាំមានថ្នាំងៗដូចឫស្សី។'
    },
    // Q13 -> Correct: A (0)
    {
      question: 'តើរុក្ខជាតិបន្លាឈ្លានពានឈ្មោះអ្វី ដែលបំផ្លាញត្រីទន្លេសាប?',
      options: [
        { text: 'ដើមត្របែកយក្ស ឬ បន្លាយួន', isCorrect: true, exp: 'ត្របែកយក្សដណ្តើមជម្រកត្រីនៅទន្លេសាប។' },
        { text: 'ដើមកំប្លោក ឬ ផ្កាចកទេស', isCorrect: false, exp: 'កំប្លោកមិនមែនជាប្រភេទបន្លាយួនទេ។' },
        { text: 'ដើមដំបងយក្ស ឬ ដើមកុលាបព្រៃ', isCorrect: false, exp: 'ដំបងយក្សដុះនៅវាលខ្សាច់។' },
        { text: 'ដើមឫស្សីព្រៃ ឬ ដើមផ្តៅទឹក', isCorrect: false, exp: 'ឫស្សីព្រៃមិនបំផ្លាញមច្ឆាជាតិទេ។' }
      ],
      hint: 'ឈ្មោះរបស់វាមានពាក្យ «ត្របែក...» ឬ «បន្លា...»។'
    },
    // Q14 -> Correct: B (1)
    {
      question: 'តើឈូកពង្រាយគ្រាប់ទៅកាន់ទីឆ្ងាយដោយវិធីណា?',
      options: [
        { text: 'តាមខ្យល់បក់ហោះហើរទៅលើមេឃ', isCorrect: false, exp: 'ផ្លែឈូកធ្ងន់មិនអាចហោះតាមខ្យល់បានទេ។' },
        { text: 'តាមចរន្តទឹកដោយបណ្តូលផ្លែអណ្តែត', isCorrect: true, exp: 'បណ្តូលឈូកស្រាលដូចអេប៉ុងអណ្តែតតាមទឹក។' },
        { text: 'តាមសត្វកំប្រុកកប់ទុកក្នុងដីភ្នំ', isCorrect: false, exp: 'ឈូកដុះក្នុងទឹក កំប្រុកមិនពង្រាយទេ។' },
        { text: 'តាមការផ្ទុះគ្រាប់បែកចេញពីផ្លែ', isCorrect: false, exp: 'ផ្លែឈូកមិនផ្ទុះបាញ់គ្រាប់ចេញទេ។' }
      ],
      hint: 'ផ្លែឈូកស្រាលដូចអេប៉ុង ហើយជ្រុះចូលក្នុងទឹក។'
    },
    // Q15 -> Correct: C (2)
    {
      question: 'តើដើមកោងកាងដុះលូតលាស់នៅក្នុងជម្រកណា?',
      options: [
        { text: 'នៅលើវាលខ្សាច់ក្តៅស្ងួតហួតហែង', isCorrect: false, exp: 'កោងកាងមិនដុះនៅវាលខ្សាច់ទេ។' },
        { text: 'នៅលើកំពូលភ្នំខ្ពស់ត្រជាក់ខ្លាំង', isCorrect: false, exp: 'កោងកាងមិនដុះលើកំពូលភ្នំទេ។' },
        { text: 'ក្នុងព្រៃលិចទឹកតំបន់ឆ្នេរ (ទឹកប្រៃ)', isCorrect: true, exp: 'កោងកាងដុះនៅព្រៃលិចទឹកឆ្នេរសមុទ្រ។' },
        { text: 'ក្នុងស្រែចម្ការដីទួលរបស់កសិករ', isCorrect: false, exp: 'កោងកាងមិនដុះក្នុងស្រែចម្ការទេ។' }
      ],
      hint: 'ពិនិត្យតារាងលំហាត់ទំព័រទី ៧។'
    },
    // Q16 -> Correct: D (3)
    {
      question: 'តើដើមរាំងដុះលូតលាស់នៅក្នុងជម្រកណា?',
      options: [
        { text: 'នៅលើវាលខ្សាច់ស្ងួតគ្មានទឹក', isCorrect: false, exp: 'ដើមរាំងមិនដុះនៅវាលខ្សាច់ទេ។' },
        { text: 'នៅលើជួរភ្នំថ្មក្រានីតខ្ពស់ៗ', isCorrect: false, exp: 'ដើមរាំងមិនដុះលើភ្នំថ្មទេ។' },
        { text: 'ក្នុងសមុទ្រទឹកប្រៃជ្រៅខ្លាំង', isCorrect: false, exp: 'ដើមរាំងមិនដុះក្នុងសមុទ្រជ្រៅទេ។' },
        { text: 'ក្នុងព្រៃលិចទឹកសាប (បឹងទន្លេសាប)', isCorrect: true, exp: 'ដើមរាំងជារុក្ខជាតិព្រៃលិចទឹកសាប។' }
      ],
      hint: 'រុក្ខជាតិនេះជាជម្រកពងកូនរបស់ត្រីទឹកសាប។'
    },
    // Q17 -> Correct: A (0)
    {
      question: 'តើដើមផ្តៅដុះលូតលាស់នៅក្នុងជម្រកណា?',
      options: [
        { text: 'នៅក្នុងព្រៃភ្នំ ឬព្រៃស្រោង', isCorrect: true, exp: 'ផ្តៅជារុក្ខជាតិវល្លិដុះក្នុងព្រៃភ្នំ។' },
        { text: 'នៅក្នុងបាតសមុទ្រទឹកប្រៃជ្រៅ', isCorrect: false, exp: 'ផ្តៅមិនដុះក្នុងបាតសមុទ្រទេ។' },
        { text: 'នៅលើដីខ្សាច់កណ្តាលវាលរហោស្ថាន', isCorrect: false, exp: 'ផ្តៅមិនដុះនៅវាលខ្សាច់ទេ។' },
        { text: 'នៅក្នុងបឹងឈូកទឹកសាបជ្រៅ', isCorrect: false, exp: 'ផ្តៅមិនមែនជារុក្ខជាតិទឹកទេ។' }
      ],
      hint: 'វាជារុក្ខជាតិវល្លិមានបន្លាដុះក្នុងព្រៃ។'
    },
    // Q18 -> Correct: B (1)
    {
      question: 'តើដើមគុយដុះលូតលាស់នៅក្នុងជម្រកណា?',
      options: [
        { text: 'នៅក្នុងទឹកបឹងទន្លេសាបជ្រៅ', isCorrect: false, exp: 'គុយមិនមែនជារុក្ខជាតិទឹកទេ។' },
        { text: 'នៅក្នុងព្រៃភ្នំ ឬព្រៃគោក', isCorrect: true, exp: 'គុយជារុក្ខជាតិវល្លិហូបផ្លែក្នុងព្រៃ។' },
        { text: 'នៅក្នុងទឹកប្រៃមាត់សមុទ្រ', isCorrect: false, exp: 'គុយមិនដុះក្នុងទឹកប្រៃទេ។' },
        { text: 'នៅលើដីខ្សាច់រាំងស្ងួតខ្លាំង', isCorrect: false, exp: 'គុយមិនដុះនៅវាលខ្សាច់ទេ។' }
      ],
      hint: 'វាជាវល្លិផ្លែឈើព្រៃដែលមានរសជាតិជូរអែម។'
    },
    // Q19 -> Correct: C (2)
    {
      question: 'តើរុក្ខជាតិណាខ្លះមានរោមរមាស់ការពារខ្លួន?',
      options: [
        { text: 'ដើមត្រសក់ ដើមល្ពៅ និងដើមចេក', isCorrect: false, exp: 'រុក្ខជាតិទាំងនេះគ្មានរោមរមាស់ខ្លាំងទេ។' },
        { text: 'ដើមដូង ដើមត្នោត និងដើមកំប្លោក', isCorrect: false, exp: 'រុក្ខជាតិទាំងនេះគ្មានរោមរមាស់ទេ។' },
        { text: 'ដើមហើរ ដើមខ្លាញ់ និងផ្លែរមាស់', isCorrect: true, exp: 'រុក្ខជាតិទាំងនេះមានរោមរមាស់ការពារខ្លួន។' },
        { text: 'ដើមឈូក ដើមត្រែង និងដើមស្មៅ', isCorrect: false, exp: 'រុក្ខជាតិទាំងនេះមិនមានរោមរមាស់ទេ។' }
      ],
      hint: 'ប៉ះពាល់លើស្លឹកឬផ្លែរបស់វាធ្វើឱ្យរមាស់ក្រហាយ។'
    },
    // Q20 -> Correct: D (3)
    {
      question: 'តើរុក្ខជាតិណាខ្លះមានជ័រពុល ឬរសជាតិល្វីង?',
      options: [
        { text: 'ដើមស្វាយ ដើមចេក និងដើមក្រូច', isCorrect: false, exp: 'ផ្លែឈើទាំងនេះគ្មានជាតិពុលទេ។' },
        { text: 'ដើមអំពៅ ដើមពោត និងដើមស្រូវ', isCorrect: false, exp: 'ដំណាំទាំងនេះគ្មានជាតិពុលល្វីងទេ។' },
        { text: 'ដើមត្រកួន ដើមស្ពៃ និងដើមស្លឹកខ្ទឹម', isCorrect: false, exp: 'បន្លែទាំងនេះជាអាហារ គ្មានពុលទេ។' },
        { text: 'ដើមល្ហុងខ្វង និងរុក្ខជាតិស្លឹកជូរចត់', isCorrect: true, exp: 'ជ័រល្ហុងខ្វងមានជាតិពុលការពារសត្វស៊ី។' }
      ],
      hint: 'ជ័ររបស់រុក្ខជាតិនេះសត្វមិនហ៊ានស៊ីឡើយ។'
    },
    // Q21 -> Correct: A (0)
    {
      question: 'តើគ្រាប់រុក្ខជាតិដែលពង្រាយដោយខ្យល់មានលក្ខណៈដូចម្តេច?',
      options: [
        { text: 'គ្រាប់តូចៗ ស្រាល និងមានស្លាបឬរោម', isCorrect: true, exp: 'គ្រាប់ស្រាលនិងមានស្លាបងាយហោះតាមខ្យល់។' },
        { text: 'គ្រាប់ធំៗ ធ្ងន់ និងមានជាតិទឹកច្រើន', isCorrect: false, exp: 'គ្រាប់ធ្ងន់មិនអាចហោះតាមខ្យល់បានទេ។' },
        { text: 'គ្រាប់មានទម្ងន់ធ្ងន់ និងសំបកក្រាស់រឹង', isCorrect: false, exp: 'គ្រាប់ធ្ងន់នឹងធ្លាក់ចុះក្រោមដីភ្លាមៗ។' },
        { text: 'គ្រាប់ជ័រស្អិតខ្លាំងជាប់នឹងបាតដី', isCorrect: false, exp: 'គ្រាប់ស្អិតជាប់ដីខ្យល់មិនអាចបក់បានទេ។' }
      ],
      hint: 'ដើម្បីហោះតាមខ្យល់បាន គ្រាប់ត្រូវតែស្រាល។'
    },
    // Q22 -> Correct: B (1)
    {
      question: 'តើគ្រាប់ផ្លែឈើដែលពង្រាយដោយចរន្តទឹកមានលក្ខណៈដូចម្តេច?',
      options: [
        { text: 'គ្រាប់តូចឆ្មារ និងងាយជ្រាបទឹកឆាប់លិច', isCorrect: false, exp: 'បើឆាប់លិចទឹក គ្រាប់នឹងរលួយក្នុងទឹក។' },
        { text: 'ស្រាល អណ្តែតទឹក និងមានសំបកមិនជ្រាបទឹក', isCorrect: true, exp: 'សំបកមិនជ្រាបទឹកជួយឱ្យអណ្តែតតាមទឹក។' },
        { text: 'មានទំពក់ស្រួចៗសម្រាប់តោងស្បែកសត្វ', isCorrect: false, exp: 'ទំពក់ស្រួចជាលក្ខណៈពង្រាយដោយសត្វ។' },
        { text: 'មានស្លាបស្តើងៗសម្រាប់ហោះលើអាកាស', isCorrect: false, exp: 'ស្លាបស្តើងជាលក្ខណៈពង្រាយដោយខ្យល់។' }
      ],
      hint: 'ផ្លែដូង និងផ្លែឈូក អាចអណ្តែតលើទឹកបាន។'
    },
    // Q23 -> Correct: C (2)
    {
      question: 'តើសត្វជួយពង្រាយគ្រាប់រុក្ខជាតិដោយវិធីណាខ្លះ?',
      options: [
        { text: 'ដោយការជីកកកាយដីដុតបំផ្លាញគ្រាប់', isCorrect: false, exp: 'ការដុតបំផ្លាញមិនមែនជាការពង្រាយទេ។' },
        { text: 'ដោយការផ្លុំខ្យល់ចេញពីមាត់ឱ្យហោះ', isCorrect: false, exp: 'សត្វមិនផ្លុំខ្យល់ពង្រាយគ្រាប់ទេ។' },
        { text: 'ដោយស៊ីផ្លែ បន្ទោបង់ ឬស្អិតជាប់រោម', isCorrect: true, exp: 'សត្វស៊ីផ្លែបញ្ចេញតាមលាមក ឬស្អិតរោម។' },
        { text: 'ដោយការកាត់ស្លឹកយកទៅធ្វើជីកំប៉ុស', isCorrect: false, exp: 'នេះជាសកម្មភាពកសិកម្មរបស់មនុស្ស។' }
      ],
      hint: 'សត្វស៊ីផ្លែឈើរួចបន្ទោបង់គ្រាប់នៅទីឆ្ងាយ។'
    },
    // Q24 -> Correct: D (3)
    {
      question: 'តើមនុស្សជួយពង្រាយគ្រាប់រុក្ខជាតិដោយវិធីណាខ្លះ?',
      options: [
        { text: 'ដោយការកាប់ដើមឈើដុតធ្វើធ្យូង', isCorrect: false, exp: 'នេះជាការកាប់បំផ្លាញព្រៃឈើ។' },
        { text: 'ដោយការបង្ហូរទឹកកខ្វក់ចូលក្នុងបឹង', isCorrect: false, exp: 'នេះជាការបំពុលបរិស្ថានទឹក។' },
        { text: 'ដោយការបាញ់ថ្នាំសម្លាប់សត្វល្អិត', isCorrect: false, exp: 'នេះជាការការពារដំណាំពីសត្វល្អិត។' },
        { text: 'ដោយការសាបព្រោះ ដាំដុះ និងដឹកជញ្ជូន', isCorrect: true, exp: 'មនុស្សសាបព្រោះដាំដុះ និងដឹកជញ្ជូនពូជ។' }
      ],
      hint: 'កសិករយកគ្រាប់ពូជទៅសាបព្រោះក្នុងស្រែចម្ការ។'
    },
    // Q25 -> Correct: A (0)
    {
      question: 'ហេតុអ្វីបានជារុក្ខជាតិព្រៃឈើខ្លះដុះជាវល្លិតោងឡើងលើ?',
      options: [
        { text: 'ដើម្បីតោងឡើងទៅទទួលពន្លឺព្រះអាទិត្យ', isCorrect: true, exp: 'វល្លិតោងឡើងខ្ពស់ដើម្បីស្រូបពន្លឺថ្ងៃ។' },
        { text: 'ដើម្បីរត់គេចពីសត្វស៊ីស្មៅនៅខាងក្រោម', isCorrect: false, exp: 'វល្លិមិនមែនតោងដើម្បីរត់គេចសត្វទេ។' },
        { text: 'ដើម្បីជួយទប់ដើមឈើធំៗកុំឱ្យដួលរលំ', isCorrect: false, exp: 'វល្លិមិនមាននាទីទប់ដើមឈើធំទេ។' },
        { text: 'ដើម្បីស្រូបយកខ្យល់ត្រជាក់លើអាកាស', isCorrect: false, exp: 'គោលបំណងចម្បងគឺពន្លឺព្រះអាទិត្យ។' }
      ],
      hint: 'នៅក្រោមព្រៃមានម្លប់ងងឹត ពន្លឺថ្ងៃនៅខាងលើ។'
    },
    // Q26 -> Correct: B (1)
    {
      question: 'តើផ្ញើប្រាណ ឬស្លែ រស់នៅដោយរបៀបណាក្នុងព្រៃ?',
      options: [
        { text: 'ចាក់ឫសជ្រៅទៅក្នុងដីក្រោមបាតភ្នំ', isCorrect: false, exp: 'ផ្ញើប្រាណមិនចាក់ឫសក្នុងដីបាតភ្នំទេ។' },
        { text: 'តោងលើដើមឈើដទៃដើម្បីស្រូបសំណើម', isCorrect: true, exp: 'ផ្ញើប្រាណតោងដើមឈើស្រូបសំណើមនិងកម្ទេចដី។' },
        { text: 'អណ្តែតលើផ្ទៃទឹកដូចដើមកំប្លោក', isCorrect: false, exp: 'ផ្ញើប្រាណមិនអណ្តែតលើទឹកទេ។' },
        { text: 'រស់នៅក្នុងរូងដីងងឹតគ្មានពន្លឺថ្ងៃ', isCorrect: false, exp: 'រុក្ខជាតិត្រូវការពន្លឺព្រះអាទិត្យ។' }
      ],
      hint: 'វាដុះតោងលើមែកឈើដទៃទៀត។'
    },
    // Q27 -> Correct: C (2)
    {
      question: 'ហេតុអ្វីបានជារុក្ខជាតិព្រៃខ្លះមានស្លឹកឆ្លាស់ទងគ្នា?',
      options: [
        { text: 'ដើម្បីការពារកុំឱ្យទឹកភ្លៀងធ្លាក់លើដី', isCorrect: false, exp: 'ទឹកភ្លៀងនៅតែធ្លាក់ដល់ដីដដែល។' },
        { text: 'ដើម្បីទាក់ទាញសត្វស្លាបមកធ្វើសម្បុក', isCorrect: false, exp: 'ស្លឹកឆ្លាស់ទងមិនមែនដើម្បីទាក់ទាញសត្វទេ។' },
        { text: 'ដើម្បីកុំឱ្យបាំងពន្លឺថ្ងៃគ្នាទៅវិញទៅមក', isCorrect: true, exp: 'ស្លឹកឆ្លាស់ទងជួយឱ្យគ្រប់ស្លឹកទទួលពន្លឺ។' },
        { text: 'ដើម្បីឱ្យដើមឈើមានទម្ងន់ធ្ងន់រឹងមាំ', isCorrect: false, exp: 'ស្លឹកឆ្លាស់ទងមិនធ្វើឱ្យដើមធ្ងន់ទេ។' }
      ],
      hint: 'ស្លឹកនីមួយៗត្រូវការស្រូបពន្លឺព្រះអាទិត្យ។'
    },
    // Q28 -> Correct: D (3)
    {
      question: 'តើស្រទាប់ម្សៅ ឬក្រមួនលើស្លឹកចេកមានប្រយោជន៍អ្វី?',
      options: [
        { text: 'ជួយឱ្យស្លឹកមានពណ៌ស្រស់ស្អាតជាងមុន', isCorrect: false, exp: 'ពណ៌មិនមែនជាយន្តការសម្របខ្លួនទេ។' },
        { text: 'ទាក់ទាញសត្វល្អិតមកក្រេបទឹកដមផ្កា', isCorrect: false, exp: 'សត្វល្អិតក្រេបផ្កា មិនមែនក្រមួនស្លឹកទេ។' },
        { text: 'ជួយឱ្យស្លឹកស្រូបយកទឹកភ្លៀងបានច្រើន', isCorrect: false, exp: 'ក្រមួនរអិលមិនជ្រាបទឹកភ្លៀងទេ។' },
        { text: 'ជួយជះពន្លឺថ្ងៃ និងកាត់បន្ថយការភាយទឹក', isCorrect: true, exp: 'ម្សៅក្រមួនការពារការបាត់បង់ចំហាយទឹក។' }
      ],
      hint: 'ម្សៅសៗជួយជះកម្តៅថ្ងៃត្រឡប់ទៅវិញ។'
    },
    // Q29 -> Correct: A (0)
    {
      question: 'តើនឹងមានផលប៉ះពាល់អ្វីកើតឡើង នៅពេលអស់ព្រៃឈើ?',
      options: [
        { text: 'បាត់បង់ជម្រកសត្វ កើនកម្ដៅ និងរាំងស្ងួត', isCorrect: true, exp: 'ការបាត់បង់ព្រៃឈើបង្កគ្រោះមហន្តរាយធ្ងន់ធ្ងរ។' },
        { text: 'មានភ្លៀងធ្លាក់ទៀងទាត់ និងត្រជាក់ជាងមុន', isCorrect: false, exp: 'គ្មានព្រៃឈើ ភ្លៀងនឹងរាំងស្ងួតទៅវិញទេ។' },
        { text: 'បរិមាណសត្វព្រៃកើនឡើងទ្វេដងគ្រប់ប្រភេទ', isCorrect: false, exp: 'សត្វព្រៃនឹងផុតពូជព្រោះបាត់បង់ជម្រក។' },
        { text: 'ដីកាន់តែមានជីវជាតិ និងមិនហូរច្រោះ', isCorrect: false, exp: 'ដីនឹងរងការហូរច្រោះជីជាតិអស់។' }
      ],
      hint: 'ពិនិត្យសំណួរស្រាវជ្រាវទី ២ ទំព័រទី ៧។'
    },
    // Q30 -> Correct: B (1)
    {
      question: 'ហេតុអ្វីបានជាដើមត្រែងមិនរលំពេលមានខ្យល់បក់ខ្លាំង?',
      options: [
        { text: 'ព្រោះដើមរបស់វាទន់ស្វិតដេកលើដីជានិច្ច', isCorrect: false, exp: 'ដើមត្រែងដុះត្រង់ឡើងលើ មិនដេកលើដីទេ។' },
        { text: 'ព្រោះឫសញឹកស្ញក និងដើមមានថ្នាំងរឹងមាំ', isCorrect: true, exp: 'ឫសចាក់សរសៃញឹកស្ញកទប់ដើមឱ្យរឹងមាំ។' },
        { text: 'ព្រោះដើមរបស់វាមានបន្លាស្រួចៗច្រើន', isCorrect: false, exp: 'បន្លាមិនជួយទប់ខ្យល់បក់រលំទេ។' },
        { text: 'ព្រោះស្លឹករបស់វាធំទូលាយដូចស្លឹកឈូក', isCorrect: false, exp: 'ត្រែងមានស្លឹកស្រួចវែង មិនមែនធំដូចឈូកទេ។' }
      ],
      hint: 'ឫសរបស់ត្រែងមានសរសៃញឹកស្ញកចាក់ក្នុងភក់។'
    },
    // Q31 -> Correct: C (2)
    {
      question: 'តើផ្នែកណាខ្លះនៃរុក្ខជាតិដែលជួយសម្របខ្លួនទៅនឹងជម្រក?',
      options: [
        { text: 'មានតែផ្នែកផ្កាមួយមុខគត់គ្រប់រុក្ខជាតិ', isCorrect: false, exp: 'ផ្កាសម្រាប់បន្តពូជ មិនមែនសម្របខ្លួនតែឯងទេ។' },
        { text: 'មានតែផ្នែកផ្លែនិងគ្រាប់ប៉ុណ្ណោះ', isCorrect: false, exp: 'ផ្លែនិងគ្រាប់សម្រាប់បន្តពូជ។' },
        { text: 'ឫស ដើម និងស្លឹក នៃរុក្ខជាតិ', isCorrect: true, exp: 'ឫស ដើម ស្លឹក ជាសរីរាង្គសម្របខ្លួនសំខាន់។' },
        { text: 'មានតែផ្នែកសំបកខាងក្រៅដើមឈើប៉ុណ្ណោះ', isCorrect: false, exp: 'គ្រប់សរីរាង្គសុទ្ធតែចូលរួមសម្របខ្លួន។' }
      ],
      hint: 'សរីរាង្គសំខាន់ទាំង ៣ នៃរុក្ខជាតិ។'
    },
    // Q32 -> Correct: D (3)
    {
      question: 'តើកំប្លោកអណ្តែតលើទឹកបានដោយសារលក្ខណៈអ្វី?',
      options: [
        { text: 'ដោយសារស្លឹករបស់វាមានបន្លាស្រួចៗ', isCorrect: false, exp: 'កំប្លោកគ្មានបន្លាស្រួចទេ។' },
        { text: 'ដោយសារឫសរបស់វាវែងចាក់ជ្រៅក្នុងដី', isCorrect: false, exp: 'កំប្លោកមានឫសខ្លីៗអណ្តែតទឹក។' },
        { text: 'ដោយសារផ្កាពណ៌ស្វាយរបស់វាស្រាល', isCorrect: false, exp: 'ផ្កាមិនមែនជាកត្តាធ្វើឱ្យអណ្តែតទេ។' },
        { text: 'ដោយសារទងស្លឹកប៉ោងនិងមានប្រហោងខ្យល់', isCorrect: true, exp: 'ទងស្លឹកប៉ោងមានខ្យល់ជួយឱ្យកំប្លោកអណ្តែត។' }
      ],
      hint: 'ទងស្លឹកកំប្លោកមានសាច់ប៉ោងៗដូចពោងខ្យល់។'
    },
    // Q33 -> Correct: A (0)
    {
      question: 'តើអាកាសធាតុនៅវាលខ្សាច់មានលក្ខណៈដូចម្តេច?',
      options: [
        { text: 'ក្តៅខ្លាំង និងពុំសូវមានទឹកភ្លៀងឡើយ', isCorrect: true, exp: 'វាលខ្សាច់ក្តៅខ្លាំងនិងរាំងស្ងួតខ្វះទឹក។' },
        { text: 'ត្រជាក់ខ្លាំង និងមានព្រិលធ្លាក់ជានិច្ច', isCorrect: false, exp: 'នេះជាអាកាសធាតុតំបន់ប៉ូល។' },
        { text: 'មានភ្លៀងធ្លាក់ជោកជាំរៀងរាល់ថ្ងៃ', isCorrect: false, exp: 'នេះជាព្រៃទឹកភ្លៀងត្រូពិច។' },
        { text: 'មានទឹកជំនន់លិចលង់ដីស្ទើរពេញមួយឆ្នាំ', isCorrect: false, exp: 'នេះជាតំបន់ដីសើមលិចទឹក។' }
      ],
      hint: 'ពិនិត្យចំណុចទី ២ ជម្រកវាលខ្សាច់ទំព័រទី ៤។'
    },
    // Q34 -> Correct: B (1)
    {
      question: 'ហេតុអ្វីបានជាដើមដំបងយក្សមានសាច់ដើមក្រាស់ឃ្មឹក?',
      options: [
        { text: 'ដើម្បីទាក់ទាញសត្វល្អិតមកក្រេបទឹកដម', isCorrect: false, exp: 'ដើមក្រាស់មិនមែនទាក់ទាញសត្វល្អិតទេ។' },
        { text: 'ដើម្បីផ្ទុកនិងស្តុកជាតិទឹកទុកប្រើប្រាស់', isCorrect: true, exp: 'ដើមក្រាស់ផ្ទុកជាតិទឹកសម្រាប់រដូវក្តៅ។' },
        { text: 'ដើម្បីធ្វើឱ្យដើមឈើមានទម្ងន់ធ្ងន់មិនរលំ', isCorrect: false, exp: 'ដំបងយក្សមិនត្រូវការទម្ងន់ធ្ងន់ទេ។' },
        { text: 'ដើម្បីឱ្យខ្យល់ត្រជាក់អាចឆ្លងកាត់បាន', isCorrect: false, exp: 'ដើមសាច់ក្រាស់សម្រាប់ស្តុកទឹក។' }
      ],
      hint: 'នៅវាលខ្សាច់ខ្វះទឹក ដូច្នេះត្រូវស្តុកទឹកទុក។'
    },
    // Q35 -> Correct: C (2)
    {
      question: 'តើស្លឹករបស់ដើមឈូកមានលក្ខណៈពិសេសអ្វីខ្លះ?',
      options: [
        { text: 'ស្លឹកស្រួចដូចម្ជុល និងមានជាតិល្វីងខ្លាំង', isCorrect: false, exp: 'ឈូកមិនមានស្លឹកដូចម្ជុលទេ។' },
        { text: 'ស្លឹកតូចៗល្អិតៗជ្រុះអស់នៅរដូវប្រាំង', isCorrect: false, exp: 'ស្លឹកឈូកមិនតូចល្អិតទេ។' },
        { text: 'ស្លឹកធំទូលាយ មានក្រមួន និងមិនជ្រាបទឹក', isCorrect: true, exp: 'ស្លឹកឈូកធំទូលាយមានក្រមួនមិនជ្រាបទឹក។' },
        { text: 'ស្លឹកប្រែប្រួលក្លាយជាបន្លាស្រួចដូចដំបងយក្ស', isCorrect: false, exp: 'ស្លឹកឈូកមិនមែនជាបន្លាទេ។' }
      ],
      hint: 'ដំណក់ទឹកលើស្លឹកឈូកមិនជ្រាបចូលទេ គឺរមៀលដូចត្បូង។'
    },
    // Q36 -> Correct: D (3)
    {
      question: 'តើផ្លែឈូកមានអ្វីនៅខាងក្នុង ដែលជួយឱ្យវាអណ្តែតទឹក?',
      options: [
        { text: 'មានថង់ខ្យល់ដែកដែលមិនចេះច្រែះ', isCorrect: false, exp: 'រុក្ខជាតិគ្មានថង់ខ្យល់ដែកទេ។' },
        { text: 'មានគ្រាប់ធ្ងន់ៗដែលទាញផ្លែឱ្យលិច', isCorrect: false, exp: 'បើលិច ផ្លែឈូកមិនអាចអណ្តែតបានទេ។' },
        { text: 'មានប្រេងសាំងធម្មជាតិស្រាលជាងទឹក', isCorrect: false, exp: 'ផ្លែឈូកគ្មានប្រេងសាំងទេ។' },
        { text: 'មានបណ្តូលស្រាលសាច់ដូចជាអេប៉ុង', isCorrect: true, exp: 'បណ្តូលឈូកស្រាលដូចអេប៉ុងជួយឱ្យអណ្តែត។' }
      ],
      hint: 'ពិនិត្យចម្លើយស្រាវជ្រាវទី ៤ ទំព័រទី ៧។'
    },
    // Q37 -> Correct: A (0)
    {
      question: 'តើការខួរស្លឹករបស់ដើមពោតជួយកាត់បន្ថយអ្វី?',
      options: [
        { text: 'កាត់បន្ថយការភាយចំហាយទឹកក្នុងកម្ដៅថ្ងៃ', isCorrect: true, exp: 'ខួរស្លឹកកាត់បន្ថយផ្ទៃរងកម្តៅនិងរំហួតទឹក។' },
        { text: 'កាត់បន្ថយការលូតលាស់នៃផ្លែពោតខ្ចី', isCorrect: false, exp: 'រុក្ខជាតិមិនកាត់បន្ថយផ្លែរបស់ខ្លួនទេ។' },
        { text: 'កាត់បន្ថយការស្រូបជីជាតិពីក្នុងដីស្រែ', isCorrect: false, exp: 'ការខួរស្លឹកមិនទាក់ទងនឹងការស្រូបជីទេ។' },
        { text: 'កាត់បន្ថយការបន្តពូជរបស់ផ្កាឈ្មោល', isCorrect: false, exp: 'ការខួរស្លឹកជាយន្តការទប់ទល់កម្ដៅថ្ងៃ។' }
      ],
      hint: 'នៅពេលថ្ងៃក្តៅខ្លាំង ស្លឹកពោតរមូរចូលគ្នា។'
    },
    // Q38 -> Correct: B (1)
    {
      question: 'តើសត្រូវធំបំផុតរបស់រុក្ខជាតិរួមមានអ្វីខ្លះ?',
      options: [
        { text: 'មានតែសត្វស្លាបមួយមុខគត់ក្នុងព្រៃ', isCorrect: false, exp: 'សត្វស្លាបមិនមែនជាសត្រូវតែមួយគត់ទេ។' },
        { text: 'មនុស្ស សត្វ និងកត្តាកម្ដៅរាំងស្ងួត', isCorrect: true, exp: 'មនុស្ស សត្វ និងកម្តៅរាំងស្ងួតជាសត្រូវរុក្ខជាតិ។' },
        { text: 'មានតែទឹកភ្លៀងធ្លាក់ជោកជាំក្នុងស្រែ', isCorrect: false, exp: 'ទឹកភ្លៀងជួយផ្តល់ទឹកដល់រុក្ខជាតិ។' },
        { text: 'មានតែដង្កូវតូចៗដែលស៊ីស្លឹកឈើ', isCorrect: false, exp: 'សត្រូវមានច្រើនជាងដង្កូវ។' }
      ],
      hint: 'ពិនិត្យចំណុចទី ៣ ក សត្រូវរបស់រុក្ខជាតិទំព័រទី ៤។'
    },
    // Q39 -> Correct: C (2)
    {
      question: 'ហេតុអ្វីបានជាគ្រាប់រុក្ខជាតិត្រូវការពង្រាយទៅទីឆ្ងាយ?',
      options: [
        { text: 'ដើម្បីកុំឱ្យដើមមេត្រូវស្រូបទឹកច្រើនពេក', isCorrect: false, exp: 'ដើមមេមិនខ្វល់រឿងស្រូបទឹកច្រើនទេ។' },
        { text: 'ដើម្បីឱ្យគ្រាប់ឆាប់ស្ងួតល្អកុំឱ្យដុះពន្លក', isCorrect: false, exp: 'គ្រាប់ពង្រាយដើម្បីដុះពន្លកថ្មី។' },
        { text: 'ដើម្បីកុំឱ្យកូនរុក្ខជាតិដុះប្រជ្រៀតដើមមេ', isCorrect: true, exp: 'ដុះប្រជ្រៀតគ្នានាំឱ្យខ្វះពន្លឺនិងជីវជាតិ។' },
        { text: 'ដើម្បីទាក់ទាញសត្វចង្រៃឱ្យមកស៊ីគ្រាប់', isCorrect: false, exp: 'រុក្ខជាតិមិនចង់ឱ្យសត្វស៊ីបំផ្លាញគ្រាប់ទេ។' }
      ],
      hint: 'កូនរុក្ខជាតិត្រូវការពន្លឺថ្ងៃ និងជីជាតិដើម្បីលូតលាស់។'
    },
    // Q40 -> Correct: D (3)
    {
      question: 'តើគោលបំណងចម្បងនៃការសម្របខ្លួនរបស់រុក្ខជាតិគឺដើម្បីអ្វី?',
      options: [
        { text: 'ដើម្បីធ្វើឱ្យបរិស្ថានមានសោភ័ណភាពស្អាត', isCorrect: false, exp: 'សោភ័ណភាពជាផលប្រយោជន៍ក្រៅខ្លួន។' },
        { text: 'ដើម្បីផ្តល់ផលផ្លែឈើឱ្យមនុស្សបរិភោគ', isCorrect: false, exp: 'រុក្ខជាតិសម្របខ្លួនដើម្បីរស់ មិនមែនដើម្បីមនុស្សទេ។' },
        { text: 'ដើម្បីឱ្យដើមឈើអាចដើរផ្លាស់ប្តូរទីកន្លែង', isCorrect: false, exp: 'រុក្ខជាតិមិនអាចដើរបានឡើយ។' },
        { text: 'ដើម្បីរស់រានមានជីវិត លូតលាស់ និងបន្តពូជ', isCorrect: true, exp: 'ការសម្របខ្លួនជួយឱ្យរុក្ខជាតិរស់នៅនិងបន្តពូជ។' }
      ],
      hint: 'តម្រូវការចាំបាច់បំផុតរបស់គ្រប់ភាវៈមានជីវិត។'
    }
  ];

  const handleQuizAnswer = (choiceIdx: number) => {
    if (answeredQuiz[currentQuizIndex] !== undefined) return;
    setAnsweredQuiz((prev) => ({ ...prev, [currentQuizIndex]: choiceIdx }));

    const isRight = fullQuizList[currentQuizIndex].options[choiceIdx].isCorrect;
    if (isRight) {
      playTone('correct');
      addScore(2);
    } else {
      playTone('wrong');
    }
  };

  const handleNavigateQuiz = (dir: -1 | 1) => {
    playTone('click');
    if (dir === -1 && currentQuizIndex > 0) {
      setCurrentQuizIndex((prev) => prev - 1);
    } else if (dir === 1) {
      if (currentQuizIndex < fullQuizList.length - 1) {
        setCurrentQuizIndex((prev) => prev + 1);
      } else {
        triggerConfetti();
        setIsQuizCompleted(true);
      }
    }
  };

  const restartQuiz = () => {
    playTone('click');
    setAnsweredQuiz({});
    setCurrentQuizIndex(0);
    setIsQuizCompleted(false);
  };

  const correctAnswersCount = Object.keys(answeredQuiz).filter(
    (k) => fullQuizList[Number(k)]?.options[answeredQuiz[Number(k)]]?.isCorrect
  ).length;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-0 sm:p-2 md:p-4 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className={`bg-slate-50 flex flex-col overflow-hidden text-slate-800 antialiased shadow-2xl transition-all duration-200 border border-emerald-600/30 font-sans ${
            isFullscreen
              ? 'fixed inset-0 rounded-none z-50'
              : 'w-full h-full sm:h-[94vh] sm:max-w-7xl sm:rounded-3xl border'
          }`}
        >
          {/* Header */}
          <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm shrink-0">
            <div className="max-w-7xl mx-auto px-3 sm:px-6">
              <div className="flex items-center justify-between h-16 sm:h-18">
                {/* Brand / Title */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-200">
                      <i className="fa-solid fa-leaf text-xl sm:text-2xl animate-pulse"></i>
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white shadow">
                      ៦
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <i className="fa-solid fa-graduation-cap"></i> វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium hidden md:inline">
                        ជំពូកទី ១ ៖ រុក្ខជាតិនិងសត្វ
                      </span>
                    </div>
                    <h1 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 leading-tight">
                      មេរៀនទី ១ ៖ ការសម្របខ្លួនរបស់រុក្ខជាតិ
                    </h1>
                  </div>
                </div>

                {/* Header Controls */}
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* TTS Button */}
                  <button
                    onClick={toggleReadAloud}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-800 text-xs sm:text-sm font-semibold transition active:scale-95 shadow-xs"
                    title="អានខ្លឹមសារមេរៀនជាសំឡេង"
                  >
                    {isSpeaking ? (
                      <>
                        <VolumeX className="w-4 h-4 text-rose-600 animate-pulse" />
                        <span className="hidden sm:inline text-rose-700">ផ្អាកសំឡេង</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 text-emerald-600" />
                        <span className="hidden sm:inline">អានជាសំឡេង</span>
                      </>
                    )}
                  </button>

                  {/* Score Counter */}
                  <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 px-3 py-1.5 rounded-xl shadow-xs">
                    <Award className="w-4 h-4 text-amber-500" />
                    <div className="text-left leading-none">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">ពិន្ទុរួម</span>
                      <span className="text-xs sm:text-sm font-bold text-amber-900">{totalScore} / 100</span>
                    </div>
                  </div>

                  {/* Fullscreen Toggle */}
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="hidden sm:flex p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
                    title={isFullscreen ? 'ចេញពីពេញអេក្រង់' : 'ពេញអេក្រង់'}
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>

                  {/* Close Modal Button */}
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-600 transition"
                    title="បិទផ្ទាំង"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="bg-emerald-950 text-white shadow-inner border-t border-emerald-900">
              <div className="max-w-7xl mx-auto px-2 sm:px-6">
                <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 text-xs sm:text-sm font-medium no-scrollbar">
                  {[
                    { id: 'hero', label: '១. ទិដ្ឋភាពទូទៅ', icon: 'fa-seedling' },
                    { id: 'dispersal', label: '២. ការពង្រាយគ្រាប់', icon: 'fa-wind' },
                    { id: 'adaptation', label: '៣. ការសម្របតាមជម្រក', icon: 'fa-mountain-sun' },
                    { id: 'defense', label: '៤. ការការពារខ្លួន', icon: 'fa-shield-cat' },
                    { id: 'lab', label: '៥. មន្ទីរពិសោធន៍ & ប្រៀបធៀប', icon: 'fa-flask-vial' },
                    { id: 'match', label: '៦. ល្បែងផ្គូផ្គង (ទំព័រ ៧)', icon: 'fa-puzzle-piece' },
                    { id: 'quiz', label: '៧. កម្រង ៤០ សំណួរ', icon: 'fa-circle-question' },
                  ].map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          playTone('click');
                          setActiveTab(tab.id as TabType);
                        }}
                        className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 shrink-0 ${
                          isActive
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md font-bold'
                            : 'bg-transparent text-emerald-100/80 hover:bg-emerald-800/50 hover:text-white'
                        } ${tab.id === 'quiz' ? 'bg-amber-600/30 text-amber-200 hover:bg-amber-600 hover:text-white' : ''}`}
                      >
                        <i className={`fa-solid ${tab.icon}`}></i>
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </nav>
          </header>

          {/* Main Scrollable Content */}
          <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 w-full max-w-7xl mx-auto space-y-6">

            {/* TAB 1: HERO / OVERVIEW */}
            {activeTab === 'hero' && (
              <div className="space-y-6">
                {/* Hero Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-950 text-white p-6 sm:p-10 shadow-xl border border-emerald-700/40">
                  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-7 space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 backdrop-blur-sm">
                        <i className="fa-solid fa-book-bookmark text-amber-400"></i> សៀវភៅពុម្ពទំព័រទី ២ ដល់ ៧
                      </div>
                      <h2 className="text-2xl sm:text-4xl font-bold leading-tight tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-emerald-100 via-teal-100 to-amber-200">
                        ការសម្របខ្លួនរបស់រុក្ខជាតិ
                      </h2>
                      <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-light">
                        គ្រប់ភាវៈមានជីវិតទាំងអស់អាចលូតលាស់និងបន្តពូជបាន។ រុក្ខជាតិជាភាវៈមានជីវិតដែលមានច្រើនប្រភេទ និងដុះនៅស្ទើរគ្រប់ទីកន្លែង។ កន្លែងដែលរុក្ខជាតិដុះលូតលាស់ត្រូវបានហៅថា <strong className="text-amber-300 font-bold underline decoration-amber-400 underline-offset-4">«ជម្រក»</strong>។
                      </p>
                      <div className="pt-2 flex flex-wrap gap-3">
                        <button
                          onClick={() => {
                            playTone('click');
                            setActiveTab('adaptation');
                          }}
                          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2 active:scale-95 cursor-pointer"
                        >
                          <i className="fa-solid fa-compass"></i> រុករកជម្រករុក្ខជាតិ
                        </button>
                        <button
                          onClick={() => {
                            playTone('click');
                            setActiveTab('quiz');
                          }}
                          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2 active:scale-95 cursor-pointer"
                        >
                          <i className="fa-solid fa-circle-question"></i> ធ្វើតេស្ត ៤០ សំណួរ
                        </button>
                      </div>
                    </div>

                    <div className="lg:col-span-5 relative group">
                      <div className="overflow-hidden rounded-2xl border-2 border-emerald-400/40 shadow-2xl aspect-[4/3] bg-gradient-to-b from-sky-800 via-teal-900 to-emerald-950 flex items-center justify-center p-2">
                        <svg className="w-full h-full" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="330" cy="70" r="38" fill="#FBBF24" opacity="0.85" />
                          <path d="M70,50 Q85,40 100,50 Q115,40 130,50" stroke="#E2E8F0" strokeWidth="2.5" fill="none" opacity="0.6" />
                          <path d="M140,65 Q150,58 160,65 Q170,58 180,65" stroke="#E2E8F0" strokeWidth="2" fill="none" opacity="0.5" />
                          <polygon points="20,180 110,90 220,180" fill="#047857" opacity="0.45" />
                          <polygon points="150,180 250,80 360,180" fill="#065F46" opacity="0.55" />
                          <path d="M0,230 C90,210 160,250 240,235 C320,220 370,240 400,230 L400,300 L0,300 Z" fill="#0284C7" />
                          <path d="M0,250 C120,235 200,265 290,250 C350,240 380,255 400,250 L400,300 L0,300 Z" fill="#0369A1" opacity="0.8" />
                          <ellipse cx="290" cy="265" rx="36" ry="11" fill="#15803D" />
                          <path d="M290,265 L278,258" stroke="#14532D" strokeWidth="1.5" />
                          <circle cx="290" cy="250" r="14" fill="#F43F5E" />
                          <circle cx="286" cy="248" r="9" fill="#FB7185" />
                          <circle cx="294" cy="248" r="9" fill="#FDA4AF" />
                          <circle cx="290" cy="246" r="6" fill="#FDE047" />
                          <path d="M0,200 Q70,195 120,220 Q160,245 190,300 L0,300 Z" fill="#064E3B" />
                          <path d="M70,250 Q85,160 95,120 Q105,160 120,250 Z" fill="#78350F" />
                          <circle cx="100" cy="100" r="48" fill="#10B981" />
                          <circle cx="70" cy="95" r="38" fill="#059669" />
                          <circle cx="130" cy="95" r="38" fill="#34D399" />
                          <circle cx="100" cy="70" r="32" fill="#6EE7B7" />
                          <g opacity="0.85">
                            <circle cx="180" cy="110" r="3" fill="#FEF08A" />
                            <path d="M180,110 L195,100 M180,110 L198,112 M180,110 L193,122" stroke="#FEF08A" strokeWidth="1.5" />
                            <circle cx="230" cy="95" r="3" fill="#FEF08A" />
                            <path d="M230,95 L245,85 M230,95 L248,97 M230,95 L243,107" stroke="#FEF08A" strokeWidth="1.5" />
                          </g>
                          <text x="20" y="285" fill="#E2E8F0" fontSize="12" fontWeight="bold">🌱 ជម្រកធម្មជាតិ៖ ទឹក ព្រៃឈើ និងរុក្ខជាតិ</text>
                        </svg>
                      </div>
                      <span className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm text-[11px] text-white px-2.5 py-1 rounded-lg border border-white/20">
                        <i className="fa-solid fa-seedling text-emerald-400 mr-1"></i> រុក្ខជាតិ និងជម្រកធម្មជាតិ
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3 Key Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl mb-3">
                        <i className="fa-solid fa-water"></i>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mb-1.5">១. ជម្រក (Habitat)</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        ជាកន្លែងដែលរុក្ខជាតិដុះលូតលាស់។ ជម្រករបស់រុក្ខជាតិមាននៅក្នុងឬលើទឹក (ទឹកសាប និងទឹកប្រៃ) និងនៅលើគោក (ព្រៃឈើ និងវាលខ្សាច់)។
                      </p>
                    </div>
                    <div className="mt-4 rounded-xl overflow-hidden h-28 bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center relative p-2 shadow-inner">
                      <svg className="w-full h-full" viewBox="0 0 240 100" fill="none">
                        <path d="M0,60 Q60,40 120,60 T240,60 L240,100 L0,100 Z" fill="#0284C7" />
                        <path d="M0,75 Q60,60 120,75 T240,75 L240,100 L0,100 Z" fill="#0369A1" />
                        <ellipse cx="70" cy="65" rx="30" ry="8" fill="#16A34A" />
                        <ellipse cx="170" cy="72" rx="35" ry="9" fill="#15803D" />
                        <circle cx="70" cy="55" r="9" fill="#F43F5E" />
                        <circle cx="70" cy="53" r="5" fill="#FBBF24" />
                        <text x="85" y="32" fill="#FFFFFF" fontSize="12" fontWeight="bold">ជម្រកក្នុងទឹក</text>
                      </svg>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl mb-3">
                        <i className="fa-solid fa-arrows-rotate"></i>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mb-1.5">២. ការសម្របខ្លួន (Adaptation)</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        ការប្រែប្រួលរាងកាយ ឬសរីរាង្គ (ឫស ដើម ស្លឹក) ឱ្យស្របតាមអាកាសធាតុ និងបរិស្ថាន ដើម្បីស្រូបយកទឹក សារធាតុចិញ្ចឹម និងពន្លឺព្រះអាទិត្យ។
                      </p>
                    </div>
                    <div className="mt-4 rounded-xl overflow-hidden h-28 bg-gradient-to-tr from-emerald-800 to-teal-500 flex items-center justify-center relative p-2 shadow-inner">
                      <svg className="w-full h-full" viewBox="0 0 240 100" fill="none">
                        <polygon points="50,70 65,30 80,70" fill="#10B981" />
                        <rect x="62" y="70" width="6" height="18" fill="#78350F" />
                        <polygon points="85,75 105,20 125,75" fill="#059669" />
                        <rect x="102" y="75" width="6" height="15" fill="#78350F" />
                        <polygon points="130,80 150,35 170,80" fill="#34D399" />
                        <rect x="147" y="80" width="6" height="12" fill="#78350F" />
                        <ellipse cx="120" cy="92" rx="110" ry="10" fill="#064E3B" />
                        <text x="65" y="24" fill="#FFFFFF" fontSize="12" fontWeight="bold">ការសម្របតាមជម្រក</text>
                      </svg>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl mb-3">
                        <i className="fa-solid fa-shield-halved"></i>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mb-1.5">៣. ការការពារខ្លួន (Defense)</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        រុក្ខជាតិបង្កើតបន្លា រោមរមាស់ ជាតិពុល ជ័រ ឬជម្រុះស្លឹក ដើម្បីការពារខ្លួនទល់នឹងមនុស្ស សត្វ និងអាកាសធាតុក្តៅស្ងួតហួតហែង។
                      </p>
                    </div>
                    <div className="mt-4 rounded-xl overflow-hidden h-28 bg-gradient-to-tr from-amber-700 to-orange-500 flex items-center justify-center relative p-2 shadow-inner">
                      <svg className="w-full h-full" viewBox="0 0 240 100" fill="none">
                        <path d="M0,80 Q70,65 140,82 T240,75 L240,100 L0,100 Z" fill="#D97706" />
                        <rect x="110" y="35" width="18" height="48" rx="9" fill="#047857" />
                        <path d="M102,50 Q102,60 110,60" stroke="#047857" strokeWidth="7" strokeLinecap="round" fill="none" />
                        <path d="M136,44 Q136,54 128,54" stroke="#047857" strokeWidth="7" strokeLinecap="round" fill="none" />
                        <line x1="106" y1="42" x2="101" y2="40" stroke="#FEF08A" strokeWidth="2" />
                        <line x1="132" y1="38" x2="137" y2="36" stroke="#FEF08A" strokeWidth="2" />
                        <line x1="120" y1="46" x2="120" y2="40" stroke="#FEF08A" strokeWidth="2" />
                        <text x="65" y="24" fill="#FFFFFF" fontSize="12" fontWeight="bold">បន្លា & ការពារខ្លួន</text>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* 3 Plant Organs Inspector */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200/80 shadow-sm">
                  <div className="text-center max-w-2xl mx-auto mb-6">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
                      សរីរាង្គសម្របខ្លួនទាំង ៣
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                      តើសរីរាង្គសំខាន់ៗជួយអ្វីខ្លះដល់រុក្ខជាតិ?
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">ចុចជ្រើសរើសសរីរាង្គនីមួយៗដើម្បីពិនិត្យលម្អិត</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    {(['root', 'stem', 'leaf'] as OrganType[]).map((orgKey) => {
                      const isSel = selectedOrgan === orgKey;
                      const org = organInfoMap[orgKey];
                      return (
                        <button
                          key={orgKey}
                          onClick={() => {
                            playTone('click');
                            setSelectedOrgan(orgKey);
                          }}
                          className={`p-4 rounded-2xl border-2 text-left transition-all group cursor-pointer ${
                            isSel
                              ? 'border-emerald-500 bg-emerald-50'
                              : 'border-slate-200 bg-white hover:border-emerald-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl group-hover:rotate-12 transition">
                              <i className={`fa-solid ${org.icon}`}></i>
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 text-sm sm:text-base">{org.title}</h4>
                              <span className="text-[11px] text-emerald-800 font-medium">ចុចពិនិត្យលម្អិត</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-2xl shrink-0 shadow-md">
                        <i className={`fa-solid ${organInfoMap[selectedOrgan].icon}`}></i>
                      </div>
                      <div>
                        <h4 className="font-bold text-emerald-950 text-base sm:text-lg mb-1">
                          {organInfoMap[selectedOrgan].title}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                          {organInfoMap[selectedOrgan].desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SEED DISPERSAL */}
            {activeTab === 'dispersal' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                    ចំណុចទី ១ នៃសៀវភៅពុម្ព (ទំព័រទី ២)
                  </span>
                  <h2 className="text-xl sm:text-3xl font-bold text-slate-900 mt-2">
                    របៀបពង្រាយគ្រាប់របស់រុក្ខជាតិ (Seed Dispersal)
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                    រុក្ខជាតិភាគច្រើនដុះលូតលាស់ចេញពីគ្រាប់។ ដើម្បីកុំឱ្យកូនរុក្ខជាតិដុះប្រជ្រៀតគ្នានៅជុំវិញដើមមេ ដែលបណ្តាលឱ្យខ្វះពន្លឺ និងជីវជាតិ គ្រាប់ត្រូវការពង្រាយទៅកាន់ទីឆ្ងាយ។
                  </p>
                </div>

                <p className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <i className="fa-solid fa-circle-nodes text-emerald-600"></i> តើភ្នាក់ងារទាំង ៤ នោះមានអ្វីខ្លះ? ចុចលើភ្នាក់ងារនីមួយៗដើម្បីស្វែងយល់៖
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Agent 1: Wind */}
                  <div
                    onClick={() => {
                      playTone('click');
                      setSelectedDispersal('wind');
                    }}
                    className={`cursor-pointer p-4 rounded-2xl bg-sky-50 border-2 transition-all text-center group active:scale-95 shadow-xs ${
                      selectedDispersal === 'wind' ? 'border-sky-500 shadow-md ring-2 ring-sky-300' : 'border-sky-200 hover:border-sky-400'
                    }`}
                  >
                    <div className="w-full h-32 rounded-xl overflow-hidden mb-3 bg-gradient-to-b from-sky-400 to-sky-600 flex items-center justify-center p-2 shadow-inner">
                      <svg className="w-full h-full" viewBox="0 0 160 110" fill="none">
                        <path d="M20,35 C50,25 90,45 135,30" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
                        <path d="M10,60 C40,50 80,70 145,55" stroke="#BAE6FD" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
                        <path d="M30,85 C60,75 100,90 140,80" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
                        <circle cx="95" cy="48" r="4" fill="#0C4A6E" />
                        <line x1="95" y1="48" x2="80" y2="40" stroke="#FFFFFF" strokeWidth="1.5" />
                        <line x1="80" y1="40" x2="72" y2="30" stroke="#FFFFFF" strokeWidth="1" />
                        <line x1="80" y1="40" x2="70" y2="40" stroke="#FFFFFF" strokeWidth="1" />
                        <line x1="80" y1="40" x2="74" y2="48" stroke="#FFFFFF" strokeWidth="1" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">១. ខ្យល់ (Wind)</h3>
                    <span className="text-[11px] text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full mt-1.5 inline-block font-semibold">
                      គ្រាប់ស្រាល មានស្លាប ឬរោម
                    </span>
                  </div>

                  {/* Agent 2: Water */}
                  <div
                    onClick={() => {
                      playTone('click');
                      setSelectedDispersal('water');
                    }}
                    className={`cursor-pointer p-4 rounded-2xl bg-cyan-50 border-2 transition-all text-center group active:scale-95 shadow-xs ${
                      selectedDispersal === 'water' ? 'border-cyan-500 shadow-md ring-2 ring-cyan-300' : 'border-cyan-200 hover:border-cyan-400'
                    }`}
                  >
                    <div className="w-full h-32 rounded-xl overflow-hidden mb-3 bg-gradient-to-b from-cyan-500 to-blue-700 flex items-center justify-center p-2 shadow-inner">
                      <svg className="w-full h-full" viewBox="0 0 160 110" fill="none">
                        <path d="M0,70 Q40,55 80,70 T160,70 L160,110 L0,110 Z" fill="#0284C7" />
                        <path d="M0,85 Q40,75 80,85 T160,85 L160,110 L0,110 Z" fill="#0369A1" />
                        <ellipse cx="80" cy="65" rx="20" ry="13" fill="#D97706" />
                        <ellipse cx="80" cy="62" rx="17" ry="10" fill="#F59E0B" />
                        <circle cx="75" cy="62" r="2.5" fill="#78350F" />
                        <circle cx="83" cy="60" r="2.5" fill="#78350F" />
                        <circle cx="80" cy="65" r="2.5" fill="#78350F" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">២. ចរន្តទឹក (Water)</h3>
                    <span className="text-[11px] text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded-full mt-1.5 inline-block font-semibold">
                      អណ្តែតទឹក មិនជ្រាបទឹក
                    </span>
                  </div>

                  {/* Agent 3: Animal */}
                  <div
                    onClick={() => {
                      playTone('click');
                      setSelectedDispersal('animal');
                    }}
                    className={`cursor-pointer p-4 rounded-2xl bg-amber-50 border-2 transition-all text-center group active:scale-95 shadow-xs ${
                      selectedDispersal === 'animal' ? 'border-amber-500 shadow-md ring-2 ring-amber-300' : 'border-amber-200 hover:border-amber-400'
                    }`}
                  >
                    <div className="w-full h-32 rounded-xl overflow-hidden mb-3 bg-gradient-to-b from-amber-400 to-amber-600 flex items-center justify-center p-2 shadow-inner">
                      <svg className="w-full h-full" viewBox="0 0 160 110" fill="none">
                        <path d="M10,85 Q80,75 150,90" stroke="#78350F" strokeWidth="8" strokeLinecap="round" />
                        <ellipse cx="85" cy="60" rx="16" ry="18" fill="#92400E" />
                        <circle cx="80" cy="42" r="11" fill="#92400E" />
                        <polygon points="73,34 78,24 82,34" fill="#78350F" />
                        <polygon points="80,34 85,25 88,34" fill="#78350F" />
                        <circle cx="76" cy="40" r="2" fill="#FFFFFF" />
                        <circle cx="75" cy="40" r="1.2" fill="#000000" />
                        <path d="M98,68 C115,65 125,40 118,25 C112,14 100,18 102,28 C104,38 98,50 94,56" fill="#B45309" />
                        <ellipse cx="69" cy="50" rx="6" ry="7" fill="#D97706" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">៣. សត្វ (Animal)</h3>
                    <span className="text-[11px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full mt-1.5 inline-block font-semibold">
                      ស៊ីផ្លែ កប់ទុក ឬស្អិតរោម
                    </span>
                  </div>

                  {/* Agent 4: Human */}
                  <div
                    onClick={() => {
                      playTone('click');
                      setSelectedDispersal('human');
                    }}
                    className={`cursor-pointer p-4 rounded-2xl bg-emerald-50 border-2 transition-all text-center group active:scale-95 shadow-xs ${
                      selectedDispersal === 'human' ? 'border-emerald-500 shadow-md ring-2 ring-emerald-300' : 'border-emerald-200 hover:border-emerald-400'
                    }`}
                  >
                    <div className="w-full h-32 rounded-xl overflow-hidden mb-3 bg-gradient-to-b from-emerald-500 to-teal-700 flex items-center justify-center p-2 shadow-inner">
                      <svg className="w-full h-full" viewBox="0 0 160 110" fill="none">
                        <path d="M0,80 L160,80 L160,110 L0,110 Z" fill="#065F46" />
                        <line x1="20" y1="92" x2="140" y2="92" stroke="#047857" strokeWidth="2" />
                        <path d="M30,35 Q60,30 80,48 Q70,55 50,52 Z" fill="#FDE68A" />
                        <ellipse cx="60" cy="65" rx="20" ry="9" fill="#B45309" />
                        <circle cx="85" cy="55" r="2.5" fill="#FEF08A" />
                        <circle cx="95" cy="62" r="2.5" fill="#FEF08A" />
                        <circle cx="105" cy="70" r="2.5" fill="#FEF08A" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">៤. មនុស្ស (Human)</h3>
                    <span className="text-[11px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full mt-1.5 inline-block font-semibold">
                      សាបព្រោះ ដាំដុះ & ដឹកជញ្ជូន
                    </span>
                  </div>
                </div>

                {/* Dispersal Detail Box */}
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 transition-all">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className={`w-24 h-24 rounded-2xl ${dispersalInfoMap[selectedDispersal].bg} text-white flex items-center justify-center text-4xl shadow-lg shrink-0`}>
                      <i className={`fa-solid ${dispersalInfoMap[selectedDispersal].icon}`}></i>
                    </div>
                    <div className="space-y-2 text-left flex-1">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center">
                          {dispersalInfoMap[selectedDispersal].num}
                        </span>
                        <h4 className="font-bold text-slate-900 text-lg">
                          {dispersalInfoMap[selectedDispersal].title}
                        </h4>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {dispersalInfoMap[selectedDispersal].text}
                      </p>
                      <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
                        <strong className="text-slate-800">ឧទាហរណ៍ជាក់ស្តែងក្នុងសៀវភៅពុម្ព៖</strong> {dispersalInfoMap[selectedDispersal].example}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: HABITAT ADAPTATION */}
            {activeTab === 'adaptation' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                    ចំណុចទី ២ នៃសៀវភៅពុម្ព (ទំព័រទី ៣ ដល់ ៤)
                  </span>
                  <h2 className="text-xl sm:text-3xl font-bold text-slate-900 mt-2">
                    ការសម្របខ្លួនរបស់រុក្ខជាតិទៅតាមជម្រក
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    តើសរីរាង្គអ្វីខ្លះ ជួយឱ្យរុក្ខជាតិរស់នៅក្នុងជម្រកនីមួយៗបាន? ជ្រើសរើសជម្រកខាងក្រោម៖
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => {
                      playTone('click');
                      setActiveHabitat('water');
                    }}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center gap-2 cursor-pointer ${
                      activeHabitat === 'water' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <i className="fa-solid fa-water"></i> ក. ជម្រកក្នុងទឹក (កំប្លោក, ឈូក...)
                  </button>
                  <button
                    onClick={() => {
                      playTone('click');
                      setActiveHabitat('forest');
                    }}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center gap-2 cursor-pointer ${
                      activeHabitat === 'forest' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <i className="fa-solid fa-tree"></i> ខ១. ជម្រកក្នុងព្រៃ (ព្រៃកម្ពុជា)
                  </button>
                  <button
                    onClick={() => {
                      playTone('click');
                      setActiveHabitat('desert');
                    }}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center gap-2 cursor-pointer ${
                      activeHabitat === 'desert' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <i className="fa-solid fa-sun"></i> ខ២. ជម្រកវាលខ្សាច់ (ដំបងយក្ស)
                  </button>
                </div>

                {/* Habitat Content: Water */}
                {activeHabitat === 'water' && (
                  <div className="space-y-5">
                    <div className="rounded-2xl p-6 bg-gradient-to-r from-blue-700 via-sky-600 to-cyan-600 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex-1">
                        <span className="bg-white/20 text-white text-xs px-2.5 py-0.5 rounded-full font-bold uppercase">រុក្ខជាតិទឹក</span>
                        <h3 className="text-xl sm:text-2xl font-bold mt-1">កំប្លោក, ឈូក, ចក, ព្រលឹត</h3>
                        <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl">
                          ដុះក្នុងទឹក ឬអណ្តែតលើផ្ទៃទឹកសាប និងទឹកប្រៃ។ រុក្ខជាតិទាំងនេះមានលក្ខណៈសរីរាង្គពិសេស ៣ យ៉ាងដើម្បីរស់នៅ និងអណ្តែតលើទឹក។
                        </p>
                      </div>
                      <div className="w-40 h-28 rounded-xl overflow-hidden shadow border border-white/20 shrink-0 bg-sky-800 flex items-center justify-center">
                        <svg className="w-full h-full" viewBox="0 0 160 110" fill="none">
                          <path d="M0,70 Q40,60 80,70 T160,70 L160,110 L0,110 Z" fill="#0284C7" />
                          <ellipse cx="80" cy="72" rx="42" ry="14" fill="#15803D" />
                          <path d="M80,72 L65,65" stroke="#166534" strokeWidth="2" />
                          <circle cx="80" cy="50" r="16" fill="#F43F5E" />
                          <circle cx="74" cy="48" r="12" fill="#FB7185" />
                          <circle cx="86" cy="48" r="12" fill="#FDA4AF" />
                          <circle cx="80" cy="44" r="8" fill="#FDE047" />
                          <line x1="80" y1="72" x2="80" y2="105" stroke="#16A34A" strokeWidth="4" />
                        </svg>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-5 rounded-2xl bg-sky-50 border border-sky-200 shadow-xs hover:shadow-md transition">
                        <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold mb-3 shadow">
                          <i className="fa-solid fa-anchor"></i>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">១. ឫសខ្លីៗ</h4>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                          មានឫសខ្លីៗសម្រាប់ស្រូបទឹក និងសារធាតុចិញ្ចឹមដែលរលាយក្នុងទឹកយ៉ាងរហ័ស មិនចាំបាច់ចាក់ជ្រៅក្នុងដីឡើយ។
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-sky-50 border border-sky-200 shadow-xs hover:shadow-md transition">
                        <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold mb-3 shadow">
                          <i className="fa-solid fa-bacon"></i>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">២. ដើមប្រហោង ឬប៉ោង</h4>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                          ដើមមានប្រហោងសម្រាប់ឱ្យខ្យល់ឆ្លងកាត់ ឬស្តុកទឹក។ ប្រហោងនេះភ្ជាប់ជាមួយនឹងស្តូម៉ាតរបស់ស្លឹកដើម្បីដឹកនាំសារធាតុចិញ្ចឹម និងជួយឱ្យស្រាលអណ្តែតទឹក។
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-sky-50 border border-sky-200 shadow-xs hover:shadow-md transition">
                        <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold mb-3 shadow">
                          <i className="fa-solid fa-sun"></i>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">៣. ស្លឹកធំទូលាយ</h4>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                          ស្លឹកលាតសន្ធឹងរាលលើផ្ទៃទឹកដើម្បីស្រូបយកពន្លឺព្រះអាទិត្យឱ្យបានច្រើនបំផុតសម្រាប់ផលិតអាហារ (រស្មីសំយោគ)។
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Habitat Content: Forest */}
                {activeHabitat === 'forest' && (
                  <div className="space-y-5">
                    <div className="rounded-2xl p-6 bg-gradient-to-r from-emerald-800 via-teal-700 to-green-700 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex-1">
                        <span className="bg-white/20 text-white text-xs px-2.5 py-0.5 rounded-full font-bold uppercase">រុក្ខជាតិព្រៃឈើកម្ពុជា</span>
                        <h3 className="text-xl sm:text-2xl font-bold mt-1">ដើមឈើធំៗ, វល្លិ, ផ្ញើប្រាណ</h3>
                        <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl">
                          នៅក្នុងព្រៃនៃប្រទេសកម្ពុជាមានរុក្ខជាតិដុះប្រជ្រៀតគ្នាជាច្រើនជាន់ ដណ្តើមពន្លឺថ្ងៃ និងទីកន្លែងរស់នៅ។
                        </p>
                      </div>
                      <div className="w-40 h-28 rounded-xl overflow-hidden shadow border border-white/20 shrink-0 bg-emerald-900 flex items-center justify-center">
                        <svg className="w-full h-full" viewBox="0 0 160 110" fill="none">
                          <rect width="160" height="110" fill="#064E3B" />
                          <circle cx="40" cy="30" r="30" fill="#059669" />
                          <circle cx="110" cy="25" r="35" fill="#10B981" />
                          <circle cx="150" cy="40" r="25" fill="#047857" />
                          <rect x="75" y="45" width="12" height="65" fill="#78350F" />
                          <path d="M68,110 Q85,85 75,65 Q88,50 82,30" stroke="#84CC16" strokeWidth="3.5" fill="none" />
                        </svg>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-xs hover:shadow-md transition">
                        <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold mb-3 shadow">
                          <i className="fa-solid fa-leaf"></i>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">១. ស្លឹកឆ្លាស់ទងគ្នា</h4>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                          ខ្លះមានស្លឹកធំៗតែចំនួនតិច ខ្លះមានស្លឹកល្អិតៗតែចំនួនច្រើនឆ្លាស់ទងគ្នា ដើម្បីកុំឱ្យបាំងពន្លឺថ្ងៃគ្នាទៅវិញទៅមក។
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-xs hover:shadow-md transition">
                        <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold mb-3 shadow">
                          <i className="fa-solid fa-arrow-trend-up"></i>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">២. ដុះខ្ពស់ ឬជាវល្លិ</h4>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                          រុក្ខជាតិខ្លះមានមាឌធំខ្ពស់ត្រដែត ឯខ្លះជាវល្លិតោងឡើងលើដើមឈើដទៃ ដើម្បីឡើងទៅទទួលពន្លឺព្រះអាទិត្យនៅជាន់លើ។
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-xs hover:shadow-md transition">
                        <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold mb-3 shadow">
                          <i className="fa-solid fa-hands-holding"></i>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">៣. រស់ដោយសារគេ</h4>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                          រុក្ខជាតិខ្លះដូចជា ផ្ញើប្រាណ ឬស្លែ រស់នៅតោងលើដើមឈើដទៃ ដើម្បីស្រូបយកសំណើម ទឹកភ្លៀង និងកម្ទេចកំទីជីវជាតិ។
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Habitat Content: Desert */}
                {activeHabitat === 'desert' && (
                  <div className="space-y-5">
                    <div className="rounded-2xl p-6 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex-1">
                        <span className="bg-white/20 text-white text-xs px-2.5 py-0.5 rounded-full font-bold uppercase">លក្ខខណ្ឌក្តៅ & ស្ងួត</span>
                        <h3 className="text-xl sm:text-2xl font-bold mt-1">ដំបងយក្ស (Cactus)</h3>
                        <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-xl">
                          នៅវាលខ្សាច់មានរុក្ខជាតិតិចតួចណាស់ ព្រោះអាកាសធាតុក្តៅខ្លាំង និងពុំសូវមានទឹកភ្លៀងឡើយ។
                        </p>
                      </div>
                      <div className="w-40 h-28 rounded-xl overflow-hidden shadow border border-white/20 shrink-0 bg-amber-900 flex items-center justify-center">
                        <svg className="w-full h-full" viewBox="0 0 160 110" fill="none">
                          <circle cx="130" cy="25" r="14" fill="#FDE047" />
                          <path d="M0,80 Q50,65 100,82 T160,75 L160,110 L0,110 Z" fill="#D97706" />
                          <rect x="70" y="38" width="16" height="42" rx="8" fill="#059669" />
                          <path d="M62,50 Q62,60 70,60" stroke="#059669" strokeWidth="6" strokeLinecap="round" fill="none" />
                          <path d="M94,45 Q94,54 86,54" stroke="#059669" strokeWidth="6" strokeLinecap="round" fill="none" />
                          <path d="M78,80 L78,105 M78,85 L70,98 M78,92 L86,102" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 shadow-xs hover:shadow-md transition">
                        <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold mb-3 shadow">
                          <i className="fa-solid fa-burst"></i>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">១. ស្លឹកក្លាយជាបន្លា</h4>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                          ស្លឹករួញប្រែប្រួលក្លាយជាបន្លាស្រួច ដើម្បីទប់ស្កាត់ការភាយចំហាយទឹក និងការពារកុំឱ្យសត្វស៊ី។
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 shadow-xs hover:shadow-md transition">
                        <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold mb-3 shadow">
                          <i className="fa-solid fa-bottle-water"></i>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">២. ដើមផ្ទុកជាតិទឹកច្រើន</h4>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                          ដើមមានសាច់ក្រាស់ និងផ្ទុកជាតិទឹកច្រើនក្រាស់ឃ្មឹក សម្រាប់រក្សាទុកប្រើប្រាស់ក្នុងរដូវក្តៅរាំងស្ងួតវែងឆ្ងាយ។
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 shadow-xs hover:shadow-md transition">
                        <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold mb-3 shadow">
                          <i className="fa-solid fa-arrows-down-to-line"></i>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">៣. ឫសវែងៗចាក់ជ្រៅ</h4>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                          មានឫសវែងៗរាលសាចលើដីដើម្បីស្រូបទឹកសន្សើម និងចាក់ជ្រៅទៅក្រោមដីខ្សាច់ដើម្បីស្វែងរកប្រភពទឹកក្រោមដី។
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: PLANT DEFENSE */}
            {activeTab === 'defense' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                    ចំណុចទី ៣ នៃសៀវភៅពុម្ព (ទំព័រទី ៤ ដល់ ៥)
                  </span>
                  <h2 className="text-xl sm:text-3xl font-bold text-slate-900 mt-2">
                    ការការពារខ្លួនរបស់រុក្ខជាតិ (Plant Defense)
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    តើសត្រូវរបស់រុក្ខជាតិមានអ្វីខ្លះ? សត្រូវរបស់រុក្ខជាតិមាន <strong>មនុស្ស សត្វ និងកត្តាផ្សេងៗនៃបរិស្ថាន (កម្ដៅ អាកាសធាតុស្ងួត...)</strong>។
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Category 1: Against Animals & Humans */}
                  <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-50/70 to-pink-50/50 border border-rose-200 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center text-2xl shadow-md">
                        <i className="fa-solid fa-hand-dots"></i>
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-rose-700 uppercase">ផ្នែក ក</span>
                        <h3 className="text-lg font-bold text-slate-900">ទប់ទល់នឹងមនុស្ស ឬសត្វ</h3>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="p-4 bg-white rounded-2xl border border-rose-100 shadow-xs flex items-start gap-3">
                        <span className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          <i className="fa-solid fa-thumbtack"></i>
                        </span>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">បន្លាស្រួច (ដើមខ្មែរ, ដំបងយក្ស, ក្រូច, កុលាប)</h4>
                          <p className="text-xs text-slate-600 mt-0.5">ការពារកុំឱ្យមនុស្សបេះ ឬសត្វស៊ី និងជាន់ឈ្លីដើមរបស់វា។</p>
                        </div>
                      </div>

                      <div className="p-4 bg-white rounded-2xl border border-rose-100 shadow-xs flex items-start gap-3">
                        <span className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          <i className="fa-solid fa-feather"></i>
                        </span>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">រោមរមាស់ (ដើមហើរ, ដើមខ្លាញ់, ផ្លែរមាស់)</h4>
                          <p className="text-xs text-slate-600 mt-0.5">បង្កឱ្យរមាស់ក្រហាយខ្លាំងនៅពេលមនុស្សឬសត្វប៉ះពាល់លើស្លឹកឬផ្លែ។</p>
                        </div>
                      </div>

                      <div className="p-4 bg-white rounded-2xl border border-rose-100 shadow-xs flex items-start gap-3">
                        <span className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          <i className="fa-solid fa-skull-crossbones"></i>
                        </span>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">រសជាតិល្វីង ឬជាតិពុល (ជ័រល្ហុងខ្វង...)</h4>
                          <p className="text-xs text-slate-600 mt-0.5">ស្លឹកមានជាតិជូរចត់ ល្វីង ឬមានជ័រពុលធ្វើឱ្យសត្វមិនហ៊ានស៊ី។</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category 2: Against Drought & Heat */}
                  <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50/70 to-orange-50/50 border border-amber-200 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-md">
                        <i className="fa-solid fa-sun-plant-wilt"></i>
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-amber-700 uppercase">ផ្នែក ខ</span>
                        <h3 className="text-lg font-bold text-slate-900">ទប់ទល់នឹងកម្ដៅ & រដូវប្រាំង</h3>
                      </div>
                    </div>

                    <p className="text-xs text-amber-900 bg-amber-100/60 p-2.5 rounded-xl border border-amber-200">
                      <strong>គោលបំណងចម្បង៖</strong> ការពារខ្លួនកុំឱ្យចំហាយទឹកភាយច្រើន ដែលនាំឱ្យរុក្ខជាតិក្រៀមស្វិតស្រពោន ឬងាប់!
                    </p>

                    <div className="space-y-3 pt-1">
                      <div className="p-3.5 bg-white rounded-2xl border border-amber-100 shadow-xs flex items-start gap-3">
                        <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          <i className="fa-solid fa-wind"></i>
                        </span>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">ជម្រុះស្លឹកអស់ (ឫស្សី, ក្រញូង...)</h4>
                          <p className="text-xs text-slate-600 mt-0.5">ជ្រុះស្លឹកចោលអស់នៅរដូវប្រាំង ដើម្បីផ្អាកការភាយចំហាយទឹក។</p>
                        </div>
                      </div>

                      <div className="p-3.5 bg-white rounded-2xl border border-amber-100 shadow-xs flex items-start gap-3">
                        <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          <i className="fa-solid fa-scroll"></i>
                        </span>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">ខួរស្លឹក (រមូរស្លឹក ដូចជា ស្លឹកចេក, ស្លឹកពោត)</h4>
                          <p className="text-xs text-slate-600 mt-0.5">រមូរស្លឹកចូលគ្នានៅពេលថ្ងៃក្តៅ ដើម្បីកាត់បន្ថយផ្ទៃប៉ះពន្លឺថ្ងៃ។</p>
                        </div>
                      </div>

                      <div className="p-3.5 bg-white rounded-2xl border border-amber-100 shadow-xs flex items-start gap-3">
                        <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          <i className="fa-solid fa-droplet-slash"></i>
                        </span>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">មានម្សៅ ឬក្រមួនលើស្លឹក (ស្លឹកចេក)</h4>
                          <p className="text-xs text-slate-600 mt-0.5">ស្រទាប់ម្សៅសៗជួយជះពន្លឺថ្ងៃត្រឡប់មកវិញ និងការពាររំហួតទឹក។</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: VIRTUAL LAB & COMPARISON */}
            {activeTab === 'lab' && (
              <div className="space-y-6">
                {/* Simulation Lab Box */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                  <div className="border-b border-slate-100 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                        មន្ទីរពិសោធន៍និម្មិត
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                        ការពិសោធន៍ ៖ រំហួតទឹក និងកម្ដៅថ្ងៃ (Transpiration Lab)
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        សាកល្បងកែប្រែកម្រិតកម្តៅថ្ងៃ និងបើកយន្តការការពារខ្លួន ដើម្បីមើលការបាត់បង់ទឹករបស់រុក្ខជាតិ!
                      </p>
                    </div>
                    <div className="bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 self-start sm:self-auto">
                      <i className="fa-solid fa-microscope text-base text-emerald-600"></i> សិក្សាស្វែងយល់ជាក់ស្តែង
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    {/* Controls */}
                    <div className="lg:col-span-5 space-y-5 bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                            <i className="fa-solid fa-temperature-high text-rose-500"></i> កម្រិតកម្ដៅថ្ងៃ (សីតុណ្ហភាព)
                          </label>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                            {heatLevel === 1 ? 'ត្រជាក់ល្មម (២៤°C)' : heatLevel === 2 ? 'ក្តៅល្មម (៣០°C)' : 'រាំងស្ងួតខ្លាំង (៣៨°C)'}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="3"
                          value={heatLevel}
                          onChange={(e) => {
                            playTone('click');
                            setHeatLevel(Number(e.target.value));
                          }}
                          className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                          <span>ត្រជាក់ (រដូវវស្សា)</span>
                          <span>ក្តៅល្មម</span>
                          <span>រាំងស្ងួត (រដូវប្រាំង)</span>
                        </div>
                      </div>

                      <div className="space-y-3 pt-2 border-t border-slate-200">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">បើក/បិទ យន្តការសម្របខ្លួន៖</h4>

                        <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-emerald-300 transition">
                          <span className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                            <i className="fa-solid fa-scroll text-amber-500"></i> ខួរស្លឹក (រមូរស្លឹក)
                          </span>
                          <input
                            type="checkbox"
                            checked={isCurled}
                            onChange={(e) => {
                              playTone('click');
                              setIsCurled(e.target.checked);
                            }}
                            className="w-4 h-4 accent-emerald-600 cursor-pointer rounded"
                          />
                        </label>

                        <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-emerald-300 transition">
                          <span className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                            <i className="fa-solid fa-spa text-teal-500"></i> ស្រទាប់ម្សៅ ឬក្រមួនលើស្លឹក
                          </span>
                          <input
                            type="checkbox"
                            checked={isWax}
                            onChange={(e) => {
                              playTone('click');
                              setIsWax(e.target.checked);
                            }}
                            className="w-4 h-4 accent-emerald-600 cursor-pointer rounded"
                          />
                        </label>

                        <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-emerald-300 transition">
                          <span className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                            <i className="fa-solid fa-leaf text-rose-500"></i> ជម្រុះស្លឹកអស់ (ឬប្លែងជាបន្លា)
                          </span>
                          <input
                            type="checkbox"
                            checked={isDropped}
                            onChange={(e) => {
                              playTone('click');
                              setIsDropped(e.target.checked);
                            }}
                            className="w-4 h-4 accent-emerald-600 cursor-pointer rounded"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Simulation Visual Output */}
                    <div className="lg:col-span-7 bg-gradient-to-b from-sky-100 via-emerald-50 to-amber-50 p-6 rounded-2xl border border-emerald-200 text-center relative overflow-hidden">
                      <div className="flex items-center justify-around mb-4">
                        <div
                          className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-3xl shadow-lg transition-all duration-500 ${
                            heatLevel === 1 ? 'bg-amber-300 scale-90' : heatLevel === 2 ? 'bg-amber-400 scale-100' : 'bg-orange-500 scale-110 shadow-orange-300'
                          }`}
                        >
                          <i className="fa-solid fa-sun"></i>
                        </div>

                        <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl border border-slate-200 shadow-xs text-left">
                          <span className="text-[10px] text-slate-400 font-bold block uppercase">អត្រាហួតទឹក</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="w-24 bg-slate-200 rounded-full h-3 overflow-hidden">
                              <div
                                className="bg-rose-500 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${currentWaterLoss}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-bold text-slate-800">{currentWaterLoss}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="py-6 flex flex-col items-center justify-center">
                        <div className="text-7xl transition-all duration-500">
                          {currentWaterLoss > 70 ? '🥀' : currentWaterLoss > 35 ? '🌿' : '🌵'}
                        </div>
                        <div
                          className={`mt-3 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                            currentWaterLoss > 70
                              ? 'bg-rose-100 text-rose-800'
                              : currentWaterLoss > 35
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {currentWaterLoss > 70
                            ? 'រុក្ខជាតិស្វិតស្រពោន (បាត់បង់ទឹកខ្លាំង)'
                            : currentWaterLoss > 35
                            ? 'រុក្ខជាតិរស់នៅធម្មតា'
                            : 'រក្សាជាតិទឹកបានយ៉ាងល្អឥតខ្ចោះ!'}
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 bg-white/80 p-3 rounded-xl border border-slate-200/80">
                        {currentWaterLoss > 70
                          ? 'កម្ដៅថ្ងៃក្តៅខ្លាំងពេក ហើយគ្មានយន្តការការពារគ្រប់គ្រាន់ ធ្វើឱ្យចំហាយទឹកភាយចេញច្រើន ឈានដល់ការស្វិតក្រៀម!'
                          : currentWaterLoss > 35
                          ? 'រុក្ខជាតិអាចរក្សាតុល្យភាពជាតិទឹកបានល្អ ដោយសារយន្តការសម្របខ្លួនបានទប់ស្កាត់ការភាយចំហាយទឹកមួយចំណែកធំ។'
                          : 'អស្ចារ្យណាស់! ការជម្រុះស្លឹក ឬប្លែងជាបន្លា និងស្រទាប់ក្រមួនជួយកាត់បន្ថយការបាត់បង់ជាតិទឹកដល់កម្រិតអប្បបរមា!'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comparison Section: Reeds vs Lotus */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                  <div className="border-b border-slate-100 pb-4 mb-6">
                    <span className="bg-teal-100 text-teal-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                      លំហាត់ប្រៀបធៀបសៀវភៅពុម្ព (ទំព័រទី ៦)
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                      ការប្រៀបធៀបរវាង «ដើមត្រែង» និង «ដើមឈូក»
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                      សៀវភៅពុម្ពទំព័រទី ៦ តម្រូវឱ្យសិស្សសង្កេត និងប្រៀបធៀប ស្លឹក ដើម និងឫស នៃរុក្ខជាតិទាំងពីរ៖
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Reed Card */}
                    <div className="p-6 rounded-2xl bg-amber-50/50 border-2 border-amber-200 shadow-xs space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl overflow-hidden shadow bg-amber-200 flex items-center justify-center p-1 shrink-0">
                          <svg className="w-full h-full" viewBox="0 0 60 60" fill="none">
                            <path d="M10,55 L30,5 L50,55" stroke="#78350F" strokeWidth="1.5" />
                            <path d="M30,35 Q10,25 5,15" stroke="#15803D" strokeWidth="3" strokeLinecap="round" />
                            <path d="M30,25 Q50,18 55,8" stroke="#15803D" strokeWidth="3" strokeLinecap="round" />
                            <line x1="30" y1="60" x2="30" y2="5" stroke="#65A30D" strokeWidth="4.5" />
                            <line x1="26" y1="25" x2="34" y2="25" stroke="#365314" strokeWidth="2" />
                            <line x1="26" y1="40" x2="34" y2="40" stroke="#365314" strokeWidth="2" />
                            <path d="M30,52 L18,60 M30,52 L24,60 M30,52 L36,60 M30,52 L42,60" stroke="#92400E" strokeWidth="2" />
                          </svg>
                        </div>
                        <div>
                          <span className="text-xs text-amber-700 font-bold uppercase">រុក្ខជាតិគោកក្បែរទឹក</span>
                          <h3 className="text-lg font-bold text-slate-900">ដើមត្រែង (Reeds / Phragmites)</h3>
                        </div>
                      </div>

                      <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                        <li className="bg-white p-3 rounded-xl border border-amber-100 flex items-start gap-2">
                          <strong className="text-amber-800 shrink-0">ស្លឹក៖</strong>
                          <span>ស្លឹកស្រួចវែងៗដូចផ្លែដាវ ដុះរុំស្រោបដើម ទប់ទល់នឹងខ្យល់បក់ខ្លាំង។</span>
                        </li>
                        <li className="bg-white p-3 rounded-xl border border-amber-100 flex items-start gap-2">
                          <strong className="text-amber-800 shrink-0">ដើម៖</strong>
                          <span>ដើមត្រង់ មានថ្នាំងៗ និងមានរាងមូលទ្រវែង រឹងមាំទប់នឹងចរន្តខ្យល់។</span>
                        </li>
                        <li className="bg-white p-3 rounded-xl border border-amber-100 flex items-start gap-2">
                          <strong className="text-amber-800 shrink-0">ឫស៖</strong>
                          <span>ឫសមានសរសៃញឹកស្ញក ចាក់ជ្រៅក្នុងភក់ និងដីមាត់ទឹក ដើម្បីទប់ដើមឱ្យរឹងមាំមិនរលំ។</span>
                        </li>
                      </ul>
                    </div>

                    {/* Lotus Card */}
                    <div className="p-6 rounded-2xl bg-sky-50/50 border-2 border-sky-200 shadow-xs space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl overflow-hidden shadow bg-sky-200 flex items-center justify-center p-1 shrink-0">
                          <svg className="w-full h-full" viewBox="0 0 60 60" fill="none">
                            <path d="M5,42 Q30,36 55,42" stroke="#0284C7" strokeWidth="2" />
                            <ellipse cx="30" cy="36" rx="24" ry="8" fill="#15803D" />
                            <circle cx="30" cy="22" r="10" fill="#F43F5E" />
                            <circle cx="26" cy="20" r="7" fill="#FB7185" />
                            <circle cx="34" cy="20" r="7" fill="#FDA4AF" />
                            <line x1="30" y1="36" x2="30" y2="55" stroke="#16A34A" strokeWidth="3" />
                            <path d="M30,52 L22,58 M30,52 L38,58" stroke="#78350F" strokeWidth="2" />
                          </svg>
                        </div>
                        <div>
                          <span className="text-xs text-sky-700 font-bold uppercase">រុក្ខជាតិទឹក</span>
                          <h3 className="text-lg font-bold text-slate-900">ដើមឈូក (Lotus)</h3>
                        </div>
                      </div>

                      <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                        <li className="bg-white p-3 rounded-xl border border-sky-100 flex items-start gap-2">
                          <strong className="text-sky-800 shrink-0">ស្លឹក៖</strong>
                          <span>ស្លឹកមូលធំទូលាយ មានស្រទាប់ក្រមួនមិនជ្រាបទឹក អណ្តែតលើផ្ទៃទឹកស្រូបពន្លឺថ្ងៃ។</span>
                        </li>
                        <li className="bg-white p-3 rounded-xl border border-sky-100 flex items-start gap-2">
                          <strong className="text-sky-800 shrink-0">ដើម (ទង)៖</strong>
                          <span>ទងវែងមានបន្លាល្អិតៗ និងមានប្រហោងខ្យល់ច្រើននៅខាងក្នុង ជួយឱ្យស្រាលនិងបញ្ជូនខ្យល់។</span>
                        </li>
                        <li className="bg-white p-3 rounded-xl border border-sky-100 flex items-start gap-2">
                          <strong className="text-sky-800 shrink-0">ឫស (មើម)៖</strong>
                          <span>ឫសកប់នៅក្នុងភក់បាតបឹង ស្រូបទឹក និងសារធាតុរលាយក្នុងទឹក។</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: MATCHING GAME */}
            {activeTab === 'match' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="bg-teal-100 text-teal-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                      លំហាត់ទី ៥ នៃសៀវភៅពុម្ព (ទំព័រទី ៧)
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                      ល្បែងផ្គូផ្គង ៖ ឈ្មោះរុក្ខជាតិ និងឈ្មោះជម្រក
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                      ជ្រើសរើសជម្រកដែលត្រឹមត្រូវសម្រាប់រុក្ខជាតិនីមួយៗ (ផ្តៅ, គុយ, កោងកាង, រាំង, ដំបងយក្ស)៖
                    </p>
                  </div>

                  <button
                    onClick={resetMatchGame}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-2 self-start sm:self-auto cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> កំណត់ឡើងវិញ
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {[
                    { id: 1, name: '១. ផ្តៅ', desc: 'រុក្ខជាតិវល្លិមានបន្លា', icon: '🌿', bg: 'bg-emerald-100 text-emerald-800', options: [
                      { val: 'forest', label: 'ព្រៃភ្នំ / ព្រៃស្រោង' },
                      { val: 'mangrove', label: 'ព្រៃកោងកាង (ទឹកប្រៃ)' },
                      { val: 'flood', label: 'ព្រៃលិចទឹក (ទឹកសាប)' },
                      { val: 'desert', label: 'វាលខ្សាច់' },
                    ]},
                    { id: 2, name: '២. គុយ', desc: 'រុក្ខជាតិវល្លិផ្លែឈើព្រៃ', icon: '🌳', bg: 'bg-amber-100 text-amber-800', options: [
                      { val: 'forest', label: 'ព្រៃភ្នំ / ព្រៃគោក' },
                      { val: 'mangrove', label: 'ព្រៃកោងកាង (ទឹកប្រៃ)' },
                      { val: 'flood', label: 'ព្រៃលិចទឹក (ទឹកសាប)' },
                      { val: 'desert', label: 'វាលខ្សាច់' },
                    ]},
                    { id: 3, name: '៣. កោងកាង', desc: 'ឫសខ្យល់ទ្រទ្រង់ដើម', icon: '🌊', bg: 'bg-teal-100 text-teal-800', options: [
                      { val: 'forest', label: 'ព្រៃគោក' },
                      { val: 'mangrove', label: 'ព្រៃលិចទឹកតំបន់ឆ្នេរ (ទឹកប្រៃ)' },
                      { val: 'flood', label: 'ព្រៃលិចទឹកទន្លេសាប' },
                      { val: 'desert', label: 'វាលខ្សាច់' },
                    ]},
                    { id: 4, name: '៤. រាំង', desc: 'រុក្ខជាតិលិចទឹកទន្លេសាប', icon: '🐟', bg: 'bg-blue-100 text-blue-800', options: [
                      { val: 'forest', label: 'ព្រៃគោក' },
                      { val: 'mangrove', label: 'ព្រៃលិចទឹកតំបន់ឆ្នេរ' },
                      { val: 'flood', label: 'ព្រៃលិចទឹកសាប (បឹងទន្លេសាប)' },
                      { val: 'desert', label: 'វាលខ្សាច់' },
                    ]},
                    { id: 5, name: '៥. ដំបងយក្ស', desc: 'ស្លឹកជាបន្លា ដើមស្តុកទឹក', icon: '🌵', bg: 'bg-orange-100 text-orange-800', options: [
                      { val: 'forest', label: 'ព្រៃគោក' },
                      { val: 'mangrove', label: 'ព្រៃកោងកាង' },
                      { val: 'flood', label: 'ព្រៃលិចទឹក' },
                      { val: 'desert', label: 'វាលខ្សាច់ (ស្ងួតហួតហែង)' },
                    ]},
                  ].map((plant) => {
                    const sel = matchSelections[plant.id];
                    const isChecked = matchResults[plant.id] !== undefined;
                    const isCorrect = matchResults[plant.id] === true;
                    return (
                      <div key={plant.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-3">
                        <div className={`w-12 h-12 mx-auto rounded-xl ${plant.bg} flex items-center justify-center font-bold text-xl`}>
                          {plant.icon}
                        </div>
                        <h4 className="font-bold text-slate-900 text-base">{plant.name}</h4>
                        <span className="text-[11px] text-slate-500 block">{plant.desc}</span>
                        <select
                          value={sel}
                          disabled={isCorrect}
                          onChange={(e) => handleMatchChange(plant.id, e.target.value)}
                          className={`w-full text-xs font-semibold p-2.5 rounded-xl border transition ${
                            isCorrect
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                              : 'bg-white border-slate-300 text-slate-800'
                          }`}
                        >
                          <option value="">-- ជ្រើសរើសជម្រក --</option>
                          {plant.options.map((opt) => (
                            <option key={opt.val} value={opt.val}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        {isChecked && (
                          <div className={`text-xs font-bold ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {isCorrect ? '✓ ត្រឹមត្រូវ!' : '✗ មិនត្រឹមត្រូវទេ!'}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Research Questions & Model Answers */}
                <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
                  <h3 className="font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
                    <i className="fa-solid fa-graduation-cap text-emerald-600"></i> សំណួរស្រាវជ្រាវប្រចាំមេរៀន និងចម្លើយគំរូ (ទំព័រទី ៧)
                  </h3>

                  <details className="bg-slate-50 p-4 rounded-2xl border border-slate-200 group">
                    <summary className="font-bold text-slate-800 text-xs sm:text-sm cursor-pointer list-none flex justify-between items-center">
                      <span>១. តើនឹងមានអ្វីកើតឡើង នៅពេលបាត់បង់ ឬអស់ព្រៃឈើ?</span>
                      <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition" />
                    </summary>
                    <div className="mt-3 text-xs text-slate-600 pl-4 border-l-2 border-emerald-500 space-y-1">
                      <p><strong>ចម្លើយ៖</strong> នៅពេលអស់ព្រៃឈើ នឹងនាំឱ្យបាត់បង់ជម្រកសត្វព្រៃ ធ្វើឱ្យសត្វជិតផុតពូជ បង្កឱ្យមានការប្រែប្រួលអាកាសធាតុ កម្ដៅផែនដីកើនឡើង គ្រោះរាំងស្ងួត ទឹកជំនន់ និងការហូរច្រោះដីជីជាតិ។</p>
                    </div>
                  </details>

                  <details className="bg-slate-50 p-4 rounded-2xl border border-slate-200 group">
                    <summary className="font-bold text-slate-800 text-xs sm:text-sm cursor-pointer list-none flex justify-between items-center">
                      <span>២. តើរុក្ខជាតិបន្លាឈ្មោះអ្វី ដែលបច្ចុប្បន្នធ្វើឱ្យបរិមាណត្រីនៅបឹងទន្លេសាបចុះថយ?</span>
                      <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition" />
                    </summary>
                    <div className="mt-3 text-xs text-slate-600 pl-4 border-l-2 border-emerald-500 space-y-1">
                      <p><strong>ចម្លើយ៖</strong> គឺ <strong>«ដើមត្របែកយក្ស» ឬ «បន្លាយួន» (ឈ្មោះវិទ្យាសាស្ត្រ៖ <em>Mimosa pigra</em>)</strong>។ រុក្ខជាតិនេះដុះរាលដាលយ៉ាងលឿន ដណ្តើមយកព្រៃលិចទឹកធម្មជាតិ ធ្វើឱ្យត្រីបាត់បង់ជម្រកពងកូន និងរារាំងផ្លូវធ្វើចរាចរណ៍របស់មច្ឆាជាតិ។</p>
                    </div>
                  </details>

                  <details className="bg-slate-50 p-4 rounded-2xl border border-slate-200 group">
                    <summary className="font-bold text-slate-800 text-xs sm:text-sm cursor-pointer list-none flex justify-between items-center">
                      <span>៣. តើឈូកពង្រាយគ្រាប់ដោយវិធីណា? និងដូចម្តេច?</span>
                      <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition" />
                    </summary>
                    <div className="mt-3 text-xs text-slate-600 pl-4 border-l-2 border-emerald-500 space-y-1">
                      <p><strong>ចម្លើយ៖</strong> ឈូកពង្រាយគ្រាប់តាម <strong>«ចរន្តទឹក»</strong>។ បណ្ដូលផ្លែឈូកមានសភាពដូចអេប៉ុងស្រាលៗ អណ្តែតលើផ្ទៃទឹក។ ពេលផ្លែទុំជ្រុះចូលទឹក ចរន្តទឹកនាំផ្លែឈូកអណ្តែតទៅទីឆ្ងាយ។ ពេលផ្លែរលួយ គ្រាប់ធ្លាក់ចុះទៅក្នុងភក់បាតបឹង រួចដុះពន្លកជាកូនឈូកថ្មី។</p>
                    </div>
                  </details>
                </div>
              </div>
            )}

            {/* TAB 7: 40 QUESTIONS EXAM */}
            {activeTab === 'quiz' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                        តេស្តវាស់ស្ទង់សមត្ថភាពពេញលេញ
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                        ៤០ សំណួរ QCM
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                      កម្រងសំណួរពង្រឹងចំណេះដឹង (មេរៀនទី ១)
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      ចម្លើយត្រូវបានរៀបចំឆ្លាស់គ្នាស្មើៗគ្នា (ក, ខ, គ, ឃ) និងមានប្រវែងស្មើគ្នាដើម្បីវាស់ស្ទង់ការយល់ដឹងពិតប្រាកដ។
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-2xl shrink-0 self-start sm:self-auto">
                    <span className="text-xs text-emerald-800 font-bold">ឆ្លើយត្រូវ៖</span>
                    <span className="text-xl font-bold text-emerald-700">
                      {correctAnswersCount} / {fullQuizList.length}
                    </span>
                  </div>
                </div>

                {/* Question Navigator Grid */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">តារាងលេខសំណួរ (ចុចលើលេខដើម្បីផ្លាស់ប្តូរ)៖</span>
                    <span className="text-xs text-emerald-700 font-semibold">
                      បានឆ្លើយ៖ {Object.keys(answeredQuiz).length} / {fullQuizList.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-20 gap-1.5 max-h-32 overflow-y-auto p-1">
                    {fullQuizList.map((_, qIdx) => {
                      const isCurrent = qIdx === currentQuizIndex;
                      const hasAns = answeredQuiz[qIdx] !== undefined;
                      const isRight = hasAns ? fullQuizList[qIdx].options[answeredQuiz[qIdx]].isCorrect : false;

                      let btnStyle = 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100';
                      if (isCurrent) {
                        btnStyle = 'border-2 border-emerald-700 bg-emerald-600 text-white shadow-md';
                      } else if (hasAns) {
                        btnStyle = isRight
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                          : 'bg-rose-100 border-rose-400 text-rose-800';
                      }

                      return (
                        <button
                          key={qIdx}
                          onClick={() => {
                            playTone('click');
                            setCurrentQuizIndex(qIdx);
                          }}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-bold border transition flex items-center justify-center cursor-pointer ${btnStyle}`}
                        >
                          {qIdx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Current Question Body */}
                {(() => {
                  const q = fullQuizList[currentQuizIndex];
                  const hasAnswered = answeredQuiz[currentQuizIndex] !== undefined;
                  const selectedIndex = answeredQuiz[currentQuizIndex];

                  return (
                    <div className="space-y-6">
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 min-h-[300px] space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold">វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦</span>
                            <span className="text-xs text-slate-400">មេរៀនទី ១</span>
                          </div>
                          <span className="text-xs font-semibold text-slate-500">
                            សំណួរ {currentQuizIndex + 1} / {fullQuizList.length}
                          </span>
                        </div>

                        <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 leading-snug">
                          {currentQuizIndex + 1}. {q.question}
                        </h3>

                        {/* Options */}
                        <div className="space-y-2.5 pt-1">
                          {q.options.map((opt, optIdx) => {
                            let btnClasses = 'bg-white border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-slate-800';
                            let badgeIcon = (
                              <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
                                {['ក', 'ខ', 'គ', 'ឃ'][optIdx]}
                              </span>
                            );

                            if (hasAnswered) {
                              if (opt.isCorrect) {
                                btnClasses = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold shadow-xs';
                                badgeIcon = (
                                  <span className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                                    <Check className="w-4 h-4" />
                                  </span>
                                );
                              } else if (selectedIndex === optIdx) {
                                btnClasses = 'bg-rose-100 border-rose-500 text-rose-950';
                                badgeIcon = (
                                  <span className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                                    <X className="w-4 h-4" />
                                  </span>
                                );
                              } else {
                                btnClasses = 'bg-white border-slate-100 text-slate-400 opacity-50';
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                disabled={hasAnswered}
                                onClick={() => handleQuizAnswer(optIdx)}
                                className={`w-full text-left p-3.5 sm:p-4 rounded-xl border-2 transition-all flex items-center gap-3 cursor-pointer ${btnClasses}`}
                              >
                                {badgeIcon}
                                <span className="text-xs sm:text-sm font-medium flex-1">{opt.text}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Feedback / Hint */}
                        {hasAnswered ? (
                          <div
                            className={`mt-4 p-4 rounded-xl ${
                              q.options[selectedIndex].isCorrect
                                ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                                : 'bg-rose-50 border border-rose-200 text-rose-900'
                            }`}
                          >
                            <div className="flex items-center gap-2 font-bold text-xs sm:text-sm mb-1">
                              {q.options[selectedIndex].isCorrect ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-rose-600" />
                              )}
                              <span>{q.options[selectedIndex].isCorrect ? 'ត្រឹមត្រូវណាស់!' : 'មិនទាន់ត្រឹមត្រូវទេ!'}</span>
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed">{q.options[selectedIndex].exp}</p>
                          </div>
                        ) : (
                          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 italic">
                            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                            <span>ជំនួយស្មារតី៖ {q.hint}</span>
                          </div>
                        )}
                      </div>

                      {/* Navigation Buttons */}
                      <div className="flex items-center justify-between pt-2">
                        <button
                          disabled={currentQuizIndex === 0}
                          onClick={() => handleNavigateQuiz(-1)}
                          className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
                        >
                          <ChevronLeft className="w-4 h-4" /> <span>សំណួរមុន</span>
                        </button>
                        <span className="text-xs font-bold text-slate-500">
                          សំណួរទី {currentQuizIndex + 1} នៃ {fullQuizList.length}
                        </span>
                        <button
                          onClick={() => handleNavigateQuiz(1)}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition shadow-md cursor-pointer flex items-center gap-1.5"
                        >
                          <span>{currentQuizIndex === fullQuizList.length - 1 ? 'បញ្ចប់តេស្ត' : 'សំណួរបន្ទាប់'}</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* Completion Modal */}
                {isQuizCompleted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-900 to-teal-950 text-white text-center space-y-4 shadow-xl border border-emerald-600"
                  >
                    <div className="w-20 h-20 mx-auto rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-4xl shadow-lg">
                      <Trophy className="w-10 h-10 text-amber-950" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold">អបអរសាទរ! អ្នកបានបញ្ចប់តេស្តទាំង ៤០ សំណួរ!</h3>
                    <p className="text-sm text-emerald-100 max-w-lg mx-auto">
                      អ្នកឆ្លើយត្រូវ {correctAnswersCount} លើ {fullQuizList.length} សំណួរ ({Math.round((correctAnswersCount / fullQuizList.length) * 100)}%)! ពិន្ទុរួមរបស់អ្នកគឺ {totalScore} ពិន្ទុ។
                    </p>
                    <div className="pt-2 flex justify-center gap-3">
                      <button
                        onClick={restartQuiz}
                        className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-xl text-xs sm:text-sm transition shadow-lg cursor-pointer flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-4 h-4" /> <span>ធ្វើតេស្តឡើងវិញ</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </main>

          {/* Footer */}
          <footer className="bg-slate-950 text-slate-400 py-3 px-4 sm:px-6 border-t border-slate-800 text-xs shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-leaf text-emerald-500"></i>
              <span className="font-semibold text-slate-300">វិទ្យាសាស្ត្រ ថ្នាក់ទី៦ — មេរៀនទី ១ ៖ ការសម្របខ្លួនរបស់រុក្ខជាតិ</span>
            </div>
            <span className="text-[11px] text-slate-500 hidden sm:inline">ក្រសួងអប់រំ យុវជន និងកីឡា (ទំព័រ ២-៧)</span>
          </footer>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
