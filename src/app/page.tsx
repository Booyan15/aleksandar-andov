import Image from "next/image";
import Link from "next/link";
import { Building2, ExternalLink, FileCheck2, Landmark, MapPin, MessageCircle, UsersRound } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PublicSubmissionTabs } from "@/components/forms/PublicSubmissionTabs";
import { absoluteUrl, siteConfig } from "@/lib/site";

const googleMapsUrl = "https://maps.app.goo.gl/GSEFDyvddZVWMaj29";

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.title,
    url: absoluteUrl("/"),
    inLanguage: siteConfig.language,
    description: siteConfig.description,
    publisher: {
      "@type": "GovernmentOrganization",
      name: siteConfig.publisher
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    jobTitle: "Претседател на Советот на Општина Кочани",
    url: absoluteUrl("/"),
    image: absoluteUrl("/president-placeholder.jpg"),
    worksFor: {
      "@type": "GovernmentOrganization",
      name: siteConfig.publisher
    }
  }
];

const competences = [
  {
    title: "Одлуки и програми",
    description: "Разгледување и донесување акти, програми и планови од значење за локалната заедница.",
    icon: FileCheck2
  },
  {
    title: "Јавен интерес",
    description: "Следење на прашања поврзани со комунални услуги, урбанизам, култура, образование и развој.",
    icon: Landmark
  },
  {
    title: "Комуникација со граѓани",
    description: "Прием на иницијативи, прашања и предлози со цел поодговорно локално управување.",
    icon: UsersRound
  },
  {
    title: "Надзор и отчетност",
    description: "Поттикнување транспарентност во работата на општинските органи и јавните служби.",
    icon: Building2
  }
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c")
        }}
      />
      <Header />
      <main>
        <section id="pocetna" className="relative isolate overflow-hidden bg-white scroll-mt-28">
          <div className="absolute inset-x-0 bottom-0 h-24 bg-municipal-warm" />

          <div className="section-shell relative grid items-center gap-10 py-12 sm:gap-12 sm:py-16 lg:min-h-[620px] lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
            <div className="relative z-10 max-w-3xl">
              <div className="gold-detail mb-6" />
              <p className="text-sm font-semibold uppercase tracking-normal text-municipal-red">
                Совет на Општина Кочани
              </p>
              <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight text-municipal-dark sm:text-5xl lg:text-6xl">
                Александар Андов
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-municipal-muted sm:text-xl">
                Претседател на Советот на Општина Кочани. Официјален и достапен простор
                за прашања, иницијативи и пријави од граѓаните, со јасна и одговорна комуникација.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="#prasanje" className="primary-button">
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  Постави прашање
                </Link>
                <Link href="#problem" className="secondary-button">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  Пријави проблем
                </Link>
              </div>
              <div className="mt-10 hidden gap-3 text-sm text-municipal-muted sm:grid sm:grid-cols-3">
                <div className="rounded-lg border border-municipal-line bg-white p-4 shadow-sm">
                  <div className="mb-3 h-1 w-8 rounded-full bg-municipal-gold" />
                  Прашања до Советот
                </div>
                <div className="rounded-lg border border-municipal-line bg-white p-4 shadow-sm">
                  <div className="mb-3 h-1 w-8 rounded-full bg-municipal-gold" />
                  Граѓански иницијативи
                </div>
                <div className="rounded-lg border border-municipal-line bg-white p-4 shadow-sm">
                  <div className="mb-3 h-1 w-8 rounded-full bg-municipal-gold" />
                  Локални пријави
                </div>
              </div>
            </div>

            <div className="relative z-10 mx-auto w-full max-w-md lg:max-w-none">
              <div className="absolute -right-3 top-10 hidden h-24 w-24 rounded-lg border border-municipal-gold/45 bg-municipal-yellow/15 lg:block" />
              <div className="absolute -left-3 bottom-10 hidden h-32 w-2 rounded-full bg-municipal-red lg:block" />
              <div className="relative overflow-hidden rounded-lg border border-municipal-line bg-white p-2 shadow-official">
                <Image
                  src="/president-placeholder.jpg"
                  alt="Александар Андов, претседател на Советот на Општина Кочани"
                  width={945}
                  height={1600}
                  priority
                  className="h-[340px] w-full rounded-md object-cover object-[center_18%] sm:h-auto sm:aspect-[4/5]"
                  sizes="(min-width: 1024px) 42vw, 90vw"
                />
                <div className="absolute bottom-5 left-5 right-5 rounded-md border border-municipal-line bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
                  <p className="text-sm font-semibold text-municipal-dark">Совет на Општина Кочани</p>
                  <p className="mt-1 text-xs text-municipal-muted">Официјална комуникација со граѓаните</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="za-pretsedatelot" className="bg-municipal-warm py-16 scroll-mt-28 sm:py-24">
          <div className="section-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <div className="gold-detail mb-5" />
              <p className="section-kicker">За претседателот на Советот</p>
              <h2 className="section-title mt-3">Одговорна врска меѓу Советот и граѓаните.</h2>
            </div>
            <div className="official-card p-6 sm:p-8">
              <div className="space-y-5 text-lg leading-8 text-municipal-muted">
                <p>
                  Овој простор е предвиден за официјална биографија, професионален профил и
                  приоритети во работата на Претседателот на Советот на Општина Кочани.
                </p>
                <p>
                  Целта на страницата е граѓаните да имаат јасен, достапен и достоинствен канал
                  за поставување прашања, доставување иницијативи и пријавување локални проблеми.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-24">
          <div className="section-shell">
            <div className="max-w-3xl">
              <div className="gold-detail mb-5" />
              <p className="section-kicker">Надлежности на Советот</p>
              <h2 className="section-title mt-3">Советот носи одлуки од јавен интерес за општината.</h2>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {competences.map((competence) => {
                const Icon = competence.icon;
                return (
                  <article key={competence.title} className="official-card p-6 transition hover:-translate-y-0.5 hover:shadow-official">
                    <div className="flex h-11 w-11 items-center justify-center rounded-md border border-municipal-gold/30 bg-municipal-yellow/15 text-municipal-gold">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-municipal-dark">{competence.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-municipal-muted">{competence.description}</p>
                    <div className="mt-6 h-px w-full bg-municipal-line">
                      <div className="h-px w-12 bg-municipal-red" />
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-municipal-warm py-16 sm:py-24">
          <div className="section-shell">
            <div className="max-w-3xl">
              <div className="gold-detail mb-5" />
              <p className="section-kicker">Комуникација со граѓаните</p>
              <h2 className="section-title mt-3">Испратете прашање или пријава преку безбеден образец.</h2>
            </div>

            <div className="mt-10">
              <PublicSubmissionTabs />
            </div>
          </div>
        </section>

        <section id="kontakt" className="bg-white py-16 scroll-mt-28 sm:py-24">
          <div className="section-shell">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div>
                <div className="gold-detail mb-5" />
                <p className="section-kicker">Контакт</p>
                <h2 className="section-title mt-3 text-municipal-red">Контакт и локација</h2>
                <p className="mt-5 max-w-2xl text-base leading-7 text-municipal-muted sm:text-lg">
                  За прашања, предлози и пријави од јавен интерес, користете ги формите на оваа веб-страница
                  или посетете ја локацијата на Општина Кочани.
                </p>
              </div>

              <article className="official-card p-6 sm:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-municipal-gold/30 bg-municipal-yellow/15 text-municipal-gold">
                      <MapPin className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-normal text-municipal-red">Локација</p>
                      <h3 className="mt-2 text-2xl font-semibold text-municipal-dark">Општина Кочани</h3>
                      <p className="mt-2 text-sm leading-6 text-municipal-muted">
                        Официјална локација на општинската администрација.
                      </p>
                    </div>
                  </div>

                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="secondary-button w-full sm:w-auto"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    Отвори на Google Maps
                  </a>
                </div>
              </article>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
