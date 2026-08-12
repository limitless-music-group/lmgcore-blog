import { defineQuery } from "groq";

export const TAG_QUERY = defineQuery(`*[
  _type == "tag"
  && slug.current == $slug
][0]{
  _id,
  title,
  slug,
  description,
  "posts": *[
    _type == "post"
    && references(^._id)
    && defined(slug.current)
  ]|order(publishedAt desc){
    _id,
    title,
    slug,
    publishedAt,
    image,
    author->{name, slug, image}
  }
}`);

export const TAG_SLUGS_QUERY = defineQuery(
  `*[_type == "tag" && defined(slug.current)]{"slug": slug.current}`
);

export const TAGS_QUERY = defineQuery(`*[
  _type == "tag"
  && defined(slug.current)
]|order(title asc){
  _id,
  title,
  slug,
  description,
  "postCount": count(*[_type == "post" && references(^._id)])
}`);
