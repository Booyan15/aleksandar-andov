import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { StatusForm } from "@/components/admin/StatusForm";
import { formatDate, submissionTypeLabels } from "@/lib/labels";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

type SubmissionDetailProps = {
  params: Promise<{
    id: string;
  }>;
};

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="border-b border-municipal-line py-4 last:border-b-0">
      <dt className="text-sm font-semibold text-municipal-text/60">{label}</dt>
      <dd className="mt-1 whitespace-pre-wrap text-base text-municipal-text">{value || "Нема податок"}</dd>
    </div>
  );
}

export default async function SubmissionDetailPage({ params }: SubmissionDetailProps) {
  await requireAdmin();

  const { id } = await params;
  const submission = await prisma.submission.findUnique({
    where: { id }
  });

  if (!submission) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-municipal-warm">
      <AdminHeader />
      <main className="section-shell py-10">
        <Link href="/admin/dashboard" className="text-sm font-semibold text-municipal-red transition hover:text-municipal-dark">
          Назад кон преглед
        </Link>

        <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="rounded-lg border border-municipal-line border-t-4 border-t-municipal-red bg-white p-6 shadow-official sm:p-8">
            <div className="flex flex-col gap-4 border-b border-municipal-line pb-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="section-kicker">{submissionTypeLabels[submission.type]}</p>
                <h1 className="mt-3 text-3xl font-semibold text-municipal-dark">
                  {submission.subject || submission.location || "Запис од граѓанин"}
                </h1>
                <p className="mt-3 text-sm text-municipal-text/70">Примено: {formatDate(submission.createdAt)}</p>
              </div>
              <StatusBadge status={submission.status} />
            </div>

            <dl className="mt-3">
              <DetailRow label="Име и презиме" value={submission.fullName} />
              <DetailRow label="Е-пошта" value={submission.email} />
              <DetailRow label="Телефон" value={submission.phone} />
              <DetailRow label="Предмет" value={submission.subject} />
              <DetailRow label="Локација" value={submission.location} />
              <DetailRow label="Категорија" value={submission.category} />
              <DetailRow label="Порака" value={submission.message} />
              {submission.deletedAt ? <DetailRow label="Во корпа од" value={formatDate(submission.deletedAt)} /> : null}
              <DetailRow label="Последна промена" value={formatDate(submission.updatedAt)} />
            </dl>
          </section>

          <aside className="space-y-6">
            <StatusForm id={submission.id} currentStatus={submission.status} />
            <div className="rounded-lg border border-municipal-gold/45 bg-municipal-yellow/15 p-5 text-sm leading-6 text-municipal-text shadow-sm">
              <h2 className="text-base font-semibold text-municipal-dark">Напомена</h2>
              <p className="mt-2">
                Промената на статусот се зачувува во базата и веднаш се прикажува во
                административниот преглед.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
