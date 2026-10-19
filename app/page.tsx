"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { LOCATIONS, CATEGORIES, TYPES } from "@/lib/data";

type Job = { id: string; company: string; title: string; description: string | null;
  location: string; category: string; job_type: string; remote: boolean; salary: number | null };

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [q, setQ] = useState(""); const [loc, setLoc] = useState("");
  const [cat, setCat] = useState(""); const [type, setType] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      let query = supabase.from("jobs").select("*").eq("status", "approved").order("created_at", { ascending: false }).limit(50);
      if (q.trim()) query = query.ilike("title", `%${q.trim().replace(/[%,]/g, "")}%`);
      if (loc) query = query.eq("location", loc);
      if (cat) query = query.eq("category", cat);
      if (type) query = query.eq("job_type", type);
      const { data, error } = await query;
      if (error) setErr("Зар ачаалж чадсангүй."); else { setErr(""); setJobs(data as Job[]); }
    })();
  }, [q, loc, cat, type]);

  return (<>
    <h1>Танд тохирох ажлаа олоорой</h1>
    <div className="filters">
      <input placeholder="Ажлын нэр" value={q} onChange={e => setQ(e.target.value)} />
      <select value={loc} onChange={e => setLoc(e.target.value)}><option value="">Монгол даяар</option>{LOCATIONS.map(l => <option key={l}>{l}</option>)}</select>
      <select value={cat} onChange={e => setCat(e.target.value)}><option value="">Бүх ангилал</option>{CATEGORIES.map(l => <option key={l}>{l}</option>)}</select>
      <select value={type} onChange={e => setType(e.target.value)}><option value="">Бүх төрөл</option>{TYPES.map(l => <option key={l}>{l}</option>)}</select>
    </div>
    {err && <p>{err}</p>}
    {!err && jobs.length === 0 && <p>Одоогоор зар алга. Эхний зараа оруулаарай.</p>}
    {jobs.map(j => (<article className="job" key={j.id}>
      <h3>{j.title}</h3>
      <div className="meta">{j.company} · {j.location} · {j.job_type}{j.remote ? " · Зайнаас" : ""}</div>
      {j.salary ? <b>{j.salary.toLocaleString("mn-MN")}₮ / сар</b> : null}
      {j.description && <p>{j.description}</p>}
    </article>))}
  </>);
}
