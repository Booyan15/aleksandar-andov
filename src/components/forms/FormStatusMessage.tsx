import type { PublicFormState } from "@/app/actions";

export function FormStatusMessage({ state }: { state: PublicFormState }) {
  if (!state.message) {
    return null;
  }

  return (
    <div
      className={`rounded-md border px-4 py-3 text-sm font-medium ${
        state.success
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-red-200 bg-red-50 text-red-800"
      }`}
      role="status"
    >
      {state.message}
    </div>
  );
}
