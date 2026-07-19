import { z } from "zod";
import { normalizeMacedonianPhoneNumber } from "@/lib/sms";

const requiredText = (message: string, min = 2, max = 500) =>
  z
    .string({
      required_error: message,
      invalid_type_error: message
    })
    .trim()
    .min(min, message)
    .max(max, `Внесете најмногу ${max} знаци.`);

const optionalText = (max = 500) =>
  z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().trim().max(max, `Внесете најмногу ${max} знаци.`).optional()
  );

const optionalMacedonianPhone = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z
    .string()
    .trim()
    .max(32, "Внесете најмногу 32 знаци.")
    .optional()
    .refine((value) => !value || Boolean(normalizeMacedonianPhoneNumber(value)), "Внесете валиден македонски телефонски број.")
    .transform((value) => (value ? normalizeMacedonianPhoneNumber(value) ?? value : undefined))
);

const email = z.string().trim().email("Внесете валидна е-пошта адреса.").max(254, "Внесете најмногу 254 знаци.");

export const submissionIdSchema = z.string().cuid("Невалиден запис.");

const consent = z
  .unknown()
  .refine(
    (value) => value === "on" || value === "true",
    "Мора да се согласите со обработка на личните податоци."
  );

export const questionSchema = z.object({
  fullName: requiredText("Името и презимето се задолжителни.", 2, 120),
  email,
  phone: optionalMacedonianPhone,
  subject: requiredText("Насловот е задолжителен.", 1, 160),
  message: requiredText("Пораката е задолжителна.", 1, 4000),
  consent
});

export const problemSchema = z.object({
  fullName: requiredText("Името и презимето се задолжителни.", 2, 120),
  email,
  phone: optionalMacedonianPhone,
  location: requiredText("Локацијата е задолжителна.", 1, 200),
  category: z.enum(["Комунална инфраструктура", "Јавна чистота", "Сообраќај", "Урбанизам", "Друго"], {
    errorMap: () => ({ message: "Изберете категорија." })
  }),
  message: requiredText("Пораката е задолжителна.", 1, 4000),
  consent
});

export const loginSchema = z.object({
  email: z.string().trim().email("Внесете валидна е-пошта.").max(254, "Внесете најмногу 254 знаци."),
  password: z.string().min(1, "Внесете лозинка.").max(256, "Внесете најмногу 256 знаци.")
});

export const submissionQuickEditSchema = z.object({
  type: z.enum(["QUESTION", "PROBLEM"], {
    required_error: "Изберете тип."
  }),
  status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED", "ARCHIVED"], {
    required_error: "Изберете статус."
  })
});

const validDate = z
  .string({
    required_error: "Внесете датум на поднесување."
  })
  .trim()
  .min(1, "Внесете датум на поднесување.")
  .refine((value) => !Number.isNaN(new Date(value).getTime()), "Внесете валиден датум.");

export const submissionDetailsSchema = submissionQuickEditSchema.extend({
  fullName: requiredText("Името и презимето се задолжителни.", 2, 120),
  email,
  phone: optionalMacedonianPhone,
  subject: optionalText(160),
  location: optionalText(200),
  category: optionalText(120),
  message: requiredText("Пораката е задолжителна.", 1, 4000),
  createdAt: validDate
});
