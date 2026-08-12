import { defineQuery } from "groq";

// All team members, highest order first, for the home page team grid.
export const TEAMS_QUERY = defineQuery(`*[
  _type == "team"
]|order(order desc){
  _id,
  name,
  role,
  image,
  socials
}`);
