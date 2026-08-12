import { defineField, defineType } from "sanity";

export const tags = defineType({
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      options: { source: "title" },
      type: "slug",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      rows: 2,
      type: "text",
    }),
  ],
  name: "tag",
  preview: {
    select: {
      subtitle: "slug.current",
      title: "title",
    },
  },
  title: "Tag",
  type: "document",
});
