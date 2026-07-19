"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createQuestionSubmission, type PublicFormState, type PublicFormValues } from "@/app/actions";
import { HONEYPOT_FIELD_NAME } from "@/lib/form-security";
import { FormStatusMessage } from "./FormStatusMessage";
import { SubmitButton } from "./SubmitButton";

const initialState: PublicFormState = {
  success: false,
  message: "",
  values: {}
};

type QuestionFormValues = {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  consent: boolean;
};

const emptyValues: QuestionFormValues = {
  fullName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  consent: false
};

function questionValuesFrom(values?: PublicFormValues): QuestionFormValues {
  return {
    fullName: values?.fullName ?? "",
    email: values?.email ?? "",
    phone: values?.phone ?? "",
    subject: values?.subject ?? "",
    message: values?.message ?? "",
    consent: Boolean(values?.consent)
  };
}

function inputClass(hasError: boolean) {
  return `field-input ${hasError ? "field-input-invalid" : ""}`;
}

export function QuestionForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(createQuestionSubmission, initialState);
  const [values, setValues] = useState<QuestionFormValues>(emptyValues);

  useEffect(() => {
    if (state.success) {
      setValues(emptyValues);
      formRef.current?.reset();
      return;
    }

    if (state.values) {
      setValues(questionValuesFrom(state.values));
    }
  }, [state]);

  function setField<Field extends keyof QuestionFormValues>(field: Field, value: QuestionFormValues[Field]) {
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
          <label className="field-label" htmlFor="question-fullName">
            Име и презиме
          </label>
          <input
            id="question-fullName"
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
            <label className="field-label" htmlFor="question-email">
              Е-пошта
            </label>
            <input
              id="question-email"
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
            <label className="field-label" htmlFor="question-phone">
              Телефон
            </label>
            <input
              id="question-phone"
              name="phone"
              type="tel"
              className={inputClass(Boolean(state.errors?.phone))}
              placeholder="Незадолжително"
              value={values.phone}
              onChange={(event) => setField("phone", event.target.value)}
              aria-invalid={Boolean(state.errors?.phone)}
            />
            {state.errors?.phone ? <p className="field-error">{state.errors.phone}</p> : null}
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <h4 className="form-group-title">Детали за прашањето</h4>
        <div>
          <label className="field-label" htmlFor="question-subject">
            Наслов
          </label>
          <input
            id="question-subject"
            name="subject"
            type="text"
            className={inputClass(Boolean(state.errors?.subject))}
            placeholder="Краток наслов на прашањето"
            value={values.subject}
            onChange={(event) => setField("subject", event.target.value)}
            aria-invalid={Boolean(state.errors?.subject)}
          />
          {state.errors?.subject ? <p className="field-error">{state.errors.subject}</p> : null}
        </div>

        <div>
          <label className="field-label" htmlFor="question-message">
            Порака
          </label>
          <textarea
            id="question-message"
            name="message"
            className={`${inputClass(Boolean(state.errors?.message))} min-h-40 resize-y`}
            placeholder="Напишете го вашето прашање..."
            value={values.message}
            onChange={(event) => setField("message", event.target.value)}
            aria-invalid={Boolean(state.errors?.message)}
          />
          {state.errors?.message ? <p className="field-error">{state.errors.message}</p> : null}
        </div>
      </section>

      <section className="space-y-5">
        <h4 className="form-group-title">Согласност и испраќање</h4>
        <div className="hidden" aria-hidden="true">
          <label htmlFor="question-website">Веб-страница</label>
          <input id="question-website" name={HONEYPOT_FIELD_NAME} type="text" tabIndex={-1} autoComplete="off" />
        </div>

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
              Се согласувам моите податоци да бидат обработени исклучиво за одговор на ова прашање.
            </span>
          </label>
          {state.errors?.consent ? <p className="field-error">{state.errors.consent}</p> : null}
        </div>

        <SubmitButton label="Испрати прашање" pendingLabel="Се испраќа..." />
      </section>
    </form>
  );
}
