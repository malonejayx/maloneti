import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { storeAccounts, setActiveAccount, type DerivAccount } from "@/lib/deriv";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/deriv/callback")({
  ssr: false,
  component: DerivCallback,
});

function DerivCallback() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [count, setCount] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accounts: DerivAccount[] = [];
    let i = 1;
    while (params.get(`acct${i}`)) {
      accounts.push({
        account: params.get(`acct${i}`)!,
        token: params.get(`token${i}`)!,
        currency: params.get(`cur${i}`) || "USD",
      });
      i++;
    }
    if (accounts.length) {
      storeAccounts(accounts);
      setActiveAccount(accounts[0].account);
      setCount(accounts.length);
      setStatus("success");
      const t = setTimeout(() => router.navigate({ to: "/terminal" }), 1500);
      return () => clearTimeout(t);
    } else {
      setStatus("error");
    }
  }, [router]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-gradient opacity-20 blur-3xl" />
      <div className="relative w-full max-w-md rounded-3xl border border-border bg-card/80 p-10 text-center backdrop-blur glow-gold">
        {status === "loading" && (
          <>
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <h1 className="mt-6 font-display text-2xl font-bold">Connecting Deriv…</h1>
            <p className="mt-2 text-sm text-muted-foreground">Securely linking your account to ApexFX.</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
              <CheckCircle2 className="h-10 w-10 text-emerald-400" />
            </div>
            <h1 className="mt-6 font-display text-2xl font-bold">You're connected!</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {count} account{count > 1 ? "s" : ""} linked. Redirecting to your terminal…
            </p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/15">
              <AlertCircle className="h-10 w-10 text-rose-400" />
            </div>
            <h1 className="mt-6 font-display text-2xl font-bold">Connection failed</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              We didn't receive an account token from Deriv. Please try again.
            </p>
            <button
              onClick={() => router.navigate({ to: "/terminal" })}
              className="mt-6 rounded-lg bg-gold-gradient px-6 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Back to terminal
            </button>
          </>
        )}
      </div>
    </div>
  );
}
