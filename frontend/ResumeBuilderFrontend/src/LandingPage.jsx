import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import {
  Compass,
  ArrowRight,
  Sparkles,
  FileText,
  ScanSearch,
  BrainCircuit,
  Target,
  Cpu,
  ArrowUpRight,
  Check,
  X,
  FileDown
} from "lucide-react";

const DEMO_SIMULATION = [
  {
    id: "fullstack",
    title: "Senior Full-Stack Engineer",
    company: "Stripe // Platform Core",
    score: 86,
    matched: ["React 19", "Node.js", "TypeScript", "PostgreSQL", "REST APIs"],
    gaps: [
      { name: "Distributed Kafka Streaming", severity: "High" },
      { name: "Redis Cache Sharding", severity: "Medium" }
    ],
    sampleQuestion:
      "How would you ensure exactly-once webhook processing across distributed Node.js microservices under intermittent network partitions?",
    tailoredBadge: "Kafka & Redis Resilience Resume Synthesized"
  },
  {
    id: "ai",
    title: "Applied Generative AI Engineer",
    company: "Anthropic // Retrieval Core",
    score: 79,
    matched: ["Python", "PyTorch", "FastAPI", "Vector DBs", "OpenAI API"],
    gaps: [
      { name: "Hybrid Dense/Sparse RAG Evaluation", severity: "High" },
      { name: "vLLM Model Quantization", severity: "Medium" }
    ],
    sampleQuestion:
      "Explain the latency versus recall trade-offs between HNSW dense indexing and BM25 sparse keyword ranking in multi-tenant RAG systems.",
    tailoredBadge: "Hybrid RAG & Quantization Resume Synthesized"
  },
  {
    id: "devops",
    title: "Platform Infrastructure & SRE",
    company: "Netflix // Edge Streaming",
    score: 92,
    matched: ["Kubernetes", "Docker", "Terraform", "AWS Core", "CI/CD"],
    gaps: [
      { name: "eBPF Kernel Tracing", severity: "High" },
      { name: "Istio Service Mesh Security", severity: "Medium" }
    ],
    sampleQuestion:
      "Walk through diagnosing an intermittent 200ms latency spike in an ingress envoy proxy without restarting live Kubernetes pods.",
    tailoredBadge: "eBPF & Istio Mesh Resume Synthesized"
  }
];

const WORKFLOW_STEPS = [
  {
    num: "01",
    title: "Ingest Candidate Resume",
    tag: "DOCUMENT PARSING",
    desc: "Our neural parser ingests your PDF, extracting verified technical stack, tenure, and quantifiable career achievements.",
    icon: FileText
  },
  {
    num: "02",
    title: "Job Delta Mapping",
    tag: "SEMANTIC ALIGNMENT",
    desc: "Cross-references your profile against target job responsibilities to compute exact alignment and pinpoint missing competencies.",
    icon: ScanSearch
  },
  {
    num: "03",
    title: "Dynamic Question Deck",
    tag: "SCENARIO TESTING",
    desc: "Generates real-world technical and behavioral interview scenarios built specifically to probe the identified gap areas.",
    icon: BrainCircuit
  },
  {
    num: "04",
    title: "Day-by-Day Mastery Plan",
    tag: "ADAPTIVE ROADMAP",
    desc: "Synthesizes a structured daily learning roadmap with actionable modules, system design topics, and interactive checklists.",
    icon: Target
  },
  {
    num: "05",
    title: "Tailored Resume Synthesis",
    tag: "ATS PDF EXPORT",
    desc: "Generates an updated, job-targeted resume with 1-click PDF download that bridges detected competency gaps.",
    icon: FileDown
  }
];

const COMPARISONS = [
  {
    feature: "ATS Keyword Matching vs Semantic Depth",
    traditional: "Dumb keyword counting (fails if synonyms used)",
    skillgap: "Semantic vector embeddings understand actual architectural competence"
  },
  {
    feature: "Gap Detection Actionability",
    traditional: "Generic 'Improve resume' score with zero next steps",
    skillgap: "Pinpoints exact severity levels (High/Medium) with root causes"
  },
  {
    feature: "Interview Preparation Integration",
    traditional: "None (leaves candidate guessing what will be asked)",
    skillgap: "Generates evaluator-grade technical & behavioral questions around gaps"
  },
  {
    feature: "Execution & Learning Path",
    traditional: "Static feedback report with no study structure",
    skillgap: "Curated day-by-day preparation roadmap with interactive progress tracking"
  },
  {
    feature: "Role-Tailored Resume Generation",
    traditional: "Manual rewriting in Word with zero gap awareness",
    skillgap: "Automated 1-click ATS resume synthesis engineered directly from report findings"
  }
];

export default function LandingPage() {
  const [activePreset, setActivePreset] = useState("fullstack");
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  const canvasRef = useRef(null);
  const heroCardRef = useRef(null);

  // Background Interactive Stardust Canvas
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

    const count = 40;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 1.2 + 0.5,
      opacity: Math.random() * 0.35 + 0.15
    }));

    let mouseCoords = { x: -1000, y: -1000 };
    const onMouseMove = (e) => {
      mouseCoords = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMouseMove);

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
        if (mouseDist < 140) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouseCoords.x, mouseCoords.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.12 * (1 - mouseDist / 140)})`;
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
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  const handleCardMouseMove = (e) => {
    if (!heroCardRef.current) return;
    const rect = heroCardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const selectedSimulation =
    DEMO_SIMULATION.find((s) => s.id === activePreset) || DEMO_SIMULATION[0];

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#090A0F] font-sans text-slate-100 antialiased selection:bg-white/10 selection:text-white">
      {/* Background Interactive Stardust Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-60"
      />

      {/* Restrained Ambient Glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/2 h-[500px] w-[850px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-800/15 blur-[160px]" />
        <div className="absolute top-1/3 right-1/4 h-[400px] w-[600px] rounded-full bg-slate-900/35 blur-[170px]" />
        <div className="absolute bottom-10 left-1/4 h-[450px] w-[650px] rounded-full bg-slate-800/15 blur-[160px]" />

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

      {/* Main Content Viewport */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Navigation Bar */}
        <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#090A0F]/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 sm:px-10">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                <Compass size={16} className="text-slate-200" />
              </div>
              <span className="text-sm font-medium tracking-tight text-white">
                SkillGap<span className="text-slate-400">Studio</span>
              </span>
            </Link>

            {/* Nav Links */}
            <nav className="hidden items-center gap-6 text-xs text-slate-400 sm:flex">
              <a href="#how-it-works" className="transition-colors hover:text-white">
                Methodology
              </a>
              <a href="#simulator" className="transition-colors hover:text-white">
                Live Simulator
              </a>
              <a href="#resume-engine" className="transition-colors hover:text-white">
                Resume Engine
              </a>
              <a href="#comparison" className="transition-colors hover:text-white">
                Comparison
              </a>
            </nav>

            {/* Auth Actions */}
            <div className="flex items-center gap-3 text-xs font-medium">
              <Link
                to="/login"
                className="text-slate-400 transition-colors hover:text-white"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-white px-4 py-2 text-slate-950 transition-colors hover:bg-slate-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* HERO SECTION                                                              */}
        {/* ========================================================================= */}
        <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 pt-16 pb-20 text-center sm:px-10 lg:pt-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-slate-300">
            <Sparkles size={12} className="text-slate-400" />
            <span>AI Career Gap Intelligence, Scenario Simulator & Resume Synthesis</span>
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-light tracking-tight text-white sm:text-6xl sm:leading-[1.12]">
            Never walk into an interview <br className="hidden sm:inline" />
            <span className="font-normal text-white">uncertain of what you will be asked.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Upload your resume alongside any target job description. Our AI analyzes
            competency deltas, generates tailored technical interview scenarios, crafts a
            day-by-day mastery plan, and synthesizes an ATS-ready resume bridging your detected gaps.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/register"
              className="group flex cursor-pointer items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-medium text-slate-950 transition-all hover:bg-slate-200 active:scale-[0.99]"
            >
              <span>Launch Free Workspace</span>
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <a
              href="#simulator"
              className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3.5 text-sm font-medium text-slate-300 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            >
              <span>Test Live Simulator</span>
              <ArrowUpRight size={14} className="text-slate-500" />
            </a>
          </div>

          {/* Key Metrics Strip */}
          <div className="mt-14 grid w-full max-w-4xl grid-cols-2 gap-4 border-y border-white/[0.06] py-6 sm:grid-cols-4">
            <div>
              <div className="font-mono text-2xl font-light text-white">94.8%</div>
              <div className="mt-0.5 text-[11px] text-slate-500">Skill Alignment Accuracy</div>
            </div>
            <div>
              <div className="font-mono text-2xl font-light text-white">Dynamic</div>
              <div className="mt-0.5 text-[11px] text-slate-500">Gap-Driven Question Deck</div>
            </div>
            <div>
              <div className="font-mono text-2xl font-light text-white">7-Day</div>
              <div className="mt-0.5 text-[11px] text-slate-500">Structured Roadmap</div>
            </div>
            <div>
              <div className="font-mono text-2xl font-light text-emerald-400">1-Click</div>
              <div className="mt-0.5 text-[11px] text-slate-500">Tailored Resume PDF</div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* INTERACTIVE LIVE SIMULATOR FLIGHT DECK                                    */}
        {/* ========================================================================= */}
        <section id="simulator" className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-medium tracking-wider text-slate-500 uppercase">
                Interactive Demonstration
              </span>
              <h2 className="mt-1 text-2xl font-light text-white sm:text-3xl">
                Experience the Gap Intelligence Cockpit
              </h2>
            </div>

            {/* Role presets */}
            <div className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.02] p-1">
              {DEMO_SIMULATION.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActivePreset(s.id)}
                  className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    activePreset === s.id
                      ? "bg-white/10 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {s.title.split(" ")[1] || s.title}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Card with Mouse Spotlight */}
          <div
            ref={heroCardRef}
            onMouseMove={handleCardMouseMove}
            className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0E1017] p-6 shadow-2xl backdrop-blur-xl sm:p-8"
          >
            {/* Subtle Mouse Spotlight Sheen */}
            <div
              className="pointer-events-none absolute -inset-px transition-opacity duration-300"
              style={{
                background: `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.04), transparent 80%)`
              }}
            />

            <div className="relative z-10 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
              {/* Left Column: Role Details & Alignment Dial */}
              <div className="flex flex-col justify-between border-b border-white/[0.06] pb-6 lg:col-span-5 lg:border-r lg:border-b-0 lg:pr-8 lg:pb-0">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-slate-400">
                      LIVE DELTA CALCULATION
                    </span>
                    <span className="text-xs text-slate-500">{selectedSimulation.company}</span>
                  </div>

                  <h3 className="mt-3 text-lg font-medium text-white sm:text-xl">
                    {selectedSimulation.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Calculated alignment against live engineering job description.
                  </p>

                  {/* Circular Alignment Meter */}
                  <div className="mt-6 flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-black/40 p-4">
                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
                      <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-white/[0.08]"
                          strokeWidth="3.2"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-white transition-all duration-700"
                          strokeDasharray={`${selectedSimulation.score}, 100`}
                          strokeWidth="3.2"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span className="absolute font-mono text-sm font-medium text-white">
                        {selectedSimulation.score}%
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] tracking-wider text-slate-500 uppercase">
                        Candidate Fit Index
                      </span>
                      <div className="text-sm font-medium text-white">
                        {selectedSimulation.score >= 85
                          ? "Direct Match Tier"
                          : "High Competency Potential"}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {selectedSimulation.gaps.length} bridge areas to prepare
                      </span>
                    </div>
                  </div>
                </div>

                {/* Matched Competencies */}
                <div className="mt-6">
                  <span className="text-[11px] font-medium text-slate-400">
                    Demonstrated Skills Extracted:
                  </span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selectedSimulation.matched.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[11px] text-slate-300"
                      >
                        <Check size={10} className="text-slate-400" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Detected Gaps & Dynamic Question Generator */}
              <div className="flex flex-col justify-between space-y-6 lg:col-span-7">
                {/* Detected Gaps */}
                <div>
                  <span className="text-[11px] font-medium tracking-wider text-slate-400 uppercase">
                    Critical Competency Discrepancies
                  </span>

                  <div className="mt-3 space-y-2.5">
                    {selectedSimulation.gaps.map((gap) => (
                      <div
                        key={gap.name}
                        className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-black/40 p-3"
                      >
                        <div className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                          <span className="text-xs font-medium text-white">{gap.name}</span>
                        </div>
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-mono uppercase ${
                            gap.severity === "High"
                              ? "border border-rose-500/30 bg-rose-500/10 text-rose-300"
                              : "border border-amber-500/30 bg-amber-500/10 text-amber-300"
                          }`}
                        >
                          {gap.severity} Severity
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Autogenerated Interview Scenario */}
                <div className="rounded-2xl border border-white/[0.06] bg-black/50 p-4.5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 uppercase">
                      <Cpu size={13} className="text-slate-500" />
                      Dynamic Scenario Generated From Gaps
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">PROPRIETARY</span>
                  </div>

                  <p className="mt-2 text-xs leading-relaxed text-slate-200">
                    "{selectedSimulation.sampleQuestion}"
                  </p>

                  <div className="mt-3 border-t border-white/[0.04] pt-2 text-[10px] text-slate-500">
                    Evaluator intention: Tests distributed failure modes and transactional guarantees.
                  </div>
                </div>

                {/* AI Tailored Resume Output Pill */}
                <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-3 text-xs">
                  <div className="flex items-center gap-2">
                    <FileDown size={14} className="text-emerald-400" />
                    <span className="text-slate-300 font-medium">
                      {selectedSimulation.tailoredBadge}
                    </span>
                  </div>
                  <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-300">
                    1-CLICK PDF
                  </span>
                </div>

                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-white transition-colors hover:text-slate-300"
                >
                  <span>Evaluate your own resume with this engine</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* HOW IT WORKS / METHODOLOGY                                                */}
        {/* ========================================================================= */}
        <section id="how-it-works" className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10">
          <div className="text-center">
            <span className="text-[11px] font-medium tracking-wider text-slate-500 uppercase">
              The 5-Pillar Pipeline
            </span>
            <h2 className="mt-2 text-2xl font-light text-white sm:text-3xl">
              From Raw PDF to Complete Interview Readiness & Tailored Resume
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-xs text-slate-400 sm:text-sm">
              Traditional platforms stop at keywords. We turn your delta into a
              structured study plan, scenario simulator, and target-aligned resume.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {WORKFLOW_STEPS.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.num}
                  className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0E1017] p-6 shadow-sm transition-all duration-300 hover:border-white/20 hover:bg-[#11131C]"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-300 transition-colors group-hover:border-white/20 group-hover:text-white">
                        <Icon size={18} />
                      </div>
                      <span className="font-mono text-xs font-medium text-slate-600">
                        {s.num}
                      </span>
                    </div>

                    <span className="mt-4 block font-mono text-[10px] tracking-wider text-slate-500 uppercase">
                      {s.tag}
                    </span>
                    <h3 className="mt-1 text-sm font-medium text-white">{s.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-400">{s.desc}</p>
                  </div>

                  <div className="mt-6 border-t border-white/[0.04] pt-3 text-[10px] text-slate-500">
                    Zero guesswork before interview day.
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* RESUME SYNTHESIS ENGINE SHOWCASE                                          */}
        {/* ========================================================================= */}
        <section id="resume-engine" className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10">
          <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-[#0E1318] via-[#0E1017] to-[#0A0E14] p-8 shadow-2xl sm:p-12">
            {/* Ambient Lighting Sheen */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-emerald-500/10 blur-[100px]" />
            <div className="pointer-events-none absolute -left-16 -bottom-16 h-72 w-72 rounded-full bg-slate-800/20 blur-[100px]" />

            <div className="relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
              {/* Left Column: Description & Feature Highlights */}
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-[11px] font-medium tracking-wide text-emerald-300">
                  <Sparkles size={12} className="text-emerald-400" />
                  <span>NEW CAPABILITY · AI RESUME SYNTHESIS</span>
                </div>

                <h2 className="mt-4 text-2xl font-light tracking-tight text-white sm:text-4xl sm:leading-tight">
                  Turn Gap Analysis Into a <br className="hidden sm:inline" />
                  <span className="font-normal text-white">Targeted, ATS-Optimized Resume.</span>
                </h2>

                <p className="mt-4 text-xs leading-relaxed text-slate-400 sm:text-sm">
                  Identifying skill gaps is only half the battle. Once your interview evaluation deck is generated, SkillGapStudio automatically synthesizes a tailor-made resume engineered to match the employer's expectations while bridging detected discrepancies.
                </p>

                {/* 3 Value Pillars */}
                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                      <Check size={14} />
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-white sm:text-sm">
                        Semantic Job Alignment
                      </h4>
                      <p className="mt-0.5 text-xs text-slate-400">
                        Restructures your technical skill taxonomy and achievements around the exact vocabulary of the job description.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                      <Check size={14} />
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-white sm:text-sm">
                        Strategic Gap Remediation
                      </h4>
                      <p className="mt-0.5 text-xs text-slate-400">
                        Contextualizes your project contributions to address high and medium severity competencies flagged in your interview report.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                      <Check size={14} />
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-white sm:text-sm">
                        Instant PDF Production
                      </h4>
                      <p className="mt-0.5 text-xs text-slate-400">
                        Downloads a publication-grade, ATS-compatible PDF resume with zero formatting bugs in a single click.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    to="/register"
                    className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-medium text-slate-950 transition-colors hover:bg-slate-200"
                  >
                    <span>Generate Tailored Resume</span>
                    <ArrowRight size={14} />
                  </Link>

                  <span className="text-[11px] text-slate-500">
                    Integrated directly inside your evaluation report deck.
                  </span>
                </div>
              </div>

              {/* Right Column: Visual Mockup Card */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-white/10 bg-black/60 p-5 shadow-2xl backdrop-blur-xl">
                  {/* Header of mock resume */}
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                        <FileText size={16} className="text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-xs font-medium text-white">Synthesized_Resume.pdf</div>
                        <div className="text-[10px] text-slate-500">Auto-tailored from Report ID #9f2a</div>
                      </div>
                    </div>
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-300">
                      ATS 98%
                    </span>
                  </div>

                  {/* Body preview */}
                  <div className="mt-4 space-y-3 font-mono text-[11px]">
                    <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-3">
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Target Role Match</span>
                        <span className="text-white">Senior Platform Engineer</span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full rounded-full bg-white/[0.08]">
                        <div className="h-1.5 rounded-full bg-emerald-400" style={{ width: "94%" }} />
                      </div>
                    </div>

                    <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-3">
                      <div className="text-[10px] uppercase text-slate-500">Addressed Gap Competencies</div>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-300">
                          ✓ Kafka Event Mesh
                        </span>
                        <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-300">
                          ✓ Distributed Caching
                        </span>
                        <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-300">
                          ✓ Envoy Ingress
                        </span>
                      </div>
                    </div>

                    <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-3">
                      <div className="text-[10px] uppercase text-slate-500">Quantified Impact Bullets</div>
                      <p className="mt-1 text-[10px] font-sans leading-relaxed text-slate-300">
                        "Re-architected real-time ingestion pipelines using distributed streaming, mitigating network partition latency by 34%."
                      </p>
                    </div>
                  </div>

                  {/* Mock Action */}
                  <div className="mt-4 flex items-center justify-between border-t border-white/[0.08] pt-3.5">
                    <span className="text-[10px] text-slate-500">Format: Standard PDF/A-1</span>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                      <FileDown size={14} />
                      <span>1-Click Download</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* COMPARISON MATRIX                                                         */}
        {/* ========================================================================= */}
        <section id="comparison" className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10">
          <div className="mb-10 text-center">
            <span className="text-[11px] font-medium tracking-wider text-slate-500 uppercase">
              Architectural Differentiation
            </span>
            <h2 className="mt-2 text-2xl font-light text-white sm:text-3xl">
              Why Keyword Checkers Fail Real Candidates
            </h2>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0E1017]">
            <div className="grid grid-cols-12 border-b border-white/[0.06] bg-black/40 px-6 py-4 text-xs font-medium">
              <div className="col-span-4 text-slate-400">Analysis Dimension</div>
              <div className="col-span-4 text-slate-500">Traditional ATS Tools</div>
              <div className="col-span-4 text-white">SkillGapStudio</div>
            </div>

            <div className="divide-y divide-white/[0.04]">
              {COMPARISONS.map((row, i) => (
                <div
                  key={i}
                  className="grid grid-cols-12 items-center px-6 py-4 text-xs transition-colors hover:bg-white/[0.015]"
                >
                  <div className="col-span-4 font-medium text-slate-300">
                    {row.feature}
                  </div>
                  <div className="col-span-4 pr-4 text-slate-500">
                    <div className="flex items-start gap-1.5">
                      <X size={13} className="shrink-0 text-slate-600 mt-0.5" />
                      <span>{row.traditional}</span>
                    </div>
                  </div>
                  <div className="col-span-4 text-slate-200">
                    <div className="flex items-start gap-1.5">
                      <Check size={13} className="shrink-0 text-slate-300 mt-0.5" />
                      <span>{row.skillgap}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* BOTTOM CALL TO ACTION BANNER                                              */}
        {/* ========================================================================= */}
        <section className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10">
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0E1017] p-8 text-center sm:p-14">
            <div className="relative z-10 mx-auto max-w-2xl">
              <span className="text-[11px] font-medium tracking-wider text-slate-500 uppercase">
                Accelerate Your Next Senior Leap
              </span>

              <h2 className="mt-3 text-3xl font-light text-white sm:text-4xl">
                Ready to benchmark your resume with surgical precision?
              </h2>

              <p className="mt-4 text-xs leading-relaxed text-slate-400 sm:text-sm">
                Join students, fresh graduates, and senior platform engineers who use
                SkillGapStudio to master technical interviews.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/register"
                  className="rounded-2xl bg-white px-7 py-3.5 text-sm font-medium text-slate-950 transition-colors hover:bg-slate-200"
                >
                  Create Candidate Account
                </Link>
                <Link
                  to="/login"
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-slate-300 transition-colors hover:border-white/20 hover:text-white"
                >
                  Sign In to Workspace
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Minimal Luxury Footer */}
        <footer className="mt-auto border-t border-white/[0.06] py-8 text-xs text-slate-500">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 sm:px-10">
            <div className="flex items-center gap-2">
              <Compass size={14} className="text-slate-400" />
              <span className="text-slate-300">SkillGapStudio</span>
              <span className="text-slate-600">·</span>
              <span>© {new Date().getFullYear()} All rights reserved.</span>
            </div>

            <div className="flex items-center gap-5">
              <Link to="/login" className="hover:text-slate-300 transition-colors">
                Login
              </Link>
              <Link to="/register" className="hover:text-slate-300 transition-colors">
                Register
              </Link>
              <a href="#simulator" className="hover:text-slate-300 transition-colors">
                Simulator
              </a>
              <a href="#resume-engine" className="hover:text-slate-300 transition-colors">
                Resume Engine
              </a>
              <span className="text-slate-600">System Live</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
