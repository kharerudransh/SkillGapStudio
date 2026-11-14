
import React from "react";
import { ShieldCheck } from "lucide-react";

export default function Loading({
  text = "Please wait...",
  subtitle = "We're securely processing your request."
}) {
  return (
    <div className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center bg-[#090A0F] px-4 font-sans text-slate-100">

      {/* Subtle background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "64px 64px"
        }}
      />

      {/* Loading card */}
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0E1017]/90 px-8 py-10 text-center shadow-2xl shadow-black/40 backdrop-blur-xl">

        {/* Top border detail */}
        <div className="absolute left-10 right-10 top-0 h-px bg-white/20" />

        {/* Spinner */}
        <div className="relative mx-auto mb-7 flex h-[76px] w-[76px] items-center justify-center">

          <div className="absolute inset-0 rounded-full border border-white/[0.08]" />

          <div className="absolute inset-0 animate-spin rounded-full border-[2px] border-transparent border-t-[#e5e5e5] border-r-[#777777]" />

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]">
            <ShieldCheck
              size={23}
              strokeWidth={1.5}
              className="text-slate-200"
            />
          </div>
        </div>

        {/* Status */}
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-300" />
          <span className="text-[10px] font-medium tracking-[0.18em] text-slate-400">
            PROCESSING
          </span>
        </div>

        <h2 className="text-lg font-medium tracking-tight text-white">
          {text}
        </h2>

        <p className="mx-auto mt-2 max-w-[250px] text-xs leading-relaxed text-slate-500">
          {subtitle}
        </p>

        {/* Progress animation */}
        <div className="mt-8 h-[2px] w-full overflow-hidden rounded-full bg-white/[0.07]">
          <div className="h-full w-1/3 animate-[loading_1.6s_ease-in-out_infinite] rounded-full bg-[#bdbdbd]" />
        </div>

        <p className="mt-4 text-[10px] font-medium tracking-[0.2em] text-slate-600">
          SKILLGAP STUDIO
        </p>
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-110%); }
          100% { transform: translateX(310%); }
        }
      `}</style>
    </div>
  );
}
