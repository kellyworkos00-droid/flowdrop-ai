"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";
import { OnboardingCard } from "@/components/onboarding/OnboardingCard";
import { InvitePill } from "@/components/onboarding/InvitePill";
import { NextButton } from "@/components/onboarding/NextButton";
import { SkipButton } from "@/components/onboarding/SkipButton";
import { StepIcon } from "@/components/onboarding/StepIcon";
import { useOnboardingStore } from "@/lib/stores/onboardingStore";

export function StepInvite({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  const onboarding = useOnboardingStore();
  const [email, setEmail] = useState("");

  const invites = onboarding.invites;

  const addInvite = () => {
    const normalized = email.trim().toLowerCase();
    if (!normalized || invites.includes(normalized)) {
      return;
    }
    onboarding.addInvite(normalized);
    setEmail("");
  };

  const inviteLabel = useMemo(() => {
    if (invites.length === 0) {
      return "Continue →";
    }
    return `Send ${invites.length} invite${invites.length > 1 ? "s" : ""} & continue →`;
  }, [invites.length]);

  return (
    <OnboardingCard>
      <StepIcon
        icon={<Users className="h-6 w-6 text-[#6B9FFF]" />}
        color="rgba(45,107,228,0.1)"
        border="rgba(45,107,228,0.2)"
      />
      <h2 className="mb-1 font-[var(--font-display)] text-[28px] font-semibold text-[#F0F2FF]">Who&apos;s on your team?</h2>
      <p className="mb-5 text-[14px] text-[#8B90B8]">Invite them now or skip — you can always do this later.</p>

      <div className="mb-3 flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addInvite();
            }
          }}
          placeholder="teammate@company.com"
          className="h-10 flex-1 rounded-[10px] border border-[rgba(255,255,255,0.08)] bg-[#1E2236] px-[14px] text-[13px] text-[#F0F2FF] outline-none transition-colors focus:border-[#2D6BE4]"
        />
        <button
          type="button"
          onClick={addInvite}
          className="h-10 whitespace-nowrap rounded-[9px] border border-[rgba(45,107,228,0.25)] bg-[rgba(45,107,228,0.12)] px-[14px] text-[13px] font-medium text-[#6B9FFF] transition-all duration-180 hover:bg-[rgba(45,107,228,0.22)]"
        >
          + Add
        </button>
      </div>

      <div className="mb-4 flex min-h-7 flex-wrap gap-1.5">
        <AnimatePresence>
          {invites.map((invite) => (
            <InvitePill key={invite} email={invite} onRemove={() => onboarding.removeInvite(invite)} />
          ))}
        </AnimatePresence>
      </div>

      <NextButton
        onClick={() => {
          onboarding.nextStep();
          onNext();
        }}
      >
        {inviteLabel}
      </NextButton>
      <SkipButton
        onClick={() => {
          onboarding.nextStep();
          onSkip();
        }}
      >
        Skip for now →
      </SkipButton>
    </OnboardingCard>
  );
}
