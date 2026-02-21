import type { FulfillmentType, OrderTotals } from "@/lib/order-types";

type PriceInputItem = {
  priceCents: number;
  qty: number;
};

export const TAX_RATE_BPS = 875;
export const DELIVERY_FEE_CENTS = 399;

export function calculateSubtotalCents(items: PriceInputItem[]) {
  return items.reduce((sum, item) => sum + item.priceCents * item.qty, 0);
}

export function calculateTaxCents(subtotalCents: number) {
  return Math.round((subtotalCents * TAX_RATE_BPS) / 10_000);
}

export function calculateDeliveryFeeCents(fulfillmentType: FulfillmentType) {
  return fulfillmentType === "DELIVERY" ? DELIVERY_FEE_CENTS : 0;
}

type CalculateOrderTotalsInput = {
  items: PriceInputItem[];
  tipCents: number;
  fulfillmentType: FulfillmentType;
};

export function calculateOrderTotals({
  items,
  tipCents,
  fulfillmentType,
}: CalculateOrderTotalsInput): OrderTotals {
  const subtotalCents = calculateSubtotalCents(items);
  const taxCents = calculateTaxCents(subtotalCents);
  const deliveryFeeCents = calculateDeliveryFeeCents(fulfillmentType);
  const boundedTipCents = Math.max(0, tipCents);
  const totalCents = subtotalCents + taxCents + deliveryFeeCents + boundedTipCents;

  return {
    subtotalCents,
    taxCents,
    deliveryFeeCents,
    tipCents: boundedTipCents,
    totalCents,
  };
}
