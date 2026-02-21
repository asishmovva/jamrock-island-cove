import type { MenuItemType } from "@/lib/order-types";

export type StubMenuItem = {
  id: string;
  name: string;
  description: string;
  basePriceCents: number;
  imageUrl: string | null;
  type: MenuItemType;
  isPopular: boolean;
  isFeatured: boolean;
};

export const STUB_DESSERT_SUGGESTIONS: StubMenuItem[] = [
  {
    id: "stub-dessert-rum-cake-slice",
    name: "Rum Cake Slice",
    description: "Seasonal dessert preview while full dessert menu is being finalized.",
    basePriceCents: 550,
    imageUrl: "/images/placeholder-food.jpg",
    type: "DESSERT",
    isPopular: false,
    isFeatured: true,
  },
  {
    id: "stub-dessert-sweet-potato-pudding",
    name: "Sweet Potato Pudding",
    description: "Seasonal dessert preview while full dessert menu is being finalized.",
    basePriceCents: 500,
    imageUrl: "/images/placeholder-food.jpg",
    type: "DESSERT",
    isPopular: false,
    isFeatured: true,
  },
];

const stubMap = new Map(STUB_DESSERT_SUGGESTIONS.map((item) => [item.id, item]));

export function getStubMenuItemById(id: string) {
  return stubMap.get(id) ?? null;
}
