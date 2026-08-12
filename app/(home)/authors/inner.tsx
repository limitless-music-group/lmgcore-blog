"use client";

import Link from "next/link";
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

interface AuthorCardData {
  id: string;
  imageUrl: string | null;
  name: string;
  postCount: number;
  slug: string;
}

export function AuthorsInner({ authors }: { authors: AuthorCardData[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {authors.map((author) => (
        <li key={author.id}>
          <Link
            className="group block h-full"
            href={blogPaths.authors.detail.getUrl(author.slug)}
            prefetch
          >
            <Card className="h-full transition-colors group-hover:border-primary/50">
              <CardHeader className="flex flex-row items-center gap-3">
                <Avatar className="size-10">
                  {author.imageUrl ? (
                    <AvatarImage alt={author.name} src={author.imageUrl} />
                  ) : null}
                  <AvatarFallback>
                    {author.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <CardTitle className="font-semibold group-hover:underline">
                    {author.name}
                  </CardTitle>
                  <CardDescription>
                    <Badge variant="secondary">{author.postCount} posts</Badge>
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}
