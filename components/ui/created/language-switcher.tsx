"use client";

// import {
//   usePathname,
//   useRouter,
// } from "@packages/internationalization/navigation";
import { AppIcons } from "@packages/ui/components/app-icons";
import { Button } from "@packages/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@packages/ui/components/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

const languages = [
  { flag: "🇬🇧", label: "English", value: "en" },
  { flag: "🇪🇸", label: "Español", value: "es" },
  { flag: "🇩🇪", label: "Deutsch", value: "de" },
  { flag: "🇨🇳", label: "中文", value: "zh" },
  { flag: "🇫🇷", label: "Français", value: "fr" },
  { flag: "🇵🇹", label: "Português", value: "pt" },
];

const NON_DEFAULT_LOCALES = ["es", "de", "zh", "fr", "pt"];

function LanguageMenuItem({
  flag,
  isActive,
  label,
  onSelect,
  value,
}: {
  flag: string;
  isActive: boolean;
  label: string;
  onSelect: (value: string) => void;
  value: string;
}) {
  const handleClick = useCallback(() => onSelect(value), [onSelect, value]);

  return (
    <DropdownMenuItem
      className={isActive ? "bg-accent font-medium" : ""}
      onClick={handleClick}
    >
      <span className="mr-2">{flag}</span>
      {label}
      {isActive ? (
        <span className="ml-auto text-muted-foreground text-xs">✓</span>
      ) : null}
    </DropdownMenuItem>
  );
}

export const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Derive current locale from the URL path directly — more reliable than useParams during nav
  const [, firstSegment = ""] = pathname.split("/");
  const currentLocale = NON_DEFAULT_LOCALES.includes(firstSegment)
    ? firstSegment
    : "en";

  const currentLanguage =
    languages.find((l) => l.value === currentLocale) ?? languages[0];

  const switchLanguage = useCallback(
    (locale: string) => {
      if (locale === currentLocale) {
        return;
      }

      let newPathname: string;

      if (currentLocale === "en") {
        // English has no prefix: /pricing → /es/pricing
        newPathname = `/${locale}${pathname}`;
      } else if (locale === "en") {
        // Strip the locale prefix: /es/pricing → /pricing
        newPathname = pathname.slice(`/${currentLocale}`.length) || "/";
      } else {
        // Swap prefixes: /es/pricing → /de/pricing
        newPathname = `/${locale}${pathname.slice(`/${currentLocale}`.length)}`;
      }

      router.push(newPathname);
    },
    [currentLocale, pathname, router]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="shrink-0 gap-1.5 text-foreground"
          size="sm"
          variant="outline"
        >
          <span>{currentLanguage?.flag}</span>
          <span className="hidden font-medium text-xs sm:inline">
            {currentLanguage?.label}
          </span>
          <AppIcons.OneOff.Languages className="size-4 text-muted-foreground" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {languages.map(({ label, flag, value }) => (
          <LanguageMenuItem
            flag={flag}
            isActive={value === currentLocale}
            key={value}
            label={label}
            onSelect={switchLanguage}
            value={value}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
