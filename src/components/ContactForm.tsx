"use client";

import { useRef, useState, type PointerEvent } from "react";
import styles from "./ContactForm.module.css";

// TODO: the form has no backend yet. Hook "Send It Up The Hill" up to a server
// action that emails Ethan (e.g. via Resend), and upload the sketch as a PNG.
export function ContactForm() {
  const [mode, setMode] = useState<"type" | "draw">("type");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  const pos = (e: PointerEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    // Canvas is scaled with CSS, so map client coords to canvas pixels.
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const onDown = (e: PointerEvent<HTMLCanvasElement>) => {
    const ctx = e.currentTarget.getContext("2d");
    if (!ctx) return;
    drawing.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 3;
    ctx.strokeStyle = `rgb(${getComputedStyle(document.documentElement).getPropertyValue("--fg")})`;
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  };

  const onMove = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = e.currentTarget.getContext("2d");
    if (!ctx) return;
    const p = pos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  };

  const clear = () => {
    const c = canvasRef.current;
    c?.getContext("2d")?.clearRect(0, 0, c.width, c.height);
  };

  return (
    <section className={styles.wrap}>
      <form className={styles.card} onSubmit={(e) => e.preventDefault()}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>Get In Touch</div>
        <h2 className={styles.title}>Send us something.</h2>

        <div className={styles.fields}>
          <input type="text" name="name" placeholder="Your name" aria-label="Your name" className={styles.input} />
          <input type="email" name="email" placeholder="Your email" aria-label="Your email" className={styles.input} />
        </div>

        <div className={styles.modes}>
          <button type="button" className={styles.modeBtn} aria-pressed={mode === "type"} onClick={() => setMode("type")}>
            Type
          </button>
          <button type="button" className={styles.modeBtn} aria-pressed={mode === "draw"} onClick={() => setMode("draw")}>
            Draw
          </button>
        </div>

        {mode === "type" ? (
          <textarea
            name="message"
            placeholder="Say something atop this hill…"
            aria-label="Message"
            rows={5}
            className={styles.textarea}
          />
        ) : (
          <>
            <div className={styles.canvasWrap}>
              <canvas
                ref={canvasRef}
                width={576}
                height={220}
                className={styles.canvas}
                onPointerDown={onDown}
                onPointerMove={onMove}
                onPointerUp={() => (drawing.current = false)}
                onPointerCancel={() => (drawing.current = false)}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <button type="button" onClick={clear} className={styles.clear}>
                clear sketch
              </button>
            </div>
          </>
        )}

        <button type="submit" className={styles.submit}>Send It Up The Hill</button>
      </form>
    </section>
  );
}
