"use client";

import { Handshake, Hammer, Megaphone, Palette, Rocket, Sparkles, Target } from "lucide-react";
import { useOnboardingStore } from "@/lib/stores/onboardingStore";
import { OnboardingCard } from "@/components/onboarding/OnboardingCard";
import { NextButton } from "@/components/onboarding/NextButton";
import { StepIcon } from "@/components/onboarding/StepIcon";
import { TypeCard } from "@/components/onboarding/TypeCard";

const TEAM_TYPES = [
  { icon: Hammer, label: "Product & Engineering" },
  { icon: Palette, label: "Design & Creative" },
  { icon: Megaphone, label: "Marketing & Growth" },
  { icon: Handshake, label: "Client Services" },
  { icon: Rocket, label: "Startup / All-in-one" },
  { icon: Sparkles, label: "Something else" },
];

export function StepType({ onNext }: { onNext: () => void }) {
  const onboarding = useOnboardingStore();

  return (
    <OnboardingCard>
      <StepIcon
        icon={<Target className="h-6 w-6 text-[#F5A623]" />}
        color="rgba(245,166,35,0.1)"
        border="rgba(245,166,35,0.2)"
      />
      <h2 className="mb-1 font-[var(--font-display)] text-[28px] font-semibold text-[#F0F2FF]">What does your team do?</h2>
      <p className="mb-5 text-[14px] text-[#8B90B8]">FlowDrop adapts to how you work — pick what fits best.</p>

      <div className="mb-5 grid grid-cols-2 gap-2">
        {TEAM_TYPES.map((type) => (
          <TypeCard
            key={type.label}
            icon={type.icon}
            label={type.label}
            selected={onboarding.teamType === type.label}
            onClick={() => onboarding.setTeamType(type.label)}
          />
        ))}
      </div>

      <NextButton
        disabled={!onboarding.teamType}
        onClick={() => {
          onboarding.nextStep();
          onNext();
        }}
      >
        Let&apos;s go →
      </NextButton>
    </OnboardingCard>
  );
}
