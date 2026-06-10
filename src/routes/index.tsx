import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, GraduationCap, ShieldCheck, Zap, TrendingUp, Sparkles, Star, Quote } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ApexFX — Premium Forex Bots & Education" },
      { name: "description", content: "15 algorithmic Forex bots plus tiered Forex education. Trade smarter with ApexFX." },
      { property: "og:title", content: "ApexFX — Premium Forex Bots & Education" },
      { property: "og:description", content: "Premium algorithmic Forex trading bots and tiered education." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const { data: stats } = useQuery({
    queryKey: ["landing-stats"],
    queryFn: async () => {
      const [{ count: botCount }, { data: courses }] = await Promise.all([
        supabase.from("bots").select("*", { count: "exact", head: true }),
        supabase.from("course_tiers").select("price_usd").order("price_usd"),
      ]);
      return { botCount: botCount ?? 0, minCourse: courses?.[0]?.price_usd ?? 99 };
    },
  });

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute inset-x-0 top-0 -z-10 h-[600px] bg-[radial-gradient(ellipse_at_top,_oklch(0.82_0.14_85/0.18),_transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {stats?.botCount ?? 15} elite trading bots · 3 course tiers
            </div>
            <h1 className="font-display text-5xl font-bold leading-[1.05] md:text-7xl">
              Trade Forex like<br />
              <span className="text-gradient-gold">a quant fund.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Battle-tested algorithmic bots and a complete Forex curriculum — from your first chart to a funded prop account.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link to="/auth">
                <Button size="lg" className="bg-gold-gradient text-primary-foreground hover:opacity-90 glow-gold">
                  Get started <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline">Browse bots</Button>
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Bots from $50 · Courses from ${stats?.minCourse ?? 99}</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-border/60 bg-card/30">
        <div className="mx-auto grid max-w-7xl gap-px bg-border/60 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Bot, label: "15 Trading Bots", desc: "Scalping, swing, grid, arbitrage." },
            { icon: GraduationCap, label: "3 Course Tiers", desc: "Beginner to funded trader." },
            { icon: ShieldCheck, label: "Manual Verification", desc: "Every payment reviewed by our team." },
            { icon: Zap, label: "Instant Access", desc: "Approved orders unlock immediately." },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="bg-background p-6">
              <Icon className="h-6 w-6 text-primary" />
              <div className="mt-3 font-semibold">{label}</div>
              <div className="mt-1 text-sm text-muted-foreground">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-bold md:text-5xl">How it works</h2>
          <p className="mt-3 text-muted-foreground">Manual verification keeps things secure — and personal.</p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            { n: "01", title: "Pick your edge", desc: "Choose a trading bot or a course tier from your dashboard." },
            { n: "02", title: "Pay via I&M Bank", desc: "Send the displayed amount to our I&M account and submit your transaction code." },
            { n: "03", title: "Get approved", desc: "Our admin team verifies the payment and unlocks your access." },
          ].map((s) => (
            <div key={s.n} className="rounded-2xl border border-border bg-card p-8">
              <div className="text-gradient-gold font-display text-3xl font-bold">{s.n}</div>
              <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/60 bg-card/30 py-16">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 text-center md:grid-cols-4">
          {[
            { n: "2,400+", l: "Active traders" },
            { n: "$18M+", l: "Volume traded" },
            { n: "68%", l: "Avg. win rate" },
            { n: "24/7", l: "Bot uptime" },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-gradient-gold font-display text-4xl font-bold md:text-5xl">{s.n}</div>
              <div className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-bold md:text-5xl">Loved by traders</h2>
          <p className="mt-3 text-muted-foreground">Real feedback from the ApexFX community.</p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            { name: "Brian K.", role: "Nairobi, KE", text: "Apex Scalper paid for itself in 3 weeks. The risk management is what sold me — no blown accounts." },
            { name: "Amina S.", role: "Lagos, NG", text: "Took the Pro course, got my FTMO challenge on the first try. The curriculum is gold." },
            { name: "David O.", role: "Kampala, UG", text: "Withdrawing to M-Pesa straight from the terminal is the cleanest UX I've seen on any trading site." },
          ].map((t) => (
            <div key={t.name} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex gap-0.5 text-primary">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <Quote className="mt-3 h-5 w-5 text-muted-foreground/60" />
              <p className="mt-2 text-sm text-foreground">{t.text}</p>
              <div className="mt-4 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{t.name}</span> · {t.role}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card to-background p-12 text-center">
          <TrendingUp className="mx-auto h-10 w-10 text-primary" />
          <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">Ready to stop guessing the market?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Create your account and explore the full catalog of bots and courses.
          </p>
          <Link to="/auth" className="mt-6 inline-block">
            <Button size="lg" className="bg-gold-gradient text-primary-foreground hover:opacity-90 glow-gold">
              Create your account <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
