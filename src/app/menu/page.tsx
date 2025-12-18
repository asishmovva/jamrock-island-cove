import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MenuPage() {
  return (
    <section className="container space-y-6 py-12">
      <div className="space-y-3">
        <Badge variant="accent">Menu</Badge>
        <h1 className="text-3xl font-bold">Catalog placeholder</h1>
        <p className="max-w-2xl">
          Categories, items, modifiers, and live pricing will land here in the next phase. For now
          this route proves navigation and theming.
        </p>
      </div>
      <Card className="max-w-3xl border-primary/15">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Coming soon</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>Expect filters by category, “popular” badges, and smart upsell hooks for drinks and desserts.</p>
          <p>Pricing will use deterministic utilities to keep totals accurate across cart and checkout.</p>
        </CardContent>
      </Card>
    </section>
  );
}
