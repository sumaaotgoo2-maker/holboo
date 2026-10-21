"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { LOCATIONS, CATEGORIES, TYPES } from "@/lib/data";

type Job = { id: string; company: string; title: string; description: string | null;
  location: string; category: string; job_type: string; remote: boolean;
  salary: number | null; created_at: string };

const ICONS: Record<string, string> = {
  "Мал аж ахуй": "🐑", "Газар тариалан": "🌱", "Уул уурхай, үйлдвэр": "⛏️",
  "Барилга, инженер": "👷", "Жолооч, тээвэр": "🚚", "Худалдаа, үйлчилгээ": "🛍️",
  "Оффис, санхүү": "💼", "Боловсрол, эрүүл мэнд": "🎓", "Туршлагагүй хүнд": "🌟",
};
const day = (d: string) => d.slice(0, 10).replace(/-/g, ".");

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [q, setQ] = useState(""); const [loc, setLoc] = useState("");
  const [cat, setCat] = useState(""); const [type, setType] = useState("");
  const [min, setMin] = useState(""); const [err, setErr] = useState("");
  const [stats, setStats] = useState({ jobs: 0, companies: 0 });
  const [kind, setKind] = useState("hiring");

  useEffect(() => {
    (async () => {
      let query = supabase.from("jobs").select("*").eq("status", "approved")
        .order("created_at", { ascending: false }).limit(50);
      const t = q.trim().replace(/[%,()]/g, "");
      if (t) query = query.or(`title.ilike.%${t}%,company.ilike.%${t}%`);
      if (loc) query = query.eq("location", loc);
      if (cat) query = query.eq("category", cat);
      if (type) query = query.eq("job_type", type);
      if (min) query = query.gte("salary", Number(min));query = query.eq("kind", kind);
      const { data, error } = await query;
      if (error) setErr("Зар ачаалж чадсангүй."); else { setErr(""); setJobs(data as Job[]); }
    })();
  }, [q, loc, cat, type, min, kind]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("jobs").select("company").eq("status", "approved").limit(1000);
      if (data) setStats({ jobs: data.length, companies: new Set(data.map(r => r.company)).size });
    })();
  }, []);

  return (<>
    <section className="hero">
      <div className="hero-in">
        <h1>Таны дараагийн боломж эндээс эхэлнэ</h1>
        <p>Монгол даяар ажлын байрны мэдээллийг нэг дороос.</p>
      </div>
    </section><div style={{ display: "flex", gap: 8, margin: "16px 0" }}>
  <button type="button" onClick={() => setKind("hiring")}
    style={{ padding: "10px 18px", borderRadius: 999, border: "1px solid #1f7a55", cursor: "pointer", fontWeight: 700,
      background: kind === "hiring" ? "#1f7a55" : "#fff", color: kind === "hiring" ? "#fff" : "#1f7a55" }}>
    Ажилд авна
  </button>
  <button type="button" onClick={() => setKind("seeking")}
    style={{ padding: "10px 18px", borderRadius: 999, border: "1px solid #1f7a55", cursor: "pointer", fontWeight: 700,
      background: kind === "seeking" ? "#1f7a55" : "#fff", color: kind === "seeking" ? "#fff" : "#1f7a55" }}>
    Ажил хайна
  </button>
</div>

    <form className="search" onSubmit={e => { e.preventDefault(); document.getElementById("jobs")?.scrollIntoView({ behavior: "smooth" }); }}>
      <input placeholder="Ажлын байр, байгууллагын нэр" value={q} onChange={e => setQ(e.target.value)} />
      <select value={loc} onChange={e => setLoc(e.target.value)}><option value="">Бүх байршил</option>{LOCATIONS.map(l => <option key={l}>{l}</option>)}</select>
      <select value={type} onChange={e => setType(e.target.value)}><option value="">Бүх төрөл</option>{TYPES.map(l => <option key={l}>{l}</option>)}</select>
      <select value={min} onChange={e => setMin(e.target.value)}>
        <option value="">Доод цалин</option>
        {[500000, 1000000, 1500000, 2000000, 3000000].map(n => <option key={n} value={n}>{n.toLocaleString("mn-MN")}₮-аас дээш</option>)}
      </select>
      <button>Хайх</button>
    </form>

    <section className="chips" aria-label="Ангиллаар хайх">
      <b>Ангиллаар хайх</b>
      {CATEGORIES.map(c => (
        <button type="button" key={c} className={cat === c ? "chip on" : "chip"} onClick={() => setCat(cat === c ? "" : c)}>
          <span>{ICONS[c] ?? "•"}</span>{c}
        </button>
      ))}
    </section>

    <div className="cols" id="jobs">
      <section>
        <h2>Шинэ ажлын зарууд</h2>
        {err && <p>{err}</p>}
        {!err && jobs.length === 0 && <p className="empty">Одоогоор тохирох зар алга. Шүүлтүүрээ өөрчилж үзнэ үү.</p>}
        <div className="grid">
          {jobs.map(j => (
            <article className="jc" key={j.id}>
              <div className="jc-top"><span className="logo">{j.company.charAt(0).toUpperCase()}</span><span className="co">{j.company}</span></div>
              <h3><Link href={`/jobs/${j.id}`}>{j.title}</Link></h3>
              <div className="tags"><span className="tag">{j.job_type}</span><span className="tag alt">{j.category}</span></div>
              <p className="jl">📍 {j.location}</p>
              {j.salary ? <p className="js">{j.salary.toLocaleString("mn-MN")}₮ / сар</p> : null}
              {j.description && <p className="jd">{j.description}</p>}
              <p className="jt">{day(j.created_at)}</p>
            </article>
          ))}
        </div>
      </section>

      <aside>
        <div className="side post">
          <h3>Ажлын зар оруулах</h3>
          <p>Байгууллага, хувь хүн ажлын зараа оруулах боломжтой.</p>
          <Link href="/post" className="btn-f">Зар оруулах</Link>
        </div>
        <div className="side stats">
          <div><b>{stats.jobs}</b><span>Ажлын зар</span></div>
          <div><b>{stats.companies}</b><span>Байгууллага</span></div>
        </div>
      </aside>
    </div>
  </>);
}
