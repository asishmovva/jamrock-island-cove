import Link from "next/link";

import { MenuHighlights } from "@/components/home/menu-highlights";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const serviceCards = [
  {
    title: "Pickup",
    description: "Hot and ready with status updates from NEW to READY.",
  },
  {
    title: "Delivery",
    description: "Built for local delivery within 5 miles of JamRock Island Cove.",
  },
  {
    title: "Guest checkout",
    description: "Order fast now, create an account later if you want saved addresses.",
  },
];

export default function Home() {
  return (
    <div className="space-y-14 pb-16">
      <section className="from-primary/12 relative overflow-hidden border-b border-primary/10 bg-gradient-to-br via-background to-secondary/15">
        <div className="container grid gap-8 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-5">
            <Badge variant="accent" className="w-fit">
              Jamaican crafted - Fresh daily
            </Badge>
            <div className="space-y-3">
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl">JamRock Island Cove</h1>
              <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
                Caribbean flavor, modern ordering flow. Browse our most popular dishes and featured
                combos, then checkout for pickup or delivery.
              </p>
            </div>
            <div className="flex flex-wrap gap-3" id="order">
              <Button asChild size="lg">
                <Link href="/menu">Order now</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/menu?fulfillment=delivery">Order delivery</Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link href="#about">Hours and location</Link>
              </Button>
            </div>
          </div>

          <Card className="border-primary/15 bg-card/85">
            <CardHeader>
              <CardTitle className="text-xl">Built for fast ordering</CardTitle>
              <CardDescription>
                Start on menu, add to cart, checkout, and track status from confirmation page.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {serviceCards.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-border/70 bg-muted/30 p-3"
                >
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container space-y-4">
        <div className="space-y-1">
          <Badge variant="accent">Menu highlights</Badge>
          <p className="text-sm text-muted-foreground">
            Data-driven sections from live menu flags (`isPopular`, `isFeatured`).
          </p>
        </div>
        <MenuHighlights />
      </section>

      <section className="container grid gap-8 lg:grid-cols-[1.15fr_0.85fr]" id="about">
        <div className="space-y-4">
          <Badge variant="accent">Visit JamRock</Badge>
          <h2 className="text-2xl font-semibold">Island kitchen with modern service</h2>
          <p className="max-w-2xl text-base text-muted-foreground">
            We keep the experience simple: clear menu, reliable checkout, and transparent order
            status from submission to pickup or delivery.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-base">Hours</CardTitle>
                <CardDescription>Open daily</CardDescription>
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
                <CardTitle className="text-base">Address</CardTitle>
                <CardDescription>Pickup + local delivery</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                325 Island Breeze Blvd
                <br />
                Suite 12, Kingston Bay
                <br />
                Delivery radius: 5 miles
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="h-fit border-border/70 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-lg">Ready to get started?</CardTitle>
            <CardDescription>Open the menu and build your cart in under a minute.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/menu">Browse menu</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/cart">View cart</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
