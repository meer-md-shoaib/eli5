"use client";

import { useState, useEffect, type FormEvent } from "react";
import { signIn, getProviders } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowRight, GitFork, Mail } from "lucide-react";

const ERROR_MESSAGES: Record<string, string> = {
  CredentialsSignin: "That email or password doesn't look right. Try again.",
  OAuthSignin:       "Something went wrong with OAuth sign-in. Try again.",
  OAuthCallback:     "OAuth callback failed. Check your provider configuration.",
  AccessDenied:      "You do not have permission to log in. Please contact the administrator.",
  Default:           "Sign-in failed. Try a different method or contact the owner.",
};

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const errorCode = searchParams.get("error");

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [providers, setProviders] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    getProviders().then((res) => {
      setProviders(res);
    });
  }, []);

  const errorMsg = formError ?? (errorCode ? (ERROR_MESSAGES[errorCode] ?? ERROR_MESSAGES.Default) : null);

  async function handleCredentials(event: FormEvent) {
    event.preventDefault();
    if (!email.trim() || !password) return;
    setFormError(null);
    setLoading("credentials");
    const result = await signIn("credentials", {
      email: email.trim(),
      password,
      callbackUrl,
      redirect: false,
    });
    setLoading(null);
    if (result?.error) {
      setFormError(ERROR_MESSAGES["CredentialsSignin"] ?? "Sign-in failed.");
    } else if (result?.url) {
      window.location.href = result.url;
    }
  }

  async function handleOAuth(provider: "google" | "github") {
    setLoading(provider);
    await signIn(provider, { callbackUrl });
  }

  return (
    <div className="login-page" aria-label="Sign in to ELI5">
      {/* Background — same aurora as the main app */}
      <div className="login-aurora" aria-hidden="true" />

      <div className="login-card glass-card" role="main">
        {/* Brand */}
        <Link href="/" className="login-brand" aria-label="Back to ELI5">
          <span className="brand-orb" aria-hidden="true" />
          <span className="login-brand-text">ELI5</span>
        </Link>

        <div className="login-header">
          <h1 className="login-title">Welcome back.</h1>
          <p className="login-subtitle">Sign in to access your explanations.</p>
        </div>

        {/* Error */}
        {errorMsg && (
          <div className="login-error" role="alert">
            <AlertCircle size={15} aria-hidden="true" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* OAuth buttons */}
        {providers && (providers.google || providers.github) && (
          <div className="login-oauth">
            {providers.google && (
              <button
                type="button"
                className="btn btn-secondary login-oauth-btn"
                disabled={loading !== null}
                onClick={() => handleOAuth("google")}
              >
                {loading === "google" ? (
                  <span className="login-spinner" aria-hidden="true" />
                ) : (
                  <GoogleIcon />
                )}
                Continue with Google
              </button>
            )}

            {providers.github && (
              <button
                type="button"
                className="btn btn-secondary login-oauth-btn"
                disabled={loading !== null}
                onClick={() => handleOAuth("github")}
              >
                {loading === "github" ? (
                  <span className="login-spinner" aria-hidden="true" />
                ) : (
                  <GitFork size={16} aria-hidden="true" />
                )}
                Continue with GitHub
              </button>
            )}
          </div>
        )}

        {/* Divider */}
        {providers && (providers.google || providers.github) && (
          <div className="login-divider" aria-hidden="true">
            <span />
            <p>or sign in with email</p>
            <span />
          </div>
        )}

        {/* Credentials form */}
        <form className="login-form" onSubmit={handleCredentials} noValidate>
          <label className="login-field">
            <span className="login-field-label">Email address</span>
            <div className="login-input-wrap">
              <Mail size={15} className="login-input-icon" aria-hidden="true" />
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                disabled={loading !== null}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email address"
              />
            </div>
          </label>

          <label className="login-field">
            <div className="login-field-label-row">
              <span className="login-field-label">Password</span>
            </div>
            <div className="login-input-wrap">
              <input
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                disabled={loading !== null}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-label="Password"
              />
            </div>
          </label>

          <button
            type="submit"
            className="btn btn-primary login-submit-btn"
            disabled={loading !== null || !email.trim() || !password}
          >
            {loading === "credentials" ? (
              <>
                <span className="login-spinner" aria-hidden="true" />
                Signing in…
              </>
            ) : (
              <>
                Sign in
                <span className="btn-icon btn-icon-trailing" aria-hidden="true">
                  <ArrowRight size={14} />
                </span>
              </>
            )}
          </button>
        </form>

        <p className="login-footer-note">
          Access is limited to authorised users.{" "}
          <Link href="/" className="login-link">
            Back to home ↗
          </Link>
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
