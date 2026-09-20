import { adminCreateQuestion, reviewQuestion } from "@/app/actions";
import { QuestionForm } from "@/components/question-form";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const pending = await prisma.question.findMany({
    where: { status: "PENDING" },
    include: {
      options: { orderBy: { sortOrder: "asc" } },
      createdBy: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
      <section>
        <h1 className="display text-4xl">Review queue</h1>
        <p className="mt-2 mb-6 text-[var(--muted)]">
          Approve a question and it joins the live Would You Rather deck.
        </p>
        {pending.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[var(--line)] p-6 text-[var(--muted)]">
            Nothing waiting. The bar is quiet.
          </p>
        ) : (
          <div className="space-y-4">
            {pending.map((question) => (
              <article
                key={question.id}
                className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5"
              >
                <p className="display text-2xl">{question.prompt}</p>
                <ul className="mt-3 space-y-1 text-[var(--foam)]">
                  {question.options.map((option) => (
                    <li key={option.id}>
                      <span className="text-[var(--gold)]">{option.label}.</span>{" "}
                      {option.text}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-[var(--muted)]">
                  From {question.createdBy?.email ?? "unknown"}
                </p>
                <div className="mt-4 flex gap-2">
                  <form action={reviewQuestion}>
                    <input type="hidden" name="id" value={question.id} />
                    <input type="hidden" name="decision" value="APPROVED" />
                    <button className="rounded-full bg-[var(--ok)] px-4 py-1.5 text-sm font-medium text-[#102016]">
                      Approve
                    </button>
                  </form>
                  <form action={reviewQuestion}>
                    <input type="hidden" name="id" value={question.id} />
                    <input type="hidden" name="decision" value="REJECTED" />
                    <button className="rounded-full border border-[var(--line)] px-4 py-1.5 text-sm">
                      Reject
                    </button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <section className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6">
        <h2 className="display text-2xl">Add a live question</h2>
        <p className="mt-2 mb-4 text-sm text-[var(--muted)]">
          Skips review and goes straight into the game.
        </p>
        <QuestionForm action={adminCreateQuestion} submitLabel="Publish" />
      </section>
    </div>
  );
}
