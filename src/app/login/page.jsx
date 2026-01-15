import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginClient />
    </Suspense>
  );
}

function LoginSkeleton() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="h-7 w-24 rounded bg-white/10" />
        <div className="mt-3 h-4 w-72 rounded bg-white/10" />
        <div className="mt-6 h-11 w-full rounded-2xl bg-white/10" />
        <div className="mt-3 h-3 w-64 rounded bg-white/10" />
      </div>
    </main>
  );
}
