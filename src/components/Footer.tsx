import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background/60">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2">
            <div className="font-display text-lg font-bold text-gradient-gold">ApexFX</div>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Premium algorithmic trading bots and Forex education. Trade smarter, not harder.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/dashboard" className="hover:text-foreground">Trading Bots</Link></li>
              <li><Link to="/dashboard" className="hover:text-foreground">Forex Course</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-foreground">Terms of Service</Link></li>
              <li><Link to="/cookies" className="hover:text-foreground">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border/60 pt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} ApexFX Trading. Trading involves risk. Past performance does not guarantee future results.
        </div>
      </div>
    </footer>
  );
}
