import { type ReactNode } from "react";

export type ValidationState = "default" | "error" | "success" | "warning";

interface FormFieldProps {
  id: string;
  label?: string;
  required?: boolean;
  status?: ValidationState;
  helperText?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}

const stateStyles: Record<ValidationState, string> = {
  default: "text-ink/80",
  error: "text-red-600",
  success: "text-emerald-600",
  warning: "text-amber-600",
};

export function FormField({
  id,
  label,
  required = false,
  status = "default",
  helperText,
  error,
  children,
  className = "",
}: FormFieldProps) {
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between gap-2 text-sm font-medium">
          <label htmlFor={id} className="text-ink">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
          {status !== "default" && (
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${stateStyles[status]}`}>
              {status.toUpperCase()}
            </span>
          )}
        </div>
      )}

      {children}

      {!error && helperText && (
        <p id={helperId} className="text-xs text-ink/60">
          {helperText}
        </p>
      )}

      {error && (
        <p id={errorId} role="alert" aria-live="assertive" className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
