"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

type LoginFormProps = {
  redirectTo?: string | null;
  className?: string;
};

export function LoginForm({ redirectTo = "/", className }: LoginFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []) as SupabaseClient | null;
  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginValues) => {
    setStatus("submitting");
    setFormError(null);

    if (!supabase) {
      setStatus("idle");
      setFormError("Supabase is not configured. Add your Supabase URL and anon key.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    setStatus("idle");

    if (error) {
      setFormError(error.message);
      return;
    }

    router.push(redirectTo || "/");
    router.refresh();
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground" htmlFor="email">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          disabled={status === "submitting"}
          {...form.register("email")}
        />
        {form.formState.errors.email ? (
          <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground" htmlFor="password">
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          disabled={status === "submitting"}
          {...form.register("password")}
        />
        {form.formState.errors.password ? (
          <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
        ) : null}
      </div>

      {formError ? <p className="text-sm text-destructive">{formError}</p> : null}

      <Button type="submit" className="w-full" disabled={status === "submitting"}>
        {status === "submitting" ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
