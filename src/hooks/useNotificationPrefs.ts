"use client";

import { useCallback, useEffect, useState } from "react";

export interface NotificationPrefs {
  email: boolean;
  push: boolean;
  inApp: boolean;
}

const STORAGE_KEY = "stellar_tipjar_notification_prefs";

const defaultPrefs: NotificationPrefs = {
  email: true,
  push: true,
  inApp: true,
};

export function useNotificationPrefs() {
  const [preferences, setPreferences] = useState<NotificationPrefs>(defaultPrefs);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as NotificationPrefs;
      setPreferences({ ...defaultPrefs, ...parsed });
    } catch {
      setPreferences(defaultPrefs);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  const updatePreference = useCallback((key: keyof NotificationPrefs, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  }, []);

  const unsubscribeAll = useCallback(() => {
    setPreferences({ email: false, push: false, inApp: false });
  }, []);

  return { preferences, updatePreference, unsubscribeAll };
}
