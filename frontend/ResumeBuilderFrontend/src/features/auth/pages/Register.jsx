import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import AIAnalysisLoader from "../components/Loading";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  Briefcase,
  GraduationCap,
  Sparkles,
  Calendar,
  ArrowRight,
  AlertCircle,
  Compass,
  FileText,
  ScanSearch,
  BrainCircuit,
  Target,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Check
} from "lucide-react";

// Platform workflow demonstration steps
const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Resume Ingestion",
    desc: "Parse work history, core technologies, and quantifiable achievements from your resume.",
    icon: FileText
  },
  {
    step: "02",
    title: "Job Delta Mapping",
    desc: "Cross-reference target role competencies to calculate exact skill alignment percentages.",
    icon: ScanSearch
  },
  {
    step: "03",
    title: "Targeted Assessment",
    desc: "Respond to dynamically generated scenario questions designed around detected gaps.",
    icon: BrainCircuit
  },
  {
    step: "04",
    title: "Adaptive Prep Roadmap",
    desc: "Receive a day-by-day learning schedule with interview problems and targeted system designs.",
    icon: Target
  }
];

const PROFESSION_OPTIONS = [
  {
    value: "Student",
    label: "Student",
    sublabel: "College / University",
    icon: GraduationCap
  },
  {
    value: "Fresher",
    label: "Fresher",
    sublabel: "Recent Graduate",
    icon: Sparkles
  },
  {
    value: "Working",
    label: "Working",
    sublabel: "Employed Professional",
    icon: Briefcase
  }
];

export default function Register() {
  const { handleRegister, loading } = useAuth();

  // Form State
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    contactNo: "",
    age: "",
    profession: "Student" // Matches mongoose enum default: ["Student", "Fresher", "Working"]
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeStep, setActiveStep] = useState(0);

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

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (errorMessage) setErrorMessage("");
  };

  // Restrict contact number strictly to max 10 digits
  const handleContactChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, ""); // Keep only numbers
    if (digitsOnly.length <= 10) {
      setFormData((prev) => ({
        ...prev,
        contactNo: digitsOnly
      }));
    }
    if (errorMessage) setErrorMessage("");
  };

  const setProfession = (val) => {
    setFormData((prev) => ({
      ...prev,
      profession: val
    }));
    if (errorMessage) setErrorMessage("");
  };

  // Password Security Evaluator
  const evaluatePassword = (password) => {
    if (!password) {
      return {
        score: 0,
        label: "Awaiting input",
        badge: "Untested",
        color: "text-slate-500",
        barColor: "bg-slate-700",
        criteria: {
          minLen: false,
          casing: false,
          number: false,
          symbol: false
        }
      };
    }

    const criteria = {
      minLen: password.length >= 8,
      casing: /[a-z]/.test(password) && /[A-Z]/.test(password),
      number: /\d/.test(password),
      symbol: /[^A-Za-z0-9]/.test(password)
    };

    const metCount = Object.values(criteria).filter(Boolean).length;

    if (metCount <= 1) {
      return {
        score: 1,
        label: "Basic Protection",
        badge: "Fragile",
        color: "text-rose-400",
        barColor: "bg-rose-500",
        criteria
      };
    }
    if (metCount === 2) {
      return {
        score: 2,
        label: "Standard Protection",
        badge: "Moderate",
        color: "text-amber-400",
        barColor: "bg-amber-400",
        criteria
      };
    }
    if (metCount === 3) {
      return {
        score: 3,
        label: "Fortified Protection",
        badge: "Strong",
        color: "text-emerald-400",
        barColor: "bg-emerald-400",
        criteria
      };
    }
    return {
      score: 4,
      label: "Vault-Grade Protection",
      badge: "Cryptographic",
      color: "text-white",
      barColor: "bg-white",
      criteria
    };
  };

  const passwordAnalysis = evaluatePassword(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const { username, email, password, contactNo, age, profession } = formData;

    if (!username || !email || !password || !contactNo || !age || !profession) {
      setErrorMessage("Please complete all profile fields.");
      return;
    }

    if (contactNo.length !== 10) {
      setErrorMessage("Contact number must be exactly 10 digits.");
      return;
    }

    const numericAge = Number(age);
    if (isNaN(numericAge) || numericAge < 18 || numericAge > 80) {
      setErrorMessage("Age must be between 18 and 80 years.");
      return;
    }

    try {
      await handleRegister({
        username,
        email,
        password,
        contactNo: Number(contactNo) || contactNo,
        age: numericAge,
        profession
      });
    } catch (err) {
      setErrorMessage(
        err?.message || "Registration encountered an error. Please try again."
      );
    }
  };

  const fillDemo = () => {
    setFormData({
      username: "alexvance",
      email: "alex.vance@precision.io",
      password: "ExecutiveSecurity#2026",
      contactNo: "9876543210",
      age: "24",
      profession: "Fresher"
    });
    setErrorMessage("");
  };

  // If loading, render the custom loader
  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#090A0F] p-4">
        <AIAnalysisLoader
          title="Creating your candidate workspace"
          compact={false}
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#090A0F] font-sans text-slate-100 antialiased selection:bg-white/10 selection:text-white">
      {/* Background Interactive Stardust Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-60"
      />

      {/* Subtle Restrained Ambient Lighting */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 right-1/3 h-[400px] w-[650px] -translate-y-1/2 rounded-full bg-slate-800/20 blur-[140px]" />
        <div className="absolute bottom-0 left-1/4 h-[350px] w-[550px] rounded-full bg-slate-900/40 blur-[150px]" />

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
              Already have an account?
            </span>
            <Link
              to="/login"
              className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 font-medium text-slate-300 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            >
              Sign In
            </Link>
          </div>
        </header>

        {/* Center Grid */}
        <main className="mx-auto my-auto w-full max-w-6xl py-6">
          <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-14">
            {/* ============================================================= */}
            {/* LEFT COLUMN: METHODOLOGY & WORKFLOW SHOWCASE                  */}
            {/* ============================================================= */}
            <div className="flex flex-col justify-center lg:col-span-5 xl:col-span-6">
              <div className="inline-flex items-center gap-2 self-start rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[11px] font-medium tracking-wide text-slate-300">
                <Sparkles size={12} className="text-slate-400" />
                <span>Intelligent Career Preparation</span>
              </div>

              <h1 className="mt-5 text-3xl font-light tracking-tight text-white sm:text-4xl lg:text-[40px] lg:leading-[1.18]">
                Engineered to eliminate uncertainty before every interview.
              </h1>

              <p className="mt-4 text-sm leading-relaxed text-slate-400 sm:text-base">
                Create your workspace to benchmark your experience directly against
                live job requirements. Discover exact skill discrepancies and practice
                the questions you will actually be asked.
              </p>

              {/* Workflow Stepper Preview */}
              <div className="mt-8 space-y-3">
                {WORKFLOW_STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const isActive = activeStep === idx;

                  return (
                    <div
                      key={step.step}
                      onClick={() => setActiveStep(idx)}
                      className={`group cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
                        isActive
                          ? "border-white/20 bg-white/[0.04]"
                          : "border-white/[0.05] bg-white/[0.015] hover:border-white/10 hover:bg-white/[0.025]"
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                            isActive
                              ? "border-white/20 bg-white/10 text-white"
                              : "border-white/[0.08] bg-white/[0.02] text-slate-500 group-hover:text-slate-300"
                          }`}
                        >
                          <Icon size={16} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xs font-medium text-slate-200">
                              {step.title}
                            </h3>
                            <span className="font-mono text-[10px] text-slate-600">
                              {step.step}
                            </span>
                          </div>
                          <p className="mt-1 text-xs leading-relaxed text-slate-400">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ============================================================= */}
            {/* RIGHT COLUMN: LUXURY REGISTRATION FORM CARD                  */}
            {/* ============================================================= */}
            <div className="flex flex-col justify-center lg:col-span-7 xl:col-span-6">
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
                      Create your account
                    </h2>

                    <button
                      type="button"
                      onClick={fillDemo}
                      className="cursor-pointer text-[11px] font-medium text-slate-400 transition-colors hover:text-white"
                    >
                      Autofill Sample
                    </button>
                  </div>

                  <p className="mt-1 text-xs text-slate-400">
                    Set up your credentials to begin generating targeted prep plans.
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
                  {/* Career Stage Selector: Student | Fresher | Working */}
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-300">
                      Career Stage <span className="text-slate-500 font-normal">(Select current status)</span>
                    </label>

                    <div className="grid grid-cols-3 gap-2">
                      {PROFESSION_OPTIONS.map((opt) => {
                        const Icon = opt.icon;
                        const isSelected = formData.profession === opt.value;

                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setProfession(opt.value)}
                            className={`group relative flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all duration-200 ${
                              isSelected
                                ? "border-white/30 bg-white/[0.09] text-white shadow-[0_0_20px_rgba(255,255,255,0.06)]"
                                : "border-white/[0.08] bg-black/40 text-slate-400 hover:border-white/20 hover:text-slate-200"
                            }`}
                          >
                            <Icon
                              size={16}
                              className={`mb-1 transition-colors ${
                                isSelected ? "text-white" : "text-slate-500 group-hover:text-slate-300"
                              }`}
                            />
                            <span className="text-xs font-medium leading-none">
                              {opt.label}
                            </span>
                            <span className="mt-1 text-[9px] text-slate-500">
                              {opt.sublabel}
                            </span>

                            {isSelected && (
                              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                <span className="h-full w-full rounded-full bg-white shadow-[0_0_6px_#fff]" />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Username / Full Name */}
                  <div>
                    <label
                      htmlFor="username"
                      className="mb-1.5 block text-xs font-medium text-slate-300"
                    >
                      Username
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                        <User size={15} />
                      </div>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="alexvance"
                        className="w-full rounded-xl border border-white/[0.08] bg-black/40 py-2.5 pr-3 pl-10 text-sm text-white placeholder-slate-600 transition-all duration-200 focus:border-white/25 focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-white/20"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-xs font-medium text-slate-300"
                    >
                      Email Address
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
                        placeholder="alex@precision.io"
                        className="w-full rounded-xl border border-white/[0.08] bg-black/40 py-2.5 pr-3 pl-10 text-sm text-white placeholder-slate-600 transition-all duration-200 focus:border-white/25 focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-white/20"
                      />
                    </div>
                  </div>

                  {/* Two Column Row: Contact & Age */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Contact Number (Strict 10 Digits) */}
                    <div>
                      <div className="mb-1.5 flex items-center justify-between">
                        <label
                          htmlFor="contactNo"
                          className="text-xs font-medium text-slate-300"
                        >
                          Contact Number
                        </label>
                        <span
                          className={`text-[10px] font-mono transition-colors ${
                            formData.contactNo.length === 10
                              ? "text-emerald-400 font-semibold"
                              : "text-slate-500"
                          }`}
                        >
                          {formData.contactNo.length}/10 digits
                        </span>
                      </div>

                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                          <Phone size={15} />
                        </div>
                        <input
                          id="contactNo"
                          name="contactNo"
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                          required
                          value={formData.contactNo}
                          onChange={handleContactChange}
                          placeholder="9876543210"
                          className={`w-full rounded-xl border bg-black/40 py-2.5 pr-3 pl-10 text-sm text-white placeholder-slate-600 transition-all duration-200 focus:bg-black/60 focus:outline-none focus:ring-1 ${
                            formData.contactNo.length === 10
                              ? "border-emerald-500/30 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                              : "border-white/[0.08] focus:border-white/25 focus:ring-white/20"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Age */}
                    <div>
                      <label
                        htmlFor="age"
                        className="mb-1.5 block text-xs font-medium text-slate-300"
                      >
                        Age (18 - 80)
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                          <Calendar size={15} />
                        </div>
                        <input
                          id="age"
                          name="age"
                          type="number"
                          min="18"
                          max="80"
                          required
                          value={formData.age}
                          onChange={handleChange}
                          placeholder="24"
                          className={`w-full rounded-xl border bg-black/40 py-2.5 pr-3 pl-10 text-sm text-white placeholder-slate-600 transition-all duration-200 focus:bg-black/60 focus:outline-none focus:ring-1 ${
                            formData.age && (Number(formData.age) < 18 || Number(formData.age) > 80)
                              ? "border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20"
                              : "border-white/[0.08] focus:border-white/25 focus:ring-white/20"
                          }`}
                        />
                      </div>
                      {formData.age && (Number(formData.age) < 18 || Number(formData.age) > 80) && (
                        <p className="mt-1 text-[10px] text-rose-400">
                          Age must be between 18 and 80
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Password Field with Creative Security Visuals */}
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-1.5 block text-xs font-medium text-slate-300"
                    >
                      Password
                    </label>

                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                        <Lock size={15} />
                      </div>

                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete="new-password"
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

                    {/* Creative Dynamic Password Security Vault Console */}
                    {formData.password && (
                      <div className="mt-2.5 rounded-xl border border-white/[0.06] bg-black/50 p-3 backdrop-blur-md">
                        {/* Status Header */}
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            {passwordAnalysis.score <= 1 ? (
                              <ShieldAlert size={14} className="text-rose-400" />
                            ) : passwordAnalysis.score <= 2 ? (
                              <Shield size={14} className="text-amber-400" />
                            ) : (
                              <ShieldCheck size={14} className="text-emerald-400" />
                            )}
                            <span className="text-[11px] font-medium text-slate-300">
                              {passwordAnalysis.label}
                            </span>
                          </div>

                          <span
                            className={`rounded-md border border-white/[0.08] px-2 py-0.5 text-[10px] font-mono font-semibold tracking-wider uppercase ${passwordAnalysis.color}`}
                          >
                            {passwordAnalysis.badge}
                          </span>
                        </div>

                        {/* 4-Segment Luminous Vault Bars */}
                        <div className="grid grid-cols-4 gap-1.5">
                          {[1, 2, 3, 4].map((step) => {
                            const isMet = passwordAnalysis.score >= step;
                            return (
                              <div
                                key={step}
                                className="h-1.5 overflow-hidden rounded-full bg-white/[0.08]"
                              >
                                <div
                                  className={`h-full transition-all duration-300 ${
                                    isMet ? passwordAnalysis.barColor : "w-0"
                                  }`}
                                  style={{ width: isMet ? "100%" : "0%" }}
                                />
                              </div>
                            );
                          })}
                        </div>

                        {/* Micro Criteria Verification Pills */}
                        <div className="mt-2.5 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                          {[
                            { label: "8+ Chars", met: passwordAnalysis.criteria.minLen },
                            { label: "Aa Cases", met: passwordAnalysis.criteria.casing },
                            { label: "0-9 Number", met: passwordAnalysis.criteria.number },
                            { label: "Symbol", met: passwordAnalysis.criteria.symbol }
                          ].map((crit) => (
                            <div
                              key={crit.label}
                              className={`flex items-center justify-center gap-1 rounded-md border px-1.5 py-1 text-[10px] transition-all duration-200 ${
                                crit.met
                                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 font-medium"
                                  : "border-white/[0.05] bg-white/[0.02] text-slate-500"
                              }`}
                            >
                              <Check
                                size={10}
                                className={crit.met ? "text-emerald-400" : "text-slate-600"}
                              />
                              <span>{crit.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Terms Notice */}
                  <p className="pt-1 text-[11px] leading-relaxed text-slate-500">
                    By registering, you agree to our terms of service and confidential
                    resume processing protocol.
                  </p>

                  {/* Luxury Crisp Sign Up Button */}
                  <button
                    type="submit"
                    className="group relative mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-slate-950 transition-all duration-200 hover:bg-slate-200 active:scale-[0.99]"
                  >
                    <span>Create Candidate Workspace</span>
                    <ArrowRight
                      size={15}
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </button>
                </form>

                {/* Login Footer Switcher */}
                <div className="relative mt-6 border-t border-white/[0.06] pt-5 text-center text-xs text-slate-500">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-slate-300 transition-colors hover:text-white hover:underline"
                  >
                    Sign in here
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
            <span className="hover:text-slate-400">Security</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
