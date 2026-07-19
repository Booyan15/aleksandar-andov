import Link from "next/link";
import { SubmissionStatus, SubmissionType } from "@prisma/client";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SubmissionDeleteButton } from "@/components/admin/SubmissionDeleteButton";
import { SubmissionQuickEditForm } from "@/components/admin/SubmissionQuickEditForm";
import { SubmissionSmsReplyLink } from "@/components/admin/SubmissionSmsReplyLink";
import { formatDate, submissionStatusLabels, submissionTypeLabels } from "@/lib/labels";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

type DashboardProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const typeFilters: Array<{ value: "ALL" | SubmissionType; label: string }> = [
  { value: "ALL", label: "Сите" },
  { value: "QUESTION", label: "Прашања" },
  { value: "PROBLEM", label: "Пријави на проблем" }
];

const statusFilters: Array<{ value: "ALL" | SubmissionStatus; label: string }> = [
  { value: "ALL", label: "Сите статуси" },
  { value: "NEW", label: "Ново" },
  { value: "IN_PROGRESS", label: "Во обработка" },
  { value: "RESOLVED", label: "Решено" },
  { value: "ARCHIVED", label: "Архивирано" }
];

const noticeMessages: Record<string, string> = {
  deleted: "Пријавата е успешно избришана."
};

function getSingle(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function isSubmissionType(value: string | undefined): value is SubmissionType {
  return value === "QUESTION" || value === "PROBLEM";
}

function isSubmissionStatus(value: string | undefined): value is SubmissionStatus {
  return value === "NEW" || value === "IN_PROGRESS" || value === "RESOLVED" || value === "ARCHIVED";
}

function buildFilterHref(type: "ALL" | SubmissionType, status: "ALL" | SubmissionStatus) {
  const params = new URLSearchParams();

  if (type !== "ALL") {
    params.set("type", type);
  }

  if (status !== "ALL") {
    params.set("status", status);
  }

  const query = params.toString();
  return query ? `/admin/dashboard?${query}` : "/admin/dashboard";
}

export default async function AdminDashboardPage({ searchParams }: DashboardProps) {
  await requireAdmin();

  const params = (await searchParams) ?? {};
  const selectedType = getSingle(params.type);
  const selectedStatus = getSingle(params.status);
  const selectedNotice = getSingle(params.notice);
  const type = isSubmissionType(selectedType) ? selectedType : "ALL";
  const status = isSubmissionStatus(selectedStatus) ? selectedStatus : "ALL";
  const noticeMessage = selectedNotice ? noticeMessages[selectedNotice] : undefined;

  const submissions = await prisma.submission.findMany({
    where: {
      ...(type !== "ALL" ? { type } : {}),
      ...(status !== "ALL" ? { status } : {})
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <div className="min-h-screen bg-municipal-warm">
      <AdminHeader />
      <main className="section-shell py-10 sm:py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="gold-detail mb-5" />
            <p className="section-kicker">Административен панел</p>
            <h1 className="mt-3 text-3xl font-semibold text-municipal-dark sm:text-4xl">Пристигнати записи</h1>
            <p className="mt-3 text-sm text-municipal-muted">
              Преглед, филтрирање и обработка на прашања и пријави од граѓаните.
            </p>
          </div>
          <div className="rounded-lg border border-municipal-line bg-white px-4 py-3 text-sm font-semibold text-municipal-dark shadow-sm">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-municipal-gold" aria-hidden="true" />
            Вкупно: {submissions.length}
          </div>
        </div>

        {noticeMessage ? (
          <div
            className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800"
            role="status"
          >
            {noticeMessage}
          </div>
        ) : null}

        <section className="official-card mt-8 grid gap-5 p-4 sm:p-5 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-semibold text-municipal-dark">Тип</p>
            <div className="flex flex-wrap gap-2">
              {typeFilters.map((filter) => (
                <Link
                  key={filter.value}
                  href={buildFilterHref(filter.value, status)}
                  className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                    type === filter.value
                      ? "bg-red-50 text-municipal-red ring-1 ring-red-100"
                      : "bg-municipal-warm text-municipal-text hover:bg-white hover:text-municipal-red hover:ring-1 hover:ring-municipal-line"
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
                  href={buildFilterHref(type, filter.value)}
                  className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                    status === filter.value
                      ? "bg-red-50 text-municipal-red ring-1 ring-red-100"
                      : "bg-municipal-warm text-municipal-text hover:bg-white hover:text-municipal-red hover:ring-1 hover:ring-municipal-line"
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
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-normal text-municipal-muted">
                    Датум
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-normal text-municipal-muted">
                    Тип и статус
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-normal text-municipal-muted">
                    Име и презиме
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-normal text-municipal-muted">
                    Предмет/локација
                  </th>
                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-normal text-municipal-muted">
                    Акции
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-municipal-line">
                {submissions.map((submission) => (
                  <tr key={submission.id} className="transition hover:bg-municipal-warm">
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-municipal-muted">
                      {formatDate(submission.createdAt)}
                    </td>
                    <td className="min-w-[320px] px-5 py-4">
                      <SubmissionQuickEditForm id={submission.id} type={submission.type} status={submission.status} />
                    </td>
                    <td className="px-5 py-4 text-sm text-municipal-text">{submission.fullName}</td>
                    <td className="max-w-xs truncate px-5 py-4 text-sm text-municipal-text">
                      {submission.subject || submission.location || "Нема податок"}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                        <Link
                          href={`/admin/submissions/${submission.id}`}
                          className="inline-flex min-h-10 items-center justify-center rounded-md border border-municipal-line bg-white px-4 py-2 text-sm font-semibold text-municipal-text transition hover:bg-municipal-warm hover:text-municipal-red"
                        >
                          Отвори
                        </Link>
                        <SubmissionSmsReplyLink submission={submission} />
                        <SubmissionDeleteButton id={submission.id} />
                      </div>
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
                    <p className="mt-1 text-xs text-municipal-muted">{formatDate(submission.createdAt)}</p>
                  </div>
                  <p className="text-right text-xs font-semibold text-municipal-red">{submissionStatusLabels[submission.status]}</p>
                </div>
                <p className="mt-4 text-sm font-semibold text-municipal-red">{submissionTypeLabels[submission.type]}</p>
                <p className="mt-1 text-sm text-municipal-text">{submission.subject || submission.location || "Нема податок"}</p>
                <div className="mt-4 rounded-lg border border-municipal-line bg-municipal-warm p-3">
                  <SubmissionQuickEditForm id={submission.id} type={submission.type} status={submission.status} />
                </div>
                <div className="mt-4">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Link
                      href={`/admin/submissions/${submission.id}`}
                      className="inline-flex min-h-10 items-center justify-center rounded-md border border-municipal-line bg-white px-4 py-2 text-sm font-semibold text-municipal-text transition hover:bg-municipal-warm hover:text-municipal-red"
                    >
                      Отвори
                    </Link>
                    <SubmissionSmsReplyLink submission={submission} />
                    <SubmissionDeleteButton id={submission.id} />
                  </div>
                </div>
              </article>
            ))}
          </div>

          {submissions.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-municipal-muted">
              Нема записи што одговараат на избраните филтри.
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}
