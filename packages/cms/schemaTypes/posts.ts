import { defineField, defineType } from "sanity";
export const posts = defineType({
  fields: [
    defineField({
      name: "image",
      options: { hotspot: true },
      title: "Image",
      type: "image",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      to: [{ type: "author" }],
      type: "reference",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tags",
      of: [{ to: [{ type: "tag" }], type: "reference" }],
      title: "Tags",
      type: "array",
      validation: (rule) => rule.required(),
    }),
    defineField({
      initialValue: () => new Date().toISOString(),
      name: "publishedAt",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
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
      name: "body",
      of: [{ type: "block" }],
      type: "array",
      validation: (rule) => rule.required(),
    }),
  ],
  name: "post",
  preview: {
    prepare({ title, author, media }) {
      return {
        media,
        subtitle: author ? `by ${author}` : undefined,
        title,
      };
    },
    select: {
      author: "author.name",
      media: "image",
      title: "title",
    },
  },
  title: "Post",
  type: "document",
});
