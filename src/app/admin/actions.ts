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
import { loginSchema, statusSchema } from "@/lib/validation";

export type LoginActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string | undefined>;
};

export type StatusActionState = {
  success: boolean;
  message: string;
};

function formDataToObject(formData: FormData) {
  return Object.fromEntries(formData.entries());
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

export async function updateSubmissionStatus(
  id: string,
  _state: StatusActionState,
  formData: FormData
): Promise<StatusActionState> {
  await requireAdmin();

  const parsed = statusSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return {
      success: false,
      message: "Изберете валиден статус."
    };
  }

  try {
    await prisma.submission.update({
      where: { id },
      data: { status: parsed.data.status }
    });

    revalidatePath("/admin/dashboard");
    revalidatePath(`/admin/submissions/${id}`);

    return {
      success: true,
      message: "Статусот е успешно ажуриран."
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Не може да се ажурира статусот. Обидете се повторно."
    };
  }
}

function redirectWithDashboardNotice(notice: "trash" | "restored" | "deleted", view: "active" | "trash") {
  const params = new URLSearchParams({
    notice
  });

  if (view === "trash") {
    params.set("view", "trash");
  }

  redirect(`/admin/dashboard?${params.toString()}`);
}

export async function moveToTrash(id: string) {
  await requireAdmin();

  await prisma.submission.updateMany({
    where: {
      id,
      deletedAt: null
    },
    data: {
      deletedAt: new Date()
    }
  });

  revalidatePath("/admin/dashboard");
  revalidatePath(`/admin/submissions/${id}`);

  redirectWithDashboardNotice("trash", "active");
}

export async function restoreSubmission(id: string) {
  await requireAdmin();

  await prisma.submission.updateMany({
    where: {
      id,
      deletedAt: {
        not: null
      }
    },
    data: {
      deletedAt: null
    }
  });

  revalidatePath("/admin/dashboard");
  revalidatePath(`/admin/submissions/${id}`);

  redirectWithDashboardNotice("restored", "trash");
}

export async function permanentlyDeleteSubmission(id: string) {
  await requireAdmin();

  await prisma.submission.deleteMany({
    where: {
      id,
      deletedAt: {
        not: null
      }
    }
  });

  revalidatePath("/admin/dashboard");
  revalidatePath(`/admin/submissions/${id}`);

  redirectWithDashboardNotice("deleted", "trash");
}
