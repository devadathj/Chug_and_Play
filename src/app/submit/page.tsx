import { submitQuestion } from "@/app/actions";
import { QuestionForm } from "@/components/question-form";

export default function SubmitPage() {
  return (
    <div className="mx-auto w-full max-w-xl rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6">
      <h1 className="display text-3xl">Submit a dilemma</h1>
      <p className="mt-2 mb-6 text-[var(--muted)]">
        Logged-in players can add Would You Rather questions. An admin reviews
        them before they hit the deck.
      </p>
      <QuestionForm action={submitQuestion} submitLabel="Send for review" />
    </div>
  );
}
