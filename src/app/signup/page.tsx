import Link from "next/link";

import { SignupForm } from "@/components/auth/signup-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SignupPageProps = {
  searchParams?: {
    redirectTo?: string;
  };
};

export default function SignupPage({ searchParams }: SignupPageProps) {
  const redirectTo = searchParams?.redirectTo ?? "/";

  return (
    <section className="container grid gap-8 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
      <div className="space-y-4">
        <Badge variant="accent">Account</Badge>
        <h1 className="text-3xl font-bold">Create your account</h1>
        <p className="max-w-2xl">
          Set up a JamRock account for faster reorders and delivery address management. Admin access
          requires an admin role in Supabase.
        </p>
        <Card className="max-w-xl border-primary/15 bg-card/90">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Sign up</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <SignupForm redirectTo={redirectTo} />
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link className="font-semibold text-primary underline-offset-4 hover:underline" href="/login">
                Sign in
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/10 bg-gradient-to-br from-secondary/15 via-background to-primary/10">
        <CardHeader className="pb-1">
          <CardTitle className="text-lg">What to expect</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>We set your role to customer by default. Admins can be flagged in Supabase later.</p>
          <p>After email confirmation, you can log in to place orders, save addresses, and view history.</p>
        </CardContent>
      </Card>
    </section>
  );
}
