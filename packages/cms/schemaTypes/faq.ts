import { defineField, defineType } from "sanity";

export const faq = defineType({
  fields: [
    defineField({
      description: "What is the question? Do not include the '?'",
      name: "question",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "answer",
      rows: 4,
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      description: "Higher numbers sort first.",
      initialValue: 1,
      name: "order",
      title: "Order",
      type: "number",
      validation: (rule) => rule.required(),
    }),
  ],
  name: "faq",
  orderings: [
    {
      by: [{ direction: "desc", field: "order" }],
      name: "orderDesc",
      title: "Order (high to low)",
    },
  ],
  preview: {
    prepare({ question, order }) {
      return {
        subtitle: `order: ${order}`,
        title: question,
      };
    },
    select: {
      order: "order",
      question: "question",
    },
  },
  title: "FAQ",
  type: "document",
});
