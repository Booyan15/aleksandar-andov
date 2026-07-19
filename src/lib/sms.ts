import type { SubmissionType } from "@prisma/client";

const MACEDONIAN_COUNTRY_CODE = "389";
const MACEDONIAN_SMS_NATIONAL_NUMBER_PATTERN = /^7\d{7}$/;
const SMS_DESCRIPTION_MAX_LENGTH = 120;

export type SubmissionSmsData = {
  type: SubmissionType;
  fullName: string;
  phone?: string | null;
  subject?: string | null;
  location?: string | null;
  category?: string | null;
  message: string;
};

function cleanText(value?: string | null) {
  return value?.trim().replace(/\s+/g, " ");
}

function shortText(value: string) {
  if (value.length <= SMS_DESCRIPTION_MAX_LENGTH) {
    return value;
  }

  return `${value.slice(0, SMS_DESCRIPTION_MAX_LENGTH - 3).trim()}...`;
}

function firstText(values: Array<string | null | undefined>) {
  for (const value of values) {
    const cleaned = cleanText(value);

    if (cleaned) {
      return shortText(cleaned);
    }
  }

  return "записот";
}

function validMacedonianSmsNationalNumber(value: string) {
  return MACEDONIAN_SMS_NATIONAL_NUMBER_PATTERN.test(value);
}

export function normalizeMacedonianPhoneNumber(phone?: string | null) {
  const digits = phone?.replace(/\D/g, "");

  if (!digits) {
    return null;
  }

  const withoutInternationalPrefix = digits.startsWith("00") ? digits.slice(2) : digits;

  if (withoutInternationalPrefix.startsWith(MACEDONIAN_COUNTRY_CODE)) {
    const nationalNumber = withoutInternationalPrefix.slice(MACEDONIAN_COUNTRY_CODE.length);
    return validMacedonianSmsNationalNumber(nationalNumber)
      ? `+${MACEDONIAN_COUNTRY_CODE}${nationalNumber}`
      : null;
  }

  if (withoutInternationalPrefix.startsWith("0")) {
    const nationalNumber = withoutInternationalPrefix.slice(1);
    return validMacedonianSmsNationalNumber(nationalNumber)
      ? `+${MACEDONIAN_COUNTRY_CODE}${nationalNumber}`
      : null;
  }

  return validMacedonianSmsNationalNumber(withoutInternationalPrefix)
    ? `+${MACEDONIAN_COUNTRY_CODE}${withoutInternationalPrefix}`
    : null;
}

export function generateSubmissionSmsMessage(submission: SubmissionSmsData) {
  const name = cleanText(submission.fullName) ?? "граѓанину";
  const description =
    submission.type === "PROBLEM"
      ? firstText([submission.subject, submission.message, submission.location, submission.category])
      : firstText([submission.subject, submission.message]);

  if (submission.type === "PROBLEM") {
    return `Почитувани ${name}, ви одговараме во врска со пријавениот проблем: „${description}“.`;
  }

  return `Почитувани ${name}, ви одговараме во врска со вашето прашање: „${description}“.`;
}

export function generateSmsUrl(phone: string | null | undefined, message: string) {
  const normalizedPhone = normalizeMacedonianPhoneNumber(phone);

  if (!normalizedPhone) {
    return null;
  }

  return `sms:${normalizedPhone}?body=${encodeURIComponent(message)}`;
}

export function generateSubmissionSmsUrl(submission: SubmissionSmsData) {
  return generateSmsUrl(submission.phone, generateSubmissionSmsMessage(submission));
}
