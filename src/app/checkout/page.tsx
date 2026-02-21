"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useCart } from "@/components/cart/cart-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { formatUsd } from "@/lib/currency";
import { checkoutFormSchema, type CheckoutFormValues } from "@/lib/validation/order";

const tipOptions = [
  { label: "No tip", cents: 0 },
  { label: "$2", cents: 200 },
  { label: "$5", cents: 500 },
  { label: "$10", cents: 1000 },
];

type CreateOrderResponse = {
  orderId: string;
  status: string;
};

export default function CheckoutPage() {
  const cart = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const [status, setStatus] = useState<"idle" | "submitting">("idle");

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      fulfillmentType: cart.fulfillmentType,
      tipCents: cart.tipCents,
      distanceMiles: undefined,
      deliveryAddressLine1: "",
      deliveryAddressLine2: "",
      deliveryCity: "",
      deliveryState: "",
      deliveryZip: "",
      deliveryNotes: "",
    },
  });

  const fulfillmentType = form.watch("fulfillmentType");
  const tipCents = form.watch("tipCents");

  const isDelivery = fulfillmentType === "DELIVERY";
  const isEmpty = cart.items.length === 0;

  const orderPayloadItems = useMemo(
    () =>
      cart.items.map((item) => ({
        menuItemId: item.menuItemId,
        qty: item.qty,
        specialInstructions: item.specialInstructions ?? "",
      })),
    [cart.items],
  );

  const onSubmit = async (values: CheckoutFormValues) => {
    if (!orderPayloadItems.length) {
      toast({
        title: "Cart is empty",
        description: "Add menu items before checkout.",
      });
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          items: orderPayloadItems,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || "Unable to place order.");
      }

      const data = (await response.json()) as CreateOrderResponse;
      cart.clearCart();
      toast({
        title: "Order placed",
        description: "Your order was received successfully.",
      });
      router.push(`/order/${data.orderId}`);
      router.refresh();
    } catch (error) {
      toast({
        title: "Order failed",
        description: error instanceof Error ? error.message : "Unable to place order.",
      });
    } finally {
      setStatus("idle");
    }
  };

  return (
    <section className="container space-y-6 py-10">
      <div className="space-y-2">
        <Badge variant="accent">Checkout</Badge>
        <h1 className="text-3xl font-bold">Place your order</h1>
        <p className="max-w-2xl text-sm">
          Guest checkout is enabled. Sign in later for saved addresses and order history.
        </p>
      </div>

      {isEmpty ? (
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle className="text-lg">Your cart is empty</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Add items before continuing to checkout.
            </p>
            <Button asChild>
              <Link href="/menu">Go to menu</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customer details</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-medium text-foreground" htmlFor="customerName">
                      Full name
                    </label>
                    <Input id="customerName" {...form.register("customerName")} />
                    {form.formState.errors.customerName ? (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.customerName.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground" htmlFor="customerEmail">
                      Email
                    </label>
                    <Input id="customerEmail" type="email" {...form.register("customerEmail")} />
                    {form.formState.errors.customerEmail ? (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.customerEmail.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground" htmlFor="customerPhone">
                      Phone
                    </label>
                    <Input id="customerPhone" {...form.register("customerPhone")} />
                    {form.formState.errors.customerPhone ? (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.customerPhone.message}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Fulfillment</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant={fulfillmentType === "PICKUP" ? "default" : "outline"}
                      onClick={() => {
                        form.setValue("fulfillmentType", "PICKUP", { shouldValidate: true });
                        cart.setFulfillmentType("PICKUP");
                      }}
                    >
                      Pickup
                    </Button>
                    <Button
                      type="button"
                      variant={fulfillmentType === "DELIVERY" ? "default" : "outline"}
                      onClick={() => {
                        form.setValue("fulfillmentType", "DELIVERY", { shouldValidate: true });
                        cart.setFulfillmentType("DELIVERY");
                      }}
                    >
                      Delivery
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Tip</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {tipOptions.map((option) => (
                      <Button
                        key={option.cents}
                        type="button"
                        variant={tipCents === option.cents ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          form.setValue("tipCents", option.cents, { shouldValidate: true });
                          cart.setTipCents(option.cents);
                        }}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {isDelivery ? (
                  <div className="space-y-4 rounded-xl border border-border/70 p-4">
                    <p className="text-sm font-semibold text-foreground">Delivery address</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-2 sm:col-span-2">
                        <label
                          className="text-sm font-medium text-foreground"
                          htmlFor="deliveryAddressLine1"
                        >
                          Address line 1
                        </label>
                        <Input
                          id="deliveryAddressLine1"
                          {...form.register("deliveryAddressLine1")}
                        />
                        {form.formState.errors.deliveryAddressLine1 ? (
                          <p className="text-sm text-destructive">
                            {form.formState.errors.deliveryAddressLine1.message}
                          </p>
                        ) : null}
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label
                          className="text-sm font-medium text-foreground"
                          htmlFor="deliveryAddressLine2"
                        >
                          Address line 2 (optional)
                        </label>
                        <Input
                          id="deliveryAddressLine2"
                          {...form.register("deliveryAddressLine2")}
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium text-foreground"
                          htmlFor="deliveryCity"
                        >
                          City
                        </label>
                        <Input id="deliveryCity" {...form.register("deliveryCity")} />
                        {form.formState.errors.deliveryCity ? (
                          <p className="text-sm text-destructive">
                            {form.formState.errors.deliveryCity.message}
                          </p>
                        ) : null}
                      </div>
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium text-foreground"
                          htmlFor="deliveryState"
                        >
                          State
                        </label>
                        <Input id="deliveryState" {...form.register("deliveryState")} />
                        {form.formState.errors.deliveryState ? (
                          <p className="text-sm text-destructive">
                            {form.formState.errors.deliveryState.message}
                          </p>
                        ) : null}
                      </div>
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium text-foreground"
                          htmlFor="deliveryZip"
                        >
                          ZIP
                        </label>
                        <Input id="deliveryZip" {...form.register("deliveryZip")} />
                        {form.formState.errors.deliveryZip ? (
                          <p className="text-sm text-destructive">
                            {form.formState.errors.deliveryZip.message}
                          </p>
                        ) : null}
                      </div>
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium text-foreground"
                          htmlFor="distanceMiles"
                        >
                          Distance (optional)
                        </label>
                        <Input
                          id="distanceMiles"
                          type="number"
                          min={0}
                          max={5}
                          step={0.1}
                          {...form.register("distanceMiles", {
                            setValueAs: (value) => (value === "" ? undefined : Number(value)),
                          })}
                        />
                        {form.formState.errors.distanceMiles ? (
                          <p className="text-sm text-destructive">
                            {form.formState.errors.distanceMiles.message}
                          </p>
                        ) : null}
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label
                          className="text-sm font-medium text-foreground"
                          htmlFor="deliveryNotes"
                        >
                          Delivery notes (optional)
                        </label>
                        <Input id="deliveryNotes" {...form.register("deliveryNotes")} />
                      </div>
                    </div>
                  </div>
                ) : null}

                <Button type="submit" className="w-full" disabled={status === "submitting"}>
                  {status === "submitting" ? "Placing order..." : "Place order"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-lg">Order summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {cart.items.map((item) => (
                <div key={item.menuItemId} className="flex items-center justify-between gap-3">
                  <p>
                    {item.qty} x {item.name}
                  </p>
                  <p className="font-medium text-foreground">
                    {formatUsd(item.priceCents * item.qty)}
                  </p>
                </div>
              ))}
              <div className="space-y-1 border-t border-border/70 pt-3">
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
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
}
