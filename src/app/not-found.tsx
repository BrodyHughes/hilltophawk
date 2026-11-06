import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container" style={{ padding: "80px 24px", textAlign: "center" }}>
      <div className="eyebrow" style={{ marginBottom: 10 }}>404</div>
      <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 32, margin: "0 0 12px" }}>
        Nothing atop this hill.
      </h1>
      <p className="dek" style={{ fontSize: 16 }}>
        <Link href="/" style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>Head back home</Link>
      </p>
    </main>
  );
}
