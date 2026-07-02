import type { Metadata } from "next";
import {
  DocLayout,
  Section,
  C,
  Callout,
  DocLink,
  type TocItem,
} from "@/components/public/doc";
import { Diagram, Spectrum } from "@/components/public/diagram";

export const metadata: Metadata = {
  title: "Customization Surfaces - BigCommerce Onboarding - Codinative Developers",
};

const TOC: TocItem[] = [
  { id: "spectrum", title: "The customization spectrum" },
  { id: "code", title: "Code-level (CLI, SCSS/JS)" },
  { id: "widgets", title: "Widgets & Page Builder" },
  { id: "webdav", title: "WebDAV" },
  { id: "editors", title: "Code Editor & Script Manager" },
  { id: "choosing", title: "Choosing a surface" },
  { id: "references", title: "Read the docs" },
];

export default function CustomizationSurfaces() {
  return (
    <DocLayout
      title="Customization Surfaces"
      intro="BigCommerce gives you many ways to change a storefront - from full local code control down to drag-and-drop. Knowing which surface to reach for (and who it's meant for) is what separates a precise change from a messy one."
      toc={TOC}
    >
      <Section id="spectrum" title="The customization spectrum">
        <p>
          Every customization sits somewhere on a <strong>low-level (code) to high-level
          (no-code)</strong> spectrum. Lower surfaces give more power and require a
          developer; higher surfaces are safer and put control in a merchant&rsquo;s hands.
          Pick the highest surface that can do the job cleanly.
        </p>

        <Diagram caption="Customization surfaces, from developer-only code to no-code merchant tools">
          <Spectrum
            from="Low-level (code)"
            to="High-level (no-code)"
            items={[
              {
                label: "Stencil CLI + SCSS/JS",
                audience: "Developer",
                desc: "Full local theme dev. The only way to edit theme JavaScript. Deployed with stencil push.",
              },
              {
                label: "Custom templates",
                audience: "Developer",
                desc: "Per-page / per-product layout overrides in templates/pages/custom/.",
              },
              {
                label: "Widgets API / Widget Builder",
                audience: "Developer",
                desc: "Reusable Page Builder widgets with a schema of merchant-editable settings, injected into theme regions.",
              },
              {
                label: "WebDAV",
                audience: "Technical",
                desc: "Raw file access for static assets and large images - not a theme-deploy replacement.",
              },
              {
                label: "Code Editor",
                audience: "Technical",
                desc: "In-control-panel editing of theme HTML/CSS. JS still needs the CLI. Copy the theme first.",
              },
              {
                label: "Script Manager",
                audience: "Technical merchant",
                desc: "Manage <script> tags (analytics, pixels, chat) with placement and consent controls.",
              },
              {
                label: "Page Builder / Theme Styles",
                audience: "Merchant",
                desc: "Drag-and-drop content and branding, bounded by what the theme exposes in config/schema.",
              },
            ]}
          />
        </Diagram>
      </Section>

      <Section id="code" title="Code-level: Stencil CLI, SCSS, JS, custom templates">
        <p>
          The deepest surface is the theme code itself, edited locally and pushed with the
          Stencil CLI (the Stencil Core &amp; Advanced courses in the{" "}
          <DocLink href="/docs/bigcommerce-mastery/learning-path">Guided Coursework</DocLink>{" "}
          cover this hands-on). This is the <strong>only</strong> way to change theme
          JavaScript and the right
          place for structural redesigns, new components, and anything that should live in
          version control. <strong>Custom templates</strong> sit just above it: alternate
          layouts a merchant can assign without touching code.
        </p>
      </Section>

      <Section id="widgets" title="Widgets, the Widgets API & Page Builder">
        <p>
          <strong>Page Builder</strong> is the merchant&rsquo;s visual editor. As a
          developer you extend it by building <strong>widgets</strong>: reusable blocks with
          a <C>schema</C> that exposes merchant-editable settings, placed into theme{" "}
          <strong>regions</strong> (the <C>{`{{{region}}}`}</C> areas) via the{" "}
          <strong>Widgets API</strong>. The <strong>Widget Builder</strong> tool helps you
          author and preview them. This is how you give merchants safe, branded, no-code
          control over content you designed - the best of both ends of the spectrum.
        </p>
      </Section>

      <Section id="webdav" title="WebDAV">
        <p>
          <strong>WebDAV</strong> (Web Distributed Authoring and Versioning) is an HTTP
          extension that lets you browse and manage a store&rsquo;s files like a network
          drive. On BigCommerce it exposes the store&rsquo;s <strong>file system</strong> -
          separate from the theme - so you can upload, download, and organise assets that
          aren&rsquo;t handled through the catalog or Page Builder.
        </p>
        <p>What actually lives there:</p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <C>content/</C> - files you reference on the storefront: PDFs, custom fonts,
            self-hosted CSS/JS, favicons, and site-verification files.
          </li>
          <li>
            <C>product_images/</C> and <C>image_manager/</C> - product and content images.
          </li>
          <li>
            Downloadable-product files, and large media you serve through the{" "}
            <C>{`{{cdn}}`}</C> helper&rsquo;s <C>webdav:</C> prefix - kept out of the
            50&nbsp;MB theme bundle.
          </li>
        </ul>
        <p>
          To connect: in the control panel go to{" "}
          <em>Settings &rarr; Storage / File access (WebDAV)</em>, copy the WebDAV URL and
          generate credentials, then open it in a WebDAV client - Cyberduck, WinSCP, or
          your operating system&rsquo;s built-in &ldquo;connect to server&rdquo; / &ldquo;map
          network drive&rdquo;.
        </p>
        <Callout tone="warn">
          WebDAV is for <strong>files, not theme deployment</strong> - Stencil themes still
          go through <C>stencil push</C> or the control panel. Treat it like a shared drive:
          there is no version history, so don&rsquo;t hand-edit anything you can&rsquo;t
          easily restore.
        </Callout>
        <p>
          <strong>Resources:</strong>{" "}
          <DocLink href="https://support.bigcommerce.com/s/article/File-Access-WebDAV">
            File Access (WebDAV)
          </DocLink>{" "}
          - setup and directory reference &middot;{" "}
          <DocLink href="https://docs.bigcommerce.com/developer/docs/storefront/stencil/themes/style/assets">
            Stencil theme assets
          </DocLink>{" "}
          - using the <C>cdn</C> / <C>webdav:</C> prefix.
        </p>
      </Section>

      <Section id="editors" title="Code Editor & Script Manager">
        <p>
          <strong>Code Editor</strong> (control panel) - browser-based editing of a
          theme&rsquo;s HTML/CSS for quick fixes. JavaScript still requires the Stencil CLI.
          Always <em>Make a Copy</em> of the theme before editing so you don&rsquo;t change a
          live theme in place.
        </p>
        <p>
          <strong>Script Manager</strong> lets you add third-party{" "}
          <C>&lt;script&gt;</C> tags and HTML snippets to the storefront{" "}
          <strong>without touching theme code</strong> - analytics (Google Analytics / GTM),
          marketing and tracking pixels, chat and support widgets, A/B testing, and the
          like. Each entry is configured with:
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <strong>Location</strong> - <C>Head</C> or <C>Footer</C>.
          </li>
          <li>
            <strong>Pages</strong> - all pages, or specific ones (storefront, checkout,
            order confirmation).
          </li>
          <li>
            <strong>Category</strong> - Essential / Functional / Analytics / Targeting,
            which drives cookie-consent behaviour.
          </li>
          <li>
            <strong>Type</strong> - a hosted script URL or an inline HTML / script snippet.
          </li>
        </ul>
        <p>
          Scripts injected by installed <strong>apps</strong> also appear here (read-only).
          Keep the list lean - every tag runs in the shopper&rsquo;s browser, so too many
          hurt performance, and the <strong>checkout</strong> page only accepts certain
          categories and locations for PCI reasons. Developers can manage the same scripts
          programmatically through the <strong>Scripts API</strong>.
        </p>
        <p>
          <strong>Resources:</strong>{" "}
          <DocLink href="https://support.bigcommerce.com/s/article/Using-Script-Manager">
            Script Manager
          </DocLink>{" "}
          - merchant guide &middot;{" "}
          <DocLink href="https://docs.bigcommerce.com/developer/docs/admin/widgets-and-scripts/scripts">
            Scripts API
          </DocLink>{" "}
          - manage scripts programmatically.
        </p>
      </Section>

      <Section id="choosing" title="Choosing a surface">
        <p>
          Default to the <strong>highest surface that does the job cleanly</strong>: a
          content change is a Page Builder job, not a code change; a reusable branded block
          is a widget; a structural redesign or new behaviour is theme code. Reserve the
          Code Editor for genuine quick fixes, and keep anything that matters in version
          control via the CLI so it&rsquo;s reviewable and reversible.
        </p>
      </Section>

      <Section id="references" title="Read the BigCommerce docs">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <DocLink href="https://docs.bigcommerce.com/developer/docs/storefront/stencil/content/page-builder">
              Page Builder overview
            </DocLink>{" "}
            and{" "}
            <DocLink href="https://docs.bigcommerce.com/developer/docs/storefront/stencil/content/widgets">
              widgets in themes
            </DocLink>
            .
          </li>
          <li>
            <DocLink href="https://docs.bigcommerce.com/developer/docs/admin/widgets-and-scripts/overview">
              Widgets &amp; Scripts (Admin) overview
            </DocLink>{" "}
            - the Widgets API and Widget Builder.
          </li>
          <li>
            <DocLink href="https://docs.bigcommerce.com/developer/docs/storefront/stencil/themes/templates/custom-templates">
              Custom templates
            </DocLink>
            .
          </li>
        </ul>
      </Section>
    </DocLayout>
  );
}
