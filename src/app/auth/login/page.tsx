"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Globe, LockKeyhole, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { OrbBackground } from "@/components/onboarding/OrbBackground";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="grid min-h-dvh overflow-hidden md:grid-cols-[55fr_45fr]">
      <section className="relative order-1 overflow-hidden bg-[#0D0F1A] px-8 py-10 md:order-none md:min-h-dvh md:px-12">
        <OrbBackground />
        <div className="relative z-[1] inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 font-[var(--font-display)] text-[18px] font-semibold text-[#F0F2FF]">
          FlowDrop <span className="inline-block h-[7px] w-[7px] rounded-full bg-[#00E5C3]" />
        </div>

        <div className="relative z-[1] mx-auto my-14 max-w-xl md:my-24">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
            className="font-[var(--font-display)] text-[42px] font-bold leading-[1.12] text-[#F0F2FF]"
          >
            Work first.<br />
            <span className="text-[#00E5C3]">Structure follows.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
            className="mt-4 max-w-md text-[16px] leading-[1.65] text-[#8B90B8]"
          >
            The zero-setup workspace for teams who&apos;d rather ship than configure.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
            className="mt-6 flex items-center gap-2"
          >
            <div className="flex">
              {Array.from({ length: 4 }).map((_, index) => (
                <span
                  key={index}
                  className="h-7 w-7 rounded-full border border-white/20 bg-[#252A42]"
                  style={{ marginLeft: index === 0 ? 0 : -8 }}
                />
              ))}
            </div>
            <p className="text-[12px] text-[#8B90B8]">
              <span className="font-medium text-[#F0F2FF]">2,400+</span> teams already flowing
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 0.36 }}
            className="mt-8 max-w-md rounded-2xl border border-[rgba(0,229,195,0.2)] bg-[rgba(0,229,195,0.06)] p-4"
          >
            <p className="text-[12px] font-medium tracking-[0.12em] text-[#00E5C3]">FLOWDROP SIGNAL</p>
            <p className="mt-1 text-[14px] leading-relaxed text-[#A8B0D3]">Teams that finish onboarding in under 90 seconds are 3x more likely to ship in week one.</p>
          </motion.div>
        </div>

        <div className="relative z-[1] flex flex-wrap gap-2 pb-2">
          {["Zero setup", "AI learns your flow", "Built for small teams"].map((pill, index) => (
            <motion.span
              key={pill}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 0.4 + index * 0.08 }}
              className="rounded-full border border-[rgba(255,255,255,0.09)] bg-[rgba(255,255,255,0.05)] px-[14px] py-[5px] text-[11px] text-[#8B90B8]"
            >
              {pill}
            </motion.span>
          ))}
        </div>
      </section>

      <section className="order-2 flex min-h-dvh items-center justify-center border-l border-[rgba(255,255,255,0.06)] bg-[#141726] p-6 md:order-none">
        <motion.form
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="flow-glass w-full max-w-[360px] rounded-2xl p-6"
        >
          <h1 className="font-[var(--font-display)] text-[20px] font-semibold text-[#F0F2FF]">Welcome back</h1>
          <p className="mb-4 mt-1 text-[13px] text-[#8B90B8]">Sign in or create your account</p>

          <button
            type="button"
            onClick={() => router.push("/auth/onboarding")}
            className="mb-2 flex h-11 w-full items-center justify-center gap-2 rounded-[10px] border border-[rgba(255,255,255,0.08)] bg-[#1E2236] text-[13px] text-[#F0F2FF] transition-all duration-180 hover:border-[rgba(255,255,255,0.2)]"
          >
            <Globe className="h-4 w-4 text-[#9FB5FF]" />
            Continue with Google
          </button>
          <button
            type="button"
            onClick={() => router.push("/auth/onboarding")}
            className="mb-3 flex h-11 w-full items-center justify-center gap-2 rounded-[10px] border border-[rgba(255,255,255,0.08)] bg-[#1E2236] text-[13px] text-[#F0F2FF] transition-all duration-180 hover:border-[rgba(255,255,255,0.2)]"
          >
            <Building2 className="h-4 w-4 text-[#9FB5FF]" />
            Continue with Microsoft
          </button>

          <div className="mb-3 text-center text-[12px] text-[#555A7A]">or email</div>

          <label className="mb-2 flex items-center gap-2 rounded-[10px] border border-[rgba(255,255,255,0.08)] bg-[#1E2236] px-[12px]">
            <Mail className="h-4 w-4 text-[#6D7598]" />
            <input
              type="email"
              placeholder="you@company.com"
              className="h-[42px] w-full bg-transparent text-[13px] text-[#F0F2FF] outline-none"
            />
          </label>
          <label className="mb-3 flex items-center gap-2 rounded-[10px] border border-[rgba(255,255,255,0.08)] bg-[#1E2236] px-[12px]">
            <LockKeyhole className="h-4 w-4 text-[#6D7598]" />
            <input
              type="password"
              placeholder="Password"
              className="h-[42px] w-full bg-transparent text-[13px] text-[#F0F2FF] outline-none"
            />
          </label>

          <button
            type="button"
            onClick={() => router.push("/auth/onboarding")}
            className="mb-3 h-11 w-full rounded-[10px] bg-[#2D6BE4] font-[var(--font-display)] text-[14px] font-semibold text-white transition-all duration-180 hover:-translate-y-px hover:bg-[#3a7af0] active:scale-[0.98]"
          >
            Sign in →
          </button>

          <p className="text-center text-[13px] text-[#8B90B8]">
            No account? <Link href="/auth/onboarding" className="text-[#2D6BE4]">Start free</Link>
          </p>
        </motion.form>
      </section>
    </div>
  );
}
