import type { POST_QUERY_RESULT } from "@/packages/cms/sanity.types";
import type { PortableTextBlock } from "next-sanity";

type Post = NonNullable<POST_QUERY_RESULT>;

const WORDS_PER_MINUTE = 200;
const WHITESPACE = /\s+/;
const EXCERPT_LENGTH = 160;

function plainText(body: Post["body"]) {
  if (!Array.isArray(body)) {
    return "";
  }
  return (body as PortableTextBlock[])
    .filter((block) => block._type === "block")
    .flatMap((block) =>
      Array.isArray(block.children)
        ? block.children.map((child) =>
            typeof child.text === "string" ? child.text : ""
          )
        : []
    )
    .join(" ")
    .trim();
}

export function excerpt(body: Post["body"]) {
  const text = plainText(body);
  if (text.length <= EXCERPT_LENGTH) {
    return text;
  }
  return `${text.slice(0, EXCERPT_LENGTH).trimEnd()}…`;
}

// Rank candidates by shared tags, then fall back to recency (query order).

export function readingTime(body: Post["body"]) {
  if (!Array.isArray(body)) {
    return 1;
  }
  const words = (body as PortableTextBlock[])
    .filter((block) => block._type === "block")
    .flatMap((block) =>
      Array.isArray(block.children)
        ? block.children.map((child) =>
            typeof child.text === "string" ? child.text : ""
          )
        : []
    )
    .join(" ")
    .trim()
    .split(WHITESPACE)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
