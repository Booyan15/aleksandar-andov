"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  adminCredentialsAreValid,
  adminEnvironmentIsConfigured,
  clearAdminSession,
  requireAdmin,
  setAdminSession
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  loginSchema,
  submissionDetailsSchema,
  submissionQuickEditSchema
} from "@/lib/validation";

export type LoginActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string | undefined>;
};

export type SubmissionEditActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string | undefined>;
};

function formDataToObject(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

function fieldErrorsFrom<T extends Record<string, string[] | undefined>>(fieldErrors: T) {
  return Object.fromEntries(
    Object.entries(fieldErrors).map(([key, messages]) => [key, messages?.[0]])
  );
}

export async function loginAdmin(
  _state: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const parsed = loginSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();

    return {
      success: false,
      message: "Проверете ги податоците за најава.",
      fieldErrors: Object.fromEntries(
        Object.entries(fieldErrors).map(([key, messages]) => [key, messages?.[0]])
      )
    };
  }

  if (!adminEnvironmentIsConfigured()) {
    return {
      success: false,
      message: "Администраторската конфигурација не е поставена."
    };
  }

  if (!adminCredentialsAreValid(parsed.data.email, parsed.data.password)) {
    return {
      success: false,
      message: "Неточна е-пошта или лозинка."
    };
  }

  await setAdminSession(parsed.data.email);
  redirect("/admin/dashboard");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function updateSubmissionQuickEdit(
  id: string,
  _state: SubmissionEditActionState,
  formData: FormData
): Promise<SubmissionEditActionState> {
  await requireAdmin();

  const parsed = submissionQuickEditSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();

    return {
      success: false,
      message: "Изберете валиден тип и статус.",
      fieldErrors: fieldErrorsFrom(fieldErrors)
    };
  }

  try {
    await prisma.submission.update({
      where: { id },
      data: {
        type: parsed.data.type,
        status: parsed.data.status
      }
    });

    revalidatePath("/admin/dashboard");
    revalidatePath(`/admin/submissions/${id}`);

    return {
      success: true,
      message: "Промените се успешно зачувани."
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Промените не може да се зачуваат. Обидете се повторно."
    };
  }
}

export async function updateSubmissionDetails(
  id: string,
  _state: SubmissionEditActionState,
  formData: FormData
): Promise<SubmissionEditActionState> {
  await requireAdmin();

  const parsed = submissionDetailsSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();

    return {
      success: false,
      message: "Проверете ги внесените податоци.",
      fieldErrors: fieldErrorsFrom(fieldErrors)
    };
  }

  try {
    await prisma.submission.update({
      where: { id },
      data: {
        type: parsed.data.type,
        status: parsed.data.status,
        fullName: parsed.data.fullName,
        email: parsed.data.email,
        phone: parsed.data.phone ?? null,
        subject: parsed.data.subject ?? null,
        location: parsed.data.location ?? null,
        category: parsed.data.category ?? null,
        message: parsed.data.message,
        createdAt: new Date(parsed.data.createdAt)
      }
    });

    revalidatePath("/admin/dashboard");
    revalidatePath(`/admin/submissions/${id}`);

    return {
      success: true,
      message: "Промените се успешно зачувани."
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Промените не може да се зачуваат. Обидете се повторно."
    };
  }
}

function redirectWithDashboardNotice(notice: "deleted") {
  const params = new URLSearchParams({
    notice
  });

  redirect(`/admin/dashboard?${params.toString()}`);
}

export async function deleteSubmission(id: string) {
  await requireAdmin();

  await prisma.submission.deleteMany({
    where: { id }
  });

  revalidatePath("/admin/dashboard");
  revalidatePath(`/admin/submissions/${id}`);

  redirectWithDashboardNotice("deleted");
}
