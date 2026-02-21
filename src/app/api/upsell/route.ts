import { NextResponse } from "next/server";
import { z } from "zod";

import { getStubMenuItemById, STUB_DESSERT_SUGGESTIONS } from "@/lib/menu-stubs";
import { menuItemTypeValues } from "@/lib/order-types";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const upsellRequestSchema = z.object({
  cartItemIds: z.array(z.string().min(1)).optional().default([]),
  cartTypes: z.array(z.enum(menuItemTypeValues)).optional().default([]),
});

type UpsellItem = {
  id: string;
  name: string;
  description: string | null;
  basePriceCents: number;
  imageUrl: string | null;
  type: (typeof menuItemTypeValues)[number];
  isPopular: boolean;
  isFeatured: boolean;
  isStub: boolean;
};

function toUpsellItem(item: Omit<UpsellItem, "isStub">, isStub = false): UpsellItem {
  return {
    ...item,
    isStub,
  };
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as unknown;
  const parsed = upsellRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid upsell payload." }, { status: 400 });
  }

  const { cartItemIds, cartTypes } = parsed.data;
  const typeSet = new Set(cartTypes);

  if (cartItemIds.length > 0) {
    const dbCartItems = await prisma.menuItem.findMany({
      where: {
        id: { in: cartItemIds.filter((id) => !getStubMenuItemById(id)) },
      },
      select: {
        type: true,
      },
    });
    for (const item of dbCartItems) {
      typeSet.add(item.type);
    }
    for (const itemId of cartItemIds) {
      const stubItem = getStubMenuItemById(itemId);
      if (stubItem) {
        typeSet.add(stubItem.type);
      }
    }
  }

  const hasDrink = typeSet.has("DRINK");
  const hasDessert = typeSet.has("DESSERT");

  let drinkSuggestions: UpsellItem[] = [];
  let dessertSuggestions: UpsellItem[] = [];

  if (!hasDrink) {
    const drinks = await prisma.menuItem.findMany({
      where: {
        isActive: true,
        type: "DRINK",
        isPopular: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        basePriceCents: true,
        imageUrl: true,
        type: true,
        isPopular: true,
        isFeatured: true,
      },
      orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
      take: 3,
    });

    drinkSuggestions = drinks.map((item) => toUpsellItem(item));
  }

  if (!hasDessert) {
    const desserts = await prisma.menuItem.findMany({
      where: {
        isActive: true,
        type: "DESSERT",
        isFeatured: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        basePriceCents: true,
        imageUrl: true,
        type: true,
        isPopular: true,
        isFeatured: true,
      },
      orderBy: [{ isPopular: "desc" }, { name: "asc" }],
      take: 2,
    });

    if (desserts.length > 0) {
      dessertSuggestions = desserts.map((item) => toUpsellItem(item));
    } else {
      dessertSuggestions = STUB_DESSERT_SUGGESTIONS.map((item) =>
        toUpsellItem(
          {
            id: item.id,
            name: item.name,
            description: item.description,
            basePriceCents: item.basePriceCents,
            imageUrl: item.imageUrl,
            type: item.type,
            isPopular: item.isPopular,
            isFeatured: item.isFeatured,
          },
          true,
        ),
      );
    }
  }

  return NextResponse.json({
    drinkSuggestions,
    dessertSuggestions,
  });
}
