import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

interface LeaderboardEntry {
  id: string; // phone-based id
  name: string;
  phone: string;
  score: number;
  team: "moshe" | "priya";
  gamesPlayed: number;
  lastPlayed: string;
}

interface MatchHistoryEntry {
  id: string;
  playerName: string;
  playerPhone: string;
  team: "moshe" | "priya";
  opponentTeam: "moshe" | "priya";
  gameName: string;
  outcome: "won" | "lost" | "partial";
  pointsWon: number;
  pointsLost: number;
  pointsTransferredToOpponent: number;
  description: string;
  teluguDescription: string;
  timestamp: string;
  formattedTime: string;
  formattedDate: string;
}

interface LiveWeddingState {
  scores: {
    moshe: number;
    priya: number;
    totalPlays: number;
  };
  leaderboard: Record<string, LeaderboardEntry>;
  matchHistory: MatchHistoryEntry[];
  blessings: Array<{
    id: string;
    name: string;
    city?: string;
    message: string;
    timestamp: string;
    likes: number;
    isUserAdded?: boolean;
  }>;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "wedding_live_store.json");

const defaultState: LiveWeddingState = {
  scores: {
    moshe: 0,
    priya: 0,
    totalPlays: 0
  },
  leaderboard: {},
  matchHistory: [],
  blessings: []
};

let liveState: LiveWeddingState = { ...defaultState };

// Ensure data folder and load persisted store
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    liveState = {
      scores: {
        moshe: Number(parsed?.scores?.moshe) || 0,
        priya: Number(parsed?.scores?.priya) || 0,
        totalPlays: Number(parsed?.scores?.totalPlays) || 0
      },
      leaderboard: typeof parsed?.leaderboard === "object" && parsed?.leaderboard !== null ? parsed.leaderboard : {},
      matchHistory: Array.isArray(parsed?.matchHistory) ? parsed.matchHistory : [],
      blessings: Array.isArray(parsed?.blessings) ? parsed.blessings : []
    };
  } else {
    fs.writeFileSync(DATA_FILE, JSON.stringify(liveState, null, 2), "utf-8");
  }
} catch (err) {
  console.error("Error loading wedding storage file:", err);
}

const saveStateToFile = () => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(liveState, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save wedding state to file:", err);
  }
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // -------------------------------------------------------------
  // API ROUTES (SCORES, LEADERBOARD, MATCH HISTORY & BLESSINGS)
  // -------------------------------------------------------------

  // Reset Full Game Data & Start Fresh (Scores, Leaderboard, Match Logs)
  app.post("/api/reset-game-data", (req, res) => {
    liveState.scores = {
      moshe: 0,
      priya: 0,
      totalPlays: 0
    };
    liveState.leaderboard = {};
    liveState.matchHistory = [];
    saveStateToFile();
    res.json({
      success: true,
      message: "Full game data reset successfully.",
      scores: liveState.scores,
      leaderboard: [],
      matchHistory: []
    });
  });

  // Get Live Global Scores
  app.get("/api/scores", (req, res) => {
    res.json(liveState.scores);
  });

  // Add Points to Team (Called when any guest plays)
  app.post("/api/scores", (req, res) => {
    const { team, points } = req.body;
    if (team !== "moshe" && team !== "priya") {
      return res.status(400).json({ error: "Invalid team. Must be 'moshe' or 'priya'." });
    }

    const safePoints = Math.max(1, Math.min(Number(points) || 10, 5000));
    liveState.scores[team] += safePoints;
    liveState.scores.totalPlays += 1;

    saveStateToFile();
    res.json({ success: true, scores: liveState.scores });
  });

  // Get Leaderboard (sorted by score descending)
  app.get("/api/leaderboard", (req, res) => {
    const list = Object.values(liveState.leaderboard || {}).sort((a, b) => b.score - a.score);
    res.json(list);
  });

  // Record / Add Marks to Player Score (Phone number as unique key)
  app.post("/api/leaderboard", (req, res) => {
    const { name, phone, points, team, pointsLost, pointsTransferredToOpponent } = req.body;
    if (!name || !phone || points === undefined) {
      return res.status(400).json({ error: "Name, phone, and points are required." });
    }

    const cleanPhone = String(phone).replace(/[^\d+]/g, "").slice(-15);
    const cleanName = String(name).trim().slice(0, 80);
    const safePoints = Math.max(0, Math.min(Number(points) || 0, 5000));
    const safeTeam = team === "priya" ? "priya" : "moshe";
    const opponentTeam = safeTeam === "moshe" ? "priya" : "moshe";
    const safeLost = Math.max(0, Math.min(Number(pointsLost) || 0, 5000));
    const safeTransferred = Math.max(0, Math.min(Number(pointsTransferredToOpponent) || 0, 5000));

    if (!cleanPhone || cleanPhone.length < 4) {
      return res.status(400).json({ error: "Invalid phone number." });
    }

    const existing = liveState.leaderboard[cleanPhone];
    if (existing) {
      existing.name = cleanName || existing.name;
      existing.score = Math.max(0, (existing.score || 0) + safePoints - safeLost);
      existing.team = safeTeam;
      existing.gamesPlayed = (existing.gamesPlayed || 0) + 1;
      existing.lastPlayed = new Date().toISOString();
      liveState.leaderboard[cleanPhone] = existing;
    } else {
      liveState.leaderboard[cleanPhone] = {
        id: `player_${cleanPhone}`,
        name: cleanName,
        phone: cleanPhone,
        score: safePoints,
        team: safeTeam,
        gamesPlayed: 1,
        lastPlayed: new Date().toISOString()
      };
    }

    // Update team scores with additions, losses and transfers
    if (safePoints > 0) {
      liveState.scores[safeTeam] += safePoints;
    }
    if (safeLost > 0) {
      liveState.scores[safeTeam] = Math.max(0, liveState.scores[safeTeam] - safeLost);
    }
    if (safeTransferred > 0) {
      liveState.scores[opponentTeam] += safeTransferred;
    }
    liveState.scores.totalPlays += 1;

    saveStateToFile();
    const sorted = Object.values(liveState.leaderboard).sort((a, b) => b.score - a.score);
    res.json({ success: true, player: liveState.leaderboard[cleanPhone], leaderboard: sorted, scores: liveState.scores });
  });

  // Get Match History & Event Logs
  app.get("/api/match-history", (req, res) => {
    res.json(liveState.matchHistory.slice(0, 150));
  });

  // Log Match Activity Event (with timings, player, outcome and transfer notes)
  app.post("/api/match-history", (req, res) => {
    const { 
      playerName, 
      playerPhone, 
      team, 
      opponentTeam, 
      gameName, 
      outcome, 
      pointsWon, 
      pointsLost, 
      pointsTransferredToOpponent, 
      description, 
      teluguDescription 
    } = req.body;

    if (!playerName || !gameName) {
      return res.status(400).json({ error: "Player name and game name are required." });
    }

    const now = new Date();
    const cleanPhone = playerPhone ? String(playerPhone).replace(/[^\d+]/g, "").slice(-15) : "";
    const safeTeam = team === "priya" ? "priya" : "moshe";
    const safeOpponentTeam = opponentTeam === "moshe" ? "moshe" : "priya";

    const newLog: MatchHistoryEntry = {
      id: `match_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      playerName: String(playerName).trim().slice(0, 80),
      playerPhone: cleanPhone,
      team: safeTeam,
      opponentTeam: safeOpponentTeam,
      gameName: String(gameName).trim().slice(0, 80),
      outcome: outcome === "lost" ? "lost" : outcome === "partial" ? "partial" : "won",
      pointsWon: Math.max(0, Number(pointsWon) || 0),
      pointsLost: Math.max(0, Number(pointsLost) || 0),
      pointsTransferredToOpponent: Math.max(0, Number(pointsTransferredToOpponent) || 0),
      description: String(description || "").trim().slice(0, 300),
      teluguDescription: String(teluguDescription || "").trim().slice(0, 300),
      timestamp: now.toISOString(),
      formattedTime: now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true }),
      formattedDate: now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    };

    liveState.matchHistory = [newLog, ...liveState.matchHistory].slice(0, 200);
    saveStateToFile();
    res.json({ success: true, entry: newLog, totalLogs: liveState.matchHistory.length });
  });

  // Get Live Global Blessings
  app.get("/api/blessings", (req, res) => {
    res.json(liveState.blessings);
  });

  // Add a New Blessing
  app.post("/api/blessings", (req, res) => {
    const { name, city, message } = req.body;
    if (!name || !message) {
      return res.status(400).json({ error: "Name and message are required." });
    }

    const newBlessing = {
      id: `blessing-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: String(name).trim().slice(0, 100),
      city: city ? String(city).trim().slice(0, 100) : undefined,
      message: String(message).trim().slice(0, 500),
      timestamp: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      likes: 1,
      isUserAdded: true
    };

    liveState.blessings = [newBlessing, ...liveState.blessings];
    saveStateToFile();
    res.json({ success: true, blessings: liveState.blessings });
  });

  // Like a Blessing
  app.post("/api/blessings/:id/like", (req, res) => {
    const { id } = req.params;
    let found = false;
    liveState.blessings = liveState.blessings.map((b) => {
      if (b.id === id) {
        found = true;
        return { ...b, likes: (b.likes || 0) + 1 };
      }
      return b;
    });

    if (found) {
      saveStateToFile();
    }
    res.json({ success: true, blessings: liveState.blessings });
  });

  // -------------------------------------------------------------
  // STATIC ASSETS & WEDDING PHOTOS SERVING
  // -------------------------------------------------------------
  const assetDirectories = [
    path.join(process.cwd(), "public", "assets"),
    path.join(process.cwd(), "assets"),
    path.join(process.cwd(), "public"),
    process.cwd()
  ];

  // Specific handler for /assets/* and image requests
  app.get(["/assets/:filename(*)", "/:filename(*)"], (req, res, next) => {
    const rawFilename = req.params.filename || "";
    const cleanFilename = path.basename(rawFilename);

    if (!cleanFilename || (!cleanFilename.match(/\.(jpg|jpeg|png|webp|gif|svg|ico|mp3|wav)$/i) && !cleanFilename.startsWith("DSC"))) {
      return next();
    }

    for (const dir of assetDirectories) {
      if (!fs.existsSync(dir)) continue;

      // 1. Direct path check
      const exactPath = path.join(dir, cleanFilename);
      if (fs.existsSync(exactPath) && fs.statSync(exactPath).isFile()) {
        return res.sendFile(exactPath);
      }

      // 2. Case-insensitive lookup
      try {
        const files = fs.readdirSync(dir);
        const match = files.find(f => f.toLowerCase() === cleanFilename.toLowerCase());
        if (match) {
          const matchPath = path.join(dir, match);
          if (fs.statSync(matchPath).isFile()) {
            return res.sendFile(matchPath);
          }
        }
      } catch {}
    }
    next();
  });

  app.use("/assets", express.static(path.join(process.cwd(), "public", "assets")));
  app.use("/assets", express.static(path.join(process.cwd(), "assets")));
  app.use("/public", express.static(path.join(process.cwd(), "public")));
  app.use(express.static(path.join(process.cwd(), "public")));
  app.use(express.static(path.join(process.cwd(), "assets")));

  // -------------------------------------------------------------
  // VITE / STATIC SERVING
  // -------------------------------------------------------------
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Wedding server running at http://localhost:${PORT}`);
  });
}

startServer();
