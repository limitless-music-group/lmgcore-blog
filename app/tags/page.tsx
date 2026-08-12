import { client } from "@/packages/cms/client";
import { SANITY_QUERY_OPTIONS, TAGS_QUERY } from "@/packages/cms/queries";
import type { TAGS_QUERY_RESULT } from "@/packages/cms/sanity.types";
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
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { TagsInner } from "./inner";

export const metadata: Metadata = createBlogMetadata({
  description: "Browse posts by topic on the LMG Core blog.",
  title: "Tags",
});

export default function TagsPage() {
  return (
    <main className="container mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-10">
      <BackLink href={blogPaths.home.getUrl()}>Back to blog</BackLink>
      <header className="flex flex-col gap-2 border-border/60 border-b pb-6">
        <h1 className="font-bold text-4xl tracking-tight">Tags</h1>
        <p className="text-muted-foreground">Browse posts by topic.</p>
      </header>
      <Suspense>
        <TagsContent />
      </Suspense>
    </main>
  );
}

async function TagsContent() {
  "use cache";
  cacheLife("hours");
  const tags = await client.fetch<TAGS_QUERY_RESULT>(
    TAGS_QUERY,
    {},
    SANITY_QUERY_OPTIONS.THIRTY_SECONDS
  );

  if (tags.length === 0) {
    return (
      <Empty>
        <EmptyContent>
          <EmptyMedia>
            <AppIcons.Common.X className="text-destructive" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No Tags Yet</EmptyTitle>
            <EmptyDescription>Check back soon</EmptyDescription>
          </EmptyHeader>
        </EmptyContent>
      </Empty>
    );
  }

  const items = tags.map((tag) => ({
    description: tag.description ?? null,
    id: tag._id,
    postCount: tag.postCount ?? 0,
    slug: tag.slug.current,
    title: tag.title,
  }));

  return <TagsInner tags={items} />;
}
