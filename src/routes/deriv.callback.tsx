import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { storeAccounts, setActiveAccount, type DerivAccount } from "@/lib/deriv";

export const Route = createFileRoute("/deriv/callback")({
  ssr: false,
  component: DerivCallback,
});

function DerivCallback() {
  const router = useRouter();
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
    }
    router.navigate({ to: "/terminal" });
  }, [router]);
  return (
    <div className="flex min-h-screen items-center justify-center text-muted-foreground">
      Connecting your Deriv account…
    </div>
  );
}
