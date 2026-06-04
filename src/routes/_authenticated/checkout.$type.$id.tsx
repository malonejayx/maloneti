import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Building2, Copy, Check } from "lucide-react";

export const Route = createFileRoute("/_authenticated/checkout/$type/$id")({
  head: () => ({ meta: [{ title: "Checkout — ApexFX" }] }),
  component: Checkout,
});

const BANK = { name: "I&M Bank", account: "05306081383050", recipient: "ApexFX Trading" };

function Checkout() {
  const { type, id } = Route.useParams();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const { data: item, isLoading } = useQuery({
    queryKey: ["checkout-item", type, id],
    queryFn: async () => {
      const table = type === "bot" ? "bots" : "course_tiers";
      const { data, error } = await supabase.from(table).select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;
    if (code.trim().length < 6) { toast.error("Enter a valid transaction code"); return; }
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error("Not signed in"); setLoading(false); return; }
    const { error } = await supabase.from("purchases").insert({
      user_id: user.id,
      item_type: type as "bot" | "course",
      item_id: id,
      item_name: item.name,
      amount_usd: item.price_usd,
      mpesa_code: code.trim().toUpperCase(),
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Submitted! We'll verify your payment shortly.");
    router.navigate({ to: "/purchases" });
  };

  if (isLoading) return <div className="mx-auto max-w-2xl px-6 py-20 text-center text-muted-foreground">Loading…</div>;
  if (!item) return <div className="mx-auto max-w-2xl px-6 py-20 text-center">Item not found. <Link to="/dashboard" className="text-primary">Back</Link></div>;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link to="/dashboard" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">
          {type === "bot" ? "Trading Bot" : "Forex Course"}
        </div>
        <h1 className="mt-1 font-display text-2xl font-bold">{item.name}</h1>
        <div className="mt-4 flex items-end justify-between border-t border-border pt-4">
          <span className="text-muted-foreground">Total</span>
          <span className="text-3xl font-bold text-gradient-gold">${Number(item.price_usd).toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-primary/30 bg-card p-6">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <h2 className="font-display text-lg font-bold">Payment instructions</h2>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Send the exact amount to our <span className="text-foreground font-medium">I&amp;M Bank</span> account below,
          then submit the transaction reference code. Our team will verify and approve manually.
        </p>

        <dl className="mt-5 space-y-3">
          {[
            { label: "Bank", value: BANK.name },
            { label: "Account number", value: BANK.account, copyable: true },
            { label: "Account name", value: BANK.recipient },
            { label: "Amount", value: `$${Number(item.price_usd).toFixed(2)}` },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3">
              <div>
                <div className="text-xs text-muted-foreground">{row.label}</div>
                <div className="font-mono text-sm">{row.value}</div>
              </div>
              {row.copyable && (
                <button type="button" onClick={() => copy(row.value, row.label)} className="text-muted-foreground hover:text-foreground">
                  {copied === row.label ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                </button>
              )}
            </div>
          ))}
        </dl>

        <form onSubmit={submit} className="mt-6 space-y-3">
          <Label htmlFor="code">Transaction / reference code</Label>
          <Input id="code" placeholder="e.g. SJK7Q9XY12" value={code} onChange={(e) => setCode(e.target.value)} required />
          <Button type="submit" disabled={loading} className="w-full bg-gold-gradient text-primary-foreground hover:opacity-90">
            {loading ? "Submitting…" : "Submit for verification"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Verification typically takes a few minutes during business hours. You'll see the status under <Link to="/purchases" className="text-primary underline">My Orders</Link>.
          </p>
        </form>
      </div>
    </div>
  );
}
