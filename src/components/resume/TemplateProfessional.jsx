/* ─────────────────────────────────────────────────────────────────────
   Template: PROFESSIONAL
   Classic single-column, navy blue accents, bold section headers
   Traditional ATS-optimised corporate resume style
───────────────────────────────────────────────────────────────────── */

function SectionTitle({ children }) {
  return (
    <div className="mt-5 mb-2 first:mt-0">
      <h2 className="text-[12px] font-extrabold uppercase tracking-[0.15em] text-[#1e3a5f] pb-1 border-b-2 border-[#1e3a5f]">
        {children}
      </h2>
    </div>
  );
}

function splitList(str) {
  if (!str) return [];
  
  // Fix for doubled string glitch
  let cleanStr = str;
  if (str.length > 0 && str.length % 2 === 0) {
    const half = str.length / 2;
    if (str.slice(0, half) === str.slice(half)) {
      cleanStr = str.slice(0, half);
    }
  }

  const items = cleanStr.split(/[,;\n]+/).map((s) => s.trim()).filter(Boolean);
  return [...new Set(items)];
}

export default function TemplateProfessional({ data }) {
  const { personal, education, skills, projects, experience, certifications } = data;
  const name = personal.fullName || "Your Name";

  return (
    <div className="bg-white text-gray-800 font-sans text-[12px] leading-relaxed px-10 py-10 min-h-[1056px]">

      {/* ── HEADER ── */}
      <div className="mb-5">
        <h1 className="text-[28px] font-black tracking-tight text-[#1e3a5f] uppercase leading-none">
          {name}
        </h1>
        {education.degree && (
          <p className="text-[#1e3a5f] font-semibold text-[12px] mt-0.5 opacity-70">
            {education.degree}{education.specialization ? ` | ${education.specialization}` : ""}
          </p>
        )}
        <div className="flex flex-wrap gap-x-6 gap-y-0.5 text-[11px] text-gray-600 mt-2">
          {personal.email    && <span>Email: {personal.email}</span>}
          {personal.phone    && <span>Phone: {personal.phone}</span>}
          {personal.address  && <span>Location: {personal.address}</span>}
          {personal.linkedin && <span>LinkedIn: {personal.linkedin.replace(/^https?:\/\//, "")}</span>}
          {personal.github   && <span>GitHub: {personal.github.replace(/^https?:\/\//, "")}</span>}
        </div>
      </div>

      {/* ── AI: Professional Summary ── */}
      {data.summary && (
        <>
          <SectionTitle>Professional Summary</SectionTitle>
          <p className="text-gray-700 text-[11px] leading-relaxed italic">{data.summary}</p>
        </>
      )}

      {/* ── AI: Career Objective ── */}
      {data.objective && (
        <>
          <SectionTitle>Career Objective</SectionTitle>
          <p className="text-gray-700 text-[11px] leading-relaxed">{data.objective}</p>
        </>
      )}

      {/* ── AI: ATS Keywords ── */}
      {data.atsKeywords?.length > 0 && (
        <>
          <SectionTitle>Core Competencies</SectionTitle>
          <p className="text-[11px] text-gray-700">
            {data.atsKeywords.join(" · ")}
          </p>
        </>
      )}

      {/* ── EXPERIENCE ── */}
      {experience.some((e) => e.company) && (
        <>
          <SectionTitle>Professional Experience</SectionTitle>
          <div className="space-y-4">
            {experience.filter((e) => e.company).map((e, i) => (
              <div key={i}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-gray-900 text-[13px]">{e.role}</p>
                    <p className="text-[#1e3a5f] font-semibold text-[11px]">{e.company}</p>
                  </div>
                  {e.duration && (
                    <span className="text-[11px] text-gray-500 whitespace-nowrap ml-3 font-medium">
                      {e.duration}
                    </span>
                  )}
                </div>
                {e.description && (
                  <ul className="mt-1.5 ml-4 list-disc space-y-0.5">
                    {e.description.split("\n").filter(Boolean).map((line, j) => (
                      <li key={j} className="text-gray-700 text-[11px]">
                        {line.replace(/^[-•*]\s*/, "")}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── PROJECTS ── */}
      {projects.some((p) => p.title) && (
        <>
          <SectionTitle>Projects</SectionTitle>
          <div className="space-y-3">
            {projects.filter((p) => p.title).map((p, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <p className="font-bold text-gray-900">{p.title}</p>
                  {p.link && (
                    <span className="text-[10px] text-[#1e3a5f] ml-3">
                      {p.link.replace(/^https?:\/\//, "").slice(0, 38)}
                    </span>
                  )}
                </div>
                {p.technologies && (
                  <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                    Technologies: {p.technologies}
                  </p>
                )}
                {p.description && (
                  <p className="text-gray-700 text-[11px] mt-1 leading-relaxed">{p.description}</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── EDUCATION ── */}
      {education.college && (
        <>
          <SectionTitle>Education</SectionTitle>
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold text-gray-900 text-[13px]">{education.college}</p>
              <p className="text-[#1e3a5f] text-[11px] font-medium">
                {education.degree}{education.specialization && ` in ${education.specialization}`}
              </p>
              {education.cgpa && <p className="text-gray-500 text-[11px]">CGPA / Score: {education.cgpa}</p>}
            </div>
            {education.year && (
              <span className="text-[11px] text-gray-500 whitespace-nowrap ml-3 font-medium">
                {education.year}
              </span>
            )}
          </div>
        </>
      )}

      {/* ── SKILLS ── */}
      {(skills.technical || skills.languages || skills.tools || skills.soft) && (
        <>
          <SectionTitle>Skills</SectionTitle>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1.5">
            {skills.technical && (
              <div>
                <p className="text-[11px] font-bold text-gray-700 mb-0.5">Technical Skills</p>
                <p className="text-[11px] text-gray-600">{splitList(skills.technical).join(", ")}</p>
              </div>
            )}
            {skills.languages && (
              <div>
                <p className="text-[11px] font-bold text-gray-700 mb-0.5">Programming Languages</p>
                <p className="text-[11px] text-gray-600">{splitList(skills.languages).join(", ")}</p>
              </div>
            )}
            {skills.tools && (
              <div>
                <p className="text-[11px] font-bold text-gray-700 mb-0.5">Tools & Technologies</p>
                <p className="text-[11px] text-gray-600">{splitList(skills.tools).join(", ")}</p>
              </div>
            )}
            {skills.soft && (
              <div>
                <p className="text-[11px] font-bold text-gray-700 mb-0.5">Soft Skills</p>
                <p className="text-[11px] text-gray-600">{splitList(skills.soft).join(", ")}</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── CERTIFICATIONS ── */}
      {certifications.some((c) => c.name) && (
        <>
          <SectionTitle>Certifications</SectionTitle>
          <div className="space-y-1">
            {certifications.filter((c) => c.name).map((c, i) => (
              <div key={i} className="flex justify-between items-baseline">
                <p className="text-[11px] text-gray-800 font-semibold">{c.name}</p>
                <span className="text-[10px] text-gray-500 ml-3">
                  {c.platform}{c.year && ` · ${c.year}`}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
