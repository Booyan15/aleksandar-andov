import { z } from "zod";

const requiredText = (message: string, min = 2) =>
  z
    .string({
      required_error: message,
      invalid_type_error: message
    })
    .trim()
    .min(min, message);

const optionalText = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().optional()
);

const consent = z
  .unknown()
  .refine(
    (value) => value === "on" || value === "true",
    "Мора да се согласите со обработка на личните податоци."
  );

export const questionSchema = z.object({
  fullName: requiredText("Името и презимето се задолжителни."),
  email: z.string().trim().email("Внесете валидна е-пошта адреса."),
  phone: optionalText,
  subject: requiredText("Насловот е задолжителен.", 1),
  message: requiredText("Пораката е задолжителна.", 1),
  consent
});

export const problemSchema = z.object({
  fullName: requiredText("Името и презимето се задолжителни."),
  email: z.string().trim().email("Внесете валидна е-пошта адреса."),
  phone: optionalText,
  location: requiredText("Локацијата е задолжителна.", 1),
  category: requiredText("Изберете категорија.", 1),
  message: requiredText("Пораката е задолжителна.", 1),
  consent
});

export const loginSchema = z.object({
  email: z.string().trim().email("Внесете валидна е-пошта."),
  password: z.string().min(1, "Внесете лозинка.")
});

export const statusSchema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED", "ARCHIVED"], {
    required_error: "Изберете статус."
  })
});
