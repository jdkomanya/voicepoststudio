"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Image, Library, PenLine, Settings } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/create-post", label: "Create Post", icon: PenLine },
  { href: "/generate-image", label: "Generate Image", icon: Image },
  { href: "/saved-drafts", label: "Saved Drafts", icon: Library },
  { href: "/settings", label: "Framework", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-clinic">
      <aside className="fixed left-0 top-0 hidden h-full w-64 border-r border-slate-200 bg-white px-4 py-6 lg:block">
        <Link href="/" className="mb-8 block rounded-lg bg-navy p-4 text-white">
          <p className="text-xs font-semibold uppercase tracking-wide text-mint">VOICE Framework</p>
          <h1 className="mt-1 text-xl font-black">Post Studio</h1>
        </Link>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${
                  active ? "bg-mint text-navy" : "text-slate-600 hover:bg-slate-50 hover:text-navy"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="pb-24 lg:ml-64 lg:pb-0">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">{children}</div>
      </main>
      <nav className="fixed bottom-0 left-0 right-0 z-20 grid grid-cols-5 border-t border-slate-200 bg-white lg:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 px-1 py-2 text-[11px] font-semibold ${active ? "text-teal" : "text-slate-500"}`}>
              <Icon size={19} />
              <span className="max-w-full truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
