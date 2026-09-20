"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setError("");
    const result = await signIn("credentials", {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirect: false,
    });
    setPending(false);
    if (result?.error) {
      setError("Email or password did not match.");
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <label className="block">
        <span className="text-sm text-[var(--muted)]">Email</span>
        <input
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-xl border border-[var(--line)] bg-black/30 px-3 py-2 outline-none focus:border-[var(--gold)]"
        />
      </label>
      <label className="block">
        <span className="text-sm text-[var(--muted)]">Password</span>
        <input
          name="password"
          type="password"
          required
          className="mt-1 w-full rounded-xl border border-[var(--line)] bg-black/30 px-3 py-2 outline-none focus:border-[var(--gold)]"
        />
      </label>
      {error ? <p className="text-sm text-[var(--ember)]">{error}</p> : null}
      <button
        disabled={pending}
        className="w-full rounded-full bg-[var(--gold)] py-2 font-medium text-[#1a100c] disabled:opacity-60"
      >
        {pending ? "Checking..." : "Log in"}
      </button>
    </form>
  );
}
