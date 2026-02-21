"use client";

import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatUsd } from "@/lib/currency";

const orderResponseSchema = z.object({
  order: z.object({
    id: z.string(),
    status: z.string(),
    fulfillmentType: z.enum(["PICKUP", "DELIVERY"]),
    customerName: z.string(),
    customerEmail: z.string(),
    subtotalCents: z.number(),
    taxCents: z.number(),
    deliveryFeeCents: z.number(),
    tipCents: z.number(),
    totalCents: z.number(),
    createdAt: z.string().or(z.date()),
    items: z.array(
      z.object({
        id: z.string(),
        itemName: z.string(),
        quantity: z.number(),
        lineTotalCents: z.number(),
        specialInstructions: z.string().nullable(),
      }),
    ),
  }),
});

const statusLabelMap: Record<string, string> = {
  NEW: "New",
  ACCEPTED: "Accepted",
  READY: "Ready",
  OUT_FOR_DELIVERY: "Out for delivery",
  COMPLETED: "Completed",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

async function fetchOrder(orderId: string) {
  const response = await fetch(`/api/orders/${orderId}`, { cache: "no-store" });
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error || "Failed to load order.");
  }
  const data = (await response.json()) as unknown;
  return orderResponseSchema.parse(data).order;
}

type OrderStatusCardProps = {
  orderId: string;
};

export function OrderStatusCard({ orderId }: OrderStatusCardProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrder(orderId),
    refetchInterval: 7000,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-sm text-muted-foreground">Loading order details...</p>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="max-w-2xl border-destructive/30 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-lg">Unable to load order</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : "Order not found."}
          </p>
          <Button asChild variant="outline">
            <Link href="/menu">Back to menu</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-xl">Order #{data.id}</CardTitle>
          <Badge variant="accent">{statusLabelMap[data.status] ?? data.status}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {data.fulfillmentType === "DELIVERY" ? "Delivery" : "Pickup"} - {data.customerEmail}
        </p>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="space-y-2">
          {data.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3">
              <p>
                {item.quantity} x {item.itemName}
              </p>
              <p className="font-medium text-foreground">{formatUsd(item.lineTotalCents)}</p>
            </div>
          ))}
        </div>
        <div className="space-y-1 border-t border-border/70 pt-3">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span>{formatUsd(data.subtotalCents)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Tax</span>
            <span>{formatUsd(data.taxCents)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Delivery fee</span>
            <span>{formatUsd(data.deliveryFeeCents)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Tip</span>
            <span>{formatUsd(data.tipCents)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-border/70 pt-2 font-semibold text-foreground">
            <span>Total</span>
            <span>{formatUsd(data.totalCents)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
