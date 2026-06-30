import { useState, useRef, useEffect, useCallback } from "react";
import {
  ChevronLeft, Pencil, Download, Sparkles, ChevronDown,
  LayoutTemplate, Monitor, FileText, Briefcase, CheckCircle2,
  Loader2, AlertCircle, RotateCcw, Zap, X, FileDown,
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import TemplateModern       from "../components/resume/TemplateModern";
import TemplateMinimal      from "../components/resume/TemplateMinimal";
import TemplateProfessional from "../components/resume/TemplateProfessional";

/* ─── Template registry ─────────────────────────────────────────── */
const TEMPLATES = [
  {
    id: "modern",
    label: "Modern",
    desc: "Two-column with violet sidebar",
    icon: Monitor,
    accent: "from-violet-500 to-indigo-500",
    component: TemplateModern,
  },
  {
    id: "minimal",
    label: "Minimal",
    desc: "Clean single-column, lots of whitespace",
    icon: FileText,
    accent: "from-gray-400 to-gray-600",
    component: TemplateMinimal,
  },
  {
    id: "professional",
    label: "Professional",
    desc: "Classic navy-blue corporate style",
    icon: Briefcase,
    accent: "from-blue-700 to-blue-900",
    component: TemplateProfessional,
  },
];

/* ─── Completeness score ─────────────────────────────────────────── */
function calcScore(data) {
  let filled = 0, total = 0;
  const check = (v) => { total++; if (v && v.trim?.()) filled++; };
  Object.values(data.personal).forEach(check);
  Object.values(data.education).forEach(check);
  Object.values(data.skills).forEach(check);
  data.projects.forEach((p) => { check(p.title); check(p.description); });
  data.experience.forEach((e) => { check(e.company); check(e.role); });
  data.certifications.forEach((c) => check(c.name));
  return Math.round((filled / total) * 100);
}

/* ─── Merge form data with AI data ──────────────────────────────── */
function mergeWithAI(formData, aiData) {
  if (!aiData) return formData;
  return {
    ...formData,
    summary:     aiData.professionalSummary || null,
    objective:   aiData.careerObjective     || null,
    atsKeywords: aiData.atsKeywords         || [],
    projects: formData.projects.map((p, i) => ({
      ...p,
      description:
        aiData.enhancedProjects?.find((ep) => ep.index === i)?.description ||
        p.description,
    })),
    experience: formData.experience.map((e, i) => ({
      ...e,
      description:
        aiData.enhancedExperience?.find((ee) => ee.index === i)?.bullets?.join("\n") ||
        e.description,
    })),
  };
}

/* ─── Template Picker dropdown ───────────────────────────────────── */
function TemplatePicker({ selected, onSelect }) {
  const [open, setOpen] = useState(false);
  const current = TEMPLATES.find((t) => t.id === selected);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 glass px-4 py-2 rounded-xl text-sm font-medium text-white hover:bg-white/10 transition-all"
      >
        <LayoutTemplate size={15} className="text-violet-400" />
        {current?.label}
        <ChevronDown size={13} className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 w-64 glass-dark rounded-2xl p-2 z-50 shadow-2xl border border-white/10 animate-fade-up">
          {TEMPLATES.map((t) => {
            const Icon = t.icon;
            const active = t.id === selected;
            return (
              <button
                key={t.id}
                onClick={() => { onSelect(t.id); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 ${active ? "bg-violet-500/20 text-white" : "hover:bg-white/8 text-slate-300"}`}
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${t.accent} flex items-center justify-center shrink-0`}>
                  <Icon size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.label}</p>
                  <p className="text-[10px] text-slate-500">{t.desc}</p>
                </div>
                {active && <CheckCircle2 size={14} className="ml-auto text-violet-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Score badge ────────────────────────────────────────────────── */
function ScoreBadge({ score }) {
  const color = score >= 80 ? "text-emerald-400" : score >= 50 ? "text-yellow-400" : "text-pink-400";
  const bg    = score >= 80 ? "bg-emerald-500/15 border-emerald-500/30" : score >= 50 ? "bg-yellow-500/15 border-yellow-500/30" : "bg-pink-500/15 border-pink-500/30";
  return (
    <div className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${bg} ${color}`}>
      <span>Resume Score</span>
      <span className="text-base font-extrabold">{score}%</span>
    </div>
  );
}

/* ─── Toast notification ─────────────────────────────────────────── */
function Toast({ type, message, onClose }) {
  const styles = {
    success: "bg-emerald-500/20 border-emerald-500/40 text-emerald-300",
    error:   "bg-red-500/20 border-red-500/40 text-red-300",
    loading: "bg-violet-500/20 border-violet-500/40 text-violet-300",
    warning: "bg-amber-500/20 border-amber-500/40 text-amber-300",
  };
  const icons = {
    success: <CheckCircle2 size={16} />,
    error:   <AlertCircle size={16} />,
    loading: <Loader2 size={16} className="animate-spin" />,
    warning: <AlertCircle size={16} />,
  };
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-5 py-3 rounded-2xl border glass-dark shadow-2xl animate-fade-up no-print ${styles[type] || styles.error}`}>
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
          <X size={14} />
        </button>
      )}
    </div>
  );
}


/* ─── Loading overlay ────────────────────────────────────────────── */
function LoadingOverlay() {
  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-40 rounded-sm no-print">
      <div className="glass rounded-3xl px-10 py-8 flex flex-col items-center gap-4 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center animate-pulse-glow">
          <Sparkles size={26} className="text-white" />
        </div>
        <div className="text-center">
          <p className="text-gray-800 font-bold text-base mb-1">AI is optimizing your resume…</p>
          <p className="text-gray-500 text-xs">Crafting summaries, enhancing descriptions &amp; extracting ATS keywords</p>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-violet-400"
              style={{ animation: `pulse-glow 1.2s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main ResumePreview Page ────────────────────────────────────── */
export default function ResumePreview({ data, onEdit, onHome, onGoToPortfolio, initialTemplate = "modern" }) {
  const [template,    setTemplate]    = useState(initialTemplate);
  const [aiData,      setAiData]      = useState(null);
  const [isMockData,  setIsMockData]  = useState(false);   // true = fallback sample content
  const [aiLoading,   setAiLoading]   = useState(false);
  const [pdfLoading,  setPdfLoading]  = useState(false);
  const [toast,       setToast]       = useState(null);
  const [cooldown,    setCooldown]    = useState(0);
  const requestCount  = useRef(0);
  const isRequesting  = useRef(false);
  const debounceTimer = useRef(null);
  const abortCtrlRef  = useRef(null);
  const cooldownTimer = useRef(null);
  const resumeRef     = useRef(null);

  // Cleanup on unmount — cancel any in-flight request & timers
  useEffect(() => {
    return () => {
      abortCtrlRef.current?.abort();
      clearTimeout(debounceTimer.current);
      clearTimeout(cooldownTimer.current);
    };
  }, []);

  const score        = calcScore(data);
  const templateData = mergeWithAI(data, aiData);
  const TemplateComponent = TEMPLATES.find((t) => t.id === template)?.component || TemplateModern;
  const hasAI        = !!aiData;

  /* ── PDF Generation ── */
  const downloadPDF = async () => {
    if (!resumeRef.current) return;
    
    setPdfLoading(true);
    setToast({ type: "loading", message: "Preparing high-quality render..." });

    try {
      const element = document.getElementById("resume-paper") || resumeRef.current;
      if (!element) throw new Error("Resume content not found");

      // AGGRESSIVE WORKAROUND: Disable ALL stylesheets to prevent html2canvas from parsing oklch()
      const styleSheets = Array.from(document.styleSheets);
      const originalDisabledStates = styleSheets.map(s => s.disabled);
      styleSheets.forEach(s => s.disabled = true);

      // Inject a clean, minimal stylesheet for the resume (HEX colors only)
      const cleanStyle = document.createElement("style");
      cleanStyle.id = "pdf-clean-style";
      cleanStyle.innerHTML = `
        #resume-paper { background: white !important; color: #1f2937 !important; font-family: sans-serif !important; }
        #resume-paper * { color-scheme: light !important; }
        .text-white { color: white !important; }
        .bg-white { background: white !important; }
        .text-gray-800 { color: #1f2937 !important; }
        .text-gray-700 { color: #374151 !important; }
        .text-gray-600 { color: #4b5563 !important; }
        .text-gray-500 { color: #6b7280 !important; }
        .text-gray-400 { color: #9ca3af !important; }
        .bg-violet-700 { background-color: #6d28d9 !important; }
        .bg-violet-50 { background-color: #f5f3ff !important; }
        .border-violet-100 { border-color: #ede9fe !important; }
        .text-violet-600 { color: #7c3aed !important; }
        .text-violet-700 { color: #6d28d9 !important; }
        .bg-indigo-600 { background-color: #4f46e5 !important; }
        .bg-blue-900 { background-color: #1e3a8a !important; }
        .text-blue-700 { color: #1d4ed8 !important; }
        .bg-emerald-500 { background-color: #10b981 !important; }
      `;
      document.head.appendChild(cleanStyle);

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: 794,
        windowWidth: 794,
      });

      // Restore everything
      cleanStyle.remove();
      styleSheets.forEach((s, i) => s.disabled = originalDisabledStates[i]);

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
      const fileName = `${data.personal.fullName?.replace(/\s+/g, "_") || "Resume"}_AI_Generated.pdf`;
      pdf.save(fileName);
      
      setToast({ type: "success", message: "Resume downloaded successfully!" });
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.error("PDF Export Error:", err);
      // Aggressive restoration on failure
      document.getElementById("pdf-clean-style")?.remove();
      Array.from(document.styleSheets).forEach(s => s.disabled = false);
      setToast({ type: "error", message: "Failed to generate PDF. Please try again." });
    } finally {
      setPdfLoading(false);
    }
  };

  /* ── AI generation — single-flight with debounce + AbortController ── */
  const generateAI = useCallback(() => {
    // Debounce: ignore clicks within 500ms of each other
    if (debounceTimer.current) return;
    debounceTimer.current = setTimeout(() => { debounceTimer.current = null; }, 500);

    // Guard: block if already requesting or in cooldown
    if (isRequesting.current || cooldown > 0) {
      console.log(`[AI Service] Resume request BLOCKED — ${isRequesting.current ? "already in-flight" : `cooldown ${cooldown}s remaining`}`);
      return;
    }

    // Cancel any previous stale request
    abortCtrlRef.current?.abort();
    const controller = new AbortController();
    abortCtrlRef.current = controller;

    isRequesting.current = true;
    requestCount.current += 1;
    console.log(`[AI Service] Resume Request #${requestCount.current} SENT at ${new Date().toLocaleTimeString()}`);

    setAiLoading(true);
    setToast({ type: "loading", message: "Sending data to AI server…" });

    fetch("https://auto-resume-portfolio-builder.onrender.com/api/generate-resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal: controller.signal,
    })
      .then(async (res) => {
        const contentType = res.headers.get("content-type");
        let result;
        if (contentType && contentType.includes("application/json")) {
          result = await res.json();
        } else {
          const text = await res.text();
          throw new Error(`Server error: ${res.status}. ${text.slice(0, 100)}`);
        }
        if (!res.ok) throw new Error(result.error || result.details || "Generation failed");

        const isMock = result.isMock === true;
        console.log(`[AI Service] Resume Request #${requestCount.current} ${isMock ? "MOCK" : "SUCCESS"}`);

        setAiData(result.data);
        setIsMockData(isMock);

        if (isMock) {
          setToast({ type: "warning", message: "⚠ Quota exceeded — showing sample AI content instead." });
        } else {
          setToast({ type: "success", message: "✦ AI resume content generated successfully!" });
        }
        setTimeout(() => setToast(null), 5000);
        startCooldown(30);
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          console.log(`[AI Service] Resume Request #${requestCount.current} aborted`);
          return;
        }
        console.error(`[AI Service] Resume Request #${requestCount.current} FAILED:`, err.message);
        // Network/server completely down — show toast error
        setToast({
          type: "error",
          message: "Cannot reach AI server. Is it running on port 3001?",
        });
      })
      .finally(() => {
        setAiLoading(false);
        isRequesting.current = false;
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cooldown, data]);

  /* ── Cooldown: single recursive setTimeout (not setInterval per tick) ── */
  const startCooldown = useCallback((seconds) => {
    clearTimeout(cooldownTimer.current);
    setCooldown(seconds);
    if (seconds <= 0) return;
    cooldownTimer.current = setTimeout(() => startCooldown(seconds - 1), 1000);
  }, []);

  const resetAI = () => {
    setAiData(null);
    setIsMockData(false);
    setToast({ type: "success", message: "Reset to original content." });
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="min-h-screen flex flex-col print:bg-white">

      {/* ════ TOOLBAR ════ */}
      <div className="no-print sticky top-0 z-50 glass-dark border-b border-white/8 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3 flex-wrap">

          {/* Left */}
          <div className="flex items-center gap-4">
            <button
              onClick={onHome}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors group"
            >
              <ChevronLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Home</span>
            </button>
            <div className="w-px h-4 bg-white/15" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
                <Sparkles size={12} className="text-white" />
              </div>
              <span className="text-sm font-bold gradient-text hidden sm:block">Resume Preview</span>
            </div>
          </div>

          {/* Right — action buttons */}
          <div className="flex items-center gap-3">
            <TemplatePicker selected={template} onSelect={setTemplate} />
            <ScoreBadge score={score} />
            
            <div className="w-px h-5 bg-white/10 hidden lg:block" />

            {/* Reset AI */}
            {hasAI && (
              <button
                onClick={resetAI}
                title="Reset to original content"
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-2 rounded-xl glass transition-all"
              >
                <RotateCcw size={13} />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}

            {/* Generate AI */}
            <button
              onClick={generateAI}
              disabled={aiLoading || cooldown > 0}
              className={`relative overflow-hidden flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
                cooldown > 0
                  ? "bg-slate-800 text-slate-500 border-white/5 cursor-not-allowed"
                  : hasAI
                  ? "glass border border-violet-500/40 text-violet-300 hover:bg-violet-500/15"
                  : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(139,92,246,0.35)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
              }`}
            >
              {aiLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : cooldown > 0 ? (
                <span className="w-3.5 h-3.5 flex items-center justify-center text-[11px] font-bold">{cooldown}</span>
              ) : (
                <Zap size={14} className={hasAI ? "text-violet-400" : "text-yellow-300 fill-yellow-300"} />
              )}
              <span>
                {aiLoading ? "Generating…" : cooldown > 0 ? `Wait ${cooldown}s` : hasAI ? "Regenerate AI" : "Generate AI Content"}
              </span>
            </button>

            {/* Build Portfolio */}
            <button
              onClick={onGoToPortfolio}
              className="group relative px-4 py-2 rounded-xl bg-indigo-600/20 text-indigo-300 font-bold text-sm border border-indigo-500/30 transition-all hover:bg-indigo-600/30 hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/10"
            >
              <div className="flex items-center gap-2">
                <LayoutTemplate size={14} className="text-indigo-400" />
                <span>Build AI Portfolio</span>
              </div>
            </button>

            <div className="w-px h-5 bg-white/10 hidden sm:block" />

            {/* Edit */}
            <button onClick={onEdit} className="btn-outline flex items-center gap-2 text-sm px-4 py-2">
              <Pencil size={14} />
              <span className="hidden sm:inline">Edit</span>
            </button>

            {/* Download */}
            <button
              onClick={downloadPDF}
              disabled={pdfLoading}
              className="btn-primary flex items-center gap-2 text-sm px-5 py-2 min-w-[140px] justify-center"
            >
              {pdfLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <FileDown size={14} className="relative z-10" />
              )}
              <span className="relative z-10 hidden sm:inline">
                {pdfLoading ? "Generating..." : "Download PDF"}
              </span>
              <span className="relative z-10 sm:hidden">
                {pdfLoading ? "..." : "PDF"}
              </span>
            </button>
          </div>
        </div>

        {/* Score progress bar */}
        <div className="h-0.5 bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-700"
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* AI Status Banner */}
      {hasAI && !aiLoading && !isMockData && (
        <div className="no-print bg-emerald-500/10 border-b border-emerald-500/20 py-2 px-6 text-center">
          <p className="text-xs text-emerald-400 font-medium">
            ✦ AI-Enhanced content is active — Professional Summary, Career Objective, ATS Keywords &amp; improved descriptions are showing
          </p>
        </div>
      )}

      {/* Mock Data Warning Banner */}
      {hasAI && !aiLoading && isMockData && (
        <div className="no-print bg-amber-500/10 border-b border-amber-500/25 py-2 px-6 text-center">
          <p className="text-xs text-amber-400 font-medium">
            ⚠ Gemini API quota exceeded — showing <strong>sample AI content</strong> so you can preview the layout. Real content will appear once quota resets.
          </p>
        </div>
      )}

      {/* ─── PREVIEW AREA ─── */}
      <div className="flex-1 bg-[#0a0a1a] print:bg-white overflow-y-auto">
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 no-print">
          <div className="absolute top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-violet-600/8 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-indigo-600/8 blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 print:p-0 print:max-w-none">

          {/* Hint */}
          <div className="no-print text-center mb-5">
            <p className="text-xs text-slate-500">
              Viewing{" "}
              <span className="text-violet-400 font-semibold">
                {TEMPLATES.find((t) => t.id === template)?.label}
              </span>{" "}
              template
              {!hasAI && (
                <> · Click <span className="text-yellow-400 font-semibold">Generate AI Content</span> to enhance with AI</>
              )}
              {hasAI && !isMockData && (
                <> · <span className="text-emerald-400">AI content active</span> · Click Download PDF to export</>
              )}
              {hasAI && isMockData && (
                <> · <span className="text-amber-400">Sample AI content</span> (quota exceeded) · PDF export still works</>
              )}
            </p>
          </div>

          {/* Resume Paper */}
          <div
            ref={resumeRef}
            id="resume-paper"
            className="relative bg-white mx-auto shadow-[0_25px_80px_rgba(0,0,0,0.5)] print:shadow-none rounded-sm overflow-hidden"
            style={{ width: "794px", minHeight: "1123px", maxWidth: "100%" }}
          >
            {aiLoading && <LoadingOverlay />}
            <TemplateComponent data={templateData} />
          </div>

          <div className="no-print h-16" />
        </div>
      </div>

      {/* Info bar */}
      <div className="no-print bg-[#0a0a1a] border-t border-white/8 py-3 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-slate-500">
          <span>A4 paper · 794 × 1123 px · ATS-friendly HTML</span>
          <span>© {new Date().getFullYear()} AI Resume Builder</span>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={toast.type !== "loading" ? () => setToast(null) : null}
        />
      )}
    </div>
  );
}
