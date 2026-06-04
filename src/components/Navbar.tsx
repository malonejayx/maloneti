import { Link, useRouter } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { TrendingUp, LogOut, Shield } from "lucide-react";

export function Navbar() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  const signOut = async () => {
    await supabase.auth.signOut();
    router.navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-gradient">
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">ApexFX</span>
        </Link>
        <nav className="flex items-center gap-3 md:gap-8 text-xs md:text-sm">
          <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
          {user && <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">Dashboard</Link>}
          {user && <Link to="/purchases" className="hidden sm:inline text-muted-foreground hover:text-foreground">Orders</Link>}
          {isAdmin && (
            <Link to="/admin" className="flex items-center gap-1 text-primary hover:opacity-80">
              <Shield className="h-4 w-4" /> Admin
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="mr-1 h-4 w-4" /> Sign out
            </Button>
          ) : (
            <>
              <Link to="/auth"><Button variant="ghost" size="sm">Sign in</Button></Link>
              <Link to="/auth"><Button size="sm" className="bg-gold-gradient text-primary-foreground hover:opacity-90">Get started</Button></Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
