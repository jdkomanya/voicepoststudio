"use client";

import { Download, Save, Wand2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { OutputBox } from "@/components/OutputBox";
import { Select } from "@/components/Select";
import { Textarea } from "@/components/Textarea";
import { saveDraft } from "@/lib/drafts";
import type { Platform } from "@/lib/types";

const platforms: Platform[] = ["LinkedIn", "Facebook", "Instagram"];
const styles = [
  "Realistic clinic photo",
  "Professional editorial social media graphic",
  "Community health scene",
  "Audiology awareness poster",
  "LinkedIn authority image",
  "Instagram square poster"
];
const contexts = [
  "Tanzania",
  "African clinic",
  "LMIC healthcare",
  "School / university",
  "Community outreach",
  "Home / family setting",
  "General professional setting"
];

export default function GenerateImagePage() {
  const [form, setForm] = useState({
    postText: "",
    platform: "LinkedIn",
    visualStyle: styles[0],
    lmicContext: contexts[0],
    imageConcept: "",
    avoidList: ""
  });
  const [image, setImage] = useState("");
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
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
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Image generation failed.");
      const source = data.imageBase64 || data.imageUrl;
      if (!source) throw new Error("The image service did not return an image.");
      setImage(source);
      setPrompt(data.imagePromptUsed);
      setNegativePrompt(data.negativePrompt);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Image generation failed.");
    } finally {
      setLoading(false);
    }
  }

  function download() {
    if (!image) return;
    const link = document.createElement("a");
    link.href = image;
    link.download = "voice-post-studio-image.png";
    link.click();
  }

  function save() {
    saveDraft({
      title: form.imageConcept || form.postText.slice(0, 64) || "Generated image draft",
      platform: form.platform as Platform,
      finalPost: form.postText,
      hashtags: [],
      imagePrompt: prompt,
      generatedImage: image
    });
    setSaved("Image draft saved.");
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-bold uppercase tracking-wide text-teal">Generate Image</p>
        <h1 className="mt-2 text-3xl font-black text-navy">Create realistic social images with African and LMIC context.</h1>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,520px)_1fr]">
        <Card>
          <form onSubmit={generate} className="space-y-4">
            <Textarea label="Post text" value={form.postText} onChange={(e) => update("postText", e.target.value)} placeholder="Paste the generated post or write the caption this image should support." />
            <Input label="Image concept" value={form.imageConcept} onChange={(e) => update("imageConcept", e.target.value)} placeholder="Example: community hearing screening under natural light" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Select label="Platform" options={platforms} value={form.platform} onChange={(e) => update("platform", e.target.value)} />
              <Select label="Visual style" options={styles} value={form.visualStyle} onChange={(e) => update("visualStyle", e.target.value)} />
            </div>
            <Select label="LMIC context" options={contexts} value={form.lmicContext} onChange={(e) => update("lmicContext", e.target.value)} />
            <Textarea label="Negative prompt / avoid list" value={form.avoidList} onChange={(e) => update("avoidList", e.target.value)} placeholder="Add anything specific to avoid. The studio already avoids generic Western hospital imagery, fake devices, and sci-fi AI visuals." />
            {error ? <p className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={loading} icon={<Wand2 size={18} />}>
              {loading ? <LoadingSpinner label="Generating image" /> : "Generate Image"}
            </Button>
          </form>
        </Card>

        <section className="space-y-4">
          <Card className="min-h-[520px]">
            {image ? (
              <div className="space-y-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt="Generated social media visual" className="mx-auto aspect-square w-full max-w-[560px] rounded-lg object-cover" />
                <div className="flex flex-wrap justify-center gap-3">
                  <Button type="button" variant="secondary" onClick={download} icon={<Download size={18} />}>Download</Button>
                  <Button type="button" onClick={save} icon={<Save size={18} />}>Save with Post</Button>
                </div>
                {saved ? <p className="rounded-lg bg-mint p-3 text-center text-sm font-bold text-navy">{saved}</p> : null}
              </div>
            ) : (
              <div className="flex min-h-[470px] items-center justify-center">
                <div className="max-w-sm text-center">
                  <Wand2 className="mx-auto text-teal" size={34} />
                  <h2 className="mt-4 text-xl font-black text-navy">Your image will appear here.</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">The generated prompt will prioritize realistic African healthcare, education, public health, and community settings.</p>
                </div>
              </div>
            )}
          </Card>
          {prompt ? <OutputBox title="Image Prompt Used" content={prompt} /> : null}
          {negativePrompt ? <OutputBox title="Negative Prompt / Avoid List" content={negativePrompt} /> : null}
        </section>
      </div>
    </div>
  );
}
