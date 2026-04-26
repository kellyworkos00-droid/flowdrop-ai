import { cn } from "@/lib/utils";

interface StepIconProps {
  icon: React.ReactNode;
  color: string;
  border: string;
  className?: string;
}

export function StepIcon({ icon, color, border, className }: StepIconProps) {
  return (
    <div
      className={cn("mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-[14px]", className)}
      style={{
        background: color,
        border: `1px solid ${border}`,
      }}
      aria-hidden
    >
      {icon}
    </div>
  );
}
