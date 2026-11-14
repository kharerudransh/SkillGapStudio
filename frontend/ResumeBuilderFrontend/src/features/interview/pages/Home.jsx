import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useInterview } from "../hooks/useInterview";
import { useAuth } from "../../auth/hooks/useAuth";
import AIAnalysisLoader from "../../auth/components/Loading";
import Interview from "./Interview";
import {
  UploadCloud,
  Briefcase,
  UserCheck,
  Sparkles,
  ArrowRight,
  Clock,
  History,
  ChevronRight,
  X,
  Compass,
  AlertCircle,
  FileCheck2,
  Trash2,
  Pin,
  PinOff,
  LogOut,
  User,
  GraduationCap
} from "lucide-react";

// Sample presets for quick testing
const SAMPLE_JOB_DESCRIPTION = `Senior Full-Stack Engineer (Platform & Distributed Core)
Requirements:
- 4+ years building high-throughput microservices using Node.js / TypeScript.
- Strong proficiency with PostgreSQL, Redis caching, and Kafka event streaming.
- Experience with Docker, Kubernetes, and AWS infrastructure.
- Solid background in system design, distributed consistency, and REST/GraphQL APIs.
- Collaborative mindset, ownership of production reliability, and code review leadership.`;

const SAMPLE_SELF_DESCRIPTION = `Full-stack developer with 4 years of hands-on experience in React, Node.js, and MongoDB/PostgreSQL. I have built customer-facing SaaS applications and RESTful APIs, with intermediate exposure to Redis caching and Docker containerization. Looking to step up into high-scale distributed systems and platform engineering.`;

export default function Home() {
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();
  const {
    report,
    setReport,
    reports,
    loading,
    handleGenerateReport,
    handleGetAllReports,
    handleGetReportById
  } = useInterview();

  // Form States
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Sidebar States
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const sidebarRef = useRef(null);

  // Fetch previous reports on component mount
  useEffect(() => {
    handleGetAllReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Subtle interactive background stardust canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const count = 35;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 1.2 + 0.5,
      opacity: Math.random() * 0.35 + 0.15
    }));

    let mouseCoords = { x: -1000, y: -1000 };
    const trackWindowMouse = (e) => {
      mouseCoords = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", trackWindowMouse);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        const mouseDist = Math.hypot(p.x - mouseCoords.x, p.y - mouseCoords.y);
        if (mouseDist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouseCoords.x, mouseCoords.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - mouseDist / 130)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", trackWindowMouse);
    };
  }, []);

  // Right-Edge Cursor Detection: Open sidebar when cursor moves to right edge (<= 28px from right)
  useEffect(() => {
    const handleRightEdgeMouseMove = (e) => {
      const windowWidth = window.innerWidth;
      if (e.clientX >= windowWidth - 28 && !sidebarOpen) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("mousemove", handleRightEdgeMouseMove);
    return () => window.removeEventListener("mousemove", handleRightEdgeMouseMove);
  }, [sidebarOpen]);

  // Handle Drag & Drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        setResumeFile(file);
        setErrorMessage("");
      } else {
        setErrorMessage("Please upload a PDF format resume file.");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        setResumeFile(file);
        setErrorMessage("");
      } else {
        setErrorMessage("Please upload a PDF format resume file.");
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!resumeFile) {
      setErrorMessage("Please upload your resume in PDF format.");
      return;
    }
    if (!jobDescription.trim()) {
      setErrorMessage("Please supply the target job description.");
      return;
    }
    if (!selfDescription.trim()) {
      setErrorMessage("Please provide a brief self description or background overview.");
      return;
    }

    try {
      await handleGenerateReport({
        resumeFile,
        jobDescription,
        selfDescription
      });
    } catch (err) {
      setErrorMessage(
        err?.message || "Failed to generate report. Please try again."
      );
    }
  };

  const handleSelectPastReport = async (reportId) => {
    try {
      await handleGetReportById(reportId);
      setSidebarOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const loadSampleData = () => {
    setJobDescription(SAMPLE_JOB_DESCRIPTION);
    setSelfDescription(SAMPLE_SELF_DESCRIPTION);
    setErrorMessage("");
  };

  const onLogout = async () => {
    try {
      setLoggingOut(true);
      await handleLogout();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoggingOut(false);
    }
  };

  // If a report is currently loaded, display the Interview result page
  if (report) {
    return <Interview onBack={() => setReport(null)} />;
  }

  // If generating a report, render transition loader
  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#090A0F] p-4">
        <AIAnalysisLoader
          title="Synthesizing Career Gap Analysis"
          compact={false}
        />
      </div>
    );
  }

  // Filter strictly to user's real reports (no defaults or mock entries)
  const pastReportsList = Array.isArray(reports)
    ? reports
    : Array.isArray(reports?.interviewReports)
    ? reports.interviewReports
    : [];

  const candidateName = user?.username || "Candidate";
  const profession = user?.profession || "Engineer";

  const getProfessionBadge = () => {
    if (profession === "Student") {
      return {
        label: "Student",
        icon: GraduationCap,
        subtext: "Preparing for campus placements and technical internship interviews."
      };
    }
    if (profession === "Fresher") {
      return {
        label: "Fresher",
        icon: Sparkles,
        subtext: "Bridging foundational gaps to accelerate entry-level engineering placement."
      };
    }
    return {
      label: "Working Professional",
      icon: Briefcase,
      subtext: "Targeting lateral advancements, domain transitions, and senior interview mastery."
    };
  };

  const badgeInfo = getProfessionBadge();
  const BadgeIcon = badgeInfo.icon;

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#090A0F] font-sans text-slate-100 antialiased selection:bg-white/10 selection:text-white">
      {/* Background Interactive Stardust Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-60"
      />

      {/* Restrained Ambient Glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/2 h-[450px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-800/15 blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 h-[350px] w-[600px] rounded-full bg-slate-900/35 blur-[160px]" />

        {/* Structural Grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "64px 64px"
          }}
        />
      </div>

      {/* Persistent Invisible Right Edge Hover Sensor Zone */}
      <div
        className="fixed top-0 right-0 z-40 h-full w-4 cursor-pointer hover:bg-white/[0.03] transition-colors"
        onMouseEnter={() => setSidebarOpen(true)}
        title="Move cursor here to reveal analysis history"
      />

      {/* Right Edge Collapsed Floating Beacon Tab */}
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className={`fixed top-1/2 -right-1 z-30 flex -translate-y-1/2 cursor-pointer items-center gap-2 rounded-l-xl border border-r-0 border-white/10 bg-[#0E1017]/90 px-2 py-3 text-xs text-slate-300 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/10 ${
          sidebarOpen ? "translate-x-full opacity-0 pointer-events-none" : "translate-x-0 opacity-100"
        }`}
      >
        <History size={14} className="text-slate-400" />
        <span
          className="text-[11px] font-medium tracking-wider text-slate-300 uppercase"
          style={{ writingMode: "vertical-rl" }}
        >
          History ({pastReportsList.length})
        </span>
      </button>

      {/* Main Workspace Layout */}
      <div className="relative z-10 flex min-h-screen flex-col justify-between px-6 py-6 sm:px-10 lg:px-14">
        {/* Top Header with Personalized User Profile & Logout */}
        <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
              <Compass size={17} className="text-slate-200" />
            </div>
            <div>
              <span className="text-sm font-medium tracking-tight text-white">
                SkillGap<span className="text-slate-400">Studio</span>
              </span>
              <span className="ml-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[10px] text-slate-400">
                Workspace
              </span>
            </div>
          </div>

          {/* User Controls & Logout */}
          <div className="flex items-center gap-3">
            {/* User Profile Badge */}
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300">
              <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[11px] font-semibold text-white">
                {candidateName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <span className="block font-medium text-white leading-none">
                  {candidateName}
                </span>
                <span className="block text-[9px] text-slate-500 font-mono">
                  {user?.profession || "Member"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={loadSampleData}
              className="cursor-pointer rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-slate-300 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            >
              Fill Sample
            </button>

            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-slate-300 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            >
              <History size={13} className="text-slate-400" />
              <span>History ({pastReportsList.length})</span>
            </button>

            {/* Logout Button */}
            <button
              type="button"
              onClick={onLogout}
              disabled={loggingOut}
              className="flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/[0.06] px-3.5 py-1.5 text-xs font-medium text-rose-300 transition-all duration-200 hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-200 disabled:opacity-50"
              title="Sign out of candidate session"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">
                {loggingOut ? "Signing out..." : "Sign Out"}
              </span>
            </button>
          </div>
        </header>

        {/* Center Upload & Form Container with Personalized Welcome */}
        <main className="mx-auto my-auto w-full max-w-6xl py-4">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[11px] font-medium tracking-wide text-slate-300">
              <BadgeIcon size={12} className="text-slate-400" />
              <span>{badgeInfo.label} Track</span>
            </div>

            <h1 className="mt-3.5 text-3xl font-light tracking-tight text-white sm:text-4xl">
              Welcome back, <span className="font-normal text-white">{candidateName}</span>.
            </h1>
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400 sm:text-sm">
              {badgeInfo.subtext} Upload your latest resume and target job specification
              to generate a tailored gap evaluation and technical prep roadmap.
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/[0.06] p-3 text-xs text-rose-300">
              <AlertCircle size={15} className="shrink-0 text-rose-400" />
              <span className="flex-1">{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
              {/* Left Column: Resume PDF Upload Dropzone */}
              <div className="lg:col-span-5">
                <label className="mb-2 block text-xs font-medium text-slate-300">
                  Your Resume <span className="text-slate-500 font-normal">(PDF format)</span>
                </label>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`group relative flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-2xl border p-6 text-center transition-all duration-300 ${
                    isDragging
                      ? "border-white/40 bg-white/[0.06]"
                      : resumeFile
                      ? "border-white/20 bg-white/[0.03]"
                      : "border-white/[0.08] bg-[#0E1017]/70 hover:border-white/20 hover:bg-white/[0.02]"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {resumeFile ? (
                    <div className="flex flex-col items-center">
                      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white shadow-xl">
                        <FileCheck2 size={26} />
                      </div>
                      <span className="max-w-[220px] truncate text-xs font-medium text-white">
                        {resumeFile.name}
                      </span>
                      <span className="mt-1 font-mono text-[11px] text-slate-400">
                        {(resumeFile.size / 1024).toFixed(1)} KB · Ready for analysis
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setResumeFile(null);
                        }}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-slate-400 transition-colors hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-300"
                      >
                        <Trash2 size={12} />
                        <span>Remove file</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-slate-400 transition-colors group-hover:border-white/20 group-hover:text-white">
                        <UploadCloud size={24} />
                      </div>
                      <span className="text-xs font-medium text-slate-200">
                        Drop your PDF resume here
                      </span>
                      <p className="mt-1 text-[11px] text-slate-500">
                        or click to browse from your device
                      </p>
                      <span className="mt-4 rounded-md border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 font-mono text-[10px] text-slate-400">
                        Accepts .PDF (max 10MB)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Descriptions (Job + Candidate Focus) */}
              <div className="space-y-5 lg:col-span-7">
                {/* Target Job Description */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label
                      htmlFor="jobDescription"
                      className="flex items-center gap-1.5 text-xs font-medium text-slate-300"
                    >
                      <Briefcase size={13} className="text-slate-400" />
                      <span>Target Job Description</span>
                    </label>
                    <span className="font-mono text-[10px] text-slate-500">
                      {jobDescription.length} characters
                    </span>
                  </div>

                  <textarea
                    id="jobDescription"
                    rows={6}
                    required
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the target role description, key competencies, and qualifications..."
                    className="w-full rounded-2xl border border-white/[0.08] bg-black/40 p-4 text-xs leading-relaxed text-white placeholder-slate-600 transition-all duration-200 focus:border-white/25 focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-white/20"
                  />
                </div>

                {/* Self Description / Background Context */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label
                      htmlFor="selfDescription"
                      className="flex items-center gap-1.5 text-xs font-medium text-slate-300"
                    >
                      <UserCheck size={13} className="text-slate-400" />
                      <span>Self Description & Background Context</span>
                    </label>
                    <span className="font-mono text-[10px] text-slate-500">
                      {selfDescription.length} characters
                    </span>
                  </div>

                  <textarea
                    id="selfDescription"
                    rows={4}
                    required
                    value={selfDescription}
                    onChange={(e) => setSelfDescription(e.target.value)}
                    placeholder="Describe your current focus, years of experience, or specific career goals to guide the AI..."
                    className="w-full rounded-2xl border border-white/[0.08] bg-black/40 p-4 text-xs leading-relaxed text-white placeholder-slate-600 transition-all duration-200 focus:border-white/25 focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-white/20"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                className="group relative flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-medium text-slate-950 transition-all duration-200 hover:bg-slate-200 active:scale-[0.99] sm:w-auto"
              >
                <span>Analyze Skill Gap & Generate Interview Deck</span>
                <ArrowRight
                  size={15}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </button>
            </div>
          </form>
        </main>

        {/* Minimal Footer */}
        <footer className="mx-auto flex w-full max-w-6xl items-center justify-between border-t border-white/[0.04] pt-6 text-[11px] text-slate-600">
          <div>© {new Date().getFullYear()} SkillGap Studio. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <span className="text-slate-500">
              Hover right edge anytime to reveal History
            </span>
          </div>
        </footer>
      </div>

      {/* ========================================================================= */}
      {/* LUXURY RIGHT-SIDE SLIDING DRAWER: USER'S REAL ANALYSIS ARCHIVE           */}
      {/* ========================================================================= */}
      {/* Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => {
            if (!isPinned) setSidebarOpen(false);
          }}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        />
      )}

      {/* Drawer Panel */}
      <aside
        ref={sidebarRef}
        onMouseLeave={() => {
          if (!isPinned) setSidebarOpen(false);
        }}
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col border-l border-white/[0.08] bg-[#0E1017] p-6 shadow-2xl transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
              <History size={16} className="text-slate-200" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">Your Analysis Archive</h3>
              <p className="text-[11px] text-slate-500">
                {pastReportsList.length} saved evaluation{pastReportsList.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Pin Toggle */}
            <button
              type="button"
              onClick={() => setIsPinned(!isPinned)}
              className={`rounded-lg border p-1.5 transition-colors ${
                isPinned
                  ? "border-white/20 bg-white/10 text-white"
                  : "border-white/[0.08] text-slate-500 hover:text-slate-300"
              }`}
              title={isPinned ? "Unpin Drawer" : "Keep Drawer Pinned Open"}
            >
              {isPinned ? <Pin size={14} /> : <PinOff size={14} />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg border border-white/[0.08] p-1.5 text-slate-500 transition-colors hover:border-white/20 hover:text-white"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Previous Reports List - Strictly Real User Data (No Mock/Defaults) */}
        <div className="mt-4 flex-1 space-y-2.5 overflow-y-auto pr-1">
          {pastReportsList.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <Clock size={28} className="text-slate-600 mb-2" />
              <p className="text-xs font-medium text-slate-300">No evaluations yet</p>
              <p className="mt-1 max-w-[220px] text-[11px] text-slate-500">
                Uploaded resumes and target job descriptions will be saved here for your account.
              </p>
            </div>
          ) : (
            pastReportsList.map((item) => (
              <div
                key={item._id}
                onClick={() => handleSelectPastReport(item._id)}
                className="group cursor-pointer rounded-xl border border-white/[0.06] bg-white/[0.015] p-3.5 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.04]"
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1 pr-2">
                    <h4 className="truncate text-xs font-medium text-slate-200 group-hover:text-white">
                      {item.title || "Career Assessment"}
                    </h4>
                    <span className="mt-1 block font-mono text-[10px] text-slate-500">
                      ID: {item._id.slice(-6)}
                    </span>
                  </div>

                  {typeof item.matchScore === "number" && (
                    <span className="shrink-0 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-200">
                      {item.matchScore}%
                    </span>
                  )}
                </div>

                <div className="mt-2.5 flex items-center justify-between border-t border-white/[0.04] pt-2 text-[10px] text-slate-500">
                  <span>Review assessment</span>
                  <ChevronRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info in drawer */}
        <div className="border-t border-white/[0.06] pt-3 text-[10px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-1.5 truncate">
            <User size={12} className="text-slate-400" />
            <span className="truncate">{user?.email || "Active User"}</span>
          </div>
          <span className="shrink-0 text-slate-600">Auto-archived</span>
        </div>
      </aside>
    </div>
  );
}
