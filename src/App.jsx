import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Templates from "./components/Templates";
import Footer from "./components/Footer";
import ResumeForm from "./pages/ResumeForm";
import ResumePreview from "./pages/ResumePreview";
import PortfolioPreview from "./pages/PortfolioPreview";
import AuthModal from "./components/AuthModal";

/* Default empty form shape — shared between form and preview */
export const EMPTY_FORM = {
  personal: { fullName: "", email: "", phone: "", linkedin: "", github: "", address: "" },
  education: { college: "", degree: "", specialization: "", cgpa: "", year: "" },
  skills:    { technical: "", soft: "", languages: "", tools: "" },
  projects:  [{ title: "", description: "", technologies: "", link: "" }],
  experience:[{ company: "", role: "", duration: "", description: "" }],
  certifications: [{ name: "", platform: "", year: "" }],
};

export default function App() {
  // Page state machine: "home" | "form" | "preview" | "portfolio"
  const [page, setPage] = useState("home");
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");

  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signup");
  const [pendingPage, setPendingPage] = useState(null);

  // Auth Handlers
  const handleLogout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
    setPage("home");
  };

  const handleStartFlow = (targetPage = "form") => {
    if (currentUser) {
      setPage(targetPage);
    } else {
      setPendingPage(targetPage);
      setAuthMode("signup");
      setIsAuthOpen(true);
    }
  };

  const handleLoginClick = () => {
    setAuthMode("login");
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    
    // Prefill user name and email into empty form if they are empty
    setFormData((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        fullName: prev.personal.fullName || user.name || "",
        email: prev.personal.email || user.email || "",
      }
    }));

    // Redirect to the page they originally intended to visit, or form by default
    const redirectPage = pendingPage || "form";
    setPage(redirectPage);
    setPendingPage(null);
  };

  // Template select handler from Landing Page
  const handleSelectTemplate = (templateId) => {
    setSelectedTemplate(templateId);
    handleStartFlow("form");
  };

  if (page === "form") {
    return (
      <ResumeForm
        initialData={formData}
        onBack={() => setPage("home")}
        onSubmit={(data) => {
          setFormData(data);
          setPage("preview");
        }}
      />
    );
  }

  if (page === "preview") {
    return (
      <ResumePreview
        data={formData}
        initialTemplate={selectedTemplate}
        onEdit={() => setPage("form")}
        onHome={() => setPage("home")}
        onGoToPortfolio={() => setPage("portfolio")}
      />
    );
  }

  if (page === "portfolio") {
    return (
      <PortfolioPreview
        data={formData}
        onEdit={() => setPage("form")}
        onHome={() => setPage("home")}
      />
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0a0a1a] text-white selection:bg-violet-500/30">
      <Navbar 
        onGetStarted={() => handleStartFlow("form")} 
        onLoginClick={handleLoginClick}
        onLogout={handleLogout}
        currentUser={currentUser}
      />
      <main>
        <Hero 
          onGenerate={() => handleStartFlow("form")} 
          onBuildPortfolio={() => handleStartFlow("portfolio")} 
        />
        <Features />
        <Templates onSelectTemplate={handleSelectTemplate} />
      </main>
      <Footer onStartForFree={() => handleStartFlow("form")} />

      {/* Auth Modal Overlay */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authMode}
      />
    </div>
  );
}
