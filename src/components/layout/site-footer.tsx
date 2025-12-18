import Link from "next/link";

const currentYear = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/30" id="contact">
      <div className="container flex flex-col gap-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="font-semibold text-foreground">JamRock Island Cove</p>
          <p>Fresh Jamaican bites for pickup or delivery.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link className="hover:text-foreground" href="mailto:hello@jamrockislandcove.com">
            hello@jamrockislandcove.com
          </Link>
          <span aria-hidden="true" className="hidden sm:inline">
            |
          </span>
          <p className="text-xs sm:text-sm">(c) {currentYear} All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
