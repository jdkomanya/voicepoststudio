"use client";

import Link from "next/link";
import { Image, Library, PenLine, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { DraftCard } from "@/components/DraftCard";
import { deleteDraft, getDrafts } from "@/lib/drafts";
import type { Draft } from "@/lib/types";

export default function DashboardPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);

  useEffect(() => {
    setDrafts(getDrafts().slice(0, 3));
  }, []);

  function remove(id: string) {
    deleteDraft(id);
    setDrafts(getDrafts().slice(0, 3));
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-navy p-6 text-white shadow-soft sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-mint">VOICE Post Studio</p>
        <h2 className="mt-3 max-w-3xl text-3xl font-black sm:text-4xl">Create grounded, human social posts with images that feel true to African and LMIC realities.</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/create-post" className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-navy transition hover:bg-mint">
            <PenLine size={18} />
            Create Post
          </Link>
          <Link href="/generate-image" className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/30 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10">
            <Image size={18} />
            Generate Image
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/create-post" className="block rounded-lg border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-teal">
          <PenLine className="text-teal" />
          <h3 className="mt-4 text-lg font-bold text-navy">Generate VOICE posts</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">Build LinkedIn, Facebook, and Instagram copy from lived experience and a clear view.</p>
        </Link>
        <Link href="/generate-image" className="block rounded-lg border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-teal">
          <Image className="text-leaf" />
          <h3 className="mt-4 text-lg font-bold text-navy">Create LMIC images</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">Generate square social images with realistic African clinic, school, and community settings.</p>
        </Link>
        <Link href="/saved-drafts" className="block rounded-lg border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-teal">
          <Library className="text-navy" />
          <h3 className="mt-4 text-lg font-bold text-navy">Return to drafts</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">Keep posts, hashtags, prompts, and generated images in localStorage for the MVP.</p>
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-black text-navy">Recent Drafts</h2>
            <Link href="/saved-drafts" className="text-sm font-bold text-teal">View all</Link>
          </div>
          {drafts.length ? (
            <div className="grid gap-4 md:grid-cols-3">
              {drafts.map((draft) => <DraftCard key={draft.id} draft={draft} onDelete={remove} />)}
            </div>
          ) : (
            <Card>
              <p className="text-sm text-slate-600">No saved drafts yet. Your first strong post is a few fields away.</p>
            </Card>
          )}
        </section>
        <Card>
          <Sparkles className="text-teal" />
          <h2 className="mt-4 text-xl font-black text-navy">VOICE Reminder</h2>
          <div className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
            <p><strong>View:</strong> Start with my belief.</p>
            <p><strong>Observation:</strong> Show what I see in real work.</p>
            <p><strong>Insight:</strong> Explain what people miss.</p>
            <p><strong>Craft:</strong> Name what I am building or advocating.</p>
            <p><strong>Engage:</strong> End with a direct question or CTA.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
