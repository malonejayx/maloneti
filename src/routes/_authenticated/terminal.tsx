import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  getDerivClient,
  getActiveAccount,
  getStoredAccounts,
  setActiveAccount,
  clearAccounts,
  loginUrl,
  type DerivAccount,
} from "@/lib/deriv";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { TrendingUp, TrendingDown, LogOut, Activity, Wallet, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

export const Route = createFileRoute("/_authenticated/terminal")({
  ssr: false,
  head: () => ({ meta: [{ title: "Live Trading Terminal — ApexFX" }] }),
  component: Terminal,
});

const SYMBOLS = [
  { value: "R_10", label: "Volatility 10 Index" },
  { value: "R_25", label: "Volatility 25 Index" },
  { value: "R_50", label: "Volatility 50 Index" },
  { value: "R_75", label: "Volatility 75 Index" },
  { value: "R_100", label: "Volatility 100 Index" },
  { value: "frxEURUSD", label: "EUR/USD" },
  { value: "frxGBPUSD", label: "GBP/USD" },
  { value: "frxUSDJPY", label: "USD/JPY" },
  { value: "frxAUDUSD", label: "AUD/USD" },
  { value: "frxXAUUSD", label: "Gold/USD" },
];

type Tick = { time: number; quote: number };
type Contract = {
  contract_id: number;
  symbol: string;
  type: string;
  buy_price: number;
  payout: number;
  status?: string;
  profit?: number;
};

function Terminal() {
  const [accounts, setAccounts] = useState<DerivAccount[]>([]);
  const [active, setActive] = useState<DerivAccount | null>(null);
  const [balance, setBalance] = useState<{ balance: number; currency: string } | null>(null);
  const [symbol, setSymbol] = useState("R_100");
  const [ticks, setTicks] = useState<Tick[]>([]);
  const [amount, setAmount] = useState("10");
  const [duration, setDuration] = useState("5");
  const [durationUnit, setDurationUnit] = useState<"t" | "s" | "m">("t");
  const [busy, setBusy] = useState(false);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [authError, setAuthError] = useState<string | null>(null);
  const unsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const accs = getStoredAccounts();
    setAccounts(accs);
    setActive(getActiveAccount());
  }, []);

  // Authorize + subscribe to balance + portfolio
  useEffect(() => {
    if (!active) return;
    const client = getDerivClient();
    let cancelled = false;
    (async () => {
      const auth = await client.send({ authorize: active.token });
      if (cancelled) return;
      if (auth.error) {
        setAuthError(auth.error.message);
        return;
      }
      setAuthError(null);
      client.subscribe({ balance: 1 }, (msg) => {
        if (msg.balance) setBalance({ balance: msg.balance.balance, currency: msg.balance.currency });
      });
      const port = await client.send({ portfolio: 1 });
      if (port.portfolio?.contracts) {
        setContracts(
          port.portfolio.contracts.map((c: any) => ({
            contract_id: c.contract_id,
            symbol: c.symbol,
            type: c.contract_type,
            buy_price: c.buy_price,
            payout: c.payout,
          })),
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [active?.token]);

  // Subscribe ticks for selected symbol
  useEffect(() => {
    const client = getDerivClient();
    setTicks([]);
    unsubRef.current?.();
    const unsub = client.subscribe({ ticks: symbol }, (msg) => {
      if (msg.tick) {
        setTicks((prev) => {
          const next = [...prev, { time: msg.tick.epoch * 1000, quote: msg.tick.quote }];
          return next.length > 120 ? next.slice(-120) : next;
        });
      }
    });
    unsubRef.current = unsub;
    return () => unsub();
  }, [symbol]);

  const lastPrice = ticks[ticks.length - 1]?.quote;
  const prevPrice = ticks[ticks.length - 2]?.quote;
  const priceUp = lastPrice && prevPrice ? lastPrice >= prevPrice : true;

  const switchAccount = (id: string) => {
    setActiveAccount(id);
    setActive(accounts.find((a) => a.account === id) || null);
  };

  const disconnect = () => {
    clearAccounts();
    setAccounts([]);
    setActive(null);
    setBalance(null);
    setContracts([]);
  };

  const trade = async (contract_type: "CALL" | "PUT") => {
    if (!active) return;
    setBusy(true);
    try {
      const client = getDerivClient();
      const proposal = await client.send({
        proposal: 1,
        amount: Number(amount),
        basis: "stake",
        contract_type,
        currency: active.currency,
        duration: Number(duration),
        duration_unit: durationUnit,
        symbol,
      });
      if (proposal.error) throw new Error(proposal.error.message);
      const buy = await client.send({ buy: proposal.proposal.id, price: Number(amount) });
      if (buy.error) throw new Error(buy.error.message);
      toast.success(`${contract_type} placed — ID ${buy.buy.contract_id}`);
      setContracts((c) => [
        {
          contract_id: buy.buy.contract_id,
          symbol,
          type: contract_type,
          buy_price: buy.buy.buy_price,
          payout: buy.buy.payout,
        },
        ...c,
      ]);
    } catch (e: any) {
      toast.error(e.message || "Trade failed");
    } finally {
      setBusy(false);
    }
  };

  const openCashier = async (provider: "deposit" | "withdraw") => {
    if (!active) return;
    try {
      const client = getDerivClient();
      const res = await client.send({ cashier: provider, provider: "doughflow" });
      if (res.error) throw new Error(res.error.message);
      const url = typeof res.cashier === "string" ? res.cashier : res.cashier?.url;
      if (!url) throw new Error("No cashier URL returned");
      window.open(url, "_blank", "noopener,noreferrer");
      toast.success(`${provider === "deposit" ? "Deposit" : "Withdrawal"} page opened in a new tab`);
    } catch (e: any) {
      toast.error(e.message || "Cashier unavailable. Complete KYC on your Deriv account first.");
    }
  };

  if (!active) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20">
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <Activity className="mx-auto h-10 w-10 text-primary" />
          <h1 className="mt-4 font-display text-3xl font-bold">Connect your Deriv account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Trade Forex, indices and synthetics live from ApexFX. You'll be redirected to Deriv to authorize, then back here.
          </p>
          <a href={loginUrl()}>
            <Button className="mt-6 bg-gold-gradient text-primary-foreground hover:opacity-90">
              Sign in with Deriv
            </Button>
          </a>
          <p className="mt-4 text-xs text-muted-foreground">
            No Deriv account? <a className="text-primary underline" href="https://deriv.com/signup/" target="_blank" rel="noreferrer">Create one free</a>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Live Terminal</h1>
          <p className="text-sm text-muted-foreground">Powered by Deriv • {active.account}</p>
        </div>
        <div className="flex items-center gap-3">
          {accounts.length > 1 && (
            <Select value={active.account} onValueChange={switchAccount}>
              <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {accounts.map((a) => (
                  <SelectItem key={a.account} value={a.account}>
                    {a.account} ({a.currency})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2">
            <Wallet className="h-4 w-4 text-primary" />
            <span className="font-mono text-lg font-bold text-gradient-gold">
              {balance ? `${balance.balance.toFixed(2)} ${balance.currency}` : "…"}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={() => openCashier("deposit")}>
            <ArrowDownToLine className="mr-1 h-4 w-4" /> Deposit
          </Button>
          <Button variant="outline" size="sm" onClick={() => openCashier("withdraw")}>
            <ArrowUpFromLine className="mr-1 h-4 w-4" /> Withdraw
          </Button>
          <Button variant="ghost" size="sm" onClick={disconnect}>
            <LogOut className="mr-1 h-4 w-4" /> Disconnect
          </Button>
        </div>
      </div>

      {authError && (
        <div className="mb-6 rounded-lg border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-200">
          Deriv auth error: {authError}. <a href={loginUrl()} className="underline">Reconnect</a>.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <Select value={symbol} onValueChange={setSymbol}>
              <SelectTrigger className="w-[240px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {SYMBOLS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className={`flex items-center gap-2 font-mono text-2xl font-bold ${priceUp ? "text-emerald-400" : "text-rose-400"}`}>
              {priceUp ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
              {lastPrice?.toFixed(4) ?? "—"}
            </div>
          </div>
          <TickChart ticks={ticks} up={priceUp} />
        </div>

        {/* Order ticket */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-lg font-bold">Place trade</h3>
          <p className="mt-1 text-xs text-muted-foreground">Rise/Fall contract on {symbol}</p>
          <div className="mt-5 space-y-4">
            <div>
              <Label htmlFor="amount">Stake ({active.currency})</Label>
              <Input id="amount" type="number" min={1} value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input id="duration" type="number" min={1} value={duration} onChange={(e) => setDuration(e.target.value)} />
              </div>
              <div>
                <Label>Unit</Label>
                <Select value={durationUnit} onValueChange={(v) => setDurationUnit(v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="t">Ticks</SelectItem>
                    <SelectItem value="s">Seconds</SelectItem>
                    <SelectItem value="m">Minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button disabled={busy} onClick={() => trade("CALL")} className="bg-emerald-500 hover:bg-emerald-600 text-white">
                <TrendingUp className="mr-1 h-4 w-4" /> Rise
              </Button>
              <Button disabled={busy} onClick={() => trade("PUT")} className="bg-rose-500 hover:bg-rose-600 text-white">
                <TrendingDown className="mr-1 h-4 w-4" /> Fall
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Open positions */}
      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <h3 className="font-display text-lg font-bold">Open positions</h3>
        {contracts.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No open contracts.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase text-muted-foreground">
                <tr><th className="py-2">ID</th><th>Symbol</th><th>Type</th><th>Stake</th><th>Payout</th></tr>
              </thead>
              <tbody>
                {contracts.map((c) => (
                  <tr key={c.contract_id} className="border-t border-border">
                    <td className="py-2 font-mono">{c.contract_id}</td>
                    <td>{c.symbol}</td>
                    <td>{c.type}</td>
                    <td>{c.buy_price.toFixed(2)}</td>
                    <td>{c.payout.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function TickChart({ ticks, up }: { ticks: Tick[]; up: boolean }) {
  const { path, area, min, max } = useMemo(() => {
    if (ticks.length < 2) return { path: "", area: "", min: 0, max: 0 };
    const quotes = ticks.map((t) => t.quote);
    const min = Math.min(...quotes);
    const max = Math.max(...quotes);
    const range = max - min || 1;
    const w = 800;
    const h = 300;
    const step = w / (ticks.length - 1);
    const pts = ticks.map((t, i) => {
      const x = i * step;
      const y = h - ((t.quote - min) / range) * (h - 20) - 10;
      return [x, y];
    });
    const path = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
    const area = `${path} L${w},${h} L0,${h} Z`;
    return { path, area, min, max };
  }, [ticks]);

  const color = up ? "rgb(52 211 153)" : "rgb(251 113 133)";

  return (
    <div className="relative h-[300px] w-full overflow-hidden rounded-lg bg-background/50">
      {ticks.length < 2 ? (
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          Loading live ticks…
        </div>
      ) : (
        <>
          <svg viewBox="0 0 800 300" className="h-full w-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={area} fill="url(#g)" />
            <path d={path} fill="none" stroke={color} strokeWidth="2" />
          </svg>
          <div className="pointer-events-none absolute right-2 top-2 rounded bg-background/80 px-2 py-1 font-mono text-xs text-muted-foreground">
            H {max.toFixed(4)} · L {min.toFixed(4)}
          </div>
        </>
      )}
    </div>
  );
}
