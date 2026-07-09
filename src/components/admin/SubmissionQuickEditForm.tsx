"use client";

import { useActionState } from "react";
import type { SubmissionStatus, SubmissionType } from "@prisma/client";
import { updateSubmissionQuickEdit, type SubmissionEditActionState } from "@/app/admin/actions";
import { submissionStatusLabels, submissionTypeLabels } from "@/lib/labels";

const initialState: SubmissionEditActionState = {
  success: false,
  message: ""
};

const typeOptions: SubmissionType[] = ["QUESTION", "PROBLEM"];
const statusOptions: SubmissionStatus[] = ["NEW", "IN_PROGRESS", "RESOLVED", "ARCHIVED"];

export function SubmissionQuickEditForm({
  id,
  type,
  status
}: {
  id: string;
  type: SubmissionType;
  status: SubmissionStatus;
}) {
  const [state, formAction, pending] = useActionState(updateSubmissionQuickEdit.bind(null, id), initialState);

  return (
    <form action={formAction} className="space-y-2">
      <div className="grid gap-2 xl:grid-cols-2">
        <label className="sr-only" htmlFor={`submission-type-${id}`}>
          Тип
        </label>
        <select
          id={`submission-type-${id}`}
          name="type"
          defaultValue={type}
          className="min-h-10 rounded-md border border-municipal-line bg-white px-3 py-2 text-sm font-semibold text-municipal-dark outline-none transition focus:border-municipal-red focus:ring-4 focus:ring-municipal-red/10"
        >
          {typeOptions.map((option) => (
            <option key={option} value={option}>
              {submissionTypeLabels[option]}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor={`submission-status-${id}`}>
          Статус
        </label>
        <select
          id={`submission-status-${id}`}
          name="status"
          defaultValue={status}
          className="min-h-10 rounded-md border border-municipal-line bg-white px-3 py-2 text-sm font-semibold text-municipal-dark outline-none transition focus:border-municipal-red focus:ring-4 focus:ring-municipal-red/10"
        >
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {submissionStatusLabels[option]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-9 items-center justify-center rounded-md bg-municipal-red px-3 py-2 text-xs font-semibold text-white transition hover:bg-municipal-darkRed disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Се зачувува..." : "Зачувај"}
        </button>
        {state.message ? (
          <p className={`text-xs font-medium ${state.success ? "text-emerald-700" : "text-red-700"}`}>
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
