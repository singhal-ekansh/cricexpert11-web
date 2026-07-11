import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/LegalPageLayout";
import { BRAND_NAME } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Privacy Policy — ${BRAND_NAME}`,
  description: `How ${BRAND_NAME} collects, uses, and protects your information.`,
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy">
      <p>
        <strong className="text-cream">Last updated:</strong> July 2026
      </p>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-cream">Overview</h2>
        <p>
          {BRAND_NAME} is an unofficial fan draft game for entertainment. This
          policy explains what we collect when you use the site and how we use
          it.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-cream">Information we collect</h2>
        <p>
          <strong className="text-cream">When you sign in with Google</strong> we
          receive your Google account identifier, email address, display name,
          and profile picture. We use this to create your account, show your name
          on leaderboards and challenges, and keep you signed in.
        </p>
        <p>
          <strong className="text-cream">When you play</strong> we store your
          draft lineups, scores, and challenge activity linked to your account.
          Solo drafts played without signing in are not tied to an account.
        </p>
        <p>
          <strong className="text-cream">Technical data</strong> such as IP
          address, browser type, and request logs may be processed by our hosting
          provider to operate and secure the service.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-cream">How we use information</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Authenticate you and maintain your session</li>
          <li>Run friend challenges, leaderboards, and your profile</li>
          <li>Protect the service from abuse (including rate limiting)</li>
          <li>Improve reliability and fix issues</li>
        </ul>
        <p>We do not sell your personal information.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-cream">Storage and retention</h2>
        <p>
          Your sign-in session is kept in your browser for the current tab
          session. Account and challenge data is stored in our database while
          your account exists. Challenge links expire after 24 hours; associated
          data may be removed after expiry.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-cream">Third parties</h2>
        <p>
          Sign-in is provided by Google. Their use of your data is governed by{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold/80 underline-offset-2 hover:text-gold hover:underline"
          >
            Google&apos;s Privacy Policy
          </a>
          . Match statistics come from{" "}
          <a
            href="https://cricsheet.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold/80 underline-offset-2 hover:text-gold hover:underline"
          >
            Cricsheet
          </a>
          ; we do not share your account data with Cricsheet.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-cream">Your choices</h2>
        <p>
          You can play without signing in. To remove challenge history tied to
          your account, contact us (see below). You may revoke Google access for
          this app from your Google account settings.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-cream">Children</h2>
        <p>
          The service is not directed at children under 13. We do not knowingly
          collect personal information from children.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-cream">Contact</h2>
        <p>
          Questions about this policy: reach the site operator through the
          contact details listed on dinerhub.in for CricExpert11.
        </p>
      </section>
    </LegalPageLayout>
  );
}
