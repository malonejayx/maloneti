import { Link } from "@tanstack/react-router";
import { Mail, Phone, MessageCircle } from "lucide-react";

const SUPPORT_EMAIL = "justiceforiran653@gmail.com";
const SUPPORT_PHONE = "+254746496906";
const WHATSAPP_LINK = "https://wa.me/254746496906";

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
              <li><Link to="/terminal" className="hover:text-foreground">Live Terminal</Link></li>
            </ul>
            <h4 className="mt-4 text-sm font-semibold">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground">About</Link></li>
              <li><Link to="/faq" className="hover:text-foreground">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Contact</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a href={`mailto:${SUPPORT_EMAIL}`} className="inline-flex items-center gap-2 hover:text-foreground">
                  <Mail className="h-3.5 w-3.5" /> {SUPPORT_EMAIL}
                </a>
              </li>
              <li>
                <a href={`tel:${SUPPORT_PHONE}`} className="inline-flex items-center gap-2 hover:text-foreground">
                  <Phone className="h-3.5 w-3.5" /> {SUPPORT_PHONE}
                </a>
              </li>
              <li>
                <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-foreground">
                  <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                </a>
              </li>
            </ul>
            <h4 className="mt-4 text-sm font-semibold">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/risk" className="hover:text-foreground">Risk Disclosure</Link></li>
              <li><Link to="/privacy" className="hover:text-foreground">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-foreground">Terms</Link></li>
              <li><Link to="/cookies" className="hover:text-foreground">Cookies</Link></li>
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
