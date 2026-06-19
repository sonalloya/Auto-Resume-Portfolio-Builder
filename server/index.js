import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import resumeRoutes from "./routes/resume.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

/* ── Middleware ─────────────────────────────────────────────────── */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json({ limit: "10mb" }));

/* ── Health check ───────────────────────────────────────────────── */
app.get("/api/health", (_req, res) => {
  const keySet = !!process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY !== "your-gemini-api-key-here";
  res.json({
    status: "ok",
    provider: "Google Gemini",
    model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
    apiKeyConfigured: keySet,
  });
});

/* ── Routes ─────────────────────────────────────────────────────── */
app.use("/api", resumeRoutes);

/* ── Global error handler ───────────────────────────────────────── */
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error", details: err.message });
});

/* ── Start ──────────────────────────────────────────────────────── */
app.listen(PORT, () => {
  console.log(`\n🚀  AI Resume Builder API (Gemini)`);
  console.log(`   Server   : http://localhost:${PORT}`);
  console.log(`   Health   : http://localhost:${PORT}/api/health`);
  console.log(`   Model    : ${process.env.GEMINI_MODEL || "gemini-1.5-flash"}`);
  const keyOk = !!process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY !== "your-gemini-api-key-here";
  console.log(`   API Key  : ${keyOk ? "✅ Configured" : "❌ NOT SET — edit server/.env"}\n`);
});
