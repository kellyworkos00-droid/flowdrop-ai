"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, onChange, ...props },
  ref,
) {
  const innerRef = React.useRef<HTMLTextAreaElement | null>(null);

  React.useImperativeHandle(ref, () => innerRef.current as HTMLTextAreaElement);

  const resize = React.useCallback(() => {
    const element = innerRef.current;
    if (!element) {
      return;
    }
    element.style.height = "0px";
    element.style.height = `${element.scrollHeight}px`;
  }, []);

  React.useEffect(() => {
    resize();
  }, [resize]);

  return (
    <textarea
      ref={innerRef}
      className={cn(
        "focus-ring w-full resize-none overflow-hidden rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] px-3 py-2 text-[15px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none transition-all duration-[var(--duration-base)] ease-[var(--ease-smooth)] focus:border-[var(--color-brand-primary)]",
        className,
      )}
      onChange={(event) => {
        resize();
        onChange?.(event);
      }}
      {...props}
    />
  );
});
