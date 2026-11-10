import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { COLLECTIONS } from "../../lib/collections";

export const article = defineType({
  name: "article",
  type: "document",
  icon: DocumentTextIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "details", title: "Details" },
  ],
  fieldsets: [
    {
      name: "imageVersions",
      title: "Other image versions",
      description: "Optional. Upload differently shaped versions of the cover for different spots on the site.",
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "content",
      description: "The web address: hilltophawk.com/articles/<slug>. Click Generate.",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "dek",
      title: "Subtitle",
      type: "text",
      rows: 2,
      group: "content",
      description: "One or two sentences shown under the headline and on story cards.",
      validation: (rule) => rule.required().max(280),
    }),
    defineField({
      name: "image",
      title: "Cover Image",
      type: "image",
      group: "content",
      description:
        "The main image, used for the tall cards and anywhere a version below is missing. Drag the circle (hotspot) onto the most important part so crops keep it in view.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative Text",
          description: "Describe the image for people who can't see it.",
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "wideImage",
      title: "Wide Version (optional)",
      type: "image",
      group: "content",
      fieldset: "imageVersions",
      description:
        "A landscape version, ideally 2400 × 1350. Used for the article page header and the wide spots on the home and section pages. Leave empty to use the Cover Image.",
      options: { hotspot: true },
    }),
    defineField({
      name: "squareImage",
      title: "Square Version (optional)",
      type: "image",
      group: "content",
      fieldset: "imageVersions",
      description: "A square version, ideally 1200 × 1200. Used for the small thumbnails. Leave empty to use the Cover Image.",
      options: { hotspot: true },
    }),
    defineField({
      name: "body",
      type: "blockContent",
      group: "content",
    }),
    defineField({
      name: "collection",
      type: "string",
      group: "details",
      description: "The main section this story lives in.",
      options: {
        list: COLLECTIONS.filter((c) => c.slug !== "radio").map((c) => ({ title: c.name, value: c.slug })),
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tags",
      type: "array",
      group: "details",
      description: "Optional. Each tag has its own page.",
      of: [defineArrayMember({ type: "reference", to: [{ type: "tag" }] })],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "kicker",
      title: "Label",
      type: "string",
      group: "details",
      description:
        "Optional. The small colored label above the headline. Leave empty to show the collection name (e.g. “Sports”). Examples: Fiction, Television, Sports & Culture.",
    }),
    defineField({
      name: "shareHighlight",
      title: "Share Image Highlight",
      type: "string",
      group: "details",
      description:
        "Optional. A few words copied exactly from the headline (e.g. “Eat Cake?”) to mark with the green highlighter on the share images people post to social media. Leave empty for no highlight.",
      validation: (rule) =>
        rule.custom((value, context) => {
          const title = (context.document?.title as string | undefined) ?? "";
          if (!value || title.toLowerCase().includes(value.trim().toLowerCase())) return true;
          return "These words need to match part of the headline exactly.";
        }),
    }),
    defineField({
      name: "author",
      type: "string",
      group: "details",
      initialValue: "Hill Top Hawk",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Publish Date",
      type: "date",
      group: "details",
      description: "Newest stories appear first on the home page.",
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "layout",
      type: "string",
      group: "details",
      description: "How the article page looks. Custom designs get added here as they're built.",
      options: { list: [{ title: "Standard", value: "standard" }] },
      initialValue: "standard",
    }),
  ],
  orderings: [
    { title: "Newest first", name: "dateDesc", by: [{ field: "publishedAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", collection: "collection", date: "publishedAt", media: "image" },
    prepare: ({ title, collection, date, media }) => ({
      title,
      subtitle: [COLLECTIONS.find((c) => c.slug === collection)?.name, date].filter(Boolean).join(" · "),
      media,
    }),
  },
});
