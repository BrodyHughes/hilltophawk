import { BlockquoteIcon, ImageIcon } from "@sanity/icons";
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
