import { Code2, MessageSquare, Terminal, Wrench } from "lucide-react";
import FormTextarea from "./FormTextarea";

export default function StepSkills({ data, onChange, errors }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormTextarea
          label="Technical Skills"
          name="technical"
          value={data.technical}
          onChange={onChange}
          placeholder="React, Node.js, REST APIs, SQL…"
          error={errors.technical}
          required
          rows={3}
          icon={Code2}
        />
        <FormTextarea
          label="Soft Skills"
          name="soft"
          value={data.soft}
          onChange={onChange}
          placeholder="Leadership, Communication, Problem Solving…"
          error={errors.soft}
          rows={3}
          icon={MessageSquare}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormTextarea
          label="Programming Languages"
          name="languages"
          value={data.languages}
          onChange={onChange}
          placeholder="JavaScript, Python, Java, C++…"
          error={errors.languages}
          required
          rows={3}
          icon={Terminal}
        />
        <FormTextarea
          label="Tools & Technologies"
          name="tools"
          value={data.tools}
          onChange={onChange}
          placeholder="Git, Docker, AWS, Figma, VS Code…"
          error={errors.tools}
          rows={3}
          icon={Wrench}
        />
      </div>

      {/* Hint chips */}
      <div className="flex flex-wrap gap-2 pt-1">
        {["React", "Node.js", "Python", "AWS", "Docker", "Git", "TypeScript", "SQL"].map((chip) => (
          <span
            key={chip}
            className="px-3 py-1 rounded-full bg-violet-500/15 text-violet-300 text-xs border border-violet-500/25 cursor-default"
          >
            {chip}
          </span>
        ))}
        <span className="text-xs text-slate-500 self-center ml-1">Popular skills ↑</span>
      </div>
    </div>
  );
}
