"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/components/AuthProvider";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const inner = <AuthProvider>{children}</AuthProvider>;
  if (!CLIENT_ID) return inner;
  return <GoogleOAuthProvider clientId={CLIENT_ID}>{inner}</GoogleOAuthProvider>;
}
