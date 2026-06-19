import { Plus, Trash2, Building2 } from "lucide-react";
import FormInput from "./FormInput";
import FormTextarea from "./FormTextarea";

const EMPTY_EXP = { company: "", role: "", duration: "", description: "" };

export default function StepExperience({ data, onChange, errors }) {
  const add = () => onChange([...data, { ...EMPTY_EXP }]);
  const remove = (i) => onChange(data.filter((_, idx) => idx !== i));
  const update = (i, field, value) =>
    onChange(data.map((e, idx) => (idx === i ? { ...e, [field]: value } : e)));

  return (
    <div className="space-y-6">
      {data.map((exp, i) => (
        <div
          key={i}
          className="relative glass rounded-2xl p-5 space-y-4 border border-white/8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500/30 to-blue-500/20 flex items-center justify-center">
                <Building2 size={13} className="text-indigo-400" />
              </div>
              <span className="text-sm font-semibold text-slate-300">
                Experience {i + 1}
              </span>
            </div>
            {data.length > 1 && (
              <button
                onClick={() => remove(i)}
                className="text-slate-500 hover:text-pink-400 transition-colors p-1 rounded-lg hover:bg-pink-500/10"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Company Name"
              name="company"
              value={exp.company}
              onChange={(e) => update(i, "company", e.target.value)}
              placeholder="Google, Microsoft, Startup…"
              error={errors[`exp_${i}_company`]}
              required
            />
            <FormInput
              label="Role / Position"
              name="role"
              value={exp.role}
              onChange={(e) => update(i, "role", e.target.value)}
              placeholder="Software Engineer, SDE Intern…"
              error={errors[`exp_${i}_role`]}
              required
            />
          </div>

          <FormInput
            label="Duration"
            name="duration"
            value={exp.duration}
            onChange={(e) => update(i, "duration", e.target.value)}
            placeholder="Jun 2023 – Aug 2023 (3 months)"
            error={errors[`exp_${i}_duration`]}
            required
          />

          <FormTextarea
            label="Work Description"
            name="description"
            value={exp.description}
            onChange={(e) => update(i, "description", e.target.value)}
            placeholder="Describe your responsibilities, achievements, and impact (use bullet points)…"
            error={errors[`exp_${i}_description`]}
            required
            rows={3}
          />
        </div>
      ))}

      <button
        onClick={add}
        className="w-full py-3 rounded-2xl border border-dashed border-indigo-500/40 text-indigo-400 text-sm font-medium hover:bg-indigo-500/8 hover:border-indigo-500/70 transition-all duration-200 flex items-center justify-center gap-2"
      >
        <Plus size={16} />
        Add Another Experience
      </button>
    </div>
  );
}
