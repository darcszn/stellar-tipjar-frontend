"use client";

import Link from "next/link";
import { NotificationPreview } from "@/components/NotificationPreview";
import { NotificationToggle } from "@/components/NotificationToggle";
import { useNotificationPrefs } from "@/hooks/useNotificationPrefs";
import { Button } from "@/components/Button";

export default function NotificationSettingsPage() {
  const { preferences, updatePreference, unsubscribeAll } = useNotificationPrefs();

  return (
    <div className="space-y-6 px-4 py-8 sm:px-8">
      <h1 className="text-3xl font-bold text-ink">Notification Preferences</h1>
      <p className="text-sm text-ink/70">Control your email, push, and in-app notification preferences.</p>

      <div className="space-y-3">
        <NotificationToggle
          id="notification-email"
          label="Email notifications"
          checked={preferences.email}
          onChange={(value) => updatePreference("email", value)}
        />
        <NotificationToggle
          id="notification-push"
          label="Push notifications"
          checked={preferences.push}
          onChange={(value) => updatePreference("push", value)}
        />
        <NotificationToggle
          id="notification-in-app"
          label="In-app notifications"
          checked={preferences.inApp}
          onChange={(value) => updatePreference("inApp", value)}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={unsubscribeAll} variant="secondary">
          Unsubscribe all
        </Button>
        <Link href="/" className="inline-flex items-center">
          <Button variant="ghost">Back to Home</Button>
        </Link>
      </div>

      <NotificationPreview prefs={preferences} />

      <p className="text-xs text-ink/70">
        To unsubscribe from email notifications, click <a className="underline" href="mailto:unsubscribe@example.com">here</a>.
      </p>
    </div>
  );
}
