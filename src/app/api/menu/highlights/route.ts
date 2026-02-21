import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const [popular, featured] = await Promise.all([
    prisma.menuItem.findMany({
      where: {
        isActive: true,
        isPopular: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        basePriceCents: true,
        imageUrl: true,
        isPopular: true,
        isFeatured: true,
        type: true,
      },
      orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
      take: 8,
    }),
    prisma.menuItem.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        basePriceCents: true,
        imageUrl: true,
        isPopular: true,
        isFeatured: true,
        type: true,
      },
      orderBy: [{ isPopular: "desc" }, { name: "asc" }],
      take: 6,
    }),
  ]);

  return NextResponse.json({ popular, featured });
}
