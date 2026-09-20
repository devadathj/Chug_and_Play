"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setError("");
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) {
      setPending(false);
      setError(data.error ?? "Could not create that account.");
      return;
    }
    const result = await signIn("credentials", {
      email: payload.email,
      password: payload.password,
      redirect: false,
    });
    setPending(false);
    if (result?.error) {
      setError("Account created, but login failed. Try the login page.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <label className="block">
        <span className="text-sm text-[var(--muted)]">Name</span>
        <input
          name="name"
          className="mt-1 w-full rounded-xl border border-[var(--line)] bg-black/30 px-3 py-2 outline-none focus:border-[var(--gold)]"
        />
      </label>
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
          minLength={8}
          required
          className="mt-1 w-full rounded-xl border border-[var(--line)] bg-black/30 px-3 py-2 outline-none focus:border-[var(--gold)]"
        />
      </label>
      {error ? <p className="text-sm text-[var(--ember)]">{error}</p> : null}
      <button
        disabled={pending}
        className="w-full rounded-full bg-[var(--gold)] py-2 font-medium text-[#1a100c] disabled:opacity-60"
      >
        {pending ? "Creating..." : "Create account"}
      </button>
    </form>
  );
}
