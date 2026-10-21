"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { LOCATIONS, CATEGORIES, TYPES } from "@/lib/data";
export default function Post() {
  const [msg, setMsg] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) { setMsg("Эхлээд нэвтэрнэ үү."); return; }
    const type = String(f.get("job_type"));
    const { error } = await supabase.from("jobs").insert({
      company: f.get("company"), title: f.get("title"), description: f.get("description"),
      location: f.get("location"), category: f.get("category"), job_type: type, kind: String(f.get("kind")),
      remote: type === "Зайнаас", salary: Number(f.get("salary")) || null,
      expires_at: f.get("expires_at") || null });
    setMsg(error ? "Алдаа: " + error.message : "Зар шалгалтад илгээгдлээ. Баталгаажсаны дараа нийтлэгдэнэ.");
    if (!error) form.reset();
  }
  return (<>
    <h1>Ажлын зар оруулах</h1>
    <form onSubmit={submit}>
      <input name="company" placeholder="Байгууллагын нэр" required />
      <input name="title" placeholder="Ажлын байрны нэр" required />
      <select name="location" required>{LOCATIONS.map(l => <option key={l}>{l}</option>)}</select>
      <select name="category" required>{CATEGORIES.map(l => <option key={l}>{l}</option>)}</select>
      <select name="job_type" required>{TYPES.map(l => <option key={l}>{l}</option>)}</select>
<select name="kind" required>
  <option value="">Төрөл сонгох</option>
  <option value="Ажил">Ажил</option>
  <option value="Дадлага">Дадлага</option>
</select>
      <input name="salary" type="number" min="0" placeholder="Цалин (₮)" />
      <input name="expires_at" type="date" />
      <textarea name="description" rows={4} placeholder="Үүрэг, шаардлага, цагийн хуваарь, холбоо барих" />
      <button>Шалгуулахаар илгээх</button>
    </form><p className="msg">{msg}</p>
  </>);
}
