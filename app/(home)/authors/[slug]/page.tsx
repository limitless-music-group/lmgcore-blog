import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { client } from "@/packages/cms/client";
import { urlFor } from "@/packages/cms/image";
import {
  AUTHOR_QUERY,
  AUTHOR_SLUGS_QUERY,
  SANITY_QUERY_OPTIONS,
} from "@/packages/cms/queries";
import type { AUTHOR_QUERY_RESULT } from "@/packages/cms/sanity.types";
import { createBlogMetadata } from "@/packages/seo/blog.metadata";
import { blogPaths } from "@/packages/shared/config/paths";
import { BackLink } from "@/packages/ui/components/created/back-link";
import { AuthorDetailInner } from "./inner";

// * Cache Components: params is request-time data unless the slugs are known at
// * build, so every author is enumerated here and pre-rendered statically.
export function generateStaticParams() {
  return client.fetch<{ slug: string }[]>(AUTHOR_SLUGS_QUERY);
}

// Shared by generateMetadata and the page body so the author is only fetched
// once per revalidation window instead of twice per request.
async function getAuthor(slug: string) {
  "use cache";
  cacheLife("hours");
  return client.fetch<AUTHOR_QUERY_RESULT>(
    AUTHOR_QUERY,
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
  const author = await getAuthor(slug);
  if (!author) {
    return createBlogMetadata({
      description: "This author could not be found.",
      title: "Author not found",
    });
  }
  const ogImage = author.image
    ? (urlFor(author.image)?.width(1200).height(630).url() ?? undefined)
    : undefined;
  return createBlogMetadata({
    description: `Posts and stories by ${author.name} on the LMG Core blog.`,
    image: ogImage,
    openGraph: { type: "profile" },
    title: `${author.name} | Authors`,
  });
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();
  const { slug } = await params;
  const author = await getAuthor(slug);
  if (!author) {
    notFound();
  }

  // urlFor reads server-only Sanity env — resolve here (Server Component)
  // and pass plain strings down, since <AuthorDetailInner> is a Client Component.
  const authorImageUrl = author.image
    ? (urlFor(author.image)?.width(120).height(120).url() ?? null)
    : null;
  const posts = (author.posts ?? []).map((post) => ({
    id: post._id,
    publishedDate: new Date(post.publishedAt).toLocaleDateString(),
    slug: post.slug.current,
    title: post.title,
  }));

  return (
    <main className="container mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-10">
      <BackLink href={blogPaths.authors.root.getUrl()}>
        Back to authors
      </BackLink>
      <AuthorDetailInner
        author={{
          bio: author.bio,
          imageUrl: authorImageUrl,
          name: author.name,
          posts,
        }}
      />
    </main>
  );
}
