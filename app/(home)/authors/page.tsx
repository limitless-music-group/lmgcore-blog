import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { client } from "@/packages/cms/client";
import { urlFor } from "@/packages/cms/image";
import { AUTHORS_QUERY, SANITY_QUERY_OPTIONS } from "@/packages/cms/queries";
import type { AUTHORS_QUERY_RESULT } from "@/packages/cms/sanity.types";
import { createBlogMetadata } from "@/packages/seo/blog.metadata";
import { blogPaths } from "@/packages/shared/config/paths";
import { AppIcons } from "@/packages/ui/components/app-icons";
import { BackLink } from "@/packages/ui/components/created/back-link";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/packages/ui/components/empty";
import { AuthorsInner } from "./inner";

export const metadata: Metadata = createBlogMetadata({
  description: "Meet the writers behind the LMG Core blog.",
  title: "Authors",
});

export default function AuthorsPage() {
  return (
    <main className="container mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-10">
      <BackLink href={blogPaths.home.getUrl()}>Back to stories</BackLink>
      <header className="flex flex-col gap-2 border-border/60 border-b pb-6">
        <h1 className="font-bold text-4xl tracking-tight">Authors</h1>
        <p className="text-muted-foreground">Everyone writing here.</p>
      </header>
      <Suspense>
        <AuthorsContent />
      </Suspense>
    </main>
  );
}

async function AuthorsContent() {
  "use cache";
  cacheLife("hours");
  const authors = await client.fetch<AUTHORS_QUERY_RESULT>(
    AUTHORS_QUERY,
    {},
    SANITY_QUERY_OPTIONS.THIRTY_SECONDS
  );

  if (authors.length === 0) {
    return (
      <Empty>
        <EmptyContent>
          <EmptyMedia>
            <AppIcons.Common.X className="text-destructive" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No Authors Yet</EmptyTitle>
            <EmptyDescription>Check back soon</EmptyDescription>
          </EmptyHeader>
        </EmptyContent>
      </Empty>
    );
  }

  // urlFor reads server-only Sanity env — resolve here (Server Component)
  // and pass plain strings down, since <AuthorsInner> is a Client Component.
  const items = authors.map((author) => ({
    id: author._id,
    imageUrl: author.image
      ? (urlFor(author.image)?.width(80).height(80).url() ?? null)
      : null,
    name: author.name,
    postCount: author.posts?.length ?? 0,
    slug: author.slug.current,
  }));

  return <AuthorsInner authors={items} />;
}
