import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Smile,
  Image as ImageIcon,
  Paperclip,
  Users,
  Pin,
  Sparkles,
  Search,
  CheckCheck,
  Award,
  BookOpen,
  Volume2,
  VolumeX,
  Trash2,
  Bell,
  Heart,
  ThumbsUp,
  HelpCircle,
  MessageSquare,
  MessageCircle,
  MoreVertical,
  Check,
  ShieldCheck,
  Flame,
  AlertCircle,
  Mic,
  MicOff,
  Video,
  Play,
  Pause,
  FileText,
  FileSpreadsheet,
  FileArchive,
  File as FileIcon,
  Download,
  ListOrdered,
  Share2,
  Radio,
  Clock,
  ChevronDown,
  Sparkle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Student, TeacherProfile } from '../types';
import { isImageAvatar, compressImageFile } from '../utils/imageCompressor';
import { ClassLiveMeetingModal } from './ClassLiveMeetingModal';

export interface FileAttachment {
  name: string;
  size: string;
  type: string;
  url: string;
  extension: string;
}

export interface ChatMessage {
  id: string;
  senderId: string; // 'teacher' or studentId as string
  senderName: string;
  senderAvatar: string;
  senderRole: 'teacher' | 'student';
  senderRollNo?: number;
  text: string;
  imageUrl?: string;
  audioUrl?: string; // Voice note data url
  audioDuration?: number; // duration in seconds
  fileAttachment?: FileAttachment;
  timestamp: string;
  reactions: Record<string, number>; // emoji -> count
  isPinned?: boolean;
}

interface ClassGroupChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher?: TeacherProfile;
  students: Student[];
  currentStudent?: Student | null; // if viewing as student
  currentUserRole?: 'teacher' | 'student';
  isTeacherMode?: boolean; // if viewing as teacher
  onShowToast: (msg: string) => void;
}

const STORAGE_KEY = 'vutha_class_group_chat_messages_v1';

// Teacher Quick Sentences Templates
export const TEACHER_SENTENCE_TEMPLATES = [
  {
    category: '📢 សេចក្តីជូនដំណឹង',
    items: [
      '📢 សួស្ដីកូនៗទាំងអស់គ្នា! សូមត្រៀមសៀវភៅ និងសម្ភារៈសិក្សាឱ្យបានរួចរាល់សម្រាប់ម៉ោងរៀនស្អែកណា៎។',
      '⏰ សូមកូនៗទាំងអស់ផ្ញើកិច្ចការផ្ទះដែលគ្រូបានដាក់ឱ្យបានមុនម៉ោង ០៥:០០ ល្ងាចនេះ។',
      '📅 ថ្ងៃស្អែកថ្នាក់យើងមានការធ្វើតេស្តប្រចាំខែ សូមកូនៗខិតខំរំលឹកមេរៀនឡើងវិញទាំងអស់គ្នា!',
      '🔔 សូមជម្រាបជូនដំណឹងដល់អាណាព្យាបាលសិស្សទាំងអស់អំពីការប្រជុំមាតាបិតានៅចុងសប្តាហ៍នេះ។',
      '🚨 ថ្ងៃស្អែកសាលានឹងរៀបចំកម្មវិធីអនាម័យ និងសម្អាតបរិស្ថានថ្នាក់រៀន សូមកូនៗចូលរួមឱ្យបានទៀងទាត់។'
    ]
  },
  {
    category: '🌟 ពាក្យលើកទឹកចិត្ត & កោតសរសើរ',
    items: [
      '🌟 លោកគ្រូកោតសរសើរកូនៗទាំងអស់គ្នាដែលបានខិតខំរៀនសូត្រ និងសកម្មក្នុងការឆ្លើយសំណួរថ្ងៃនេះ!',
      '👏 កូនពូកែណាស់! ចម្លើយនេះពិតជាត្រឹមត្រូវ ច្បាស់លាស់ និងមានរបៀបរៀបរយល្អណាស់!',
      '💪 កុំបារម្ភចំពោះកំហុសឆ្គងណា៎ សំខាន់យើងហ៊ានសួរ ហ៊ានឆ្លើយ និងរៀនកែលម្អពីវា!',
      '🏆 អបអរសាទរកូនដែលទទួលបានពិន្ទុ ១០ លើកម្រងសំណួរ! សូមបន្តការខិតខំប្រឹងប្រែងនេះទៀតណា៎!',
      '❤️ គ្រូពិតជាមានមោទនភាព និងសប្បាយចិត្តចំពោះការរីកចម្រើនរបស់កូនៗគ្រប់គ្នា!'
    ]
  },
  {
    category: '📝 កិច្ចការផ្ទះ & មេរៀន',
    items: [
      '📖 សូមកូនៗបើកសៀវភៅពុម្ពទំព័រ ... ហើយធ្វើលំហាត់លេខ ... ដល់លេខ ... ក្នុងសៀវភៅកិច្ចការផ្ទះ។',
      '❓ តើកូនណាខ្លះមានចម្ងល់លើមេរៀនថ្ងៃនេះ? អាចសួរបញ្ជាក់គ្រូក្នុងក្រុមជជែកនេះបានណា៎!',
      '📐 កុំភ្លេចពិនិត្យកូនសៀវភៅរូបមន្តគណិតវិទ្យា និងអានអត្ថបទភាសាខ្មែរបន្ថែមនៅផ្ទះ។',
      '✍️ លំហាត់នេះត្រូវគិតឱ្យបានហ្មត់ចត់ កត់ត្រាដំណោះស្រាយមួយជំហានម្តងៗណា៎កូន។'
    ]
  },
  {
    category: '⏰ វត្តមាន & សួរសុខទុក្ខ',
    items: [
      '👋 សួស្ដីកូនៗ! តើថ្ងៃនេះសុខទុក្ខយ៉ាងណាដែរ? មានកូនណាឈឺ ឬត្រូវការជំនួយពីគ្រូទេ?',
      '📝 សូមអាណាព្យាបាល ឬសិស្សដែលត្រូវអវត្តមាន ផ្ញើពាក្យសុំច្បាប់មកគ្រូជាមុនផងណា៎។',
      '🥗 សូមកូនៗថែរក្សាសុខភាព បរិភោគអាហារមានជីវជាតិ និងគេងឱ្យបានគ្រប់គ្រាន់ណា៎!',
      '☀️ សូមជូនពរកូនៗមានថ្ងៃសិក្សាថ្មីប្រកបដោយភាពរីករាយ និងឆ្លាតវៃទាំងអស់គ្នា!'
    ]
  },
  {
    category: '🎯 ការប្រឡង & តេស្ត',
    items: [
      '🎯 សេចក្តីរំលឹក ៖ ការប្រឡងឆមាសនឹងចាប់ផ្តើមឆាប់ៗនេះ សូមកូនៗរៀបចំកាលវិភាគរំលឹកមេរៀន។',
      '💡 ពេលធ្វើតេស្ត Online សូមអានសំណួរនីមួយៗឱ្យបានច្បាស់លាស់មុននឹងជ្រើសរើសចម្លើយ។',
      '✨ គ្រូសូមជូនពរកូនៗទទួលបានជោគជ័យ និងចំណាត់ថ្នាក់ល្អក្នុងការប្រឡងទាំងអស់គ្នា!'
    ]
  }
];

// Rich Categorized Emojis
export const EMOJI_CATEGORIES = [
  {
    id: 'reactions',
    label: '⭐ ប្រតិកម្ម & សរសើរ',
    emojis: ['❤️', '👍', '👏', '🎉', '💯', '🔥', '🌟', '💡', '🙏', '😊', '😍', '🥳', '✨', '💖', '🥇', '🏆', '🙌', '🤩']
  },
  {
    id: 'school',
    label: '📚 សាលារៀន & សិក្សា',
    emojis: ['📚', '✏️', '📐', '📖', '🎒', '🎓', '📝', '🏫', '🔬', '🎨', '🖊️', '📏', '🧪', '💻', '📱', '🔔', '📌', '📎']
  },
  {
    id: 'people',
    label: '👦👧 សិស្ស & គ្រូ',
    emojis: ['👨‍🏫', '👩‍🏫', '👧', '👦', '🧑‍🎓', '🙋‍♂️', '🙋‍♀️', '🤝', '💬', '📢', '🙆‍♂️', '🙆‍♀️', '🫶', '😎', '😇', '🤔', '💪', '👋']
  },
  {
    id: 'nature_fun',
    label: '🌺 ធម្មជាតិ & កម្សាន្ត',
    emojis: ['🌸', '🌺', '🍀', '🌈', '☀️', '🎈', '🐱', '🐶', '🐬', '🐠', '🕊️', '⚽', '🎯', '🚀', '🎁', '🍰', '🍎', '🍉']
  }
];

const DEFAULT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome',
    senderId: 'teacher',
    senderName: 'គ្រូបន្ទុកថ្នាក់',
    senderAvatar: '👨‍🏫',
    senderRole: 'teacher',
    text: 'សួស្ដីកូនៗសិស្សានុសិស្សទាំងអស់គ្នា! នេះជាក្រុមជជែកផ្លូវការប្រចាំថ្នាក់របស់យើង សម្រាប់សួរមេរៀន ពិភាក្សាកិច្ចការផ្ទះ និងទទួលដំណឹងផ្សេងៗពីគ្រូ។ សូមកូនៗសួរសំណួរដោយគួរសម និងជួយគ្នាទៅវិញទៅមកណា៎! 🌟📚',
    timestamp: 'ម្សិលមិញ ម៉ោង ០៨:០០ ព្រឹក',
    reactions: { '❤️': 8, '👏': 6, '💯': 5 },
    isPinned: true,
  },
  {
    id: 'msg-1',
    senderId: 'student-1',
    senderName: 'សុខ ពិសី',
    senderAvatar: '👧',
    senderRole: 'student',
    senderRollNo: 1,
    text: 'ជម្រាបសួរលោកគ្រូ! ខ្ញុំបានអានមេរៀនវិទ្យាសាស្ត្រ និងធ្វើលំហាត់ក្នុងសៀវភៅពុម្ពរួចរាល់ហើយចាស៎ 🙏✨',
    timestamp: 'ម្សិលមិញ ម៉ោង ០៨:១៥ ព្រឹក',
    reactions: { '👍': 4, '👏': 3 },
  },
  {
    id: 'msg-2',
    senderId: 'student-2',
    senderName: 'ចាន់ តារា',
    senderAvatar: '👦',
    senderRole: 'student',
    senderRollNo: 2,
    text: 'ជម្រាបសួរលោកគ្រូ! លំហាត់គណិតវិទ្យាលេខ ៣ ទំព័រ ៤២ តើយើងត្រូវគណនាផ្ទៃក្រឡា ឬបរិមាត្របាទ?',
    timestamp: 'ថ្ងៃនេះ ម៉ោង ០៧:៣០ ព្រឹក',
    reactions: { '💡': 3 },
  },
  {
    id: 'msg-3',
    senderId: 'teacher',
    senderName: 'គ្រូបន្ទុកថ្នាក់',
    senderAvatar: '👨‍🏫',
    senderRole: 'teacher',
    text: 'ឆ្លើយតបតារា ៖ លំហាត់លេខ ៣ នោះគឺគណនាផ្ទៃក្រឡាចតុកោណកែង (បណ្តោយ × ទទឹង) ណា៎កូន។ កុំភ្លេចដាក់ខ្នាតម៉ែត្រការ៉េ (m²) ផង! 📐✏️',
    timestamp: 'ថ្ងៃនេះ ម៉ោង ០៧:៣៥ ព្រឹក',
    reactions: { '❤️': 5, '💯': 4 },
  },
];

const QUICK_CHIPS = [
  '🙋‍♂️ សួស្ដីលោកគ្រូ & មិត្តភក្តិ!',
  '📝 ខ្ញុំបានធ្វើកិច្ចការផ្ទះរួចរាល់ហើយ',
  '❓ លោកគ្រូ ខ្ញុំមានចម្ងល់លើលំហាត់នេះ...',
  '💡 សូមលោកគ្រូជួយពន្យល់ឡើងវិញបន្តិចបានទេ?',
  '🌟 សូមអរគុណលោកគ្រូ!',
  '🏆 ខ្ញុំបានពិន្ទុ ១០ លើកម្រងសំណួរ!',
];

export const ClassGroupChatModal: React.FC<ClassGroupChatModalProps> = ({
  isOpen,
  onClose,
  teacher,
  students,
  currentStudent,
  currentUserRole,
  isTeacherMode = false,
  onShowToast,
}) => {
  // Determine if active user is Teacher
  const isTeacher = Boolean(isTeacherMode || currentUserRole === 'teacher');

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // ignore
    }
    return DEFAULT_MESSAGES;
  });

  const [inputText, setInputText] = useState('');
  const [showMembersDrawer, setShowMembersDrawer] = useState(false);
  const [showEmojiTray, setShowEmojiTray] = useState(false);
  const [activeEmojiCategory, setActiveEmojiCategory] = useState('reactions');
  const [showTeacherTemplates, setShowTeacherTemplates] = useState(false);
  const [showLiveMeeting, setShowLiveMeeting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // File Attachments state
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedFile, setAttachedFile] = useState<FileAttachment | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  // Voice Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<any>(null);

  // Audio Playback state
  const [currentlyPlayingAudioId, setCurrentlyPlayingAudioId] = useState<string | null>(null);
  const [audioPlaybackProgress, setAudioPlaybackProgress] = useState(0);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Teacher / Sender profile synchronization
  const myName = isTeacher
    ? (teacher?.name || 'លោកគ្រូ/អ្នកគ្រូ')
    : (currentStudent?.name || 'សិស្ស');

  const myAvatar = isTeacher
    ? (teacher?.avatar || '👨‍🏫')
    : (currentStudent?.avatar || (currentStudent?.gender === 'ស្រី' ? '👧' : '👦'));

  const myId = isTeacher
    ? 'teacher'
    : (currentStudent?.id ? `student-${currentStudent.id}` : 'student-temp');

  const myRole: 'teacher' | 'student' = isTeacher ? 'teacher' : 'student';
  const myRollNo = isTeacher ? undefined : currentStudent?.rollNo;

  // Save messages to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      // ignore
    }
  }, [messages]);

  // Auto scroll
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => scrollToBottom('auto'), 150);
    }
  }, [isOpen]);

  // Clean up recording on unmount or close
  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
    };
  }, []);

  // Play audio chime
  const playSoundEffect = (type: 'send' | 'record' | 'pop') => {
    if (!soundEnabled || typeof Audio === 'undefined') return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'send') {
        osc.frequency.setValueAtTime(580, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
      } else if (type === 'record') {
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(660, audioCtx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
      }
    } catch (e) {
      // ignore
    }
  };

  // ================= SEND MESSAGE =================
  const handleSendMessage = (
    textToSend?: string,
    voiceDataUrl?: string,
    voiceDurationSecs?: number
  ) => {
    const content = (textToSend !== undefined ? textToSend : inputText).trim();
    if (!content && !attachedImage && !attachedFile && !voiceDataUrl) return;

    const now = new Date();
    const timeStr = `ថ្ងៃនេះ ម៉ោង ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      senderId: myId,
      senderName: myName,
      senderAvatar: myAvatar,
      senderRole: myRole,
      senderRollNo: myRollNo,
      text: content,
      imageUrl: attachedImage || undefined,
      fileAttachment: attachedFile || undefined,
      audioUrl: voiceDataUrl,
      audioDuration: voiceDurationSecs,
      timestamp: timeStr,
      reactions: {},
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
    setAttachedImage(null);
    setAttachedFile(null);
    setShowEmojiTray(false);
    setShowTeacherTemplates(false);

    playSoundEffect('send');
    setTimeout(() => scrollToBottom('smooth'), 100);
  };

  // ================= VOICE RECORDING =================
  const startRecordingVoice = async () => {
    if (isRecording) return;
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        onShowToast('កម្មវិធីរុករកនេះមិនគាំទ្រការថតសំឡេងទេ');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      let mimeType = 'audio/webm;codecs=opus';
      if (typeof MediaRecorder.isTypeSupported === 'function') {
        if (!MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          mimeType = MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')
            ? 'audio/ogg;codecs=opus'
            : '';
        }
      }

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start(100);
      setIsRecording(true);
      setRecordingDuration(0);
      playSoundEffect('record');
      onShowToast('🎙️ កំពុងថតសំឡេង... សូមនិយាយ!');

      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone permission or error:', err);
      onShowToast('មិនអាចបើកមីក្រូហ្វូនបានទេ សូមអនុញ្ញាតសិទ្ធិប្រើប្រាស់ Microphone');
    }
  };

  const stopAndSendVoice = () => {
    if (!isRecording || !mediaRecorderRef.current) return;

    const recorder = mediaRecorderRef.current;
    const duration = recordingDuration || 1;

    recorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Audio = reader.result as string;
        handleSendMessage('🎙️ សារជាសំឡេង (Voice Note)', base64Audio, duration);
        onShowToast('បានផ្ញើសារសំឡេង!');
      };
      reader.readAsDataURL(audioBlob);
    };

    recorder.stop();
    if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    setIsRecording(false);
    setRecordingDuration(0);
  };

  const cancelRecording = () => {
    if (!isRecording || !mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
    if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    setIsRecording(false);
    setRecordingDuration(0);
    audioChunksRef.current = [];
    onShowToast('បានបោះបង់ការថតសំឡេង');
  };

  // ================= VOICE AUDIO PLAYBACK =================
  const togglePlayAudio = (msgId: string, audioUrl: string) => {
    if (currentlyPlayingAudioId === msgId) {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
      setCurrentlyPlayingAudioId(null);
      return;
    }

    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }

    const audio = new Audio(audioUrl);
    audioElementRef.current = audio;
    setCurrentlyPlayingAudioId(msgId);
    setAudioPlaybackProgress(0);

    audio.ontimeupdate = () => {
      if (audio.duration) {
        setAudioPlaybackProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.onended = () => {
      setCurrentlyPlayingAudioId(null);
      setAudioPlaybackProgress(0);
    };

    audio.play().catch((e) => {
      console.warn('Audio playback error', e);
      setCurrentlyPlayingAudioId(null);
    });
  };

  // ================= REACTIONS & PIN =================
  const handleReaction = (msgId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === msgId) {
          const currentReactions = { ...msg.reactions };
          currentReactions[emoji] = (currentReactions[emoji] || 0) + 1;
          return { ...msg, reactions: currentReactions };
        }
        return msg;
      })
    );
  };

  const handleTogglePin = (msgId: string) => {
    if (!isTeacher) {
      onShowToast('មានតែលោកគ្រូ-អ្នកគ្រូទេដែលអាច Pin សារសំខាន់បាន');
      return;
    }
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === msgId) {
          const nextPinned = !msg.isPinned;
          onShowToast(nextPinned ? 'បាន Pin សេចក្តីជូនដំណឹងនេះ' : 'បានដក Pin ចេញ');
          return { ...msg, isPinned: nextPinned };
        }
        return msg;
      })
    );
  };

  const handleClearChat = () => {
    if (confirm('តើអ្នកពិតជាចង់សម្អាតប្រវត្តិសារទាំងអស់មែនទេ?')) {
      setMessages(DEFAULT_MESSAGES);
      onShowToast('បានកំណត់សារជាទម្រង់ដើមវិញ');
    }
  };

  // ================= FILE & IMAGE ATTACHMENTS =================
  const handleImageAttach = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onShowToast('សូមជ្រើសរើសឯកសារជារូបភាព');
      return;
    }

    setIsProcessingFile(true);
    try {
      const compressed = await compressImageFile(file, {
        maxWidth: 700,
        maxHeight: 700,
        quality: 0.8,
        mimeType: 'image/jpeg',
      });
      setAttachedImage(compressed);
      onShowToast('បានភ្ជាប់រូបភាព! សូមចុចផ្ញើសារ');
    } catch (err) {
      onShowToast('មិនអាចភ្ជាប់រូបភាពនេះបានទេ');
    } finally {
      setIsProcessingFile(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      onShowToast('ទំហំឯកសារធំពេក សូមជ្រើសរើសឯកសារក្រោម 8MB');
      return;
    }

    setIsProcessingFile(true);
    const reader = new FileReader();
    reader.onload = () => {
      const extension = file.name.split('.').pop()?.toUpperCase() || 'FILE';
      const sizeKB = Math.round(file.size / 1024);
      const sizeStr = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;

      setAttachedFile({
        name: file.name,
        size: sizeStr,
        type: file.type || 'application/octet-stream',
        url: reader.result as string,
        extension,
      });
      setIsProcessingFile(false);
      onShowToast(`📎 បានភ្ជាប់ឯកសារ ៖ ${file.name}`);
    };
    reader.onerror = () => {
      onShowToast('មិនអាចអានឯកសារនេះបានទេ');
      setIsProcessingFile(false);
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Dynamic replacement of teacher name and avatar in messages stream
  const displayedMessages = messages.map((m) => {
    if (m.senderRole === 'teacher') {
      return {
        ...m,
        senderName: teacher?.name || m.senderName,
        senderAvatar: teacher?.avatar || m.senderAvatar,
      };
    }
    return m;
  });

  const pinnedMessages = displayedMessages.filter((m) => m.isPinned);
  const filteredMessages = searchQuery.trim()
    ? displayedMessages.filter(
        (m) =>
          m.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.senderName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : displayedMessages;

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-hidden no-print">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          className="bg-white dark:bg-slate-900 rounded-[32px] max-w-3xl w-full h-[94vh] max-h-[820px] shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white flex flex-col overflow-hidden relative"
        >
          {/* ================= CHAT HEADER ================= */}
          <div className="p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              {/* Teacher / Group Chat Logo with Live Badge */}
              <div className="relative">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-purple-500 to-pink-500 p-0.5 shadow-lg flex items-center justify-center">
                  <div className="w-full h-full rounded-[14px] bg-slate-950 overflow-hidden flex items-center justify-center">
                    {teacher?.avatar && isImageAvatar(teacher.avatar) ? (
                      <img
                        src={teacher.avatar}
                        alt="Teacher"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="text-xl">{teacher?.avatar || '👨‍🏫'}</span>
                    )}
                  </div>
                </div>
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-extrabold text-sm sm:text-base font-moul leading-tight text-white flex items-center gap-1.5">
                    <span>ក្រុមជជែកក្នុងថ្នាក់រៀន</span>
                  </h3>
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                    {teacher?.grade || 'ថ្នាក់រៀន'}
                  </span>
                </div>
                <p className="text-[11px] text-indigo-200/90 flex items-center gap-1.5 mt-0.5 flex-wrap">
                  <span className="flex items-center gap-1">
                    <span>គ្រូបន្ទុកថ្នាក់ ៖</span>
                    <strong className="text-amber-300 font-bold font-moul text-[11px]">
                      {teacher?.name || 'លោកគ្រូ/អ្នកគ្រូ'}
                    </strong>
                  </span>
                  <span>&bull;</span>
                  <span className="text-emerald-300 flex items-center gap-1 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {students.length} សិស្ស
                  </span>
                </p>
              </div>
            </div>

            {/* Header Action Controls */}
            <div className="flex items-center gap-1.5">
              {/* LIVE CLASS MEETING BUTTON */}
              <button
                type="button"
                onClick={() => setShowLiveMeeting(true)}
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-black shadow-lg shadow-rose-900/30 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                title="បើកការប្រជុំថ្នាក់រៀនផ្ទាល់ (Live Meeting)"
              >
                <Video className="w-3.5 h-3.5 animate-pulse" />
                <span className="hidden sm:inline">ប្រជុំផ្ទាល់</span>
                <span className="sm:hidden font-sans text-[10px]">LIVE</span>
              </button>

              {/* Sound Toggle */}
              <button
                type="button"
                onClick={() => {
                  setSoundEnabled(!soundEnabled);
                  onShowToast(soundEnabled ? 'បានបិទសំឡេង' : 'បានបើកសំឡេង');
                }}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                title={soundEnabled ? 'បិទសំឡេង' : 'បើកសំឡេង'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              </button>

              {/* Members Drawer Toggle */}
              <button
                type="button"
                onClick={() => setShowMembersDrawer(!showMembersDrawer)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  showMembersDrawer
                    ? 'bg-amber-400 text-slate-950 font-black'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">សមាជិក</span>
              </button>

              {/* Close Modal */}
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition ml-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* ================= PINNED ANNOUNCEMENTS BAR ================= */}
          {pinnedMessages.length > 0 && (
            <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800/60 px-4 py-2 flex items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200 shrink-0">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Pin className="w-4 h-4 text-amber-600 shrink-0 fill-amber-500" />
                <span className="font-bold text-[11px] bg-amber-200 dark:bg-amber-900 text-amber-950 dark:text-amber-100 px-1.5 py-0.5 rounded font-moul shrink-0">
                  សេចក្តីជូនដំណឹងពីគ្រូ ៖
                </span>
                <p className="truncate text-xs font-medium">{pinnedMessages[0].text}</p>
              </div>
              {isTeacher && (
                <button
                  type="button"
                  onClick={() => handleTogglePin(pinnedMessages[0].id)}
                  className="text-[10px] text-amber-700 hover:text-rose-600 font-bold underline shrink-0 cursor-pointer"
                >
                  ដក Pin
                </button>
              )}
            </div>
          )}

          {/* ================= MAIN CHAT & MEMBERS LAYOUT ================= */}
          <div className="flex-1 flex overflow-hidden relative">
            {/* Messages Stream Column */}
            <div className="flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-900/50 overflow-hidden">
              {/* Search Filter Banner */}
              {searchQuery && (
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-xs flex items-center justify-between px-4 border-b border-indigo-100 dark:border-indigo-900/40">
                  <span>លទ្ធផលស្វែងរក ៖ «{searchQuery}» ({filteredMessages.length} សារ)</span>
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                  >
                    សម្អាត
                  </button>
                </div>
              )}

              {/* Scrollable Messages Area */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
                {filteredMessages.map((msg) => {
                  const isMe = msg.senderId === myId;
                  const isTeacherSender = msg.senderRole === 'teacher';
                  const hasImageAvatar = msg.senderAvatar && isImageAvatar(msg.senderAvatar);
                  const isAudioPlaying = currentlyPlayingAudioId === msg.id;

                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <div
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl overflow-hidden p-0.5 shadow-md flex items-center justify-center ${
                            isTeacherSender
                              ? 'bg-gradient-to-tr from-amber-400 via-purple-500 to-pink-500 ring-2 ring-amber-400/50'
                              : 'bg-gradient-to-tr from-indigo-500 to-pink-500'
                          }`}
                        >
                          <div className="w-full h-full rounded-[14px] bg-slate-950 overflow-hidden flex items-center justify-center text-white">
                            {hasImageAvatar ? (
                              <img
                                src={msg.senderAvatar}
                                alt={msg.senderName}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <span className="text-lg">{msg.senderAvatar || (isTeacherSender ? '👨‍🏫' : '🧑‍🎓')}</span>
                            )}
                          </div>
                        </div>

                        {/* Special VIP Crown for Teacher */}
                        {isTeacherSender && (
                          <span
                            className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 text-[10px] px-1 rounded-full font-black shadow-md"
                            title="គ្រូបន្ទុកថ្នាក់"
                          >
                            👑
                          </span>
                        )}
                      </div>

                      {/* Message Bubble Content */}
                      <div className={`max-w-[82%] sm:max-w-[72%] space-y-1 ${isMe ? 'items-end text-right' : 'items-start text-left'}`}>
                        {/* Sender Name & Meta */}
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 px-1 flex-wrap">
                          <span className={`font-bold ${isTeacherSender ? 'text-amber-700 dark:text-amber-300 font-moul' : 'text-slate-800 dark:text-slate-200'}`}>
                            {msg.senderName}
                          </span>

                          {isTeacherSender ? (
                            <span className="bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-300 text-[9px] font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                              <ShieldCheck className="w-2.5 h-2.5" /> គ្រូបង្រៀន
                            </span>
                          ) : msg.senderRollNo ? (
                            <span className="bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded">
                              #{msg.senderRollNo}
                            </span>
                          ) : null}

                          <span>&bull;</span>
                          <span className="text-[10px]">{msg.timestamp}</span>
                        </div>

                        {/* Bubble Container */}
                        <div
                          className={`p-3.5 rounded-3xl shadow-sm text-xs sm:text-[13px] leading-relaxed relative ${
                            isMe
                              ? 'bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white rounded-tr-xs shadow-purple-900/10'
                              : isTeacherSender
                              ? 'bg-gradient-to-br from-amber-50/90 via-purple-50/70 to-indigo-50/80 dark:from-slate-800 dark:via-purple-950/40 dark:to-slate-800 border-2 border-amber-400/70 dark:border-amber-600/60 text-slate-900 dark:text-white rounded-tl-xs shadow-md'
                              : 'bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-white rounded-tl-xs'
                          }`}
                        >
                          {/* Pinned Tag */}
                          {msg.isPinned && (
                            <div className="mb-1.5 flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                              <Pin className="w-3 h-3 fill-amber-500" />
                              <span>សេចក្តីជូនដំណឹងសំខាន់</span>
                            </div>
                          )}

                          {/* Image Attachment */}
                          {msg.imageUrl && (
                            <div className="mb-2 rounded-2xl overflow-hidden border border-black/10 max-h-64 bg-black/5">
                              <img
                                src={msg.imageUrl}
                                alt="Attached"
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          )}

                          {/* Document / File Attachment */}
                          {msg.fileAttachment && (
                            <div className="mb-2 p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white flex items-center justify-between gap-3 shadow-sm">
                              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0 font-black text-xs">
                                  {msg.fileAttachment.extension === 'PDF' ? (
                                    <FileText className="w-5 h-5 text-rose-500" />
                                  ) : ['XLS', 'XLSX'].includes(msg.fileAttachment.extension) ? (
                                    <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
                                  ) : ['ZIP', 'RAR'].includes(msg.fileAttachment.extension) ? (
                                    <FileArchive className="w-5 h-5 text-amber-500" />
                                  ) : (
                                    <FileIcon className="w-5 h-5 text-indigo-500" />
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-bold text-xs truncate text-slate-800 dark:text-slate-100">
                                    {msg.fileAttachment.name}
                                  </p>
                                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                                    {msg.fileAttachment.size} &bull; {msg.fileAttachment.extension}
                                  </span>
                                </div>
                              </div>

                              <a
                                href={msg.fileAttachment.url}
                                download={msg.fileAttachment.name}
                                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] flex items-center gap-1 shrink-0 transition"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">ទាញយក</span>
                              </a>
                            </div>
                          )}

                          {/* Voice Audio Player */}
                          {msg.audioUrl && (
                            <div className="mb-2 p-2.5 rounded-2xl bg-black/10 dark:bg-black/30 border border-white/15 flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => togglePlayAudio(msg.id, msg.audioUrl!)}
                                className="w-9 h-9 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center hover:scale-105 transition shrink-0 shadow-md cursor-pointer"
                              >
                                {isAudioPlaying ? (
                                  <Pause className="w-4 h-4 fill-slate-950" />
                                ) : (
                                  <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                                )}
                              </button>

                              {/* Waveform Bars */}
                              <div className="flex-1 flex items-center gap-1 h-6">
                                {[40, 75, 55, 90, 60, 85, 45, 95, 70, 50, 80, 65].map((h, i) => (
                                  <span
                                    key={i}
                                    className={`w-1 rounded-full transition-all duration-300 ${
                                      isAudioPlaying
                                        ? 'bg-amber-400 animate-pulse'
                                        : 'bg-current opacity-40'
                                    }`}
                                    style={{ height: `${h}%` }}
                                  />
                                ))}
                              </div>

                              <span className="text-[11px] font-mono font-bold opacity-80 shrink-0">
                                {msg.audioDuration ? formatTime(msg.audioDuration) : '0:05'}
                              </span>
                            </div>
                          )}

                          {/* Text Message Content */}
                          <p className="whitespace-pre-wrap">{msg.text}</p>

                          {/* Action & Reaction Bar */}
                          <div
                            className={`flex items-center gap-1 mt-2.5 pt-1.5 border-t ${
                              isMe ? 'border-white/20' : 'border-slate-200/80 dark:border-slate-700'
                            }`}
                          >
                            {EMOJI_CATEGORIES[0].emojis.slice(0, 5).map((em) => (
                              <button
                                key={em}
                                type="button"
                                onClick={() => handleReaction(msg.id, em)}
                                className="hover:scale-125 transition text-xs p-0.5 cursor-pointer"
                                title={`React ${em}`}
                              >
                                {em}
                              </button>
                            ))}

                            {isTeacher && (
                              <button
                                type="button"
                                onClick={() => handleTogglePin(msg.id)}
                                className={`ml-auto text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-bold cursor-pointer transition ${
                                  msg.isPinned
                                    ? 'bg-amber-400 text-slate-950'
                                    : 'bg-black/10 hover:bg-black/20 text-current'
                                }`}
                                title={msg.isPinned ? 'ដក Pin' : 'Pin សារនេះ'}
                              >
                                <Pin className="w-2.5 h-2.5" />
                                <span className="text-[9px]">{msg.isPinned ? 'Pinned' : 'Pin'}</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Reaction Counts Pills */}
                        {Object.keys(msg.reactions).length > 0 && (
                          <div className={`flex flex-wrap gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                            {Object.entries(msg.reactions).map(([emoji, count]) => (
                              <button
                                key={emoji}
                                type="button"
                                onClick={() => handleReaction(msg.id, emoji)}
                                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-2 py-0.5 text-[11px] flex items-center gap-1 shadow-2xs hover:scale-105 transition cursor-pointer"
                              >
                                <span>{emoji}</span>
                                <span className="font-bold text-slate-700 dark:text-slate-300 text-[10px]">
                                  {count}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestion Chips */}
              <div className="px-3 py-1.5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                <span className="text-[10px] text-slate-400 font-bold shrink-0">ឆ្លើយរហ័ស ៖</span>
                {QUICK_CHIPS.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(chip)}
                    className="bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-950/60 text-slate-700 dark:text-slate-300 hover:text-purple-900 dark:hover:text-purple-200 text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap transition active:scale-95 shrink-0 border border-slate-200 dark:border-slate-700 cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Attachment Previews */}
              {(attachedImage || attachedFile) && (
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 border-t border-indigo-200 dark:border-indigo-800 flex items-center justify-between gap-3 px-4 shrink-0">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {attachedImage ? (
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-black/10 shrink-0 border border-indigo-300">
                        <img src={attachedImage} alt="Attachment" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                        📎
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-indigo-900 dark:text-indigo-200 truncate">
                        {attachedFile ? attachedFile.name : 'រូបភាពភ្ជាប់ (Image)'}
                      </p>
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400">
                        {attachedFile ? attachedFile.size : 'រួចរាល់សម្រាប់ផ្ញើ'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setAttachedImage(null);
                      setAttachedFile(null);
                    }}
                    className="p-1 rounded-full bg-rose-100 text-rose-600 hover:bg-rose-200 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Voice Recording In-Progress Banner */}
              {isRecording && (
                <div className="p-3 bg-gradient-to-r from-rose-600 to-red-600 text-white flex items-center justify-between gap-3 px-4 shrink-0 shadow-lg animate-pulse">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-white animate-ping" />
                    <span className="font-bold text-xs flex items-center gap-1.5">
                      <Mic className="w-4 h-4" /> កំពុងថតសំឡេង... ({formatTime(recordingDuration)})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={cancelRecording}
                      className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold transition"
                    >
                      បោះបង់
                    </button>
                    <button
                      type="button"
                      onClick={stopAndSendVoice}
                      className="px-3.5 py-1 bg-white text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-black shadow-md transition"
                    >
                      ✓ ផ្ញើសំឡេង
                    </button>
                  </div>
                </div>
              )}

              {/* TEACHER SENTENCES TEMPLATES DRAWER / POPUP */}
              {showTeacherTemplates && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-amber-50/95 dark:bg-slate-900 border-t border-amber-300 dark:border-amber-800/60 p-3 max-h-60 overflow-y-auto space-y-3 shrink-0 shadow-inner"
                >
                  <div className="flex items-center justify-between pb-1 border-b border-amber-200 dark:border-slate-800">
                    <span className="font-bold text-xs text-amber-900 dark:text-amber-300 font-moul flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" /> គំរូល្បះសម្រាប់គ្រូបង្រៀន (Teacher Quick Phrases)
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowTeacherTemplates(false)}
                      className="p-1 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {TEACHER_SENTENCE_TEMPLATES.map((cat, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <span className="text-[11px] font-bold text-amber-800 dark:text-amber-400">
                          {cat.category}
                        </span>
                        <div className="grid grid-cols-1 gap-1.5">
                          {cat.items.map((item, itemIdx) => (
                            <button
                              key={itemIdx}
                              type="button"
                              onClick={() => {
                                setInputText(item);
                                setShowTeacherTemplates(false);
                                onShowToast('បានជ្រើសរើសគំរូល្បះ! អ្នកអាចកែសម្រួល ឬចុចផ្ញើបាន');
                              }}
                              className="text-left p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950/50 border border-amber-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 hover:text-amber-900 transition flex items-start gap-2 shadow-2xs group cursor-pointer"
                            >
                              <span className="text-amber-500 font-bold shrink-0 mt-0.5 group-hover:scale-110 transition">
                                💬
                              </span>
                              <span className="flex-1 leading-relaxed">{item}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* RICH EMOJI PICKER TRAY */}
              {showEmojiTray && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shrink-0 space-y-2.5 shadow-inner"
                >
                  {/* Category Tabs */}
                  <div className="flex items-center gap-1 overflow-x-auto no-scrollbar border-b border-slate-100 dark:border-slate-700 pb-2">
                    {EMOJI_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setActiveEmojiCategory(cat.id)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                          activeEmojiCategory === cat.id
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Emojis Grid */}
                  <div className="grid grid-cols-8 sm:grid-cols-12 gap-1.5 max-h-36 overflow-y-auto p-1">
                    {EMOJI_CATEGORIES.find((c) => c.id === activeEmojiCategory)?.emojis.map((em, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setInputText((prev) => prev + em);
                        }}
                        className="h-10 text-xl rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center transition active:scale-90 cursor-pointer"
                        title={em}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ================= MESSAGE COMPOSER BAR ================= */}
              <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 sm:gap-2 shrink-0">
                {/* Hidden File Inputs */}
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageAttach}
                  className="hidden"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip"
                  onChange={handleFileAttach}
                  className="hidden"
                />

                {/* 1. Attach Image Button */}
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={isProcessingFile}
                  className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer shrink-0"
                  title="ភ្ជាប់រូបភាពលំហាត់ ឬកិច្ចការផ្ទះ"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>

                {/* 2. Attach File Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessingFile}
                  className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer shrink-0"
                  title="ផ្ញើឯកសារ (PDF, Word, Excel, Worksheets)"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                {/* 3. Voice Note Mic Button */}
                <button
                  type="button"
                  onClick={isRecording ? stopAndSendVoice : startRecordingVoice}
                  className={`p-2.5 rounded-2xl transition cursor-pointer shrink-0 ${
                    isRecording
                      ? 'bg-rose-600 text-white animate-bounce'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                  title="ថតសារជាសំឡេង (Voice Note)"
                >
                  <Mic className="w-4 h-4" />
                </button>

                {/* 4. Teacher Quick Phrases Button (Prominent for Teacher, available for both) */}
                {isTeacher && (
                  <button
                    type="button"
                    onClick={() => setShowTeacherTemplates(!showTeacherTemplates)}
                    className={`p-2.5 rounded-2xl transition cursor-pointer shrink-0 ${
                      showTeacherTemplates
                        ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                        : 'bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300'
                    }`}
                    title="គំរូល្បះសម្រាប់គ្រូ (Teacher Templates)"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>
                )}

                {/* 5. Emoji Picker Toggle */}
                <button
                  type="button"
                  onClick={() => setShowEmojiTray(!showEmojiTray)}
                  className={`p-2.5 rounded-2xl transition cursor-pointer shrink-0 ${
                    showEmojiTray
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                  title="ជ្រើសរើស Emoji"
                >
                  <Smile className="w-4 h-4" />
                </button>

                {/* Text Input */}
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  placeholder={
                    isTeacher
                      ? `សរសេរសារក្នុងនាម ${teacher?.name || 'គ្រូបន្ទុកថ្នាក់'}...`
                      : 'សរសេរសារសួរសំណួរ ឬពិភាក្សាជាមួយគ្រូ & មិត្តភក្តិ...'
                  }
                  className="flex-1 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-purple-600 focus:outline-none dark:text-white"
                />

                {/* Send Button */}
                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() && !attachedImage && !attachedFile}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-purple-700/20 flex items-center gap-1.5 transition active:scale-95 cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">ផ្ញើសារ</span>
                </button>
              </div>
            </div>

            {/* ================= ONLINE MEMBERS DRAWER ================= */}
            <AnimatePresence>
              {showMembersDrawer && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 270, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col overflow-hidden shrink-0 shadow-xl"
                >
                  <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
                    <span className="font-bold text-xs font-moul text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-indigo-600" /> សមាជិកថ្នាក់ ({students.length + 1})
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowMembersDrawer(false)}
                      className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-3 overflow-y-auto flex-1 space-y-3">
                    {/* Teacher in roster */}
                    <div className="p-2.5 rounded-2xl bg-gradient-to-r from-amber-50 to-purple-50/80 dark:from-slate-800 dark:to-purple-950/60 border border-amber-300/80 dark:border-amber-700/60 flex items-center gap-2.5 shadow-xs">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-purple-600 p-0.5 shrink-0 flex items-center justify-center shadow-xs">
                        <div className="w-full h-full rounded-[10px] bg-slate-950 overflow-hidden flex items-center justify-center">
                          {teacher?.avatar && isImageAvatar(teacher.avatar) ? (
                            <img
                              src={teacher.avatar}
                              alt="Teacher"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <span className="text-lg">{teacher?.avatar || '👨‍🏫'}</span>
                          )}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h5 className="font-bold text-xs truncate font-moul text-amber-950 dark:text-amber-200">
                          {teacher?.name || 'គ្រូបន្ទុកថ្នាក់'}
                        </h5>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> គ្រូបង្រៀន (Online)
                        </span>
                      </div>
                    </div>

                    {/* Student List */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        បញ្ជីសិស្សក្នុងថ្នាក់ ({students.length})
                      </span>
                      {students.map((st) => (
                        <div
                          key={st.id}
                          className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition"
                        >
                          <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-slate-900 dark:text-white flex items-center justify-center text-xs shrink-0 overflow-hidden">
                            {st.avatar && isImageAvatar(st.avatar) ? (
                              <img src={st.avatar} alt={st.name} className="w-full h-full object-cover" />
                            ) : (
                              <span>{st.avatar || (st.gender === 'ស្រី' ? '👧' : '👦')}</span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="font-bold text-xs truncate block text-slate-800 dark:text-slate-200">
                              {st.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              #{st.rollNo} &bull; {st.gender}
                            </span>
                          </div>
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Online" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Clear history button */}
                  <div className="p-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={handleClearChat}
                      className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-600 hover:text-rose-600 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>សម្អាតប្រវត្តិសារ</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* ================= LIVE CLASS VIDEO & AUDIO MEETING MODAL ================= */}
      <ClassLiveMeetingModal
        isOpen={showLiveMeeting}
        onClose={() => setShowLiveMeeting(false)}
        teacher={teacher}
        students={students}
        currentStudent={currentStudent}
        isTeacherMode={isTeacher}
        onShowToast={onShowToast}
        onSendChatMessage={(text) => handleSendMessage(text)}
        messages={messages}
      />
    </>
  );
};
