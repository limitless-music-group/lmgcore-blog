import { defineArrayMember, defineField, defineType } from "sanity";

export const changelog = defineType({
  fields: [
    defineField({
      name: "version",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      description: "One-line summary shown as the release headline.",
      name: "summary",
      rows: 2,
      title: "Summary",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "groups",
      of: [
        defineArrayMember({
          fields: [
            defineField({
              name: "type",
              options: {
                layout: "radio",
                list: [
                  { title: "Added", value: "Added" },
                  { title: "Improved", value: "Improved" },
                  { title: "Fixed", value: "Fixed" },
                ],
              },
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "items",
              of: [{ type: "string" }],
              type: "array",
              validation: (rule) => rule.required().min(1),
            }),
          ],
          name: "changeGroup",
          preview: {
            prepare({ type, items }) {
              return {
                subtitle: `${items?.length ?? 0} item(s)`,
                title: type ?? "Untitled group",
              };
            },
            select: {
              items: "items",
              type: "type",
            },
          },
          type: "object",
        }),
      ],
      title: "Change Groups",
      type: "array",
      validation: (rule) => rule.required().min(1),
    }),
  ],
  name: "release",
  orderings: [
    {
      by: [{ direction: "desc", field: "date" }],
      name: "dateDesc",
      title: "Date (newest first)",
    },
  ],
  preview: {
    prepare({ version, summary }) {
      return {
        subtitle: summary,
        title: version ? `v${version}` : "Untitled release",
      };
    },
    select: {
      summary: "summary",
      version: "version",
    },
  },
  title: "Changelog Release",
  type: "document",
});
