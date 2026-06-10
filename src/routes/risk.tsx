import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/risk")({
  head: () => ({
    meta: [
      { title: "Risk Disclosure — ApexFX" },
      { name: "description", content: "Important risk warning for users of ApexFX trading bots, courses, and the Deriv terminal integration." },
      { property: "og:title", content: "ApexFX Risk Disclosure" },
      { property: "og:description", content: "Trading Forex and CFDs carries substantial risk. Read this before using ApexFX." },
    ],
    links: [{ rel: "canonical", href: "https://maloneti.lovable.app/risk" }],
  }),
  component: RiskPage,
});

function RiskPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="mx-auto max-w-3xl px-6 py-20">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-8 w-8 text-primary" />
          <h1 className="font-display text-4xl font-bold">Risk Disclosure</h1>
        </div>

        <div className="prose prose-invert mt-8 max-w-none space-y-6 text-muted-foreground">
          <p className="text-foreground font-semibold">
            Trading foreign exchange (Forex) and contracts for difference (CFDs) on margin carries
            a high level of risk and may not be suitable for all investors.
          </p>

          <h2 className="text-foreground">No guarantee of profit</h2>
          <p>
            Past performance is not indicative of future results. Backtests, simulations,
            published win rates, and screenshots shown on this website are historical and
            do not guarantee that any bot or strategy will be profitable going forward.
          </p>

          <h2 className="text-foreground">You can lose more than you deposit</h2>
          <p>
            Leveraged trading can result in losses that exceed your initial deposit.
            Only trade with money you can afford to lose entirely. Never trade with funds
            needed for living expenses, rent, school fees, or medical care.
          </p>

          <h2 className="text-foreground">Automated trading risk</h2>
          <p>
            ApexFX bots execute trades automatically based on pre-defined logic.
            Technical failures (internet outage, broker downtime, platform errors),
            unexpected market conditions (news events, gaps, low liquidity), and slippage
            can produce results materially different from backtested performance.
          </p>

          <h2 className="text-foreground">Our role</h2>
          <p>
            ApexFX provides software (trading bots) and educational content only. We are
            NOT a broker, dealer, investment advisor, or custodian. We do not hold client
            funds. All live trading executes through your own Deriv account; your funds
            remain with Deriv at all times under their regulatory framework.
          </p>

          <h2 className="text-foreground">No personalized advice</h2>
          <p>
            Nothing on this website constitutes personalized investment, financial, tax,
            or legal advice. Consult a qualified professional before making any trading
            or investment decision.
          </p>

          <h2 className="text-foreground">Acknowledgement</h2>
          <p>
            By using ApexFX you acknowledge that you have read, understood, and accepted
            the risks described above and agree that ApexFX, its team, and its affiliates
            are not liable for any trading losses you incur.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
