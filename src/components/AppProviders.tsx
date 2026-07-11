"use client";

import { Suspense } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/components/AuthProvider";
import { ScrollToTop } from "@/components/ScrollToTop";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

function ProvidersInner({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>
      {children}
    </AuthProvider>
  );
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const inner = <ProvidersInner>{children}</ProvidersInner>;
  if (!CLIENT_ID) return inner;
  return <GoogleOAuthProvider clientId={CLIENT_ID}>{inner}</GoogleOAuthProvider>;
}
