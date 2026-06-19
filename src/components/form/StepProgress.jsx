import { Check } from "lucide-react";

const STEP_LABELS = [
  "Personal",
  "Education",
  "Skills",
  "Projects",
  "Experience",
  "Certifications",
];

export default function StepProgress({ current }) {
  const total = STEP_LABELS.length;
  const pct = Math.round(((current) / total) * 100);

  return (
    <div className="w-full mb-8 select-none">
      {/* Step label + percentage */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-white">
          Step{" "}
          <span className="gradient-text">
            {current + 1} / {total}
          </span>{" "}
          —{" "}
          <span className="text-slate-300">{STEP_LABELS[current]}</span>
        </p>
        <span className="text-xs font-bold text-violet-400">{pct}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-pink-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Step dots */}
      <div className="flex justify-between mt-4">
        {STEP_LABELS.map((label, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <div key={label} className="flex flex-col items-center gap-1.5 flex-1">
              {/* Connector line */}
              <div className="relative flex items-center w-full">
                {/* Left line */}
                <div
                  className={`flex-1 h-px transition-all duration-500 ${
                    i === 0 ? "invisible" : done || active ? "bg-violet-500" : "bg-white/10"
                  }`}
                />
                {/* Circle */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border-2 transition-all duration-300 z-10 ${
                    done
                      ? "bg-violet-500 border-violet-500 scale-90"
                      : active
                      ? "bg-violet-600 border-violet-400 scale-110 shadow-[0_0_16px_rgba(139,92,246,0.6)]"
                      : "bg-white/5 border-white/15 text-slate-500"
                  }`}
                >
                  {done ? (
                    <Check size={12} strokeWidth={3} className="text-white" />
                  ) : (
                    <span className={active ? "text-white" : "text-slate-500"}>
                      {i + 1}
                    </span>
                  )}
                </div>
                {/* Right line */}
                <div
                  className={`flex-1 h-px transition-all duration-500 ${
                    i === total - 1 ? "invisible" : done ? "bg-violet-500" : "bg-white/10"
                  }`}
                />
              </div>
              {/* Label (hidden on small screens) */}
              <span
                className={`hidden sm:block text-[10px] font-medium tracking-wide transition-colors duration-300 ${
                  active ? "text-violet-300" : done ? "text-slate-400" : "text-slate-600"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
