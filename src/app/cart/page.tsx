"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

import { useCart } from "@/components/cart/cart-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatUsd } from "@/lib/currency";
import { menuItemTypeValues } from "@/lib/order-types";

const tipOptions = [
  { label: "No tip", cents: 0 },
  { label: "$2", cents: 200 },
  { label: "$5", cents: 500 },
  { label: "$10", cents: 1000 },
];

const upsellItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  basePriceCents: z.number().int().nonnegative(),
  imageUrl: z.string().nullable(),
  type: z.enum(menuItemTypeValues),
  isPopular: z.boolean(),
  isFeatured: z.boolean(),
  isStub: z.boolean(),
});

const upsellResponseSchema = z.object({
  drinkSuggestions: z.array(upsellItemSchema),
  dessertSuggestions: z.array(upsellItemSchema),
});

async function fetchUpsells(params: {
  cartItemIds: string[];
  cartTypes: (typeof menuItemTypeValues)[number][];
}) {
  const response = await fetch("/api/upsell", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error("Unable to load upsell suggestions.");
  }

  const data = (await response.json()) as unknown;
  return upsellResponseSchema.parse(data);
}

export default function CartPage() {
  const cart = useCart();
  const cartItemIds = useMemo(() => cart.items.map((item) => item.menuItemId), [cart.items]);
  const cartTypes = useMemo(
    () => Array.from(new Set(cart.items.map((item) => item.type))),
    [cart.items],
  );

  const { data: upsells } = useQuery({
    queryKey: ["upsells", cartItemIds.slice().sort().join(","), cartTypes.slice().sort().join(",")],
    queryFn: () => fetchUpsells({ cartItemIds, cartTypes }),
    enabled: cart.items.length > 0,
  });

  const hasUpsells =
    (upsells?.drinkSuggestions.length ?? 0) > 0 || (upsells?.dessertSuggestions.length ?? 0) > 0;

  return (
    <section className="container space-y-6 py-10">
      <div className="space-y-2">
        <Badge variant="accent">Cart</Badge>
        <h1 className="text-3xl font-bold">Your order</h1>
        <p className="max-w-2xl text-sm">
          Update quantities, set fulfillment, and review totals before checkout.
        </p>
      </div>

      {!cart.items.length ? (
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle className="text-lg">Your cart is empty</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Add dishes from the menu to place an order.
            </p>
            <Button asChild>
              <Link href="/menu">Browse menu</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.menuItemId}
                  className="space-y-3 rounded-xl border border-border/70 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatUsd(item.priceCents)} each
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => cart.setItemQuantity(item.menuItemId, item.qty - 1)}
                      >
                        -
                      </Button>
                      <span className="min-w-8 text-center text-sm font-semibold">{item.qty}</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => cart.setItemQuantity(item.menuItemId, item.qty + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Special instructions
                    </label>
                    <Input
                      value={item.specialInstructions ?? ""}
                      onChange={(event) =>
                        cart.setItemInstructions(item.menuItemId, event.currentTarget.value)
                      }
                      placeholder="No onions, extra sauce..."
                      maxLength={300}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <p className="font-semibold text-foreground">
                      {formatUsd(item.priceCents * item.qty)}
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => cart.removeItem(item.menuItemId)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}

              {hasUpsells ? (
                <div className="space-y-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">You might also like</p>
                    <p className="text-xs text-muted-foreground">
                      One-click add suggestions based on what is missing in your cart.
                    </p>
                  </div>

                  {upsells?.drinkSuggestions.length ? (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Add a drink
                      </p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {upsells.drinkSuggestions.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-2 rounded-lg border border-border/70 bg-card/80 p-3"
                          >
                            <div>
                              <p className="text-sm font-medium text-foreground">{item.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatUsd(item.basePriceCents)}
                              </p>
                            </div>
                            <Button
                              size="sm"
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
                              Add
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {upsells?.dessertSuggestions.length ? (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Add a dessert
                      </p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {upsells.dessertSuggestions.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-2 rounded-lg border border-border/70 bg-card/80 p-3"
                          >
                            <div>
                              <p className="text-sm font-medium text-foreground">{item.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatUsd(item.basePriceCents)}
                              </p>
                            </div>
                            <Button
                              size="sm"
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
                              Add
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-lg">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Fulfillment
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={cart.fulfillmentType === "PICKUP" ? "default" : "outline"}
                    size="sm"
                    onClick={() => cart.setFulfillmentType("PICKUP")}
                  >
                    Pickup
                  </Button>
                  <Button
                    type="button"
                    variant={cart.fulfillmentType === "DELIVERY" ? "default" : "outline"}
                    size="sm"
                    onClick={() => cart.setFulfillmentType("DELIVERY")}
                  >
                    Delivery
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Tip
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {tipOptions.map((option) => (
                    <Button
                      key={option.cents}
                      type="button"
                      size="sm"
                      variant={cart.tipCents === option.cents ? "default" : "outline"}
                      onClick={() => cart.setTipCents(option.cents)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>{formatUsd(cart.subtotalCents)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tax</span>
                  <span>{formatUsd(cart.taxCents)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Delivery fee</span>
                  <span>{formatUsd(cart.deliveryFeeCents)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tip</span>
                  <span>{formatUsd(cart.tipCents)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-border/70 pt-2 font-semibold text-foreground">
                  <span>Total</span>
                  <span>{formatUsd(cart.totalCents)}</span>
                </div>
              </div>

              <Button asChild className="w-full">
                <Link href="/checkout">Continue to checkout</Link>
              </Button>
              <Button variant="ghost" className="w-full" onClick={cart.clearCart}>
                Clear cart
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
}
