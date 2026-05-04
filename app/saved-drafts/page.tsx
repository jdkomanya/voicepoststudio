"use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/Card";
import { DraftCard } from "@/components/DraftCard";
import { Input } from "@/components/Input";
import { OutputBox } from "@/components/OutputBox";
import { Select } from "@/components/Select";
import { deleteDraft, getDrafts } from "@/lib/drafts";
import type { Draft } from "@/lib/types";

export default function SavedDraftsPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("All");
  const [active, setActive] = useState<Draft | null>(null);

  useEffect(() => {
    setDrafts(getDrafts());
  }, []);

  const filtered = useMemo(() => {
    return drafts.filter((draft) => {
      const matchesPlatform = platform === "All" || draft.platform === platform;
      const text = `${draft.title} ${draft.finalPost} ${draft.hashtags.join(" ")}`.toLowerCase();
      return matchesPlatform && text.includes(search.toLowerCase());
    });
  }, [drafts, platform, search]);

  function remove(id: string) {
    deleteDraft(id);
    const next = getDrafts();
    setDrafts(next);
    if (active?.id === id) setActive(null);
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-bold uppercase tracking-wide text-teal">Saved Drafts</p>
        <h1 className="mt-2 text-3xl font-black text-navy">Search, open, copy, and manage saved posts.</h1>
      </header>

      <Card>
        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-[42px] text-slate-400" size={18} />
            <Input label="Search drafts" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" placeholder="Search by title, post, or hashtag" />
          </div>
          <Select label="Filter by platform" options={["All", "LinkedIn", "Facebook", "Instagram"]} value={platform} onChange={(e) => setPlatform(e.target.value)} />
        </div>
      </Card>

      {active ? (
        <Card className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-teal">{active.platform}</p>
              <h2 className="mt-1 text-xl font-black text-navy">{active.title}</h2>
            </div>
            <button type="button" className="text-sm font-bold text-slate-500 hover:text-navy" onClick={() => setActive(null)}>Close</button>
          </div>
          {active.generatedImage ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={active.generatedImage} alt={active.title} className="aspect-square w-full max-w-md rounded-lg object-cover" />
            </>
          ) : null}
          <OutputBox title="Opened Draft Post" content={active.finalPost} />
          {active.hashtags.length ? <OutputBox title="Hashtags" content={active.hashtags} /> : null}
          {active.imagePrompt ? <OutputBox title="Image Prompt" content={active.imagePrompt} /> : null}
        </Card>
      ) : null}

      {filtered.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((draft) => (
            <div key={draft.id} onDoubleClick={() => setActive(draft)} className="cursor-pointer" role="button" tabIndex={0} onKeyDown={(event) => event.key === "Enter" && setActive(draft)}>
              <DraftCard draft={draft} onDelete={remove} />
              <button type="button" className="mt-2 text-sm font-bold text-teal" onClick={() => setActive(draft)}>Open draft</button>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <p className="text-sm text-slate-600">No drafts match your search yet.</p>
        </Card>
      )}
    </div>
  );
}
