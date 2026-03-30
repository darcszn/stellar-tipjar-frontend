import { type ChangeEvent } from "react";
import { FormField, type ValidationState } from "@/components/forms/FormField";

interface ToggleProps {
  id: string;
  name: string;
  label: string;
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  status?: ValidationState;
  helperText?: string;
  error?: string;
  disabled?: boolean;
}

export function Toggle({
  id,
  name,
  label,
  checked,
  onChange,
  status = "default",
  helperText,
  error,
  disabled = false,
}: ToggleProps) {
  const describedBy = error ? `${id}-error` : helperText ? `${id}-helper` : undefined;

  return (
    <FormField id={id} status={status} helperText={helperText} error={error}>
      <label className="inline-flex items-center gap-3">
        <span className="text-sm font-medium text-ink">{label}</span>
        <span className="relative inline-flex h-6 w-11 items-center">
          <input
            id={id}
            name={name}
            type="checkbox"
            role="switch"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            aria-checked={checked}
            aria-invalid={status === "error"}
            aria-describedby={describedBy}
            className="peer sr-only"
          />
          <span className={`pointer-events-none absolute h-6 w-11 rounded-full border transition-colors ${
            disabled ? "bg-gray-200 border-gray-300" : checked ? "bg-purple-600 border-purple-600" : "bg-gray-200 border-gray-300"
          }`}></span>
          <span
            className={`pointer-events-none absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
              checked ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </span>
      </label>
    </FormField>
  );
}
