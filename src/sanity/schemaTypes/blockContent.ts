import { BlockquoteIcon, ImageIcon, PlayIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

/** Rich text for article bodies. */
export const blockContent = defineType({
  name: "blockContent",
  title: "Body",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading", value: "h2" },
        { title: "Subheading", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
        ],
        annotations: [
          defineArrayMember({
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              defineField({
                name: "href",
                type: "url",
                title: "URL",
                validation: (rule) => rule.uri({ scheme: ["http", "https", "mailto"] }),
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({
      name: "inlineImage",
      title: "Image",
      type: "image",
      icon: ImageIcon,
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative Text",
          description: "Describe the image for people who can't see it.",
        }),
        defineField({ name: "caption", type: "string" }),
      ],
    }),
    defineArrayMember({
      name: "embed",
      title: "Embed (video or post)",
      type: "object",
      icon: PlayIcon,
      fields: [
        defineField({
          name: "url",
          title: "Link",
          type: "url",
          description:
            "Paste the link to a post on X, a TikTok, a YouTube or Vimeo video, or a C-SPAN / JW Player clip. Just the link, not the embed code.",
          validation: (rule) => rule.required().uri({ scheme: ["https"] }),
        }),
        defineField({ name: "caption", type: "string", description: "Optional. Shows in small type under the embed." }),
      ],
      preview: {
        select: { title: "url", subtitle: "caption" },
        prepare: ({ title, subtitle }) => ({ title: title ?? "Embed", subtitle }),
      },
    }),
    defineArrayMember({
      name: "pullQuote",
      type: "object",
      icon: BlockquoteIcon,
      fields: [
        defineField({ name: "text", type: "text", rows: 3, validation: (rule) => rule.required() }),
        defineField({ name: "attribution", type: "string" }),
      ],
      preview: {
        select: { title: "text", subtitle: "attribution" },
        prepare: ({ title, subtitle }) => ({ title: `“${title ?? ""}”`, subtitle }),
      },
    }),
  ],
});
