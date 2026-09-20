"use client";

import { useState } from "react";

export function QuestionForm({
  action,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<{ ok?: boolean; error?: string }>;
  submitLabel: string;
}) {
  const [options, setOptions] = useState(["", ""]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setError("");
    setMessage("");
    const result = await action(formData);
    setPending(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setMessage("Saved.");
    setOptions(["", ""]);
    const form = document.getElementById("question-form") as HTMLFormElement | null;
    form?.reset();
  }

  return (
    <form id="question-form" action={onSubmit} className="space-y-4">
      <label className="block">
        <span className="text-sm text-[var(--muted)]">Prompt</span>
        <input
          name="prompt"
          defaultValue="Would you rather"
          required
          className="mt-1 w-full rounded-xl border border-[var(--line)] bg-black/30 px-3 py-2 outline-none focus:border-[var(--gold)]"
        />
      </label>
      {options.map((value, index) => (
        <label key={index} className="block">
          <span className="text-sm text-[var(--muted)]">
            Option {String.fromCharCode(65 + index)}
          </span>
          <input
            name="option"
            required
            value={value}
            onChange={(event) => {
              const next = [...options];
              next[index] = event.target.value;
              setOptions(next);
            }}
            className="mt-1 w-full rounded-xl border border-[var(--line)] bg-black/30 px-3 py-2 outline-none focus:border-[var(--gold)]"
          />
        </label>
      ))}
      {options.length < 6 ? (
        <button
          type="button"
          className="text-sm text-[var(--gold)]"
          onClick={() => setOptions([...options, ""])}
        >
          Add another option
        </button>
      ) : null}
      {error ? <p className="text-sm text-[var(--ember)]">{error}</p> : null}
      {message ? <p className="text-sm text-[var(--ok)]">{message}</p> : null}
      <button
        disabled={pending}
        className="rounded-full bg-[var(--gold)] px-5 py-2 font-medium text-[#1a100c] disabled:opacity-60"
      >
        {pending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
