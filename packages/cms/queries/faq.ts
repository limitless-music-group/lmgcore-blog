import { defineQuery } from "groq";

// All FAQs, highest order first, for the about page accordion.
export const FAQS_QUERY = defineQuery(`*[
  _type == "faq"
]|order(order desc){
  _id,
  question,
  answer
}`);
