import { cn } from "@/lib/utils";

interface NextButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export function NextButton({ className, disabled, children, ...props }: NextButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        "w-full rounded-[10px] px-4 font-[var(--font-display)] text-[14px] font-semibold text-white transition-all duration-180",
        "h-11",
        disabled
          ? "cursor-not-allowed bg-[rgba(45,107,228,0.35)] opacity-40"
          : "cursor-pointer bg-[#2D6BE4] hover:-translate-y-px hover:bg-[#3a7af0] active:scale-[0.98]",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
