import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type LoginPageProps = {
  searchParams?: {
    redirectTo?: string;
  };
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  const redirectTo = searchParams?.redirectTo ?? "/";

  return (
    <section className="container grid gap-8 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
      <div className="space-y-4">
        <Badge variant="accent">Account</Badge>
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="max-w-2xl">
          Sign in with your email and password to access saved addresses, order history, and admin
          tools (if your role allows).
        </p>
        <Card className="max-w-xl border-primary/15 bg-card/90">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Sign in</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <LoginForm redirectTo={redirectTo} />
            <p className="text-sm text-muted-foreground">
              New here?{" "}
              <Link className="font-semibold text-primary underline-offset-4 hover:underline" href="/signup">
                Create an account
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/10 bg-gradient-to-br from-primary/10 via-background to-secondary/15">
        <CardHeader className="pb-1">
          <CardTitle className="text-lg">Why sign in?</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>Track orders, save delivery addresses, and reorder favorites faster.</p>
          <p>
            Admins will get access to inventory and order dashboards. Roles are stored in Supabase
            user metadata.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
