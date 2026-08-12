import { defineField, defineType } from "sanity";

export const team = defineType({
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      options: { hotspot: true },
      type: "image",
      validation: (rule) => rule.required(),
    }),
    defineField({
      fields: [
        defineField({
          name: "website",
          placeholder: "https://www.example.com",
          title: "Website",
          type: "url",
        }),
        defineField({
          name: "linkedin",
          placeholder: "https://www.linkedin.com/in/john-doe",
          title: "LinkedIn",
          type: "url",
        }),
      ],
      name: "socials",
      title: "Socials",
      type: "object",
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
  name: "team",
  orderings: [
    {
      by: [{ direction: "desc", field: "order" }],
      name: "orderDesc",
      title: "Order (high to low)",
    },
  ],
  preview: {
    prepare({ name, role }) {
      return {
        subtitle: role,
        title: name,
      };
    },
    select: {
      name: "name",
      role: "role",
    },
  },
  title: "Team Member",
  type: "document",
});
