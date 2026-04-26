"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { OrbBackground } from "@/components/onboarding/OrbBackground";
import { StepIndicator } from "@/components/onboarding/StepIndicator";
import { StepProfile } from "./step-profile";
import { StepInvite } from "./step-invite";
import { StepType } from "./step-type";
import { useOnboardingStore } from "@/lib/stores/onboardingStore";
import { postOnboardingInvites, postOnboardingProfile, postOnboardingWorkspace } from "@/lib/api/onboarding";

const STEPS = ["profile", "invite", "type"] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const onboarding = useOnboardingStore();
  const [currentStep, setCurrentStep] = useState<number>(0);

  const next = () => {
    setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const skip = () => next();

  const persistProfile = async () => {
    const response = await postOnboardingProfile({
      name: onboarding.name,
      role: onboarding.role,
      company: onboarding.company,
    });
    onboarding.setWorkspaceId(response.workspaceId);
  };

  const persistInvites = async () => {
    if (!onboarding.workspaceId || onboarding.invites.length === 0) {
      return;
    }
    await postOnboardingInvites({
      emails: onboarding.invites,
      workspaceId: onboarding.workspaceId,
    });
  };

  const persistTeamType = async () => {
    if (!onboarding.workspaceId || !onboarding.teamType) {
      return;
    }
    await postOnboardingWorkspace({
      teamType: onboarding.teamType,
      workspaceId: onboarding.workspaceId,
    });
  };

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#0D0F1A] px-6 py-10">
      <OrbBackground />
      <div className="relative z-[1] w-full max-w-[520px]">
        <div className="mb-6 text-center">
          <h1 className="font-[var(--font-display)] text-[30px] font-semibold text-[#F0F2FF]">Build your flow in minutes</h1>
          <p className="mt-1 text-[14px] text-[#8B90B8]">No setup maze, just three quick steps.</p>
        </div>
        <div className="flex justify-center">
          <StepIndicator total={3} current={currentStep} />
        </div>
        <AnimatePresence mode="wait">
          {currentStep === 0 ? (
            <StepProfile
              key="profile"
              onNext={async () => {
                await persistProfile();
                next();
              }}
            />
          ) : null}

          {currentStep === 1 ? (
            <StepInvite
              key="invite"
              onNext={async () => {
                await persistInvites();
                next();
              }}
              onSkip={() => skip()}
            />
          ) : null}

          {currentStep === 2 ? (
            <StepType
              key="type"
              onNext={async () => {
                await persistTeamType();
                router.push("/welcome");
              }}
            />
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
