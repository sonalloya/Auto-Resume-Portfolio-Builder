import { useState, useEffect, useRef, useCallback } from "react";
import { 
  ChevronLeft, Pencil, Sparkles, Zap, Mail, Link2,
  ExternalLink, Code2, Briefcase, GraduationCap, Award, 
  User, Cpu, Layout, ArrowRight, Loader2, CheckCircle2, AlertCircle
} from "lucide-react";

/* ─── Shared Components ─────────────────────────────────────────── */
const SectionHeading = ({ title, subtitle, icon: Icon }) => (
  <div className="mb-12">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
        <Icon size={20} />
      </div>
      <span className="text-violet-400 font-semibold tracking-wider text-xs uppercase">{title}</span>
    </div>
    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{subtitle}</h2>
    <div className="w-20 h-1 bg-gradient-to-r from-violet-600 to-transparent rounded-full" />
  </div>
);

const GlassCard = ({ children, className = "" }) => (
  <div className={`glass-dark border border-white/5 rounded-3xl p-6 sm:p-8 hover:border-white/15 transition-all duration-300 group ${className}`}>
    {children}
  </div>
);

/* ─── Main PortfolioPreview Component ────────────────────────────── */
export default function PortfolioPreview({ data, onEdit, onHome }) {
  const [aiData,     setAiData]     = useState(null);
  const [isMockData, setIsMockData] = useState(false);   // true = fallback sample content
  const [isLoading,  setIsLoading]  = useState(false);
  const [toast,      setToast]      = useState(null);
  const [cooldown,   setCooldown]   = useState(0);
  const requestCount  = useRef(0);
  const isRequesting  = useRef(false);
  const debounceTimer = useRef(null);
  const abortCtrlRef  = useRef(null);
  const cooldownTimer = useRef(null);

  // Cleanup on unmount — cancel any in-flight request & timers
  useEffect(() => {
    return () => {
      abortCtrlRef.current?.abort();
      clearTimeout(debounceTimer.current);
      clearTimeout(cooldownTimer.current);
    };
  }, []);

  /* ── Cooldown: single recursive setTimeout (not setInterval per tick) ── */
  const startCooldown = useCallback((seconds) => {
    clearTimeout(cooldownTimer.current);
    setCooldown(seconds);
    if (seconds <= 0) return;
    cooldownTimer.current = setTimeout(() => startCooldown(seconds - 1), 1000);
  }, []);

  /* ── AI generation — single-flight with debounce + AbortController ── */
  const generatePortfolio = useCallback(() => {
    // Debounce: ignore clicks within 500ms of each other
    if (debounceTimer.current) return;
    debounceTimer.current = setTimeout(() => { debounceTimer.current = null; }, 500);

    // Guard: block if already requesting or in cooldown
    if (isRequesting.current || cooldown > 0) {
      console.log(`[AI Service] Portfolio request BLOCKED — ${isRequesting.current ? "already in-flight" : `cooldown ${cooldown}s remaining`}`);
      return;
    }

    // Cancel any previous stale request
    abortCtrlRef.current?.abort();
    const controller = new AbortController();
    abortCtrlRef.current = controller;

    isRequesting.current = true;
    requestCount.current += 1;
    console.log(`[AI Service] Portfolio Request #${requestCount.current} SENT at ${new Date().toLocaleTimeString()}`);

    setIsLoading(true);
    setToast({ type: "loading", message: "AI is crafting your personal brand..." });

    fetch("/api/generate-portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal: controller.signal,
    })
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || "Generation failed");

        const isMock = result.isMock === true;
        console.log(`[AI Service] Portfolio Request #${requestCount.current} ${isMock ? "MOCK" : "SUCCESS"}`);

        setAiData(result.data);
        setIsMockData(isMock);

        if (isMock) {
          setToast({ type: "warning", message: "⚠ Quota exceeded — showing sample portfolio content." });
        } else {
          setToast({ type: "success", message: "Portfolio website generated!" });
        }
        setTimeout(() => setToast(null), 5000);
        startCooldown(30);
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          console.log(`[AI Service] Portfolio Request #${requestCount.current} aborted`);
          return;
        }
        console.error(`[AI Service] Portfolio Request #${requestCount.current} FAILED:`, err.message);
        setToast({ type: "error", message: "Cannot reach AI server. Is it running on port 3001?" });
      })
      .finally(() => {
        setIsLoading(false);
        isRequesting.current = false;
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cooldown, data, startCooldown]);

  const name = data.personal.fullName || "Your Name";
  const role = data.experience[0]?.role || data.education.degree || "Software Developer";

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 selection:bg-violet-500/30 scroll-smooth pb-20">
      
      {/* ── Background Blobs ── */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/10 blur-[120px] rounded-full animate-float-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-float-mid" />
      </div>

      {/* ── Top Bar — hidden on scroll or sticky ── */}
      <nav className="sticky top-4 z-50 max-w-5xl mx-auto px-4">
        <div className="glass-dark border border-white/10 rounded-2xl px-6 py-3 flex items-center justify-between shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-6">
            <button onClick={onHome} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
              <ChevronLeft size={16} /> Home
            </button>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                <Layout size={12} className="text-white" />
              </div>
              <span className="text-sm font-bold text-white tracking-tight">Portfolio Preview</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={generatePortfolio}
              disabled={isLoading || cooldown > 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                cooldown > 0 
                  ? "bg-slate-800 text-slate-500 border-white/5 cursor-not-allowed" 
                  : "bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 border-violet-500/20"
              }`}
            >
              {isLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : cooldown > 0 ? (
                <span className="w-3.5 h-3.5 flex items-center justify-center text-[10px]">{cooldown}</span>
              ) : (
                <Sparkles size={14} />
              )}
              {isLoading ? "Generating..." : cooldown > 0 ? `Wait ${cooldown}s` : "Regenerate AI"}
            </button>
            <button onClick={onEdit} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 text-xs font-bold transition-all border border-white/10">
              <Pencil size={14} /> Edit
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mock Data Warning Banner ── */}
      {aiData && isMockData && !isLoading && (
        <div className="bg-amber-500/10 border-b border-amber-500/25 py-2 px-6 text-center">
          <p className="text-xs text-amber-400 font-medium">
            ⚠ Gemini API quota exceeded — showing <strong>sample portfolio content</strong>. Real AI content will appear once quota resets.
          </p>
        </div>
      )}

      {/* ── Hero Section ── */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold mb-8 animate-fade-up">
          <Zap size={12} className="fill-violet-400" />
          <span>Available for New Opportunities</span>
        </div>
        
        <h1 className="text-5xl sm:text-7xl font-extrabold text-white mb-6 tracking-tight animate-fade-up" style={{ animationDelay: '0.1s' }}>
          Hi, I'm <span className="gradient-text">{name}</span>
        </h1>
        
        <p className="text-lg sm:text-2xl text-slate-400 max-w-3xl mb-10 leading-relaxed animate-fade-up" style={{ animationDelay: '0.2s' }}>
          {aiData?.hero?.tagline || `Transforming ideas into digital reality as a ${role}`}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all flex items-center gap-2 group">
            View My Projects <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <div className="flex items-center gap-3 glass px-6 py-4 rounded-2xl border border-white/10">
            {data.personal.github && (
              <a href={data.personal.github} className="text-slate-400 hover:text-white transition-colors"><Code2 size={20} /></a>
            )}
            {data.personal.linkedin && (
              <a href={data.personal.linkedin} className="text-slate-400 hover:text-white transition-colors"><Link2 size={20} /></a>
            )}
            {data.personal.email && (
              <a href={`mailto:${data.personal.email}`} className="text-slate-400 hover:text-white transition-colors"><Mail size={20} /></a>
            )}
          </div>
        </div>
      </section>

      {/* ── About Section ── */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <SectionHeading title="About Me" subtitle="My Journey & Philosophy" icon={User} />
            <div className="space-y-6 text-slate-400 leading-relaxed">
              {aiData?.about?.bio ? (
                aiData.about.bio.split('\n\n').map((para, i) => <p key={i}>{para}</p>)
              ) : (
                <p>Passionate software developer focused on building scalable and user-centric applications. With a strong foundation in computer science and a love for problem-solving, I strive to deliver clean, efficient code and delightful user experiences.</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(aiData?.about?.strengths || ["Fast Learner", "Problem Solver", "Team Player", "Detail Oriented"]).map((s, i) => (
              <GlassCard key={i} className="!p-6 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400">
                  <CheckCircle2 size={20} />
                </div>
                <p className="font-bold text-white">{s}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── Skills Section ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <SectionHeading title="Abilities" subtitle="Technical Arsenal" icon={Cpu} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard>
            <h4 className="text-white font-bold mb-6 flex items-center gap-2">
              <Code2 size={18} className="text-violet-400" /> Core Tech
            </h4>
            <div className="flex flex-wrap gap-2">
              {(data.skills.technical || "React, Node.js, JavaScript").split(',').map(s => (
                <span key={s} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-xs font-medium hover:border-violet-500/30 hover:text-violet-400 transition-colors">
                  {s.trim()}
                </span>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h4 className="text-white font-bold mb-6 flex items-center gap-2">
              <Layout size={18} className="text-indigo-400" /> Tools & Environment
            </h4>
            <div className="flex flex-wrap gap-2">
              {(data.skills.tools || "Git, VS Code, Docker").split(',').map(s => (
                <span key={s} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-xs font-medium hover:border-indigo-500/30 hover:text-indigo-400 transition-colors">
                  {s.trim()}
                </span>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h4 className="text-white font-bold mb-6 flex items-center gap-2">
              <Sparkles size={18} className="text-pink-400" /> Professional Qualities
            </h4>
            <div className="flex flex-wrap gap-2">
              {(data.skills.soft || "Communication, Leadership, Agile").split(',').map(s => (
                <span key={s} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-xs font-medium hover:border-pink-500/30 hover:text-pink-400 transition-colors">
                  {s.trim()}
                </span>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ── Projects Section ── */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-white/5">
        <SectionHeading title="Work" subtitle="Featured Projects" icon={Layout} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.projects.map((p, i) => {
            const aiProject = aiData?.projects?.find(ap => ap.index === i);
            return (
              <GlassCard key={i} className="group overflow-hidden !p-0">
                <div className="h-48 bg-gradient-to-br from-violet-500/20 to-indigo-600/20 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-white/10">
                    <Code2 size={80} />
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    {p.link && (
                      <a href={p.link} className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-md transition-all">
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-white mb-2">{p.title || "Untiled Project"}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {p.technologies?.split(',').map(tag => (
                      <span key={tag} className="text-[10px] font-bold text-violet-400 uppercase tracking-wider">{tag.trim()}</span>
                    ))}
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {aiProject?.displayDescription || p.description}
                  </p>
                  <p className="text-slate-500 text-xs italic">
                    {aiProject?.longDescription}
                  </p>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* ── Experience Section ── */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-white/5">
        <SectionHeading title="History" subtitle="Career Timeline" icon={Briefcase} />
        <div className="space-y-6">
          {data.experience.map((exp, i) => {
            const aiExp = aiData?.experience?.find(ae => ae.index === i);
            return (
              <div key={i} className="relative pl-10 before:absolute before:left-[11px] before:top-0 before:bottom-0 before:w-px before:bg-white/10 last:before:hidden">
                <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-violet-500/20 border border-violet-500/40 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-violet-400" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h4 className="text-lg font-bold text-white">{exp.role}</h4>
                  <span className="text-xs font-semibold text-slate-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">{exp.duration}</span>
                </div>
                <p className="text-violet-400 font-medium text-sm mb-3">{exp.company}</p>
                <div className="text-slate-400 text-sm leading-relaxed max-w-4xl space-y-2">
                  {exp.description?.split('\n').map((line, j) => (
                    <p key={j}>{line}</p>
                  ))}
                  {aiExp?.achievement && (
                    <p className="text-emerald-400/80 font-medium mt-2 flex items-center gap-2">
                      <Zap size={14} className="fill-emerald-400/30" /> {aiExp.achievement}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Education & Certs ── */}
      <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/5">
        <div>
          <SectionHeading title="Academic" subtitle="Education" icon={GraduationCap} />
          <div className="space-y-8">
            <div className="glass-dark p-6 rounded-2xl border border-white/5">
              <h4 className="text-white font-bold mb-1">{data.education.college}</h4>
              <p className="text-violet-400 text-sm mb-3">{data.education.degree} · {data.education.specialization}</p>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span>Class of {data.education.year}</span>
                <span>CGPA: {data.education.cgpa}</span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <SectionHeading title="Learning" subtitle="Certifications" icon={Award} />
          <div className="space-y-4">
            {data.certifications.map((c, i) => (
              <div key={i} className="flex items-center gap-4 glass-dark p-4 rounded-xl border border-white/5 group hover:border-violet-500/20 transition-all">
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">
                  <Award size={20} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">{c.name}</h4>
                  <p className="text-slate-500 text-xs">{c.platform} · {c.year}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer / Contact ── */}
      <footer className="max-w-6xl mx-auto px-6 py-20 border-t border-white/5 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Let's Connect</h2>
        <p className="text-slate-400 mb-10 max-w-xl mx-auto">Interested in working together or just want to say hi? Feel free to reach out through any of these platforms!</p>
        <div className="flex justify-center gap-6 mb-12">
          {data.personal.github && (
            <a href={data.personal.github} className="w-14 h-14 rounded-2xl glass-dark border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-violet-500/40 hover:-translate-y-1 transition-all"><Code2 /></a>
          )}
          {data.personal.linkedin && (
            <a href={data.personal.linkedin} className="w-14 h-14 rounded-2xl glass-dark border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-violet-500/40 hover:-translate-y-1 transition-all"><Link2 /></a>
          )}
          {data.personal.email && (
            <a href={`mailto:${data.personal.email}`} className="w-14 h-14 rounded-2xl glass-dark border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-violet-500/40 hover:-translate-y-1 transition-all"><Mail /></a>
          )}
        </div>
        <p className="text-slate-600 text-sm">© {new Date().getFullYear()} {name}. Built with AI Resume & Portfolio Builder.</p>
      </footer>

      {/* ── Toast Notifications ── */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl border glass-dark shadow-2xl animate-fade-up ${
          toast.type === 'success' ? 'border-emerald-500/40 text-emerald-300' :
          toast.type === 'error'   ? 'border-red-500/40 text-red-300' :
          toast.type === 'warning' ? 'border-amber-500/40 text-amber-300' :
                                     'border-violet-500/40 text-violet-300'
        }`}>
          {toast.type === 'loading' ? <Loader2 size={18} className="animate-spin" /> :
           toast.type === 'success' ? <CheckCircle2 size={18} /> :
           toast.type === 'warning' ? <AlertCircle size={18} /> :
                                      <AlertCircle size={18} />}
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
