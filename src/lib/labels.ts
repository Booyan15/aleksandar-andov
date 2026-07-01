import type { SubmissionStatus, SubmissionType } from "@prisma/client";

export const submissionTypeLabels: Record<SubmissionType, string> = {
  QUESTION: "Прашање",
  PROBLEM: "Пријава"
};

export const submissionStatusLabels: Record<SubmissionStatus, string> = {
  NEW: "Ново",
  IN_PROGRESS: "Во обработка",
  RESOLVED: "Решено",
  ARCHIVED: "Архивирано"
};

export const submissionStatusStyles: Record<SubmissionStatus, string> = {
  NEW: "bg-red-50 text-red-800 ring-red-200",
  IN_PROGRESS: "bg-yellow-50 text-yellow-900 ring-yellow-300",
  RESOLVED: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  ARCHIVED: "bg-slate-100 text-slate-700 ring-slate-200"
};

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("mk-MK", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}
