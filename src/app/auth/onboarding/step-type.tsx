"use client";

import { useOnboardingStore } from "@/lib/stores/onboardingStore";
import { OnboardingCard } from "@/components/onboarding/OnboardingCard";
import { NextButton } from "@/components/onboarding/NextButton";
import { TypeCard } from "@/components/onboarding/TypeCard";

const TEAM_TYPES = [
  { icon: "🛠", label: "Product & Engineering" },
  { icon: "🎨", label: "Design & Creative" },
  { icon: "📣", label: "Marketing & Growth" },
  { icon: "🤝", label: "Client Services" },
  { icon: "🚀", label: "Startup / All-in-one" },
  { icon: "✨", label: "Something else" },
];

function StepIcon({ emoji, color, border }: { emoji: string; color: string; border: string }) {
  return (
    <div
      style={{
        width: 52,
        height: 52,
        borderRadius: 14,
        background: color,
        border: `1px solid ${border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 24,
        marginBottom: 20,
      }}
      aria-hidden
    >
      {emoji}
    </div>
  );
}

export function StepType({ onNext }: { onNext: () => void }) {
  const onboarding = useOnboardingStore();

  return (
    <OnboardingCard>
      <StepIcon emoji="🎯" color="rgba(245,166,35,0.1)" border="rgba(245,166,35,0.2)" />
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
