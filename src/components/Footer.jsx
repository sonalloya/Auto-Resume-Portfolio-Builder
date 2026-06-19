import { Globe, Code2, Briefcase, Camera, Sparkles, ArrowRight } from "lucide-react";

const footerLinks = {
  "Quick Links": ["Home", "Features", "Templates", "Contact", "Blog"],
  Company: ["About Us", "Careers", "Privacy Policy", "Terms of Service"],
  Resources: ["Documentation", "API Reference", "Support", "Changelog"],
};

const socials = [
  { icon: Globe,     href: "#", label: "Website"   },
  { icon: Code2,     href: "#", label: "GitHub"    },
  { icon: Briefcase, href: "#", label: "LinkedIn"  },
  { icon: Camera,    href: "#", label: "Instagram" },
];

export default function Footer({ onStartForFree }) {
  return (
    <footer id="contact" className="relative pt-20 pb-8 px-6 overflow-hidden">
      {/* Top glowing border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

      {/* Background blobs */}
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-600/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* CTA Banner */}
        <div className="glass rounded-3xl p-8 md:p-12 mb-16 flex flex-col md:flex-row items-center justify-between gap-6 glow-violet">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Ready to build your{" "}
              <span className="gradient-text">dream career?</span>
            </h3>
            <p className="text-slate-400 text-sm">
              Join 50,000+ professionals who landed jobs with AI Resume Builder.
            </p>
          </div>
          <button 
            onClick={onStartForFree}
            className="btn-primary flex items-center gap-2 shrink-0 px-8 py-3.5"
          >
            <span className="relative z-10">Start for Free</span>
            <ArrowRight size={16} className="relative z-10" />
          </button>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
                <Sparkles size={15} className="text-white" />
              </div>
              <span className="font-bold gradient-text">AI Resume Builder</span>
            </a>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              Your AI-powered partner for crafting resumes and portfolios that get you hired.
            </p>
            {/* Socials */}
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:border-violet-500/50 transition-all duration-200 hover:scale-110"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-white text-sm font-semibold mb-4 tracking-wide">{heading}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-white text-sm transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} AI Resume Builder. All rights reserved.
          </p>
          <p className="text-slate-600 text-xs">
            Crafted with ✦ using React & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
