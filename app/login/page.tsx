"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
export default function Login() {
  const [email, setEmail] = useState(""); const [pw, setPw] = useState(""); const [msg, setMsg] = useState("");
  async function go(mode: "in" | "up") {
    const r = mode === "in" ? await supabase.auth.signInWithPassword({ email, password: pw })
                            : await supabase.auth.signUp({ email, password: pw });
    setMsg(r.error ? r.error.message : mode === "in" ? "Нэвтэрлээ." : "Бүртгэгдлээ. Имэйлээ шалгаж баталгаажуулна уу.");
  }
  return (<>
    <h1>Нэвтрэх / Бүртгүүлэх</h1>
    <form onSubmit={e => e.preventDefault()}>
      <input type="email" placeholder="Имэйл" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Нууц үг (8+ тэмдэгт)" minLength={8} value={pw} onChange={e => setPw(e.target.value)} required />
      <button onClick={() => go("in")}>Нэвтрэх</button>
      <button onClick={() => go("up")}>Бүртгүүлэх</button>
    </form><p className="msg">{msg}</p>
  </>);
}
