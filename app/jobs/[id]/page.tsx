"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Job = { id: string; company: string; title: string; description: string | null;
  location: string; category: string; job_type: string; salary: number | null; created_at: string };

export default function JobPage() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<boolean>(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("jobs").select("*").eq("id", id).maybeSingle();
      setJob(data as Job | null);
      setLoading(false);
      const { data: u } = await supabase.auth.getUser();
      setUser(!!u.user);
    })();
  }, [id]);

  async function apply() {
    setNote("");
    if (!name.trim() || !phone.trim()) { setNote("Нэр, утасны дугаараа оруулна уу."); return; }
    setSending(true);
    const { error } = await supabase.from("applications").insert({
      job_id: id, name: name.trim(), phone: phone.trim(), message: msg.trim() || null,
    });
    setSending(false);
    if (error) setNote(error.code === "23505" ? "Та энэ зарт өмнө нь анкет илгээсэн байна." : "Илгээж чадсангүй. Дахин оролдоно уу.");
    else { setNote("Анкет амжилттай илгээгдлээ."); setName(""); setPhone(""); setMsg(""); }
  }

  if (loading) return <p>Ачаалж байна...</p>;
  if (!job) return <div><p>Зар олдсонгүй.</p><Link href="/">Нүүр хуудас руу буцах</Link></div>;

  return (
    <div>
      <p><Link href="/">← Бүх зар</Link></p>
      <h1>{job.title}</h1>
      <p><b>{job.company}</b></p>
      <div className="tags"><span className="tag">{job.job_type}</span><span className="tag alt">{job.category}</span></div>
      <p className="jl">📍 {job.location}</p>
      {job.salary ? <p className="js">{job.salary.toLocaleString("mn-MN")}₮ / сар</p> : null}
      {job.description && <p>{job.description}</p>}
      <p className="jt">{job.created_at.slice(0, 10).replace(/-/g, ".")}</p>

      <h2>Анкет илгээх</h2>
      {!user ? (
        <p>Анкет илгээхийн тулд эхлээд <Link href="/login">нэвтэрнэ үү</Link>.</p>
      ) : (
        <div>
          <input placeholder="Таны нэр" value={name} onChange={e => setName(e.target.value)} />
          <input placeholder="Утасны дугаар" value={phone} onChange={e => setPhone(e.target.value)} />
          <textarea placeholder="Товч танилцуулга, туршлага" value={msg} onChange={e => setMsg(e.target.value)} />
          <button onClick={apply} disabled={sending}>{sending ? "Илгээж байна..." : "Анкет илгээх"}</button>
        </div>
      )}
      {note && <p>{note}</p>}
    </div>
  );
}