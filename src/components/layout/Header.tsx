import Image from "next/image";
import Link from "next/link";

const navigation = [
  { href: "/#pocetna", label: "Почетна" },
  { href: "/#za-pretsedatelot", label: "За претседателот" },
  { href: "/#prasanje", label: "Постави прашање" },
  { href: "/#problem", label: "Пријави проблем" },
  { href: "/#kontakt", label: "Контакт" }
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-municipal-gold/30 bg-municipal-dark text-white shadow-lg shadow-municipal-dark/15">
      <div className="section-shell">
        <div className="flex min-h-20 items-center justify-between gap-4">
          <Link href="/#pocetna" className="flex min-w-0 items-center gap-3" aria-label="Почетна страница">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-white p-1.5 shadow-sm ring-1 ring-municipal-yellow/50">
              <Image
                src="/municipality-coat-placeholder.png"
                alt="Грб на Општина Кочани"
                width={42}
                height={52}
                className="h-full w-auto object-contain"
                priority
              />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold leading-tight">Општина Кочани</span>
              <span className="block truncate text-xs text-orange-100">Совет на Општината</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Главна навигација">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-semibold text-orange-100 transition hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <nav className="-mx-4 flex gap-1 overflow-x-auto border-t border-municipal-gold/25 px-4 py-3 lg:hidden" aria-label="Мобилна навигација">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-md px-3 py-2 text-sm font-semibold text-orange-100 transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="h-1 bg-gradient-to-r from-municipal-yellow via-municipal-gold to-municipal-yellow" />
    </header>
  );
}
