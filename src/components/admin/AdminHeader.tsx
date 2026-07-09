import Image from "next/image";
import Link from "next/link";
import { logoutAdmin } from "@/app/admin/actions";

export function AdminHeader() {
  return (
    <header className="border-b border-municipal-line bg-white text-municipal-dark shadow-sm">
      <div className="section-shell flex min-h-16 items-center justify-between gap-4">
        <Link href="/admin/dashboard" className="flex min-w-0 items-center gap-3 font-semibold text-municipal-dark">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-municipal-line bg-white p-1.5 shadow-sm">
            <Image
              src="/opstina-kocani.png"
              alt="Грб на Општина Кочани"
              width={42}
              height={52}
              className="h-full w-auto object-contain"
            />
          </span>
          <span>
            <span className="block leading-tight">Администрација</span>
            <span className="mt-1 block text-xs font-medium text-municipal-muted">Совет на Општината</span>
          </span>
        </Link>
        <nav className="flex items-center gap-2" aria-label="Административна навигација">
          <Link className="admin-link text-municipal-text hover:bg-municipal-warm hover:text-municipal-red" href="/">
            Јавна страница
          </Link>
          <form action={logoutAdmin}>
            <button className="admin-link bg-municipal-red text-white shadow-sm shadow-municipal-red/10 hover:bg-municipal-darkRed" type="submit">
              Одјави се
            </button>
          </form>
        </nav>
      </div>
      <div className="h-0.5 bg-municipal-gold/80" />
    </header>
  );
}
