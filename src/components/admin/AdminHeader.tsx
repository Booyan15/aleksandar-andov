import Link from "next/link";
import { logoutAdmin } from "@/app/admin/actions";

export function AdminHeader() {
  return (
    <header className="border-b border-municipal-gold/30 bg-municipal-dark text-white shadow-sm">
      <div className="section-shell flex min-h-16 items-center justify-between gap-4">
        <Link href="/admin/dashboard" className="font-semibold text-white">
          Администрација
        </Link>
        <nav className="flex items-center gap-2" aria-label="Административна навигација">
          <Link className="admin-link text-orange-100 hover:bg-white/10 hover:text-white" href="/">
            Јавна страница
          </Link>
          <form action={logoutAdmin}>
            <button className="admin-link bg-municipal-yellow text-municipal-dark hover:bg-municipal-gold" type="submit">
              Одјави се
            </button>
          </form>
        </nav>
      </div>
      <div className="h-1 bg-municipal-gold" />
    </header>
  );
}
