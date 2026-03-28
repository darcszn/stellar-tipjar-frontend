"use client";

interface NotificationToggleProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

export function NotificationToggle({ id, label, checked, onChange }: NotificationToggleProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-ink/10 bg-[color:var(--surface)] p-3">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      <button
        id={id}
        onClick={() => onChange(!checked)}
        className={`h-8 w-14 rounded-full transition-colors ${checked ? "bg-wave" : "bg-ink/20"}`}
        aria-pressed={checked}
      >
        <span
          className={`block h-7 w-7 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`}
        />
      </button>
    </div>
  );
}
