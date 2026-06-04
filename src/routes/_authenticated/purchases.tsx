import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/purchases")({
  head: () => ({ meta: [{ title: "My Orders — ApexFX" }] }),
  component: Purchases,
});

const statusStyle = (s: string) =>
  s === "approved" ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
  : s === "rejected" ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
  : "bg-amber-500/15 text-amber-300 border-amber-500/30";

function Purchases() {
  const { data, isLoading } = useQuery({
    queryKey: ["my-purchases"],
    queryFn: async () => {
      const { data, error } = await supabase.from("purchases").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-display text-3xl font-bold">My Orders</h1>
      <p className="mt-2 text-muted-foreground">Track the status of every purchase you've submitted.</p>

      <div className="mt-8">
        {isLoading ? (
          <div className="text-muted-foreground">Loading…</div>
        ) : !data?.length ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <p className="text-muted-foreground">You haven't made any purchases yet.</p>
            <Link to="/dashboard" className="mt-4 inline-block">
              <Button className="bg-gold-gradient text-primary-foreground hover:opacity-90">Browse catalog</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {data.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-5">
                <div>
                  <div className="text-xs uppercase text-muted-foreground">{p.item_type}</div>
                  <div className="font-semibold">{p.item_name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Code: <span className="font-mono">{p.mpesa_code}</span> · {new Date(p.created_at).toLocaleString()}
                  </div>
                  {p.admin_note && <div className="mt-1 text-xs text-muted-foreground">Note: {p.admin_note}</div>}
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gradient-gold">${Number(p.amount_usd).toFixed(2)}</div>
                  <Badge className={`mt-1 border ${statusStyle(p.status)}`} variant="outline">{p.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
