import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const session = await auth();
  const excludeParam = request.nextUrl.searchParams.get("exclude") ?? "";
  const excludeIds = excludeParam
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  const game = await prisma.game.findUnique({ where: { slug } });
  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  const questions = await prisma.question.findMany({
    where: {
      gameId: game.id,
      status: "APPROVED",
      id: excludeIds.length ? { notIn: excludeIds } : undefined,
      ...(session?.user?.id
        ? { votes: { none: { userId: session.user.id } } }
        : {}),
    },
    include: {
      options: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (questions.length === 0) {
    return NextResponse.json({ question: null });
  }

  const question = questions[Math.floor(Math.random() * questions.length)];

  return NextResponse.json({
    question: {
      id: question.id,
      prompt: question.prompt,
      options: question.options.map((option) => ({
        id: option.id,
        label: option.label,
        text: option.text,
      })),
    },
  });
}
