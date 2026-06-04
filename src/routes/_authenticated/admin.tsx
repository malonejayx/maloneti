import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Shield, Check, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — ApexFX" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { isAdmin, loading } = useAuth();
  const qc = useQueryClient();
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected">("pending");

  const { data: orders } = useQuery({
    queryKey: ["admin-purchases", filter],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("purchases").select("*").eq("status", filter).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (loading) return <div className="px-6 py-20 text-center text-muted-foreground">Loading…</div>;
  if (!isAdmin) return (
    <div className="mx-auto max-w-md px-6 py-20 text-center">
      <Shield className="mx-auto h-10 w-10 text-muted-foreground" />
      <h2 className="mt-4 font-display text-2xl font-bold">Admin access required</h2>
      <p className="mt-2 text-sm text-muted-foreground">Your account is not authorized to view this page.</p>
    </div>
  );

  const review = async (id: string, status: "approved" | "rejected", note?: string) => {
    const { error } = await supabase
      .from("purchases")
      .update({ status, admin_note: note ?? null, reviewed_at: new Date().toISOString() })
      .eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Order ${status}`);
    qc.invalidateQueries({ queryKey: ["admin-purchases"] });
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-primary" />
        <h1 className="font-display text-3xl font-bold">Admin — Payment Verification</h1>
      </div>
      <p className="mt-2 text-muted-foreground">Review and approve payments sent to I&amp;M Bank account 05306081383050.</p>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="mt-8">
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        <TabsContent value={filter} className="mt-6">
          {!orders?.length ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">No {filter} orders.</div>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => <OrderRow key={o.id} order={o} onReview={review} />)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function OrderRow({ order, onReview }: { order: any; onReview: (id: string, status: "approved" | "rejected", note?: string) => void }) {
  const [note, setNote] = useState("");
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{order.item_type}</Badge>
            <span className="font-semibold">{order.item_name}</span>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">User: <span className="font-mono">{order.user_id}</span></div>
          <div className="text-xs text-muted-foreground">M-Pesa / Txn code: <span className="font-mono text-foreground">{order.mpesa_code}</span></div>
          <div className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString()}</div>
        </div>
        <div className="text-right text-2xl font-bold text-gradient-gold">${Number(order.amount_usd).toFixed(2)}</div>
      </div>
      {order.status === "pending" && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Input placeholder="Optional note (e.g. reason for rejection)" value={note} onChange={(e) => setNote(e.target.value)} className="flex-1 min-w-[200px]" />
          <Button size="sm" variant="outline" onClick={() => onReview(order.id, "rejected", note)}>
            <X className="mr-1 h-4 w-4" /> Reject
          </Button>
          <Button size="sm" className="bg-gold-gradient text-primary-foreground hover:opacity-90" onClick={() => onReview(order.id, "approved", note || undefined)}>
            <Check className="mr-1 h-4 w-4" /> Approve
          </Button>
        </div>
      )}
      {order.admin_note && order.status !== "pending" && (
        <div className="mt-3 text-xs text-muted-foreground">Note: {order.admin_note}</div>
      )}
    </div>
  );
}
