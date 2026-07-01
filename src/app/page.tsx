import Image from "next/image";
import Link from "next/link";
import { Building2, FileCheck2, Landmark, MapPin, MessageCircle, UsersRound } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ProblemForm } from "@/components/forms/ProblemForm";
import { QuestionForm } from "@/components/forms/QuestionForm";

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
      <Header />
      <main>
        <section id="pocetna" className="relative isolate overflow-hidden bg-municipal-warm">
          <div className="absolute inset-x-0 top-0 h-px bg-municipal-gold/50" />
          <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-white to-transparent" />

          <div className="section-shell grid min-h-[560px] items-center gap-10 py-14 sm:min-h-[620px] lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
            <div className="relative z-10 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-municipal-red">
                Совет на Општина Кочани
              </p>
              <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight text-municipal-dark sm:text-5xl lg:text-6xl">
                Претседател на Советот на Општина Кочани
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-municipal-text sm:text-xl">
                Отворена, транспарентна и директна комуникација со граѓаните.
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
            </div>

            <div className="relative z-10 mx-auto w-full max-w-md lg:max-w-none">
              <div className="absolute -left-4 top-8 h-[82%] w-2 rounded-full bg-municipal-gold" />
              <div className="overflow-hidden rounded-lg border border-municipal-line bg-white shadow-official">
                <Image
                  src="/president-placeholder.jpg"
                  alt="Професионална фотографија на Претседателот на Советот"
                  width={945}
                  height={1600}
                  priority
                  className="aspect-[4/5] w-full object-cover object-[center_18%]"
                  sizes="(min-width: 1024px) 42vw, 90vw"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="za-pretsedatelot" className="bg-white py-18 sm:py-24">
          <div className="section-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="section-kicker">За претседателот на Советот</p>
              <h2 className="section-title mt-3">Одговорна врска меѓу Советот и граѓаните.</h2>
            </div>
            <div className="space-y-5 text-lg leading-8 text-municipal-text">
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
        </section>

        <section className="bg-municipal-warm py-18 sm:py-24">
          <div className="section-shell">
            <div className="max-w-3xl">
              <p className="section-kicker">Надлежности на Советот</p>
              <h2 className="section-title mt-3">Советот носи одлуки од јавен интерес за општината.</h2>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {competences.map((competence) => {
                const Icon = competence.icon;
                return (
                  <article key={competence.title} className="rounded-lg border border-municipal-line border-t-4 border-t-municipal-red bg-white p-6 shadow-sm">
                    <div className="flex h-11 w-11 items-center justify-center rounded-md bg-municipal-yellow/20 text-municipal-gold">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-municipal-dark">{competence.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-municipal-text/80">{competence.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white py-18 sm:py-24">
          <div className="section-shell">
            <div className="max-w-3xl">
              <p className="section-kicker">Комуникација со граѓаните</p>
              <h2 className="section-title mt-3">Испратете прашање или пријава преку безбеден образец.</h2>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <section id="prasanje" className="rounded-lg border border-municipal-line border-t-4 border-t-municipal-red bg-white p-6 shadow-official sm:p-8">
                <div className="mb-7">
                  <h3 className="text-2xl font-semibold text-municipal-red">Постави прашање</h3>
                  <p className="mt-2 text-sm leading-6 text-municipal-text/75">
                    Испратете прашање, предлог или иницијатива до Претседателот на Советот.
                  </p>
                </div>
                <QuestionForm />
              </section>

              <section id="problem" className="rounded-lg border border-municipal-line border-t-4 border-t-municipal-red bg-white p-6 shadow-official sm:p-8">
                <div className="mb-7">
                  <h3 className="text-2xl font-semibold text-municipal-red">Пријави проблем</h3>
                  <p className="mt-2 text-sm leading-6 text-municipal-text/75">
                    Пријавете локален проблем со локација и краток опис за понатамошно разгледување.
                  </p>
                </div>
                <ProblemForm />
              </section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
