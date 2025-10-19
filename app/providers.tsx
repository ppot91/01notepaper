'use client';

import { SupabaseProvider } from "@/components/SupabaseProvider";
import { ToastProvider } from "@/components/ToastProvider";

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <SupabaseProvider>
      <ToastProvider>{children}</ToastProvider>
    </SupabaseProvider>
  );
}
