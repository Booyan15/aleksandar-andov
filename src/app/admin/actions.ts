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
import { assertTrustedRequestOrigin, rateLimitCurrentRequest } from "@/lib/request-security";
import {
  loginSchema,
  submissionIdSchema,
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

function invalidSubmissionState(): SubmissionEditActionState {
  return {
    success: false,
    message: "Записот не е валиден."
  };
}

function requestRejectedState(): SubmissionEditActionState {
  return {
    success: false,
    message: "Барањето не може да се обработи. Обидете се повторно."
  };
}

function logAdminMutationError(action: string, error: unknown) {
  console.error("Admin mutation failed", {
    action,
    errorName: error instanceof Error ? error.name : "UnknownError"
  });
}

async function loginRateLimitAllows(email: string) {
  const ipResult = await rateLimitCurrentRequest({
    namespace: "admin-login-ip",
    limit: 10,
    windowMs: 15 * 60 * 1000
  });

  const emailResult = await rateLimitCurrentRequest({
    namespace: "admin-login-email",
    discriminator: email,
    limit: 5,
    windowMs: 15 * 60 * 1000
  });

  return ipResult.allowed && emailResult.allowed;
}

export async function loginAdmin(
  _state: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  try {
    await assertTrustedRequestOrigin();
  } catch {
    return {
      success: false,
      message: "Барањето не може да се обработи. Обидете се повторно."
    };
  }

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

  if (!(await loginRateLimitAllows(parsed.data.email))) {
    return {
      success: false,
      message: "Најавата е привремено ограничена. Обидете се повторно подоцна."
    };
  }

  if (!adminEnvironmentIsConfigured()) {
    return {
      success: false,
      message: "Администраторската конфигурација не е поставена."
    };
  }

  if (!(await adminCredentialsAreValid(parsed.data.email, parsed.data.password))) {
    return {
      success: false,
      message: "Неточна е-пошта или лозинка."
    };
  }

  await setAdminSession(parsed.data.email);
  redirect("/admin/dashboard");
}

export async function logoutAdmin() {
  try {
    await assertTrustedRequestOrigin();
  } catch {
    redirect("/admin/login");
  }

  await clearAdminSession();
  redirect("/admin/login");
}

export async function updateSubmissionQuickEdit(
  id: string,
  _state: SubmissionEditActionState,
  formData: FormData
): Promise<SubmissionEditActionState> {
  await requireAdmin();

  try {
    await assertTrustedRequestOrigin();
  } catch {
    return requestRejectedState();
  }

  const parsedId = submissionIdSchema.safeParse(id);

  if (!parsedId.success) {
    return invalidSubmissionState();
  }

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
      where: { id: parsedId.data },
      data: {
        type: parsed.data.type,
        status: parsed.data.status
      }
    });

    revalidatePath("/admin/dashboard");
    revalidatePath(`/admin/submissions/${parsedId.data}`);

    return {
      success: true,
      message: "Промените се успешно зачувани."
    };
  } catch (error) {
    logAdminMutationError("updateSubmissionQuickEdit", error);

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

  try {
    await assertTrustedRequestOrigin();
  } catch {
    return requestRejectedState();
  }

  const parsedId = submissionIdSchema.safeParse(id);

  if (!parsedId.success) {
    return invalidSubmissionState();
  }

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
      where: { id: parsedId.data },
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
    revalidatePath(`/admin/submissions/${parsedId.data}`);

    return {
      success: true,
      message: "Промените се успешно зачувани."
    };
  } catch (error) {
    logAdminMutationError("updateSubmissionDetails", error);

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
  await assertTrustedRequestOrigin();

  const parsedId = submissionIdSchema.safeParse(id);

  if (!parsedId.success) {
    redirect("/admin/dashboard");
  }

  try {
    await prisma.submission.deleteMany({
      where: { id: parsedId.data }
    });
  } catch (error) {
    logAdminMutationError("deleteSubmission", error);
    redirect("/admin/dashboard");
  }

  revalidatePath("/admin/dashboard");
  revalidatePath(`/admin/submissions/${parsedId.data}`);

  redirectWithDashboardNotice("deleted");
}
