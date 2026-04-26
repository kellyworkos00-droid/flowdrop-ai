"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { OrbBackground } from "@/components/onboarding/OrbBackground";
import { DropZone } from "@/components/onboarding/DropZone";
import { postDrop } from "@/lib/api/onboarding";
import { useOnboardingStore } from "@/lib/stores/onboardingStore";

function QuickActionPill({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer rounded-full border border-[rgba(255,255,255,0.08)] bg-[#141726] px-4 py-2 text-[12px] text-[#8B90B8] transition-all duration-180 hover:border-[rgba(45,107,228,0.35)] hover:text-[#F0F2FF]"
    >
      {children}
    </button>
  );
}

export default function WelcomePage() {
  const router = useRouter();
  const onboarding = useOnboardingStore();

  const createFirstDrop = async (content: string, type: string) => {
    if (!onboarding.workspaceId) {
      return;
    }

    await postDrop({
      content,
      type,
      workspaceId: onboarding.workspaceId,
    });

    router.push("/welcome/done");
  };

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#0D0F1A] p-6">
      <OrbBackground />
      <div className="relative z-[1] w-full max-w-[760px] text-center">
        <motion.div
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(0,229,195,0)",
              "0 0 0 12px rgba(0,229,195,0.08)",
              "0 0 0 0 rgba(0,229,195,0)",
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            background: "rgba(0,229,195,0.1)",
            border: "1px solid rgba(0,229,195,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            margin: "0 auto 24px",
          }}
        >
          ⬇
        </motion.div>

        <h1 className="mb-2 font-[var(--font-display)] text-[38px] font-semibold text-[#F0F2FF]">
          You&apos;re in. <span style={{ color: "#00E5C3" }}>Drop anything.</span>
        </h1>
        <p className="mx-auto mb-6 max-w-[560px] text-[15px] text-[#8B90B8]">
          Tasks, ideas, files, decisions — just drop them in. FlowDrop figures out the rest over time.
        </p>

        <div className="mb-5 flex justify-center">
          <DropZone
            onDrop={() => {
              void createFirstDrop("First file drop", "file");
            }}
            onClick={() => {
              void createFirstDrop("First typed drop", "note");
            }}
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {["+ Add a task", "📎 Upload a file", "💬 Write a note"].map((label) => (
            <QuickActionPill key={label} onClick={() => void createFirstDrop(label, "task")}>
              {label}
            </QuickActionPill>
          ))}
        </div>
      </div>
    </div>
  );
}
