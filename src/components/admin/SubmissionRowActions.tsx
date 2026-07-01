"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { useFormStatus } from "react-dom";
import { ExternalLink, RotateCcw, Trash2, X } from "lucide-react";
import {
  moveToTrash,
  permanentlyDeleteSubmission,
  restoreSubmission
} from "@/app/admin/actions";

type SubmissionRowActionsProps = {
  id: string;
  mode: "active" | "trash";
};

function ConfirmSubmitButton({
  label,
  pendingLabel,
  destructive = false
}: {
  label: string;
  pendingLabel: string;
  destructive?: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex min-h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
        destructive ? "bg-red-700 hover:bg-red-800" : "bg-municipal-dark hover:bg-municipal-red"
      }`}
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

function ConfirmActionButton({
  action,
  triggerLabel,
  title,
  message,
  confirmLabel,
  pendingLabel,
  destructive
}: {
  action: () => Promise<void>;
  triggerLabel: string;
  title: string;
  message: string;
  confirmLabel: string;
  pendingLabel: string;
  destructive: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition ${
          destructive
            ? "border border-red-200 bg-red-50 text-red-800 hover:bg-red-100"
            : "border border-municipal-line bg-white text-municipal-text hover:bg-municipal-warm"
        }`}
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
        {triggerLabel}
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="w-full max-w-md rounded-lg border border-municipal-line bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id={titleId} className="text-lg font-semibold text-municipal-dark">
                  {title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-municipal-text/80">{message}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-md p-2 text-municipal-text/60 transition hover:bg-municipal-warm hover:text-municipal-text"
                aria-label="Затвори"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <form action={action} className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex min-h-10 items-center justify-center rounded-md border border-municipal-line bg-white px-4 py-2 text-sm font-semibold text-municipal-text transition hover:bg-municipal-warm"
              >
                Откажи
              </button>
              <ConfirmSubmitButton
                label={confirmLabel}
                pendingLabel={pendingLabel}
                destructive={destructive}
              />
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

function RestoreButton({ id }: { id: string }) {
  return (
    <form action={restoreSubmission.bind(null, id)}>
      <button
        type="submit"
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-municipal-yellow px-4 py-2 text-sm font-semibold text-municipal-dark transition hover:bg-municipal-gold"
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        Врати назад
      </button>
    </form>
  );
}

export function SubmissionRowActions({ id, mode }: SubmissionRowActionsProps) {
  if (mode === "trash") {
    return (
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <RestoreButton id={id} />
        <ConfirmActionButton
          action={permanentlyDeleteSubmission.bind(null, id)}
          triggerLabel="Избриши трајно"
          title="Трајно бришење"
          message="Дали сте сигурни дека сакате трајно да ја избришете оваа пријава? Ова дејство не може да се врати."
          confirmLabel="Избриши трајно"
          pendingLabel="Се брише..."
          destructive
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
      <Link
        href={`/admin/submissions/${id}`}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-municipal-line bg-white px-4 py-2 text-sm font-semibold text-municipal-text transition hover:bg-municipal-warm"
      >
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
        Отвори
      </Link>
      <ConfirmActionButton
        action={moveToTrash.bind(null, id)}
        triggerLabel="Во корпа"
        title="Преместување во корпа"
        message="Дали сакате да ја преместите оваа пријава во корпа?"
        confirmLabel="Во корпа"
        pendingLabel="Се преместува..."
        destructive
      />
    </div>
  );
}
