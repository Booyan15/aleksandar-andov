import Image from "next/image";
import Link from "next/link";

const navigation = [
  { href: "/#pocetna", label: "Почетна", current: true },
  { href: "/#za-pretsedatelot", label: "За претседателот" },
  { href: "/#prasanje", label: "Постави прашање" },
  { href: "/#problem", label: "Пријави проблем" },
  { href: "/#kontakt", label: "Контакт" }
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-municipal-line bg-white/95 text-municipal-dark shadow-sm backdrop-blur">
      <div className="section-shell">
        <div className="flex min-h-20 items-center justify-between gap-4">
          <Link href="/#pocetna" className="flex min-w-0 items-center gap-3" aria-label="Почетна страница">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-municipal-line bg-white p-1.5 shadow-sm">
              <Image
                src="/opstina-kocani.png"
                alt="Грб на Општина Кочани"
                width={42}
                height={52}
                className="h-full w-auto object-contain"
                priority
              />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold leading-tight text-municipal-dark">Општина Кочани</span>
              <span className="mt-1 block truncate text-xs text-municipal-muted">Совет на Општината</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Главна навигација">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={item.current ? "page" : undefined}
                className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                  item.current
                    ? "bg-red-50 text-municipal-red"
                    : "text-municipal-text hover:bg-municipal-warm hover:text-municipal-red"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <nav className="-mx-4 flex gap-1 overflow-x-auto border-t border-municipal-line px-4 py-3 lg:hidden" aria-label="Мобилна навигација">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              className={`shrink-0 rounded-md px-3 py-2 text-sm font-semibold transition ${
                item.current
                  ? "bg-red-50 text-municipal-red"
                  : "text-municipal-text hover:bg-municipal-warm hover:text-municipal-red"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="h-0.5 bg-municipal-gold/80" />
    </header>
  );
}
