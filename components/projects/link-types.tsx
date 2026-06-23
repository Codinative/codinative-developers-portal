// Catalog of the kinds of links a project can hold. Each type carries a brand
// colour, an icon and a URL placeholder so the "Add link" form can guide the
// user and the link list can show a recognisable, branded glyph.
//
// Colours are applied through CSS variables (`--c` light, `--cd` dark) so the
// same chip reads well in both themes — see `LinkTypeBadge` below.

import type { ComponentType } from "react";
import {
  Globe,
  FlaskConical,
  Store,
  BookOpen,
  Server,
  Smartphone,
  Link2,
  ShoppingBag,
  PlayCircle,
} from "lucide-react";

export type LinkTypeId =
  | "github"
  | "bigcommerce"
  | "shopify"
  | "website"
  | "staging"
  | "marketplace"
  | "mobile"
  | "figma"
  | "docs"
  | "api"
  | "slack"
  | "notion"
  | "vercel"
  | "video"
  | "custom";

export type LinkType = {
  id: LinkTypeId;
  label: string;
  /** Short hint shown under the label in the dropdown. */
  hint: string;
  /** Brand colour for light mode. */
  color: string;
  /** Brand colour for dark mode (defaults to `color`). */
  colorDark?: string;
  /** Example URL shown as the input placeholder when this type is picked. */
  placeholder: string;
  Icon: ComponentType<{ className?: string }>;
};

type IconProps = { className?: string };

// --- brand / lettermark glyphs (monochrome, use currentColor) --------------

function GithubMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function VercelMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 3 22 21H2z" />
    </svg>
  );
}

// Renders a centred bold letter as an SVG so it scales with `className`
// (h-/w- utilities) and inherits the chip's brand colour via currentColor.
function letterMark(letter: string): ComponentType<IconProps> {
  function Mark({ className }: IconProps) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={className}>
        <text
          x="12"
          y="12.5"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="17"
          fontWeight="700"
          fontFamily="var(--font-geist-sans, ui-sans-serif, system-ui, sans-serif)"
          fill="currentColor"
        >
          {letter}
        </text>
      </svg>
    );
  }
  Mark.displayName = `LetterMark(${letter})`;
  return Mark;
}

// --- the catalog ------------------------------------------------------------

export const LINK_TYPES: LinkType[] = [
  {
    id: "github",
    label: "GitHub",
    hint: "Repository or pull request",
    color: "#24292F",
    colorDark: "#E6EDF3",
    placeholder: "github.com/Codinative/repo",
    Icon: GithubMark,
  },
  {
    id: "bigcommerce",
    label: "BigCommerce",
    hint: "Store control panel or storefront",
    color: "#1B6BFF",
    colorDark: "#6FA8FF",
    placeholder: "store-xxxx.mybigcommerce.com",
    Icon: letterMark("B"),
  },
  {
    id: "shopify",
    label: "Shopify",
    hint: "Store admin or storefront",
    color: "#5E8E3E",
    colorDark: "#95BF47",
    placeholder: "your-store.myshopify.com/admin",
    Icon: ShoppingBag,
  },
  {
    id: "marketplace",
    label: "App marketplace",
    hint: "Public app / extension listing",
    color: "#7C3AED",
    colorDark: "#A78BFA",
    placeholder: "apps.bigcommerce.com/details/…",
    Icon: Store,
  },
  {
    id: "website",
    label: "Live site",
    hint: "Production website or app",
    color: "#2563EB",
    colorDark: "#60A5FA",
    placeholder: "app.codinative.com",
    Icon: Globe,
  },
  {
    id: "staging",
    label: "Staging",
    hint: "Preview / test environment",
    color: "#D97706",
    colorDark: "#FBBF24",
    placeholder: "staging.codinative.com",
    Icon: FlaskConical,
  },
  {
    id: "vercel",
    label: "Vercel",
    hint: "Deployment or dashboard",
    color: "#111827",
    colorDark: "#F4F4F5",
    placeholder: "vercel.com/codinative/project",
    Icon: VercelMark,
  },
  {
    id: "mobile",
    label: "Mobile app",
    hint: "App Store / Play Store listing",
    color: "#0891B2",
    colorDark: "#22D3EE",
    placeholder: "apps.apple.com/app/…",
    Icon: Smartphone,
  },
  {
    id: "figma",
    label: "Figma / Design",
    hint: "Design file or prototype",
    color: "#C2410C",
    colorDark: "#FB923C",
    placeholder: "figma.com/file/…",
    Icon: letterMark("F"),
  },
  {
    id: "docs",
    label: "Docs",
    hint: "Documentation or spec",
    color: "#059669",
    colorDark: "#34D399",
    placeholder: "docs.codinative.com",
    Icon: BookOpen,
  },
  {
    id: "api",
    label: "API / Backend",
    hint: "Endpoint, server or dashboard",
    color: "#475569",
    colorDark: "#94A3B8",
    placeholder: "api.codinative.com",
    Icon: Server,
  },
  {
    id: "notion",
    label: "Notion",
    hint: "Notes or knowledge base",
    color: "#111827",
    colorDark: "#E5E7EB",
    placeholder: "notion.so/…",
    Icon: letterMark("N"),
  },
  {
    id: "slack",
    label: "Slack",
    hint: "Channel or workspace",
    color: "#611F69",
    colorDark: "#D69CDC",
    placeholder: "codinative.slack.com",
    Icon: letterMark("S"),
  },
  {
    id: "video",
    label: "Video / Demo",
    hint: "Loom, YouTube or recording",
    color: "#DC2626",
    colorDark: "#F87171",
    placeholder: "loom.com/share/…",
    Icon: PlayCircle,
  },
  {
    id: "custom",
    label: "Other link",
    hint: "Any other URL",
    color: "#6366F1",
    colorDark: "#818CF8",
    placeholder: "example.com",
    Icon: Link2,
  },
];

const BY_ID = new Map(LINK_TYPES.map((t) => [t.id, t]));

/** Resolve a stored type id, falling back to the generic "custom" type. */
export function getLinkType(id?: string): LinkType {
  return (id && BY_ID.get(id as LinkTypeId)) || BY_ID.get("custom")!;
}

// --- shared badge -----------------------------------------------------------

const SIZES = {
  sm: { box: "h-7 w-7 rounded-lg", icon: "h-4 w-4" },
  md: { box: "h-9 w-9 rounded-lg", icon: "h-[1.15rem] w-[1.15rem]" },
} as const;

/**
 * A square, brand-tinted chip containing the type's icon. Colours come from the
 * `--c` / `--cd` CSS variables so light and dark themes each get a legible tint.
 */
export function LinkTypeBadge({
  type,
  size = "sm",
  className = "",
}: {
  type: LinkType;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const s = SIZES[size];
  return (
    <span
      style={
        {
          "--c": type.color,
          "--cd": type.colorDark ?? type.color,
        } as React.CSSProperties
      }
      className={`flex shrink-0 items-center justify-center text-[var(--c)] dark:text-[var(--cd)] ${s.box} bg-[var(--c)]/10 dark:bg-[var(--cd)]/15 ${className}`}
    >
      <type.Icon className={s.icon} />
    </span>
  );
}
