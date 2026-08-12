"use client";

import { blogPaths } from "@/packages/shared/config/paths";
import { buttonVariants } from "@/packages/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/packages/ui/components/card";
import Image from "next/image";
import Link from "next/link";
import { cn } from "tailwind-variants";

interface RelatedCardData {
  authorName: string | null;
  imageUrl: string | null;
  publishedDate: string | null;
  slug: string;
  tagTitle: string | null;
  title: string;
}

export function RelatedCardInner({ post }: { post: RelatedCardData }) {
  return (
    <Card className="shadow-foreground/10 shadow-md">
      <CardContent className="group">
        <div className="relative aspect-3/2 overflow-hidden rounded-xl border bg-muted">
          <Link
            className="relative block"
            href={blogPaths.post.getUrl(post.slug)}
          >
            {post.imageUrl ? (
              <Image
                alt={post.title}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                height={400}
                src={post.imageUrl}
                width={600}
              />
            ) : null}
          </Link>
        </div>
        <CardHeader className="px-0 pt-2">
          {post.tagTitle ? (
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              {post.tagTitle}
            </span>
          ) : null}
          <CardTitle className="font-semibold text-lg leading-snug tracking-tight">
            {post.title}
          </CardTitle>
          {post.authorName && post.publishedDate ? (
            <span className="text-muted-foreground text-sm">
              {post.authorName} · {post.publishedDate}
            </span>
          ) : null}
        </CardHeader>
      </CardContent>
      <CardFooter>
        <CardAction>
          <Link
            className={cn(buttonVariants({ size: "sm", variant: "secondary" }))}
            href={blogPaths.post.getUrl(post.slug)}
            prefetch
          >
            Read Article
          </Link>
        </CardAction>
      </CardFooter>
    </Card>
  );
}
