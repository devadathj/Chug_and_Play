import Link from "next/link";
import { auth, signOut } from "@/auth";

export async function SiteHeader() {
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <header className="border-b border-[var(--line)] bg-black/20 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="display text-2xl tracking-tight text-[var(--gold)]">
            Chug & Play
          </span>
          <span className="hidden text-xs uppercase tracking-[0.2em] text-[var(--muted)] sm:inline">
            chugandplay.com
          </span>
        </Link>
        <nav className="flex items-center gap-3 text-sm text-[var(--foam)]">
          <Link className="hover:text-[var(--gold)]" href="/games/would-you-rather">
            Play
          </Link>
          {session ? (
            <>
              <Link className="hover:text-[var(--gold)]" href="/submit">
                Submit
              </Link>
              {isAdmin ? (
                <Link className="hover:text-[var(--gold)]" href="/admin">
                  Admin
                </Link>
              ) : null}
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button className="rounded-full border border-[var(--line)] px-3 py-1 hover:border-[var(--gold)]">
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link className="hover:text-[var(--gold)]" href="/login">
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-[var(--gold)] px-3 py-1 font-medium text-[#1a100c] hover:bg-[var(--gold-2)]"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
