import Link from "next/link";
import { RegisterForm } from "@/components/register-form";

export default function RegisterPage() {
  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6">
      <h1 className="display text-3xl">Join the table</h1>
      <p className="mt-2 mb-6 text-sm text-[var(--muted)]">
        Track answers, submit questions, and keep the night moving.
      </p>
      <RegisterForm />
      <p className="mt-4 text-sm text-[var(--muted)]">
        Already have an account?{" "}
        <Link className="text-[var(--gold)]" href="/login">
          Log in
        </Link>
      </p>
    </div>
  );
}
