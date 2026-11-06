export function SiteFooter() {
  return (
    <footer style={{ textAlign: "center", padding: "48px 24px" }}>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 900,
          fontSize: 20,
          letterSpacing: ".06em",
        }}
      >
        HILL&#8209;TOP&#8209;HAWK
      </div>
      <div style={{ fontStyle: "italic", fontSize: 13, color: "rgba(var(--fg),.5)", marginTop: 6 }}>Atop this hill.</div>
      <div className="mono-note" style={{ fontSize: 10.5, marginTop: 14 }}>
        &copy; 2026 Hill Top Hawk
      </div>
    </footer>
  );
}
