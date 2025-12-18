import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <section className="container space-y-6 py-12">
      <div className="space-y-3">
        <Badge variant="accent">Admin</Badge>
        <h1 className="text-3xl font-bold">Admin dashboard placeholder</h1>
        <p className="max-w-2xl">
          Inventory, orders, polling alerts, and storage uploads will live here. This page anchors
          routing and the Jamaican theme until those flows arrive.
        </p>
      </div>
      <Card className="max-w-3xl border-primary/15">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Planned controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>CRUD for categories, menu items, modifier groups, and sold-out toggles.</p>
          <p>Order board with polling, ringtone alerts, and delivery status transitions.</p>
          <p>Uploads to Supabase Storage with featured/popular flags for the homepage.</p>
        </CardContent>
      </Card>
    </section>
  );
}
