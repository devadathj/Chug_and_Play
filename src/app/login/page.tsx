import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6">
      <h1 className="display text-3xl">Log in</h1>
      <p className="mt-2 mb-6 text-sm text-[var(--muted)]">
        Save your answers so we don&apos;t serve the same dilemmas twice.
      </p>
      <Suspense>
        <LoginForm />
      </Suspense>
      <p className="mt-4 text-sm text-[var(--muted)]">
        New here?{" "}
        <Link className="text-[var(--gold)]" href="/register">
          Create an account
        </Link>
      </p>
    </div>
  );
}
