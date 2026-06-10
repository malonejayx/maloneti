import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Mail, Phone, MessageCircle, MapPin } from "lucide-react";

const EMAIL = "justiceforiran653@gmail.com";
const PHONE = "+254746496906";
const WA = "https://wa.me/254746496906";

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
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="font-display text-4xl font-bold md:text-5xl">Get in touch</h1>
        <p className="mt-4 text-muted-foreground">Our team typically replies within a few minutes during business hours (EAT).</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <a href={WA} target="_blank" rel="noreferrer" className="group rounded-2xl border border-border bg-card p-6 hover:border-primary">
            <MessageCircle className="h-6 w-6 text-primary" />
            <div className="mt-3 font-semibold">WhatsApp</div>
            <div className="mt-1 text-sm text-muted-foreground group-hover:text-foreground">+254 746 496 906</div>
          </a>
          <a href={`tel:${PHONE}`} className="group rounded-2xl border border-border bg-card p-6 hover:border-primary">
            <Phone className="h-6 w-6 text-primary" />
            <div className="mt-3 font-semibold">Phone</div>
            <div className="mt-1 text-sm text-muted-foreground group-hover:text-foreground">+254 746 496 906</div>
          </a>
          <a href={`mailto:${EMAIL}`} className="group rounded-2xl border border-border bg-card p-6 hover:border-primary">
            <Mail className="h-6 w-6 text-primary" />
            <div className="mt-3 font-semibold">Email</div>
            <div className="mt-1 text-sm text-muted-foreground group-hover:text-foreground">{EMAIL}</div>
          </a>
          <div className="rounded-2xl border border-border bg-card p-6">
            <MapPin className="h-6 w-6 text-primary" />
            <div className="mt-3 font-semibold">Headquarters</div>
            <div className="mt-1 text-sm text-muted-foreground">Nairobi, Kenya</div>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-card/60 p-6 text-sm text-muted-foreground">
          💬 You can also click the <strong className="text-foreground">Apex Assistant</strong> chat icon
          at the bottom-right of any page for instant AI answers, 24/7.
        </div>
      </section>
      <Footer />
    </div>
  );
}
