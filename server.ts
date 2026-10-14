import express from 'express';
import http from 'http';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;
  const server = http.createServer(app);

  app.use(express.json());
  app.use(express.static(path.join(process.cwd(), 'public')));
  app.use('/src/assets/images', express.static(path.join(process.cwd(), 'src/assets/images')));

  const remoteSessions = new Map();

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
  });

  app.get('/api/remote/active-sessions', (req, res) => {
    const now = Date.now();
    const activeList = [];
    remoteSessions.forEach((session, normId) => {
      if (now - session.updatedAt < 30 * 60 * 1000 && session.state) {
        activeList.push({
          sessionId: normId,
          lessonTitle: session.state.lessonTitle || 'មេរៀនភាសាខ្មែរ',
          slideTitle: session.state.slideTitle || '',
          currentSlideIndex: session.state.currentSlideIndex || 0,
          totalSlides: session.state.totalSlides || 10,
          stepBadge: session.state.stepBadge || '',
          updatedAt: session.updatedAt,
        });
      }
    });
    activeList.sort((a, b) => b.updatedAt - a.updatedAt);
    res.json({ sessions: activeList });
  });

  app.post('/api/remote/state', (req, res) => {
    const { sessionId, ...stateData } = req.body;
    if (!sessionId) {
      return res.status(400).json({ error: 'Missing sessionId' });
    }
    const normId = String(sessionId).trim().toUpperCase();
    let session = remoteSessions.get(normId);
    if (!session) {
      session = {
        state: stateData,
        lastCommand: null,
        commandHistory: [],
        updatedAt: Date.now(),
      };
    } else {
      session.state = { ...session.state, ...stateData };
      session.updatedAt = Date.now();
    }
    remoteSessions.set(normId, session);
    res.json({ success: true, sessionId: normId });
  });

  app.get('/api/remote/state', (req, res) => {
    const sessionId = req.query.sessionId;
    if (!sessionId) {
      return res.status(400).json({ error: 'Missing sessionId' });
    }
    const normId = String(sessionId).trim().toUpperCase();
    const session = remoteSessions.get(normId);
    if (!session) {
      return res.json({ found: false, state: null, lastCommand: null });
    }
    res.json({
      found: true,
      sessionId: normId,
      state: session.state,
      lastCommand: session.lastCommand,
      updatedAt: session.updatedAt,
    });
  });

  app.post('/api/remote/command', (req, res) => {
    const { sessionId, command } = req.body;
    if (!sessionId || !command) {
      return res.status(400).json({ error: 'Missing sessionId or command' });
    }
    const normId = String(sessionId).trim().toUpperCase();
    let session = remoteSessions.get(normId);
    if (!session) {
      session = {
        state: { sessionId: normId, phoneConnected: true },
        lastCommand: command,
        commandHistory: [command],
        updatedAt: Date.now(),
      };
    } else {
      session.lastCommand = command;
      if (!session.commandHistory) session.commandHistory = [];
      session.commandHistory.unshift(command);
      if (session.commandHistory.length > 20) session.commandHistory.pop();
      session.state = { ...session.state, phoneConnected: true };
      session.updatedAt = Date.now();
    }
    remoteSessions.set(normId, session);
    res.json({ success: true, commandId: command.id });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: { server },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${PORT} is currently in use. Existing process is serving requests.`);
    } else {
      console.error('Server listen error:', err);
    }
  });

  process.on('SIGTERM', () => {
    server.close(() => process.exit(0));
  });
  process.on('SIGINT', () => {
    server.close(() => process.exit(0));
  });
}

startServer();
