import { type ChangeEvent, type InputHTMLAttributes } from "react";
import { FormField, type ValidationState } from "@/components/forms/FormField";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "id"> {
  id: string;
  label: string;
  value: string;
  status?: ValidationState;
  helperText?: string;
  error?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const stateClasses: Record<ValidationState, string> = {
  default: "border-gray-300 focus:border-purple-500 focus:ring-purple-500/20",
  error: "border-red-400 focus:border-red-500 focus:ring-red-500/20",
  success: "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/20",
  warning: "border-amber-400 focus:border-amber-500 focus:ring-amber-500/20",
};

export function Input({
  id,
  name,
  label,
  value,
  onChange,
  status = "default",
  helperText,
  error,
  disabled = false,
  className = "",
  ...props
}: InputProps) {
  const describedBy = error ? `${id}-error` : helperText ? `${id}-helper` : undefined;

  return (
    <FormField id={id} label={label} status={status} helperText={helperText} error={error}>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={props.type ?? "text"}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder=" "
          aria-invalid={status === "error"}
          aria-describedby={describedBy}
          aria-label={label}
          autoComplete={props.autoComplete}
          className={`peer w-full rounded-xl border-2 bg-white px-4 py-3 text-sm text-ink transition-all placeholder-transparent disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-4 ${stateClasses[status]} ${className}`}
          {...props}
        />
        <label
          htmlFor={id}
          className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-ink/60 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-ink"
        >
          {label}
        </label>
      </div>
    </FormField>
  );
}
