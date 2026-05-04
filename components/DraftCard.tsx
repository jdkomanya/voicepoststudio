"use client";

import { Calendar, Copy, Image as ImageIcon, Trash2 } from "lucide-react";
import type { Draft } from "@/lib/types";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";

export function DraftCard({ draft, onDelete }: { draft: Draft; onDelete: (id: string) => void }) {
  const hashtags = draft.hashtags.join(" ");

  return (
    <Card className="flex h-full flex-col gap-4">
      <div>
        <div className="mb-2 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-teal">{draft.platform}</p>
            <h3 className="mt-1 text-lg font-bold text-navy">{draft.title}</h3>
          </div>
          {draft.generatedImage ? <ImageIcon className="shrink-0 text-leaf" size={20} /> : null}
        </div>
        <p className="flex items-center gap-2 text-xs text-slate-500">
          <Calendar size={14} />
          {new Date(draft.dateCreated).toLocaleDateString()}
        </p>
      </div>
      {draft.generatedImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={draft.generatedImage} alt={draft.title} className="aspect-square w-full rounded-lg object-cover" />
      ) : null}
      <p className="line-clamp-5 whitespace-pre-wrap text-sm leading-6 text-slate-700">{draft.finalPost}</p>
      {hashtags ? <p className="text-xs leading-5 text-teal">{hashtags}</p> : null}
      <div className="mt-auto flex flex-wrap gap-2">
        <Button type="button" variant="secondary" onClick={() => navigator.clipboard.writeText(`${draft.finalPost}\n\n${hashtags}`)} icon={<Copy size={16} />}>
          Copy
        </Button>
        <Button type="button" variant="danger" onClick={() => onDelete(draft.id)} icon={<Trash2 size={16} />}>
          Delete
        </Button>
      </div>
    </Card>
  );
}
