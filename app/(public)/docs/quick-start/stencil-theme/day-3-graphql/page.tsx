import type { Metadata } from "next";
import Link from "next/link";
import {
  DocLayout,
  Section,
  Code,
  CodeFile,
  C,
  Callout,
  Checkpoint,
  SecurityAlert,
  Screenshot,
  Steps,
  Task,
  DocLink,
  type TocItem,
} from "@/components/public/doc";
import { DayComplete, DayTabs } from "@/components/public/QuickStartDays";
import { ADMIN_GUIDE_HREF } from "@/components/public/quick-start";

export const metadata: Metadata = {
  title: "Day 3: BigCommerce GraphQL - Stencil Quick Start - Codinative Developers",
};

const TOC: TocItem[] = [
  { id: "goals", title: "Today's goals" },
  { id: "intro", title: "1. GraphQL in 15 minutes" },
  { id: "bc-graphql", title: "2. BigCommerce's GraphQL APIs" },
  { id: "playground", title: "3. The API Playground" },
  { id: "query", title: "4. Build the product query" },
  { id: "token", title: "5. Auth inside a theme" },
  { id: "client", title: "6. A GraphQL client" },
  { id: "components", title: "7. React components" },
  { id: "wire", title: "8. Wire it to the page" },
  { id: "troubleshooting", title: "Troubleshooting" },
  { id: "done", title: "Day 3 checklist" },
];

export default function Day3() {
  return (
    <DocLayout
      header={<DayTabs />}
      title="Day 3: The BigCommerce GraphQL Storefront API"
      intro="Today you learn GraphQL, practise in BigCommerce's API Playground, and then call the Storefront API from inside your theme. You'll fetch three products, each with up to three variants plus images, prices and options, and render them with React."
      toc={TOC}
    >
      <Section id="goals" title="Today's goals">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>Explain queries, fields, arguments, variables and connections (edges/node).</li>
          <li>Run and debug queries in the Storefront API Playground.</li>
          <li>
            Call <C>/graphql</C> from theme JavaScript with the auto-generated storefront token.
          </li>
          <li>
            Render 3 products × 3 variants with images, prices and options in React on{" "}
            <C>/quick-start-lab/</C>.
          </li>
        </ul>
      </Section>

      <Section id="intro" title="1. GraphQL in 15 minutes">
        <p>
          With REST you call many URLs, and each returns a fixed shape. With{" "}
          <strong>GraphQL</strong> you call <strong>one endpoint</strong> and send a{" "}
          <strong>query</strong> describing exactly the fields you want. The response mirrors the
          query&rsquo;s shape: no missing fields, no extra ones.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <CodeFile name="Query (what you send)">{`query {
  site {
    settings {
      storeName
    }
  }
}`}</CodeFile>
          <CodeFile name="Response (what you get)">{`{
  "data": {
    "site": {
      "settings": {
        "storeName": "Codinative Sandbox"
      }
    }
  }
}`}</CodeFile>
        </div>
        <p>The vocabulary you need:</p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <strong>Schema</strong>: the typed map of everything you can ask for. The Playground
            shows it with autocomplete, so you rarely guess field names.
          </li>
          <li>
            <strong>Query / mutation</strong>: a query reads data; a mutation changes it (add to
            cart, log in).
          </li>
          <li>
            <strong>Arguments</strong>: inputs on a field, e.g. <C>products(first: 3)</C> or{" "}
            <C>url(width: 500)</C>.
          </li>
          <li>
            <strong>Variables</strong>: arguments passed separately as JSON, so the query text
            stays constant: <C>{`query ($ids: [Int!]) { ... products(entityIds: $ids) ... }`}</C>{" "}
            plus <C>{`{ "ids": [111, 112] }`}</C>.
          </li>
          <li>
            <strong>Connections</strong>: lists are paginated as{" "}
            <C>{`edges { node { ... } }`}</C>, with <C>pageInfo</C> and cursors for the next page.
            Every list field takes <C>first</C> (how many).
          </li>
          <li>
            <strong>Fragments</strong>: <C>{`... on MultipleChoiceOption { ... }`}</C> requests
            fields that only exist on one concrete type of an interface.
          </li>
          <li>
            <strong>Errors</strong>: a GraphQL request can return HTTP <strong>200</strong> and
            still contain an <C>errors</C> array. Always check it.
          </li>
        </ul>
        <p>
          Learn more: <DocLink href="https://graphql.org/learn/">graphql.org/learn</DocLink> (the
          first four pages are enough for today).
        </p>
      </Section>

      <Section id="bc-graphql" title="2. BigCommerce's GraphQL APIs">
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 dark:bg-gray-950 dark:text-gray-400">
              <tr className="divide-x divide-gray-200 dark:divide-gray-800">
                <th className="px-4 py-2 font-medium">API</th>
                <th className="px-4 py-2 font-medium">For</th>
                <th className="px-4 py-2 font-medium">Where it runs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-600 dark:divide-gray-800 dark:text-gray-300">
              <tr className="divide-x divide-gray-200 dark:divide-gray-800">
                <td className="px-4 py-2 align-top font-medium text-gray-900 dark:text-gray-100">
                  GraphQL Storefront API
                </td>
                <td className="px-4 py-2 align-top">
                  Shopper-facing data: products, variants, prices, categories, brands, cart,
                  checkout, customer login.
                </td>
                <td className="px-4 py-2 align-top text-emerald-700 dark:text-emerald-300">
                  Browser (theme JS) or server. <strong>Today&rsquo;s API.</strong>
                </td>
              </tr>
              <tr className="divide-x divide-gray-200 dark:divide-gray-800">
                <td className="px-4 py-2 align-top font-medium text-gray-900 dark:text-gray-100">
                  GraphQL Admin API
                </td>
                <td className="px-4 py-2 align-top">
                  Merchant operations (e.g. managing catalog data across channels), authenticated
                  with a store API token.
                </td>
                <td className="px-4 py-2 align-top font-medium text-red-700 dark:text-red-300">
                  Server only
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          The Storefront API only returns what a shopper could see: products must be{" "}
          <strong>visible</strong> on the storefront channel, and prices respect the store&rsquo;s
          settings (for example, hidden for guests).
        </p>
      </Section>

      <Section id="playground" title="3. The Storefront API Playground">
        <p>The fastest way to write a query is to build it interactively first.</p>
        <Steps>
          <li>
            In your sandbox&rsquo;s control panel go to{" "}
            <strong>Settings › API › Storefront API Playground</strong>. It opens already
            authenticated against your store.
          </li>
          <li>
            Paste the <C>storeName</C> query from above and press the <strong>Play</strong> button.
          </li>
          <li>
            Open the <strong>Docs</strong> / <strong>Schema</strong> panel on the right, and search
            for <C>Product</C>. Press <C>Ctrl + Space</C> inside a selection set to autocomplete
            fields.
          </li>
        </Steps>
        <Screenshot
          file="quickstart/day3-playground.png"
          alt="The Storefront API Playground with a products query on the left, the JSON response in the middle and the schema Docs panel open on the right."
          caption="Settings › API › Storefront API Playground"
        />
        <Callout>
          No control-panel access yet? The public{" "}
          <DocLink href="https://gql-playground.bigcommerce.com/">GraphQL Playground</DocLink> is
          connected to BigCommerce&rsquo;s sample store. It&rsquo;s fine for learning syntax, but
          IDs there won&rsquo;t match your sandbox.
        </Callout>
        <Task title="Task 3.1: Find three product IDs">
          <p>Run this in the Playground and pick three products that have options:</p>
          <Code>{`query {
  site {
    products(first: 20) {
      edges {
        node {
          entityId
          name
          productOptions(first: 5) {
            edges { node { displayName } }
          }
        }
      }
    }
  }
}`}</Code>
          <p>
            Write the three <C>entityId</C> values down (you can also read them from the product
            edit URL; see the{" "}
            <Link
              href={`${ADMIN_GUIDE_HREF}#products`}
              className="font-medium text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-300"
            >
              Admin guide
            </Link>
            ). If fewer than three have options, add a Size option to a couple of products in the
            control panel.
          </p>
        </Task>
      </Section>

      <Section id="query" title="4. Build the product query">
        <Task title="Task 3.2: The full query in the Playground">
          <p>
            Paste the query into the Playground, and in the <strong>Variables</strong> panel at the
            bottom enter <C>{`{ "ids": [111, 112, 113] }`}</C> with <em>your</em> IDs.
          </p>
          <CodeFile name="ProductsWithVariants.graphql">{`query ProductsWithVariants($ids: [Int!], $variantCount: Int = 3) {
  site {
    products(entityIds: $ids, first: 3) {
      edges {
        node {
          entityId
          name
          path
          defaultImage {
            url(width: 500)
            altText
          }
          prices {
            price { value currencyCode }
            salePrice { value currencyCode }
          }
          productOptions(first: 10) {
            edges {
              node {
                entityId
                displayName
                isRequired
                isVariantOption
                ... on MultipleChoiceOption {
                  displayStyle
                  values(first: 20) {
                    edges { node { entityId label isDefault } }
                  }
                }
              }
            }
          }
          variants(first: $variantCount) {
            edges {
              node {
                entityId
                sku
                defaultImage { url(width: 300) altText }
                prices { price { value currencyCode } }
                inventory { isInStock }
                options {
                  edges {
                    node {
                      entityId
                      displayName
                      values { edges { node { entityId label } } }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}`}</CodeFile>
          <p>Read it top to bottom. Each block answers part of the assignment:</p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>
              <C>products(entityIds: $ids, first: 3)</C>: exactly your three products. With no IDs
              it would return the first three in the catalog.
            </li>
            <li>
              <C>defaultImage.url(width: 500)</C>: BigCommerce resizes the image on its CDN for you.
            </li>
            <li>
              <C>prices</C>: <C>price</C> is the current price and <C>salePrice</C> is set only when
              on sale. Both include a <C>currencyCode</C> for formatting.
            </li>
            <li>
              <C>productOptions</C> lists <strong>every</strong> option. <C>isVariantOption</C> tells
              variant options (Size, Color) apart from modifiers (gift wrap). The{" "}
              <C>MultipleChoiceOption</C> fragment fetches the selectable values.
            </li>
            <li>
              <C>variants(first: $variantCount)</C>: up to 3 variants, each with its own SKU, image,
              price, stock, and the option values that define it.
            </li>
          </ul>
          <Checkpoint>
            The response has no <C>errors</C>, three products, and up to three variants each. A
            product without options returns exactly <strong>one</strong> &ldquo;base&rdquo; variant
            with an empty <C>options</C> list. That&rsquo;s expected.
          </Checkpoint>
        </Task>
        <Callout tone="warn">
          <strong>Limits you&rsquo;ll hit:</strong> <C>first</C> can&rsquo;t exceed{" "}
          <strong>50</strong> on <C>products</C>, <C>productOptions</C> and option{" "}
          <C>values</C>, or <strong>250</strong> on <C>variants</C>. Queries nested more than 16
          levels deep are rejected. Also, the <C>variants</C> list is <strong>not</strong>{" "}
          guaranteed to contain every option combination (disabled or unavailable variants can be
          missing), so never build a picker from <C>variants</C> alone. Use{" "}
          <C>productOptions</C>, as Day 5 does.
        </Callout>
      </Section>

      <Section id="token" title="5. Authentication inside a Stencil theme">
        <p>
          Every Storefront API request needs a bearer token. In a Stencil theme you{" "}
          <strong>don&rsquo;t create one</strong>: BigCommerce renders a fresh token into every
          page as <C>{`{{settings.storefront_api.token}}`}</C>.
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            It&rsquo;s <strong>designed to be public</strong>. BigCommerce&rsquo;s docs state that
            storefront tokens &ldquo;are not considered sensitive, and it is safe to expose them in
            web browsers&rdquo;. It can only read what shoppers can already see.
          </li>
          <li>
            It <strong>expires and rotates every 24 to 48 hours</strong>. Always read it from the
            page at render time. Never copy a token value into your code.
          </li>
          <li>
            Requests go to the same-origin <C>/graphql</C> endpoint with{" "}
            <C>{`credentials: 'same-origin'`}</C>, which BigCommerce&rsquo;s docs require.
          </li>
        </ul>
        <SecurityAlert title="Only the storefront token belongs in the browser">
          <p>
            The token that is safe in theme JavaScript is{" "}
            <C>{`{{settings.storefront_api.token}}`}</C>. <strong>Never</strong> put any of these in
            theme code, templates, Script Manager or a <C>data-</C> attribute:
          </p>
          <ul className="ml-5 list-disc space-y-1">
            <li>A store-level API account (V2/V3) access token, client ID or client secret.</li>
            <li>
              A <strong>customer impersonation token</strong>. BigCommerce calls these sensitive
              and rejects un-proxied browser requests that use them.
            </li>
            <li>Your Stencil-CLI token.</li>
          </ul>
          <p>
            If a feature seems to need one of these in the browser, the feature needs a server.
            Ask a senior before writing any code.
          </p>
        </SecurityAlert>
        <Task title="Task 3.3: Publish the token and product IDs from the template">
          <p>
            Update <C>templates/pages/custom/page/quick-start-lab.html</C>. Add the inject line under
            the one from Day 2, and put <em>your</em> three IDs on the React root:
          </p>
          <CodeFile name="templates/pages/custom/page/quick-start-lab.html (changes)">{`{{#partial "page"}}
{{inject 'quickstartStoreName' settings.store_name}}
{{inject 'storefrontToken' settings.storefront_api.token}}

...

        <div id="quickstart-js-root"></div>
        <div id="quickstart-react-root" data-product-ids="111,112,113"></div>`}</CodeFile>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Hard-coding IDs in a data attribute is fine for a lab. On Day 5 you&rsquo;ll make them a
            Page Builder setting.
          </p>
        </Task>
      </Section>

      <Section id="client" title="6. A small GraphQL client">
        <Task title="Task 3.4: API helpers">
          <Steps>
            <li>
              A generic request function. It handles HTTP errors <em>and</em> GraphQL{" "}
              <C>errors</C>:
              <CodeFile name="assets/js/theme/custom/api/graphql.js">{`/**
 * POST a query to the same-origin GraphQL Storefront API.
 * Resolves with \`data\`; rejects on HTTP errors or GraphQL errors.
 */
export default async function graphqlRequest(token, query, variables = {}) {
    const response = await fetch('/graphql', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            Authorization: \`Bearer \${token}\`,
        },
        body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
        throw new Error(\`GraphQL request failed with HTTP \${response.status}\`);
    }

    const { data, errors } = await response.json();
    if (errors && errors.length) {
        throw new Error(errors.map(error => error.message).join('\\n'));
    }

    return data;
}`}</CodeFile>
            </li>
            <li>
              The product query plus a <strong>normalizer</strong>. GraphQL&rsquo;s{" "}
              <C>edges/node</C> nesting is awkward in components, so flatten it once here:
              <CodeFile name="assets/js/theme/custom/api/products.js">{`import graphqlRequest from './graphql';

export const PRODUCTS_QUERY = \`
    query ProductsWithVariants($ids: [Int!], $variantCount: Int = 3) {
        site {
            products(entityIds: $ids, first: 3) {
                edges {
                    node {
                        entityId
                        name
                        path
                        defaultImage { url(width: 500) altText }
                        prices {
                            price { value currencyCode }
                            salePrice { value currencyCode }
                        }
                        productOptions(first: 10) {
                            edges {
                                node {
                                    entityId
                                    displayName
                                    isRequired
                                    isVariantOption
                                    ... on MultipleChoiceOption {
                                        displayStyle
                                        values(first: 20) {
                                            edges { node { entityId label isDefault } }
                                        }
                                    }
                                }
                            }
                        }
                        variants(first: $variantCount) {
                            edges {
                                node {
                                    entityId
                                    sku
                                    defaultImage { url(width: 300) altText }
                                    prices { price { value currencyCode } }
                                    inventory { isInStock }
                                    options {
                                        edges {
                                            node {
                                                entityId
                                                displayName
                                                values { edges { node { entityId label } } }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
\`;

const edgesToNodes = connection => (connection ? connection.edges.map(edge => edge.node) : []);

function normalizeProduct(node) {
    return {
        id: node.entityId,
        name: node.name,
        path: node.path,
        image: node.defaultImage,
        price: node.prices ? node.prices.price : null,
        salePrice: node.prices ? node.prices.salePrice : null,
        options: edgesToNodes(node.productOptions).map(option => ({
            id: option.entityId,
            name: option.displayName,
            required: option.isRequired,
            isVariantOption: option.isVariantOption,
            displayStyle: option.displayStyle || null,
            // only multiple-choice options have values; text/checkbox options get []
            values: edgesToNodes(option.values).map(value => ({
                id: value.entityId,
                label: value.label,
                isDefault: value.isDefault,
            })),
        })),
        variants: edgesToNodes(node.variants).map(variant => ({
            id: variant.entityId,
            sku: variant.sku,
            image: variant.defaultImage,
            price: variant.prices ? variant.prices.price : null,
            inStock: variant.inventory ? variant.inventory.isInStock : true,
            optionValues: edgesToNodes(variant.options).map(option => {
                const [value] = edgesToNodes(option.values);
                return {
                    optionId: option.entityId,
                    optionName: option.displayName,
                    valueId: value ? value.entityId : null,
                    label: value ? value.label : '',
                };
            }),
        })),
    };
}

/**
 * Fetch products by ID, keeping the order of \`productIds\`.
 */
export async function fetchProducts(token, productIds, { variantCount = 3 } = {}) {
    if (!productIds.length) {
        throw new Error('No product IDs were provided.');
    }

    const data = await graphqlRequest(token, PRODUCTS_QUERY, { ids: productIds, variantCount });
    const products = edgesToNodes(data.site.products).map(normalizeProduct);

    // entityIds filters but doesn't order - restore the order we asked for
    return products.sort((a, b) => productIds.indexOf(a.id) - productIds.indexOf(b.id));
}`}</CodeFile>
            </li>
            <li>
              A price formatter that respects the currency:
              <CodeFile name="assets/js/theme/custom/utils/format-price.js">{`export default function formatPrice(money) {
    if (!money) return '';

    return new Intl.NumberFormat(document.documentElement.lang || 'en', {
        style: 'currency',
        currency: money.currencyCode,
    }).format(money.value);
}`}</CodeFile>
            </li>
          </Steps>
        </Task>
      </Section>

      <Section id="components" title="7. React components">
        <Task title="Task 3.5: ProductCard and ProductShowcase">
          <Steps>
            <li>
              One product, including its options and variants:
              <CodeFile name="assets/js/theme/custom/react/ProductCard.js">{`import formatPrice from '../utils/format-price';

function Price({ price, salePrice }) {
    if (!price) return <p className="qs-card__price">Price unavailable</p>;
    if (!salePrice) return <p className="qs-card__price">{formatPrice(price)}</p>;

    return (
        <p className="qs-card__price">
            <s>{formatPrice(price)}</s> <strong>{formatPrice(salePrice)}</strong>
        </p>
    );
}

export default function ProductCard({ product }) {
    const {
        name, path, image, price, salePrice, options, variants,
    } = product;

    return (
        <article className="qs-card">
            {image && (
                <img className="qs-card__image" src={image.url} alt={image.altText || name} loading="lazy" />
            )}

            <h3 className="qs-card__title">
                <a href={path}>{name}</a>
            </h3>
            <Price price={price} salePrice={salePrice} />

            {options.length > 0 && (
                <dl className="qs-card__options">
                    {options.map(option => (
                        <div key={option.id}>
                            <dt>
                                {option.name}
                                {option.required ? ' (required)' : ''}
                            </dt>
                            <dd>{option.values.map(value => value.label).join(', ') || 'Free-form input'}</dd>
                        </div>
                    ))}
                </dl>
            )}

            <h4 className="qs-card__subtitle">Variants</h4>
            <ul className="qs-card__variants">
                {variants.map(variant => {
                    const variantImage = variant.image || image;
                    const label = variant.optionValues
                        .map(value => \`\${value.optionName}: \${value.label}\`)
                        .join(' / ') || 'Base variant';

                    return (
                        <li key={variant.id} className="qs-variant">
                            {variantImage && <img src={variantImage.url} alt={variantImage.altText || label} loading="lazy" />}
                            <div>
                                <p className="qs-variant__label">{label}</p>
                                <p className="qs-variant__meta">
                                    SKU {variant.sku} · {formatPrice(variant.price)} · {variant.inStock ? 'In stock' : 'Out of stock'}
                                </p>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </article>
    );
}`}</CodeFile>
            </li>
            <li>
              The container that fetches data and handles loading and error states:
              <CodeFile name="assets/js/theme/custom/react/ProductShowcase.js">{`import { useEffect, useState } from 'react';
import { fetchProducts } from '../api/products';
import ProductCard from './ProductCard';

export default function ProductShowcase({ token, productIds }) {
    const [state, setState] = useState({ status: 'loading', products: [], error: null });

    useEffect(() => {
        let cancelled = false;

        fetchProducts(token, productIds)
            .then(products => {
                if (!cancelled) setState({ status: 'ready', products, error: null });
            })
            .catch(error => {
                if (!cancelled) setState({ status: 'error', products: [], error });
            });

        return () => {
            cancelled = true;
        };
    }, [token, productIds]);

    if (state.status === 'loading') return <p>Loading products…</p>;
    if (state.status === 'error') return <p role="alert">Could not load products: {state.error.message}</p>;
    if (!state.products.length) return <p>No products found. Check the IDs and that they are visible.</p>;

    return (
        <div className="qs-grid">
            {state.products.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}`}</CodeFile>
            </li>
            <li>
              Minimal styles. Create the file and add{" "}
              <C>@import &quot;custom/quickstart-products&quot;;</C> to{" "}
              <C>assets/scss/theme.scss</C>:
              <CodeFile name="assets/scss/custom/_quickstart-products.scss">{`.qs-grid {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
    margin: 2rem 0;
}

.qs-card {
    border: 1px solid stencilColor("container-border-global-color-base");
    padding: 1rem;
}

.qs-card__image { width: 100%; height: auto; }
.qs-card__options dt { font-weight: 700; }
.qs-card__options dd { margin: 0 0 0.5rem; }

.qs-card__variants { list-style: none; margin: 0; }

.qs-variant {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    margin-bottom: 0.5rem;

    img { width: 3rem; height: 3rem; object-fit: cover; }
}

.qs-variant__label { margin: 0; font-weight: 700; }
.qs-variant__meta { margin: 0; font-size: 0.85em; }`}</CodeFile>
            </li>
          </Steps>
        </Task>
      </Section>

      <Section id="wire" title="8. Wire it to the page">
        <Task title="Task 3.6: Replace HelloReact with the showcase">
          <p>
            In <C>assets/js/theme/custom/quick-start-lab.js</C>, swap the React import and the{" "}
            <C>renderReact</C> method:
          </p>
          <CodeFile name="assets/js/theme/custom/quick-start-lab.js (renderJsMessage unchanged)">{`import { StrictMode } from 'react';
import PageManager from '../page-manager';
import mount from './react/mount';
import ProductShowcase from './react/ProductShowcase';

export default class QuickStartLab extends PageManager {
    onReady() {
        this.renderJsMessage();
        this.renderReact();
    }

    renderJsMessage() {
        // ...unchanged from Day 2
    }

    renderReact() {
        const container = document.getElementById('quickstart-react-root');
        if (!container) return;

        const productIds = (container.dataset.productIds || '')
            .split(',')
            .map(id => parseInt(id.trim(), 10))
            .filter(Number.isInteger);

        mount(
            'quickstart-react-root',
            <StrictMode>
                <ProductShowcase token={this.context.storefrontToken} productIds={productIds} />
            </StrictMode>,
        );
    }
}`}</CodeFile>
          <Checkpoint>
            <p>
              <C>/quick-start-lab/</C> shows three product cards, each with an image, a formatted
              price, its options and values, and up to three variants with SKU, price and stock.
            </p>
            <p>
              In DevTools › Network, filter by <C>graphql</C>: the request returns 200, and its
              response matches the Playground. In local development you may see the request{" "}
              <strong>twice</strong>. That&rsquo;s React <C>StrictMode</C> deliberately re-running
              effects in dev builds, and it doesn&rsquo;t happen in the pushed theme.
            </p>
          </Checkpoint>
        </Task>
        <Code>{`stencil pull
stencil push -a Light     # then verify on the live sandbox`}</Code>
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
              <Row a="HTTP 401" b="The token is missing or empty. Log this.context.storefrontToken; check the inject line is inside the page partial and spelled the same as in JS." />
              <Row a="Argument 'first' cannot exceed 50" b="Lower first on products, productOptions or values (the variants maximum is 250)." />
              <Row a="Cannot query field 'x' on type 'y'" b="Typo or wrong type. Build the query in the Playground with autocomplete, then paste it into products.js." />
              <Row a="Products array is empty" b="Wrong IDs, or the products aren't visible on this storefront channel. Test the same variables in the Playground." />
              <Row a="prices is null" b="The store hides prices (e.g. from guests). The Price component already handles it; log in as a customer to confirm." />
              <Row a="Works live, fails on localhost" b="stencil start proxies /graphql to the store and rewrites the origin, so it should work. If it doesn't, restart with stencil start -n, and verify on the pushed theme before debugging further." />
            </tbody>
          </table>
        </div>
        <p>
          Reference:{" "}
          <DocLink href="https://docs.bigcommerce.com/developer/docs/storefront/guides/graphql-storefront-api/overview">
            GraphQL Storefront API overview
          </DocLink>{" "}
          &middot;{" "}
          <DocLink href="https://docs.bigcommerce.com/developer/docs/storefront/guides/graphql-storefront-api/authentication">
            Storefront API authentication
          </DocLink>
        </p>
      </Section>

      <Section id="done" title="Day 3 checklist">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>You can explain edges/node, variables, fragments, and HTTP 200 with errors.</li>
          <li>You built and ran the product query in the Playground with your own IDs.</li>
          <li>
            The storefront token comes from <C>{`{{settings.storefront_api.token}}`}</C>, and you
            know which tokens must never reach the browser.
          </li>
          <li>Three products with variants, images, prices and options render in React, locally and live.</li>
          <li>Everything committed.</li>
        </ul>
        <DayComplete day={3} />
      </Section>
    </DocLayout>
  );
}

function Row({ a, b }: { a: string; b: string }) {
  return (
    <tr className="divide-x divide-gray-200 dark:divide-gray-800">
      <td className="px-4 py-2 align-top font-mono text-xs text-gray-800 dark:text-gray-200">{a}</td>
      <td className="px-4 py-2 align-top">{b}</td>
    </tr>
  );
}
