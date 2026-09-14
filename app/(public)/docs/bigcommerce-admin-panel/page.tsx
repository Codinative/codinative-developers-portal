import type { Metadata } from "next";
import Link from "next/link";
import {
  DocLayout,
  Section,
  C,
  Callout,
  Steps,
  DocLink,
  SecurityAlert,
  Screenshot,
  type TocItem,
} from "@/components/public/doc";
import { STENCIL_TRACK_HREF } from "@/components/public/quick-start";

export const metadata: Metadata = {
  title: "Developer's Guide to the BigCommerce Admin Panel - Codinative Developers",
};

const TOC: TocItem[] = [
  { id: "orientation", title: "Orientation" },
  { id: "tokens", title: "Tokens: which & when" },
  { id: "create-token", title: "Create an API account" },
  { id: "themes", title: "Themes" },
  { id: "page-builder", title: "Page Builder" },
  { id: "products", title: "Products" },
  { id: "variants", title: "Options & variants" },
  { id: "categories", title: "Categories" },
  { id: "brands", title: "Brands" },
  { id: "web-pages", title: "Web pages" },
  { id: "images", title: "Images & files" },
  { id: "scripts", title: "Script Manager" },
  { id: "customers-orders", title: "Customers & test orders" },
  { id: "settings", title: "Settings devs touch" },
  { id: "habits", title: "Safe habits" },
];

const Path = ({ children }: { children: React.ReactNode }) => (
  <strong className="font-semibold text-gray-800 dark:text-gray-200">{children}</strong>
);

export default function AdminPanelGuide() {
  return (
    <DocLayout
      title="Developer's Guide to the BigCommerce Admin Panel"
      intro="The control panel is built for merchants, but developers live in it too: it's where tokens come from, where themes go live, and where the products, pages and settings your code depends on are defined. This is the tour of the parts you'll actually use."
      toc={TOC}
    >
      <Section id="orientation" title="Orientation">
        <p>
          Every store&rsquo;s control panel lives at <C>https://store-&#123;store_hash&#125;.mybigcommerce.com/manage</C>.
          The <strong>store hash</strong> in that URL (for example <C>abc123</C> in{" "}
          <C>store-abc123</C>) identifies the store in every API URL, so note it down on day
          one.
        </p>
        <p>The left-hand menu is organised by what you&rsquo;re managing:</p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <Path>Orders</Path>, <Path>Products</Path> and <Path>Customers</Path>: the store&rsquo;s
            data, which your theme and API code read and write.
          </li>
          <li>
            <Path>Storefront</Path>: themes, Page Builder, web pages, image manager, scripts. This
            is where most theme work happens.
          </li>
          <li>
            <Path>Channels › Channel Manager</Path>: the storefronts and sales channels the store sells
            through. On multi-storefront (MSF) stores, many storefront settings are per-channel.
          </li>
          <li>
            <Path>Apps</Path> and <Path>Settings</Path>: installed apps, API accounts, checkout,
            payments, store status and everything else store-wide.
          </li>
        </ul>
        <Screenshot
          file="admin/01-dashboard.png"
          alt="The control panel home dashboard with the left navigation expanded, and the store hash visible in the browser address bar."
          caption="The control panel home. The store hash is in the URL."
        />
        <Callout tone="warn">
          BigCommerce updates the control panel regularly, so menu labels sometimes move or get
          renamed. If a path in this guide doesn&rsquo;t match exactly, use the search box at the
          top of the control panel. It finds settings pages by name.
        </Callout>
      </Section>

      <Section id="tokens" title="Tokens: which one, and when">
        <p>
          &ldquo;Get a token&rdquo; can mean six different things on BigCommerce. Picking the
          wrong one is the most common first-week mistake, and exposing the wrong one is the
          most dangerous. Use this table:
        </p>
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 dark:bg-gray-950 dark:text-gray-400">
              <tr className="divide-x divide-gray-200 dark:divide-gray-800">
                <th className="px-4 py-2 font-medium">You want to&hellip;</th>
                <th className="px-4 py-2 font-medium">Token</th>
                <th className="px-4 py-2 font-medium">Where it comes from</th>
                <th className="px-4 py-2 font-medium">Safe in the browser?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              <TokenRow
                want="Run a Stencil theme locally / push a theme"
                token="Stencil CLI token"
                from="Settings › API › Store-level API accounts › Create Stencil-CLI token"
                safe="No: it lives in secrets.stencil.json, which is git-ignored"
              />
              <TokenRow
                want="Call GraphQL from a Stencil theme"
                token="Storefront token (auto-generated)"
                from={
                  <>
                    Nothing to create: use <C>{`{{settings.storefront_api.token}}`}</C> in the theme
                  </>
                }
                safe="Yes, it's designed for it"
                ok
              />
              <TokenRow
                want="Add to cart / read the cart from theme JS"
                token="None"
                from="The REST Storefront API (/api/storefront/...) uses the shopper's session cookie"
                safe="Yes, no token involved"
                ok
              />
              <TokenRow
                want="Read or write products, orders or customers from a script or server"
                token="Store-level API account (V2/V3) access token"
                from="Settings › API › Store-level API accounts"
                safe="NEVER: server-side only"
                danger
              />
              <TokenRow
                want="Query GraphQL as a logged-in customer from a headless server"
                token="Customer impersonation token"
                from="Created via the API with a store API token (headless / Catalyst builds)"
                safe="NEVER: BigCommerce rejects it from browsers"
                danger
              />
              <TokenRow
                want="A published or multi-store app"
                token="App OAuth access token"
                from="Exchanged during the app install flow (Developer Portal app)"
                safe="NEVER: server-side only"
                danger
              />
            </tbody>
          </table>
        </div>
        <SecurityAlert title="Store API tokens are master keys">
          <p>
            A V2/V3 store API token with write scopes can change prices, export every
            customer&rsquo;s personal data and cancel orders. <strong>Never</strong> put one in
            theme code, a <C>{`<script>`}</C> tag, Script Manager, a Git repo, a screenshot, Slack,
            or an AI prompt. Anything shipped to the storefront can be read by anyone with
            DevTools.
          </p>
          <p>
            If a token leaks, <strong>delete the API account immediately</strong> (that revokes the
            token), create a new one, and tell your lead.
          </p>
        </SecurityAlert>
      </Section>

      <Section id="create-token" title="Create an API account (step by step)">
        <p>
          Only the <strong>store owner</strong> or users with API-account permission can do this.
          On sandboxes a senior developer usually creates the account and shares the token through
          the team secrets vault.
        </p>
        <Steps>
          <li>
            Go to <Path>Settings › API › Store-level API accounts</Path> and open the{" "}
            <Path>Create API account</Path> dropdown.
          </li>
          <li>
            Choose the token type:
            <ul className="mt-1.5 ml-5 list-disc space-y-1">
              <li>
                <strong>Create Stencil-CLI token</strong> for theme development (Day 1 of the
                Stencil Quick Start). Instead of scopes, you pick an access level:{" "}
                <em>local development only</em> (read theme data, cannot publish) or{" "}
                <em>publish theme</em> (also lets <C>stencil push</C> upload and apply themes).
                Use local development only unless you need to push.
              </li>
              <li>
                <strong>V2/V3 API token</strong> for scripts, integrations and servers. You pick
                each scope yourself.
              </li>
            </ul>
          </li>
          <li>
            Name it after the <em>person and purpose</em>, for example{" "}
            <C>stencil-cli-ali-laptop</C> or <C>erp-sync-server</C>, so it can be traced and
            revoked later.
          </li>
          <li>
            For V2/V3 tokens, set each <Path>OAuth scope</Path> to the minimum needed: most
            resources to <em>None</em>, the rest to <em>Read-only</em>. Grant <em>Modify</em> only
            when the code writes that resource.
          </li>
          <li>
            Click <Path>Save</Path>. A popup shows the <strong>Access token</strong>, Client ID,
            Client secret and API path, and a <C>.txt</C> copy downloads.{" "}
            <strong>The token is shown only once.</strong> Store it in the secrets vault right
            away.
          </li>
        </Steps>
        <Screenshot
          file="admin/02-create-api-account.png"
          alt="The Create API account dropdown open, showing the Create V2/V3 API token and Create Stencil-CLI token options."
          caption="Settings › API › Store-level API accounts › Create API account"
        />
        <Screenshot
          file="admin/03-api-credentials-popup.png"
          alt="The 'BigCommerce API Credentials' popup shown after saving, with the access token blurred out."
          caption="The credentials popup appears only once. Blur the token in any screenshot."
        />
      </Section>

      <Section id="themes" title="Themes: download, upload, copy, apply">
        <p>
          <Path>Storefront › Themes</Path> shows the <strong>current theme</strong> at the top and
          your <strong>theme library</strong> below it. On multi-storefront stores, themes are per
          storefront: <Path>Channels › Channel Manager</Path>, click the storefront&rsquo;s name,
          then <Path>Themes</Path>.
        </p>
        <Screenshot
          file="admin/04-my-themes.png"
          alt="The Themes page showing the current theme card with the Edit in Page Builder button and the Action (⋯) menu, and the theme library below it."
          caption="Storefront › Themes: current theme and theme library"
        />
        <h3 className="pt-2 font-semibold text-gray-900 dark:text-gray-100">Download a theme</h3>
        <Steps>
          <li>
            Open the <Path>Action menu (&hellip;)</Path> next to the theme and choose{" "}
            <Path>Download current theme</Path> (with your team&rsquo;s code changes) or{" "}
            <Path>Download Original Theme</Path> (the pristine marketplace version).
          </li>
          <li>
            A downloaded theme does <strong>not</strong> include the live Page Builder
            configuration. Run <C>stencil pull</C> after <C>stencil init</C> to bring it into{" "}
            <C>config.json</C>.
          </li>
          <li>
            Unzip it, then run <C>npm ci</C> and <C>stencil init</C> inside it. Day 1 walks through
            this.
          </li>
        </Steps>
        <h3 className="pt-2 font-semibold text-gray-900 dark:text-gray-100">Upload a theme</h3>
        <Steps>
          <li>
            Build the zip locally with <C>stencil bundle</C>, or skip the UI entirely and use{" "}
            <C>stencil push</C>.
          </li>
          <li>
            In <Path>Storefront › Themes</Path>, click <Path>Upload theme</Path> and select the
            zip. BigCommerce validates it and adds it to the library.
          </li>
          <li>
            Click <Path>Apply</Path> on the uploaded theme and pick a <strong>variation</strong>{" "}
            (for Cornerstone: Light, Bold or Warm) to make it live.
          </li>
        </Steps>
        <Callout tone="warn">
          The library has a <strong>limited number of theme slots</strong>, and an uploaded bundle
          has a size cap (see Day 1). If upload fails with a limit error, delete old, unused
          uploads from the library first. Never delete the theme that&rsquo;s currently applied.
        </Callout>
        <h3 className="pt-2 font-semibold text-gray-900 dark:text-gray-100">
          Make a copy &amp; edit theme files
        </h3>
        <p>
          In the same <Path>Action menu (&hellip;)</Path>, <Path>Make a copy</Path> duplicates a
          theme in the library and <Path>Edit theme files</Path> opens the in-browser Code Editor. Use it for emergency hotfixes only: it
          bypasses Git and can&rsquo;t rebuild JavaScript. Always make a copy first so the live
          theme can be restored in one click.
        </p>
        <Screenshot
          file="admin/05-theme-advanced-menu.png"
          alt="A theme's Action (⋯) menu expanded, showing Download current theme, Download Original Theme, Make a copy and Edit theme files."
          caption="The Action (⋯) menu on a theme"
        />
      </Section>

      <Section id="page-builder" title="Page Builder">
        <p>
          Open it with <Path>Edit in Page Builder</Path> on the current theme in{" "}
          <Path>Storefront › Themes</Path> (or from the storefront&rsquo;s Themes tab in{" "}
          <Path>Channels › Channel Manager</Path> on multi-storefront stores). It&rsquo;s the
          merchant&rsquo;s visual editor, and it is bounded entirely by what the theme exposes.
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <strong>Theme Styles</strong> (the paint-brush panel): colours, fonts, logo position,
            products per page and so on. Each control is defined in the theme&rsquo;s{" "}
            <C>schema.json</C>, and its value is stored under <C>settings</C> in{" "}
            <C>config.json</C>. That&rsquo;s the connection you&rsquo;ll use on Day 1.
          </li>
          <li>
            <strong>Widgets</strong>: drag-and-drop blocks (text, images, carousels, HTML and
            custom widgets) dropped into the <C>{`{{{region}}}`}</C> areas a template defines.
          </li>
          <li>
            <strong>Page selector</strong> (top bar): switch between home, category, product, web
            pages and so on, and pick a specific item to preview.
          </li>
          <li>
            <strong>Save vs Publish</strong>: <em>Save</em> keeps a draft, <em>Publish</em> makes
            it live for shoppers.
          </li>
        </ul>
        <Screenshot
          file="admin/06-page-builder-theme-styles.png"
          alt="Page Builder with the Theme Styles panel open on the left and the storefront preview on the right."
          caption="Page Builder: Theme Styles controls come from schema.json"
        />
        <Screenshot
          file="admin/07-page-builder-widgets.png"
          alt="Page Builder with the widgets panel open and a widget being dragged into a highlighted region."
          caption="Page Builder: widgets drop into theme regions"
        />
        <Callout>
          Settings a merchant changes in Page Builder live on the store, not in your local files.
          Before you push a theme, run <C>stencil pull</C>. It writes the live values into the
          active variation&rsquo;s <C>settings</C> in <C>config.json</C>, so your push
          doesn&rsquo;t overwrite the merchant&rsquo;s changes.
        </Callout>
      </Section>

      <Section id="products" title="Products">
        <p>
          <Path>Products › All products</Path> (called <em>View</em> on older control panels)
          lists the catalog; <Path>Products › Add</Path> creates a product. The fields that matter most to developers:
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <strong>Product ID</strong>: shown in the product-edit page URL (
            <C>/manage/products/edit/112</C> means ID <C>112</C>). The APIs and GraphQL call it{" "}
            <C>entityId</C>.
          </li>
          <li>
            <strong>Basic information</strong>: name, SKU, price, categories, brand, weight. A
            product must be <strong>visible on storefront</strong> to appear in the Storefront
            GraphQL API.
          </li>
          <li>
            <strong>Images &amp; videos</strong>: one image is the thumbnail. GraphQL returns it
            as <C>defaultImage</C>.
          </li>
          <li>
            <strong>Variations</strong> and <strong>Customizations</strong>: see the next section.
          </li>
          <li>
            <strong>Inventory</strong>: stock tracking at product or variant level. It affects{" "}
            <C>inventory.isInStock</C> and whether add-to-cart succeeds.
          </li>
          <li>
            <strong>Custom fields</strong>: free key/value pairs, available in templates and
            GraphQL. They are a quick way to pass extra data to the theme.
          </li>
          <li>
            <strong>Storefront details › Template layout file</strong>: assign a custom product
            template from <C>templates/pages/custom/product/</C>.
          </li>
          <li>
            <strong>SEO</strong>: the product URL (path), page title and meta description.
          </li>
        </ul>
        <Screenshot
          file="admin/08-products-list.png"
          alt="Products › All products listing several products."
          caption="Products › All products"
        />
        <Screenshot
          file="admin/09-product-edit.png"
          alt="The product edit page scrolled to Basic information, with the product ID visible in the URL."
          caption="Edit product: the ID is in the URL"
        />
      </Section>

      <Section id="variants" title="Options & variants">
        <p>
          This is the concept Days 3 to 5 depend on. BigCommerce separates two kinds of product
          options:
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <strong>Variant options</strong> (<Path>Variations</Path> section): options such as
            Size and Color whose combinations create <strong>variants</strong>. Each variant can
            have its own SKU, price, weight, image and stock. Two options with 3 values each
            produce 9 variants.
          </li>
          <li>
            <strong>Modifier options</strong> (<Path>Customizations</Path> section): options that
            don&rsquo;t create variants, such as gift wrap, engraving text or a checkbox. They can
            adjust price, but they have no stock or SKU of their own.
          </li>
          <li>
            <strong>Shared options</strong> (<Path>Products › Options</Path>): define an option
            once and reuse it across many products.
          </li>
        </ul>
        <Steps>
          <li>
            Edit a product, scroll to <Path>Variations</Path>, and click{" "}
            <Path>Add variant option</Path>.
          </li>
          <li>
            Name it (e.g. <C>Size</C>), choose a display type (dropdown, swatch, rectangle list,
            radio), and add values (<C>S</C>, <C>M</C>, <C>L</C>).
          </li>
          <li>
            Save. BigCommerce generates the variant table, where you set each variant&rsquo;s SKU,
            price, image and stock.
          </li>
        </Steps>
        <Screenshot
          file="admin/10-product-variations.png"
          alt="The Variations section of a product, showing two variant options (Size, Color) and the generated variant table with SKUs, prices and images."
          caption="Variant options generate the variant table"
        />
        <Callout>
          Every option and every option value has its own numeric ID. Add-to-cart calls send them
          as <C>optionSelections: [&#123; optionId, optionValue &#125;]</C>. You never hard-code
          them; you read them from GraphQL (Day 3).
        </Callout>
      </Section>

      <Section id="categories" title="Categories">
        <p>
          <Path>Products › Product Categories</Path> manages the category tree. Categories drive
          the storefront navigation menu and the category pages (
          <C>templates/pages/category.html</C>).
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>Drag to reorder or nest; a parent-child tree becomes the dropdown navigation.</li>
          <li>
            Each category has a URL, description, image, default product sort, visibility toggle,
            and a <strong>Template layout file</strong> for custom category templates.
          </li>
          <li>
            The category ID is in the edit URL, the same as for products. Use it in front matter
            and GraphQL <C>category(entityId:)</C> queries.
          </li>
        </ul>
        <Screenshot
          file="admin/11-categories.png"
          alt="Products › Product Categories showing a nested category tree with the drag handles visible."
          caption="Products › Product Categories"
        />
      </Section>

      <Section id="brands" title="Brands">
        <p>
          <Path>Products › Brands</Path> manages brand records. Each brand gets its own storefront
          page (<C>templates/pages/brand.html</C>), plus a URL, image, SEO fields and an optional
          custom template (<C>templates/pages/custom/brand/</C>). Assign a brand on the product
          edit page.
        </p>
        <Screenshot
          file="admin/12-brands.png"
          alt="Products › Brands list with a brand's edit form open."
          caption="Products › Brands"
        />
      </Section>

      <Section id="web-pages" title="Web pages">
        <p>
          <Path>Storefront › Web Pages</Path> is where content pages (About, FAQ, Build Your Set)
          are created. A web page is what gives a custom template its own URL.
        </p>
        <Steps>
          <li>
            Click <Path>Create a web page</Path>.
          </li>
          <li>
            Choose the type: <strong>Content</strong> (normal page with a WYSIWYG body),{" "}
            <strong>Contact form</strong>, <strong>Link</strong> (a nav item pointing elsewhere),
            or <strong>Raw HTML</strong>.
          </li>
          <li>
            Set the <strong>Page name</strong>, whether it appears in the navigation menu, and the
            parent page.
          </li>
          <li>
            Under the SEO / advanced options, set the <strong>URL</strong> (e.g.{" "}
            <C>/build-your-set/</C>) and the <strong>Template layout file</strong>. The dropdown
            lists the custom templates found in the <em>applied</em> theme&rsquo;s{" "}
            <C>templates/pages/custom/page/</C>.
          </li>
          <li>Save, then open the URL on the storefront.</li>
        </Steps>
        <Screenshot
          file="admin/13-web-page-template-layout.png"
          alt="The Create a web page form with the URL field set to /build-your-set/ and the Template layout file dropdown open."
          caption="Web page with a custom URL and template layout file"
        />
      </Section>

      <Section id="images" title="Images & files">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <strong>Product images</strong> belong on the product itself (Images &amp; videos).
            BigCommerce resizes them on the fly. In templates, use the <C>getImageSrcset</C>{" "}
            helper; in GraphQL, pass a width to <C>url(width: 500)</C>.
          </li>
          <li>
            <strong>Image Manager</strong> (<Path>Storefront › Image Manager</Path>) holds content
            images for web pages, banners and widgets. Upload an image, then copy its URL.
          </li>
          <li>
            <strong>WebDAV</strong> (<Path>Settings › File access (WebDAV)</Path>) mounts the
            store&rsquo;s file system for bulk uploads, fonts, PDFs and verification files. Themes
            reference these through the <C>{`{{cdn "webdav:..."}}`}</C> helper.
          </li>
        </ul>
        <Screenshot
          file="admin/14-image-manager.png"
          alt="Storefront › Image Manager showing uploaded images with the copy-URL action visible."
          caption="Storefront › Image Manager"
        />
      </Section>

      <Section id="scripts" title="Script Manager">
        <p>
          <Path>Storefront › Script Manager</Path> injects third-party scripts (analytics, pixels,
          chat) into the head or footer of chosen pages without editing the theme. Each script has
          a consent category that controls cookie-consent behaviour.
        </p>
        <SecurityAlert title="Script Manager is public">
          <p>
            Everything in Script Manager ships to every shopper&rsquo;s browser. It is{" "}
            <strong>not</strong> a place for API tokens, secrets or &ldquo;temporary&rdquo;
            credentials. Feature code belongs in the theme, under version control.
          </p>
        </SecurityAlert>
        <Screenshot
          file="admin/15-script-manager.png"
          alt="Storefront › Script Manager's Create a script form showing the location, pages and consent category fields."
          caption="Storefront › Script Manager"
        />
      </Section>

      <Section id="customers-orders" title="Customers & test orders">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <Path>Customers</Path>: create a test customer to check logged-in behaviour
            (account pages, customer-group pricing, <C>customer</C> in templates and GraphQL).
          </li>
          <li>
            <Path>Customers › Customer Groups</Path>: group-based pricing and category access.
            Useful to test prices that differ by who&rsquo;s logged in.
          </li>
          <li>
            <Path>Settings › Payments</Path>: on sandboxes, enable the <strong>test payment
            gateway</strong> so you can place orders end to end without a real card.
          </li>
          <li>
            <Path>Orders</Path>: confirm that line items and selected options arrived as
            expected after a checkout test (you&rsquo;ll use this on Day 5).
          </li>
        </ul>
        <Screenshot
          file="admin/16-order-detail.png"
          alt="An order detail view showing three line items with their selected product options."
          caption="Orders: check the options that reached the order"
        />
      </Section>

      <Section id="settings" title="Settings developers touch">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <strong>Store status</strong> (search &ldquo;store status&rdquo; in Settings): put the storefront in
            maintenance mode. Logged-in admins can still preview the store.
          </li>
          <li>
            <Path>Settings › Checkout</Path>: the checkout type (Optimized One-Page Checkout) and
            checkout customisation options.
          </li>
          <li>
            <Path>Settings › Display</Path> and <Path>Settings › Store profile</Path>: store name,
            address, date and product display defaults that templates read.
          </li>
          <li>
            <Path>Settings › Currencies</Path>: currencies and formatting, which affect every
            price your code renders.
          </li>
          <li>
            <Path>Settings › API</Path>: store-level API accounts, and the{" "}
            <strong>Storefront API Playground</strong> for trying GraphQL queries against this
            store (Day 3).
          </li>
          <li>
            <Path>Channels › Channel Manager</Path>: storefront channels and their domains. On MSF stores,
            themes and many settings are managed per storefront from here.
          </li>
        </ul>
        <Screenshot
          file="admin/17-settings-overview.png"
          alt="The Settings landing page showing the grouped sections (General, Setup, Advanced, API)."
          caption="Settings: grouped by area"
        />
      </Section>

      <Section id="habits" title="Safe habits in the control panel">
        <Steps>
          <li>
            <strong>Sandbox first.</strong> Practise and test on a sandbox, never on a live client
            store, unless the task is explicitly a production change.
          </li>
          <li>
            <strong>Copy before you change a theme.</strong> Use <em>Make a copy</em>, then edit
            and apply the copy. Rollback is then one click.
          </li>
          <li>
            <strong>Pull before you push.</strong> Run <C>stencil pull</C> to keep the
            merchant&rsquo;s Page Builder changes.
          </li>
          <li>
            <strong>Don&rsquo;t delete store data</strong> (products, categories, customers,
            orders) on a client store. Disable or hide instead, and ask first.
          </li>
          <li>
            <strong>One token per person and purpose</strong>, least privilege, stored in the
            vault, and revoked when no longer needed.
          </li>
        </Steps>
        <p>
          Ready to use all this? Start the{" "}
          <Link
            href={STENCIL_TRACK_HREF}
            className="font-medium text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-300"
          >
            5-day Stencil Quick Start
          </Link>
          . For deeper merchant-side detail, the{" "}
          <DocLink href="https://support.bigcommerce.com/s/">BigCommerce Help Center</DocLink>{" "}
          documents every screen.
        </p>
      </Section>
    </DocLayout>
  );
}

function TokenRow({
  want,
  token,
  from,
  safe,
  ok,
  danger,
}: {
  want: string;
  token: string;
  from: React.ReactNode;
  safe: string;
  ok?: boolean;
  danger?: boolean;
}) {
  return (
    <tr className="divide-x divide-gray-200 text-gray-600 dark:divide-gray-800 dark:text-gray-300">
      <td className="px-4 py-2 align-top">{want}</td>
      <td className="px-4 py-2 align-top font-medium text-gray-900 dark:text-gray-100">{token}</td>
      <td className="px-4 py-2 align-top">{from}</td>
      <td
        className={`px-4 py-2 align-top font-medium ${
          danger
            ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300"
            : ok
              ? "text-emerald-700 dark:text-emerald-300"
              : "text-amber-700 dark:text-amber-300"
        }`}
      >
        {safe}
      </td>
    </tr>
  );
}
