"use client";

import { useActionState } from "react";
import type { Submission, SubmissionStatus, SubmissionType } from "@prisma/client";
import { updateSubmissionDetails, type SubmissionEditActionState } from "@/app/admin/actions";
import { formatDate, submissionStatusLabels, submissionTypeLabels } from "@/lib/labels";

const initialState: SubmissionEditActionState = {
  success: false,
  message: ""
};

const typeOptions: SubmissionType[] = ["QUESTION", "PROBLEM"];
const statusOptions: SubmissionStatus[] = ["NEW", "IN_PROGRESS", "RESOLVED", "ARCHIVED"];

function dateTimeLocalValue(date: Date) {
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="field-error">{message}</p> : null;
}

export function SubmissionDetailForm({ submission }: { submission: Submission }) {
  const [state, formAction, pending] = useActionState(updateSubmissionDetails.bind(null, submission.id), initialState);

  return (
    <form action={formAction} className="official-card p-6 sm:p-8" noValidate>
      <div className="mb-6 h-px w-full bg-municipal-line">
        <div className="h-px w-20 bg-municipal-gold" />
      </div>

      <div className="border-b border-municipal-line pb-6">
        <p className="section-kicker">{submissionTypeLabels[submission.type]}</p>
        <h1 className="mt-3 text-3xl font-semibold text-municipal-dark">
          {submission.subject || submission.location || "Запис од граѓанин"}
        </h1>
        <p className="mt-3 text-sm text-municipal-muted">Примено: {formatDate(submission.createdAt)}</p>
      </div>

      {state.message ? (
        <div
          className={`mt-6 rounded-lg border px-4 py-3 text-sm font-semibold ${
            state.success
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
          role="status"
        >
          {state.message}
        </div>
      ) : null}

      <div className="mt-8 space-y-8">
        <section>
          <h2 className="text-base font-semibold text-municipal-dark">Основни податоци</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="detail-type">
                Тип
              </label>
              <select id="detail-type" name="type" defaultValue={submission.type} className="field-input">
                {typeOptions.map((option) => (
                  <option key={option} value={option}>
                    {submissionTypeLabels[option]}
                  </option>
                ))}
              </select>
              <FieldError message={state.fieldErrors?.type} />
            </div>

            <div>
              <label className="field-label" htmlFor="detail-status">
                Статус
              </label>
              <select id="detail-status" name="status" defaultValue={submission.status} className="field-input">
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {submissionStatusLabels[option]}
                  </option>
                ))}
              </select>
              <FieldError message={state.fieldErrors?.status} />
            </div>

            <div>
              <label className="field-label" htmlFor="detail-createdAt">
                Датум на поднесување
              </label>
              <input
                id="detail-createdAt"
                name="createdAt"
                type="datetime-local"
                defaultValue={dateTimeLocalValue(submission.createdAt)}
                className="field-input"
              />
              <FieldError message={state.fieldErrors?.createdAt} />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-municipal-dark">Податоци за граѓанинот</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="detail-fullName">
                Име и презиме
              </label>
              <input id="detail-fullName" name="fullName" type="text" defaultValue={submission.fullName} className="field-input" />
              <FieldError message={state.fieldErrors?.fullName} />
            </div>

            <div>
              <label className="field-label" htmlFor="detail-email">
                Е-пошта
              </label>
              <input id="detail-email" name="email" type="email" defaultValue={submission.email} className="field-input" />
              <FieldError message={state.fieldErrors?.email} />
            </div>

            <div>
              <label className="field-label" htmlFor="detail-phone">
                Телефон
              </label>
              <input id="detail-phone" name="phone" type="tel" defaultValue={submission.phone ?? ""} className="field-input" />
              <FieldError message={state.fieldErrors?.phone} />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-municipal-dark">Содржина на записот</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="detail-subject">
                Наслов
              </label>
              <input id="detail-subject" name="subject" type="text" defaultValue={submission.subject ?? ""} className="field-input" />
              <FieldError message={state.fieldErrors?.subject} />
            </div>

            <div>
              <label className="field-label" htmlFor="detail-location">
                Локација
              </label>
              <input id="detail-location" name="location" type="text" defaultValue={submission.location ?? ""} className="field-input" />
              <FieldError message={state.fieldErrors?.location} />
            </div>

            <div>
              <label className="field-label" htmlFor="detail-category">
                Категорија
              </label>
              <input id="detail-category" name="category" type="text" defaultValue={submission.category ?? ""} className="field-input" />
              <FieldError message={state.fieldErrors?.category} />
            </div>

            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="detail-message">
                Порака
              </label>
              <textarea
                id="detail-message"
                name="message"
                defaultValue={submission.message}
                className="field-input min-h-44 resize-y"
              />
              <FieldError message={state.fieldErrors?.message} />
            </div>
          </div>
        </section>
      </div>

      <div className="mt-8 flex flex-col gap-3 border-t border-municipal-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-municipal-muted">Последна промена: {formatDate(submission.updatedAt)}</p>
        <button type="submit" className="primary-button" disabled={pending}>
          {pending ? "Се зачувува..." : "Зачувај промени"}
        </button>
      </div>
    </form>
  );
}
