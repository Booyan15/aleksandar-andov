import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SubmissionDeleteButton } from "@/components/admin/SubmissionDeleteButton";
import { SubmissionDetailForm } from "@/components/admin/SubmissionDetailForm";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { submissionIdSchema } from "@/lib/validation";

type SubmissionDetailProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SubmissionDetailPage({ params }: SubmissionDetailProps) {
  await requireAdmin();

  const { id } = await params;
  const parsedId = submissionIdSchema.safeParse(id);

  if (!parsedId.success) {
    notFound();
  }

  const submission = await prisma.submission.findUnique({
    where: { id: parsedId.data }
  });

  if (!submission) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-municipal-warm">
      <AdminHeader />
      <main className="section-shell py-10 sm:py-12">
        <Link
          href="/admin/dashboard"
          className="inline-flex min-h-10 items-center gap-2 rounded-md border border-municipal-line bg-white px-3 py-2 text-sm font-semibold text-municipal-red shadow-sm transition hover:bg-municipal-warm hover:text-municipal-darkRed"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Назад кон преглед
        </Link>

        <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_360px]">
          <SubmissionDetailForm submission={submission} />

          <aside className="space-y-6">
            <div className="rounded-lg border border-municipal-line bg-white p-5 text-sm leading-6 text-municipal-muted shadow-card">
              <div className="mb-4 h-1 w-10 rounded-full bg-municipal-gold" />
              <h2 className="text-base font-semibold text-municipal-dark">Напомена</h2>
              <p className="mt-2">
                Промените се зачувуваат во базата и веднаш се прикажуваат во административниот преглед.
              </p>
            </div>
            <div className="rounded-lg border border-red-200 bg-white p-5 text-sm leading-6 text-municipal-muted shadow-card">
              <h2 className="text-base font-semibold text-red-800">Бришење</h2>
              <p className="mt-2">
                Бришењето трајно го отстранува записот од базата.
              </p>
              <div className="mt-4">
                <SubmissionDeleteButton id={submission.id} />
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
