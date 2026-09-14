import type { Metadata } from "next";
import {
  DocLayout,
  Section,
  Code,
  CodeFile,
  C,
  Callout,
  Checkpoint,
  SecurityAlert,
  Steps,
  Task,
  DocLink,
  type TocItem,
} from "@/components/public/doc";
import { DayComplete, DayTabs } from "@/components/public/QuickStartDays";

export const metadata: Metadata = {
  title: "Day 4: BigCommerce REST APIs - Stencil Quick Start - Codinative Developers",
};

const TOC: TocItem[] = [
  { id: "goals", title: "Today's goals" },
  { id: "intro", title: "1. REST in 15 minutes" },
  { id: "two-apis", title: "2. Storefront vs Management" },
  { id: "never-client", title: "3. Never in the browser" },
  { id: "management-demo", title: "4. Management API (terminal)" },
  { id: "cart-api", title: "5. The Storefront Cart API" },
  { id: "cart-client", title: "6. A cart client" },
  { id: "react-cart", title: "7. Add to cart from React" },
  { id: "rest-vs-graphql", title: "8. REST or GraphQL?" },
  { id: "troubleshooting", title: "Troubleshooting" },
  { id: "done", title: "Day 4 checklist" },
];

export default function Day4() {
  return (
    <DocLayout
      header={<DayTabs />}
      title="Day 4: BigCommerce REST APIs"
      intro="Today you learn REST, the difference between BigCommerce's two REST API families, and the security line between them. You'll call the Management API safely from a terminal, then use the Storefront Cart API to add the products from Day 3 to the cart from React."
      toc={TOC}
    >
      <Section id="goals" title="Today's goals">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>Explain HTTP methods, status codes, headers and JSON bodies.</li>
          <li>
            Tell the <strong>REST Storefront API</strong> from the{" "}
            <strong>REST Management API</strong>, and know which may run in a browser.
          </li>
          <li>Read products from the Management API in a terminal, with the token kept out of code.</li>
          <li>Add products and variants to the cart from React with the Storefront Cart API.</li>
        </ul>
      </Section>

      <Section id="intro" title="1. REST in 15 minutes">
        <p>
          REST APIs expose <strong>resources</strong> at URLs, and you act on them with{" "}
          <strong>HTTP methods</strong>:
        </p>
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 dark:bg-gray-950 dark:text-gray-400">
              <tr className="divide-x divide-gray-200 dark:divide-gray-800">
                <th className="px-4 py-2 font-medium">Method</th>
                <th className="px-4 py-2 font-medium">Meaning</th>
                <th className="px-4 py-2 font-medium">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-600 dark:divide-gray-800 dark:text-gray-300">
              <Row a="GET" b="Read" c="GET /api/storefront/carts" />
              <Row a="POST" b="Create / add" c="POST /api/storefront/carts/{cartId}/items" />
              <Row a="PUT" b="Replace / update" c="PUT /api/storefront/carts/{cartId}/items/{itemId}" />
              <Row a="DELETE" b="Remove" c="DELETE /api/storefront/carts/{cartId}/items/{itemId}" />
            </tbody>
          </table>
        </div>
        <p>
          The <strong>status code</strong> tells you what happened, so learn these:{" "}
          <C>200</C> OK, <C>201</C> created, <C>204</C> no content, <C>400</C> bad request,{" "}
          <C>401</C> not authenticated, <C>403</C> forbidden, <C>404</C> not found,{" "}
          <C>422</C> valid JSON but rejected (e.g. a missing required option), <C>429</C> rate
          limited, <C>5xx</C> server error. Request and response bodies are JSON, sent with{" "}
          <C>Content-Type: application/json</C>.
        </p>
        <Callout>
          <C>fetch()</C> only rejects on <strong>network</strong> failures. A 404 or 422 still
          resolves, so always check <C>response.ok</C> yourself.
        </Callout>
      </Section>

      <Section id="two-apis" title="2. Two REST APIs: Storefront vs Management">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-sm dark:border-emerald-500/40 dark:bg-emerald-500/10">
            <p className="font-semibold text-emerald-800 dark:text-emerald-200">
              REST Storefront API: browser-safe
            </p>
            <ul className="mt-2 ml-5 list-disc space-y-1 text-emerald-900 dark:text-emerald-100">
              <li>
                URL: <C>/api/storefront/...</C> on the <strong>storefront&rsquo;s own domain</strong>
              </li>
              <li>
                Auth: <strong>no token</strong>. It uses the shopper&rsquo;s session cookie
              </li>
              <li>Acts only on the current shopper&rsquo;s cart, checkout and order</li>
              <li>
                Resources: carts, checkouts, orders (the shopper&rsquo;s), customer sign-up, form
                fields, newsletter subscriptions, cookie consent, pickup options
              </li>
            </ul>
          </div>
          <div className="rounded-xl border-2 border-red-500 bg-red-50 p-4 text-sm dark:border-red-500/70 dark:bg-red-500/10">
            <p className="font-semibold text-red-700 dark:text-red-300">
              REST Management API: server only
            </p>
            <ul className="mt-2 ml-5 list-disc space-y-1 text-red-900 dark:text-red-100">
              <li>
                URL: <C>{`https://api.bigcommerce.com/stores/{store_hash}/v3/...`}</C> (and{" "}
                <C>/v2/</C>)
              </li>
              <li>
                Auth: <C>X-Auth-Token</C>, a store API account token
              </li>
              <li>Acts on the whole store: every product, order and customer</li>
              <li>Used by apps, integrations, scripts and servers, never by theme JavaScript</li>
            </ul>
          </div>
        </div>
        <p>
          References:{" "}
          <DocLink href="https://docs.bigcommerce.com/developer/api-reference/rest/storefront/overview">
            REST Storefront API
          </DocLink>{" "}
          &middot;{" "}
          <DocLink href="https://docs.bigcommerce.com/developer/docs/rest-management">
            REST Management API
          </DocLink>{" "}
          &middot;{" "}
          <DocLink href="https://docs.bigcommerce.com/developer/docs/start/authentication/api-accounts">
            API accounts &amp; tokens
          </DocLink>
        </p>
      </Section>

      <Section id="never-client" title="3. APIs that must never run in the browser">
        <SecurityAlert title="Never call the Management API from theme code">
          <p>
            Any request to <C>api.bigcommerce.com/stores/…</C> needs an <C>X-Auth-Token</C>. To call
            it from the storefront you would have to ship that token to every visitor&rsquo;s
            browser, where anyone can read it in DevTools in seconds. BigCommerce&rsquo;s API
            accounts guide warns that these tokens <strong>don&rsquo;t expire</strong>. A leaked
            token keeps working until someone deletes the API account.
          </p>
          <p className="font-semibold">
            Never call these from theme JavaScript, templates, Script Manager or widgets:
          </p>
          <ul className="ml-5 list-disc space-y-1">
            <li>
              <strong>Catalog</strong>: <C>/v3/catalog/products</C>, variants, options, modifiers,
              categories, brands, images, price lists, inventory
            </li>
            <li>
              <strong>Orders</strong>: <C>/v2/orders</C>, <C>/v3/orders/…</C> (every order and every
              customer address in the store)
            </li>
            <li>
              <strong>Customers</strong>: <C>/v3/customers</C>, addresses, attributes, customer
              groups (personal data, which also makes it a privacy and legal issue)
            </li>
            <li>
              <strong>Management carts &amp; checkouts</strong>: <C>/v3/carts</C>,{" "}
              <C>/v3/checkouts</C>. These are <em>not</em> the same as{" "}
              <C>/api/storefront/carts</C>
            </li>
            <li>
              <strong>Payments</strong>: payment access tokens, payment processing
            </li>
            <li>
              <strong>Store &amp; content</strong>: themes, scripts, widgets, web pages, store
              settings, webhooks, promotions and coupons
            </li>
            <li>
              <strong>Token creation</strong>: storefront tokens and customer impersonation tokens
              (<C>/v3/storefront/api-token…</C>), and the GraphQL Admin API
            </li>
          </ul>
        </SecurityAlert>
        <SecurityAlert title="“It's read-only” is not safe either">
          <p>
            A read-only Orders or Customers token still exposes every shopper&rsquo;s name, email,
            phone number and address. That&rsquo;s a data breach. Read-only Products access reveals
            cost prices and hidden products. There is no scope that is safe to publish.
          </p>
        </SecurityAlert>
        <SecurityAlert title="Don't build a “quick proxy”">
          <p>
            A serverless function that forwards any request to the Management API with the token
            attached is the same leak with an extra step. If a storefront feature truly needs
            Management data, it needs a <strong>reviewed backend</strong> that exposes only the
            exact fields required, validates its input and is rate-limited. Talk to a senior before
            starting. Usually the GraphQL Storefront API (Day 3) already has what you need.
          </p>
        </SecurityAlert>
        <Callout>
          The browser enforces this too. <C>api.bigcommerce.com</C> doesn&rsquo;t send CORS headers
          for storefront origins, so a browser <C>fetch</C> to it fails before it starts. You&rsquo;ll
          see that in Task 4.2. But never rely on CORS as your security: it doesn&rsquo;t protect a
          token that has already been published.
        </Callout>
      </Section>

      <Section id="management-demo" title="4. The Management API, the safe way (terminal)">
        <p>
          To see what the Management API returns, call it where a token belongs: your terminal.
          This needs a <strong>V2/V3 API token with Products: read-only</strong> on the sandbox.
          Ask a senior for one, or see the Admin panel guide.
        </p>
        <Task title="Task 4.1: Read three products with curl">
          <Code>{`# 1. put secrets in environment variables, not in commands or files
export BC_STORE_HASH=abc123          # from the control-panel URL: store-abc123
read -rs BC_ACCESS_TOKEN             # paste the token, press Enter (input is hidden)
export BC_ACCESS_TOKEN

# 2. call the v3 Catalog API
curl -s "https://api.bigcommerce.com/stores/$BC_STORE_HASH/v3/catalog/products?limit=3&include=variants,images" \\
  -H "X-Auth-Token: $BC_ACCESS_TOKEN" \\
  -H "Accept: application/json"

# 3. clean up when you're done
unset BC_ACCESS_TOKEN`}</Code>
          <p>
            On Windows PowerShell, set the variables with{" "}
            <C>$env:BC_STORE_HASH = &quot;abc123&quot;</C> and{" "}
            <C>$env:BC_ACCESS_TOKEN = Read-Host -MaskInput</C>, then call{" "}
            <C>curl.exe</C> with <C>$env:BC_ACCESS_TOKEN</C>.
          </p>
          <Checkpoint>
            You get JSON with a <C>data</C> array and <C>meta.pagination</C>. Compare it with your
            Day 3 GraphQL response: this one includes admin-only fields such as{" "}
            <C>cost_price</C>, <C>inventory_level</C> and hidden products. That is exactly why it
            must stay on a server.
          </Checkpoint>
        </Task>
        <Task title="Task 4.2: Watch the browser refuse">
          <p>
            Open your storefront, then the DevTools <strong>Console</strong>, and run this. It
            contains no token, on purpose:
          </p>
          <Code>{`fetch('https://api.bigcommerce.com/stores/abc123/v3/catalog/products')
    .then(r => console.log(r.status))
    .catch(e => console.error('Blocked:', e.message));`}</Code>
          <Checkpoint>
            The console shows a CORS error and <C>Blocked: Failed to fetch</C>. The browser
            won&rsquo;t even read the response.
          </Checkpoint>
        </Task>
      </Section>

      <Section id="cart-api" title="5. The Storefront Cart API">
        <p>How the cart works on a Stencil storefront:</p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            A shopper session has <strong>at most one cart</strong>, tied to a cookie.{" "}
            <C>GET /api/storefront/carts</C> returns an <strong>array</strong>, either{" "}
            <C>[]</C> or <C>[cart]</C>.
          </li>
          <li>
            <C>POST /api/storefront/carts</C> <strong>creates</strong> the cart with its first items.
            If a cart already exists, it fails with <C>422 &ldquo;Cannot create a new cart&rdquo;</C>.
          </li>
          <li>
            <C>{`POST /api/storefront/carts/{cartId}/items`}</C> <strong>adds</strong> items to an
            existing cart.
          </li>
          <li>Both return the updated cart, and both accept the same body:</li>
        </ul>
        <CodeFile name="Request body: add line items">{`{
  "lineItems": [
    {
      "productId": 112,
      "quantity": 1,
      "optionSelections": [
        { "optionId": 5, "optionValue": 23 }
      ]
    },
    {
      "productId": 113,
      "variantId": 87,
      "quantity": 2
    }
  ]
}`}</CodeFile>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <C>optionSelections</C> uses the option&rsquo;s <C>entityId</C> as <C>optionId</C> and
            the chosen <strong>value&rsquo;s</strong> <C>entityId</C> as <C>optionValue</C>, both
            straight from your Day 3 GraphQL data. For text modifiers, <C>optionValue</C> is the
            text.
          </li>
          <li>
            Or send <C>variantId</C> to add a specific variant directly.
          </li>
          <li>
            Send <C>{`credentials: 'same-origin'`}</C> so the session cookie is included.
          </li>
        </ul>
        <Callout>
          <strong>CSRF is handled for you.</strong> BigCommerce injects a small script into
          storefront pages that adds the required <C>X-XSRF-TOKEN</C> header to same-origin{" "}
          <C>fetch</C> requests. Plain <C>fetch</C> works on the storefront. If you try the API
          from outside a storefront page (Postman, curl), write requests fail with{" "}
          <C>403 Forbidden</C>.
        </Callout>
        <Task title="Task 4.3: Explore the cart from the console">
          <Steps>
            <li>On your storefront, add any product to the cart the normal way.</li>
            <li>
              In the DevTools console:
              <Code>{`fetch('/api/storefront/carts', { credentials: 'same-origin' })
    .then(r => r.json())
    .then(carts => console.log(carts));`}</Code>
            </li>
          </Steps>
          <Checkpoint>
            You see an array with one cart. Expand <C>lineItems.physicalItems</C> to find{" "}
            <C>productId</C>, <C>variantId</C>, <C>quantity</C> and the selected <C>options</C>.
          </Checkpoint>
        </Task>
      </Section>

      <Section id="cart-client" title="6. A cart client for the theme">
        <Task title="Task 4.4: api/cart.js">
          <CodeFile name="assets/js/theme/custom/api/cart.js">{`import $ from 'jquery';

const CARTS_URL = '/api/storefront/carts';

async function request(url, options = {}) {
    const response = await fetch(url, {
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        ...options,
    });

    const body = response.status === 204 ? null : await response.json().catch(() => null);

    if (!response.ok) {
        // BigCommerce errors look like { status, title, detail }
        const error = new Error((body && (body.detail || body.title)) || \`Request failed with HTTP \${response.status}\`);
        error.status = response.status;
        throw error;
    }

    return body;
}

/** The current shopper's cart, or null if they don't have one yet. */
export async function getCart() {
    const carts = await request(CARTS_URL);
    return carts && carts.length ? carts[0] : null;
}

/**
 * Add line items, creating the cart if needed. Resolves with the updated cart.
 * lineItems: [{ productId, quantity, variantId? , optionSelections?: [{ optionId, optionValue }] }]
 */
export async function addLineItems(lineItems) {
    const body = JSON.stringify({ lineItems });
    const addToExisting = cart => request(\`\${CARTS_URL}/\${cart.id}/items\`, { method: 'POST', body });

    const existingCart = await getCart();
    if (existingCart) return addToExisting(existingCart);

    try {
        return await request(CARTS_URL, { method: 'POST', body });
    } catch (error) {
        // 422 can mean a cart was created meanwhile (e.g. in another tab): retry against it.
        // If there's still no cart, the 422 was about the items themselves - rethrow.
        if (error.status !== 422) throw error;
        const cart = await getCart();
        if (!cart) throw error;
        return addToExisting(cart);
    }
}

/** Total quantity, the number Cornerstone shows in the header cart pill. */
export function countCartItems(cart) {
    const {
        physicalItems = [], digitalItems = [], customItems = [], giftCertificates = [],
    } = cart.lineItems;

    return [...physicalItems, ...digitalItems, ...customItems]
        .reduce((total, item) => total + item.quantity, 0) + giftCertificates.length;
}

/** Tell Cornerstone's header (assets/js/theme/global/cart-preview.js) to update its count. */
export function refreshHeaderCartCount(cart) {
    $('body').trigger('cart-quantity-update', countCartItems(cart));
}`}</CodeFile>
          <p>
            That last function hooks into code Cornerstone already has. Its{" "}
            <C>cart-preview.js</C> listens for the event, updates the <C>.cart-quantity</C> pill and
            caches the value in <C>localStorage</C>:
          </p>
          <CodeFile name="assets/js/theme/global/cart-preview.js (Cornerstone, excerpt)">{`$body.on('cart-quantity-update', (event, quantity) => {
    // ...
    $('.cart-quantity').text(quantity).toggleClass('countPill--positive', quantity > 0);
    if (utils.tools.storage.localStorageAvailable()) {
        localStorage.setItem('cart-quantity', quantity);
    }
});`}</CodeFile>
        </Task>
      </Section>

      <Section id="react-cart" title="7. Add to cart from React">
        <Task title="Task 4.5: AddToCartButton">
          <Steps>
            <li>
              A reusable button that shows pending, success and error states. You&rsquo;ll use it
              again on Day 5:
              <CodeFile name="assets/js/theme/custom/react/AddToCartButton.js">{`import { useState } from 'react';
import { addLineItems, refreshHeaderCartCount } from '../api/cart';

export default function AddToCartButton({
    lineItems, disabled = false, label = 'Add to cart', onAdded,
}) {
    const [status, setStatus] = useState({ state: 'idle', message: '' });
    const pending = status.state === 'pending';

    const handleClick = async () => {
        setStatus({ state: 'pending', message: '' });
        try {
            const cart = await addLineItems(lineItems);
            refreshHeaderCartCount(cart);
            setStatus({ state: 'success', message: 'Added to cart.' });
            if (onAdded) onAdded(cart);
        } catch (error) {
            setStatus({ state: 'error', message: error.message });
        }
    };

    return (
        <div className="qs-add-to-cart">
            <button
                type="button"
                className="button button--primary button--small"
                onClick={handleClick}
                disabled={disabled || pending}
            >
                {pending ? 'Adding…' : label}
            </button>
            <span role="status" aria-live="polite" className={\`qs-add-to-cart__message is-\${status.state}\`}>
                {status.message}
            </span>
        </div>
    );
}`}</CodeFile>
            </li>
            <li>
              In <C>ProductCard.js</C>, import the button and add one per variant row, using{" "}
              <C>variantId</C>:
              <CodeFile name="assets/js/theme/custom/react/ProductCard.js (changes)">{`import formatPrice from '../utils/format-price';
import AddToCartButton from './AddToCartButton';

// ...inside variants.map(variant => { ... }), in the <li>, after the <div> with the label/meta:

<AddToCartButton
    lineItems={[{ productId: product.id, variantId: variant.id, quantity: 1 }]}
    disabled={!variant.inStock}
    label={variant.inStock ? 'Add to cart' : 'Out of stock'}
/>`}</CodeFile>
            </li>
            <li>
              Style the messages in <C>_quickstart-products.scss</C>:
              <Code>{`.qs-add-to-cart { margin-left: auto; text-align: right; }
.qs-add-to-cart__message { display: block; font-size: 0.8em; }
.qs-add-to-cart__message.is-success { color: stencilColor("color-success"); }
.qs-add-to-cart__message.is-error { color: stencilColor("color-error"); }`}</Code>
            </li>
          </Steps>
          <Checkpoint>
            <p>
              Clicking <strong>Add to cart</strong> on a variant shows &ldquo;Added to cart.&rdquo;,
              and the header cart count goes up without a page reload. <C>/cart.php</C> lists the
              exact variant with its option values.
            </p>
            <p>
              In DevTools › Network: the first add sends <C>GET carts</C> then{" "}
              <C>POST carts</C>; later adds send <C>GET carts</C> then{" "}
              <C>{`POST carts/{id}/items`}</C>. Try a product with a <strong>required
              modifier</strong>: the button shows BigCommerce&rsquo;s 422 message instead of failing
              silently. Commit and push.
            </p>
          </Checkpoint>
        </Task>
        <Callout tone="warn">
          If adding works on the pushed theme but the cart looks empty on <C>localhost</C>, you
          have hit a known local-proxy session quirk of <C>stencil start</C>. Always confirm cart
          behaviour on the pushed sandbox theme.
        </Callout>
      </Section>

      <Section id="rest-vs-graphql" title="8. REST or GraphQL on a Stencil storefront?">
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 dark:bg-gray-950 dark:text-gray-400">
              <tr className="divide-x divide-gray-200 dark:divide-gray-800">
                <th className="px-4 py-2 font-medium">Need</th>
                <th className="px-4 py-2 font-medium">Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-600 dark:divide-gray-800 dark:text-gray-300">
              <Row a="Product, variant, price, category or brand data" b="GraphQL Storefront API (Day 3)" />
              <Row a="Add to cart / update or remove cart items" b="REST Storefront Cart API (today), or the GraphQL cart mutations" />
              <Row a="Data from the page the shopper is already on" b="Handlebars context + inject (no request at all)" />
              <Row a="Orders, customers, cost prices, inventory, anything admin" b="Management API, from a reviewed server, never the theme" />
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="troubleshooting" title="Troubleshooting">
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 dark:bg-gray-950 dark:text-gray-400">
              <tr className="divide-x divide-gray-200 dark:divide-gray-800">
                <th className="px-4 py-2 font-medium">Symptom</th>
                <th className="px-4 py-2 font-medium">Cause &amp; fix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-600 dark:divide-gray-800 dark:text-gray-300">
              <Row a="422 Cannot create a new cart" b="A cart already exists; add to /carts/{id}/items. addLineItems handles this." />
              <Row a="422 about options / 'required'" b="A required option or modifier is missing, or the value ID doesn't belong to that option. Log the lineItems you sent." />
              <Row a="403 Forbidden" b="Missing CSRF header: the request didn't come from a storefront page, or custom code removed the platform scripts ({{{head.scripts}}})." />
              <Row a="Header count doesn't change" b="refreshHeaderCartCount wasn't called, or the theme's header isn't Cornerstone's (look for .cart-quantity)." />
              <Row a="401 from api.bigcommerce.com in curl" b="Wrong token or store hash, or the token lacks the Products scope." />
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="done" title="Day 4 checklist">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>You can explain methods, status codes, and why <C>fetch</C> doesn&rsquo;t reject on 422.</li>
          <li>
            You know which BigCommerce APIs are browser-safe, and you can list what must never run
            client-side and why.
          </li>
          <li>You called the Management API from a terminal without writing the token into a file.</li>
          <li>Variants add to the cart from React, and the header count updates, on the live sandbox.</li>
          <li>Everything committed.</li>
        </ul>
        <DayComplete day={4} />
      </Section>
    </DocLayout>
  );
}

function Row({ a, b, c }: { a: string; b: string; c?: string }) {
  return (
    <tr className="divide-x divide-gray-200 dark:divide-gray-800">
      <td className="px-4 py-2 align-top font-mono text-xs text-gray-800 dark:text-gray-200">{a}</td>
      <td className="px-4 py-2 align-top">{b}</td>
      {c !== undefined && (
        <td className="px-4 py-2 align-top font-mono text-xs text-gray-700 dark:text-gray-300">{c}</td>
      )}
    </tr>
  );
}
