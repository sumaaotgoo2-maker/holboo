"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Job = { id: string; title: string; company: string; status: string; created_at: string };
type App = { id: string; job_id: string; name: string; phone: string; message: string | null; created_at: string };

const STATUS: Record<string, string> = {
  pending: "Шалгаж байна", approved: "Нийтлэгдсэн", rejected: "Татгалзсан", closed: "Хаасан",
};

export default function MyJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) { setAuthed(false); setLoading(false); return; }
      const { data: j } = await supabase.from("jobs").select("id,title,company,status,created_at")
        .eq("owner", u.user.id).order("created_at", { ascending: false });
      const { data: a } = await supabase.from("applications").select("*")
        .order("created_at", { ascending: false });
      setJobs((j ?? []) as Job[]);
      setApps(((a ?? []) as App[]).filter(x => (j ?? []).some(job => job.id === x.job_id)));
      setLoading(false);
    })();
  }, []);

  if (loading) return <p>Ачаалж байна...</p>;
  if (!authed) return <p>Эхлээд <Link href="/login">нэвтэрнэ үү</Link>.</p>;

  return (
    <div>
      <h1>Миний зарууд</h1>
      {jobs.length === 0 && <p>Та одоогоор зар оруулаагүй байна. <Link href="/post">Зар оруулах</Link></p>}
      {jobs.map(j => {
        const list = apps.filter(a => a.job_id === j.id);
        return (
          <div key={j.id} className="side" style={{ marginBottom: 16 }}>
            <h3><Link href={`/jobs/${j.id}`}>{j.title}</Link> — {j.company}</h3>
            <p>Төлөв: {STATUS[j.status] ?? j.status} · Анкет: {list.length}</p>
            {list.map(a => (
              <div key={a.id} style={{ borderTop: "1px solid #ddd", padding: "8px 0" }}>
                <b>{a.name}</b> · {a.phone}
                {a.message && <p>{a.message}</p>}
                <small>{a.created_at.slice(0, 10).replace(/-/g, ".")}</small>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}