"use client";

import Link from "next/link";
import { PortableText } from "next-sanity";
import type { AUTHOR_QUERY_RESULT } from "@/packages/cms/sanity.types";
import { blogPaths } from "@/packages/shared/config/paths";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/packages/ui/components/avatar";
import { Badge } from "@/packages/ui/components/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/packages/ui/components/card";

interface AuthorPostData {
  id: string;
  publishedDate: string;
  slug: string;
  title: string;
}

interface AuthorDetailData {
  bio: NonNullable<AUTHOR_QUERY_RESULT>["bio"];
  imageUrl: string | null;
  name: string;
  posts: AuthorPostData[];
}

export function AuthorDetailInner({ author }: { author: AuthorDetailData }) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-4 border-border/60 border-b pb-6">
        <Avatar className="size-16">
          {author.imageUrl ? (
            <AvatarImage alt={author.name} src={author.imageUrl} />
          ) : null}
          <AvatarFallback className="text-xl">
            {author.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-4xl tracking-tight">{author.name}</h1>
          <Badge className="w-fit" variant="secondary">
            {author.posts.length} posts
          </Badge>
        </div>
      </div>
      {Array.isArray(author.bio) && (
        <div className="prose dark:prose-invert max-w-none">
          <PortableText value={author.bio} />
        </div>
      )}
      <h2 className="font-semibold text-2xl tracking-tight">Posts</h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {author.posts.map((post) => (
          <li key={post.id}>
            <Link
              className="group block h-full"
              href={blogPaths.post.getUrl(post.slug)}
              prefetch
            >
              <Card className="h-full transition-colors group-hover:border-primary/50">
                <CardHeader>
                  <CardTitle className="font-semibold group-hover:underline">
                    {post.title}
                  </CardTitle>
                  <CardDescription>
                    <Badge variant="secondary">{post.publishedDate}</Badge>
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
