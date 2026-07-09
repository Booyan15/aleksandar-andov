"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createProblemSubmission, type PublicFormState, type PublicFormValues } from "@/app/actions";
import { FormStatusMessage } from "./FormStatusMessage";
import { SubmitButton } from "./SubmitButton";

const initialState: PublicFormState = {
  success: false,
  message: "",
  values: {}
};

type ProblemFormValues = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  category: string;
  message: string;
  consent: boolean;
};

const emptyValues: ProblemFormValues = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  category: "",
  message: "",
  consent: false
};

function problemValuesFrom(values?: PublicFormValues): ProblemFormValues {
  return {
    fullName: values?.fullName ?? "",
    email: values?.email ?? "",
    phone: values?.phone ?? "",
    location: values?.location ?? "",
    category: values?.category ?? "",
    message: values?.message ?? "",
    consent: Boolean(values?.consent)
  };
}

function inputClass(hasError: boolean) {
  return `field-input ${hasError ? "field-input-invalid" : ""}`;
}

export function ProblemForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(createProblemSubmission, initialState);
  const [values, setValues] = useState<ProblemFormValues>(emptyValues);

  useEffect(() => {
    if (state.success) {
      setValues(emptyValues);
      formRef.current?.reset();
      return;
    }

    if (state.values) {
      setValues(problemValuesFrom(state.values));
    }
  }, [state]);

  function setField<Field extends keyof ProblemFormValues>(field: Field, value: ProblemFormValues[Field]) {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value
    }));
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-8" noValidate>
      <FormStatusMessage state={state} />

      <section className="space-y-5">
        <h4 className="form-group-title">Лични податоци</h4>
        <div>
          <label className="field-label" htmlFor="problem-fullName">
            Име и презиме
          </label>
          <input
            id="problem-fullName"
            name="fullName"
            type="text"
            className={inputClass(Boolean(state.errors?.fullName))}
            placeholder="Вашето име и презиме"
            value={values.fullName}
            onChange={(event) => setField("fullName", event.target.value)}
            aria-invalid={Boolean(state.errors?.fullName)}
          />
          {state.errors?.fullName ? <p className="field-error">{state.errors.fullName}</p> : null}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="problem-email">
              Е-пошта
            </label>
            <input
              id="problem-email"
              name="email"
              type="email"
              className={inputClass(Boolean(state.errors?.email))}
              placeholder="ime@primer.mk"
              value={values.email}
              onChange={(event) => setField("email", event.target.value)}
              aria-invalid={Boolean(state.errors?.email)}
            />
            {state.errors?.email ? <p className="field-error">{state.errors.email}</p> : null}
          </div>

          <div>
            <label className="field-label" htmlFor="problem-phone">
              Телефон
            </label>
            <input
              id="problem-phone"
              name="phone"
              type="tel"
              className="field-input"
              placeholder="Незадолжително"
              value={values.phone}
              onChange={(event) => setField("phone", event.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <h4 className="form-group-title">Детали за пријавата</h4>
        <div>
          <label className="field-label" htmlFor="problem-location">
            Локација
          </label>
          <input
            id="problem-location"
            name="location"
            type="text"
            className={inputClass(Boolean(state.errors?.location))}
            placeholder="Улица, населба или опис на локацијата"
            value={values.location}
            onChange={(event) => setField("location", event.target.value)}
            aria-invalid={Boolean(state.errors?.location)}
          />
          {state.errors?.location ? <p className="field-error">{state.errors.location}</p> : null}
        </div>

        <div>
          <label className="field-label" htmlFor="problem-category">
            Категорија
          </label>
          <select
            id="problem-category"
            name="category"
            className={inputClass(Boolean(state.errors?.category))}
            value={values.category}
            onChange={(event) => setField("category", event.target.value)}
            aria-invalid={Boolean(state.errors?.category)}
          >
            <option value="" disabled>
              Изберете категорија
            </option>
            <option value="Комунална инфраструктура">Комунална инфраструктура</option>
            <option value="Јавна чистота">Јавна чистота</option>
            <option value="Сообраќај">Сообраќај</option>
            <option value="Урбанизам">Урбанизам</option>
            <option value="Друго">Друго</option>
          </select>
          {state.errors?.category ? <p className="field-error">{state.errors.category}</p> : null}
        </div>

        <div>
          <label className="field-label" htmlFor="problem-message">
            Опис на проблемот
          </label>
          <textarea
            id="problem-message"
            name="message"
            className={`${inputClass(Boolean(state.errors?.message))} min-h-40 resize-y`}
            placeholder="Опишете го проблемот што треба да се разгледа..."
            value={values.message}
            onChange={(event) => setField("message", event.target.value)}
            aria-invalid={Boolean(state.errors?.message)}
          />
          {state.errors?.message ? <p className="field-error">{state.errors.message}</p> : null}
        </div>
      </section>

      <section className="space-y-5">
        <h4 className="form-group-title">Согласност и испраќање</h4>
        <div>
          <label
            className={`flex items-start gap-3 rounded-lg border bg-municipal-warm p-4 text-sm leading-6 text-municipal-text ${
              state.errors?.consent ? "border-red-500" : "border-municipal-line"
            }`}
          >
            <input
              name="consent"
              type="checkbox"
              className="mt-1 h-5 w-5 rounded border-municipal-line text-municipal-red focus:ring-municipal-red"
              checked={values.consent}
              onChange={(event) => setField("consent", event.target.checked)}
              aria-invalid={Boolean(state.errors?.consent)}
            />
            <span>
              Се согласувам моите податоци да бидат обработени исклучиво за разгледување на оваа пријава.
            </span>
          </label>
          {state.errors?.consent ? <p className="field-error">{state.errors.consent}</p> : null}
        </div>

        <SubmitButton label="Испрати пријава" pendingLabel="Се испраќа..." />
      </section>
    </form>
  );
}
