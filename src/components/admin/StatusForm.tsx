"use client";

import type { SubmissionStatus } from "@prisma/client";
import { useActionState } from "react";
import { updateSubmissionStatus, type StatusActionState } from "@/app/admin/actions";
import { submissionStatusLabels } from "@/lib/labels";

const initialState: StatusActionState = {
  success: false,
  message: ""
};

const statuses: SubmissionStatus[] = ["NEW", "IN_PROGRESS", "RESOLVED", "ARCHIVED"];

export function StatusForm({ id, currentStatus }: { id: string; currentStatus: SubmissionStatus }) {
  const [state, formAction, pending] = useActionState(updateSubmissionStatus.bind(null, id), initialState);

  return (
    <form action={formAction} className="rounded-lg border border-municipal-line border-t-4 border-t-municipal-red bg-white p-5 shadow-sm">
      <label htmlFor="submission-status" className="field-label">
        Статус на записот
      </label>
      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
        <select id="submission-status" name="status" className="field-input mt-0" defaultValue={currentStatus}>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {submissionStatusLabels[status]}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-municipal-yellow px-5 py-3 text-sm font-semibold text-municipal-dark shadow-sm transition hover:bg-municipal-gold focus:outline-none focus:ring-4 focus:ring-municipal-gold/30 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={pending}
        >
          {pending ? "Се зачувува..." : "Зачувај статус"}
        </button>
      </div>
      {state.message ? (
        <p className={`mt-3 text-sm font-medium ${state.success ? "text-emerald-700" : "text-red-700"}`}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
