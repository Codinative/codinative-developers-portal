// ----------------------------------------------------------------------------
// QA checklist templates.
//
// A template is a named, ordered list of criteria grouped into sections. New
// checklists are seeded from one of these. Pure data (no server imports) so it
// can be read from a Client Component (the "new checklist" form) too.
//
// The "bigcommerce-app-review" template mirrors the BigCommerce Marketplace App
// Review (UAT) returned for Custom Signup Forms (ID 63651, 2026-02-27) — 72
// criteria across 8 sections. Use it as the baseline, then add your own.
// ----------------------------------------------------------------------------

export type QaTemplateItem = { section: string; criterion: string };

export type QaTemplate = {
  id: string;
  name: string;
  description: string;
  /** Items in display order; section grouping is derived from `section`. */
  items: QaTemplateItem[];
};

const BIGCOMMERCE_ITEMS: QaTemplateItem[] = [
  // --- Pre-Review ---
  { section: "Pre-Review", criterion: "The app is attached to a valid Technology Partner Account with the associated Partner ID." },
  { section: "Pre-Review", criterion: "The Technology Partner Agreement has been accepted by the Primary Contact of the associated Technology Partner account." },
  { section: "Pre-Review", criterion: "The Technology Partner account has the \"Billing/Financial\" role assigned to a contact." },

  // --- Listing Content ---
  { section: "Listing Content", criterion: "App name is properly branded with partner attribution." },
  { section: "Listing Content", criterion: "App name is free of taglines, promotional phrases, and excess keywords." },
  { section: "Listing Content", criterion: "App name does not include Commerce or BigCommerce branding." },
  { section: "Listing Content", criterion: "A valid and publicly accessible support website link is provided." },
  { section: "Listing Content", criterion: "The listed support website includes support contact information." },
  { section: "Listing Content", criterion: "A support email address is provided and passes validity checks for proper email format." },
  { section: "Listing Content", criterion: "The listed support email is not a personal or individual address and does not use free consumer domains or personal identifiers." },
  { section: "Listing Content", criterion: "App summary is accurately descriptive and within the 128-character limit." },
  { section: "Listing Content", criterion: "The selected category accurately represents the primary purpose and core functionality of the app." },
  { section: "Listing Content", criterion: "Description is accurately descriptive of the app's purpose or functionality." },
  { section: "Listing Content", criterion: "Description does not reference competitors or competing products." },
  { section: "Listing Content", criterion: "[App icon] Dimensions are 200x200 pixels or maintain a square aspect ratio." },
  { section: "Listing Content", criterion: "[App icon] Design aligns accurately with the app's official branding and visual identity." },
  { section: "Listing Content", criterion: "[App icon] Imagery remains clear, legible, and visually effective when displayed at small sizes." },
  { section: "Listing Content", criterion: "[Primary logo] Dimensions are 350x130px or match the same aspect ratio." },
  { section: "Listing Content", criterion: "[Primary logo] Display consists exclusively of the brand logo on a white background, with no additional images or content." },
  { section: "Listing Content", criterion: "[Primary logo] Accurately branded for the service and/or the provider." },
  { section: "Listing Content", criterion: "[Primary logo] Does not include Commerce or BigCommerce branding." },
  { section: "Listing Content", criterion: "[Alternate logo] Dimensions are 259x158px or match the same aspect ratio. (optional)" },
  { section: "Listing Content", criterion: "[Alternate logo] Display consists exclusively of the brand logo on a color background, with no additional images or content. (optional)" },
  { section: "Listing Content", criterion: "[Alternate logo] Includes only partner branding for both the service and the provider. (optional)" },
  { section: "Listing Content", criterion: "[Alternate logo] Does not include Commerce or BigCommerce branding. (optional)" },
  { section: "Listing Content", criterion: "Screenshots are consistent in size and use a widescreen orientation." },
  { section: "Listing Content", criterion: "Screenshots do not display competitor or merchant branding, products, or content." },
  { section: "Listing Content", criterion: "All entries in the \"Videos\" field contain valid video IDs rather than full URLs. (optional)" },
  { section: "Listing Content", criterion: "Each feature entry includes a brief, concise title." },
  { section: "Listing Content", criterion: "Each feature description is clearly written and free of unnecessary formatting or clutter." },
  { section: "Listing Content", criterion: "The total number of listed features does not exceed five." },
  { section: "Listing Content", criterion: "Each Case Study entry includes a valid, functional link. (optional)" },
  { section: "Listing Content", criterion: "Each linked Case Study features a BigCommerce/Commerce merchant or is platform-agnostic. (optional)" },
  { section: "Listing Content", criterion: "Each Case Study has a brief, descriptive title. (optional)" },
  { section: "Listing Content", criterion: "Each Case Study description consists of a single paragraph with no additional formatting or elements. (optional)" },
  { section: "Listing Content", criterion: "The total number of Case Studies does not exceed four. (optional)" },
  { section: "Listing Content", criterion: "Privacy policy URL is provided and appears legitimate and compliant." },
  { section: "Listing Content", criterion: "Terms of service URL is provided and appears legitimate and compliant." },
  { section: "Listing Content", criterion: "At least one valid link is provided for either the Installation Guide or User Guide." },
  { section: "Listing Content", criterion: "Any provided guide (Installation and/or User) is accurate and easy to follow." },
  { section: "Listing Content", criterion: "Pricing details are accurate." },
  { section: "Listing Content", criterion: "Pricing details use the appropriate formatting option." },
  { section: "Listing Content", criterion: "Any use of the BigCommerce or Commerce brand follows official brand usage guidelines, including naming, logo, and visual standards." },

  // --- Installation ---
  { section: "Installation", criterion: "Only the scopes necessary for the app's intended functionality are enabled, with no unnecessary or excessive permissions requested." },
  { section: "Installation", criterion: "The \"Checkout Content – Modify\" scope is disabled unless the app requires scripts that must run within the checkout experience." },
  { section: "Installation", criterion: "The app has the 'Enable multiple users' setting active, allowing access and management by multiple users within a store." },
  { section: "Installation", criterion: "The installation and authentication flow completes successfully and the app is added to the store's \"My Apps\" views." },
  { section: "Installation", criterion: "The installation and authentication flow remains within the BigCommerce control panel experience." },
  { section: "Installation", criterion: "The install landing page has appropriate styling and visual presentation consistent with the app's branding." },
  { section: "Installation", criterion: "After installation, the app's required setup or onboarding flow can be completed successfully and enables use of the app as intended." },

  // --- Storefront Setup ---
  { section: "Storefront Setup", criterion: "Storefront scripts are programmatically created and managed via the Script Manager using the Script API, rather than manual insertion." },
  { section: "Storefront Setup", criterion: "Injected scripts are scoped to load only on the specific store pages where they are functionally required." },
  { section: "Storefront Setup", criterion: "Injected scripts are assigned the appropriate consent_category in accordance with platform and consent requirements." },
  { section: "Storefront Setup", criterion: "Any required theme customizations beyond scripts use the most efficient supported method available, avoiding unnecessary or manual theme file edits." },

  // --- UI & Functionality ---
  { section: "UI & Functionality", criterion: "The embedded app interface loads successfully within the BigCommerce control panel iframe after installation without errors." },
  { section: "UI & Functionality", criterion: "The embedded app interface is branded and styled, and meets minimum UI and design quality standards appropriate for merchant-facing experiences." },
  { section: "UI & Functionality", criterion: "Support resources and contact information are available within the embedded app interface where merchants may reasonably need assistance." },
  { section: "UI & Functionality", criterion: "The embedded app interface loads and functions correctly across commonly used modern browsers with no browser-specific issues." },
  { section: "UI & Functionality", criterion: "The app's core functionality and documented features operate correctly when integrated with a BigCommerce store." },
  { section: "UI & Functionality", criterion: "The app properly communicates with store data through supported BigCommerce APIs, with accurate data exchange." },
  { section: "UI & Functionality", criterion: "The app uses the current, supported versions of applicable BigCommerce APIs and does not rely on deprecated API resources." },
  { section: "UI & Functionality", criterion: "API transactions appear stable and within expected norms, without indications of abnormal traffic or elevated error rates." },

  // --- Storefront ---
  { section: "Storefront", criterion: "Storefront scripts or injected code render correctly on BigCommerce Stencil theme storefronts without visual or functional issues." },
  { section: "Storefront", criterion: "Storefront-facing components and features function as intended during normal merchant and shopper interactions." },
  { section: "Storefront", criterion: "The app's storefront functionality does not conflict with existing storefront components or native BigCommerce features." },
  { section: "Storefront", criterion: "Storefront components load and function correctly across commonly used modern browsers with no browser-specific issues." },

  // --- Multi-Storefront Compatibility ---
  { section: "Multi-Storefront Compatibility", criterion: "The app correctly interacts with data and functions as expected across all BigCommerce storefront channels, including each individual storefront." },
  { section: "Multi-Storefront Compatibility", criterion: "Any storefront content created by the app is properly inserted on all BigCommerce storefronts." },
  { section: "Multi-Storefront Compatibility", criterion: "Any storefront content inserted by the app appears and functions as intended on all BigCommerce storefronts." },
  { section: "Multi-Storefront Compatibility", criterion: "Any URLs, links, or domain references generated or used by the app correctly correspond to the appropriate storefront domain." },

  // --- Uninstall Flow ---
  { section: "Uninstall Flow", criterion: "After the app is uninstalled, BigCommerce control panel and storefront functionality return to their original, pre-installation state without residual impact from the app." },
  { section: "Uninstall Flow", criterion: "Any storefront or checkout components introduced via scripts by the app are automatically removed upon uninstall." },
];

export const QA_TEMPLATES: QaTemplate[] = [
  {
    id: "bigcommerce-app-review",
    name: "BigCommerce Marketplace App Review",
    description: "The full 72-point Marketplace App Review (UAT) used by BigCommerce — pre-review, listing, installation, storefront, multi-storefront and uninstall.",
    items: BIGCOMMERCE_ITEMS,
  },
  {
    id: "blank",
    name: "Blank checklist",
    description: "Start empty and add your own checkpoints.",
    items: [],
  },
];

export function getTemplate(id: string): QaTemplate | undefined {
  return QA_TEMPLATES.find((t) => t.id === id);
}
