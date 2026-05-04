"use client";

import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Select } from "@/components/Select";
import { Textarea } from "@/components/Textarea";
import { defaultSettings, getSettings, saveSettings } from "@/lib/drafts";

const contexts = ["Tanzania", "Africa", "LMIC", "global", "Custom African healthcare context"];

export default function SettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [saved, setSaved] = useState("");

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  function save() {
    saveSettings(settings);
    setSaved("Settings saved.");
    setTimeout(() => setSaved(""), 1600);
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-bold uppercase tracking-wide text-teal">Settings / Framework</p>
        <h1 className="mt-2 text-3xl font-black text-navy">Keep every post grounded in VOICE.</h1>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <Card className="space-y-4">
          <Textarea
            label="Default brand voice"
            value={settings.brandVoice}
            onChange={(event) => setSettings((current) => ({ ...current, brandVoice: event.target.value }))}
            hint="Stored in localStorage for this MVP."
          />
          <Select
            label="Default LMIC context"
            options={contexts}
            value={settings.defaultContext}
            onChange={(event) => setSettings((current) => ({ ...current, defaultContext: event.target.value }))}
          />
          {saved ? <p className="rounded-lg bg-mint p-3 text-sm font-bold text-navy">{saved}</p> : null}
          <Button type="button" onClick={save} icon={<Save size={18} />}>Save Settings</Button>
        </Card>

        <Card>
          <h2 className="text-xl font-black text-navy">VOICE Framework</h2>
          <div className="mt-5 space-y-4 text-sm leading-6 text-slate-700">
            <p><strong>View:</strong> I start with my clear belief or position.</p>
            <p><strong>Observation:</strong> I show what I personally see in real work.</p>
            <p><strong>Insight:</strong> I explain what most people miss.</p>
            <p><strong>Craft:</strong> I show what I am building, doing, testing, or advocating.</p>
            <p><strong>Engage:</strong> I end with a direct question or call to action.</p>
          </div>
          <div className="mt-6 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            The studio also avoids em dashes, generic advice, spammy hashtags, futuristic AI imagery, and generic Western hospital visuals.
          </div>
        </Card>
      </div>
    </div>
  );
}
