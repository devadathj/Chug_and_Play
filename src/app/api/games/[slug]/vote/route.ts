import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { getOrCreateAnonymousId } from "@/lib/anon";
import { prisma } from "@/lib/prisma";
import { getQuestionResults } from "@/lib/results";

const bodySchema = z.object({
  questionId: z.string().min(1),
  optionId: z.string().min(1),
});

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const session = await auth();
  const parsed = bodySchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid vote" }, { status: 400 });
  }

  const { questionId, optionId } = parsed.data;
  const anonymousId = session?.user?.id ? null : await getOrCreateAnonymousId();

  const question = await prisma.question.findFirst({
    where: {
      id: questionId,
      status: "APPROVED",
      game: { slug },
    },
    include: { options: true },
  });

  if (!question || !question.options.some((option) => option.id === optionId)) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  const existing = await prisma.vote.findFirst({
    where: {
      questionId,
      ...(session?.user?.id
        ? { userId: session.user.id }
        : { anonymousId: anonymousId ?? undefined }),
    },
  });

  if (!existing) {
    await prisma.vote.create({
      data: {
        questionId,
        optionId,
        userId: session?.user?.id ?? null,
        anonymousId,
      },
    });
  }

  const results = await getQuestionResults(questionId);
  return NextResponse.json({
    selectedOptionId: existing?.optionId ?? optionId,
    ...results,
  });
}
