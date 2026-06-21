import { FOOTER_TAGLINE } from "@/lib/copy";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer" aria-label="Site footer">
      <div>
        <span className="footer-brand">ELI5</span>
        <span style={{ marginLeft: "0.75rem" }}>{FOOTER_TAGLINE}</span>
      </div>
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
        <span style={{ color: "var(--faint)", fontSize: "0.82rem" }}>© {year}</span>
        <a href="#top" aria-label="Back to top">Back to top ↑</a>
      </div>
    </footer>
  );
}
