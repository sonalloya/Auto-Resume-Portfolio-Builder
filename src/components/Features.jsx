import { FileText, Layers, ShieldCheck, Download } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "AI Resume Generation",
    description:
      "Craft perfectly tailored, ATS-optimized resumes in seconds. Our AI analyzes job descriptions and highlights the most impactful keywords.",
    gradient: "from-violet-500/20 to-indigo-500/10",
    iconColor: "text-violet-400",
    glow: "hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]",
    badge: "Most Popular",
  },
  {
    icon: Layers,
    title: "Portfolio Builder",
    description:
      "Stunning, responsive portfolio websites generated from your profile in minutes — no design skills required.",
    gradient: "from-indigo-500/20 to-blue-500/10",
    iconColor: "text-indigo-400",
    glow: "hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]",
    badge: null,
  },
  {
    icon: ShieldCheck,
    title: "ATS Optimization",
    description:
      "Real-time ATS score analysis ensures your resume passes automated screening filters and lands in front of human recruiters.",
    gradient: "from-pink-500/20 to-rose-500/10",
    iconColor: "text-pink-400",
    glow: "hover:shadow-[0_0_30px_rgba(236,72,153,0.2)]",
    badge: null,
  },
  {
    icon: Download,
    title: "PDF Export",
    description:
      "One-click export to pixel-perfect PDFs, shareable links, and web-ready portfolios — compatible with every major platform.",
    gradient: "from-emerald-500/20 to-teal-500/10",
    iconColor: "text-emerald-400",
    glow: "hover:shadow-[0_0_30px_rgba(52,211,153,0.2)]",
    badge: null,
  },
];

export default function Features() {
  return (
    <section id="features" className="py-28 px-6 relative">
      {/* Section background accent */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-violet-600/5 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase glass text-violet-300 mb-5">
            ✦ Core Features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Everything You Need to{" "}
            <span className="gradient-text">Land Your Dream Job</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-base md:text-lg">
            Powered by the latest AI models, our tools help you stand out in a
            competitive job market.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, description, gradient, iconColor, glow, badge }, i) => (
            <div
              key={title}
              style={{ animationDelay: `${i * 0.12}s` }}
              className={`animate-fade-up group relative glass rounded-2xl p-6 transition-all duration-400 cursor-default ${glow} hover:-translate-y-2`}
            >
              {/* Top gradient fill */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-400`} />

              {badge && (
                <span className="relative z-10 absolute top-4 right-4 px-2.5 py-1 rounded-full bg-violet-500/30 text-violet-300 text-[10px] font-bold tracking-wider uppercase border border-violet-500/30">
                  {badge}
                </span>
              )}

              <div className={`relative z-10 w-12 h-12 rounded-xl glass flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={22} className={iconColor} />
              </div>

              <h3 className="relative z-10 text-white font-semibold text-lg mb-2 group-hover:gradient-text">
                {title}
              </h3>
              <p className="relative z-10 text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
