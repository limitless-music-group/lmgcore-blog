import { defineQuery } from "groq";

// All roadmap items, ordered for column/board rendering.
export const ROADMAP_QUERY = defineQuery(`*[
  _type == "roadmapItem"
  && defined(slug.current)
]|order(priority desc, targetDate asc){
  _id,
  title,
  slug,
  status,
  description,
  priority,
  targetDate,
  shippedAt,
  featured,
  tags[]->{ _id, title, slug }
}`);

// Single roadmap item by slug.
export const ROADMAP_ITEM_QUERY = defineQuery(`*[
  _type == "roadmapItem"
  && slug.current == $slug
][0]{
  ...,
  tags[]->{ _id, title, slug }
}`);
