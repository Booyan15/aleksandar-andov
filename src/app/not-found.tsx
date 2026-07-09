import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-municipal-warm px-4">
      <div className="max-w-lg rounded-lg border border-municipal-line bg-white p-8 text-center shadow-official">
        <div className="mx-auto mb-6 h-px w-24 bg-municipal-gold" />
        <p className="section-kicker">Страницата не е пронајдена</p>
        <h1 className="mt-3 text-3xl font-semibold text-municipal-dark">Бараната содржина не постои.</h1>
        <p className="mt-4 text-municipal-muted">
          Проверете ја адресата или вратете се на почетната страница.
        </p>
        <Link href="/" className="primary-button mt-6">
          Кон почетна
        </Link>
      </div>
    </main>
  );
}
