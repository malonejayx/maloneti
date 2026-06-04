import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, GraduationCap, TrendingUp, Check } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — ApexFX" }] }),
  component: Dashboard,
});

function riskColor(r: string) {
  return r === "Low" ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
    : r === "Medium" ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
    : "bg-rose-500/15 text-rose-300 border-rose-500/30";
}

function Dashboard() {
  const { data: bots } = useQuery({
    queryKey: ["bots"],
    queryFn: async () => {
      const { data, error } = await supabase.from("bots").select("*").order("price_usd");
      if (error) throw error;
      return data;
    },
  });
  const { data: courses } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase.from("course_tiers").select("*").order("price_usd");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold">Your trading desk</h1>
        <p className="mt-2 text-muted-foreground">Pick a bot to deploy or level up with a Forex course.</p>
      </div>

      {/* Bots */}
      <section className="mb-16">
        <div className="mb-6 flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <h2 className="font-display text-2xl font-bold">Trading Bots</h2>
          <Badge variant="secondary" className="ml-auto">{bots?.length ?? 0} available</Badge>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bots?.map((b) => (
            <div key={b.id} className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition hover:border-primary/40">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-gradient">
                  <TrendingUp className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className={`rounded-full border px-2.5 py-0.5 text-xs ${riskColor(b.risk_level)}`}>
                  {b.risk_level} risk
                </span>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold">{b.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{b.description}</p>
              <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                <span>{b.strategy}</span>
                <span className="text-primary">{Number(b.win_rate).toFixed(1)}% win</span>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                <div>
                  <div className="text-2xl font-bold text-gradient-gold">${Number(b.price_usd).toFixed(0)}</div>
                  <div className="text-xs text-muted-foreground">one-time</div>
                </div>
                <Link to="/checkout/$type/$id" params={{ type: "bot", id: b.id }}>
                  <Button className="bg-gold-gradient text-primary-foreground hover:opacity-90">Buy</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Courses */}
      <section>
        <div className="mb-6 flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          <h2 className="font-display text-2xl font-bold">Forex Course Tiers</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {courses?.map((c, i) => (
            <div key={c.id} className={`relative flex flex-col rounded-2xl border bg-card p-8 ${i === 1 ? "border-primary/60 glow-gold" : "border-border"}`}>
              {i === 1 && (
                <span className="absolute -top-3 left-6 rounded-full bg-gold-gradient px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Most popular
                </span>
              )}
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.level}</div>
              <h3 className="mt-1 font-display text-2xl font-bold">{c.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>
              <div className="mt-5">
                <span className="text-4xl font-bold text-gradient-gold">${Number(c.price_usd).toFixed(0)}</span>
                <span className="text-sm text-muted-foreground"> /lifetime</span>
              </div>
              <ul className="mt-5 space-y-2 text-sm">
                {(c.features as string[]).map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/checkout/$type/$id" params={{ type: "course", id: c.id }} className="mt-6 block">
                <Button className="w-full bg-gold-gradient text-primary-foreground hover:opacity-90">Enroll</Button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
