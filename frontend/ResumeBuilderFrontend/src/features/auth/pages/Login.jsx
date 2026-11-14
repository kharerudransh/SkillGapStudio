import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import AIAnalysisLoader from "../components/Loading";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Check,
  Compass
} from "lucide-react";

// Subtle curated roles for live demonstration
const DEMO_PROFILES = [
  {
    id: "backend",
    role: "Senior Backend Engineer",
    target: "Stripe Core Infrastructure",
    alignment: "88%",
    strengths: ["Distributed Systems", "PostgreSQL", "Go / TypeScript"],
    focusAreas: ["Kafka Event Partitioning", "Idempotency Patterns"],
    diagnostic: "How would you ensure exactly-once semantics across distributed microservices?"
  },
  {
    id: "ai",
    role: "Applied AI Engineer",
    target: "Anthropic Model Systems",
    alignment: "82%",
    strengths: ["Vector Search", "Python", "Retrieval Pipelines"],
    focusAreas: ["vLLM Quantization", "Evaluation Benchmarks"],
    diagnostic: "Describe your approach to mitigating semantic drift in hybrid RAG retrieval."
  },
  {
    id: "systems",
    role: "Staff Platform Architect",
    target: "Netflix Edge & Cloud",
    alignment: "94%",
    strengths: ["Kubernetes", "AWS Infrastructure", "Terraform"],
    focusAreas: ["eBPF Kernel Profiling", "Zero-Trust Mesh"],
    diagnostic: "Walk through diagnosing intermittent network jitter across multi-cloud clusters."
  }
];

export default function Login() {
  const { handleLogin, loading } = useAuth();

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeProfile, setActiveProfile] = useState("backend");

  // Mouse spotlight coordinates
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const cardRef = useRef(null);
  const canvasRef = useRef(null);

  // Track mouse on card for subtle dynamic spotlight
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Subtle interactive stardust constellation canvas
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

    // Fine, quiet particles
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

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();

        // Subtle interconnecting lines
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

        // Quiet attraction to mouse
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

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.email || !formData.password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    try {
      await handleLogin({
        email: formData.email,
        password: formData.password
      });
    } catch (err) {
      setErrorMessage(
        err?.message || "Invalid credentials. Please try again."
      );
    }
  };

  const fillDemo = () => {
    setFormData({
      email: "architect@resumebuilder.io",
      password: "ExecutiveSecurity#2026"
    });
    setErrorMessage("");
  };

  // If loading, render the custom loader
  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#090A0F] p-4">
        <AIAnalysisLoader
          title="Authenticating your session"
          compact={false}
        />
      </div>
    );
  }

  const selectedData =
    DEMO_PROFILES.find((p) => p.id === activeProfile) || DEMO_PROFILES[0];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#090A0F] font-sans text-slate-100 antialiased selection:bg-white/10 selection:text-white">
      {/* Background Interactive Stardust Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-60"
      />

      {/* Subtle, restrained ambient lighting */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {/* Soft upper glow */}
        <div className="absolute top-0 left-1/2 h-[380px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-800/20 blur-[130px]" />
        {/* Bottom subtle aura */}
        <div className="absolute bottom-0 right-1/4 h-[300px] w-[500px] rounded-full bg-slate-900/40 blur-[140px]" />

        {/* Delicate structural grid */}
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
      <div className="relative z-10 flex min-h-screen flex-col justify-between px-6 py-8 sm:px-10 lg:px-16">
        {/* Top Minimal Navigation Bar */}
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between pb-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
              <Compass size={16} className="text-slate-200" />
            </div>
            <span className="text-sm font-medium tracking-tight text-white">
              SkillGap<span className="text-slate-400">Studio</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="hidden text-slate-500 sm:inline">
              Need access?
            </span>
            <Link
              to="/register"
              className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 font-medium text-slate-300 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            >
              Create Account
            </Link>
          </div>
        </header>

        {/* Center Grid */}
        <main className="mx-auto my-auto w-full max-w-6xl py-6">
          <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-14">
            {/* ============================================================= */}
            {/* LEFT COLUMN: SOPHISTICATED PRODUCT INTELLIGENCE SHOWCASE     */}
            {/* ============================================================= */}
            <div className="flex flex-col justify-center lg:col-span-6 xl:col-span-7">
              <div className="inline-flex items-center gap-2 self-start rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[11px] font-medium tracking-wide text-slate-300">
                <Sparkles size={12} className="text-slate-400" />
                <span>Precision Career Gap Analysis</span>
              </div>

              <h1 className="mt-5 text-3xl font-light tracking-tight text-white sm:text-4xl lg:text-[42px] lg:leading-[1.15]">
                Bridging candidate profiles to target specifications.
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
                Upload your resume and any job description. Our engine pinpoints
                critical competency deltas, asks targeted situational questions,
                and crafts a structured preparation plan.
              </p>

              {/* Interactive Demonstration Panel */}
              <div className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-md">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-[11px] font-medium tracking-wider text-slate-500 uppercase">
                    Interactive Alignment Preview
                  </span>

                  <div className="flex items-center gap-1">
                    {DEMO_PROFILES.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setActiveProfile(p.id)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                          activeProfile === p.id
                            ? "bg-white/10 text-white"
                            : "text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        {p.role.split(" ")[1] || p.role}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Profile Detail Card */}
                <div className="rounded-xl border border-white/[0.06] bg-[#0c0e14] p-4.5">
                  <div className="flex items-start justify-between border-b border-white/[0.06] pb-3.5">
                    <div>
                      <h4 className="text-sm font-medium text-white">
                        {selectedData.role}
                      </h4>
                      <p className="mt-0.5 text-xs text-slate-400">
                        Target Role: {selectedData.target}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] tracking-wider text-slate-500 uppercase">
                        Match Score
                      </span>
                      <div className="text-base font-semibold text-slate-200">
                        {selectedData.alignment}
                      </div>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="mt-3.5 space-y-2.5 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-500">
                        Demonstrated Competencies
                      </span>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {selectedData.strengths.map((s) => (
                          <span
                            key={s}
                            className="inline-flex items-center gap-1 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[11px] text-slate-300"
                          >
                            <Check size={11} className="text-slate-400" />
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-1">
                      <span className="text-[11px] text-slate-400">
                        Identified Gaps for Prep Plan
                      </span>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {selectedData.focusAreas.map((f) => (
                          <span
                            key={f}
                            className="rounded-md border border-slate-700/60 bg-slate-800/40 px-2 py-0.5 text-[11px] text-slate-300"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Curated Question */}
                  <div className="mt-3.5 rounded-lg border border-white/[0.05] bg-white/[0.015] p-3">
                    <span className="text-[10px] font-medium tracking-wider text-slate-500 uppercase">
                      Curated Diagnostic Assessment
                    </span>
                    <p className="mt-1 text-xs leading-relaxed text-slate-300">
                      "{selectedData.diagnostic}"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ============================================================= */}
            {/* RIGHT COLUMN: LUXURY MINIMALIST AUTHENTICATION FORM          */}
            {/* ============================================================= */}
            <div className="flex flex-col justify-center lg:col-span-6 xl:col-span-5">
              <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0E1017]/80 p-7 shadow-2xl backdrop-blur-xl sm:p-9"
                style={{
                  boxShadow:
                    "0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)"
                }}
              >
                {/* Subtle Interactive Mouse Spotlight */}
                <div
                  className="pointer-events-none absolute -inset-px transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.04), transparent 80%)`
                  }}
                />

                {/* Form Header */}
                <div className="relative mb-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-medium tracking-tight text-white sm:text-2xl">
                      Sign in
                    </h2>

                    <button
                      type="button"
                      onClick={fillDemo}
                      className="cursor-pointer text-[11px] font-medium text-slate-400 transition-colors hover:text-white"
                    >
                      Use Demo Account
                    </button>
                  </div>

                  <p className="mt-1 text-xs text-slate-400">
                    Access your workspace and saved gap evaluations.
                  </p>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="relative mb-5 flex items-center gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/[0.06] p-3 text-xs text-rose-300">
                    <AlertCircle size={15} className="shrink-0 text-rose-400" />
                    <span className="flex-1">{errorMessage}</span>
                  </div>
                )}

                {/* Form Controls */}
                <form onSubmit={handleSubmit} className="relative space-y-4">
                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-xs font-medium text-slate-300"
                    >
                      Email
                    </label>

                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                        <Mail size={15} />
                      </div>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@company.com"
                        className="w-full rounded-xl border border-white/[0.08] bg-black/40 py-2.5 pr-4 pl-10 text-sm text-white placeholder-slate-600 transition-all duration-200 focus:border-white/25 focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-white/20"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="text-xs font-medium text-slate-300"
                      >
                        Password
                      </label>

                      <a
                        href="#reset"
                        onClick={(e) => {
                          e.preventDefault();
                          alert("Please reset password using the backend API endpoint or contact support.");
                        }}
                        className="text-[11px] text-slate-500 transition-colors hover:text-slate-300"
                      >
                        Forgot password?
                      </a>
                    </div>

                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                        <Lock size={15} />
                      </div>

                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••••••"
                        className="w-full rounded-xl border border-white/[0.08] bg-black/40 py-2.5 pr-10 pl-10 text-sm text-white placeholder-slate-600 transition-all duration-200 focus:border-white/25 focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-white/20"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 transition-colors hover:text-slate-300"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  {/* Session Persistence */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-400">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-3.5 w-3.5 rounded border-white/20 bg-black/50 accent-white"
                      />
                      <span>Stay signed in for 30 days</span>
                    </label>
                  </div>

                  {/* Luxury Crisp Sign In Button */}
                  <button
                    type="submit"
                    className="group relative mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-slate-950 transition-all duration-200 hover:bg-slate-200 active:scale-[0.99]"
                  >
                    <span>Continue to Workspace</span>
                    <ArrowRight
                      size={15}
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </button>
                </form>

                {/* Footer Switcher */}
                <div className="relative mt-6 border-t border-white/[0.06] pt-5 text-center text-xs text-slate-500">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-slate-300 transition-colors hover:text-white hover:underline"
                  >
                    Create account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Minimal Footer */}
        <footer className="mx-auto flex w-full max-w-6xl items-center justify-between border-t border-white/[0.04] pt-6 text-[11px] text-slate-600">
          <div>© {new Date().getFullYear()} SkillGap Studio. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400">Privacy</span>
            <span className="hover:text-slate-400">Terms</span>
            <span className="hover:text-slate-400">System Status</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
