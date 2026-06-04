import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — ApexFX" }, { name: "description", content: "How ApexFX collects, uses and protects your personal data." }] }),
  component: () => <LegalPage title="Privacy Policy" updated="June 4, 2026">
    <Section title="1. Information we collect">
      <p>We collect the email address and full name you provide at signup, the transaction reference codes you submit for payment verification, and basic technical data (IP, browser) for security and analytics.</p>
    </Section>
    <Section title="2. How we use your data">
      <p>We use your data to (a) provide and secure your account, (b) verify and approve your payments, (c) deliver purchased bots and course content, and (d) communicate service updates.</p>
    </Section>
    <Section title="3. Payment information">
      <p>ApexFX does not store card or bank account details. Payments are made directly to our I&amp;M Bank account; we only store the reference code you submit so our team can verify the transfer.</p>
    </Section>
    <Section title="4. Data sharing">
      <p>We do not sell your data. We share data only with infrastructure providers necessary to run the service (hosting, database) and when required by law.</p>
    </Section>
    <Section title="5. Your rights">
      <p>You may request access, correction, or deletion of your personal data at any time by contacting support.</p>
    </Section>
    <Section title="6. Contact">
      <p>For privacy questions, email <span className="text-primary">privacy@apexfx.example</span>.</p>
    </Section>
  </LegalPage>,
});

function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-4xl font-bold">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p>
        <div className="prose prose-invert mt-10 space-y-8 text-foreground/90">{children}</div>
      </div>
      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl font-bold">{title}</h2>
      <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

export { LegalPage, Section };
