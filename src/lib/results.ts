import { prisma } from "@/lib/prisma";

export type VoteResult = {
  optionId: string;
  label: string;
  text: string;
  votes: number;
  percent: number;
};

export async function getQuestionResults(
  questionId: string,
): Promise<{ total: number; results: VoteResult[] }> {
  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: {
      options: { orderBy: { sortOrder: "asc" } },
      _count: { select: { votes: true } },
    },
  });

  if (!question) {
    throw new Error("Question not found");
  }

  const counts = await prisma.vote.groupBy({
    by: ["optionId"],
    where: { questionId },
    _count: { optionId: true },
  });

  const countMap = new Map(
    counts.map((row) => [row.optionId, row._count.optionId]),
  );
  const total = question._count.votes;

  const raw = question.options.map((option) => {
    const votes = countMap.get(option.id) ?? 0;
    return {
      optionId: option.id,
      label: option.label,
      text: option.text,
      votes,
      percent: total === 0 ? 0 : Math.round((votes / total) * 100),
    };
  });

  const drift =
    raw.reduce((sum, row) => sum + row.percent, 0) - (total === 0 ? 0 : 100);
  if (drift !== 0 && raw.length > 0 && total > 0) {
    raw[raw.length - 1].percent -= drift;
  }

  return { total, results: raw };
}

export function optionLabels(count: number) {
  return Array.from({ length: count }, (_, index) =>
    String.fromCharCode(65 + index),
  );
}
