import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const tag = defineType({
  name: "tag",
  type: "document",
  icon: TagIcon,
  description: "A topic that cuts across collections, like Mets or Fiction Friday. Every tag gets its own page.",
  fields: [
    defineField({
      name: "name",
      type: "string",
      description: "Shown with a # in front, e.g. “Mets” becomes #Mets.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      description: "The web address: hilltophawk.com/tag/<slug>. Click Generate.",
      options: { source: "name", maxLength: 64 },
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [{ title: "Name", name: "nameAsc", by: [{ field: "name", direction: "asc" }] }],
});
