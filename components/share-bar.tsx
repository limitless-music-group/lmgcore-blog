"use client";

import { useCallback, useEffect, useState } from "react";
import { AppIcons } from "@/packages/ui/components/app-icons";
import { Button } from "@/packages/ui/components/button";
import { CopyButton } from "@/packages/ui/components/created/copy-button";

export function ShareBar({ title }: { title: string }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const share = useCallback(
    (network: "linkedin" | "x") => {
      const encodedUrl = encodeURIComponent(url);
      const text = encodeURIComponent(title);
      const target =
        network === "linkedin"
          ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
          : `https://x.com/intent/tweet?url=${encodedUrl}&text=${text}`;
      window.open(target, "_blank", "noopener,noreferrer");
    },
    [url, title]
  );

  const handleShareLinkedin = useCallback(() => share("linkedin"), [share]);
  const handleShareX = useCallback(() => share("x"), [share]);

  return (
    <div className="flex items-center gap-1">
      <Button
        aria-label="Share on LinkedIn"
        onClick={handleShareLinkedin}
        size="default"
        variant="outline"
      >
        Share on LinkedIn
        <AppIcons.Socials.Linkedin className="size-4" />
      </Button>
      <Button
        aria-label="Share on X"
        onClick={handleShareX}
        size="default"
        variant="outline"
      >
        Share on X
        <AppIcons.Common.X className="size-4" />
      </Button>
      <CopyButton copyValue={url} />
    </div>
  );
}
