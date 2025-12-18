import Link from "next/link";

import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
          <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-bold uppercase tracking-wide text-primary">
            JamRock
          </span>
          <span className="hidden text-foreground/80 sm:inline">Island Cove</span>
        </Link>

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-4 text-sm font-medium text-muted-foreground sm:flex">
            <Link className="transition hover:text-foreground" href="#popular">
              Popular
            </Link>
            <Link className="transition hover:text-foreground" href="#about">
              About
            </Link>
            <Link className="transition hover:text-foreground" href="#contact">
              Contact
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
