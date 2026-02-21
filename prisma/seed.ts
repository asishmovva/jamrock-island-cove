import { MenuItemType, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const PLACEHOLDER_IMAGE_URL = "/images/placeholder-food.jpg";

type DemoMenuItem = {
  name: string;
  type: MenuItemType;
  basePriceCents: number;
  isActive: boolean;
  isPopular: boolean;
  isFeatured: boolean;
};

export const demoMenu: DemoMenuItem[] = [
  // ===== BREAKFAST =====
  {
    name: "Bake Bean & Saltfish",
    type: "MAIN",
    basePriceCents: 1500,
    isActive: true,
    isPopular: true,
    isFeatured: false,
  },
  {
    name: "Peanut Plantain & Oats Porridge",
    type: "MAIN",
    basePriceCents: 800,
    isActive: true,
    isPopular: false,
    isFeatured: false,
  },
  {
    name: "Butter Bean & Saltfish",
    type: "MAIN",
    basePriceCents: 1500,
    isActive: true,
    isPopular: false,
    isFeatured: false,
  },

  // ===== SIDES =====
  {
    name: "Festival (4 pcs)",
    type: "SIDE",
    basePriceCents: 150,
    isActive: true,
    isPopular: true,
    isFeatured: false,
  },
  {
    name: "Fry Dumplings (1 pc)",
    type: "SIDE",
    basePriceCents: 150,
    isActive: true,
    isPopular: false,
    isFeatured: false,
  },

  // ===== SEAFOOD COMBO =====
  {
    name: "2 Wings & 6 Jumbo Shrimp (2 sides + hushpuppies)",
    type: "MAIN",
    basePriceCents: 1599,
    isActive: true,
    isPopular: true,
    isFeatured: true,
  },
  {
    name: "8 Wings with 4 Festival",
    type: "MAIN",
    basePriceCents: 2200,
    isActive: true,
    isPopular: true,
    isFeatured: false,
  },
  {
    name: "Grilled Salmon with 4 Festival",
    type: "MAIN",
    basePriceCents: 2500,
    isActive: true,
    isPopular: false,
    isFeatured: true,
  },
  {
    name: "4 Jumbo Shrimp & 2 Pcs Fish (2 sides)",
    type: "MAIN",
    basePriceCents: 1600,
    isActive: true,
    isPopular: false,
    isFeatured: false,
  },
  {
    name: "3 Pcs Fish, 3 Wings & 3 Jumbo Shrimp",
    type: "MAIN",
    basePriceCents: 1799,
    isActive: true,
    isPopular: false,
    isFeatured: false,
  },
  {
    name: "3 Pcs Fish & 3 Wings",
    type: "MAIN",
    basePriceCents: 1499,
    isActive: true,
    isPopular: false,
    isFeatured: false,
  },
  {
    name: "Curry Salmon",
    type: "MAIN",
    basePriceCents: 2900,
    isActive: true,
    isPopular: false,
    isFeatured: true,
  },
  {
    name: "Salmon & Plain Pasta",
    type: "MAIN",
    basePriceCents: 3200,
    isActive: true,
    isPopular: false,
    isFeatured: false,
  },
  {
    name: "Salmon & Shrimp Pasta",
    type: "MAIN",
    basePriceCents: 3600,
    isActive: true,
    isPopular: true,
    isFeatured: true,
  },

  // ===== JAMAICAN CUISINE =====
  {
    name: "Fry Chicken",
    type: "MAIN",
    basePriceCents: 1600,
    isActive: true,
    isPopular: true,
    isFeatured: true,
  },
  {
    name: "Stew Peas (Medium)",
    type: "MAIN",
    basePriceCents: 1699,
    isActive: true,
    isPopular: true,
    isFeatured: false,
  },

  // ===== DRINKS =====
  {
    name: "Strawberry Pineapple Mango",
    type: "DRINK",
    basePriceCents: 600,
    isActive: true,
    isPopular: true,
    isFeatured: false,
  },
  {
    name: "Soursop & Passion Juice",
    type: "DRINK",
    basePriceCents: 700,
    isActive: true,
    isPopular: false,
    isFeatured: false,
  },
  {
    name: "Pineapple & Ginger Juice",
    type: "DRINK",
    basePriceCents: 700,
    isActive: true,
    isPopular: true,
    isFeatured: false,
  },
  {
    name: "Cucumber & Ginger",
    type: "DRINK",
    basePriceCents: 700,
    isActive: true,
    isPopular: false,
    isFeatured: false,
  },
  {
    name: "JamRock Sorrel Drink",
    type: "DRINK",
    basePriceCents: 700,
    isActive: true,
    isPopular: true,
    isFeatured: true,
  },
  {
    name: "Peanut Punch",
    type: "DRINK",
    basePriceCents: 700,
    isActive: true,
    isPopular: false,
    isFeatured: false,
  },
  {
    name: "JamRock Ginger Beer",
    type: "DRINK",
    basePriceCents: 700,
    isActive: true,
    isPopular: true,
    isFeatured: false,
  },

  // ===== WINGS =====
  {
    name: "11 Pcs Wings",
    type: "MAIN",
    basePriceCents: 2500,
    isActive: true,
    isPopular: true,
    isFeatured: false,
  },
  {
    name: "15 Pcs Wings (2 sides + bread)",
    type: "MAIN",
    basePriceCents: 3400,
    isActive: true,
    isPopular: true,
    isFeatured: false,
  },

  // ===== SHRIMP MEAL =====
  {
    name: "Grilled Shrimp (8 Pcs)",
    type: "MAIN",
    basePriceCents: 1999,
    isActive: true,
    isPopular: false,
    isFeatured: false,
  },
  {
    name: "Sautéed Garlic Shrimp (8 Pcs)",
    type: "MAIN",
    basePriceCents: 1999,
    isActive: true,
    isPopular: false,
    isFeatured: false,
  },
  {
    name: "Fried Shrimp (8 Pcs)",
    type: "MAIN",
    basePriceCents: 1999,
    isActive: true,
    isPopular: true,
    isFeatured: false,
  },
  {
    name: "Curry Shrimp (8 Pcs)",
    type: "MAIN",
    basePriceCents: 1999,
    isActive: true,
    isPopular: true,
    isFeatured: false,
  },
  {
    name: "Sweet Chilli Shrimp (8 Pcs)",
    type: "MAIN",
    basePriceCents: 1999,
    isActive: true,
    isPopular: true,
    isFeatured: false,
  },
];

async function upsertMenuItem(item: DemoMenuItem) {
  const existing = await prisma.menuItem.findFirst({
    where: {
      name: item.name,
      type: item.type,
    },
    select: {
      id: true,
    },
  });

  const data = {
    name: item.name,
    type: item.type,
    basePriceCents: item.basePriceCents,
    isActive: item.isActive,
    isPopular: item.isPopular,
    isFeatured: item.isFeatured,
    imageUrl: PLACEHOLDER_IMAGE_URL,
    stockQty: null,
  };

  if (existing) {
    await prisma.menuItem.update({
      where: { id: existing.id },
      data,
    });
    return "updated";
  }

  await prisma.menuItem.create({
    data,
  });
  return "created";
}

async function main() {
  let created = 0;
  let updated = 0;

  for (const item of demoMenu) {
    const action = await upsertMenuItem(item);
    if (action === "created") {
      created += 1;
    } else {
      updated += 1;
    }
  }

  console.warn(
    `Seed complete. Created: ${created}, Updated: ${updated}, Total: ${demoMenu.length}`,
  );
}

main()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
