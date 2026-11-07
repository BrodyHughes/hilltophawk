import { EnvelopeIcon } from "@sanity/icons";
import { defineField, defineType, type StringInputProps } from "sanity";

// Shows the visitor's sketch as a picture instead of a wall of base64 text.
function DrawingPreview(props: StringInputProps) {
  const src = props.value;
  if (!src?.startsWith("data:image/png;base64,")) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="Visitor's drawing" style={{ maxWidth: "100%", border: "1px solid #ddd", borderRadius: 4, background: "#fff" }} />
  );
}

// Messages sent from the site's contact form. Written by the site, read here.
export const contactMessage = defineType({
  name: "contactMessage",
  title: "Message",
  type: "document",
  icon: EnvelopeIcon,
  readOnly: true,
  fields: [
    defineField({ name: "receivedAt", title: "Received", type: "datetime" }),
    defineField({ name: "name", type: "string" }),
    defineField({ name: "email", type: "string" }),
    defineField({ name: "message", type: "text", rows: 8 }),
    defineField({
      name: "drawing",
      type: "string",
      description: "Sent with the Draw option.",
      components: { input: DrawingPreview },
    }),
  ],
  orderings: [{ title: "Newest first", name: "receivedDesc", by: [{ field: "receivedAt", direction: "desc" }] }],
  preview: {
    select: { name: "name", email: "email", message: "message", drawing: "drawing", receivedAt: "receivedAt" },
    prepare: ({ name, email, message, drawing, receivedAt }) => ({
      title: name || email || "Anonymous",
      subtitle: [
        receivedAt ? new Date(receivedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : null,
        message ? String(message).slice(0, 80) : drawing ? "Drawing" : null,
      ]
        .filter(Boolean)
        .join(" · "),
    }),
  },
});
