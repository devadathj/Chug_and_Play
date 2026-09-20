import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col justify-center gap-10">
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.28em] text-[var(--gold)]">
          Table games. Crowd results.
        </p>
        <h1 className="display mt-3 text-5xl leading-tight sm:text-6xl">
          Drink, decide, see how everyone else would rather.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-[var(--muted)]">
          Chug & Play is a home for drinking games. First up: Would You Rather.
          Pick a side, skip the ones you hate, and watch the split.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/games/would-you-rather"
          className="rounded-3xl border border-[var(--gold)] bg-[var(--surface)] p-6 hover:bg-black/20"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold)]">
            Live
          </p>
          <h2 className="display mt-2 text-3xl">Would You Rather</h2>
          <p className="mt-2 text-[var(--muted)]">
            Two (or more) terrible options. One tap. Instant house vote.
          </p>
        </Link>
        <div className="rounded-3xl border border-dashed border-[var(--line)] p-6 opacity-70">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
            Next up
          </p>
          <h2 className="display mt-2 text-3xl">More games</h2>
          <p className="mt-2 text-[var(--muted)]">
            The shelf is open. We&apos;ll add the next game once this one is
            humming.
          </p>
        </div>
      </div>
    </div>
  );
}
