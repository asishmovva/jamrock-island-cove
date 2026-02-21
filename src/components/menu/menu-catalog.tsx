"use client";

import { useEffect, useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import Link from "next/link";

import { useCart } from "@/components/cart/cart-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatUsd } from "@/lib/currency";
import type { MenuItemType } from "@/lib/order-types";
import { menuItemSchema } from "@/lib/validation/order";

const menuResponseSchema = z.object({
  items: z.array(menuItemSchema),
});

const typeLabels: Record<MenuItemType, string> = {
  MAIN: "Mains",
  SIDE: "Sides",
  DRINK: "Drinks",
  DESSERT: "Desserts",
};

async function fetchMenuItems() {
  const response = await fetch("/api/menu", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to load menu.");
  }
  const data = (await response.json()) as unknown;
  return menuResponseSchema.parse(data).items;
}

type MenuCatalogProps = {
  initialFulfillment?: string;
};

export function MenuCatalog({ initialFulfillment }: MenuCatalogProps) {
  const cart = useCart();
  const didInitFulfillment = useRef(false);
  const { data, isLoading, error } = useQuery({
    queryKey: ["menu-items"],
    queryFn: fetchMenuItems,
  });

  useEffect(() => {
    if (didInitFulfillment.current) {
      return;
    }

    if (initialFulfillment === "pickup") {
      cart.setFulfillmentType("PICKUP");
    } else if (initialFulfillment === "delivery") {
      cart.setFulfillmentType("DELIVERY");
    }

    didInitFulfillment.current = true;
  }, [cart, initialFulfillment]);

  const grouped = useMemo(() => {
    const groups: Record<MenuItemType, z.infer<typeof menuItemSchema>[]> = {
      MAIN: [],
      SIDE: [],
      DRINK: [],
      DESSERT: [],
    };

    for (const item of data ?? []) {
      groups[item.type].push(item);
    }

    return groups;
  }, [data]);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading menu...</p>;
  }

  if (error) {
    return (
      <Card className="max-w-2xl border-destructive/30 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-lg">Unable to load menu</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Please refresh the page and try again.</p>
        </CardContent>
      </Card>
    );
  }

  if (!data?.length) {
    return (
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-lg">Menu is empty</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No active items were found in the database.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card/70 p-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Cart</p>
          <p className="text-sm text-muted-foreground">
            {cart.items.length} items - {formatUsd(cart.totalCents)}
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/cart">View cart</Link>
        </Button>
      </div>

      {(Object.keys(grouped) as MenuItemType[]).map((type) => {
        const items = grouped[type];
        if (!items.length) {
          return null;
        }

        return (
          <section key={type} className="space-y-4">
            <h2 className="text-2xl font-semibold">{typeLabels[type]}</h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => {
                const inCart = cart.items.find((cartItem) => cartItem.menuItemId === item.id);

                return (
                  <Card key={item.id} className="flex h-full flex-col">
                    <CardHeader className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          {item.isFeatured ? <Badge variant="secondary">Featured</Badge> : null}
                          {item.isPopular ? <Badge variant="accent">Popular</Badge> : null}
                        </div>
                      </div>
                      <CardDescription>
                        {item.description ?? "Island-fresh and made to order."}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto space-y-3">
                      <p className="text-base font-semibold text-foreground">
                        {formatUsd(item.basePriceCents)}
                      </p>
                      {inCart ? (
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => cart.setItemQuantity(item.id, inCart.qty - 1)}
                          >
                            -
                          </Button>
                          <span className="min-w-8 text-center text-sm font-semibold">
                            {inCart.qty}
                          </span>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => cart.setItemQuantity(item.id, inCart.qty + 1)}
                          >
                            +
                          </Button>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          onClick={() =>
                            cart.addItem({
                              menuItemId: item.id,
                              name: item.name,
                              priceCents: item.basePriceCents,
                              imageUrl: item.imageUrl,
                              type: item.type,
                              specialInstructions: "",
                            })
                          }
                        >
                          Add to cart
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
