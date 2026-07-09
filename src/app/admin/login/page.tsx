import Image from "next/image";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { getCurrentAdmin } from "@/lib/auth";

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();

  if (admin) {
    redirect("/admin/dashboard");
  }

  return (
    <main className="min-h-screen bg-municipal-warm">
      <div className="section-shell grid min-h-screen items-center gap-8 py-10 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="hidden rounded-lg border border-municipal-line bg-white p-8 shadow-card lg:flex lg:min-h-[560px] lg:flex-col lg:justify-between">
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
              <p className="font-semibold text-municipal-dark">Општина Кочани</p>
              <p className="text-sm text-municipal-muted">Административен пристап</p>
            </div>
          </div>

          <div>
            <div className="gold-detail mb-5" />
            <p className="section-kicker">Совет на Општината</p>
            <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight text-municipal-dark">
              Управување со прашања и пријави од граѓаните.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-municipal-muted">
              Пристапот е ограничен на овластени лица. Податоците за најава се читаат само на серверот.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-municipal-line bg-municipal-warm p-4 text-sm font-semibold text-municipal-dark">
              <div className="mb-3 h-1 w-8 rounded-full bg-municipal-red" />
              Преглед
            </div>
            <div className="rounded-lg border border-municipal-line bg-municipal-warm p-4 text-sm font-semibold text-municipal-dark">
              <div className="mb-3 h-1 w-8 rounded-full bg-municipal-gold" />
              Обработка
            </div>
            <div className="rounded-lg border border-municipal-line bg-municipal-warm p-4 text-sm font-semibold text-municipal-dark">
              <div className="mb-3 h-1 w-8 rounded-full bg-municipal-red" />
              Архива
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <div className="w-full max-w-md rounded-lg border border-municipal-line bg-white p-6 shadow-official sm:p-8">
            <div className="mb-7 h-px w-full bg-municipal-line">
              <div className="h-px w-20 bg-municipal-gold" />
            </div>
            <div className="mb-8">
              <p className="section-kicker">Администрација</p>
              <h2 className="mt-3 text-3xl font-semibold text-municipal-dark">Најава</h2>
              <p className="mt-3 text-sm leading-6 text-municipal-muted">
                Внесете ги администраторските податоци поставени во локалната конфигурација.
              </p>
            </div>
            <LoginForm />
          </div>
        </section>
      </div>
    </main>
  );
}
