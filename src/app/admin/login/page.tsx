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
    <main className="grid min-h-screen bg-municipal-warm lg:grid-cols-[0.9fr_1.1fr]">
      <section className="hidden bg-municipal-dark p-10 text-white lg:flex lg:flex-col lg:justify-between">
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
            <p className="font-semibold">Општина Кочани</p>
            <p className="text-sm text-orange-100">Административен пристап</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-municipal-yellow">Совет на Општината</p>
          <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight">
            Управување со прашања и пријави од граѓаните.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-orange-100">
            Пристапот е ограничен на овластени лица. Податоците за најава се читаат само на серверот.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-lg border border-municipal-line border-t-4 border-t-municipal-red bg-white p-6 shadow-official sm:p-8">
          <div className="mb-8">
            <p className="section-kicker">Администрација</p>
            <h2 className="mt-3 text-3xl font-semibold text-municipal-dark">Најава</h2>
            <p className="mt-3 text-sm leading-6 text-municipal-text/75">
              Внесете ги администраторските податоци поставени во локалната конфигурација.
            </p>
          </div>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
