import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <section className="container space-y-6 py-12">
      <div className="space-y-3">
        <Badge variant="accent">Account</Badge>
        <h1 className="text-3xl font-bold">Login placeholder</h1>
        <p className="max-w-2xl">
          Supabase Auth (email/password) and session handling will plug in here. This route confirms
          navigation, layout, and theming.
        </p>
      </div>
      <Card className="max-w-xl border-primary/15">
        <CardHeader className="pb-1">
          <CardTitle className="text-lg">What’s next</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>Role-aware access (customer/admin) and server-side route protection.</p>
          <p>Guest checkout remains available; login will unlock saved addresses and orders.</p>
        </CardContent>
      </Card>
    </section>
  );
}
