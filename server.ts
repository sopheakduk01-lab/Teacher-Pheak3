import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "15mb" }));
  app.use(express.static(path.join(process.cwd(), "public")));
  app.use("/src/assets/images", express.static(path.join(process.cwd(), "src/assets/images")));

  const customGamesFile = path.join(process.cwd(), "public", "custom-games.json");
  const readCustomGames = (): any[] => {
    try {
      if (fs.existsSync(customGamesFile)) {
        const raw = fs.readFileSync(customGamesFile, "utf8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error("Failed to read custom-games.json:", e);
    }
    return [];
  };
  const writeCustomGames = (games: any[]) => {
    try {
      fs.writeFileSync(customGamesFile, JSON.stringify(games, null, 2), "utf8");
    } catch (e) {
      console.error("Failed to write custom-games.json:", e);
    }
  };

  const patchGameHtml = (rawHtml: string): string => {
    if (!rawHtml || typeof rawHtml !== "string") return rawHtml;
    let html = rawHtml;
    // Fix the Question 7+ procedural question bug in Math Battle Quest HTML if pasted directly
    if (html.includes("QUESTION_ROSTER") && html.includes("let curQ;")) {
      html = html.replace("let curQ;", "window.__activeQuestion = null; let curQ;");
      html = html.replace(
        "document.getElementById('question-number').innerText",
        "window.__activeQuestion = curQ; document.getElementById('question-number').innerText"
      );
      html = html.replace(
        /const curQ = currentQuestionIdx < QUESTION_ROSTER\.length \? QUESTION_ROSTER\[currentQuestionIdx\] : null;/g,
        "const curQ = window.__activeQuestion || (currentQuestionIdx < QUESTION_ROSTER.length ? QUESTION_ROSTER[currentQuestionIdx] : null);"
      );
      html = html.replace(
        /let curQ = currentQuestionIdx < QUESTION_ROSTER\.length \? QUESTION_ROSTER\[currentQuestionIdx\] : null;/g,
        "let curQ = window.__activeQuestion || (currentQuestionIdx < QUESTION_ROSTER.length ? QUESTION_ROSTER[currentQuestionIdx] : null);"
      );
    }
    return html;
  };

  app.get("/api/custom-games", (req, res) => {
    res.json({ games: readCustomGames() });
  });

  app.get("/api/custom-games/play/:id", (req, res) => {
    const id = req.params.id;
    if (id === "math_battle_quest_abyss") {
      return res.sendFile(path.join(process.cwd(), "public", "math-battle-quest.html"));
    }
    const existing = readCustomGames();
    const found = existing.find((g: any) => g && g.id === id);
    if (!found || !found.embedCode) {
      return res.status(404).send("Game not found");
    }
    const rawCode = patchGameHtml(String(found.embedCode).trim());
    const fullDoc = /<!doctype|<html/i.test(rawCode)
      ? rawCode
      : `<!DOCTYPE html><html lang="km"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><script src="https://cdn.tailwindcss.com"></script><link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700&family=Kantumruy+Pro:wght@400;600;700&display=swap" rel="stylesheet"><style>body{margin:0;font-family:'Kantumruy Pro','Battambang',sans-serif;}</style></head><body>${rawCode}</body></html>`;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(fullDoc);
  });

  app.post("/api/custom-games", (req, res) => {
    const game = req.body;
    if (!game || !game.title || !game.embedCode) {
      return res.status(400).json({ error: "Missing title or embedCode" });
    }
    game.embedCode = patchGameHtml(String(game.embedCode));
    const existing = readCustomGames();
    const filtered = existing.filter((g: any) => g.id !== game.id);
    const updated = [game, ...filtered];
    writeCustomGames(updated);
    res.json({ success: true, games: updated });
  });

  app.delete("/api/custom-games/:id", (req, res) => {
    const id = req.params.id;
    const existing = readCustomGames();
    const updated = existing.filter((g: any) => g.id !== id);
    writeCustomGames(updated);
    res.json({ success: true, games: updated });
  });

  // In-memory store for Slide Remote sessions across devices (PC, Smart TV, and Mobile Phone)
  const remoteSessions = new Map<string, {
    state: any;
    lastCommand: any;
    commandHistory: any[];
    updatedAt: number;
  }>();

  // API health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: Date.now() });
  });

  // Khmer Text-to-Speech proxy endpoint
  const ttsCache = new Map<string, Buffer>();
  app.get("/api/tts", async (req, res) => {
    try {
      const text = String(req.query.text || "").trim();
      if (!text) {
        return res.status(400).send("No text provided");
      }
      if (ttsCache.has(text)) {
        res.setHeader("Content-Type", "audio/mpeg");
        res.setHeader("Cache-Control", "public, max-age=86400");
        return res.send(ttsCache.get(text));
      }
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=km&client=tw-ob&q=${encodeURIComponent(text)}`;
      const response = await fetch(ttsUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });
      if (!response.ok) {
        return res.status(502).send("TTS service error");
      }
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      if (buffer.length > 0 && ttsCache.size < 500) {
        ttsCache.set(text, buffer);
      }
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.send(buffer);
    } catch (err: any) {
      console.error("TTS proxy error:", err);
      res.status(500).send("Internal TTS error");
    }
  });

  // Get all currently active slide sessions (active within last 30 minutes)
  app.get("/api/remote/active-sessions", (req, res) => {
    const now = Date.now();
    const activeList: any[] = [];
    remoteSessions.forEach((session, normId) => {
      // Keep sessions active for 30 minutes
      if (now - session.updatedAt < 30 * 60 * 1000 && session.state) {
        activeList.push({
          sessionId: normId,
          lessonTitle: session.state.lessonTitle || 'មេរៀនភាសាខ្មែរ',
          slideTitle: session.state.slideTitle || '',
          currentSlideIndex: session.state.currentSlideIndex || 0,
          totalSlides: session.state.totalSlides || 10,
          stepBadge: session.state.stepBadge || '',
          updatedAt: session.updatedAt
        });
      }
    });
    // Sort most recent first
    activeList.sort((a, b) => b.updatedAt - a.updatedAt);
    res.json({ sessions: activeList });
  });

  // Host pushes slide state
  app.post("/api/remote/state", (req, res) => {
    const { sessionId, ...stateData } = req.body;
    if (!sessionId) {
      return res.status(400).json({ error: "Missing sessionId" });
    }
    const normId = String(sessionId).trim().toUpperCase();
    let session = remoteSessions.get(normId);
    if (!session) {
      session = {
        state: stateData,
        lastCommand: null,
        commandHistory: [],
        updatedAt: Date.now()
      };
    } else {
      session.state = { ...session.state, ...stateData };
      session.updatedAt = Date.now();
    }
    remoteSessions.set(normId, session);
    res.json({ success: true, sessionId: normId });
  });

  // Get slide state & latest commands (polled by phone remote and PC host)
  app.get("/api/remote/state", (req, res) => {
    const sessionId = req.query.sessionId as string;
    if (!sessionId) {
      return res.status(400).json({ error: "Missing sessionId" });
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
      updatedAt: session.updatedAt
    });
  });

  // Phone sends command to PC host
  app.post("/api/remote/command", (req, res) => {
    const { sessionId, command } = req.body;
    if (!sessionId || !command) {
      return res.status(400).json({ error: "Missing sessionId or command" });
    }
    const normId = String(sessionId).trim().toUpperCase();
    let session = remoteSessions.get(normId);
    if (!session) {
      session = {
        state: { sessionId: normId, phoneConnected: true },
        lastCommand: command,
        commandHistory: [command],
        updatedAt: Date.now()
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

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  server.on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${PORT} is already in use, exiting gracefully...`);
      process.exit(0);
    } else {
      console.error("Server error:", err);
    }
  });
}

startServer();
