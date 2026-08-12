"use client";

import Image from "next/image";
import Link from "next/link";
import { blogPaths } from "@/packages/shared/config/paths";
import { formatBlogDate } from "@/packages/shared/utils/formatters";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/packages/ui/components/avatar";
import { Badge } from "@/packages/ui/components/badge";
import { Card, CardContent } from "@/packages/ui/components/card";
import { Separator } from "@/packages/ui/components/separator";

interface PostTag {
  id: string;
  title: string;
}

interface FeaturedPost {
  authorName: string | null;
  imageUrl: string | null;
  publishedAt: string;
  slug: string;
  tags: PostTag[];
  title: string;
}

interface PostCard {
  authorImageUrl: string | null;
  authorName: string | null;
  id: string;
  imageUrl: string | null;
  publishedAt: string;
  slug: string;
  tags: PostTag[];
  title: string;
}

function AuthorLine({
  authorImageUrl,
  authorName,
  publishedAt,
}: {
  authorImageUrl: string | null;
  authorName: string | null;
  publishedAt: string;
}) {
  const date = formatBlogDate(publishedAt);
  if (!authorName) {
    return <span className="text-muted-foreground text-sm">{date}</span>;
  }
  return (
    <div className="flex items-center gap-2">
      <Avatar className="size-6">
        {authorImageUrl ? (
          <AvatarImage alt={authorName} src={authorImageUrl} />
        ) : null}
        <AvatarFallback className="text-xs">
          {authorName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className="text-muted-foreground text-sm">
        {authorName} · {date}
      </span>
    </div>
  );
}

function TagBadges({ tags }: { tags: PostTag[] }) {
  if (tags.length === 0) {
    return null;
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.slice(0, 3).map((tag) => (
        <Badge key={tag.id} variant="secondary">
          {tag.title}
        </Badge>
      ))}
    </div>
  );
}

export function PostsInner({
  featured,
  rest,
}: {
  featured: FeaturedPost | null;
  rest: PostCard[];
}) {
  return (
    <>
      {featured ? (
        <Link
          className="group relative mb-16 block overflow-hidden rounded-3xl border"
          href={blogPaths.post.getUrl(featured.slug)}
        >
          <div className="relative aspect-video w-full bg-muted">
            {featured.imageUrl ? (
              <Image
                alt={featured.title}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
                src={featured.imageUrl}
              />
            ) : null}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
          </div>
          <div className="absolute right-0 bottom-0 left-0 flex flex-col gap-3 p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-white/20 bg-white/15 text-white backdrop-blur-sm">
                Featured
              </Badge>
              {featured.tags.slice(0, 2).map((tag) => (
                <Badge
                  className="border-white/20 bg-white/10 text-white/90 backdrop-blur-sm"
                  key={tag.id}
                >
                  {tag.title}
                </Badge>
              ))}
            </div>
            <h2 className="max-w-2xl font-bold text-2xl text-white leading-tight tracking-tight md:text-4xl">
              {featured.title}
            </h2>
            <span className="text-sm text-white/70">
              {featured.authorName
                ? `${featured.authorName} · ${formatBlogDate(featured.publishedAt)}`
                : formatBlogDate(featured.publishedAt)}
            </span>
          </div>
        </Link>
      ) : null}

      <div className="mb-8 flex items-end justify-between">
        <h2 className="font-semibold text-xl tracking-tight">Latest posts</h2>
        <Link
          className="text-muted-foreground text-sm transition-colors hover:text-foreground"
          href={blogPaths.authors.root.getUrl()}
        >
          View authors →
        </Link>
      </div>
      <Separator className="mb-8" />

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((post) => (
          <li key={post.id}>
            <Link
              className="group block h-full"
              href={blogPaths.post.getUrl(post.slug)}
            >
              <Card className="h-full overflow-hidden pt-0 transition-colors hover:border-primary/50">
                <div className="relative aspect-3/2 overflow-hidden bg-muted">
                  {post.imageUrl ? (
                    <Image
                      alt={post.title}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      src={post.imageUrl}
                    />
                  ) : null}
                </div>
                <CardContent className="flex flex-col gap-3 px-4">
                  <TagBadges tags={post.tags} />
                  <h3 className="font-semibold text-lg leading-snug tracking-tight group-hover:underline">
                    {post.title}
                  </h3>
                  <AuthorLine
                    authorImageUrl={post.authorImageUrl}
                    authorName={post.authorName}
                    publishedAt={post.publishedAt}
                  />
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
