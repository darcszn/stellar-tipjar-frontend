import { type ChangeEvent } from "react";
import { FormField, type ValidationState } from "@/components/forms/FormField";

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  id: string;
  name: string;
  label: string;
  value: string;
  options: Option[];
  status?: ValidationState;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

const stateClasses: Record<ValidationState, string> = {
  default: "border-gray-300 focus:border-purple-500 focus:ring-purple-500/20",
  error: "border-red-400 focus:border-red-500 focus:ring-red-500/20",
  success: "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/20",
  warning: "border-amber-400 focus:border-amber-500 focus:ring-amber-500/20",
};

export function Select({
  id,
  name,
  label,
  value,
  options,
  status = "default",
  helperText,
  error,
  disabled = false,
  onChange,
}: SelectProps) {
  const describedBy = error ? `${id}-error` : helperText ? `${id}-helper` : undefined;

  return (
    <FormField id={id} label={label} status={status} helperText={helperText} error={error}>
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          aria-invalid={status === "error"}
          aria-describedby={describedBy}
          className={`w-full appearance-none rounded-xl border-2 bg-white px-4 py-3 text-sm text-ink focus:outline-none focus:ring-4 ${stateClasses[status]} disabled:cursor-not-allowed disabled:opacity-60`}
        >
          {options.map(option => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>

        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-ink/50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>
    </FormField>
  );
}
