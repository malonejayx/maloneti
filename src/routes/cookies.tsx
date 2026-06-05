import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/cookies")({
  head: () => ({ meta: [{ title: "Cookie Policy — ApexFX" }, { name: "description", content: "How ApexFX uses cookies and similar technologies." }] }),
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-4xl font-bold">Cookie Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: June 4, 2026</p>
        <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <Block title="What are cookies?">Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences and keep you signed in.</Block>
          <Block title="Cookies we use">
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li><span className="text-foreground">Essential:</span> session and authentication tokens — required to keep you signed in.</li>
              <li><span className="text-foreground">Functional:</span> remembers your cookie banner choice.</li>
            </ul>
          </Block>
          <Block title="Third-party cookies">We do not use advertising or cross-site tracking cookies. Our hosting and authentication providers may set strictly-necessary cookies as part of operating the service.</Block>
          <Block title="Managing cookies">You can clear cookies in your browser settings at any time. Disabling essential cookies will prevent you from signing in to your ApexFX account.</Block>
          <Block title="Contact">Questions? Email <a className="text-primary" href="mailto:justiceforiran653@gmail.com">justiceforiran653@gmail.com</a> or call <a className="text-primary" href="tel:+254746496906">+254 746 496 906</a>.</Block>
        </div>
      </div>
      <Footer />
    </div>
  );
}
function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (<section><h2 className="font-display text-xl font-bold text-foreground">{title}</h2><div className="mt-2">{children}</div></section>);
}
