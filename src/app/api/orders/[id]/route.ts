import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

async function getSessionUser() {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return { userId: null as string | null, isAdmin: false };
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

export async function GET(
  _request: Request,
  context: {
    params: Promise<unknown>;
  },
) {
  const params = await context.params;
  const id = (() => {
    if (!params || typeof params !== "object") {
      return null;
    }
    const rawId = (params as Record<string, unknown>).id;
    return typeof rawId === "string" ? rawId : null;
  })();

  if (!id) {
    return NextResponse.json({ error: "Invalid order id." }, { status: 400 });
  }

  const { userId, isAdmin } = await getSessionUser();

  const order = await prisma.order.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
      status: true,
      fulfillmentType: true,
      customerName: true,
      customerEmail: true,
      subtotalCents: true,
      taxCents: true,
      deliveryFeeCents: true,
      tipCents: true,
      totalCents: true,
      createdAt: true,
      items: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          itemName: true,
          quantity: true,
          lineTotalCents: true,
          specialInstructions: true,
        },
      },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  if (!isAdmin && order.userId && order.userId !== userId) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({ order });
}
