import { urlFor } from "@/packages/cms/image";
import type {
  POST_QUERY_RESULT,
  POSTS_QUERY_RESULT,
} from "@/packages/cms/sanity.types";
import { RelatedCardInner } from "./related-card-inner";

type ListPost = POSTS_QUERY_RESULT[number];
type Post = NonNullable<POST_QUERY_RESULT>;

const RELATED_LIMIT = 3;

// Rank candidates by shared tags, then fall back to recency (query order).
export function relatedPosts(all: ListPost[], current: Post): ListPost[] {
  const currentTagIds = new Set((current.tags ?? []).map((tag) => tag._id));
  return all
    .filter((post) => post.slug.current !== current.slug.current)
    .map((post) => ({
      post,
      score: (post.tags ?? []).filter((tag) => currentTagIds.has(tag._id))
        .length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, RELATED_LIMIT)
    .map((entry) => entry.post);
}

// urlFor reads server-only Sanity env — resolve here (Server Component)
// and pass plain strings down, since <RelatedCardInner> is a Client Component.
export function RelatedCard({ post }: { post: ListPost }) {
  const imageUrl = post.image
    ? (urlFor(post.image)?.width(600).height(400).url() ?? null)
    : null;
  return (
    <RelatedCardInner
      post={{
        authorName: post.author?.name ?? null,
        imageUrl,
        publishedDate: post.publishedAt
          ? new Date(post.publishedAt).toLocaleDateString(undefined, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : null,
        slug: post.slug.current,
        tagTitle: post.tags?.[0]?.title ?? null,
        title: post.title,
      }}
    />
  );
}
