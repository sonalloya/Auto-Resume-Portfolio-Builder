import { Star, Users, FileCheck } from "lucide-react";

const templates = [
  {
    id: "professional",
    name: "Executive Pro",
    tag: "Corporate",
    accent: "from-blue-700 to-blue-900",
    tagColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    lines: [100, 80, 65, 90, 55, 70],
  },
  {
    id: "modern",
    name: "Creative Spark",
    tag: "Design & Art",
    accent: "from-violet-500 to-indigo-500",
    tagColor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    lines: [90, 100, 60, 75, 85, 50],
  },
  {
    id: "minimal",
    name: "Tech Stack",
    tag: "Engineering",
    accent: "from-emerald-500 to-teal-500",
    tagColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    lines: [85, 70, 95, 60, 88, 72],
  },
];

function TemplateCard({ name, tag, accent, tagColor, lines, delay, onUse }) {
  return (
    <div
      onClick={onUse}
      className="animate-fade-up group glass rounded-2xl overflow-hidden transition-all duration-400 hover:-translate-y-3 hover:shadow-[0_20px_60px_rgba(139,92,246,0.2)] cursor-pointer"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Preview area */}
      <div className={`h-44 bg-gradient-to-br ${accent} opacity-80 relative overflow-hidden p-5`}>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 70% 30%, white 1px, transparent 1px)", backgroundSize: "20px 20px" }}
        />
        {/* Mini resume lines */}
        <div className="glass rounded-xl p-4 h-full flex flex-col gap-2">
          <div className="w-10 h-10 rounded-xl bg-white/30 mb-1" />
          {lines.map((w, i) => (
            <div key={i} className="h-1.5 rounded-full bg-white/40" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>

      {/* Meta */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold">{name}</h3>
          <span className={`text-xs px-2.5 py-1 rounded-full border ${tagColor}`}>{tag}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1"><Star size={11} className="text-yellow-400 fill-yellow-400" /> 4.9</span>
          <span className="flex items-center gap-1"><Users size={11} /> 12K uses</span>
          <span className="flex items-center gap-1"><FileCheck size={11} /> ATS Ready</span>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onUse(); }}
          className={`mt-4 w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r ${accent} opacity-90 hover:opacity-100 transition-opacity`}
        >
          Use Template
        </button>
      </div>
    </div>
  );
}

export default function Templates({ onSelectTemplate }) {
  return (
    <section id="templates" className="py-28 px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase glass text-indigo-300 mb-5">
            ✦ Templates
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Professionally Designed{" "}
            <span className="gradient-text">Templates</span>
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto text-base md:text-lg">
            Choose from 50+ industry-specific templates crafted to impress
            recruiters.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((t, i) => (
            <TemplateCard 
              key={t.name} 
              {...t} 
              delay={i * 0.12} 
              onUse={() => onSelectTemplate?.(t.id)}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <button 
            onClick={() => onSelectTemplate?.("modern")}
            className="btn-outline px-10 py-3.5"
          >
            Browse All 50+ Templates →
          </button>
        </div>
      </div>
    </section>
  );
}
