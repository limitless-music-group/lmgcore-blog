"use client";

import { blogPaths } from "@/packages/shared/config/paths";
import { Badge } from "@/packages/ui/components/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/packages/ui/components/card";
import Link from "next/link";

interface TagCardData {
  description: string | null;
  id: string;
  postCount: number;
  slug: string;
  title: string;
}

export function TagsInner({ tags }: { tags: TagCardData[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tags.map((tag) => (
        <li key={tag.id}>
          <Link
            className="group block h-full"
            href={blogPaths.tags.detail.getUrl(tag.slug)}
            prefetch
          >
            <Card className="h-full transition-colors group-hover:border-primary/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2 font-semibold group-hover:underline">
                  {tag.title}
                  <Badge variant="secondary">{tag.postCount}</Badge>
                </CardTitle>
                {tag.description ? (
                  <CardDescription>{tag.description}</CardDescription>
                ) : null}
              </CardHeader>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}
