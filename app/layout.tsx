import "./globals.css";
import Link from "next/link";
export const metadata = { title: "Холбоё — ажлын зарын платформ" };
export default function Root({ children }: { children: React.ReactNode }) {
  return (<html lang="mn"><body>
    <header><div className="wrap"><b>Холбоё</b>
      <nav><Link href="/">Зар</Link><Link href="/post">Зар оруулах</Link><Link href="/login">Нэвтрэх</Link><Link href="/admin">Админ</Link></nav></div></header>
    <main className="wrap">{children}</main>
  </body></html>);
}
