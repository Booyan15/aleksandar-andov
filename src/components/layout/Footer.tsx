import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer id="kontakt" className="bg-municipal-dark text-white">
      <div className="h-1 bg-gradient-to-r from-municipal-yellow via-municipal-gold to-municipal-yellow" />
      <div className="section-shell py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-md bg-white p-1.5 ring-1 ring-municipal-yellow/50">
                <Image
                  src="/municipality-coat-placeholder.png"
                  alt="Грб на Општина Кочани"
                  width={42}
                  height={52}
                  className="h-full w-auto object-contain"
                />
              </span>
              <div>
                <p className="font-semibold">Претседател на Советот</p>
                <p className="text-sm text-orange-100">Општина Кочани</p>
              </div>
            </div>
            <p className="mt-5 max-w-xl text-sm leading-7 text-orange-100">
              Официјален канал за прием на прашања, иницијативи и пријави од граѓаните,
              со цел навремена и транспарентна комуникација.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-municipal-yellow">Навигација</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link className="text-orange-100 transition hover:text-white" href="/#za-pretsedatelot">
                  За претседателот
                </Link>
              </li>
              <li>
                <Link className="text-orange-100 transition hover:text-white" href="/#prasanje">
                  Постави прашање
                </Link>
              </li>
              <li>
                <Link className="text-orange-100 transition hover:text-white" href="/#problem">
                  Пријави проблем
                </Link>
              </li>
              <li>
                <Link className="text-orange-100 transition hover:text-white" href="/admin/login">
                  Администрација
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-municipal-yellow">Контакт</h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-orange-100">
              <p>Општина Кочани</p>
              <p>Адреса за контакт ќе биде внесена дополнително.</p>
              <p>Е-пошта: kontakt@kocani.gov.mk</p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-municipal-gold/25 pt-6 text-sm text-orange-100">
          © {new Date().getFullYear()} Општина Кочани. Сите права се задржани.
        </div>
      </div>
    </footer>
  );
}
