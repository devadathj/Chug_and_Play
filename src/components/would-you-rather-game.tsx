"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type Option = { id: string; label: string; text: string };
type Question = { id: string; prompt: string; options: Option[] };
type Result = {
  optionId: string;
  label: string;
  text: string;
  votes: number;
  percent: number;
};

export function WouldYouRatherGame({ loggedIn }: { loggedIn: boolean }) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [results, setResults] = useState<Result[] | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [seen, setSeen] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState("");

  const loadNext = useCallback(
    async (exclude: string[]) => {
      setLoading(true);
      setError("");
      setResults(null);
      setSelected(null);
      try {
        const query = exclude.length ? `?exclude=${exclude.join(",")}` : "";
        const response = await fetch(
          `/api/games/would-you-rather/next${query}`,
        );
        const data = await response.json();
        setQuestion(data.question ?? null);
      } catch {
        setError("Could not load a question. Try again.");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    // Mount-time data fetch: intentional, safe single cascade.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadNext([]);
  }, [loadNext]);

  async function vote(optionId: string) {
    if (!question || voting) {
      return;
    }
    setVoting(true);
    setError("");
    try {
      const response = await fetch("/api/games/would-you-rather/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: question.id, optionId }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Vote failed");
      }
      setSelected(data.selectedOptionId);
      setResults(data.results);
      setTotal(data.total);
      setSeen((current) =>
        current.includes(question.id) ? current : [...current, question.id],
      );
    } catch {
      setError("Could not save that vote.");
    } finally {
      setVoting(false);
    }
  }

  function skip() {
    if (!question) {
      return;
    }
    const nextSeen = seen.includes(question.id) ? seen : [...seen, question.id];
    setSeen(nextSeen);
    void loadNext(nextSeen);
  }

  function nextQuestion() {
    const nextSeen = question
      ? seen.includes(question.id)
        ? seen
        : [...seen, question.id]
      : seen;
    setSeen(nextSeen);
    void loadNext(nextSeen);
  }

  return (
    <section className="mx-auto w-full max-w-2xl">
      <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[var(--gold)]">
        Would You Rather
      </p>
      <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)]/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-8">
        {loading ? (
          <p className="text-[var(--muted)]">Pouring the next round...</p>
        ) : null}

        {!loading && !question ? (
          <div className="space-y-4">
            <h2 className="display text-3xl">You&apos;re caught up</h2>
            <p className="text-[var(--muted)]">
              {loggedIn
                ? "No fresh approved questions left for your account. Submit one, or check back after the next review."
                : "No questions left in this session. Log in to skip repeats next time, or refresh for another pass."}
            </p>
            <div className="flex flex-wrap gap-3">
              {loggedIn ? (
                <Link
                  href="/submit"
                  className="rounded-full bg-[var(--gold)] px-4 py-2 font-medium text-[#1a100c]"
                >
                  Submit a question
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="rounded-full bg-[var(--gold)] px-4 py-2 font-medium text-[#1a100c]"
                >
                  Log in
                </Link>
              )}
              <button
                className="rounded-full border border-[var(--line)] px-4 py-2"
                onClick={() => {
                  setSeen([]);
                  void loadNext([]);
                }}
              >
                Start over
              </button>
            </div>
          </div>
        ) : null}

        {question && !loading ? (
          <>
            <h2 className="display text-3xl leading-tight sm:text-4xl">
              {question.prompt}
            </h2>
            <div className="mt-6 grid gap-3">
              {question.options.map((option) => {
                const result = results?.find(
                  (row) => row.optionId === option.id,
                );
                const isPick = selected === option.id;
                return (
                  <button
                    key={option.id}
                    disabled={Boolean(results) || voting}
                    onClick={() => vote(option.id)}
                    className={`rounded-2xl border px-4 py-4 text-left transition ${
                      isPick
                        ? "border-[var(--gold)] bg-black/30"
                        : "border-[var(--line)] hover:border-[var(--gold)] hover:bg-black/20"
                    } disabled:cursor-default`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-sm font-semibold text-[var(--gold)]">
                          {option.label}
                        </span>
                        <p className="mt-1 text-lg">{option.text}</p>
                      </div>
                      {result ? (
                        <span className="display text-2xl text-[var(--gold)]">
                          {result.percent}%
                        </span>
                      ) : null}
                    </div>
                    {result ? (
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/40">
                        <div
                          className="h-full rounded-full bg-[var(--gold)]"
                          style={{ width: `${result.percent}%` }}
                        />
                      </div>
                    ) : null}
                  </button>
                );
              })}
            </div>

            {results ? (
              <p className="mt-4 text-sm text-[var(--muted)]">
                {total} {total === 1 ? "vote" : "votes"} so far.
              </p>
            ) : null}

            {error ? <p className="mt-4 text-sm text-[var(--ember)]">{error}</p> : null}

            <div className="mt-6 flex flex-wrap gap-3">
              {results ? (
                <button
                  onClick={nextQuestion}
                  className="rounded-full bg-[var(--gold)] px-5 py-2 font-medium text-[#1a100c]"
                >
                  Next question
                </button>
              ) : (
                <button
                  onClick={skip}
                  className="rounded-full border border-[var(--line)] px-5 py-2 hover:border-[var(--gold)]"
                >
                  Skip
                </button>
              )}
            </div>
          </>
        ) : null}
      </div>
      {!loggedIn ? (
        <p className="mt-4 text-sm text-[var(--muted)]">
          Playing as a guest. Votes still count.{" "}
          <Link className="text-[var(--gold)] underline" href="/login">
            Log in
          </Link>{" "}
          to skip questions you already answered.
        </p>
      ) : null}
    </section>
  );
}
