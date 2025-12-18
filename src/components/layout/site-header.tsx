import Link from "next/link";

import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-primary/10 bg-background/85 shadow-[0_12px_30px_-24px_hsl(var(--primary))] backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="container flex h-16 items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-3 text-sm font-semibold">
          <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.16em] text-primary">
            JamRock
          </span>
          <span className="hidden text-foreground/80 sm:inline">Island Cove</span>
        </Link>

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-5 text-sm font-medium text-muted-foreground sm:flex">
            <Link className="transition hover:text-foreground" href="/menu">
              Menu
            </Link>
            <Link className="transition hover:text-foreground" href="/login">
              Login
            </Link>
            <Link className="transition hover:text-foreground" href="#about">
              About
            </Link>
          </nav>
          <Button size="sm" asChild>
            <Link href="#order">Order now</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
