import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem("apexfx-cookies-ack")) setShow(true);
  }, []);
  if (!show) return null;
  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl rounded-xl border border-border bg-card/95 p-4 shadow-2xl backdrop-blur md:p-5">
      <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted-foreground">
          We use cookies to keep you signed in and improve your experience. See our{" "}
          <Link to="/cookies" className="text-primary underline-offset-4 hover:underline">Cookie Policy</Link>.
        </p>
        <div className="flex shrink-0 gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => { localStorage.setItem("apexfx-cookies-ack", "declined"); setShow(false); }}
          >
            Decline
          </Button>
          <Button
            size="sm"
            className="bg-gold-gradient text-primary-foreground hover:opacity-90"
            onClick={() => { localStorage.setItem("apexfx-cookies-ack", "accepted"); setShow(false); }}
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
