"use client";

import { Save, Wand2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { OutputBox } from "@/components/OutputBox";
import { Select } from "@/components/Select";
import { Textarea } from "@/components/Textarea";
import { getSettings, saveDraft } from "@/lib/drafts";
import type { Platform, PostGenerationResult } from "@/lib/types";

const platforms: Platform[] = ["LinkedIn", "Facebook", "Instagram"];
const goals = ["authority", "awareness", "engagement", "education", "app promotion", "product launch"];
const tones = ["professional", "reflective", "bold", "educational", "warm", "persuasive"];
const contexts = ["Tanzania", "Africa", "LMIC", "global", "custom"];

const initialForm = {
  topic: "",
  platform: "LinkedIn",
  goal: "authority",
  audience: "",
  observation: "",
  view: "",
  craft: "",
  tone: "professional",
  ctaPreference: "",
  context: "Tanzania",
  keywords: "",
  avoidWords: ""
};

export default function CreatePostPage() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState<PostGenerationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");

  function update(name: string, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function generate(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSaved("");
    try {
      const settings = getSettings();
      const response = await fetch("/api/generate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, context: form.context === "custom" ? settings.defaultContext : form.context })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Post generation failed.");
      setResult(data);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Post generation failed.");
    } finally {
      setLoading(false);
    }
  }

  function save() {
    if (!result) return;
    const allHashtags = Object.values(result.hashtags).flat();
    saveDraft({
      title: form.topic || "VOICE post draft",
      platform: form.platform as Platform,
      finalPost: result.finalPost,
      hashtags: allHashtags,
      imagePrompt: result.imageConcept
    });
    setSaved("Draft saved.");
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-bold uppercase tracking-wide text-teal">Create Post</p>
        <h1 className="mt-2 text-3xl font-black text-navy">Turn lived experience into a polished VOICE post.</h1>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,560px)_1fr]">
        <Card>
          <form onSubmit={generate} className="space-y-4">
            <Input label="Topic" value={form.topic} onChange={(e) => update("topic", e.target.value)} placeholder="Example: Hearing screening access in rural clinics" required />
            <div className="grid gap-4 sm:grid-cols-2">
              <Select label="Platform" options={platforms} value={form.platform} onChange={(e) => update("platform", e.target.value)} />
              <Select label="Goal" options={goals} value={form.goal} onChange={(e) => update("goal", e.target.value)} />
            </div>
            <Input label="Audience" value={form.audience} onChange={(e) => update("audience", e.target.value)} placeholder="Example: health leaders, educators, parents" required />
            <Textarea label="My lived experience / observation" value={form.observation} onChange={(e) => update("observation", e.target.value)} placeholder="What have you personally seen in your work?" />
            <Textarea label="My belief or view" value={form.view} onChange={(e) => update("view", e.target.value)} placeholder="What clear position should the post start from?" />
            <Textarea label="What I am building or promoting" value={form.craft} onChange={(e) => update("craft", e.target.value)} placeholder="Name the work, offer, project, tool, service, or advocacy." />
            <div className="grid gap-4 sm:grid-cols-2">
              <Select label="Tone" options={tones} value={form.tone} onChange={(e) => update("tone", e.target.value)} />
              <Select label="Location/context" options={contexts} value={form.context} onChange={(e) => update("context", e.target.value)} />
            </div>
            <Input label="CTA preference" value={form.ctaPreference} onChange={(e) => update("ctaPreference", e.target.value)} placeholder="Example: ask for comments, invite DMs, book a demo" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Optional keywords" value={form.keywords} onChange={(e) => update("keywords", e.target.value)} placeholder="Separate with commas" />
              <Input label="Words to avoid" value={form.avoidWords} onChange={(e) => update("avoidWords", e.target.value)} placeholder="Separate with commas" />
            </div>
            {error ? <p className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={loading} icon={<Wand2 size={18} />}>
              {loading ? <LoadingSpinner label="Generating post" /> : "Generate Post"}
            </Button>
          </form>
        </Card>

        <section className="space-y-4">
          {result ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-black text-navy">Output Preview</h2>
                <Button type="button" variant="secondary" onClick={save} icon={<Save size={18} />}>Save Draft</Button>
              </div>
              {saved ? <p className="rounded-lg bg-mint p-3 text-sm font-bold text-navy">{saved}</p> : null}
              <OutputBox title="Final Post" content={result.finalPost} />
              <OutputBox title="3 Alternative Hooks" content={result.alternativeHooks} />
              <OutputBox title="3 CTA Options" content={result.ctaOptions} />
              <OutputBox title="Platform-Specific Version" content={result.platformVersion} />
              <OutputBox title="Meta Hashtags" content={Object.values(result.hashtags).flat()} />
              <OutputBox title="Image Concept Suggestion" content={result.imageConcept} />
            </>
          ) : (
            <Card className="flex min-h-[520px] items-center justify-center">
              <div className="max-w-sm text-center">
                <Wand2 className="mx-auto text-teal" size={34} />
                <h2 className="mt-4 text-xl font-black text-navy">Your VOICE output will appear here.</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">Fill in the clearest pieces of your experience, then generate a post with hooks, CTAs, hashtags, and an image concept.</p>
              </div>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}
