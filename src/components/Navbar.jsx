import { useState, useEffect } from "react";
import { Menu, X, Sparkles, LogOut } from "lucide-react";

const navLinks = ["Home", "Features", "Templates", "Contact"];

export default function Navbar({ onGetStarted, onLoginClick, onLogout, currentUser }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const getFirstName = (fullName) => {
    if (!fullName) return "User";
    return fullName.trim().split(" ")[0];
  };

  const getInitial = (fullName) => {
    if (!fullName) return "U";
    return fullName.trim().charAt(0).toUpperCase();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-dark shadow-2xl py-3" : "bg-transparent py-5"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold gradient-text tracking-tight">
            AI Resume Builder
          </span>
        </a>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link}>
              <a
                href={`#${link.toLowerCase()}`}
                className="text-sm text-slate-300 hover:text-white relative group transition-colors duration-200"
              >
                {link}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-violet-400 to-pink-400 group-hover:w-full transition-all duration-300" />
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-4 animate-fade-in">
              <span className="text-sm text-slate-300 font-medium">
                Hi, <span className="text-violet-300 font-semibold">{getFirstName(currentUser.name)}</span>
              </span>
              
              {/* User Avatar Circle */}
              <div 
                title={currentUser.email}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md border border-violet-400/20 cursor-help"
              >
                {getInitial(currentUser.name)}
              </div>
              
              <div className="w-px h-4 bg-white/15" />
              
              <button 
                onClick={onLogout}
                className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs px-3.5 py-2 rounded-xl glass transition-all"
              >
                <LogOut size={13} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <>
              <button className="btn-outline text-sm px-5 py-2" onClick={onLoginClick}>Login</button>
              <button className="btn-primary text-sm px-5 py-2" onClick={onGetStarted}>
                <span className="relative z-10">Get Started</span>
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white p-2 rounded-lg glass transition-all"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ${
          open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="glass-dark mx-4 mt-2 rounded-2xl p-5 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
            >
              {link}
            </a>
          ))}
          
          <div className="flex flex-col gap-3 pt-3 border-t border-white/10">
            {currentUser ? (
              <div className="flex flex-col gap-3 animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md border border-violet-400/20">
                    {getInitial(currentUser.name)}
                  </div>
                  <span className="text-sm text-slate-300 font-semibold">
                    Hi, {currentUser.name}
                  </span>
                </div>
                <button 
                  onClick={() => { onLogout(); setOpen(false); }}
                  className="btn-outline text-sm w-full py-2 flex items-center justify-center gap-2"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button 
                  className="btn-outline text-sm flex-1 py-2" 
                  onClick={() => { onLoginClick(); setOpen(false); }}
                >
                  Login
                </button>
                <button 
                  className="btn-primary text-sm flex-1 py-2" 
                  onClick={() => { onGetStarted(); setOpen(false); }}
                >
                  <span className="relative z-10">Get Started</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
