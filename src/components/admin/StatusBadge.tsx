import type { SubmissionStatus } from "@prisma/client";
import { submissionStatusLabels, submissionStatusStyles } from "@/lib/labels";

export function StatusBadge({ status }: { status: SubmissionStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${submissionStatusStyles[status]}`}
    >
      {submissionStatusLabels[status]}
    </span>
  );
}
