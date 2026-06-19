/* ─────────────────────────────────────────────────────────────────────
   Template: MODERN
   Two-column layout — left sidebar (contact + skills) + right main body
   Accent: violet / indigo
───────────────────────────────────────────────────────────────────── */

function Tag({ children }) {
  return (
    <span 
      className="inline-block px-2 py-0.5 text-[10px] font-medium rounded-full mr-1 mb-1"
      style={{ backgroundColor: "#f5f3ff", color: "#7c3aed" }}
    >
      {children}
    </span>
  );
}

function SectionTitle({ children }) {
  return (
    <h3 
      className="text-[11px] font-bold uppercase tracking-[0.18em] mb-2 mt-4 first:mt-0"
      style={{ color: "#7c3aed" }}
    >
      {children}
    </h3>
  );
}

function MainTitle({ children }) {
  return (
    <h2 
      className="text-sm font-bold text-gray-800 uppercase tracking-widest pb-1 mb-3 mt-5 first:mt-0"
      style={{ borderBottom: "2px solid #ede9fe" }}
    >
      {children}
    </h2>
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

export default function TemplateModern({ data }) {
  const { personal, education, skills, projects, experience, certifications } = data;
  const name = personal.fullName || "Your Name";
  const hasAI = !!(data.summary || data.objective || data.atsKeywords?.length);

  return (
    <div className="bg-white text-gray-800 font-sans text-[12px] leading-relaxed min-h-[1056px] flex flex-col">

      {/* ── TOP HEADER ── */}
      <div 
        className="text-white px-8 py-6"
        style={{ background: "linear-gradient(to right, #6d28d9, #4f46e5)" }}
      >
        <h1 className="text-3xl font-extrabold tracking-tight leading-none mb-1">{name}</h1>
        {education.degree && (
          <p className="text-sm font-medium mb-3" style={{ color: "#ddd6fe" }}>
            {education.degree}{education.specialization ? ` — ${education.specialization}` : ""}
          </p>
        )}
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-violet-100">
          {personal.email    && <span>✉ {personal.email}</span>}
          {personal.phone    && <span>📞 {personal.phone}</span>}
          {personal.address  && <span>📍 {personal.address}</span>}
          {personal.linkedin && <span>🔗 {personal.linkedin.replace(/^https?:\/\//, "")}</span>}
          {personal.github   && <span>⌨ {personal.github.replace(/^https?:\/\//, "")}</span>}
        </div>
      </div>

      {/* ── BODY — two columns ── */}
      <div className="flex flex-1">

        {/* LEFT SIDEBAR */}
        <div 
          className="w-[34%] px-5 py-5 border-r"
          style={{ backgroundColor: "#f5f3ff", borderRightColor: "#ede9fe" }}
        >

          {/* AI badge */}
          {hasAI && (
            <div 
              className="mb-3 px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider inline-flex items-center gap-1"
              style={{ backgroundColor: "#ddd6fe", color: "#6d28d9" }}
            >
              ✦ AI Enhanced
            </div>
          )}

          {/* Skills */}
          {skills.technical && (
            <>
              <SectionTitle>Technical Skills</SectionTitle>
              <div className="mb-2">
                {splitList(skills.technical).map((s) => <Tag key={s}>{s}</Tag>)}
              </div>
            </>
          )}

          {skills.languages && (
            <>
              <SectionTitle>Languages</SectionTitle>
              <div className="mb-2">
                {splitList(skills.languages).map((s) => <Tag key={s}>{s}</Tag>)}
              </div>
            </>
          )}

          {skills.tools && (
            <>
              <SectionTitle>Tools & Tech</SectionTitle>
              <div className="mb-2">
                {splitList(skills.tools).map((s) => <Tag key={s}>{s}</Tag>)}
              </div>
            </>
          )}

          {skills.soft && (
            <>
              <SectionTitle>Soft Skills</SectionTitle>
              <ul className="space-y-1">
                {splitList(skills.soft).map((s) => (
                  <li key={s} className="flex items-start gap-1.5 text-gray-600 text-[11px]">
                    <span style={{ color: "#8b5cf6" }} className="mt-0.5">▸</span>{s}
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Education */}
          {education.college && (
            <>
              <SectionTitle>Education</SectionTitle>
              <p className="font-semibold text-gray-800 text-[11px]">{education.college}</p>
              <p className="text-gray-600 text-[11px]">{education.degree} {education.specialization && `· ${education.specialization}`}</p>
              {education.cgpa  && <p className="text-gray-500 text-[11px]">CGPA: {education.cgpa}</p>}
              {education.year  && <p className="text-gray-500 text-[11px]">Grad: {education.year}</p>}
            </>
          )}

          {/* Certifications */}
          {certifications.some((c) => c.name) && (
            <>
              <SectionTitle>Certifications</SectionTitle>
              <ul className="space-y-2">
                {certifications.filter((c) => c.name).map((c, i) => (
                  <li key={i}>
                    <p className="font-semibold text-[11px] text-gray-800">{c.name}</p>
                    <p className="text-gray-500 text-[10px]">{c.platform}{c.year && ` · ${c.year}`}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* RIGHT MAIN */}
        <div className="flex-1 px-6 py-5">

          {/* AI: Professional Summary */}
          {data.summary && (
            <>
              <MainTitle>Professional Summary</MainTitle>
              <p className="text-gray-700 text-[11px] leading-relaxed mb-1 italic">
                {data.summary}
              </p>
            </>
          )}

          {/* AI: Career Objective */}
          {data.objective && (
            <>
              <MainTitle>Career Objective</MainTitle>
              <p className="text-gray-700 text-[11px] leading-relaxed mb-1">
                {data.objective}
              </p>
            </>
          )}

          {/* AI: ATS Keywords */}
          {data.atsKeywords?.length > 0 && (
            <>
              <MainTitle>Key Competencies</MainTitle>
              <div className="mb-2">
                {data.atsKeywords.map((kw) => (
                  <span 
                    key={kw} 
                    className="inline-block px-2 py-0.5 border text-[9px] font-medium rounded mr-1 mb-1"
                    style={{ backgroundColor: "#f8fafc", borderColor: "#ede9fe", color: "#4f46e5" }}
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </>
          )}

          {/* Experience */}
          {experience.some((e) => e.company) && (
            <>
              <MainTitle>Work Experience</MainTitle>
              <div className="space-y-4">
                {experience.filter((e) => e.company).map((e, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-gray-800">{e.role}</p>
                        <p className="text-violet-600 font-semibold text-[11px]">{e.company}</p>
                      </div>
                      {e.duration && (
                        <span 
                          className="text-[10px] whitespace-nowrap ml-2 mt-0.5 px-2 py-0.5 rounded-full"
                          style={{ color: "#6b7280", backgroundColor: "#f5f3ff" }}
                        >
                          {e.duration}
                        </span>
                      )}
                    </div>
                    {e.description && (
                      <ul className="mt-1.5 space-y-0.5">
                        {e.description.split("\n").filter(Boolean).map((line, j) => (
                          <li key={j} className="flex gap-2 text-gray-600 text-[11px]">
                            <span style={{ color: "#ddd6fe" }} className="shrink-0 mt-0.5">•</span>
                            <span>{line.replace(/^[-•*]\s*/, "")}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Projects */}
          {projects.some((p) => p.title) && (
            <>
              <MainTitle>Projects</MainTitle>
              <div className="space-y-4">
                {projects.filter((p) => p.title).map((p, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-gray-800">{p.title}</p>
                      {p.link && (
                        <a 
                          href={p.link} 
                          className="text-[10px] underline ml-2"
                          style={{ color: "#8b5cf6" }}
                        >
                          {p.link.replace(/^https?:\/\//, "").slice(0, 28)}{p.link.length > 30 ? "…" : ""}
                        </a>
                      )}
                    </div>
                    {p.technologies && (
                      <p className="text-[10px] font-medium mt-0.5" style={{ color: "#7c3aed" }}>{p.technologies}</p>
                    )}
                    {p.description && (
                      <p className="text-gray-600 text-[11px] mt-1 leading-relaxed">{p.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
