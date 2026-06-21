import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";

/**
 * Auth strategy
 * ─────────────
 * ELI5 uses NextAuth v4 with three optional providers:
 *
 * 1. Credentials  — always enabled. Accepts a single admin email + password
 *    stored entirely in environment variables (no database required).
 *    Set AUTH_ADMIN_EMAIL and AUTH_ADMIN_PASSWORD_HASH in your Vercel env.
 *    Generate the hash with: node -e "require('bcryptjs').hash('yourpass',12).then(console.log)"
 *
 * 2. Google OAuth — enabled when GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET are set.
 *
 * 3. GitHub OAuth — enabled when GITHUB_CLIENT_ID + GITHUB_CLIENT_SECRET are set.
 *
 * For a public deployment where ANY authenticated user can access the app,
 * set AUTH_ALLOW_ALL_OAUTH=true. Otherwise only the admin email can sign in.
 */

const ADMIN_EMAIL = process.env.AUTH_ADMIN_EMAIL ?? "";
const PASSWORD_HASH = process.env.AUTH_ADMIN_PASSWORD_HASH ?? "";
const ALLOW_ALL_OAUTH = process.env.AUTH_ALLOW_ALL_OAUTH === "true";

const providers: NextAuthOptions["providers"] = [];

// ── Credentials (email + password) ──────────────────────────────────────────
providers.push(
  CredentialsProvider({
    id: "credentials",
    name: "Email",
    credentials: {
      email:    { label: "Email",    type: "email",    placeholder: "you@example.com" },
      password: { label: "Password", type: "password", placeholder: "••••••••" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;
      if (!ADMIN_EMAIL || !PASSWORD_HASH) return null;

      const emailMatch = credentials.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
      if (!emailMatch) return null;

      const passwordOk = await bcrypt.compare(credentials.password, PASSWORD_HASH);
      if (!passwordOk) return null;

      return { id: "admin", email: ADMIN_EMAIL, name: "Admin" };
    },
  })
);

// ── Google OAuth ─────────────────────────────────────────────────────────────
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

// ── GitHub OAuth ─────────────────────────────────────────────────────────────
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  providers.push(
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    })
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account }) {
      // Credentials provider already validated the user above.
      if (account?.provider === "credentials") return true;

      // For OAuth providers, either allow all or restrict to admin email.
      if (ALLOW_ALL_OAUTH) return true;
      if (!ADMIN_EMAIL) return false;
      return user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
};
