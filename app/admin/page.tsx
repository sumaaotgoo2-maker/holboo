"use client";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Job = { id: string; company: string; title: string; description: string | null;
  location: string; category: string; job_type: string; salary: number | null;
  status: string; created_at: string };
const TABS = [["pending", "Шалгах"], ["approved", "Нийтлэгдсэн"], ["rejected", "Татгалзсан"], ["closed", "Хаасан"]];

export default function Admin() {
  const [ok, setOk] = useState<boolean | null>(null);
  const [tab, setTab] = useState("pending");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) { setOk(false); return; }
      const { data } = await supabase.from("profiles").select("role").eq("id", u.user.id).single();
      setOk(data?.role === "admin");
    })();
  }, []);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("jobs").select("*")
      .eq("status", tab).order("created_at", { ascending: false }).limit(100);
    if (error) setMsg("Алдаа: " + error.message); else setJobs(data as Job[]);
  }, [tab]);
  useEffect(() => { if (ok) load(); }, [ok, load]);

  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from("jobs").update({ status }).eq("id", id);
    setMsg(error ? "Алдаа: " + error.message : "Шинэчлэгдлээ.");
    load();
  }

  if (ok === null) return <p>Ачаалж байна…</p>;
  if (!ok) return <p>Энэ хуудас зөвхөн админд зориулагдсан. Админ эрхээр нэвтэрнэ үү.</p>;
  return (<>
    <h1>Админ: зар хянах</h1>
    <div className="filters" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
      {TABS.map(([k, l]) => <button key={k} onClick={() => setTab(k)} style={{ opacity: tab === k ? 1 : .55 }}>{l}</button>)}
    </div>
    <p className="msg">{msg}</p>
    {jobs.length === 0 && <p>Энэ ангилалд зар алга.</p>}
    {jobs.map(j => (<article className="job" key={j.id}>
      <h3>{j.title}</h3>
      <div className="meta">{j.company} · {j.location} · {j.category} · {j.job_type}
        {j.salary ? ` · ${j.salary.toLocaleString("mn-MN")}₮` : ""}</div>
      {j.description && <p>{j.description}</p>}
      <div className="filters" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        {j.status !== "approved" && <button onClick={() => setStatus(j.id, "approved")}>Батлах</button>}
        {j.status !== "rejected" && <button onClick={() => setStatus(j.id, "rejected")}>Татгалзах</button>}
        {j.status !== "closed" && <button onClick={() => setStatus(j.id, "closed")}>Хаах</button>}
      </div>
    </article>))}
  </>);
}
