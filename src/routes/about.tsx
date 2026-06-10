import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Target, Users, Award, Globe, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About ApexFX — Our Mission & Team" },
      { name: "description", content: "ApexFX builds premium algorithmic trading bots and Forex education for retail traders. Meet the team and our mission." },
      { property: "og:title", content: "About ApexFX" },
      { property: "og:description", content: "Premium algorithmic trading bots and Forex education built by traders, for traders." },
    ],
    links: [{ rel: "canonical", href: "https://maloneti.lovable.app/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h1 className="font-display text-4xl font-bold md:text-6xl">
          Built by traders.<br />
          <span className="text-gradient-gold">For traders.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          ApexFX is a quant-driven Forex automation platform. We package institutional-grade
          strategies into bots anyone can run, paired with education that takes you from
          your first chart to a funded account.
        </p>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {[
            { icon: Target, t: "Our Mission", d: "Make algorithmic trading accessible without compromising on quality, risk management, or transparency." },
            { icon: Users, t: "Who We Serve", d: "Retail Forex traders in Africa and globally who want to stop guessing and start executing with a real edge." },
            { icon: Award, t: "Our Edge", d: "Every bot is backtested across 5+ years of tick data and forward-tested live before it ever reaches a customer." },
            { icon: Globe, t: "Where We Operate", d: "Headquartered in Nairobi, Kenya — serving customers across Africa, Asia, and Europe through Deriv's regulated infrastructure." },
          ].map((b) => (
            <div key={b.t} className="rounded-2xl border border-border bg-card p-8">
              <b.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-semibold">{b.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{b.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl border border-border bg-card p-10 text-center">
          <h2 className="font-display text-2xl font-bold md:text-3xl">Ready to trade with an edge?</h2>
          <p className="mt-3 text-muted-foreground">Join thousands of traders running ApexFX bots.</p>
          <Link to="/auth" className="mt-6 inline-block">
            <Button size="lg" className="bg-gold-gradient text-primary-foreground hover:opacity-90">
              Get started <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
