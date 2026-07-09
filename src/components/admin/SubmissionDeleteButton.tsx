"use client";

import { useId, useState } from "react";
import { useFormStatus } from "react-dom";
import { Trash2, X } from "lucide-react";
import { deleteSubmission } from "@/app/admin/actions";

function DeleteSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-10 items-center justify-center rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Се брише..." : "Избриши"}
    </button>
  );
}

export function SubmissionDeleteButton({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-800 transition hover:bg-red-100"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
        Избриши
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="w-full max-w-md rounded-lg border border-municipal-line bg-white p-6 shadow-official"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id={titleId} className="text-lg font-semibold text-municipal-dark">
                  Бришење на пријава
                </h2>
                <p className="mt-3 text-sm leading-6 text-municipal-muted">
                  Дали сте сигурни дека сакате да ја избришете оваа пријава? Ова дејство не може да се врати.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-md p-2 text-municipal-muted transition hover:bg-municipal-warm hover:text-municipal-text"
                aria-label="Затвори"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <form action={deleteSubmission.bind(null, id)} className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex min-h-10 items-center justify-center rounded-md border border-municipal-line bg-white px-4 py-2 text-sm font-semibold text-municipal-text transition hover:bg-municipal-warm hover:text-municipal-red"
              >
                Откажи
              </button>
              <DeleteSubmitButton />
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
