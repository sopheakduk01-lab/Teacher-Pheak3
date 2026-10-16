var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.use(import_express.default.static(import_path.default.join(process.cwd(), "public")));
  app.use("/src/assets/images", import_express.default.static(import_path.default.join(process.cwd(), "src/assets/images")));
  const remoteSessions = /* @__PURE__ */ new Map();
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: Date.now() });
  });
  app.get("/api/remote/active-sessions", (req, res) => {
    const now = Date.now();
    const activeList = [];
    remoteSessions.forEach((session, normId) => {
      if (now - session.updatedAt < 30 * 60 * 1e3 && session.state) {
        activeList.push({
          sessionId: normId,
          lessonTitle: session.state.lessonTitle || "\u1798\u17C1\u179A\u17C0\u1793\u1797\u17B6\u179F\u17B6\u1781\u17D2\u1798\u17C2\u179A",
          slideTitle: session.state.slideTitle || "",
          currentSlideIndex: session.state.currentSlideIndex || 0,
          totalSlides: session.state.totalSlides || 10,
          stepBadge: session.state.stepBadge || "",
          updatedAt: session.updatedAt
        });
      }
    });
    activeList.sort((a, b) => b.updatedAt - a.updatedAt);
    res.json({ sessions: activeList });
  });
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
  app.get("/api/remote/state", (req, res) => {
    const sessionId = req.query.sessionId;
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
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true, hmr: false },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
