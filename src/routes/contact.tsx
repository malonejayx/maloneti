import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Mail, Phone, MessageCircle, MapPin } from "lucide-react";

const EMAIL = "apexfxbot@gmail.com";
const PHONE = "+254783719920";
const WA = "https://wa.me/254783719920";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact ApexFX — Support & Sales" },
      { name: "description", content: "Reach the ApexFX team by WhatsApp, phone, or email. Based in Nairobi, Kenya." },
      { property: "og:title", content: "Contact ApexFX" },
      { property: "og:description", content: "WhatsApp, phone, or email — we usually reply within minutes." },
    ],
    links: [{ rel: "canonical", href: "https://maloneti.lovable.app/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute -top-32 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-gold-gradient opacity-20 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-6 py-24 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> Online now
          </span>
          <h1 className="mt-6 font-display text-5xl font-bold md:text-6xl">
            Talk to <span className="text-gradient-gold">ApexFX</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Our team typically replies within minutes — WhatsApp is fastest. Business hours EAT, AI chat is 24/7.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="grid gap-5 sm:grid-cols-2">
          <a href={WA} target="_blank" rel="noreferrer" className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 transition hover:-translate-y-1 hover:border-primary/60 hover:glow-gold">
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald-500/10 blur-2xl" />
            <MessageCircle className="h-7 w-7 text-emerald-400" />
            <div className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">Fastest reply</div>
            <div className="mt-1 font-display text-xl font-bold">WhatsApp</div>
            <div className="mt-2 text-sm text-muted-foreground group-hover:text-foreground">+254 783 719 920</div>
          </a>
          <a href={`tel:${PHONE}`} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 transition hover:-translate-y-1 hover:border-primary/60 hover:glow-gold">
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary/10 blur-2xl" />
            <Phone className="h-7 w-7 text-primary" />
            <div className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">Direct line</div>
            <div className="mt-1 font-display text-xl font-bold">Phone</div>
            <div className="mt-2 text-sm text-muted-foreground group-hover:text-foreground">+254 783 719 920</div>
          </a>
          <a href={`mailto:${EMAIL}`} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 transition hover:-translate-y-1 hover:border-primary/60 hover:glow-gold">
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary/10 blur-2xl" />
            <Mail className="h-7 w-7 text-primary" />
            <div className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">Email us</div>
            <div className="mt-1 font-display text-xl font-bold">Email</div>
            <div className="mt-2 break-all text-sm text-muted-foreground group-hover:text-foreground">{EMAIL}</div>
          </a>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-7">
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary/10 blur-2xl" />
            <MapPin className="h-7 w-7 text-primary" />
            <div className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">Headquarters</div>
            <div className="mt-1 font-display text-xl font-bold">Nairobi, Kenya</div>
            <div className="mt-2 text-sm text-muted-foreground">East Africa Time (GMT+3)</div>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-6 text-sm">
          💬 You can also click the <strong className="text-gradient-gold">Apex Assistant</strong> chat icon
          at the bottom-right of any page for instant AI answers, 24/7.
        </div>
      </section>
      <Footer />
    </div>
  );
}
