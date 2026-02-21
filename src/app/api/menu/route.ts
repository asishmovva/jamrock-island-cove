import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const items = await prisma.menuItem.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      description: true,
      basePriceCents: true,
      imageUrl: true,
      isPopular: true,
      type: true,
    },
    orderBy: [{ isPopular: "desc" }, { type: "asc" }, { name: "asc" }],
  });

  return NextResponse.json({ items });
}
