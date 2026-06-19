import { Plus, Trash2, Medal } from "lucide-react";
import FormInput from "./FormInput";

const EMPTY_CERT = { name: "", platform: "", year: "" };

export default function StepCertifications({ data, onChange, errors }) {
  const add = () => onChange([...data, { ...EMPTY_CERT }]);
  const remove = (i) => onChange(data.filter((_, idx) => idx !== i));
  const update = (i, field, value) =>
    onChange(data.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)));

  return (
    <div className="space-y-6">
      {data.map((cert, i) => (
        <div
          key={i}
          className="relative glass rounded-2xl p-5 space-y-4 border border-white/8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500/30 to-teal-500/20 flex items-center justify-center">
                <Medal size={13} className="text-emerald-400" />
              </div>
              <span className="text-sm font-semibold text-slate-300">
                Certification {i + 1}
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
              label="Certification Name"
              name="name"
              value={cert.name}
              onChange={(e) => update(i, "name", e.target.value)}
              placeholder="AWS Solutions Architect"
              error={errors[`cert_${i}_name`]}
              required
            />
            <FormInput
              label="Platform / Issuer"
              name="platform"
              value={cert.platform}
              onChange={(e) => update(i, "platform", e.target.value)}
              placeholder="Coursera, Udemy, AWS, Google…"
              error={errors[`cert_${i}_platform`]}
              required
            />
          </div>

          <FormInput
            label="Completion Year"
            name="year"
            type="number"
            value={cert.year}
            onChange={(e) => update(i, "year", e.target.value)}
            placeholder="2024"
            error={errors[`cert_${i}_year`]}
            required
          />
        </div>
      ))}

      <button
        onClick={add}
        className="w-full py-3 rounded-2xl border border-dashed border-emerald-500/40 text-emerald-400 text-sm font-medium hover:bg-emerald-500/8 hover:border-emerald-500/70 transition-all duration-200 flex items-center justify-center gap-2"
      >
        <Plus size={16} />
        Add Another Certification
      </button>
    </div>
  );
}
