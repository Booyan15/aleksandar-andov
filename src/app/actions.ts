"use server";

import { SubmissionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  assertTrustedRequestOrigin,
  honeypotFieldWasFilled,
  rateLimitCurrentRequest
} from "@/lib/request-security";
import { problemSchema, questionSchema } from "@/lib/validation";
import type { ZodError } from "zod";

export type PublicFormState = {
  success: boolean;
  message: string;
  errors?: PublicFormErrors;
  values?: PublicFormValues;
};

export type PublicFormValues = {
  fullName?: string;
  email?: string;
  phone?: string;
  subject?: string;
  location?: string;
  category?: string;
  message?: string;
  consent?: boolean;
};

export type PublicFormErrors = Partial<Record<keyof PublicFormValues, string>>;

const initialErrorState: PublicFormState = {
  success: false,
  message: "",
  values: {}
};

const PUBLIC_SUBMISSION_RATE_LIMIT = {
  limit: 5,
  windowMs: 10 * 60 * 1000
};

const rateLimitedState: PublicFormState = {
  success: false,
  message: "Испраќањето е привремено ограничено. Обидете се повторно подоцна.",
  values: {}
};

function formDataToObject(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

function fieldErrorsFrom(error: ZodError): PublicFormErrors {
  const { fieldErrors } = error.flatten();
  return Object.fromEntries(
    Object.entries(fieldErrors).map(([key, messages]) => [key, messages?.[0]])
  ) as PublicFormErrors;
}

function stringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function submittedValuesFrom(formData: FormData): PublicFormValues {
  return {
    fullName: stringValue(formData, "fullName"),
    email: stringValue(formData, "email"),
    phone: stringValue(formData, "phone"),
    subject: stringValue(formData, "subject"),
    location: stringValue(formData, "location"),
    category: stringValue(formData, "category"),
    message: stringValue(formData, "message"),
    consent: formData.get("consent") === "on"
  };
}

async function requestIsAllowed(kind: "question" | "problem") {
  const result = await rateLimitCurrentRequest({
    namespace: `public-submission:${kind}`,
    limit: PUBLIC_SUBMISSION_RATE_LIMIT.limit,
    windowMs: PUBLIC_SUBMISSION_RATE_LIMIT.windowMs
  });

  return result.allowed;
}

function logSubmissionError(kind: "question" | "problem", error: unknown) {
  console.error("Public submission failed", {
    kind,
    errorName: error instanceof Error ? error.name : "UnknownError"
  });
}

export async function createQuestionSubmission(
  _state: PublicFormState = initialErrorState,
  formData: FormData
): Promise<PublicFormState> {
  try {
    await assertTrustedRequestOrigin();
  } catch {
    return {
      success: false,
      message: "Барањето не може да се обработи. Обидете се повторно.",
      values: {}
    };
  }

  if (honeypotFieldWasFilled(formData)) {
    return {
      success: true,
      message: "Вашето прашање е успешно испратено. Ви благодариме за довербата.",
      values: {}
    };
  }

  if (!(await requestIsAllowed("question"))) {
    return rateLimitedState;
  }

  const values = submittedValuesFrom(formData);
  const parsed = questionSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return {
      success: false,
      message: "Проверете ги внесените податоци.",
      errors: fieldErrorsFrom(parsed.error),
      values
    };
  }

  try {
    await prisma.submission.create({
      data: {
        type: SubmissionType.QUESTION,
        fullName: parsed.data.fullName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        subject: parsed.data.subject,
        message: parsed.data.message
      }
    });

    return {
      success: true,
      message: "Вашето прашање е успешно испратено. Ви благодариме за довербата.",
      values: {}
    };
  } catch (error) {
    logSubmissionError("question", error);

    return {
      success: false,
      message: "Настана техничка грешка. Обидете се повторно подоцна.",
      values
    };
  }
}

export async function createProblemSubmission(
  _state: PublicFormState = initialErrorState,
  formData: FormData
): Promise<PublicFormState> {
  try {
    await assertTrustedRequestOrigin();
  } catch {
    return {
      success: false,
      message: "Барањето не може да се обработи. Обидете се повторно.",
      values: {}
    };
  }

  if (honeypotFieldWasFilled(formData)) {
    return {
      success: true,
      message: "Пријавата е успешно испратена. Надлежните служби ќе ја разгледаат.",
      values: {}
    };
  }

  if (!(await requestIsAllowed("problem"))) {
    return rateLimitedState;
  }

  const values = submittedValuesFrom(formData);
  const parsed = problemSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return {
      success: false,
      message: "Проверете ги внесените податоци.",
      errors: fieldErrorsFrom(parsed.error),
      values
    };
  }

  try {
    await prisma.submission.create({
      data: {
        type: SubmissionType.PROBLEM,
        fullName: parsed.data.fullName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        location: parsed.data.location,
        category: parsed.data.category,
        message: parsed.data.message
      }
    });

    return {
      success: true,
      message: "Пријавата е успешно испратена. Надлежните служби ќе ја разгледаат.",
      values: {}
    };
  } catch (error) {
    logSubmissionError("problem", error);

    return {
      success: false,
      message: "Настана техничка грешка. Обидете се повторно подоцна.",
      values
    };
  }
}
