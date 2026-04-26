interface SkipButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export function SkipButton({ className, children, ...props }: SkipButtonProps) {
  return (
    <button
      type="button"
      className={`mt-[10px] w-full cursor-pointer p-2 text-center text-[12px] text-[#555A7A] transition-colors duration-180 hover:text-[#8B90B8] ${className ?? ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
