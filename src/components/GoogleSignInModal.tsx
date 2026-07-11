"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useEffect, useId, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { GameLogo } from "@/components/GameLogo";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function GoogleSignInModal({ open, onClose, onSuccess }: Props) {
  const { loginWithGoogle } = useAuth();
  const titleId = useId();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, loading]);

  if (!open) return null;

  const handleCredential = async (credential: string) => {
    setLoading(true);
    try {
      await loginWithGoogle(credential);
      onSuccess();
    } catch {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={loading ? undefined : onClose}
        aria-label="Close"
      />

      <div
        className="hero-card relative w-full max-w-sm rounded-2xl px-6 py-8 sm:px-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute top-3.5 right-4 rounded-lg px-2 py-1 text-lg leading-none text-cream-muted transition-colors hover:text-cream disabled:opacity-40"
          aria-label="Close"
        >
          ×
        </button>

        <div className="flex flex-col items-center text-center">
          <GameLogo variant="mark" className="h-14 w-14" />
          <h2
            id={titleId}
            className="mt-5 font-[family-name:var(--font-display)] text-2xl text-cream"
          >
            Sign in
          </h2>

          <div className="relative mt-6 w-full">
            {loading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-[#12101a]/80">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-gold border-t-transparent" />
              </div>
            )}

            {CLIENT_ID ? (
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={async (response) => {
                    if (!response.credential) return;
                    await handleCredential(response.credential);
                  }}
                  onError={() => {
                    setLoading(false);
                  }}
                  theme="outline"
                  size="large"
                  shape="rectangular"
                  text="continue_with"
                  width="300"
                />
              </div>
            ) : (
              <p className="text-sm text-cream-muted">Sign-in is unavailable right now.</p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="mt-5 text-sm text-cream-muted transition-colors hover:text-cream disabled:opacity-40"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
