import { NextResponse } from "next/server";

import { getStubMenuItemById } from "@/lib/menu-stubs";
import { calculateOrderTotals } from "@/lib/order-pricing";
import { prisma } from "@/lib/prisma";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { createOrderRequestSchema } from "@/lib/validation/order";

export const runtime = "nodejs";

type SessionUser = {
  userId: string | null;
  isAdmin: boolean;
};

type ResolvedOrderItem = {
  menuItemId: string | null;
  itemName: string;
  basePriceCents: number;
  quantity: number;
  lineTotalCents: number;
  specialInstructions: string | null;
};

async function getSessionUser(): Promise<SessionUser> {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return { userId: null, isAdmin: false };
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const role = (session?.user?.app_metadata as { role?: string } | null)?.role;
  return {
    userId: session?.user?.id ?? null,
    isAdmin: role === "admin",
  };
}

export async function POST(request: Request) {
  try {
    const json = (await request.json()) as unknown;
    const parsed = createOrderRequestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid order payload",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const payload = parsed.data;
    const { userId, isAdmin } = await getSessionUser();

    const menuItemIds = Array.from(new Set(payload.items.map((item) => item.menuItemId)));
    const dbMenuItemIds = menuItemIds.filter((id) => !getStubMenuItemById(id));

    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: dbMenuItemIds }, isActive: true },
      select: {
        id: true,
        name: true,
        basePriceCents: true,
        stockQty: true,
      },
    });

    if (menuItems.length !== dbMenuItemIds.length) {
      return NextResponse.json(
        {
          error: "One or more menu items are unavailable.",
        },
        { status: 400 },
      );
    }

    const menuItemMap = new Map(menuItems.map((item) => [item.id, item]));
    const orderItems: ResolvedOrderItem[] = payload.items.map((item) => {
      const menuItem = menuItemMap.get(item.menuItemId);
      const stubItem = getStubMenuItemById(item.menuItemId);

      if (!menuItem && !stubItem) {
        throw new Error(`Missing menu item ${item.menuItemId}`);
      }
      if (menuItem && menuItem.stockQty !== null && item.qty > menuItem.stockQty) {
        throw new Error(`Insufficient stock for ${menuItem.name}`);
      }
      const resolvedName = menuItem?.name ?? stubItem?.name ?? "Unavailable item";
      const resolvedBasePriceCents = menuItem?.basePriceCents ?? stubItem?.basePriceCents ?? 0;

      return {
        menuItemId: menuItem?.id ?? null,
        itemName: resolvedName,
        basePriceCents: resolvedBasePriceCents,
        quantity: item.qty,
        lineTotalCents: resolvedBasePriceCents * item.qty,
        specialInstructions: item.specialInstructions?.trim() || null,
      };
    });

    const totals = calculateOrderTotals({
      items: orderItems.map((item) => ({ priceCents: item.basePriceCents, qty: item.quantity })),
      tipCents: payload.tipCents,
      fulfillmentType: payload.fulfillmentType,
    });

    const isDelivery = payload.fulfillmentType === "DELIVERY";

    const order = await prisma.order.create({
      data: {
        userId,
        status: "NEW",
        fulfillmentType: payload.fulfillmentType,
        customerName: payload.customerName.trim(),
        customerEmail: payload.customerEmail.trim().toLowerCase(),
        customerPhone: payload.customerPhone.trim(),
        subtotalCents: totals.subtotalCents,
        taxCents: totals.taxCents,
        deliveryFeeCents: totals.deliveryFeeCents,
        tipCents: totals.tipCents,
        totalCents: totals.totalCents,
        paymentMethod: "PAY_AT_PICKUP",
        paymentStatus: "UNPAID",
        deliveryAddressLine1: isDelivery ? payload.deliveryAddressLine1?.trim() || null : null,
        deliveryAddressLine2: isDelivery ? payload.deliveryAddressLine2?.trim() || null : null,
        deliveryCity: isDelivery ? payload.deliveryCity?.trim() || null : null,
        deliveryState: isDelivery ? payload.deliveryState?.trim() || null : null,
        deliveryZip: isDelivery ? payload.deliveryZip?.trim() || null : null,
        deliveryNotes: isDelivery ? payload.deliveryNotes?.trim() || null : null,
        deliveryDistanceMiles: isDelivery ? (payload.distanceMiles ?? null) : null,
        items: {
          create: orderItems,
        },
      },
      select: {
        id: true,
        status: true,
      },
    });

    return NextResponse.json(
      {
        orderId: order.id,
        status: order.status,
        userContext: isAdmin ? "admin" : userId ? "customer" : "guest",
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Insufficient stock")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("Failed to create order", error);
    return NextResponse.json({ error: "Failed to create order." }, { status: 500 });
  }
}
