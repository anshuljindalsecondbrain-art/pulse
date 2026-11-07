import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { Activity, AlertCircle, ArrowRight, LockKeyhole, Mail, RefreshCw, ShieldCheck } from "lucide-react";
import { isSupabaseConfigured, supabase } from "./lib/supabase";

type Membership = {
  id: string;
  institute_id: string;
  role_key: string;
  centre_id: string | null;
};

export default function AuthGate() {
  const [session, setSession] = useState<Session | null>(null);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    let alive = true;
    supabase.auth.getSession().then(({ data, error: authError }) => {
      if (!alive) return;
      if (authError) setError(authError.message);
      setSession(data.session);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      if (!alive) return;
      setSession(next);
      setMemberships([]);
    });
    return () => { alive = false; listener.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!session || !supabase) { setMemberships([]); return; }
    let alive = true;
    setLoading(true);
    supabase.from("sa_institute_memberships")
      .select("id,institute_id,role_key,centre_id")
      .eq("user_id", session.user.id)
      .eq("is_active", true)
      .then(({ data, error: queryError }) => {
        if (!alive) return;
        if (queryError) setError("Your account is authenticated, but the institute access layer is not available. The database migration and RLS policies must be deployed and verified before workspace access can be enabled.");
        else { setError(""); setMemberships((data ?? []) as Membership[]); }
        setLoading(false);
      });
    return () => { alive = false; };
  }, [session]);

  async function signIn(event: FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true); setError(""); setMessage("");
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (signInError) setError(signInError.message);
    setBusy(false);
  }

  async function resetPassword() {
    if (!supabase || !email.trim()) { setError("Enter your account email first."); return; }
    setBusy(true); setError(""); setMessage("");
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: window.location.origin });
    if (resetError) setError(resetError.message);
    else setMessage("If an account exists for this email, a password-reset link has been sent.");
    setBusy(false);
  }

  async function signOut() {
    if (!supabase) return;
    setBusy(true);
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) setError(signOutError.message);
    setBusy(false);
  }

  if (loading) return <main className="auth-shell"><div className="auth-card"><Activity className="auth-mark"/><p>Checking secure session…</p></div></main>;

  if (!isSupabaseConfigured || !supabase) return <main className="auth-shell"><section className="auth-card">
    <Brand/><div className="auth-alert"><AlertCircle size={17}/><span>Supabase is not configured for this deployment.</span></div>
    <p className="auth-copy">Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> in the Vercel project environment. Never add a service-role or secret key to frontend variables.</p>
  </section></main>;

  if (!session) return <main className="auth-shell"><section className="auth-card">
    <Brand/><div className="auth-eyebrow"><ShieldCheck size={14}/> SECURE INSTITUTE ACCESS</div><h1>Sign in to PULSE</h1>
    <p className="auth-copy">Use the account issued by your institute. Public self-registration is disabled.</p>
    <form className="auth-form" onSubmit={signIn}>
      <label>Email address<div className="auth-input"><Mail size={16}/><input type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@institute.com"/></div></label>
      <label>Password<div className="auth-input"><LockKeyhole size={16}/><input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password"/></div></label>
      <button className="auth-submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"} <ArrowRight size={16}/></button>
    </form>
    <button className="auth-link" onClick={resetPassword} disabled={busy}>Forgot password? Send reset link</button>
    {error && <div className="auth-error"><AlertCircle size={15}/>{error}</div>}
    {message && <div className="auth-message">{message}</div>}
  </section></main>;

  if (error) return <main className="auth-shell"><section className="auth-card"><Brand/><div className="auth-alert"><AlertCircle size={17}/><span>Workspace access is not ready</span></div><p className="auth-copy">{error}</p><button className="auth-submit" onClick={()=>window.location.reload()}>Retry <RefreshCw size={15}/></button><button className="auth-link" onClick={signOut}>Sign out</button></section></main>;

  if (!memberships.length) return <main className="auth-shell"><section className="auth-card"><Brand/><div className="auth-alert"><ShieldCheck size={17}/><span>Account verified · No institute access</span></div><p className="auth-copy">Your login is valid, but no active institute membership is assigned to this account. Ask an institute administrator to provision your role. Access is not granted by choosing a role in the browser.</p><button className="auth-submit" onClick={signOut}>Sign out</button></section></main>;

  return <main className="auth-shell"><section className="auth-card"><Brand/><div className="auth-alert"><ShieldCheck size={17}/><span>Identity verified · Workspace backend pending</span></div><p className="auth-copy">Your account has {memberships.length} active institute membership{memberships.length===1?"":"s"}. The production Abhyas Matrix data adapter is not enabled yet. Demo records have been intentionally withheld to prevent fictional data from being mistaken for student records.</p><button className="auth-submit" onClick={signOut}>Sign out</button></section></main>;
}

function Brand() { return <div className="auth-brand"><div><Activity size={20}/></div><span><b>PULSE</b><small>ACADEMIC OS</small></span></div>; }
