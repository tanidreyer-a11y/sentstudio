import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const LoginPage = () => {
  const { user, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate("/admin/blog", { replace: true });
  }, [user, loading, navigate]);

  if (user) return <Navigate to="/admin/blog" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const fn = mode === "signin" ? signIn : signUp;
    const { error } = await fn(email, password);
    setBusy(false);
    if (error) toast({ title: "Authentication error", description: error, variant: "destructive" });
    else if (mode === "signup") toast({ title: "Account created", description: "Signing you in…" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Admin Login | Scent Studio</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <Header />
      <main className="container mx-auto px-6 py-32">
        <div className="mx-auto max-w-md border border-border p-10">
          <p className="mb-3 font-sans text-[0.65rem] uppercase tracking-[0.4em] text-muted-foreground text-center">
            Scent Studio
          </p>
          <h1 className="mb-8 font-display text-3xl font-light text-foreground text-center">
            {mode === "signin" ? "Admin Sign In" : "Create Admin Account"}
          </h1>
          <form onSubmit={submit} className="space-y-5">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 rounded-none" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 rounded-none" />
            </div>
            <Button type="submit" disabled={busy} className="w-full rounded-none">
              {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-6 block w-full text-center font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-primary"
          >
            {mode === "signin" ? "Need an admin account? Sign up" : "Already have an account? Sign in"}
          </button>
          <p className="mt-6 text-center font-sans text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">
            First signup becomes admin automatically
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};
export default LoginPage;