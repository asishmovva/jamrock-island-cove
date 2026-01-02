import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";

type AppRole = "customer" | "admin" | string | undefined;

export default async function AdminPage() {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return (
      <section className="container space-y-6 py-12">
        <Badge variant="accent">Admin</Badge>
        <h1 className="text-3xl font-bold">Admin dashboard</h1>
        <Card className="max-w-2xl border-primary/15 bg-card/90">
          <CardHeader>
            <CardTitle className="text-lg">Configuration required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Supabase environment variables are missing.</p>
            <p className="text-muted-foreground">
              Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, then redeploy to enable
              admin access.
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const role = (session?.user?.app_metadata as { role?: AppRole } | null)?.role;
  if (!session) {
    redirect("/login?redirectTo=/admin");
  }
  if (role !== "admin") {
    redirect("/");
  }

  const email = session?.user?.email ?? "admin";

  return (
    <section className="container space-y-6 py-12">
      <div className="space-y-3">
        <Badge variant="accent">Admin</Badge>
        <h1 className="text-3xl font-bold">Admin dashboard</h1>
        <p className="max-w-2xl">
          Inventory, orders, polling alerts, and storage uploads will live here. You are signed in
          as <span className="font-semibold text-foreground">{email}</span> with role{" "}
          <span className="font-semibold text-foreground">{role}</span>.
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
