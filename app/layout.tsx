import "./globals.css";
import Link from "next/link";

export const metadata = { title: "Холбоё — ажлын зарын платформ" };

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn">
      <body>
        <header>
          <div className="wrap bar">
            <Link href="/" className="brand">
              <svg width="42" height="42" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                <circle cx="17" cy="14" r="6" stroke="#1f7a56" strokeWidth="3" />
                <circle cx="33" cy="14" r="6" stroke="#1f7a56" strokeWidth="3" />
                <path d="M5 40c0-8 6-13 12-13 4 0 7 2 7 2s3-2 7-2c6 0 12 5 12 13" stroke="#1f7a56" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <span>
                <b>Холбоё</b>
                <small>Ажил хайгч, ажил олгогч хоёрыг холбоё!</small>
              </span>
            </Link>
            <nav>
              <Link href="/" className="on">Нүүр хуудас</Link>
              <Link href="/#jobs">Зар</Link>
              <Link href="/post">Зар оруулах</Link>
              <Link href="/admin">Админ</Link>
            </nav>
            <div className="auth">
              <Link href="/login" className="btn-o">Нэвтрэх</Link>
              <Link href="/login" className="btn-f">Бүртгүүлэх</Link>
            </div>
          </div>
        </header>
        <main className="wrap">{children}</main>
        <footer>
          <div className="wrap foot">
            <div><b>Найдвартай мэдээлэл</b><span>Ажлын зарыг шалгаж, хуурамч зарыг сэргийлнэ.</span></div>
            <div><b>Таны аюулгүй байдал</b><span>Хувийн мэдээллийг хамгаална.</span></div>
            <div><b>Хамтдаа хөгжицгөөе</b><span>Ажил хайгч, ажил олгогчийг холбоно.</span></div>
          </div>
        </footer>
      </body>
    </html>
  );
}
