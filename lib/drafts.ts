"use client";

import type { Draft } from "@/lib/types";

const DRAFT_KEY = "voice-post-studio-drafts";
const SETTINGS_KEY = "voice-post-studio-settings";

export type StudioSettings = {
  brandVoice: string;
  defaultContext: string;
};

export const defaultSettings: StudioSettings = {
  brandVoice:
    "First-person, human, professional, grounded in African healthcare, public health, education, and community realities.",
  defaultContext: "Tanzania"
};

export function getDrafts(): Draft[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(DRAFT_KEY) || "[]") as Draft[];
  } catch {
    return [];
  }
}

export function saveDraft(draft: Omit<Draft, "id" | "dateCreated"> & Partial<Pick<Draft, "id" | "dateCreated">>) {
  const drafts = getDrafts();
  const item: Draft = {
    ...draft,
    id: draft.id || crypto.randomUUID(),
    dateCreated: draft.dateCreated || new Date().toISOString()
  };
  const next = [item, ...drafts.filter((existing) => existing.id !== item.id)];
  localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
  return item;
}

export function deleteDraft(id: string) {
  const next = getDrafts().filter((draft) => draft.id !== id);
  localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
}

export function getSettings(): StudioSettings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    return { ...defaultSettings, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}") };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: StudioSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
