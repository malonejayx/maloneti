import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — ApexFX" }, { name: "description", content: "How ApexFX collects, uses and protects your personal data." }] }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-4xl font-bold">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: June 4, 2026</p>
        <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <Block title="1. Information we collect">We collect the email and full name you provide at signup, the transaction reference codes you submit for payment verification, and basic technical data (IP, browser) for security and analytics.</Block>
          <Block title="2. How we use your data">We use your data to (a) provide and secure your account, (b) verify and approve your payments, (c) deliver purchased bots and course content, and (d) communicate service updates.</Block>
          <Block title="3. Payment information">ApexFX does not store card or bank details. Payments are sent directly to our I&amp;M Bank account; we only store the reference code you submit so our team can verify the transfer.</Block>
          <Block title="4. Data sharing">We do not sell your data. We share data only with infrastructure providers necessary to run the service and when required by law.</Block>
          <Block title="5. Your rights">You may request access, correction, or deletion of your personal data at any time by contacting support.</Block>
          <Block title="6. Contact">For privacy questions, email <span className="text-primary">privacy@apexfx.example</span>.</Block>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (<section><h2 className="font-display text-xl font-bold text-foreground">{title}</h2><p className="mt-2">{children}</p></section>);
}
