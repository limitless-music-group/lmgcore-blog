import { client } from "@/packages/cms/client";
import { urlFor } from "@/packages/cms/image";
import {
  POST_QUERY,
  POST_SLUGS_QUERY,
  POSTS_QUERY,
  SANITY_QUERY_OPTIONS,
} from "@/packages/cms/queries";
import type {
  POST_QUERY_RESULT,
  POSTS_QUERY_RESULT,
} from "@/packages/cms/sanity.types";
import { createBlogMetadata } from "@/packages/seo/blog.metadata";
import { blogPaths } from "@/packages/shared/config/paths";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { RelatedCard, relatedPosts } from "./_components/related-card";
import { excerpt, readingTime } from "./_helpers";
import { PostDetailInner } from "./inner";

// * Cache Components: params is request-time data unless the slugs are known at
// * build, so every post is enumerated here and pre-rendered statically.
export function generateStaticParams() {
  return client.fetch<{ slug: string }[]>(POST_SLUGS_QUERY);
}

// Shared by generateMetadata and the page body so the post is only fetched
// once per revalidation window instead of twice per request.
async function getPost(slug: string) {
  "use cache";
  cacheLife("minutes");
  return client.fetch<POST_QUERY_RESULT>(
    POST_QUERY,
    { slug },
    SANITY_QUERY_OPTIONS.THIRTY_SECONDS
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    return createBlogMetadata({
      description: "This post could not be found.",
      title: "Post not found",
    });
  }
  const ogImage = post.image
    ? (urlFor(post.image)?.width(1200).height(630).url() ?? undefined)
    : undefined;
  return createBlogMetadata({
    description:
      excerpt(post.body) || `Read ${post.title} on the LMG Core blog.`,
    image: ogImage,
    openGraph: { publishedTime: post.publishedAt, type: "article" },
    title: post.title,
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    notFound();
  }

  // urlFor reads server-only Sanity env — resolve here (Server Component)
  // and pass plain strings down, since <PostDetailInner> is a Client Component.
  const postImageUrl = post.image
    ? (urlFor(post.image)?.width(1600).height(900).url() ?? null)
    : null;
  const authorImageUrl = post.author?.image
    ? (urlFor(post.author.image)?.width(96).height(96).url() ?? null)
    : null;
  const publishedDate = new Date(post.publishedAt).toLocaleDateString(
    undefined,
    { day: "numeric", month: "long", year: "numeric" }
  );
  const minutes = readingTime(post.body);
  const initial = post.author?.name?.charAt(0).toUpperCase() ?? "?";

  return (
    <article className="py-6 md:py-10">
      <PostDetailInner
        post={{
          authorImageUrl,
          authorName: post.author?.name ?? null,
          authorSlug: post.author?.slug.current ?? null,
          body: post.body,
          initial,
          minutes,
          postImageUrl,
          publishedAtIso: post.publishedAt,
          publishedDate,
          tags: (post.tags ?? []).map((tag) => ({
            id: tag._id,
            slug: tag.slug.current,
            title: tag.title,
          })),
          title: post.title,
        }}
      />

      {/* Related articles */}
      <Suspense>
        <RelatedSection currentPost={post} />
      </Suspense>
    </article>
  );
}

async function RelatedSection({
  currentPost,
}: {
  currentPost: NonNullable<POST_QUERY_RESULT>;
}) {
  const allPosts = await client.fetch<POSTS_QUERY_RESULT>(
    POSTS_QUERY,
    {},
    SANITY_QUERY_OPTIONS.THIRTY_SECONDS
  );
  const related = relatedPosts(allPosts, currentPost);

  if (related.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto mt-20 max-w-5xl px-6">
      <div className="mb-8 flex items-end justify-between border-border/60 border-b pb-3">
        <h2 className="font-semibold text-2xl tracking-tight">
          Related articles
        </h2>
        <Link
          className="text-muted-foreground text-sm transition-colors hover:text-foreground"
          href={blogPaths.home.getUrl()}
        >
          View all →
        </Link>
      </div>
      <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((item) => (
          <li key={item._id}>
            <RelatedCard post={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}
