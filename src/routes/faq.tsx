import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  { q: "What is ApexFX?", a: "ApexFX is a platform offering 15 algorithmic Forex trading bots, a 3-tier Forex education curriculum, and a built-in Deriv trading terminal so you can trade, deposit, and withdraw without leaving the site." },
  { q: "How do payments work?", a: "We accept M-Pesa and bank transfers via I&M Bank. After paying you submit the transaction code; our admin team manually verifies every payment within minutes and unlocks your access instantly." },
  { q: "Do the bots actually work?", a: "Every bot is backtested on 5+ years of tick data and forward-tested live for a minimum of 60 days before release. That said, no bot guarantees profit — markets change. We publish win rate and risk level on each bot page." },
  { q: "Can I withdraw profits to M-Pesa?", a: "Yes — through the Deriv terminal on our site. Connect your Deriv account, click Withdraw, and follow the secure cashier flow. M-Pesa, bank transfer, and crypto are all supported." },
  { q: "Do I need a Deriv account?", a: "Yes for the live terminal. It's free to open and takes ~2 minutes. We don't custody your funds — they stay in your own Deriv account at all times." },
  { q: "Is this regulated?", a: "ApexFX provides software and education only. Live trading executes through Deriv, which is licensed by the Malta Financial Services Authority, the British Virgin Islands FSC, and other regulators." },
  { q: "What is the risk?", a: "Forex and CFD trading carries substantial risk and can result in loss of your entire capital. Read our full Risk Disclosure before depositing real funds." },
  { q: "Can I get a refund?", a: "Digital products (bots and courses) are non-refundable once access is granted. If a bot is found to be defective we will repair or replace it free of charge." },
  { q: "How do I get support?", a: "WhatsApp +254 746 496 906, email justiceforiran653@gmail.com, or use the in-app Apex Assistant chat at the bottom-right of every page." },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — ApexFX" },
      { name: "description", content: "Answers to the most common questions about ApexFX bots, courses, payments, Deriv terminal, withdrawals, and support." },
      { property: "og:title", content: "ApexFX FAQ" },
      { property: "og:description", content: "Common questions about bots, payments, and the Deriv terminal." },
    ],
    links: [{ rel: "canonical", href: "https://maloneti.lovable.app/faq" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }),
    }],
  }),
  component: FAQPage,
});

function FAQPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="font-display text-4xl font-bold md:text-5xl">Frequently asked questions</h1>
        <p className="mt-4 text-muted-foreground">Can't find what you need? Ask the Apex Assistant in the bottom-right of any page.</p>
        <Accordion type="single" collapsible className="mt-10">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
      <Footer />
    </div>
  );
}
