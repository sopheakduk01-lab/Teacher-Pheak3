export interface ActiveSessionInfo {
  sessionId: string;
  lessonTitle: string;
  activeSlideIndex?: number;
  totalSlides?: number;
  lastActive?: number;
}

export interface SlideRemoteState {
  currentSlideIndex?: number;
  totalSlides?: number;
  isPlaying?: boolean;
  lessonTitle?: string;
  [key: string]: any;
}

export const syncSlideRemote = (data: any) => {};

export const generateSessionId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let res = '';
  for (let i = 0; i < 6; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return res;
};

export const subscribeToSlideSession = (id: string, cb: (state: SlideRemoteState) => void) => {
  const handleStorage = (e: StorageEvent) => {
    if (e.key === `slide_session_${id}` && e.newValue) {
      try {
        cb(JSON.parse(e.newValue));
      } catch {}
    }
  };
  window.addEventListener('storage', handleStorage);
  return () => window.removeEventListener('storage', handleStorage);
};

export const pushSlideHostState = (id: string, state: SlideRemoteState) => {
  try {
    const key = `slide_session_${id}`;
    localStorage.setItem(key, JSON.stringify({ ...state, sessionId: id, lastActive: Date.now() }));
  } catch {}
};

export const getActiveSlideSessions = async (): Promise<ActiveSessionInfo[]> => {
  try {
    const list: ActiveSessionInfo[] = [];
    const now = Date.now();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('slide_session_')) {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && (!parsed.lastActive || now - parsed.lastActive < 10 * 60 * 1000)) {
            list.push({
              sessionId: parsed.sessionId || key.replace('slide_session_', ''),
              lessonTitle: parsed.lessonTitle || 'មេរៀនអន្តរកម្ម',
              activeSlideIndex: parsed.currentSlideIndex ?? 0,
              totalSlides: parsed.totalSlides ?? 1,
              lastActive: parsed.lastActive ?? now,
            });
          }
        }
      }
    }
    return list;
  } catch {
    return [];
  }
};
