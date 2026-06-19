import { ArrowRight, Zap, Star, TrendingUp } from "lucide-react";

/* ── Floating stat badge ─────────────────────────────────────── */
function StatBadge({ icon: Icon, label, value, className }) {
  return (
    <div className={`glass rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl ${className}`}>
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/30 to-indigo-500/20 flex items-center justify-center">
        <Icon size={16} className="text-violet-300" />
      </div>
      <div>
        <p className="text-white font-bold text-sm leading-none">{value}</p>
        <p className="text-slate-400 text-xs mt-0.5">{label}</p>
      </div>
    </div>
  );
}

/* ── Animated resume card illustration ───────────────────────── */
function ResumeCard() {
  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500/30 via-indigo-500/20 to-pink-500/20 blur-2xl animate-pulse-glow" />

      {/* Main card */}
      <div className="relative glass rounded-3xl p-6 shadow-2xl border border-white/10">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
            <div className="w-3 h-3 rounded-full bg-green-400/70" />
          </div>
          <span className="text-xs text-violet-400 font-medium glass px-3 py-1 rounded-full">
            ✦ AI Generated
          </span>
        </div>

        {/* Avatar row */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 animate-pulse-glow flex items-center justify-center text-white font-bold text-xl shadow-lg">
            JD
          </div>
          <div>
            <div className="h-3 w-28 bg-gradient-to-r from-violet-400 to-indigo-400 rounded-full mb-2" />
            <div className="h-2.5 w-20 bg-white/20 rounded-full" />
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {["React", "Node.js", "TypeScript", "AI/ML", "Python"].map((s) => (
            <span
              key={s}
              className="text-xs px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Content lines */}
        <div className="space-y-3">
          {[100, 85, 70, 90].map((w, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
              <div
                className="h-2 rounded-full bg-gradient-to-r from-white/25 to-white/10"
                style={{ width: `${w}%` }}
              />
            </div>
          ))}
        </div>

        {/* ATS Score bar */}
        <div className="mt-5 glass rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">ATS Match Score</span>
            <span className="text-xs font-bold text-emerald-400">94%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"
              style={{ width: "94%" }}
            />
          </div>
        </div>
      </div>

      {/* Floating badges */}
      <StatBadge
        icon={Star}
        label="Avg. User Rating"
        value="4.9 ★"
        className="absolute -top-5 -right-4 animate-float-slow"
      />
      <StatBadge
        icon={TrendingUp}
        label="Interviews Secured"
        value="50K+"
        className="absolute -bottom-5 -left-4 animate-float-mid"
      />
    </div>
  );
}

/* ── Hero ──────────────────────────────────────────────────────── */
export default function Hero({ onGenerate, onBuildPortfolio }) {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-24 pb-16 px-6 overflow-hidden"
    >
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-violet-600/15 blur-3xl animate-float-slow" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-600/12 blur-3xl animate-float-mid" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-pink-600/8 blur-3xl animate-pulse-glow" />

        {/* Spinning ring */}
        <div className="absolute top-24 right-16 w-56 h-56 rounded-full border border-violet-500/15 animate-spin-slow" />
        <div className="absolute top-32 right-24 w-36 h-36 rounded-full border border-indigo-500/10 animate-spin-slow" style={{ animationDirection: "reverse" }} />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left — copy */}
        <div className="text-center lg:text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-xs font-medium text-violet-300 mb-7 animate-fade-up border border-violet-500/20">
            <Zap size={12} className="fill-violet-400 text-violet-400" />
            Powered by Google Gemini AI
          </div>

          {/* Heading */}
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.12] tracking-tight mb-6 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            Build{" "}
            <span className="gradient-text">Professional</span>{" "}
            AI-Powered{" "}
            <br className="hidden sm:block" />
            Resumes &amp; Portfolios
          </h1>

          {/* Sub */}
          <p
            className="text-slate-400 text-base md:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0 mb-10 animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            Generate ATS-friendly resumes and stunning portfolios{" "}
            <strong className="text-slate-300 font-medium">instantly</strong> using
            AI — tailored for your industry, optimized for every applicant
            tracking system.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            <button onClick={onGenerate} className="btn-primary flex items-center justify-center gap-2 px-8 py-4 text-base">
              <span className="relative z-10">✦ Generate Resume</span>
              <ArrowRight size={17} className="relative z-10" />
            </button>
            <button onClick={onBuildPortfolio} className="btn-outline flex items-center justify-center gap-2 px-8 py-4 text-base">
              Build Portfolio
            </button>
          </div>

          {/* Trust row */}
          <div
            className="mt-10 flex items-center gap-6 justify-center lg:justify-start animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex -space-x-2">
              {["#7c3aed", "#6366f1", "#ec4899", "#10b981"].map((c, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-[#0a0a1a] flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: c }}
                >
                  {["A","B","C","D"][i]}
                </div>
              ))}
            </div>
            <p className="text-slate-400 text-sm">
              <strong className="text-white">50,000+</strong> professionals hired
            </p>
          </div>
        </div>

        {/* Right — illustration */}
        <div
          className="hidden lg:flex justify-center animate-fade-up"
          style={{ animationDelay: "0.25s" }}
        >
          <ResumeCard />
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a1a] to-transparent pointer-events-none" />
    </section>
  );
}
