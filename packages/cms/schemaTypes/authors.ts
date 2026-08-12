import { defineField, defineType } from "sanity";

export const authors = defineType({
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      options: { source: "name" },
      type: "slug",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      options: { hotspot: true },
      title: "Avatar",
      type: "image",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "bio",
      of: [{ type: "block" }],
      type: "array",
      validation: (rule) => rule.required(),
    }),
  ],
  name: "author",
  preview: {
    select: {
      media: "image",
      title: "name",
    },
  },
  title: "Author",
  type: "document",
});
