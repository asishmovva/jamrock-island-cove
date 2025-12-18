import Link from "next/link";

const currentYear = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer className="border-t border-primary/10 bg-primary/5" id="contact">
      <div className="container flex flex-col gap-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="font-semibold text-foreground">JamRock Island Cove</p>
          <p>Island-fresh fuel for pickup or delivery within 5 miles.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link className="hover:text-foreground" href="mailto:hello@jamrockislandcove.com">
            hello@jamrockislandcove.com
          </Link>
          <span aria-hidden="true" className="hidden sm:inline">
            |
          </span>
          <p className="text-xs sm:text-sm">Kingston Bay · (c) {currentYear}</p>
        </div>
      </div>
    </footer>
  );
}
