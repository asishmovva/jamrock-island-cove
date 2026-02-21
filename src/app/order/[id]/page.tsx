import { Badge } from "@/components/ui/badge";
import { OrderStatusCard } from "@/components/orders/order-status-card";

type OrderPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params;

  return (
    <section className="container space-y-6 py-10">
      <div className="space-y-2">
        <Badge variant="accent">Order confirmation</Badge>
        <h1 className="text-3xl font-bold">Thanks for your order</h1>
        <p className="max-w-2xl text-sm">
          We poll for status updates every few seconds. Keep this page open for the latest status.
        </p>
      </div>
      <OrderStatusCard orderId={id} />
    </section>
  );
}
