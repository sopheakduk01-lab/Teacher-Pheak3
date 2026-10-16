import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  doc,
  onSnapshot,
  setDoc,
  serverTimestamp,
  Firestore
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App & Firestore safely
let firestoreDb: Firestore | null = null;
try {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  firestoreDb = getFirestore(app);
} catch (err) {
  console.warn('Firebase init error for Slide Remote:', err);
}

export interface SlideRemoteState {
  sessionId: string;
  lessonId: string;
  lessonTitle: string;
  currentSlideIndex: number;
  totalSlides: number;
  activeStepPoint: number;
  totalPoints: number;
  slideTitle: string;
  stepBadge: string;
  promptQuestion?: string;
  promptAnswer?: string;
  teacherNotes?: string;
  fontSizeMode: 'normal' | 'large' | 'extra';
  showTeacherNotes: boolean;
  drawMode: boolean;
  timerSeconds: number;
  timerActive: boolean;
  soundEnabled: boolean;
  phoneConnected: boolean;
  revealedKeys: Record<string, boolean>;
  slideType?: string;
  slideContent?: {
    objectives?: any;
    vocabList?: any[];
    poemLines?: any[];
    readingText?: string;
    quizData?: any;
    activitySteps?: any[];
  };
  lastCommand?: {
    type: string;
    payload?: any;
    id: string;
    timestamp: number;
  };
  updatedAt?: any;
}

export interface ActiveSessionInfo {
  sessionId: string;
  lessonTitle: string;
  slideTitle: string;
  currentSlideIndex: number;
  totalSlides: number;
  stepBadge: string;
  updatedAt: number;
}

// Generate or retrieve a stable 6-character classroom session code
export function getOrCreateSessionId(): string {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('active_khmer_slide_session_id');
    if (saved && saved.startsWith('KM-')) {
      return saved;
    }
  }
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const newId = `KM-${randomNum}`;
  if (typeof window !== 'undefined') {
    localStorage.setItem('active_khmer_slide_session_id', newId);
  }
  return newId;
}

export function generateSessionId(): string {
  return getOrCreateSessionId();
}

// BroadcastChannel for instant local browser sync
let localChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    localChannel = new BroadcastChannel('khmer_slide_remote_channel');
  }
} catch {
  // ignore
}

// Fetch all currently active slide presentations on the network
export async function getActiveSlideSessions(): Promise<ActiveSessionInfo[]> {
  try {
    const res = await fetch('/api/remote/active-sessions');
    if (res.ok) {
      const data = await res.json();
      return (data && Array.isArray(data.sessions)) ? data.sessions : [];
    }
  } catch (e) {
    console.warn('Failed to fetch active slide sessions:', e);
  }
  return [];
}

// Subscribe to session state updates (using fast API Polling + BroadcastChannel + Firestore)
export function subscribeToSlideSession(
  sessionId: string,
  onUpdate: (state: SlideRemoteState) => void
): () => void {
  const normalizedId = sessionId.trim().toUpperCase();
  let isCancelled = false;

  // 1. Listen via BroadcastChannel (instant for same browser / tabs)
  const handleBroadcast = (e: MessageEvent) => {
    if (e.data && e.data.sessionId === normalizedId) {
      onUpdate(e.data);
    }
  };

  if (localChannel) {
    localChannel.addEventListener('message', handleBroadcast);
  }

  // 2. Fast Polling Express Server API (/api/remote/state) every 350ms for snappy response
  const pollServer = async () => {
    if (isCancelled) return;
    try {
      const res = await fetch(`/api/remote/state?sessionId=${encodeURIComponent(normalizedId)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.found) {
          const combinedState: SlideRemoteState = {
            ...(data.state || {}),
            sessionId: normalizedId,
            lastCommand: data.lastCommand || data.state?.lastCommand,
            phoneConnected: true
          };
          onUpdate(combinedState);
        }
      }
    } catch {
      // ignore network glitches
    }
  };

  const pollInterval = setInterval(pollServer, 350);
  pollServer(); // immediate fetch

  // 3. Listen via Firestore
  let unsubscribeFirestore: (() => void) | null = null;
  if (firestoreDb) {
    try {
      const docRef = doc(firestoreDb, 'slide_remotes', normalizedId);
      unsubscribeFirestore = onSnapshot(
        docRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as SlideRemoteState;
            onUpdate(data);
          }
        },
        (error) => {
          console.warn('Firestore slide remote listener error:', error);
        }
      );
    } catch (e) {
      console.warn('Could not attach Firestore slide listener:', e);
    }
  }

  return () => {
    isCancelled = true;
    clearInterval(pollInterval);
    if (localChannel) {
      localChannel.removeEventListener('message', handleBroadcast);
    }
    if (unsubscribeFirestore) {
      unsubscribeFirestore();
    }
  };
}

// Push state from Host (PC Slide Deck) to Server API, Cloud & Local
export async function pushSlideHostState(state: SlideRemoteState): Promise<void> {
  const normalizedId = state.sessionId.trim().toUpperCase();
  const payload = {
    ...state,
    sessionId: normalizedId,
    updatedAt: Date.now()
  };

  // Broadcast locally
  if (localChannel) {
    try {
      localChannel.postMessage(payload);
    } catch {
      // ignore
    }
  }

  // Push to Express Server API
  try {
    await fetch('/api/remote/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.warn('Failed to push state to Express server API:', err);
  }

  // Push to Firestore
  if (firestoreDb) {
    try {
      const docRef = doc(firestoreDb, 'slide_remotes', normalizedId);
      await setDoc(
        docRef,
        {
          ...payload,
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('Failed to push state to Firestore:', err);
    }
  }
}

// Send a control command from Phone Remote to Host PC
export async function sendRemoteCommand(
  sessionId: string,
  commandType: string,
  payload?: any
): Promise<void> {
  const normalizedId = sessionId.trim().toUpperCase();
  const commandObj = {
    type: commandType,
    payload,
    id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now()
  };

  // Save to recent sessions
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('last_remote_session_id', normalizedId);
    } catch {
      // ignore
    }
  }

  // Broadcast locally
  if (localChannel) {
    try {
      localChannel.postMessage({
        sessionId: normalizedId,
        lastCommand: commandObj,
        phoneConnected: true
      });
    } catch {
      // ignore
    }
  }

  // Send command to Express Server API
  try {
    await fetch('/api/remote/command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: normalizedId,
        command: commandObj
      })
    });
  } catch (err) {
    console.warn('Failed to send remote command to Express server API:', err);
  }

  // Firestore update
  if (firestoreDb) {
    try {
      const docRef = doc(firestoreDb, 'slide_remotes', normalizedId);
      await setDoc(
        docRef,
        {
          sessionId: normalizedId,
          lastCommand: commandObj,
          phoneConnected: true,
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('Failed to send remote command via Firestore:', err);
    }
  }
}
