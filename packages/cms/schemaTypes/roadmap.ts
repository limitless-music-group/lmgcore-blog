import { defineField, defineType } from "sanity";

export const roadmapItem = defineType({
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
      initialValue: "planned",
      name: "status",
      options: {
        layout: "radio",
        list: [
          { title: "Planned", value: "planned" },
          { title: "In Progress", value: "in-progress" },
          { title: "Shipped", value: "shipped" },
        ],
      },
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      rows: 3,
      title: "Short Description",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      of: [{ type: "block" }],
      title: "Details",
      type: "array",
    }),
    defineField({
      name: "tags",
      of: [{ to: [{ type: "tag" }], type: "reference" }],
      title: "Tags",
      type: "array",
    }),
    defineField({
      description: "Higher numbers sort first within a status column.",
      initialValue: 1,
      name: "priority",
      title: "Priority",
      type: "number",
    }),
    defineField({
      name: "targetDate",
      title: "Target Date",
      type: "datetime",
    }),
    defineField({
      hidden: ({ parent }) => parent?.status !== "shipped",
      name: "shippedAt",
      title: "Shipped At",
      type: "datetime",
    }),
    defineField({
      description: "Highlight this item on the roadmap.",
      initialValue: false,
      name: "featured",
      title: "Featured",
      type: "boolean",
    }),
  ],
  name: "roadmapItem",
  orderings: [
    {
      by: [{ direction: "desc", field: "priority" }],
      name: "priorityDesc",
      title: "Priority (high to low)",
    },
    {
      by: [{ direction: "asc", field: "targetDate" }],
      name: "targetDateAsc",
      title: "Target Date",
    },
  ],
  preview: {
    prepare({ title, status, featured }) {
      return {
        subtitle: `${status ?? "planned"}${featured ? " · featured" : ""}`,
        title,
      };
    },
    select: {
      featured: "featured",
      status: "status",
      title: "title",
    },
  },
  title: "Roadmap Item",
  type: "document",
});
