"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { optionLabels } from "@/lib/results";

const questionSchema = z.object({
  prompt: z.string().trim().min(3).max(200),
  options: z.array(z.string().trim().min(1).max(240)).min(2).max(6),
});

async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?next=/submit");
  }
  return session;
}

async function requireAdmin() {
  const session = await requireUser();
  if (session.user.role !== "ADMIN") {
    redirect("/");
  }
  return session;
}

export async function submitQuestion(formData: FormData) {
  const session = await requireUser();
  const parsed = questionSchema.safeParse({
    prompt: formData.get("prompt"),
    options: formData.getAll("option").map(String),
  });

  if (!parsed.success) {
    return { error: "Need a prompt and at least two options." };
  }

  const game = await prisma.game.findUnique({
    where: { slug: "would-you-rather" },
  });
  if (!game) {
    return { error: "Game is not set up yet." };
  }

  const options = parsed.data.options.filter(Boolean);
  const labels = optionLabels(options.length);

  await prisma.question.create({
    data: {
      gameId: game.id,
      prompt: parsed.data.prompt,
      status: "PENDING",
      createdById: session.user.id,
      options: {
        create: options.map((text, index) => ({
          label: labels[index],
          text,
          sortOrder: index,
        })),
      },
    },
  });

  revalidatePath("/submit");
  return { ok: true };
}

export async function adminCreateQuestion(formData: FormData) {
  const session = await requireAdmin();
  const parsed = questionSchema.safeParse({
    prompt: formData.get("prompt"),
    options: formData.getAll("option").map(String),
  });

  if (!parsed.success) {
    return { error: "Need a prompt and at least two options." };
  }

  const game = await prisma.game.findUnique({
    where: { slug: "would-you-rather" },
  });
  if (!game) {
    return { error: "Game is not set up yet." };
  }

  const options = parsed.data.options.filter(Boolean);
  const labels = optionLabels(options.length);

  await prisma.question.create({
    data: {
      gameId: game.id,
      prompt: parsed.data.prompt,
      status: "APPROVED",
      createdById: session.user.id,
      reviewedAt: new Date(),
      options: {
        create: options.map((text, index) => ({
          label: labels[index],
          text,
          sortOrder: index,
        })),
      },
    },
  });

  revalidatePath("/admin");
  return { ok: true };
}

export async function reviewQuestion(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const decision = String(formData.get("decision") ?? "");

  if (!id || (decision !== "APPROVED" && decision !== "REJECTED")) {
    return;
  }

  await prisma.question.update({
    where: { id },
    data: { status: decision, reviewedAt: new Date() },
  });

  revalidatePath("/admin");
}
