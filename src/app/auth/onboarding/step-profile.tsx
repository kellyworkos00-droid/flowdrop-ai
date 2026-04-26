"use client";

import { useState } from "react";
import { Hand } from "lucide-react";
import { OnboardingCard } from "@/components/onboarding/OnboardingCard";
import { NextButton } from "@/components/onboarding/NextButton";
import { StepIcon } from "@/components/onboarding/StepIcon";
import { useOnboardingStore } from "@/lib/stores/onboardingStore";

const ROLES = ["Founder", "Designer", "Developer", "Product Manager", "Marketing", "Operations", "Other"];

export function StepProfile({ onNext }: { onNext: () => void }) {
  const onboarding = useOnboardingStore();
  const [name, setName] = useState(onboarding.name);
  const [role, setRole] = useState(onboarding.role || ROLES[0]);
  const [company, setCompany] = useState(onboarding.company);

  const isDisabled = !name.trim() || !company.trim();

  return (
    <OnboardingCard>
      <StepIcon
        icon={<Hand className="h-6 w-6 text-[#00E5C3]" />}
        color="rgba(0,229,195,0.1)"
        border="rgba(0,229,195,0.2)"
      />
      <h2 className="mb-1 font-[var(--font-display)] text-[28px] font-semibold text-[#F0F2FF]">Let&apos;s get you set up</h2>
      <p className="mb-5 text-[14px] text-[#8B90B8]">Takes 60 seconds. No credit card. No setup hell.</p>

      <label className="mb-1 block text-[12px] text-[#8B90B8]">Your full name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Jane Smith"
        className="mb-3 h-[42px] w-full rounded-[10px] border border-[rgba(255,255,255,0.08)] bg-[#1E2236] px-[14px] text-[13px] text-[#F0F2FF] outline-none transition-colors focus:border-[#2D6BE4]"
      />

      <label className="mb-1 block text-[12px] text-[#8B90B8]">Your role</label>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="mb-3 h-[42px] w-full rounded-[10px] border border-[rgba(255,255,255,0.08)] bg-[#1E2236] px-[14px] text-[13px] text-[#F0F2FF] outline-none transition-colors focus:border-[#2D6BE4]"
      >
        {ROLES.map((r) => (
          <option key={r}>{r}</option>
        ))}
      </select>

      <label className="mb-1 block text-[12px] text-[#8B90B8]">Team / Company name</label>
      <input
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        placeholder="Acme Inc."
        className="mb-5 h-[42px] w-full rounded-[10px] border border-[rgba(255,255,255,0.08)] bg-[#1E2236] px-[14px] text-[13px] text-[#F0F2FF] outline-none transition-colors focus:border-[#2D6BE4]"
      />

      <NextButton
        disabled={isDisabled}
        onClick={() => {
          onboarding.setProfile({ name: name.trim(), role, company: company.trim() });
          onboarding.nextStep();
          onNext();
        }}
      >
        Continue →
      </NextButton>
    </OnboardingCard>
  );
}
