import { useState, useRef } from "react";
import {
  User, BookOpen, Code2, FolderOpen, Building2, Medal,
  ChevronLeft, ChevronRight, Sparkles, Loader2,
} from "lucide-react";

import StepProgress      from "../components/form/StepProgress";
import StepPersonal      from "../components/form/StepPersonal";
import StepEducation     from "../components/form/StepEducation";
import StepSkills        from "../components/form/StepSkills";
import StepProjects      from "../components/form/StepProjects";
import StepExperience    from "../components/form/StepExperience";
import StepCertifications from "../components/form/StepCertifications";

/* ── Step metadata ──────────────────────────────────────────────── */
const STEPS = [
  { label: "Personal Info",    icon: User,        color: "from-violet-500 to-indigo-500"  },
  { label: "Education",        icon: BookOpen,     color: "from-indigo-500 to-blue-500"   },
  { label: "Skills",           icon: Code2,        color: "from-blue-500 to-cyan-500"     },
  { label: "Projects",         icon: FolderOpen,   color: "from-cyan-500 to-teal-500"     },
  { label: "Experience",       icon: Building2,    color: "from-teal-500 to-emerald-500"  },
  { label: "Certifications",   icon: Medal,        color: "from-emerald-500 to-violet-500"},
];

/* ── Initial form data ──────────────────────────────────────────── */
const INIT = {
  personal: {
    fullName: "", email: "", phone: "", linkedin: "", github: "", address: "",
  },
  education: {
    college: "", degree: "", specialization: "", cgpa: "", year: "",
  },
  skills: {
    technical: "", soft: "", languages: "", tools: "",
  },
  projects: [
    { title: "", description: "", technologies: "", link: "" },
  ],
  experience: [
    { company: "", role: "", duration: "", description: "" },
  ],
  certifications: [
    { name: "", platform: "", year: "" },
  ],
};

/* ── Validation rules ───────────────────────────────────────────── */
function validateStep(step, data) {
  const errs = {};

  if (step === 0) {
    if (!data.personal.fullName.trim()) errs.fullName = "Full name is required";
    if (!data.personal.email.trim())    errs.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(data.personal.email))
      errs.email = "Enter a valid email";
    if (!data.personal.phone.trim())    errs.phone    = "Phone number is required";
  }

  if (step === 1) {
    if (!data.education.college.trim())        errs.college        = "College name is required";
    if (!data.education.degree.trim())         errs.degree         = "Degree is required";
    if (!data.education.specialization.trim()) errs.specialization = "Specialization is required";
    if (!data.education.year.trim())           errs.year           = "Graduation year is required";
  }

  if (step === 2) {
    if (!data.skills.technical.trim())  errs.technical  = "At least one technical skill is required";
    if (!data.skills.languages.trim())  errs.languages  = "At least one language is required";
  }

  if (step === 3) {
    data.projects.forEach((p, i) => {
      if (!p.title.trim())        errs[`proj_${i}_title`]       = "Project title is required";
      if (!p.technologies.trim()) errs[`proj_${i}_technologies`] = "Technologies are required";
      if (!p.description.trim())  errs[`proj_${i}_description`]  = "Description is required";
    });
  }

  if (step === 4) {
    data.experience.forEach((e, i) => {
      if (!e.company.trim())     errs[`exp_${i}_company`]     = "Company name is required";
      if (!e.role.trim())        errs[`exp_${i}_role`]        = "Role is required";
      if (!e.duration.trim())    errs[`exp_${i}_duration`]    = "Duration is required";
      if (!e.description.trim()) errs[`exp_${i}_description`] = "Description is required";
    });
  }

  if (step === 5) {
    data.certifications.forEach((c, i) => {
      if (!c.name.trim())     errs[`cert_${i}_name`]     = "Certification name is required";
      if (!c.platform.trim()) errs[`cert_${i}_platform`] = "Platform is required";
      if (!c.year.trim())     errs[`cert_${i}_year`]     = "Year is required";
    });
  }

  return errs;
}

/* ── Main Component ─────────────────────────────────────────────── */
export default function ResumeForm({ onBack, initialData, onSubmit }) {
  const [step, setStep]     = useState(0);
  const [form, setForm]     = useState(initialData || INIT);
  const [errors, setErrors] = useState({});
  const [dir, setDir]       = useState(1);
  const [loading, setLoading] = useState(false);
  const formRef             = useRef(null);

  /* Generic change handlers */
  const handleFlat = (section) => (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [section]: { ...f[section], [name]: value } }));
    if (errors[name]) setErrors((er) => { const c = { ...er }; delete c[name]; return c; });
  };

  const handleArray = (section) => (updated) => {
    setForm((f) => ({ ...f, [section]: updated }));
    // Clear relevant errors
    setErrors((er) => {
      const c = { ...er };
      Object.keys(c).forEach((k) => { if (k.startsWith(section.slice(0, 4))) delete c[k]; });
      return c;
    });
  };

  /* Navigation */
  const scrollTop = () => formRef.current?.scrollTo({ top: 0, behavior: "smooth" });

  const next = () => {
    const errs = validateStep(step, form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setDir(1);
    setStep((s) => s + 1);
    scrollTop();
  };

  const prev = () => {
    setErrors({});
    setDir(-1);
    setStep((s) => s - 1);
    scrollTop();
  };

  const handleSubmit = async () => {
    const errs = validateStep(step, form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    onSubmit?.(form);
  };


  const StepIcon = STEPS[step].icon;


  /* ── Form ───────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-violet-600/12 blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-3xl animate-float-mid" />
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </button>
          <a href="#" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="text-sm font-bold gradient-text hidden sm:block">AI Resume Builder</span>
          </a>
        </div>

        {/* Progress */}
        <StepProgress current={step} />

        {/* Main card */}
        <div
          ref={formRef}
          className="glass rounded-3xl p-6 sm:p-8 overflow-hidden"
          style={{ maxHeight: "calc(100vh - 260px)", overflowY: "auto" }}
        >
          {/* Step header */}
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-white/8">
            <div
              className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${STEPS[step].color} flex items-center justify-center shadow-lg shrink-0`}
            >
              <StepIcon size={20} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">
                Step {step + 1} of {STEPS.length}
              </p>
              <h2 className="text-xl font-bold text-white">{STEPS[step].label}</h2>
            </div>
          </div>

          {/* Animated step content */}
          <div
            key={step}
            className="animate-fade-up"
          >
            {step === 0 && (
              <StepPersonal
                data={form.personal}
                onChange={handleFlat("personal")}
                errors={errors}
              />
            )}
            {step === 1 && (
              <StepEducation
                data={form.education}
                onChange={handleFlat("education")}
                errors={errors}
              />
            )}
            {step === 2 && (
              <StepSkills
                data={form.skills}
                onChange={handleFlat("skills")}
                errors={errors}
              />
            )}
            {step === 3 && (
              <StepProjects
                data={form.projects}
                onChange={handleArray("projects")}
                errors={errors}
              />
            )}
            {step === 4 && (
              <StepExperience
                data={form.experience}
                onChange={handleArray("experience")}
                errors={errors}
              />
            )}
            {step === 5 && (
              <StepCertifications
                data={form.certifications}
                onChange={handleArray("certifications")}
                errors={errors}
              />
            )}
          </div>
        </div>

        {/* Error count banner */}
        {Object.keys(errors).length > 0 && (
          <div className="mt-3 px-4 py-2.5 rounded-xl bg-pink-500/10 border border-pink-500/25 text-pink-400 text-xs font-medium flex items-center gap-2 animate-fade-up">
            <span>⚠</span>
            {Object.keys(errors).length} required field{Object.keys(errors).length > 1 ? "s are" : " is"} missing — please fill them in.
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-5 gap-3">
          <button
            onClick={prev}
            disabled={step === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 ${
              step === 0
                ? "opacity-0 pointer-events-none"
                : "btn-outline"
            }`}
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          {/* Step dots (mobile) */}
          <div className="flex gap-1.5 sm:hidden">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? "w-5 bg-violet-400" : i < step ? "w-2 bg-violet-600" : "w-2 bg-white/15"
                }`}
              />
            ))}
          </div>

          {step < STEPS.length - 1 ? (
            <button
              onClick={next}
              className="btn-primary flex items-center gap-2 px-6 py-3 text-sm"
            >
              <span className="relative z-10">Next</span>
              <ChevronRight size={16} className="relative z-10" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary flex items-center gap-2 px-8 py-3 text-sm min-w-[160px] justify-center"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="relative z-10 animate-spin" />
                  <span className="relative z-10">Generating…</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} className="relative z-10" />
                  <span className="relative z-10">Generate Resume</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
