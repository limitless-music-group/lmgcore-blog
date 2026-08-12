"use client";

import Image from "next/image";
import Link from "next/link";
import { blogPaths } from "@/packages/shared/config/paths";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/packages/ui/components/avatar";

interface TagPostData {
  authorImageUrl: string | null;
  authorName: string | null;
  id: string;
  imageUrl: string | null;
  publishedDate: string;
  slug: string;
  title: string;
}

function AuthorLine({
  authorImageUrl,
  authorName,
  publishedDate,
}: {
  authorImageUrl: string | null;
  authorName: string | null;
  publishedDate: string;
}) {
  if (!authorName) {
    return (
      <span className="text-muted-foreground text-sm">{publishedDate}</span>
    );
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
        {authorName} · {publishedDate}
      </span>
    </div>
  );
}

export function TagDetailInner({
  description,
  posts,
  title,
}: {
  description: string | null;
  posts: TagPostData[];
  title: string;
}) {
  return (
    <>
      <header className="flex flex-col gap-2 border-border/60 border-b pb-6">
        <span className="font-medium text-muted-foreground text-sm uppercase tracking-widest">
          Tag
        </span>
        <h1 className="font-bold text-4xl tracking-tight">{title}</h1>
        {description ? (
          <p className="max-w-xl text-muted-foreground">{description}</p>
        ) : null}
      </header>
      <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              className="group flex flex-col gap-3"
              href={blogPaths.post.getUrl(post.slug)}
              prefetch
            >
              <div className="relative aspect-3/2 overflow-hidden rounded-xl bg-muted">
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
              <h2 className="font-semibold text-lg leading-snug tracking-tight group-hover:underline">
                {post.title}
              </h2>
              <AuthorLine
                authorImageUrl={post.authorImageUrl}
                authorName={post.authorName}
                publishedDate={post.publishedDate}
              />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
