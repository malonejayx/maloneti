import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms of Service — ApexFX" }, { name: "description", content: "The terms governing your use of ApexFX trading bots and education." }] }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-4xl font-bold">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: June 4, 2026</p>
        <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <Block title="1. Acceptance">By creating an account or purchasing any product from ApexFX, you agree to be bound by these Terms.</Block>
          <Block title="2. Trading risk disclosure">Forex trading involves substantial risk and may not be suitable for every investor. Past performance of any bot or strategy does not guarantee future results. You trade entirely at your own risk.</Block>
          <Block title="3. Products">We provide algorithmic trading bots and educational content. Bots are tools — they require capital, proper risk management, and a broker account that you supply.</Block>
          <Block title="4. Payments &amp; verification">All payments are made to our I&amp;M Bank account and manually verified by our team. Access is unlocked once the corresponding payment is confirmed. Pricing is shown in USD; you are responsible for any FX or bank fees.</Block>
          <Block title="5. Refunds">Due to the digital nature of our products, all sales are final once access has been granted.</Block>
          <Block title="6. Acceptable use">You may not resell, redistribute, or reverse-engineer our bots or course content. Accounts found in violation may be suspended without refund.</Block>
          <Block title="7. Limitation of liability">ApexFX is not liable for any trading losses, broker malfunctions, or indirect damages arising from use of our products.</Block>
          <Block title="8. Changes">We may update these Terms; continued use after changes constitutes acceptance.</Block>
        </div>
      </div>
      <Footer />
    </div>
  );
}
function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (<section><h2 className="font-display text-xl font-bold text-foreground">{title}</h2><p className="mt-2">{children}</p></section>);
}
