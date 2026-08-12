import { defineQuery } from "groq";

export const AUTHOR_QUERY = defineQuery(`*[
  _type == "author"
  && slug.current == $slug
][0]{
  _id,
  name,
  slug,
  image,
  bio,
  "posts": *[
    _type == "post"
    && references(^._id)
    && defined(slug.current)
  ]|order(publishedAt desc){
    _id,
    title,
    slug,
    publishedAt,
    image
  }
}`);

export const AUTHOR_SLUGS_QUERY = defineQuery(
  `*[_type == "author" && defined(slug.current)]{"slug": slug.current}`
);

export const AUTHORS_QUERY = defineQuery(`*[
  _type == "author"
  && defined(slug.current)
]|order(name asc){
  _id,
  name,
  slug,
  image,
  "posts": *[
    _type == "post"
    && references(^._id)
    && defined(slug.current)
  ]|order(publishedAt desc){
    _id,
    title,
    slug,
    publishedAt
  }
}`);
