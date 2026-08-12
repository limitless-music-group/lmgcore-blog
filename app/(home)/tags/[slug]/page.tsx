import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { client } from "@/packages/cms/client";
import { urlFor } from "@/packages/cms/image";
import {
  SANITY_QUERY_OPTIONS,
  TAG_QUERY,
  TAG_SLUGS_QUERY,
} from "@/packages/cms/queries";
import type { TAG_QUERY_RESULT } from "@/packages/cms/sanity.types";
import { createBlogMetadata } from "@/packages/seo/blog.metadata";
import { blogPaths } from "@/packages/shared/config/paths";
import { BackLink } from "@/packages/ui/components/created/back-link";
import { TagDetailInner } from "./inner";

// * Cache Components: params is request-time data unless the slugs are known at
// * build, so every tag is enumerated here and pre-rendered statically.
export function generateStaticParams() {
  return client.fetch<{ slug: string }[]>(TAG_SLUGS_QUERY);
}

// Shared by generateMetadata and the page body so the tag is only fetched
// once per revalidation window instead of twice per request.
async function getTag(slug: string) {
  "use cache";
  cacheLife("hours");
  return client.fetch<TAG_QUERY_RESULT>(
    TAG_QUERY,
    { slug },
    SANITY_QUERY_OPTIONS.THIRTY_SECONDS
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  "use cache";
  cacheLife("hours");
  const { slug } = await params;
  const tag = await getTag(slug);
  if (!tag) {
    return createBlogMetadata({
      description: "This tag could not be found.",
      title: "Tag not found",
    });
  }
  return createBlogMetadata({
    description:
      tag.description ?? `Posts tagged “${tag.title}” on the LMG Core blog.`,
    title: `${tag.title} | Tags`,
  });
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  "use cache";
  cacheLife("hours");
  const { slug } = await params;
  const tag = await getTag(slug);
  if (!tag) {
    notFound();
  }

  // urlFor reads server-only Sanity env — resolve here (Server Component)
  // and pass plain strings down, since <TagDetailInner> is a Client Component.
  const posts = (tag.posts ?? []).map((post) => ({
    authorImageUrl: post.author?.image
      ? (urlFor(post.author.image)?.width(48).height(48).url() ?? null)
      : null,
    authorName: post.author?.name ?? null,
    id: post._id,
    imageUrl: post.image
      ? (urlFor(post.image)?.width(600).height(400).url() ?? null)
      : null,
    publishedDate: new Date(post.publishedAt).toLocaleDateString(),
    slug: post.slug.current,
    title: post.title,
  }));

  return (
    <Suspense>
      <main className="container mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-10">
        <BackLink href={blogPaths.tags.root.getUrl()}>Back to tags</BackLink>
        <TagDetailInner
          description={tag.description ?? null}
          posts={posts}
          title={tag.title}
        />
      </main>
    </Suspense>
  );
}
