import merge from "lodash.merge";
import type { Metadata } from "next";
import { externalPaths } from "@/packages/shared/config/paths";

type MetadataGenerator = Omit<Metadata, "description" | "title"> & {
  title: string;
  description: string;
  image?: string;
};

const applicationName = "LMG Core Blog";
const author: Metadata["authors"] = {
  name: "Limitless Music Group",
  url: externalPaths.limitless_music_group.getHref(),
};
const publisher = "Limitless Music Group";
const twitterHandle = "@limitless-music-group";
const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
const productionUrl = process.env.NEXT_PUBLIC_BLOG_URL;

export const createBlogMetadata = ({
  title,
  description,
  image,
  ...properties
}: MetadataGenerator): Metadata => {
  const parsedTitle = `${title} | ${applicationName}`;
  const defaultMetadata: Metadata = {
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: parsedTitle,
    },
    applicationName,
    authors: [author],
    creator: author.name,
    description,
    formatDetection: {
      telephone: false,
    },
    metadataBase: productionUrl
      ? new URL(`${protocol}://${productionUrl}`)
      : undefined,
    openGraph: {
      description,
      locale: "en_US",
      siteName: applicationName,
      title: parsedTitle,
      type: "website",
      url: productionUrl,
    },
    publisher,
    title: parsedTitle,
    twitter: {
      card: "summary_large_image",
      creator: twitterHandle,
    },
  };

  const metadata: Metadata = merge(defaultMetadata, properties);

  if (image && metadata.openGraph) {
    metadata.openGraph.images = [
      {
        alt: title,
        height: 630,
        url: image,
        width: 1200,
      },
    ];
  }

  return metadata;
};
