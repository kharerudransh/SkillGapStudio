import { useState } from "react";
import { useNavigate } from "react-router";
import { useInterview } from "../hooks/useInterview";
import {
  ArrowLeft,
  BrainCircuit,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Printer,
  Compass,
  Lightbulb,
  SlidersHorizontal,
  FileDown,
  FileText,
  Sparkles,
  Loader2,
  AlertCircle
} from "lucide-react";

export default function Interview({ onBack }) {
  const navigate = useNavigate();
  const { report, setReport, handleGenerateResume } = useInterview();

  const handleBack = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (typeof onBack === "function") {
      try {
        onBack();
      } catch (err) {
        console.error("onBack error:", err);
      }
    }
    if (typeof setReport === "function") {
      setReport(null);
    }
    navigate("/home");
  };

  // Active section tab: "overview" | "gaps" | "technical" | "behavioral" | "roadmap"
  const [activeTab, setActiveTab] = useState("overview");

  // Severity filter for skill gaps: "all" | "High" | "Medium" | "Low"
  const [gapFilter, setGapFilter] = useState("all");

  // Accordion state for revealed answers: { [questionId]: boolean }
  const [revealedAnswers, setRevealedAnswers] = useState({});

  // Completed roadmap topics tracker: { [topicKey]: boolean }
  const [completedTopics, setCompletedTopics] = useState({});

  // Copy feedback state
  const [copied, setCopied] = useState(false);

  // Resume PDF Generation states
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [pdfError, setPdfError] = useState(null);

  // Download Tailored Resume PDF using interviewReportId
  const handleDownloadResume = async () => {
    const reportId = report?._id || report?.id;
    if (!reportId) {
      setPdfError("Interview report ID not found. Please re-run the evaluation.");
      return;
    }

    try {
      setIsGeneratingPdf(true);
      setPdfError(null);
      setPdfSuccess(false);

      if (typeof handleGenerateResume === "function") {
        await handleGenerateResume(reportId);
      } else {
        throw new Error("handleGenerateResume handler is not available");
      }

      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 4000);
    } catch (err) {
      console.error("Resume generation error:", err);
      setPdfError(err?.message || "Failed to generate tailored resume. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // If no report is loaded, show a clean fallback prompt
  if (!report) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#090A0F] px-4 text-center font-sans text-slate-100">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
          <BrainCircuit size={22} className="text-slate-400" />
        </div>
        <h2 className="mt-4 text-lg font-medium text-white">No active interview evaluation</h2>
        <p className="mt-1 max-w-sm text-xs text-slate-500">
          Upload a resume and job description on the workspace dashboard to generate an analysis.
        </p>
        <button
          type="button"
          onClick={handleBack}
          className="mt-6 rounded-xl bg-white px-5 py-2.5 text-xs font-medium text-slate-950 transition-colors hover:bg-slate-200"
        >
          Return to Workspace
        </button>
      </div>
    );
  }

  const {
    title = "Candidate Competency & Interview Deck",
    matchScore = 80,
    skillGap = [],
    technicalQuestions = [],
    behaviouralQuestions = [],
    preperationPlan = []
  } = report;

  // Toggle reveal for question answers
  const toggleAnswer = (id) => {
    setRevealedAnswers((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Toggle completed topic in roadmap
  const toggleTopic = (key) => {
    setCompletedTopics((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Copy summary to clipboard
  const handleCopySummary = () => {
    const summaryText = `Role: ${title}\nAlignment Match Score: ${matchScore}%\nIdentified Skill Gaps: ${skillGap.length}\nTechnical Questions: ${technicalQuestions.length}\nBehavioral Questions: ${behaviouralQuestions.length}\nPrep Plan Days: ${preperationPlan.length}`;
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filtered skill gaps
  const filteredGaps =
    gapFilter === "all"
      ? skillGap
      : skillGap.filter(
          (g) => g.severity?.toLowerCase() === gapFilter.toLowerCase()
        );

  // Total topics count in roadmap
  const totalTopicsCount = preperationPlan.reduce(
    (acc, day) => acc + (day.topics?.length || 0),
    0
  );
  const completedTopicsCount =
    Object.values(completedTopics).filter(Boolean).length;

  return (
    <div className="relative min-h-screen w-full bg-[#090A0F] font-sans text-slate-100 antialiased selection:bg-white/10 selection:text-white">
      {/* Delicate Structural Grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "64px 64px"
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-6 sm:px-10 lg:px-14">
        {/* Top Action Bar */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="group flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
              title="Return to Workspace Upload"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium tracking-tight text-slate-400">
                  Interview Preparation Deck
                </span>
                <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-slate-500">
                  AI SYNTHESIZED
                </span>
              </div>
              <h1 className="text-lg font-medium text-white sm:text-xl">
                {title}
              </h1>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Generate Tailored Resume Button */}
            <button
              type="button"
              disabled={isGeneratingPdf}
              onClick={handleDownloadResume}
              className={`flex items-center gap-1.5 rounded-lg border px-3.5 py-1.5 text-xs font-medium transition-all ${
                pdfSuccess
                  ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-300"
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:border-emerald-500/50 hover:bg-emerald-500/20 hover:text-white"
              } disabled:cursor-not-allowed disabled:opacity-50`}
              title="Download tailored resume PDF synthesized from this interview evaluation"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 size={13} className="animate-spin text-emerald-400" />
                  <span>Synthesizing Resume...</span>
                </>
              ) : pdfSuccess ? (
                <>
                  <Check size={13} className="text-emerald-400" />
                  <span>Resume Downloaded</span>
                </>
              ) : (
                <>
                  <Sparkles size={13} className="text-emerald-400" />
                  <span>Generate Tailored Resume</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:border-white/20 hover:text-white"
            >
              {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              <span>{copied ? "Copied" : "Copy Brief"}</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:border-white/20 hover:text-white"
            >
              <Printer size={13} />
              <span>Print / Export</span>
            </button>
          </div>
        </header>

        {/* Global Error Alert for Resume PDF */}
        {pdfError && (
          <div className="mt-4 flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-300">
            <div className="flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0 text-rose-400" />
              <span>{pdfError}</span>
            </div>
            <button
              type="button"
              onClick={() => setPdfError(null)}
              className="text-xs font-mono text-rose-400 hover:text-rose-200"
            >
              ✕
            </button>
          </div>
        )}

        {/* Hero Executive Score Banner (No Tacky Gradients) */}
        <section className="mt-8 rounded-3xl border border-white/[0.08] bg-[#0E1017] p-6 shadow-2xl sm:p-8">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12">
            {/* Match Dial */}
            <div className="flex items-center gap-5 md:col-span-5 lg:col-span-4">
              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/50 p-2 shadow-inner">
                {/* Clean SVG Circular Progress */}
                <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-white/[0.08]"
                    strokeWidth="3.2"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-white transition-all duration-1000"
                    strokeDasharray={`${matchScore}, 100`}
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>

                <div className="absolute flex flex-col items-center">
                  <span className="font-mono text-2xl font-light tracking-tight text-white">
                    {matchScore}%
                  </span>
                  <span className="text-[9px] tracking-wider text-slate-500 uppercase">
                    Score
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-medium tracking-wider text-slate-500 uppercase">
                  Candidate Fit Index
                </span>
                <h3 className="mt-0.5 text-base font-medium text-white sm:text-lg">
                  {matchScore >= 80
                    ? "High Competency Match"
                    : matchScore >= 65
                    ? "Moderate Alignment"
                    : "Growth Opportunity"}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">
                  {matchScore >= 80
                    ? "Strong foundation against target role with specific focus areas for mastery."
                    : "Key fundamental overlap detected with several core skill bridges recommended."}
                </p>
              </div>
            </div>

            {/* Quick Metrics Deck */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:col-span-7 lg:col-span-8">
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                <span className="text-[10px] tracking-wider text-slate-500 uppercase">
                  Identified Gaps
                </span>
                <div className="mt-1.5 flex items-baseline gap-1.5">
                  <span className="font-mono text-xl font-medium text-white">
                    {skillGap.length}
                  </span>
                  <span className="text-[11px] text-slate-500">competencies</span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                <span className="text-[10px] tracking-wider text-slate-500 uppercase">
                  Technical Questions
                </span>
                <div className="mt-1.5 flex items-baseline gap-1.5">
                  <span className="font-mono text-xl font-medium text-white">
                    {technicalQuestions.length}
                  </span>
                  <span className="text-[11px] text-slate-500">scenarios</span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                <span className="text-[10px] tracking-wider text-slate-500 uppercase">
                  Behavioral Prompts
                </span>
                <div className="mt-1.5 flex items-baseline gap-1.5">
                  <span className="font-mono text-xl font-medium text-white">
                    {behaviouralQuestions.length}
                  </span>
                  <span className="text-[11px] text-slate-500">frameworks</span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                <span className="text-[10px] tracking-wider text-slate-500 uppercase">
                  Study Timeline
                </span>
                <div className="mt-1.5 flex items-baseline gap-1.5">
                  <span className="font-mono text-xl font-medium text-white">
                    {preperationPlan.length}
                  </span>
                  <span className="text-[11px] text-slate-500">daily modules</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Segmented Navigation Tabs */}
        <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-white/[0.06] pb-4">
          {[
            { id: "overview", label: "Executive Summary" },
            { id: "gaps", label: `Skill Gaps (${skillGap.length})` },
            { id: "technical", label: `Technical Questions (${technicalQuestions.length})` },
            { id: "behavioral", label: `Behavioral (${behaviouralQuestions.length})` },
            { id: "roadmap", label: `Prep Roadmap (${preperationPlan.length} Days)` }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer rounded-xl px-4 py-2 text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? "border border-white/20 bg-white/10 text-white shadow-sm"
                  : "border border-transparent text-slate-400 hover:border-white/[0.06] hover:bg-white/[0.02] hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Executive Overview */}
        {activeTab === "overview" && (
          <div className="mt-8 space-y-8">
            {/* AI-Synthesized Tailored Resume Callout Banner */}
            <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-[#0E1318] via-[#0E1017] to-[#0A0E14] p-6 shadow-xl sm:p-7">
              {/* Subtle Ambient Radial Glow */}
              <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />

              <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                      <Sparkles size={13} />
                    </span>
                    <span className="text-[11px] font-medium tracking-wider text-emerald-400 uppercase">
                      AI Resume Generation
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[9px] text-slate-400">
                      NEW FEATURE
                    </span>
                  </div>

                  <h3 className="mt-2 text-base font-medium text-white sm:text-lg">
                    Generate Role-Tailored Resume
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400 sm:text-sm">
                    Synthesize an ATS-optimized PDF resume tailored specifically to this position. Automatically addresses the {skillGap.length} identified competency gaps and emphasizes your aligned strengths.
                  </p>

                  {/* Highlights Pills */}
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-1">
                      <FileText size={12} className="text-slate-400" />
                      Role: <strong className="font-medium text-slate-300">{title}</strong>
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-1">
                      <Check size={12} className="text-emerald-400" />
                      Fit Score: <strong className="font-medium text-slate-300">{matchScore}%</strong>
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-1">
                      <BrainCircuit size={12} className="text-indigo-400" />
                      Gaps Addressed: <strong className="font-medium text-slate-300">{skillGap.length}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-start gap-2 md:items-end">
                  <button
                    type="button"
                    disabled={isGeneratingPdf}
                    onClick={handleDownloadResume}
                    className="group flex cursor-pointer items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-5 py-2.5 text-xs font-medium text-emerald-300 shadow-lg shadow-emerald-950/20 transition-all hover:border-emerald-500/60 hover:bg-emerald-500/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isGeneratingPdf ? (
                      <>
                        <Loader2 size={14} className="animate-spin text-emerald-400" />
                        <span>Synthesizing Resume...</span>
                      </>
                    ) : pdfSuccess ? (
                      <>
                        <Check size={14} className="text-emerald-400" />
                        <span className="text-emerald-200">Downloaded to Device</span>
                      </>
                    ) : (
                      <>
                        <FileDown size={14} className="transition-transform group-hover:translate-y-0.5 text-emerald-400" />
                        <span>Download Tailored Resume</span>
                      </>
                    )}
                  </button>
                  <span className="text-[10px] text-slate-500">
                    Report Reference: <span className="font-mono text-slate-400">{report?._id ? `${report._id.slice(0, 8)}...` : "Active"}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Critical Priorities */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-medium text-white">
                  High-Priority Competency Gaps
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab("gaps")}
                  className="text-[11px] text-slate-400 hover:text-white transition-colors"
                >
                  View all ({skillGap.length}) →
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {skillGap.slice(0, 3).map((gap, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-white/[0.08] bg-[#0E1017] p-5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-white">
                        {gap.skill}
                      </span>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-mono uppercase ${
                          gap.severity === "High"
                            ? "border border-rose-500/30 bg-rose-500/10 text-rose-300"
                            : gap.severity === "Medium"
                            ? "border border-amber-500/30 bg-amber-500/10 text-amber-300"
                            : "border border-white/10 bg-white/[0.04] text-slate-300"
                        }`}
                      >
                        {gap.severity} Severity
                      </span>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-slate-400">
                      {gap.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Interview Question Preview */}
            {technicalQuestions.length > 0 && (
              <div className="rounded-2xl border border-white/[0.08] bg-[#0E1017] p-6">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[11px] font-medium tracking-wider text-slate-500 uppercase">
                    Sample Technical Scenario
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Question 01 of {technicalQuestions.length}
                  </span>
                </div>

                <h4 className="text-sm font-medium leading-relaxed text-white">
                  "{technicalQuestions[0].question}"
                </h4>

                <div className="mt-4 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                    <Lightbulb size={13} />
                    <span>Evaluator's Intention:</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-300">
                    {technicalQuestions[0].intention}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab("technical")}
                  className="mt-4 text-xs font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Review complete question deck & answers →
                </button>
              </div>
            )}

            {/* Preparation Roadmap Teaser */}
            {preperationPlan.length > 0 && (
              <div className="rounded-2xl border border-white/[0.08] bg-[#0E1017] p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-white">
                      Curated Study Roadmap
                    </h4>
                    <p className="text-xs text-slate-400">
                      Structured day-by-day plan to bridge detected gaps.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab("roadmap")}
                    className="text-xs font-medium text-slate-300 hover:text-white"
                  >
                    Open Roadmap ({totalTopicsCount} modules) →
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {preperationPlan.slice(0, 4).map((day) => (
                    <div
                      key={day.day}
                      className="rounded-xl border border-white/[0.06] bg-black/40 p-3.5"
                    >
                      <span className="font-mono text-[10px] text-slate-500 uppercase">
                        Day {day.day}
                      </span>
                      <div className="mt-2 space-y-1.5">
                        {day.topics?.slice(0, 2).map((t, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-1.5 text-xs text-slate-300"
                          >
                            <span className="h-1 w-1 rounded-full bg-slate-500" />
                            <span className="truncate">{t}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Skill Gaps Matrix */}
        {activeTab === "gaps" && (
          <div className="mt-8">
            {/* Filter Bar */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <SlidersHorizontal size={13} className="text-slate-400" />
                <span className="text-xs text-slate-400">Filter severity:</span>
                {["all", "High", "Medium", "Low"].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setGapFilter(lvl)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                      gapFilter === lvl
                        ? "bg-white/10 text-white"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {lvl.toUpperCase()}
                  </button>
                ))}
              </div>

              <span className="font-mono text-xs text-slate-500">
                Showing {filteredGaps.length} of {skillGap.length} competencies
              </span>
            </div>

            {filteredGaps.length === 0 ? (
              <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-[#0E1017] text-center">
                <p className="text-xs text-slate-400">No skill gaps found for this filter level.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {filteredGaps.map((gap, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0E1017] p-5 shadow-sm transition-all hover:border-white/20"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-sm font-medium text-white">
                          {gap.skill}
                        </h4>

                        <span
                          className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-mono uppercase ${
                            gap.severity === "High"
                              ? "border border-rose-500/30 bg-rose-500/10 text-rose-300"
                              : gap.severity === "Medium"
                              ? "border border-amber-500/30 bg-amber-500/10 text-amber-300"
                              : "border border-white/10 bg-white/[0.04] text-slate-300"
                          }`}
                        >
                          {gap.severity}
                        </span>
                      </div>

                      <p className="mt-3 text-xs leading-relaxed text-slate-400">
                        {gap.reason}
                      </p>
                    </div>

                    <div className="mt-4 border-t border-white/[0.04] pt-3 text-[11px] text-slate-500">
                      Recommended: Incorporate into Day 1-3 review
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Technical Questions */}
        {activeTab === "technical" && (
          <div className="mt-8 space-y-4">
            <div className="mb-2 text-xs text-slate-400">
              Test your technical articulation. Review each question before revealing
              the recommended response structure.
            </div>

            {technicalQuestions.map((q, idx) => {
              const qId = `tech-${idx}`;
              const isRevealed = revealedAnswers[qId];

              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/[0.08] bg-[#0E1017] p-5 shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] font-mono text-[11px] text-slate-400">
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="text-sm font-medium leading-relaxed text-white">
                          {q.question}
                        </h4>
                        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
                          <Lightbulb size={12} className="text-slate-500" />
                          <span>Intent: {q.intention}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleAnswer(qId)}
                      className="flex shrink-0 items-center gap-1 rounded-lg border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-xs text-slate-400 transition-colors hover:border-white/20 hover:text-white"
                    >
                      <span>{isRevealed ? "Hide Answer" : "Reveal Answer"}</span>
                      {isRevealed ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                  </div>

                  {isRevealed && (
                    <div className="mt-4 rounded-xl border border-white/[0.06] bg-black/40 p-4 transition-all duration-200">
                      <span className="text-[10px] font-medium tracking-wider text-slate-500 uppercase">
                        Recommended Response Architecture
                      </span>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-200 whitespace-pre-line">
                        {q.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 4: Behavioral Questions */}
        {activeTab === "behavioral" && (
          <div className="mt-8 space-y-4">
            <div className="mb-2 text-xs text-slate-400">
              Scenario and leadership questions designed to test culture, communication, and ownership.
            </div>

            {behaviouralQuestions.map((q, idx) => {
              const qId = `behav-${idx}`;
              const isRevealed = revealedAnswers[qId];

              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/[0.08] bg-[#0E1017] p-5 shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] font-mono text-[11px] text-slate-400">
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="text-sm font-medium leading-relaxed text-white">
                          {q.question}
                        </h4>
                        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
                          <Compass size={12} className="text-slate-500" />
                          <span>Intent: {q.intention}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleAnswer(qId)}
                      className="flex shrink-0 items-center gap-1 rounded-lg border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-xs text-slate-400 transition-colors hover:border-white/20 hover:text-white"
                    >
                      <span>{isRevealed ? "Hide Framework" : "Reveal Framework"}</span>
                      {isRevealed ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                  </div>

                  {isRevealed && (
                    <div className="mt-4 rounded-xl border border-white/[0.06] bg-black/40 p-4 transition-all duration-200">
                      <span className="text-[10px] font-medium tracking-wider text-slate-500 uppercase">
                        STAR Framework & Recommended Response
                      </span>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-200 whitespace-pre-line">
                        {q.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 5: Preparation Roadmap */}
        {activeTab === "roadmap" && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div>
                <h3 className="text-sm font-medium text-white">
                  Curated Day-by-Day Mastery Plan
                </h3>
                <p className="text-xs text-slate-400">
                  Track your preparation progress topic by topic.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">
                  Completed:
                </span>
                <span className="font-mono text-xs font-semibold text-white">
                  {completedTopicsCount} / {totalTopicsCount}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {preperationPlan.map((day) => (
                <div
                  key={day.day}
                  className="rounded-2xl border border-white/[0.08] bg-[#0E1017] p-5 shadow-sm"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-mono text-xs font-medium tracking-wide text-white">
                      DAY {day.day}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {day.topics?.length || 0} Modules
                    </span>
                  </div>

                  <div className="space-y-2">
                    {day.topics?.map((topic, tIdx) => {
                      const topicKey = `day-${day.day}-topic-${tIdx}`;
                      const isDone = completedTopics[topicKey];

                      return (
                        <div
                          key={tIdx}
                          onClick={() => toggleTopic(topicKey)}
                          className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 text-xs transition-all ${
                            isDone
                              ? "border-emerald-500/20 bg-emerald-500/[0.04] text-slate-400 line-through"
                              : "border-white/[0.05] bg-black/40 text-slate-200 hover:border-white/10 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                                isDone
                                  ? "border-emerald-500 bg-emerald-500 text-black"
                                  : "border-white/20 bg-white/[0.02]"
                              }`}
                            >
                              {isDone && <Check size={11} strokeWidth={3} />}
                            </div>
                            <span>{topic}</span>
                          </div>

                          <span className="font-mono text-[10px] text-slate-600">
                            {isDone ? "COMPLETE" : "PENDING"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Action Bar */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] pt-6">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 text-xs font-medium text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft size={14} />
            <span>Return to Workspace to run another assessment</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={isGeneratingPdf}
              onClick={handleDownloadResume}
              className={`flex items-center gap-1.5 rounded-lg border px-3.5 py-1.5 text-xs font-medium transition-all ${
                pdfSuccess
                  ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-300"
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:border-emerald-500/50 hover:bg-emerald-500/20 hover:text-white"
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 size={13} className="animate-spin text-emerald-400" />
                  <span>Synthesizing Resume...</span>
                </>
              ) : pdfSuccess ? (
                <>
                  <Check size={13} className="text-emerald-400" />
                  <span>Resume Downloaded</span>
                </>
              ) : (
                <>
                  <FileDown size={13} />
                  <span>Download Tailored Resume</span>
                </>
              )}
            </button>
            <span className="text-[11px] text-slate-600">
              Saved to Analysis Archive
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
