"use server";

import { randomUUID } from "node:crypto";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export type ContactState = { status: "idle" | "sent" | "error"; message: string };

const MAX_TEXT = 5000;
// A PNG of the 576x220 sketch pad is ~10-60 KB; anything far bigger isn't from our canvas.
const MAX_DRAWING = 400_000;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Saves a contact-form message to Sanity, where it shows up under "Messages" in
// the Studio. The document ID contains a dot ("contact.<uuid>"), which keeps it
// out of the public dataset's anonymous API: only logged-in editors and the
// write token can read it. The sketch is stored inside the document as a PNG
// data URL (not as an image asset) for the same reason: assets are public.
export async function sendContactMessage(_prev: ContactState, form: FormData): Promise<ContactState> {
  const field = (key: string) => String(form.get(key) ?? "").trim();

  // Honeypot: real visitors never see or fill this field.
  if (field("website")) return { status: "sent", message: "Sent up the hill. Thanks." };

  const name = field("name").slice(0, 200);
  const email = field("email").slice(0, 320);
  const mode = field("mode") === "draw" ? "draw" : "type";
  const text = mode === "type" ? field("message") : "";
  const drawing = mode === "draw" ? field("drawing") : "";

  if (email && !EMAIL.test(email)) return { status: "error", message: "That email doesn't look right." };
  if (mode === "type" && !text) return { status: "error", message: "Write something first." };
  if (mode === "draw" && !drawing) return { status: "error", message: "Draw something first." };
  if (text.length > MAX_TEXT) return { status: "error", message: "That's a lot. Keep it under 5,000 characters." };
  if (drawing && (!drawing.startsWith("data:image/png;base64,") || drawing.length > MAX_DRAWING)) {
    return { status: "error", message: "That sketch didn't come through. Try again." };
  }

  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) {
    console.error("contact form: SANITY_API_WRITE_TOKEN is not set");
    return { status: "error", message: "Couldn't send right now. Try again later." };
  }

  try {
    await createClient({ projectId, dataset, apiVersion, token, useCdn: false }).create({
      _id: `contact.${randomUUID()}`,
      _type: "contactMessage",
      name: name || undefined,
      email: email || undefined,
      message: text || undefined,
      drawing: drawing || undefined,
      receivedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("contact form: failed to save message", err);
    return { status: "error", message: "Couldn't send right now. Try again later." };
  }

  return { status: "sent", message: "Sent up the hill. Thanks." };
}
