"use client";

import Image from "next/image";
import Link from "next/link";
import { PortableText } from "next-sanity";
import { ShareBar } from "@/components/share-bar";
import type { POST_QUERY_RESULT } from "@/packages/cms/sanity.types";
import { blogPaths } from "@/packages/shared/config/paths";
import { AppIcons } from "@/packages/ui/components/app-icons";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/packages/ui/components/avatar";
import { Badge } from "@/packages/ui/components/badge";

interface PostDetailTag {
  id: string;
  slug: string;
  title: string;
}

interface PostDetailData {
  authorImageUrl: string | null;
  authorName: string | null;
  authorSlug: string | null;
  body: NonNullable<POST_QUERY_RESULT>["body"];
  initial: string;
  minutes: number;
  postImageUrl: string | null;
  publishedAtIso: string;
  publishedDate: string;
  tags: PostDetailTag[];
  title: string;
}

export function PostDetailInner({ post }: { post: PostDetailData }) {
  return (
    <>
      {/* Centered editorial header */}
      <div className="mx-auto max-w-3xl px-6">
        <header className="mt-10 flex flex-col items-center gap-6 text-center">
          {post.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {post.tags.map((tag) => (
                <Link
                  href={blogPaths.tags.detail.getUrl(tag.slug)}
                  key={tag.id}
                  prefetch
                >
                  <Badge
                    className="rounded-full px-3 py-1 hover:bg-secondary/80"
                    variant="secondary"
                  >
                    {tag.title}
                  </Badge>
                </Link>
              ))}
            </div>
          )}

          <h1 className="text-balance font-bold text-4xl leading-[1.1] tracking-tight md:text-6xl">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-muted-foreground text-sm">
            {post.authorName && post.authorSlug ? (
              <>
                <Link
                  className="group flex items-center gap-2"
                  href={blogPaths.authors.detail.getUrl(post.authorSlug)}
                  prefetch
                >
                  <Avatar className="size-7">
                    {post.authorImageUrl ? (
                      <AvatarImage
                        alt={post.authorName}
                        src={post.authorImageUrl}
                      />
                    ) : null}
                    <AvatarFallback className="text-xs">
                      {post.initial}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-foreground group-hover:underline">
                    {post.authorName}
                  </span>
                </Link>
                <span aria-hidden>·</span>
              </>
            ) : null}
            <time dateTime={post.publishedAtIso}>{post.publishedDate}</time>
            <span aria-hidden>·</span>
            <span className="flex items-center gap-1">
              <AppIcons.OneOff.Clock className="size-3.5" />
              {post.minutes} min read
            </span>
          </div>
          <ShareBar title={post.title} />
        </header>
      </div>

      {/* Breakout hero image */}
      {post.postImageUrl ? (
        <div className="mx-auto mt-12 max-w-5xl px-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-3xl border bg-muted">
            <Image
              alt={post.title}
              className="object-cover"
              height={900}
              loading="eager"
              priority
              src={post.postImageUrl}
              width={1600}
            />
          </div>
        </div>
      ) : null}

      {/* Reading column */}
      <div className="mx-auto mt-14 max-w-5xl px-6">
        <div className="prose dark:prose-invert prose-lg max-w-none prose-img:rounded-2xl prose-a:text-primary prose-headings:tracking-tight">
          {Array.isArray(post.body) && <PortableText value={post.body} />}
        </div>
      </div>
    </>
  );
}
