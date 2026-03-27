"use client";

import { motion } from "framer-motion";
import { ButtonHTMLAttributes, forwardRef } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";

type ButtonVariant = "primary" | "secondary" | "ghost" | "tertiary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-sunrise text-white hover:bg-[#f16748] focus-visible:ring-sunrise/50 dark:bg-sunrise dark:hover:bg-[#f16748]",
  secondary:
    "bg-wave text-white hover:bg-[#0a5a66] focus-visible:ring-wave/50 dark:bg-wave-dark dark:hover:bg-[#3d8eb8] dark:focus-visible:ring-wave-dark/50",
  ghost:
    "bg-transparent text-ink border border-ink/20 hover:bg-ink/5 focus-visible:ring-ink/30 dark:text-ink-dark dark:border-ink-dark/20 dark:hover:bg-ink-dark/5 dark:focus-visible:ring-ink-dark/30",
  tertiary:
    "bg-transparent text-wave hover:underline focus-visible:ring-wave/30 dark:text-wave-dark dark:hover:text-wave-dark/80 dark:focus-visible:ring-wave-dark/30",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { children, className = "", variant = "primary", type = "button", disabled, ...props },
  ref
) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      aria-disabled={disabled}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 ${variantStyles[variant]} ${className}`}
      whileHover={prefersReduced || disabled ? undefined : { y: -2 }}
      whileTap={prefersReduced || disabled ? undefined : { scale: 0.96 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.button>
  );
});
