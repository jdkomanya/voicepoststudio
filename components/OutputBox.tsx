"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/Button";

export function OutputBox({ title, content }: { title: string; content: string | string[] }) {
  const [copied, setCopied] = useState(false);
  const text = Array.isArray(content) ? content.join("\n") : content;

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-navy">{title}</h3>
        <Button type="button" variant="ghost" className="min-h-9 px-3 py-1.5" onClick={copy} icon={copied ? <Check size={16} /> : <Copy size={16} />}>
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <div className="whitespace-pre-wrap text-sm leading-6 text-slate-800">
        {Array.isArray(content)
          ? content.map((item, index) => (
              <p key={`${item}-${index}`} className="mb-2 last:mb-0">
                {item}
              </p>
            ))
          : content}
      </div>
    </div>
  );
}
