import { type ChangeEvent } from "react";
import { FormField, type ValidationState } from "@/components/forms/FormField";

interface CheckboxProps {
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

export function Checkbox({
  id,
  name,
  label,
  checked,
  onChange,
  status = "default",
  helperText,
  error,
  disabled = false,
}: CheckboxProps) {
  const describedBy = error ? `${id}-error` : helperText ? `${id}-helper` : undefined;

  return (
    <FormField id={id} status={status} helperText={helperText} error={error}>
      <div className="flex items-start gap-2">
        <label htmlFor={id} className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-ink disabled:cursor-not-allowed">
          <input
            id={id}
            name={name}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            aria-invalid={status === "error"}
            aria-describedby={describedBy}
            className="h-4 w-4 rounded border-2 border-gray-300 text-purple-600 focus:ring-4 focus:ring-purple-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <span>{label}</span>
        </label>
      </div>
    </FormField>
  );
}
