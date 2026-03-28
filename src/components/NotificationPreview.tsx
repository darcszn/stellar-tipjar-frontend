"use client";

import { NotificationPrefs } from "@/hooks/useNotificationPrefs";

interface NotificationPreviewProps {
  prefs: NotificationPrefs;
}

export function NotificationPreview({ prefs }: NotificationPreviewProps) {
  return (
    <div className="space-y-2 rounded-3xl border border-ink/10 bg-[color:var(--surface)] p-4">
      <p className="text-sm text-ink/80">Notification Preview</p>
      <ul className="space-y-2 text-sm">
        <li>Email: {prefs.email ? "Enabled" : "Disabled"}</li>
        <li>Push: {prefs.push ? "Enabled" : "Disabled"}</li>
        <li>In-app: {prefs.inApp ? "Enabled" : "Disabled"}</li>
      </ul>
      <p className="text-xs text-ink/70">Unsubscribe links are included for email and push channels.</p>
    </div>
  );
}
