import { Plus, Trash2, FolderOpen, Link } from "lucide-react";
import FormInput from "./FormInput";
import FormTextarea from "./FormTextarea";

const EMPTY_PROJECT = { title: "", description: "", technologies: "", link: "" };

export default function StepProjects({ data, onChange, errors }) {
  const add = () => onChange([...data, { ...EMPTY_PROJECT }]);

  const remove = (i) => onChange(data.filter((_, idx) => idx !== i));

  const update = (i, field, value) => {
    const updated = data.map((p, idx) =>
      idx === i ? { ...p, [field]: value } : p
    );
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      {data.map((project, i) => (
        <div
          key={i}
          className="relative glass rounded-2xl p-5 space-y-4 border border-white/8 group"
        >
          {/* Card header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500/30 to-indigo-500/20 flex items-center justify-center">
                <FolderOpen size={13} className="text-violet-400" />
              </div>
              <span className="text-sm font-semibold text-slate-300">
                Project {i + 1}
              </span>
            </div>
            {data.length > 1 && (
              <button
                onClick={() => remove(i)}
                className="text-slate-500 hover:text-pink-400 transition-colors p-1 rounded-lg hover:bg-pink-500/10"
                title="Remove project"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Project Title"
              name="title"
              value={project.title}
              onChange={(e) => update(i, "title", e.target.value)}
              placeholder="E-commerce Platform"
              error={errors[`proj_${i}_title`]}
              required
            />
            <FormInput
              label="Project Link"
              name="link"
              type="url"
              value={project.link}
              onChange={(e) => update(i, "link", e.target.value)}
              placeholder="https://github.com/..."
              icon={Link}
            />
          </div>

          <FormInput
            label="Technologies Used"
            name="technologies"
            value={project.technologies}
            onChange={(e) => update(i, "technologies", e.target.value)}
            placeholder="React, Node.js, MongoDB, Tailwind CSS"
            error={errors[`proj_${i}_technologies`]}
            required
          />

          <FormTextarea
            label="Project Description"
            name="description"
            value={project.description}
            onChange={(e) => update(i, "description", e.target.value)}
            placeholder="Describe what you built, the problem it solves, and your key contributions…"
            error={errors[`proj_${i}_description`]}
            required
            rows={3}
          />
        </div>
      ))}

      <button
        onClick={add}
        className="w-full py-3 rounded-2xl border border-dashed border-violet-500/40 text-violet-400 text-sm font-medium hover:bg-violet-500/8 hover:border-violet-500/70 transition-all duration-200 flex items-center justify-center gap-2"
      >
        <Plus size={16} />
        Add Another Project
      </button>
    </div>
  );
}
