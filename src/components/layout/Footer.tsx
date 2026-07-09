import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

const googleMapsUrl = "https://maps.app.goo.gl/GSEFDyvddZVWMaj29";

export function Footer() {
  return (
    <footer className="border-t border-municipal-line bg-white text-municipal-text">
      <div className="h-1 bg-municipal-red" />
      <div className="section-shell py-12">
        <div className="mb-10 h-px w-full bg-municipal-line">
          <div className="h-px w-24 bg-municipal-gold" />
        </div>
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-md border border-municipal-line bg-white p-1.5 shadow-sm">
                <Image
                  src="/opstina-kocani.png"
                  alt="Грб на Општина Кочани"
                  width={42}
                  height={52}
                  className="h-full w-auto object-contain"
                />
              </span>
              <div>
                <p className="font-semibold text-municipal-dark">Претседател на Советот на Општина Кочани</p>
                <p className="text-sm text-municipal-muted">Платформа за директна комуникација со граѓаните</p>
              </div>
            </div>
            <p className="mt-5 max-w-xl text-sm leading-7 text-municipal-muted">
              Официјален канал за прием на прашања, предлози и пријави од јавен интерес,
              со цел навремена и транспарентна комуникација.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-normal text-municipal-red">Навигација</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link className="text-municipal-muted transition hover:text-municipal-red" href="/#za-pretsedatelot">
                  За претседателот
                </Link>
              </li>
              <li>
                <Link className="text-municipal-muted transition hover:text-municipal-red" href="/#prasanje">
                  Постави прашање
                </Link>
              </li>
              <li>
                <Link className="text-municipal-muted transition hover:text-municipal-red" href="/#problem">
                  Пријави проблем
                </Link>
              </li>
              <li>
                <Link className="text-municipal-muted transition hover:text-municipal-red" href="/admin/login">
                  Администрација
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-normal text-municipal-red">Контакт</h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-municipal-muted">
              <p>Општина Кочани</p>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center gap-2 rounded-md border border-municipal-line bg-white px-3 py-2 font-semibold text-municipal-red transition hover:border-municipal-gold hover:bg-municipal-yellow/10"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                Отвори на Google Maps
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-municipal-line pt-6 text-sm text-municipal-muted">
          © {new Date().getFullYear()} Општина Кочани. Сите права се задржани.
        </div>
      </div>
    </footer>
  );
}
