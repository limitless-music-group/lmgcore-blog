import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  fields: [
    defineField({
      name: "authorName",
      title: "Author name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "authorRole",
      title: "Author role",
      type: "string",
    }),
    defineField({
      name: "quote",
      type: "text",
      validation: (rule) => rule.required().max(500),
    }),
    defineField({
      description: "Optional — add a photo once the testimonial is approved.",
      name: "avatar",
      options: { hotspot: true },
      title: "Avatar",
      type: "image",
    }),
    defineField({
      description: "Captured at submission time, for editor context only.",
      name: "organizationName",
      readOnly: true,
      title: "Organization",
      type: "string",
    }),
    defineField({
      hidden: true,
      initialValue: "post_subscription_email",
      name: "source",
      readOnly: true,
      title: "Source",
      type: "string",
    }),
    defineField({
      description: "Higher numbers sort first.",
      initialValue: 1,
      name: "order",
      title: "Order",
      type: "number",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "submittedAt",
      readOnly: true,
      title: "Submitted at",
      type: "datetime",
    }),
  ],
  name: "testimonial",
  orderings: [
    {
      by: [{ direction: "desc", field: "order" }],
      name: "orderDesc",
      title: "Order (high to low)",
    },
  ],
  preview: {
    prepare({ authorName, authorRole }) {
      return {
        subtitle: authorRole,
        title: authorName,
      };
    },
    select: {
      authorName: "authorName",
      authorRole: "authorRole",
    },
  },
  title: "Testimonial",
  type: "document",
});
