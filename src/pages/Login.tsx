import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

const ADMIN_EMAIL = "xiao.fx10@gmail.com"; // <-- your email

export default function Login() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  // If you're already logged in, bounce out of /login
  useEffect(() => {
    if (user) navigate("/edit", { replace: true });
  }, [user, navigate]);

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();

    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      setMsg("This login is restricted.");
      return;
    }

    setLoading(true);
    setMsg(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
    });

    setLoading(false);
    setMsg(error ? error.message : "Check your email for the login link.");
  }

  return (
    <div style={{ maxWidth: 420, margin: "4rem auto" }}>
      <h1>Admin sign in</h1>

      <form onSubmit={sendLink}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          style={{ width: "100%", marginBottom: 12 }}
        />

        <button
          type="submit"
          disabled={loading || !email}
          style={{ width: "100%" }}
        >
          {loading ? "Sending…" : "Send magic link"}
        </button>
      </form>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </div>
  );
}
