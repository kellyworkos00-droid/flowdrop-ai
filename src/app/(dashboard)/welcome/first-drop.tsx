"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CircleCheckBig, Sparkles } from "lucide-react";
import { OrbBackground } from "@/components/onboarding/OrbBackground";
import { NextButton } from "@/components/onboarding/NextButton";

export default function FirstDropPage() {
  const router = useRouter();

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#0D0F1A] p-6 text-center">
      <OrbBackground />
      <div className="relative z-[1] w-full max-w-[620px]">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: "rgba(0,196,140,0.15)",
            border: "1px solid rgba(0,196,140,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <CircleCheckBig className="h-6 w-6 text-[#00C48C]" />
        </motion.div>

        <h2 className="mb-2 font-[var(--font-display)] text-[34px] font-semibold text-[#F0F2FF]">First drop landed.</h2>
        <p className="mx-auto mb-5 max-w-[560px] text-[15px] text-[#8B90B8]">
          FlowDrop is watching. Give it a week and it&apos;ll start organizing your team&apos;s work automatically.
        </p>

        <div
          style={{
            background: "#141726",
            border: "1px solid rgba(0,229,195,0.15)",
            borderRadius: 14,
            padding: "16px 20px",
            maxWidth: 440,
            textAlign: "left",
            margin: "0 auto 24px",
          }}
        >
          <div style={{ fontSize: 11, color: "#00E5C3", fontWeight: 500, marginBottom: 8 }} className="inline-flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5" /> FlowDrop AI
          </div>
          <div style={{ fontSize: 13, color: "#8B90B8", lineHeight: 1.6 }}>
            I&apos;ll watch how your team works over the next few days. Once I see patterns, I&apos;ll suggest structure — no setup needed from you.
          </div>
        </div>

        <div className="mx-auto max-w-[360px]">
          <NextButton onClick={() => router.push("/home")}>Go to my workspace →</NextButton>
        </div>
      </div>
    </div>
  );
}
