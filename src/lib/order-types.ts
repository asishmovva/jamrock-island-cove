export const menuItemTypeValues = ["MAIN", "SIDE", "DRINK", "DESSERT"] as const;
export type MenuItemType = (typeof menuItemTypeValues)[number];

export const fulfillmentTypeValues = ["PICKUP", "DELIVERY"] as const;
export type FulfillmentType = (typeof fulfillmentTypeValues)[number];

export type CartLineItem = {
  menuItemId: string;
  name: string;
  priceCents: number;
  qty: number;
  imageUrl?: string | null;
  type: MenuItemType;
  specialInstructions?: string;
};

export type OrderTotals = {
  subtotalCents: number;
  taxCents: number;
  deliveryFeeCents: number;
  tipCents: number;
  totalCents: number;
};
