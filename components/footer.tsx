import Link from "next/link";
import { blogPaths, marketingPaths } from "@/packages/shared/config/paths";
import { AppIcons } from "@/packages/ui/components/app-icons";
import { ModeToggle } from "@/packages/ui/components/mode-toggle";

const LINK_GROUPS = [
  {
    heading: "Explore",
    links: [
      { href: blogPaths.home.getUrl(), label: "Latest" },
      { href: blogPaths.tags.root.getUrl(), label: "Tags" },
      { href: blogPaths.authors.root.getUrl(), label: "Authors" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: marketingPaths.about.getUrl(), label: "About" },
      { href: marketingPaths.contact.getUrl(), label: "Contact" },
      { href: marketingPaths.pricing.getUrl(), label: "Pricing" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: marketingPaths.privacyPolicy.getUrl(), label: "Privacy" },
      { href: marketingPaths.termsOfService.getUrl(), label: "Terms" },
    ],
  },
];

const SOCIALS = [
  {
    href: "https://linkedin.com",
    Icon: AppIcons.Socials.Linkedin,
    label: "LinkedIn",
  },
  {
    href: "https://youtube.com",
    Icon: AppIcons.Socials.Youtube,
    label: "YouTube",
  },
  {
    href: "https://facebook.com",
    Icon: AppIcons.Socials.Facebook,
    label: "Facebook",
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-border/60 border-t bg-background">
      <div className="container mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-2 gap-10 py-14 sm:grid-cols-2 md:grid-cols-5">
          <div className="col-span-2 space-y-4">
            <Link className="flex items-center gap-2" href="/" prefetch>
              <span className="flex size-7 items-center justify-center rounded-lg bg-foreground font-bold text-background text-sm">
                L
              </span>
              <span className="font-semibold text-lg tracking-tight">
                LMG Core
              </span>
            </Link>
            <p className="max-w-xs text-muted-foreground text-sm leading-relaxed">
              Global music intelligence, built for the modern industry.
            </p>
          </div>

          {LINK_GROUPS.map((group) => (
            <nav className="space-y-3" key={group.heading}>
              <h3 className="font-medium text-foreground text-sm">
                {group.heading}
              </h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                      href={link.href}
                      prefetch
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col-reverse items-center justify-between gap-4 border-border/60 border-t py-6 sm:flex-row">
          <p className="text-muted-foreground text-sm">
            © 2027 LMG Core. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ href, label, Icon }) => (
                <Link
                  aria-label={label}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  href={href}
                  key={label}
                  prefetch
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Icon className="size-4" />
                </Link>
              ))}
            </div>
            <ModeToggle variant="switch" />
          </div>
        </div>
      </div>
    </footer>
  );
}
