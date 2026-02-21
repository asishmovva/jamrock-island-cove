"use client";

import Link from "next/link";

import { useCart } from "@/components/cart/cart-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatUsd } from "@/lib/currency";

const tipOptions = [
  { label: "No tip", cents: 0 },
  { label: "$2", cents: 200 },
  { label: "$5", cents: 500 },
  { label: "$10", cents: 1000 },
];

export default function CartPage() {
  const cart = useCart();

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
