import Link from "next/link";
import { SubmissionStatus, SubmissionType } from "@prisma/client";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { SubmissionRowActions } from "@/components/admin/SubmissionRowActions";
import { formatDate, submissionStatusLabels, submissionTypeLabels } from "@/lib/labels";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

type DashboardProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const typeFilters: Array<{ value: "ALL" | SubmissionType; label: string }> = [
  { value: "ALL", label: "Сите" },
  { value: "QUESTION", label: "Прашања" },
  { value: "PROBLEM", label: "Пријави" }
];

const statusFilters: Array<{ value: "ALL" | SubmissionStatus; label: string }> = [
  { value: "ALL", label: "Сите статуси" },
  { value: "NEW", label: "Ново" },
  { value: "IN_PROGRESS", label: "Во обработка" },
  { value: "RESOLVED", label: "Решено" },
  { value: "ARCHIVED", label: "Архивирано" }
];

const viewFilters: Array<{ value: DashboardView; label: string }> = [
  { value: "active", label: "Активни" },
  { value: "trash", label: "Корпа" }
];

const noticeMessages: Record<string, string> = {
  trash: "Пријавата е преместена во корпа.",
  restored: "Пријавата е вратена назад.",
  deleted: "Пријавата е трајно избришана."
};

type DashboardView = "active" | "trash";

function getSingle(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function isSubmissionType(value: string | undefined): value is SubmissionType {
  return value === "QUESTION" || value === "PROBLEM";
}

function isSubmissionStatus(value: string | undefined): value is SubmissionStatus {
  return value === "NEW" || value === "IN_PROGRESS" || value === "RESOLVED" || value === "ARCHIVED";
}

function isDashboardView(value: string | undefined): value is DashboardView {
  return value === "active" || value === "trash";
}

function buildFilterHref(type: "ALL" | SubmissionType, status: "ALL" | SubmissionStatus, view: DashboardView) {
  const params = new URLSearchParams();

  if (type !== "ALL") {
    params.set("type", type);
  }

  if (status !== "ALL") {
    params.set("status", status);
  }

  if (view === "trash") {
    params.set("view", view);
  }

  const query = params.toString();
  return query ? `/admin/dashboard?${query}` : "/admin/dashboard";
}

export default async function AdminDashboardPage({ searchParams }: DashboardProps) {
  await requireAdmin();

  const params = (await searchParams) ?? {};
  const selectedType = getSingle(params.type);
  const selectedStatus = getSingle(params.status);
  const selectedView = getSingle(params.view);
  const selectedNotice = getSingle(params.notice);
  const type = isSubmissionType(selectedType) ? selectedType : "ALL";
  const status = isSubmissionStatus(selectedStatus) ? selectedStatus : "ALL";
  const view = isDashboardView(selectedView) ? selectedView : "active";
  const noticeMessage = selectedNotice ? noticeMessages[selectedNotice] : undefined;

  const submissions = await prisma.submission.findMany({
    where: {
      deletedAt: view === "trash" ? { not: null } : null,
      ...(type !== "ALL" ? { type } : {}),
      ...(status !== "ALL" ? { status } : {})
    },
    orderBy:
      view === "trash"
        ? [
            {
              deletedAt: "desc"
            },
            {
              createdAt: "desc"
            }
          ]
        : {
            createdAt: "desc"
          }
  });

  return (
    <div className="min-h-screen bg-municipal-warm">
      <AdminHeader />
      <main className="section-shell py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-kicker">Административен панел</p>
            <h1 className="mt-3 text-3xl font-semibold text-municipal-dark sm:text-4xl">Пристигнати записи</h1>
            <p className="mt-3 text-sm text-municipal-text/75">
              Преглед, филтрирање и обработка на активни записи и записи во корпа.
            </p>
          </div>
          <div className="rounded-md border border-municipal-line bg-white px-4 py-3 text-sm font-semibold text-municipal-dark shadow-sm">
            Вкупно: {submissions.length}
          </div>
        </div>

        {noticeMessage ? (
          <div
            className="mt-6 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800"
            role="status"
          >
            {noticeMessage}
          </div>
        ) : null}

        <section className="mt-8 grid gap-4 rounded-lg border border-municipal-line border-t-4 border-t-municipal-red bg-white p-4 shadow-sm xl:grid-cols-[0.8fr_1fr_1fr]">
          <div>
            <p className="mb-3 text-sm font-semibold text-municipal-dark">Приказ</p>
            <div className="flex flex-wrap gap-2">
              {viewFilters.map((filter) => (
                <Link
                  key={filter.value}
                  href={buildFilterHref(type, status, filter.value)}
                  className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                    view === filter.value
                      ? "bg-municipal-yellow text-municipal-dark ring-1 ring-municipal-gold"
                      : "bg-municipal-warm text-municipal-text hover:bg-orange-100"
                  }`}
                >
                  {filter.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-municipal-dark">Тип</p>
            <div className="flex flex-wrap gap-2">
              {typeFilters.map((filter) => (
                <Link
                  key={filter.value}
                  href={buildFilterHref(filter.value, status, view)}
                  className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                    type === filter.value
                      ? "bg-municipal-yellow text-municipal-dark ring-1 ring-municipal-gold"
                      : "bg-municipal-warm text-municipal-text hover:bg-orange-100"
                  }`}
                >
                  {filter.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-municipal-dark">Статус</p>
            <div className="flex flex-wrap gap-2">
              {statusFilters.map((filter) => (
                <Link
                  key={filter.value}
                  href={buildFilterHref(type, filter.value, view)}
                  className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                    status === filter.value
                      ? "bg-municipal-yellow text-municipal-dark ring-1 ring-municipal-gold"
                      : "bg-municipal-warm text-municipal-text hover:bg-orange-100"
                  }`}
                >
                  {filter.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-lg border border-municipal-line bg-white shadow-official">
          <div className="hidden overflow-x-auto lg:block">
            <table className="min-w-full divide-y divide-municipal-line">
              <thead className="bg-municipal-warm">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.08em] text-municipal-text/70">
                    Датум
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.08em] text-municipal-text/70">
                    Тип
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.08em] text-municipal-text/70">
                    Име и презиме
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.08em] text-municipal-text/70">
                    Предмет/локација
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.08em] text-municipal-text/70">
                    Статус
                  </th>
                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-[0.08em] text-municipal-text/70">
                    Акции
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-municipal-line">
                {submissions.map((submission) => (
                  <tr key={submission.id} className="transition hover:bg-municipal-warm/70">
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-municipal-text/70">
                      {formatDate(submission.createdAt)}
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-municipal-dark">
                      {submissionTypeLabels[submission.type]}
                    </td>
                    <td className="px-5 py-4 text-sm text-municipal-text">{submission.fullName}</td>
                    <td className="max-w-xs truncate px-5 py-4 text-sm text-municipal-text">
                      {submission.subject || submission.location || "Нема податок"}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={submission.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <SubmissionRowActions id={submission.id} mode={view} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-municipal-line lg:hidden">
            {submissions.map((submission) => (
              <article key={submission.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-municipal-dark">{submission.fullName}</p>
                    <p className="mt-1 text-xs text-municipal-text/60">{formatDate(submission.createdAt)}</p>
                  </div>
                  <StatusBadge status={submission.status} />
                </div>
                <p className="mt-4 text-sm font-semibold text-municipal-red">{submissionTypeLabels[submission.type]}</p>
                <p className="mt-1 text-sm text-municipal-text">{submission.subject || submission.location || "Нема податок"}</p>
                <div className="mt-4">
                  <SubmissionRowActions id={submission.id} mode={view} />
                </div>
              </article>
            ))}
          </div>

          {submissions.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-municipal-text/70">
              {view === "trash" ? "Корпата е празна." : "Нема записи што одговараат на избраните филтри."}
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}
