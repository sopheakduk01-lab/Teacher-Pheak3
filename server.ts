import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "15mb" }));

  // If a student scans a QR code pointing to root /?room=XXXX, route directly to the Tug-of-War room join screen
  app.use((req, res, next) => {
    if ((req.path === "/" || req.path === "/index.html") && req.query && req.query.room) {
      const qs = new URLSearchParams(req.query as Record<string, string>).toString();
      return res.redirect(302, "/science-tug-of-war.html?" + qs);
    }
    if (req.path.endsWith(".html") || req.path === "/") {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
    }
    next();
  });

  app.use(express.static(path.join(process.cwd(), "public"), { etag: false, lastModified: false }));
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
    if (id === "zombie_lane_defense_game") {
      return res.sendFile(path.join(process.cwd(), "public", "zombie-lane-defense.html"));
    }
    if (id === "science_tug_of_war_game") {
      return res.sendFile(path.join(process.cwd(), "public", "science-tug-of-war.html"));
    }
    if (id === "sky_pilot_quiz_game") {
      return res.sendFile(path.join(process.cwd(), "public", "sky-pilot-quiz.html"));
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

  // =========================================================================
  // REAL-TIME MULTIPLAYER TUG-OF-WAR CLASSROOM ROOMS (QR JOIN + SSE + REST)
  // =========================================================================
  interface TugPlayer {
    id: string;
    name: string;
    avatar: string;
    team: "red" | "blue";
    correct: number;
    total: number;
    pullTotal: number;
    combo: number;
    maxCombo: number;
    joinedAt: number;
    lastSeen: number;
  }

  interface TugRoom {
    roomId: string;
    lessonId: string;
    lessonTitle: string;
    stageId: number;
    squadId: string;
    roomMode: "PVP" | "COOP_AI";
    status: "LOBBY" | "PLAYING" | "FINISHED";
    targetSteps: number;
    tugScore: number;
    winner: "red" | "blue" | null;
    players: Record<string, TugPlayer>;
    recentEvents: Array<{
      id: string;
      text: string;
      team: "red" | "blue";
      playerName: string;
      delta: number;
      ts: number;
    }>;
    redShieldUntil: number;
    blueFrozenUntil: number;
    createdAt: number;
    updatedAt: number;
    sseClients: Set<express.Response>;
  }

  const tugRooms = new Map<string, TugRoom>();

  const serializeRoom = (room: TugRoom) => ({
    roomId: room.roomId,
    lessonId: room.lessonId,
    lessonTitle: room.lessonTitle,
    stageId: room.stageId,
    squadId: room.squadId,
    roomMode: room.roomMode,
    status: room.status,
    targetSteps: room.targetSteps,
    tugScore: Number(room.tugScore.toFixed(2)),
    winner: room.winner,
    players: Object.values(room.players)
      .map(p => ({ ...p, pulls: p.pullTotal }))
      .sort((a, b) => b.pullTotal - a.pullTotal),
    recentEvents: room.recentEvents.slice(0, 8),
    redShieldActive: Date.now() < room.redShieldUntil,
    blueFrozenActive: Date.now() < room.blueFrozenUntil,
    updatedAt: room.updatedAt
  });

  const getOrCreateRoom = (rawId: string): TugRoom | null => {
    const roomId = String(rawId || "").trim().toUpperCase();
    if (!roomId) return null;
    let room = tugRooms.get(roomId);
    if (!room && /^[A-Z0-9]{3,8}$/.test(roomId)) {
      room = {
        roomId,
        lessonId: "science_lesson1_40q",
        lessonTitle: "មេរៀនទី ១ ៖ ការសម្របខ្លួនរបស់រុក្ខជាតិ",
        stageId: 1,
        squadId: "red_striker",
        roomMode: "PVP",
        status: "LOBBY",
        targetSteps: 10,
        tugScore: 0,
        winner: null,
        players: {},
        recentEvents: [],
        redShieldUntil: 0,
        blueFrozenUntil: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        sseClients: new Set()
      };
      tugRooms.set(roomId, room);
    }
    return room || null;
  };

  const broadcastRoomState = (room: TugRoom, eventType = "room:update") => {
    room.updatedAt = Date.now();
    const serialized = serializeRoom(room);
    const payload = JSON.stringify({
      type: eventType,
      room: serialized,
      event: serialized.recentEvents[0] || null
    });
    room.sseClients.forEach((client) => {
      try {
        client.write(`data: ${payload}\n\n`);
      } catch {
        room.sseClients.delete(client);
      }
    });
  };

  // Create a new Classroom Tug-of-War Room
  app.post("/api/tug-rooms/create", (req, res) => {
    const {
      roomId: requestedId,
      lessonId = "science_lesson1_40q",
      lessonTitle = "មេរៀនទី ១ ៖ ការសម្របខ្លួនរបស់រុក្ខជាតិ",
      stageId = 1,
      squadId = "red_striker",
      roomMode = "PVP",
      targetSteps = 10
    } = req.body || {};

    let roomId = requestedId ? String(requestedId).trim().toUpperCase() : "";
    if (!roomId) {
      do {
        roomId = String(Math.floor(1000 + Math.random() * 9000));
      } while (tugRooms.has(roomId));
    }

    const existing = tugRooms.get(roomId);
    const room: TugRoom = existing || {
      roomId,
      lessonId,
      lessonTitle,
      stageId: Number(stageId) || 1,
      squadId: String(squadId || "red_striker"),
      roomMode: roomMode === "COOP_AI" ? "COOP_AI" : "PVP",
      status: "LOBBY",
      targetSteps: Number(targetSteps) || 10,
      tugScore: 0,
      winner: null,
      players: {},
      recentEvents: [],
      redShieldUntil: 0,
      blueFrozenUntil: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      sseClients: new Set()
    };

    room.lessonId = lessonId || room.lessonId;
    room.stageId = Number(stageId) || room.stageId;
    room.roomMode = roomMode === "COOP_AI" ? "COOP_AI" : "PVP";
    room.targetSteps = Number(targetSteps) || room.targetSteps;

    tugRooms.set(roomId, room);
    const serialized = serializeRoom(room);
    res.json({ success: true, ...serialized, room: serialized });
  });

  // Get Room State
  app.get("/api/tug-rooms/:roomId/state", (req, res) => {
    const room = getOrCreateRoom(req.params.roomId);
    if (!room) {
      return res.status(404).json({ found: false, error: "រកមិនឃើញបន្ទប់ប្រកួតនេះទេ (Room not found)" });
    }
    const serialized = serializeRoom(room);
    res.json({ found: true, ...serialized, room: serialized });
  });

  // Real-Time Server-Sent Events (SSE) Stream for a Room
  app.get("/api/tug-rooms/:roomId/stream", (req, res) => {
    const room = getOrCreateRoom(req.params.roomId);
    if (!room) {
      return res.status(404).end();
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    room.sseClients.add(res);
    res.write(`data: ${JSON.stringify({ type: "room:init", room: serializeRoom(room) })}\n\n`);

    const keepAlive = setInterval(() => {
      try {
        res.write(`: ping\n\n`);
      } catch {
        clearInterval(keepAlive);
      }
    }, 15000);

    req.on("close", () => {
      clearInterval(keepAlive);
      room.sseClients.delete(res);
    });
  });

  // Student Joins Room (Idempotent by playerId)
  app.post("/api/tug-rooms/:roomId/join", (req, res) => {
    const room = getOrCreateRoom(req.params.roomId);
    if (!room) {
      return res.status(404).json({ found: false, error: "រកមិនឃើញបន្ទប់ប្រកួតទេ!" });
    }

    const { playerId, name, avatar = "🏃", team } = req.body || {};
    const cleanId = String(playerId || ("stu_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6)));
    const cleanName = String(name || "សិស្សឆ្នើម").trim().slice(0, 28) || "សិស្សឆ្នើម";

    let assignedTeam: "red" | "blue" = "red";
    if (room.roomMode === "COOP_AI") {
      assignedTeam = "red";
    } else if (team === "red" || team === "blue") {
      assignedTeam = team;
    } else {
      const allPlayers = Object.values(room.players);
      const redCount = allPlayers.filter(p => p.team === "red").length;
      const blueCount = allPlayers.filter(p => p.team === "blue").length;
      assignedTeam = redCount <= blueCount ? "red" : "blue";
    }

    const existing = room.players[cleanId];
    if (existing) {
      existing.name = cleanName;
      existing.avatar = String(avatar || existing.avatar);
      existing.team = assignedTeam;
      existing.lastSeen = Date.now();
    } else {
      room.players[cleanId] = {
        id: cleanId,
        name: cleanName,
        avatar: String(avatar || "🏃"),
        team: assignedTeam,
        correct: 0,
        total: 0,
        pullTotal: 0,
        combo: 0,
        maxCombo: 0,
        joinedAt: Date.now(),
        lastSeen: Date.now()
      };
      room.recentEvents.unshift({
        id: "join_" + Date.now() + "_" + Math.random().toString(36).slice(2, 5),
        text: `${avatar} ${cleanName} បានចូលរួមក្រុម${assignedTeam === "red" ? "ក្រហម" : "ខៀវ"}!`,
        team: assignedTeam,
        playerName: cleanName,
        delta: 0,
        ts: Date.now()
      });
    }

    broadcastRoomState(room, "player:joined");
    const serialized = serializeRoom(room);
    res.json({
      success: true,
      player: room.players[cleanId],
      ...serialized,
      room: serialized
    });
  });

  // Host Updates Room Settings / Starts / Resets Match
  app.post("/api/tug-rooms/:roomId/control", (req, res) => {
    const room = getOrCreateRoom(req.params.roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    const { action, lessonId, lessonTitle, stageId, squadId, roomMode, targetSteps } = req.body || {};
    if (lessonId) room.lessonId = String(lessonId);
    if (lessonTitle) room.lessonTitle = String(lessonTitle);
    if (stageId) room.stageId = Number(stageId) || room.stageId;
    if (squadId) room.squadId = String(squadId);
    if (roomMode === "PVP" || roomMode === "COOP_AI") {
      room.roomMode = roomMode;
      if (roomMode === "COOP_AI") {
        Object.values(room.players).forEach(p => { p.team = "red"; });
      }
    }
    if (targetSteps) room.targetSteps = Number(targetSteps) || room.targetSteps;

    if (action === "start" || action === "restart") {
      room.status = "PLAYING";
      room.tugScore = 0;
      room.winner = null;
      room.redShieldUntil = 0;
      room.blueFrozenUntil = 0;
      Object.values(room.players).forEach(p => {
        p.correct = 0;
        p.total = 0;
        p.pullTotal = 0;
        p.combo = 0;
        p.maxCombo = 0;
      });
      room.recentEvents.unshift({
        id: "start_" + Date.now(),
        text: "🚀 ការប្រកួតទាញព្រ័ត្របានចាប់ផ្តើមហើយ!",
        team: "red",
        playerName: "HOST",
        delta: 0,
        ts: Date.now()
      });
      broadcastRoomState(room, "match:start");
    } else if (action === "lobby") {
      room.status = "LOBBY";
      room.tugScore = 0;
      room.winner = null;
      broadcastRoomState(room, "room:lobby");
    } else {
      broadcastRoomState(room, "room:settings");
    }

    const serialized = serializeRoom(room);
    res.json({ success: true, ...serialized, room: serialized });
  });

  // Student or Host Submits Pull / Wrong Slip / Tactical Skill Action
  app.post("/api/tug-rooms/:roomId/action", (req, res) => {
    const room = getOrCreateRoom(req.params.roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    if (room.status === "FINISHED") {
      const serialized = serializeRoom(room);
      return res.json({ success: false, ...serialized, room: serialized });
    }
    if (room.status === "LOBBY") {
      room.status = "PLAYING";
    }

    const { playerId, playerName = "សិស្ស", team = "red", type, steps = 1, skillType } = req.body || {};
    const player = playerId && room.players[playerId] ? room.players[playerId] : null;
    const effectiveTeam: "red" | "blue" = player ? player.team : (team === "blue" ? "blue" : "red");
    const displayName = player ? player.name : String(playerName);

    const now = Date.now();
    if (player) player.lastSeen = now;

    if (type === "answer_correct") {
      const pullVal = Math.max(0.2, Math.min(4.5, Number(steps) || 1));
      if (player) {
        player.total++;
        player.correct++;
        player.combo++;
        if (player.combo > player.maxCombo) player.maxCombo = player.combo;
        player.pullTotal = Number((player.pullTotal + pullVal).toFixed(2));
      }
      if (effectiveTeam === "red") {
        room.tugScore = Math.max(-room.targetSteps, room.tugScore - pullVal);
      } else {
        const actualPull = now < room.redShieldUntil ? pullVal * 0.45 : pullVal;
        room.tugScore = Math.min(room.targetSteps, room.tugScore + actualPull);
      }
      room.recentEvents.unshift({
        id: "ev_" + now + "_" + Math.random().toString(36).slice(2, 5),
        text: `${effectiveTeam === "red" ? "🔴" : "🔵"} ${displayName} ទាញបាន +${pullVal.toFixed(1)} ជំហាន!`,
        team: effectiveTeam,
        playerName: displayName,
        delta: pullVal,
        ts: now
      });
    } else if (type === "answer_wrong") {
      const slipVal = Math.max(0.2, Math.min(3.5, Number(steps) || 1));
      if (player) {
        player.total++;
        player.combo = 0;
      }
      if (effectiveTeam === "red") {
        const actualSlip = now < room.redShieldUntil ? 0.3 : slipVal;
        room.tugScore = Math.min(room.targetSteps, room.tugScore + actualSlip);
      } else {
        room.tugScore = Math.max(-room.targetSteps, room.tugScore - slipVal * 0.7);
      }
      room.recentEvents.unshift({
        id: "ev_" + now + "_" + Math.random().toString(36).slice(2, 5),
        text: `💦 ${displayName} ភ្លាត់ជើងរអិល -${slipVal.toFixed(1)}!`,
        team: effectiveTeam,
        playerName: displayName,
        delta: -slipVal,
        ts: now
      });
    } else if (type === "skill") {
      if (skillType === "pull") {
        const pullVal = 2.5;
        if (effectiveTeam === "red") {
          room.tugScore = Math.max(-room.targetSteps, room.tugScore - pullVal);
        } else {
          room.tugScore = Math.min(room.targetSteps, room.tugScore + pullVal);
        }
        if (player) player.pullTotal = Number((player.pullTotal + pullVal).toFixed(2));
        room.recentEvents.unshift({
          id: "sk_" + now,
          text: `⚡ ${displayName} ប្រើជំនាញទាញផ្លេកបន្ទោរ +2.5!`,
          team: effectiveTeam,
          playerName: displayName,
          delta: pullVal,
          ts: now
        });
      } else if (skillType === "shield") {
        room.redShieldUntil = now + 6500;
        room.recentEvents.unshift({
          id: "sk_" + now,
          text: `🛡️ ${displayName} បើកខែលបោះយុថ្កាការពារក្រុម!`,
          team: effectiveTeam,
          playerName: displayName,
          delta: 0,
          ts: now
        });
      } else if (skillType === "freeze") {
        room.blueFrozenUntil = now + 5200;
        room.recentEvents.unshift({
          id: "sk_" + now,
          text: `❄️ ${displayName} បង្កកគូប្រកួត ៥ វិនាទី!`,
          team: effectiveTeam,
          playerName: displayName,
          delta: 0,
          ts: now
        });
      }
    } else if (type === "host_sync") {
      if (typeof req.body.tugScore === "number") {
        room.tugScore = Math.max(-room.targetSteps, Math.min(room.targetSteps, req.body.tugScore));
      }
    }

    if (room.recentEvents.length > 15) {
      room.recentEvents.length = 15;
    }

    if (room.tugScore <= -room.targetSteps) {
      room.tugScore = -room.targetSteps;
      room.status = "FINISHED";
      room.winner = "red";
      broadcastRoomState(room, "match:finished");
    } else if (room.tugScore >= room.targetSteps) {
      room.tugScore = room.targetSteps;
      room.status = "FINISHED";
      room.winner = "blue";
      broadcastRoomState(room, "match:finished");
    } else {
      broadcastRoomState(room, "room:action");
    }

    res.json({ success: true, room: serializeRoom(room) });
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

  let retries = 0;
  const listenWithRetry = () => {
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

    server.on("error", (err: any) => {
      if (err.code === "EADDRINUSE" && retries < 15) {
        retries++;
        console.log(`Port ${PORT} in use, retrying (${retries}/15) in 400ms...`);
        setTimeout(() => {
          try {
            server.close();
          } catch {}
          listenWithRetry();
        }, 400);
      } else {
        console.error("Server error:", err);
      }
    });

    const shutdown = () => {
      server.close(() => process.exit(0));
    };
    process.once("SIGTERM", shutdown);
    process.once("SIGINT", shutdown);
  };

  listenWithRetry();
}

startServer();
