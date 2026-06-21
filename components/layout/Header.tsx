"use client";

import { useEffect, useState } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";
import { ThemeToggle } from "./ThemeToggle";

function NavLink({ href, label }: { href: string; label: string }) {
  const ref = useMagnetic<HTMLAnchorElement>(0.28);
  return (
    <a ref={ref} href={href} className="nav-link">
      {label}
    </a>
  );
}

export function Header() {
  const brandRef = useMagnetic<HTMLAnchorElement>(0.16);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 32);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header${scrolled ? " scrolled" : ""}`}>
      <a ref={brandRef} href="#top" className="brand" aria-label="ELI5 — back to top">
        <span className="brand-orb" aria-hidden="true" />
        <span className="brand-text">ELI5</span>
      </a>

      <nav className="top-nav" aria-label="Primary navigation">
        <NavLink href="#examples" label="Explore" />
        <NavLink href="#workspace" label="Workspace" />
        <NavLink href="#history" label="Library" />
      </nav>

      <ThemeToggle />
    </header>
  );
}
