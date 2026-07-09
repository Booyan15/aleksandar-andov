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
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800" role="status">
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
          className={`field-input ${state.fieldErrors?.email ? "field-input-invalid" : ""}`}
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
          className={`field-input ${state.fieldErrors?.password ? "field-input-invalid" : ""}`}
          placeholder="Внесете лозинка"
          aria-invalid={Boolean(state.fieldErrors?.password)}
        />
        {state.fieldErrors?.password ? <p className="field-error">{state.fieldErrors.password}</p> : null}
      </div>

      <button
        type="submit"
        className="primary-button w-full"
        disabled={pending}
      >
        {pending ? "Се најавувате..." : "Најави се"}
      </button>
    </form>
  );
}
