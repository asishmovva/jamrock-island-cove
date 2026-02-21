import { MenuCatalog } from "@/components/menu/menu-catalog";
import { Badge } from "@/components/ui/badge";

type MenuPageProps = {
  searchParams: Promise<{
    fulfillment?: string;
  }>;
};

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const { fulfillment } = await searchParams;

  return (
    <section className="container space-y-8 py-10">
      <div className="space-y-2">
        <Badge variant="accent">Menu</Badge>
        <h1 className="text-3xl font-bold">Build your cart</h1>
        <p className="max-w-2xl text-sm">
          Live data from Supabase Postgres. Add items, adjust quantity, and continue to checkout.
        </p>
      </div>
      <MenuCatalog initialFulfillment={fulfillment} />
    </section>
  );
}
