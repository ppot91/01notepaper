'use client';

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@/lib/supabaseClient";

type SupabaseContextValue = {
  supabase: SupabaseClient;
  session: Session | null;
  loading: boolean;
};

const SupabaseContext = createContext<SupabaseContextValue | undefined>(undefined);

type SupabaseProviderProps = {
  children: React.ReactNode;
};

export function SupabaseProvider({ children }: SupabaseProviderProps) {
  const [supabaseClient] = useState(() => createBrowserClient());
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const trackSession = async () => {
      const {
        data: { session: initialSession }
      } = await supabaseClient.auth.getSession();
      if (active) {
        setSession(initialSession);
        setLoading(false);
      }
    };

    trackSession();
    const {
      data: { subscription }
    } = supabaseClient.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabaseClient]);

  const value = useMemo(
    () => ({
      supabase: supabaseClient,
      session,
      loading
    }),
    [loading, session, supabaseClient]
  );

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error("useSupabase must be used within SupabaseProvider");
  }
  return context;
}

export function useSession() {
  const { session, loading } = useSupabase();
  return { session, loading };
}
