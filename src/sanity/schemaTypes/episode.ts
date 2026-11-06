import { MicrophoneIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const episode = defineType({
  name: "episode",
  title: "Radio Episode",
  type: "document",
  icon: MicrophoneIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "number",
      title: "Episode Number",
      type: "number",
      validation: (rule) => rule.required().integer().positive(),
    }),
    defineField({
      name: "length",
      type: "string",
      description: "Running time, e.g. 41:12",
      validation: (rule) =>
        rule.required().regex(/^\d{1,3}:\d{2}(:\d{2})?$/, { name: "time", invert: false }),
    }),
    defineField({
      name: "image",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "audioUrl",
      title: "Audio Link",
      type: "url",
      description: "Optional for now. Link to the audio file or the episode on the podcast host.",
    }),
  ],
  orderings: [{ title: "Newest first", name: "numberDesc", by: [{ field: "number", direction: "desc" }] }],
  preview: {
    select: { title: "title", number: "number", media: "image" },
    prepare: ({ title, number, media }) => ({ title, subtitle: number ? `Ep. ${number}` : undefined, media }),
  },
});
