'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/SupabaseProvider";

type AuthGateProps = {
  children: React.ReactNode;
};

export function AuthGate({ children }: AuthGateProps) {
  const router = useRouter();
  const { session, loading } = useSession();

  useEffect(() => {
    if (!loading && !session) {
      router.replace("/auth");
    }
  }, [loading, router, session]);

  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center bg-paper-background text-center">
        <p className="font-serif text-xl uppercase tracking-[0.3em] text-black/70">Signing you in…</p>
      </div>
    );
  }

  return <>{children}</>;
}
