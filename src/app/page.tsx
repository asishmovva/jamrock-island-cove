import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const popularItems = [
  {
    name: "Jerk Chicken Bowl",
    description: "Smoky jerk chicken over coconut rice with charred pineapple slaw.",
    tag: "Customer favorite",
  },
  {
    name: "Island Veggie Curry",
    description: "Coconut curry, roasted sweet potato, peppers, and fresh herbs.",
    tag: "Plant-based",
  },
  {
    name: "Pineapple Ginger Fizz",
    description: "House-made ginger beer, muddled mint, and lime over ice.",
    tag: "Bright and bubbly",
  },
];

const highlights = [
  {
    title: "Pickup or Delivery",
    description: "Switch at checkout. Delivery runs within 5 miles of the cove.",
  },
  {
    title: "Prepared Fresh",
    description: "Jamaican thyme, scotch bonnet heat, and citrus-forward marinades.",
  },
  {
    title: "Status Alerts",
    description: "Stay updated from new order to ready-for-pickup or out-for-delivery.",
  },
];

export default function Home() {
  return (
    <div className="space-y-16 pb-16">
      <section className="border-b border-border/60 bg-gradient-to-br from-primary/5 via-background to-secondary/10">
        <div className="container grid gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <Badge variant="accent">Now serving Kingston-inspired bites</Badge>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl">JamRock Island Cove</h1>
              <p className="max-w-2xl text-lg text-muted-foreground">
                Clean, modern Jamaican flavors made for busy days. Choose pickup or let us deliver
                within 5 miles - either way your meal is cooked to order and packed with island
                brightness.
              </p>
            </div>
            <div className="flex flex-wrap gap-3" id="order">
              <Button asChild size="lg">
                <Link href="/order?mode=pickup">Order pickup</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/order?mode=delivery">Order delivery</Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link href="#about">View hours and location</Link>
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {highlights.map((item) => (
                <Card key={item.title} className="border-border/80">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {item.description}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="border-primary/15 bg-card/70 shadow-lg backdrop-blur">
            <CardHeader className="space-y-2">
              <Badge variant="secondary" className="w-fit">
                Fresh today
              </Badge>
              <CardTitle className="text-2xl">Island-ready in minutes</CardTitle>
              <CardDescription className="text-base">
                Set your fulfillment preference now - pickup or delivery - and we will keep it
                locked for checkout.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-3 rounded-xl border border-dashed border-border/70 bg-muted/40 p-4">
                <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-green-500" />
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">Pickup</p>
                  <p>Walk in or curbside. We will ping you when your order is ready.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-dashed border-border/70 bg-muted/40 p-4">
                <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-amber-500" />
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">Delivery</p>
                  <p>Mapbox-verified addresses within 5 miles. Add a tip and track status.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge variant="outline">Card, Apple Pay, Google Pay</Badge>
                <Badge variant="outline">Guest checkout ready</Badge>
                <Badge variant="outline">Island-tested recipes</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container space-y-8" id="popular">
        <div className="space-y-3">
          <Badge variant="accent">Popular right now</Badge>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-3xl font-semibold">House favorites</h2>
            <p className="text-sm text-muted-foreground">
              These dishes stay on rotation; expect to see them highlighted in the app.
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popularItems.map((item) => (
            <Card key={item.name} className="h-full border-border/80">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{item.tag}</Badge>
                </div>
                <CardTitle>{item.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {item.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container grid gap-8 lg:grid-cols-[1.2fr_0.8fr]" id="about">
        <div className="space-y-4">
          <Badge variant="accent">Island roots, modern kitchen</Badge>
          <h3 className="text-2xl font-semibold">Made for smooth ordering</h3>
          <p className="text-base text-muted-foreground">
            JamRock Island Cove keeps the experience focused - no clutter, just great food. We will
            validate delivery distance, surface smart upsells, and send alerts so you always know
            when to step out or open the door.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-base">Hours</CardTitle>
                <CardDescription>Open daily for lunch and dinner.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Mon-Thu: 11a - 9p
                <br />
                Fri-Sat: 11a - 10p
                <br />
                Sun: 12p - 8p
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-base">Location</CardTitle>
                <CardDescription>Built for easy pickup and speedy delivery.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                325 Island Breeze Blvd
                <br />
                Suite 12, Kingston Bay
                <br />
                Within 5 miles for delivery.
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="tel:+15555551234">Call the kitchen</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="mailto:hello@jamrockislandcove.com">Email us</Link>
            </Button>
          </div>
        </div>
        <Card className="border-border/70 bg-muted/30">
          <CardHeader className="space-y-2">
            <CardTitle>What to expect next</CardTitle>
            <CardDescription className="text-base">
              This is the starting point. Upcoming milestones bring auth, checkout, admin, and
              realtime order monitoring.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="rounded-xl border border-dashed border-border/70 bg-background p-3">
              PR-0: Base Next.js app, Tailwind plus shadcn/ui, React Query, RHF, and Zod.
            </div>
            <div className="rounded-xl border border-dashed border-border/70 bg-background p-3">
              Upcoming: Auth, database wiring, interactive menu, cart, checkout, and Stripe.
            </div>
            <div className="rounded-xl border border-dashed border-border/70 bg-background p-3">
              Admin tooling with sound alerts and Mapbox delivery validation on deck.
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
