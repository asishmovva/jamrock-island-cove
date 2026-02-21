"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatUsd } from "@/lib/currency";
import { menuItemSchema } from "@/lib/validation/order";

const highlightsResponseSchema = z.object({
  popular: z.array(menuItemSchema),
  featured: z.array(menuItemSchema),
});

async function fetchHighlights() {
  const response = await fetch("/api/menu/highlights", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to load menu highlights.");
  }
  const data = (await response.json()) as unknown;
  return highlightsResponseSchema.parse(data);
}

function HighlightsGrid({
  title,
  description,
  items,
  emptyLabel,
}: {
  title: string;
  description: string;
  items: z.infer<typeof menuItemSchema>[];
  emptyLabel: string;
}) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {!items.length ? (
        <Card>
          <CardContent className="py-6">
            <p className="text-sm text-muted-foreground">{emptyLabel}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {items.map((item) => (
            <Card key={item.id} className="h-full">
              <CardHeader className="space-y-2 pb-2">
                <div className="flex flex-wrap items-center gap-1">
                  {item.isFeatured ? <Badge variant="secondary">Featured</Badge> : null}
                  {item.isPopular ? <Badge variant="accent">Popular</Badge> : null}
                </div>
                <CardTitle className="text-base leading-tight">{item.name}</CardTitle>
                <CardDescription className="line-clamp-2 text-xs">
                  {item.description ?? "Island-inspired flavor made fresh daily."}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm font-semibold text-foreground">
                  {formatUsd(item.basePriceCents)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

export function MenuHighlights() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["menu-highlights"],
    queryFn: fetchHighlights,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-sm text-muted-foreground">Loading menu highlights...</p>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="border-destructive/30 bg-destructive/5">
        <CardContent className="space-y-3 py-6">
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : "Unable to load menu highlights."}
          </p>
          <Button asChild size="sm" variant="outline">
            <Link href="/menu">View full menu</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-10">
      <HighlightsGrid
        title="Popular Items"
        description="Most-ordered dishes and drinks right now."
        items={data.popular}
        emptyLabel="No popular items have been flagged yet."
      />
      <HighlightsGrid
        title="Featured Combos"
        description="Chef-curated picks to spotlight this week."
        items={data.featured}
        emptyLabel="No featured items yet. Mark items as featured in admin."
      />
      <div className="rounded-2xl border border-primary/15 bg-card/70 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">Ready to order?</p>
            <p className="text-sm text-muted-foreground">
              Browse the full menu and build your pickup or delivery cart.
            </p>
          </div>
          <Button asChild>
            <Link href="/menu">Order now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
