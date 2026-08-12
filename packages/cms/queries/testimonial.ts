import { defineQuery } from "groq";

// Published testimonials, highest order first, for the home page grid.
export const TESTIMONIALS_QUERY = defineQuery(`*[
  _type == "testimonial"
]|order(order desc){
  _id,
  authorName,
  authorRole,
  quote,
  avatar
}`);
