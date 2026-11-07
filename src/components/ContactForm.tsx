"use client";

import { useActionState, useRef, useState, type PointerEvent } from "react";
import { sendContactMessage, type ContactState } from "@/lib/contact";
import styles from "./ContactForm.module.css";

const initialState: ContactState = { status: "idle", message: "" };

// Messages are saved to Sanity and show up under "Messages" in the Studio
// (see src/lib/contact.ts).
export function ContactForm() {
  const [mode, setMode] = useState<"type" | "draw">("type");
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingInputRef = useRef<HTMLInputElement>(null);
  const drawing = useRef(false);
  const hasInk = useRef(false);

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
    hasInk.current = true;
  };

  const clear = () => {
    const c = canvasRef.current;
    c?.getContext("2d")?.clearRect(0, 0, c.width, c.height);
    hasInk.current = false;
  };

  // Snapshot the sketch into the hidden field right before the form is sent.
  // Strokes are redrawn black on white so the PNG reads the same in either theme.
  const onSubmit = () => {
    const input = drawingInputRef.current;
    if (!input) return;
    const c = canvasRef.current;
    if (mode !== "draw" || !c || !hasInk.current) {
      input.value = "";
      return;
    }
    const out = document.createElement("canvas");
    out.width = c.width;
    out.height = c.height;
    const ctx = out.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(c, 0, 0);
    ctx.globalCompositeOperation = "source-in";
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, out.width, out.height);
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, out.width, out.height);
    input.value = out.toDataURL("image/png");
  };

  if (state.status === "sent") {
    return (
      <section className={styles.wrap}>
        <div className={styles.card} role="status">
          <div className="eyebrow" style={{ marginBottom: 6 }}>Get In Touch</div>
          <h2 className={styles.title} style={{ marginBottom: 8 }}>Sent up the hill.</h2>
          <p className={styles.note}>Thanks. We read everything.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.wrap}>
      <form className={styles.card} action={formAction} onSubmit={onSubmit}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>Get In Touch</div>
        <h2 className={styles.title}>Send us something.</h2>

        <div className={styles.fields}>
          <input type="text" name="name" placeholder="Your name" aria-label="Your name" className={styles.input} maxLength={200} />
          <input type="email" name="email" placeholder="Your email" aria-label="Your email" className={styles.input} maxLength={320} />
        </div>

        {/* Honeypot for bots; hidden from people and screen readers. */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className={styles.honeypot} />
        <input type="hidden" name="mode" value={mode} />
        <input type="hidden" name="drawing" ref={drawingInputRef} />

        <div className={styles.modes}>
          <button type="button" className={styles.modeBtn} aria-pressed={mode === "type"} onClick={() => setMode("type")}>
            Type
          </button>
          <button
            type="button"
            className={styles.modeBtn}
            aria-pressed={mode === "draw"}
            onClick={() => {
              // Switching back to Draw mounts a fresh, empty canvas.
              if (mode !== "draw") hasInk.current = false;
              setMode("draw");
            }}
          >
            Draw
          </button>
        </div>

        {mode === "type" ? (
          <textarea
            name="message"
            placeholder="Say something atop this hill…"
            aria-label="Message"
            rows={5}
            maxLength={5000}
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
                aria-label="Drawing pad"
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

        {state.status === "error" && (
          <p className={styles.error} aria-live="polite">
            {state.message}
          </p>
        )}

        <button type="submit" className={styles.submit} disabled={pending}>
          {pending ? "Sending…" : "Send It Up The Hill"}
        </button>
      </form>
    </section>
  );
}
