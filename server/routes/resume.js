import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

/* ══════════════════════════════════════════════════════════════════
   GLOBAL COUNTERS & RATE LIMITER
══════════════════════════════════════════════════════════════════ */
let totalApiCalls  = 0;   // cumulative Gemini calls this server session
let totalMockCalls = 0;   // times fallback mock was served

const rateLimitMap = new Map(); // ip -> { count, resetAt }
const RATE_LIMIT   = 5;         // max real Gemini calls per window
const WINDOW_MS    = 60_000;    // 60-second window

function checkRateLimit(ip) {
  const now   = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }
  if (entry.count >= RATE_LIMIT) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT - entry.count };
}

/* ══════════════════════════════════════════════════════════════════
   GEMINI CLIENT (lazy-init)
══════════════════════════════════════════════════════════════════ */
let geminiClient = null;
function getClient() {
  if (!geminiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "your-gemini-api-key-here") {
      throw new Error("GEMINI_API_KEY not configured in server/.env");
    }
    geminiClient = new GoogleGenerativeAI(key);
  }
  return geminiClient;
}

/* ══════════════════════════════════════════════════════════════════
   OPTIMIZED PROMPT BUILDERS  (shorter = fewer tokens = lower quota)
══════════════════════════════════════════════════════════════════ */
function buildResumePrompt(fd) {
  const projects = fd.projects
    .filter((p) => p.title)
    .map((p, i) => `P${i}: ${p.title} | Tech: ${p.technologies} | ${p.description || ""}`)
    .join("\n");

  const experience = fd.experience
    .filter((e) => e.company)
    .map((e, i) => `E${i}: ${e.role} @ ${e.company} (${e.duration}) | ${e.description || ""}`)
    .join("\n");

  const certs = fd.certifications
    .filter((c) => c.name)
    .map((c) => `${c.name} — ${c.platform} ${c.year}`)
    .join(", ");

  return `Expert resume writer. Generate ATS-optimized content for this candidate.

Name: ${fd.personal.fullName || "Candidate"}
Degree: ${fd.education.degree} ${fd.education.specialization ? "in " + fd.education.specialization : ""} | ${fd.education.college} (${fd.education.year})
Skills: ${fd.skills.technical} | Tools: ${fd.skills.tools} | Languages: ${fd.skills.languages}
Projects:\n${projects || "None"}
Experience:\n${experience || "Fresher"}
Certs: ${certs || "None"}

Return ONLY this JSON (no markdown, no explanation):
{
  "professionalSummary": "3-sentence ATS summary. No first person.",
  "careerObjective": "2-sentence objective. No first person.",
  "enhancedProjects": [{"index":0,"description":"2-sentence STAR format with action verb"}],
  "enhancedExperience": [{"index":0,"bullets":["Action verb + task + result","Another bullet","Third bullet"]}],
  "atsKeywords": ["kw1","kw2","kw3","kw4","kw5","kw6","kw7","kw8","kw9","kw10"]
}
Rules: one entry per project/experience (0-based index). Fresher = enhancedExperience:[]. Return ONLY JSON.`;
}

function buildPortfolioPrompt(fd) {
  const projects = fd.projects
    .filter((p) => p.title)
    .map((p, i) => `P${i}: ${p.title} (${p.technologies})`)
    .join(", ");

  return `Personal branding expert. Create portfolio website content.

Candidate: ${fd.personal.fullName} | ${fd.education.degree} ${fd.education.specialization || ""}
Skills: ${fd.skills.technical}
Projects: ${projects || "None"}

Return ONLY this JSON:
{
  "hero": {"tagline":"5-7 word punchy tagline","intro":"2-sentence captivating intro"},
  "about": {
    "bio": "3 paragraphs: P1=background/passion, P2=technical skills/philosophy, P3=future goals.",
    "strengths": ["Strength 1","Strength 2","Strength 3","Strength 4"]
  },
  "projects": [{"index":0,"displayDescription":"1 catchy sentence","longDescription":"3-sentence detail"}],
  "experience": [{"index":0,"achievement":"One powerful achievement line"}],
  "seo": {"metaDescription":"160-char SEO description"}
}
Return ONLY JSON.`;
}

/* ══════════════════════════════════════════════════════════════════
   FALLBACK MOCK DATA  (served when Gemini quota/network fails)
══════════════════════════════════════════════════════════════════ */
function buildMockResumeData(fd) {
  const name      = fd.personal.fullName || "Candidate";
  const role      = fd.experience?.[0]?.role || "Software Developer";
  const company   = fd.experience?.[0]?.company || "a leading tech firm";
  const tech      = fd.skills?.technical || "JavaScript, React, Node.js";
  const degree    = fd.education?.degree || "Bachelor of Technology";
  const spec      = fd.education?.specialization || "Computer Science";
  const college   = fd.education?.college || "a reputed university";
  const year      = fd.education?.year || "2024";
  const tools     = fd.skills?.tools || "Git, VS Code, Docker";
  const langs     = fd.skills?.languages || "JavaScript, Python";

  const enhancedProjects = fd.projects
    .filter((p) => p.title)
    .map((p, i) => ({
      index: i,
      description: `Architected and deployed ${p.title} using ${p.technologies || "modern web technologies"}, delivering a scalable solution that improved user engagement by 35%. Implemented robust architecture following industry best practices, resulting in a 40% reduction in load time and enhanced overall system reliability.`,
    }));

  const enhancedExperience = fd.experience
    .filter((e) => e.company)
    .map((e, i) => ({
      index: i,
      bullets: [
        `Engineered and maintained full-stack features at ${e.company} as ${e.role}, reducing bug count by 30% through rigorous code reviews and automated testing.`,
        `Collaborated with cross-functional teams to deliver ${e.duration} of high-impact projects, improving deployment frequency by 25% via CI/CD pipeline optimizations.`,
        `Mentored junior developers and documented technical specifications, accelerating onboarding by 50% and improving team productivity.`,
      ],
    }));

  const techKeywords = tech.split(",").map((s) => s.trim()).slice(0, 5);
  const toolKeywords = tools.split(",").map((s) => s.trim()).slice(0, 3);
  const atsKeywords  = [...techKeywords, ...toolKeywords, "Agile", "REST API", "Problem Solving"];

  return {
    professionalSummary: `${degree} graduate in ${spec} from ${college} (${year}) with hands-on expertise in ${tech}. Proven ability to design, develop, and deploy production-grade applications using ${tools}, with a strong focus on performance, scalability, and code quality. Passionate about building innovative solutions that drive measurable business outcomes and enhance end-user experience.`,
    careerObjective: `Seeking a challenging ${role} position where strong expertise in ${tech} can be applied to deliver high-quality, user-centric software solutions. Committed to continuous learning and contributing to high-performing engineering teams at a forward-thinking organization.`,
    enhancedProjects: enhancedProjects.length ? enhancedProjects : [{
      index: 0,
      description: "Designed and implemented a full-stack web application using React and Node.js, reducing user workflow time by 40%. Integrated RESTful APIs and optimized database queries, achieving sub-200ms response times across all critical endpoints.",
    }],
    enhancedExperience: enhancedExperience.length ? enhancedExperience : [],
    atsKeywords: atsKeywords.length >= 8 ? atsKeywords : [
      ...atsKeywords, "JavaScript", "React", "Node.js", "REST APIs", "Agile"
    ].slice(0, 10),
  };
}

function buildMockPortfolioData(fd) {
  const name    = fd.personal.fullName || "Developer";
  const role    = fd.experience?.[0]?.role || "Software Developer";
  const tech    = fd.skills?.technical || "React, Node.js, JavaScript";
  const degree  = fd.education?.degree || "B.Tech";
  const spec    = fd.education?.specialization || "Computer Science";
  const college = fd.education?.college || "a leading university";

  const mockProjects = fd.projects
    .filter((p) => p.title)
    .map((p, i) => ({
      index: i,
      displayDescription: `An innovative ${p.title} solution built with ${p.technologies || "modern tech"} that solves real-world problems.`,
      longDescription: `${p.title} is a comprehensive solution developed using ${p.technologies || "modern web technologies"}. The project demonstrates strong architectural thinking and clean code practices. It features scalable design patterns, optimized performance, and an intuitive user experience that drives measurable results.`,
    }));

  const mockExperience = fd.experience
    .filter((e) => e.company)
    .map((e, i) => ({
      index: i,
      achievement: `Led critical engineering initiatives at ${e.company} as ${e.role}, delivering solutions that reduced operational overhead by 30% and accelerated feature delivery cycles.`,
    }));

  return {
    hero: {
      tagline: `Crafting elegant code, delivering real impact`,
      intro: `${name} is a passionate ${role} who transforms complex problems into elegant digital solutions. With expertise in ${tech}, committed to building software that makes a difference.`,
    },
    about: {
      bio: `${name} is a dedicated software professional with a ${degree} in ${spec} from ${college}. Driven by a deep passion for technology and a relentless pursuit of excellence, the focus is on building solutions that truly matter to users and businesses alike.\n\nWith strong expertise in ${tech}, the philosophy centers on writing clean, maintainable code and designing systems that scale gracefully. Every project is an opportunity to push boundaries and explore innovative approaches to problem-solving.\n\nLooking ahead, the goal is to contribute to transformative projects that leverage AI and modern web technologies to create meaningful impact. Open to collaborating with visionary teams that share a commitment to quality and innovation.`,
      strengths: ["Fast Learner", "Problem Solver", "Team Collaborator", "Detail Oriented"],
    },
    projects: mockProjects.length ? mockProjects : [{
      index: 0,
      displayDescription: "A full-stack web application delivering seamless user experiences at scale.",
      longDescription: "Built using React and Node.js, this application demonstrates advanced state management, optimized API integrations, and responsive UI design. It features real-time data updates, secure authentication, and a clean architecture that supports rapid feature development and long-term maintainability.",
    }],
    experience: mockExperience.length ? mockExperience : [{
      index: 0,
      achievement: "Delivered high-impact engineering solutions that improved team velocity by 40% and reduced system downtime.",
    }],
    seo: {
      metaDescription: `${name} — ${role} specializing in ${tech.split(",")[0]?.trim() || "web development"}. View portfolio, projects, and professional experience.`,
    },
  };
}

/* ══════════════════════════════════════════════════════════════════
   ERROR CLASSIFIER
══════════════════════════════════════════════════════════════════ */
function classifyGeminiError(err) {
  const msg    = (err.message || "").toLowerCase();
  const status = err.status || err.code;

  if (msg.includes("quota") || msg.includes("resource_exhausted") ||
      msg.includes("rate") || status === 429) {
    return { type: "quota", userMessage: "Gemini API daily/rate quota exceeded." };
  }
  if (msg.includes("api key") || msg.includes("api_key") ||
      msg.includes("invalid") || status === 401 || status === 400) {
    return { type: "auth", userMessage: "Invalid or missing Gemini API key." };
  }
  if (msg.includes("not configured")) {
    return { type: "config", userMessage: "Gemini API key not configured in server/.env." };
  }
  if (msg.includes("network") || msg.includes("fetch") || msg.includes("econnrefused")) {
    return { type: "network", userMessage: "Network error reaching Gemini API." };
  }
  return { type: "unknown", userMessage: err.message || "Unexpected error." };
}

/* ══════════════════════════════════════════════════════════════════
   POST /api/generate-resume
══════════════════════════════════════════════════════════════════ */
router.post("/generate-resume", async (req, res) => {
  const startTime = Date.now();
  const clientIp  = req.ip || req.socket?.remoteAddress || "unknown";

  // ── Rate limit ──
  const rl = checkRateLimit(clientIp);
  if (!rl.allowed) {
    console.warn(`[Rate Limit] /generate-resume blocked — IP: ${clientIp} | retry in ${rl.retryAfter}s`);
    // Still serve mock so UI doesn't break
    const formData = req.body;
    if (formData?.personal) {
      totalMockCalls++;
      console.log(`[Mock #${totalMockCalls}] Serving fallback resume data (rate limited)`);
      return res.json({
        success: true,
        data: buildMockResumeData(formData),
        isMock: true,
        mockReason: "rate_limited",
      });
    }
    return res.status(429).json({ error: "Too many requests", details: `Wait ${rl.retryAfter}s and try again.` });
  }

  // ── Validate body ──
  const formData = req.body;
  if (!formData?.personal) {
    return res.status(400).json({ error: "Invalid request", details: "Missing 'personal' field." });
  }

  totalApiCalls++;
  console.log(`\n[${new Date().toISOString()}] ▶ /generate-resume`);
  console.log(`  IP: ${clientIp} | Session API calls: ${totalApiCalls} | Mock calls: ${totalMockCalls}`);
  console.log(`  Candidate: ${formData.personal.fullName || "Unknown"}`);

  try {
    const client    = getClient();
    const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
    const model     = client.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
        maxOutputTokens: 1800,   // reduced from 2500 to save quota
      },
    });

    const result  = await model.generateContent(buildResumePrompt(formData));
    const rawText = result.response.text();

    if (!rawText) throw new Error("Gemini returned empty response.");

    let aiData;
    try {
      const match = rawText.match(/\{[\s\S]*\}/);
      aiData = JSON.parse(match ? match[0] : rawText);
    } catch {
      throw new Error("JSON parse failed — Gemini returned malformed response.");
    }

    const elapsed = Date.now() - startTime;
    console.log(`  ✅ Success in ${elapsed}ms | model: ${modelName}`);

    return res.json({ success: true, data: aiData, isMock: false, meta: { model: modelName, elapsedMs: elapsed } });

  } catch (err) {
    const elapsed  = Date.now() - startTime;
    const classified = classifyGeminiError(err);

    console.error(`  ❌ Error after ${elapsed}ms — type: ${classified.type}`);
    console.error(`  Message: ${err.message}`);
    console.log(`  ↩ Serving mock fallback resume data`);

    totalMockCalls++;
    console.log(`[Mock #${totalMockCalls}] Reason: ${classified.type}`);

    // Always return mock data so the UI keeps working
    return res.json({
      success: true,
      data: buildMockResumeData(formData),
      isMock: true,
      mockReason: classified.type,
      mockMessage: classified.userMessage,
    });
  }
});

/* ══════════════════════════════════════════════════════════════════
   POST /api/generate-portfolio
══════════════════════════════════════════════════════════════════ */
router.post("/generate-portfolio", async (req, res) => {
  const startTime = Date.now();
  const clientIp  = req.ip || req.socket?.remoteAddress || "unknown";

  // ── Rate limit ──
  const rl = checkRateLimit(clientIp);
  if (!rl.allowed) {
    console.warn(`[Rate Limit] /generate-portfolio blocked — IP: ${clientIp} | retry in ${rl.retryAfter}s`);
    const formData = req.body;
    if (formData?.personal) {
      totalMockCalls++;
      console.log(`[Mock #${totalMockCalls}] Serving fallback portfolio data (rate limited)`);
      return res.json({
        success: true,
        data: buildMockPortfolioData(formData),
        isMock: true,
        mockReason: "rate_limited",
      });
    }
    return res.status(429).json({ error: "Too many requests", details: `Wait ${rl.retryAfter}s and try again.` });
  }

  const formData = req.body;
  if (!formData?.personal) {
    return res.status(400).json({ error: "Invalid request", details: "Form data required." });
  }

  totalApiCalls++;
  console.log(`\n[${new Date().toISOString()}] ▶ /generate-portfolio`);
  console.log(`  IP: ${clientIp} | Session API calls: ${totalApiCalls} | Mock calls: ${totalMockCalls}`);
  console.log(`  Candidate: ${formData.personal.fullName || "Unknown"}`);

  try {
    const client    = getClient();
    const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
    const model     = client.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.8,
        maxOutputTokens: 1600,   // reduced to save quota
      },
    });

    const result  = await model.generateContent(buildPortfolioPrompt(formData));
    const rawText = result.response.text();

    const match  = rawText.match(/\{[\s\S]*\}/);
    const aiData = JSON.parse(match ? match[0] : rawText);

    const elapsed = Date.now() - startTime;
    console.log(`  ✅ Success in ${elapsed}ms | model: ${modelName}`);

    return res.json({ success: true, data: aiData, isMock: false, meta: { model: modelName, elapsedMs: elapsed } });

  } catch (err) {
    const elapsed    = Date.now() - startTime;
    const classified = classifyGeminiError(err);

    console.error(`  ❌ Error after ${elapsed}ms — type: ${classified.type}`);
    console.error(`  Message: ${err.message}`);
    console.log(`  ↩ Serving mock fallback portfolio data`);

    totalMockCalls++;
    console.log(`[Mock #${totalMockCalls}] Reason: ${classified.type}`);

    return res.json({
      success: true,
      data: buildMockPortfolioData(formData),
      isMock: true,
      mockReason: classified.type,
      mockMessage: classified.userMessage,
    });
  }
});

export default router;
