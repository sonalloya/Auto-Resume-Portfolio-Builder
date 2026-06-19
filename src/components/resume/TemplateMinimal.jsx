/* ─────────────────────────────────────────────────────────────────────
   Template: MINIMAL
   Single-column, centered header, maximum whitespace, light gray dividers
───────────────────────────────────────────────────────────────────── */

function Divider() {
  return <hr className="border-t border-gray-200 my-3" />;
}

function SectionTitle({ children }) {
  return (
    <h2 className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400 mb-2.5">
      {children}
    </h2>
  );
}

function splitList(str) {
  if (!str) return [];
  
  // Fix for doubled string glitch (e.g. "ReactReact")
  let cleanStr = str;
  if (str.length > 0 && str.length % 2 === 0) {
    const half = str.length / 2;
    if (str.slice(0, half) === str.slice(half)) {
      cleanStr = str.slice(0, half);
    }
  }
  
  const items = cleanStr.split(/[,;\n]+/).map((s) => s.trim()).filter(Boolean);
  return [...new Set(items)]; // Remove duplicate items
}

export default function TemplateMinimal({ data }) {
  const { personal, education, skills, projects, experience, certifications } = data;
  const name = personal.fullName || "Your Name";

  return (
    <div className="bg-white text-gray-800 font-sans text-[12px] leading-relaxed px-14 py-12 min-h-[1056px]">

      {/* ── HEADER ── */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-extralight tracking-[0.08em] text-gray-900 mb-1">{name}</h1>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-0.5 text-[11px] text-gray-500 mt-2">
          {personal.email    && <span>{personal.email}</span>}
          {personal.phone    && <span>·</span>}
          {personal.phone    && <span>{personal.phone}</span>}
          {personal.address  && <span>·</span>}
          {personal.address  && <span>{personal.address}</span>}
        </div>
        {(personal.linkedin || personal.github) && (
          <div className="flex flex-wrap justify-center gap-x-4 text-[10px] text-gray-400 mt-1">
            {personal.linkedin && <span>{personal.linkedin.replace(/^https?:\/\//, "")}</span>}
            {personal.github   && <span>{personal.github.replace(/^https?:\/\//, "")}</span>}
          </div>
        )}
      </div>

      <Divider />

      {/* ── AI: Professional Summary ── */}
      {data.summary && (
        <>
          <SectionTitle>Professional Summary</SectionTitle>
          <p className="text-gray-600 text-[11px] leading-relaxed italic mb-1">{data.summary}</p>
          <Divider />
        </>
      )}

      {/* ── AI: Career Objective ── */}
      {data.objective && (
        <>
          <SectionTitle>Career Objective</SectionTitle>
          <p className="text-gray-600 text-[11px] leading-relaxed mb-1">{data.objective}</p>
          <Divider />
        </>
      )}

      {/* ── EXPERIENCE ── */}
      {experience.some((e) => e.company) && (
        <>
          <SectionTitle>Experience</SectionTitle>
          <div className="space-y-4 mb-1">
            {experience.filter((e) => e.company).map((e, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <p className="font-semibold text-gray-900">{e.role} <span className="text-gray-400 font-normal">at</span> {e.company}</p>
                  {e.duration && <span className="text-[10px] text-gray-400 whitespace-nowrap ml-3">{e.duration}</span>}
                </div>
                {e.description && (
                  <ul className="mt-1 space-y-0.5">
                    {e.description.split("\n").filter(Boolean).map((line, j) => (
                      <li key={j} className="flex gap-2 text-gray-600 text-[11px]">
                        <span className="text-gray-300 shrink-0">—</span>
                        <span>{line.replace(/^[-•*]\s*/, "")}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
          <Divider />
        </>
      )}

      {/* ── PROJECTS ── */}
      {projects.some((p) => p.title) && (
        <>
          <SectionTitle>Projects</SectionTitle>
          <div className="space-y-3 mb-1">
            {projects.filter((p) => p.title).map((p, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <p className="font-semibold text-gray-900">{p.title}</p>
                  {p.link && (
                    <span className="text-[10px] text-gray-400 ml-3">
                      {p.link.replace(/^https?:\/\//, "").slice(0, 32)}
                    </span>
                  )}
                </div>
                {p.technologies && (
                  <p className="text-[10px] text-gray-400 italic mt-0.5">{p.technologies}</p>
                )}
                {p.description && (
                  <p className="text-gray-600 text-[11px] mt-1 leading-relaxed">{p.description}</p>
                )}
              </div>
            ))}
          </div>
          <Divider />
        </>
      )}

      {/* ── EDUCATION ── */}
      {education.college && (
        <>
          <SectionTitle>Education</SectionTitle>
          <div className="flex justify-between items-baseline mb-1">
            <div>
              <p className="font-semibold text-gray-900">{education.college}</p>
              <p className="text-gray-500 text-[11px]">
                {education.degree}{education.specialization && `, ${education.specialization}`}
                {education.cgpa && ` · CGPA ${education.cgpa}`}
              </p>
            </div>
            {education.year && <span className="text-[10px] text-gray-400">{education.year}</span>}
          </div>
          <Divider />
        </>
      )}

      {/* ── SKILLS ── */}
      {(skills.technical || skills.languages || skills.tools || skills.soft) && (
        <>
          <SectionTitle>Skills</SectionTitle>
          <div className="space-y-1.5 mb-1">
            {skills.technical && (
              <p className="text-[11px] text-gray-600">
                <span className="font-medium text-gray-800">Technical: </span>
                {splitList(skills.technical).join(" · ")}
              </p>
            )}
            {skills.languages && (
              <p className="text-[11px] text-gray-600">
                <span className="font-medium text-gray-800">Languages: </span>
                {splitList(skills.languages).join(" · ")}
              </p>
            )}
            {skills.tools && (
              <p className="text-[11px] text-gray-600">
                <span className="font-medium text-gray-800">Tools: </span>
                {splitList(skills.tools).join(" · ")}
              </p>
            )}
            {skills.soft && (
              <p className="text-[11px] text-gray-600">
                <span className="font-medium text-gray-800">Soft Skills: </span>
                {splitList(skills.soft).join(" · ")}
              </p>
            )}
          </div>
          <Divider />
        </>
      )}

      {/* ── CERTIFICATIONS ── */}
      {certifications.some((c) => c.name) && (
        <>
          <SectionTitle>Certifications</SectionTitle>
          <div className="space-y-1">
            {certifications.filter((c) => c.name).map((c, i) => (
              <div key={i} className="flex justify-between items-baseline">
                <p className="text-[11px] text-gray-700">{c.name} <span className="text-gray-400">· {c.platform}</span></p>
                {c.year && <span className="text-[10px] text-gray-400">{c.year}</span>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
