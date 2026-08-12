import { defineQuery } from "groq";

export const POST_QUERY =
  defineQuery(`*[_type == "post" && slug.current == $slug][0]{
  ...,
  author->{name, slug, image},
  tags[]->{_id, title, slug}
}`);

export const POSTS_QUERY = defineQuery(
  `*[ _type == "post" && defined(slug.current)]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt, image, author->{name, slug, image}, tags[]->{_id, title, slug}}`
);

export const POST_SLUGS_QUERY = defineQuery(
  `*[_type == "post" && defined(slug.current)]{"slug": slug.current}`
);
