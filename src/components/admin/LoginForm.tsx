"use client";

import { useActionState } from "react";
import { loginAdmin, type LoginActionState } from "@/app/admin/actions";

const initialState: LoginActionState = {
  success: false,
  message: ""
};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAdmin, initialState);

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {state.message ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800" role="status">
          {state.message}
        </div>
      ) : null}

      <div>
        <label htmlFor="admin-email" className="field-label">
          Е-пошта
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="email"
          className="field-input"
          placeholder="admin@kocani.gov.mk"
          aria-invalid={Boolean(state.fieldErrors?.email)}
        />
        {state.fieldErrors?.email ? <p className="field-error">{state.fieldErrors.email}</p> : null}
      </div>

      <div>
        <label htmlFor="admin-password" className="field-label">
          Лозинка
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="field-input"
          placeholder="Внесете лозинка"
          aria-invalid={Boolean(state.fieldErrors?.password)}
        />
        {state.fieldErrors?.password ? <p className="field-error">{state.fieldErrors.password}</p> : null}
      </div>

      <button
        type="submit"
        className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-municipal-yellow px-5 py-3 text-sm font-semibold text-municipal-dark shadow-sm transition hover:bg-municipal-gold focus:outline-none focus:ring-4 focus:ring-municipal-gold/30 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={pending}
      >
        {pending ? "Се најавувате..." : "Најави се"}
      </button>
    </form>
  );
}
