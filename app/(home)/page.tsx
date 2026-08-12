import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { client } from "@/packages/cms/client";
import { urlFor } from "@/packages/cms/image";
import { POSTS_QUERY, SANITY_QUERY_OPTIONS } from "@/packages/cms/queries";
import type { POSTS_QUERY_RESULT } from "@/packages/cms/sanity.types";
import { createBlogMetadata } from "@/packages/seo/blog.metadata";
import { AppIcons } from "@/packages/ui/components/app-icons";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/packages/ui/components/empty";
import { PostsInner } from "./inner";

export const metadata: Metadata = createBlogMetadata({
  description:
    "Product updates, engineering deep-dives, and stories from the LMG Core team.",
  title: "Home",
});

export default function Home() {
  return (
    <main className="container mx-auto max-w-5xl px-6 py-12">
      <header className="mb-12 flex flex-col gap-3">
        <h1 className="font-bold text-5xl tracking-tight">Blog</h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Product updates, engineering deep-dives, and stories from the team.
        </p>
      </header>

      <Suspense>
        <PostsContent />
      </Suspense>
    </main>
  );
}

async function PostsContent() {
  "use cache";
  cacheLife("minutes");
  const posts = await client.fetch<POSTS_QUERY_RESULT>(
    POSTS_QUERY,
    {},
    SANITY_QUERY_OPTIONS.THIRTY_SECONDS
  );

  if (posts.length === 0) {
    return (
      <Empty>
        <EmptyContent>
          <EmptyMedia>
            <AppIcons.Common.X className="text-destructive" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No Posts Yet</EmptyTitle>
            <EmptyDescription>Check back soon</EmptyDescription>
          </EmptyHeader>
        </EmptyContent>
      </Empty>
    );
  }

  const [featuredPost, ...restPosts] = posts;

  // urlFor reads server-only Sanity env — resolve here (Server Component)
  // and pass plain strings down, since <PostsInner> is a Client Component.
  const featured = featuredPost
    ? {
        authorName: featuredPost.author?.name ?? null,
        imageUrl: featuredPost.image
          ? (urlFor(featuredPost.image)?.width(1600).height(900).url() ?? null)
          : null,
        publishedAt: featuredPost.publishedAt,
        slug: featuredPost.slug.current,
        tags: (featuredPost.tags ?? []).map((tag) => ({
          id: tag._id,
          title: tag.title,
        })),
        title: featuredPost.title,
      }
    : null;

  const rest = restPosts.map((post) => ({
    authorImageUrl: post.author?.image
      ? (urlFor(post.author.image)?.width(48).height(48).url() ?? null)
      : null,
    authorName: post.author?.name ?? null,
    id: post._id,
    imageUrl: post.image
      ? (urlFor(post.image)?.width(600).height(400).url() ?? null)
      : null,
    publishedAt: post.publishedAt,
    slug: post.slug.current,
    tags: (post.tags ?? []).map((tag) => ({ id: tag._id, title: tag.title })),
    title: post.title,
  }));

  return <PostsInner featured={featured} rest={rest} />;
}
