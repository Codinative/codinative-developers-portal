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
  type TocItem,
} from "@/components/public/doc";
import { Diagram, FileTree, Flow, FlowStep } from "@/components/public/diagram";
import { DayComplete, DayTabs } from "@/components/public/QuickStartDays";
import { ADMIN_GUIDE_HREF, QUICK_START_HREF } from "@/components/public/quick-start";

export const metadata: Metadata = {
  title: "Day 5: Build Your Set - Stencil Quick Start - Codinative Developers",
};

const TOC: TocItem[] = [
  { id: "brief", title: "The brief" },
  { id: "architecture", title: "Architecture" },
  { id: "setting", title: "1. Merchant setting" },
  { id: "page", title: "2. Page & template" },
  { id: "register", title: "3. Register the JS" },
  { id: "selection", title: "4. Selection logic" },
  { id: "option-picker", title: "5. OptionPicker" },
  { id: "set-product", title: "6. SetProduct" },
  { id: "build-your-set", title: "7. BuildYourSet" },
  { id: "page-class", title: "8. Mount it" },
  { id: "styles", title: "9. Styles" },
  { id: "qa", title: "10. Test it like QA" },
  { id: "ship", title: "11. Ship it" },
  { id: "security", title: "Security recap" },
  { id: "stretch", title: "Stretch goals" },
  { id: "done", title: "Day 5 checklist" },
];

const link = "font-medium text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-300";

export default function Day5() {
  return (
    <DocLayout
      header={<DayTabs />}
      title="Day 5: Capstone: Build Your Set"
      intro="Today you put the whole week together into a feature a client would actually pay for. A merchant chooses three products in Page Builder; shoppers pick options for each one; the add-to-cart button unlocks only when the set is complete, and one click adds all three items with their selected options to the cart."
      toc={TOC}
    >
      <Section id="brief" title="The brief">
        <p>Treat this like a real ticket. The page is done when all of these are true:</p>
        <Steps>
          <li>
            A web page at <C>/build-your-set/</C> uses its own custom template.
          </li>
          <li>
            The <strong>three products</strong> are chosen by the merchant in{" "}
            <strong>Page Builder › Theme Styles</strong>, not hard-coded.
          </li>
          <li>
            Each product shows its image, name and price, plus a picker for each of its options.
          </li>
          <li>
            The <strong>Add set to cart</strong> button stays <strong>disabled</strong> until the
            shopper has made a complete selection for <strong>all three</strong> products, and a
            progress indicator shows how many are done.
          </li>
          <li>
            One click adds <strong>all three products with their selected options</strong> to the
            cart in a single request, updates the header cart count, and offers a link to the cart.
          </li>
          <li>
            Out-of-stock combinations, a misconfigured product list and API errors all show a
            clear message instead of failing silently.
          </li>
        </Steps>
        <Screenshot
          file="quickstart/day5-build-your-set.png"
          alt="The finished Build Your Set page: three product steps with option chips, two marked Selected, and a sticky 'Your set' summary with a progress bar and the Add set to cart button."
          caption="The finished Build Your Set page"
        />
      </Section>

      <Section id="architecture" title="Architecture">
        <p>Almost everything reuses what you built this week:</p>
        <Diagram caption="Data flow through the Build Your Set page">
          <Flow>
            <FlowStep title="Page Builder" desc="build_your_set_product_ids (Day 1)" />
            <FlowStep title="Template" desc="inject token + IDs (Days 1-3)" />
            <FlowStep title="Page class" desc="customClasses + mount (Day 2)" />
            <FlowStep title="fetchProducts" desc="GraphQL (Day 3)" />
            <FlowStep title="addLineItems" desc="Cart REST API (Day 4)" tone="accent" />
          </Flow>
        </Diagram>
        <Diagram caption="New files today; everything else already exists from Days 2-4">
          <FileTree
            lines={[
              { name: "templates/pages/custom/page", dir: true },
              { name: "build-your-set.html", depth: 1, note: "new template" },
              { name: "assets/js/theme/custom", dir: true },
              { name: "build-your-set.js", depth: 1, note: "new page class" },
              { name: "api/products.js, api/cart.js", depth: 1, note: "reused from Days 3-4" },
              { name: "react", dir: true, depth: 1 },
              { name: "mount.js, AddToCartButton.js", depth: 2, note: "reused from Days 2 & 4" },
              { name: "build-your-set", dir: true, depth: 2 },
              { name: "selection.js", depth: 3, note: "pure selection logic" },
              { name: "OptionPicker.js", depth: 3, note: "one option's values" },
              { name: "SetProduct.js", depth: 3, note: "one product step" },
              { name: "BuildYourSet.js", depth: 3, note: "state, summary, add to cart" },
              { name: "assets/scss/custom/_build-your-set.scss", note: "styles" },
            ]}
          />
        </Diagram>
        <Callout>
          <strong>Key design decision:</strong> the pickers are built from{" "}
          <C>productOptions</C>, and the cart request sends <C>optionSelections</C>. The{" "}
          <C>variants</C> list is used only to <em>display</em> the chosen variant&rsquo;s image,
          price and stock. As Day 3 warned, <C>variants</C> can be missing combinations, so a picker
          built from it would hide valid choices.
        </Callout>
        <Callout tone="success">
          Every code file on this page was checked against a fresh clone of Cornerstone 6.21: it
          passes Cornerstone&rsquo;s production webpack build and ESLint (with the Day 2 React
          settings), and the selection flow is covered by Jest tests using real Storefront API data.
        </Callout>
      </Section>

      <Section id="setting" title="1. Let the merchant choose the products">
        <Task title="Task 5.1: A Page Builder setting">
          <Steps>
            <li>
              In <C>config.json</C>, add the setting to <C>settings</C>, using <em>your</em>{" "}
              sandbox product IDs as the default:
              <CodeFile name="config.json → settings">{`"build_your_set_product_ids": "111,112,113",`}</CodeFile>
            </li>
            <li>
              In <C>schema.json</C>, add two entries to the end of the <C>settings</C> array of
              your <strong>Quick Start</strong> section from Day 1:
              <CodeFile name="schema.json → Quick Start section → settings">{`{
  "type": "heading",
  "content": "Build Your Set"
},
{
  "type": "text",
  "label": "Build Your Set product IDs (exactly 3, comma-separated)",
  "id": "build_your_set_product_ids",
  "force_reload": true
}`}</CodeFile>
            </li>
          </Steps>
          <p>
            Pick three products that have options, and check them in the Playground first (Day 3).
            A product with a required <em>text</em> or <em>file</em> modifier can&rsquo;t be completed
            on this page. It will show a warning, and that&rsquo;s intended.
          </p>
        </Task>
      </Section>

      <Section id="page" title="2. The web page and its template">
        <Task title="Task 5.2: /build-your-set/">
          <Steps>
            <li>
              In the control panel, <strong>Storefront › Web Pages › Create a Web Page</strong>:
              name <C>Build Your Set</C>, URL <C>/build-your-set/</C>. Optionally add intro text in
              the editor; the template renders it above the set.
            </li>
            <li>
              Create the template. It injects the storefront token and the merchant&rsquo;s
              product IDs, and provides the mount point:
              <CodeFile name="templates/pages/custom/page/build-your-set.html">{`{{#partial "page"}}
{{inject 'storefrontToken' settings.storefront_api.token}}
{{inject 'buildYourSetProductIds' theme_settings.build_your_set_product_ids}}

{{> components/common/breadcrumbs breadcrumbs=breadcrumbs}}

<main class="page build-your-set-page">
    <h1 class="page-heading">{{page.title}}</h1>

    {{{region name="page_builder_content"}}}

    {{#if page.content}}
        <div class="page-content">{{{page.content}}}</div>
    {{/if}}

    <div id="build-your-set-root">
        <p>Loading your set…</p>
    </div>
</main>

{{/partial}}

{{> layout/base}}`}</CodeFile>
            </li>
            <li>
              Map it for local development in <C>config.stencil.json</C> (keep the Day 1 entry),
              then restart <C>stencil start</C>:
              <CodeFile name="config.stencil.json → customLayouts">{`"page": {
  "quick-start-lab.html": "/quick-start-lab/",
  "build-your-set.html": "/build-your-set/"
}`}</CodeFile>
            </li>
          </Steps>
        </Task>
      </Section>

      <Section id="register" title="3. Register the page class">
        <Task title="Task 5.3: customClasses">
          <p>
            Extend <C>customClasses</C> in <C>assets/js/app.js</C>. The dynamic import keeps React
            and all of today&rsquo;s code out of every other page:
          </p>
          <CodeFile name="assets/js/app.js (customClasses)">{`const getQuickStartLab = () => import('./theme/custom/quick-start-lab');
const getBuildYourSet = () => import('./theme/custom/build-your-set');

const customClasses = {
    'pages/custom/page/quick-start-lab': getQuickStartLab,
    // stencil start on Windows builds template paths with backslashes
    'pages\\\\custom\\\\page\\\\quick-start-lab': getQuickStartLab,
    'pages/custom/page/build-your-set': getBuildYourSet,
    'pages\\\\custom\\\\page\\\\build-your-set': getBuildYourSet,
};`}</CodeFile>
        </Task>
      </Section>

      <Section id="selection" title="4. The selection logic (no React)">
        <p>
          Keeping the rules in plain functions makes them easy to read, reuse and unit test. The
          shopper&rsquo;s choices for one product are stored as{" "}
          <C>{`{ [optionId]: valueId }`}</C>, using the same IDs the cart API expects.
        </p>
        <Task title="Task 5.4: selection.js">
          <CodeFile name="assets/js/theme/custom/react/build-your-set/selection.js">{`// Pure helpers for the Build Your Set page - no React, easy to unit test.
// \`choices\` is the shopper's selection for ONE product:
//   undefined            -> nothing chosen yet
//   { [optionId]: valueId } -> chosen option values ({} for a product without options)

// Variant options identify the variant, so they always need a value;
// modifiers only need one when the merchant marked them required.
const mustChoose = option => option.required || option.isVariantOption;

// Options the page can render as pickers (multiple choice: swatch, dropdown, radio...).
export const pickableOptions = product => product.options.filter(option => option.values.length > 0);

// Required options with no values (text field, date, file...) - this page can't collect them.
export const unsupportedOptions = product => product.options.filter(option => mustChoose(option) && option.values.length === 0);

/** The fetched variant matching the chosen values, or null. Used for display only. */
export function findVariant(product, choices) {
    if (!choices) return null;

    return product.variants.find(variant => variant.optionValues
        .every(value => choices[value.optionId] === value.valueId)) || null;
}

/** True when the shopper has chosen everything this product needs and it's in stock. */
export function isProductComplete(product, choices) {
    if (!choices) return false;

    const everythingChosen = product.options.every(option => !mustChoose(option) || choices[option.id] !== undefined);
    const variant = findVariant(product, choices);

    return everythingChosen && !(variant && !variant.inStock);
}

/** Storefront Cart API line item for one product. */
export function toLineItem(product, choices) {
    const optionSelections = Object.entries(choices || {}).map(([optionId, valueId]) => ({
        optionId: Number(optionId),
        optionValue: valueId,
    }));

    return optionSelections.length
        ? { productId: product.id, quantity: 1, optionSelections }
        : { productId: product.id, quantity: 1 };
}`}</CodeFile>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>
              <strong>Complete</strong> means every variant option and every required modifier has a
              value, and the matching variant (if we fetched it) isn&rsquo;t out of stock.
            </li>
            <li>
              A product with <strong>no options</strong> is complete once the shopper ticks
              &ldquo;Add this item to my set&rdquo;, stored as <C>{`{}`}</C>. That way every
              product needs an explicit choice.
            </li>
            <li>
              <C>toLineItem</C> turns choices into the exact Day 4 request shape.
            </li>
          </ul>
        </Task>
      </Section>

      <Section id="option-picker" title="5. OptionPicker: one option, many values">
        <Task title="Task 5.5: OptionPicker.js">
          <p>
            Radio buttons inside a <C>fieldset</C>/<C>legend</C> give you keyboard navigation and
            screen-reader labels for free; CSS styles them as chips.
          </p>
          <CodeFile name="assets/js/theme/custom/react/build-your-set/OptionPicker.js">{`export default function OptionPicker({
    productId, option, value, onChange,
}) {
    const name = \`bys-\${productId}-\${option.id}\`;

    return (
        <fieldset className="bys-option">
            <legend className="bys-option__legend">
                {option.name}
                {(option.required || option.isVariantOption) && <span aria-hidden="true"> *</span>}
            </legend>
            <div className="bys-option__values">
                {option.values.map(optionValue => (
                    <label
                        key={optionValue.id}
                        className={\`bys-chip\${value === optionValue.id ? ' is-selected' : ''}\`}
                    >
                        <input
                            type="radio"
                            name={name}
                            value={optionValue.id}
                            checked={value === optionValue.id}
                            onChange={() => onChange(option.id, optionValue.id)}
                        />
                        <span>{optionValue.label}</span>
                    </label>
                ))}
            </div>
        </fieldset>
    );
}`}</CodeFile>
        </Task>
      </Section>

      <Section id="set-product" title="6. SetProduct: one step of the set">
        <Task title="Task 5.6: SetProduct.js">
          <CodeFile name="assets/js/theme/custom/react/build-your-set/SetProduct.js">{`import formatPrice from '../../utils/format-price';
import OptionPicker from './OptionPicker';
import {
    findVariant,
    isProductComplete,
    pickableOptions,
    unsupportedOptions,
} from './selection';

export default function SetProduct({
    step, product, choices, onChoose, onToggle,
}) {
    const variant = findVariant(product, choices);
    const image = (variant && variant.image) || product.image;
    const price = (variant && variant.price) || product.salePrice || product.price;
    const complete = isProductComplete(product, choices);
    const pickers = pickableOptions(product);
    const unsupported = unsupportedOptions(product);

    return (
        <li className={\`bys-step\${complete ? ' is-complete' : ''}\`}>
            <p className="bys-step__number">
                Step {step}
                {complete && <span className="bys-step__done"> · Selected</span>}
            </p>

            {image && <img className="bys-step__image" src={image.url} alt={image.altText || product.name} />}

            <h2 className="bys-step__title">{product.name}</h2>
            {price && <p className="bys-step__price">{formatPrice(price)}</p>}

            {pickers.map(option => (
                <OptionPicker
                    key={option.id}
                    productId={product.id}
                    option={option}
                    value={choices ? choices[option.id] : undefined}
                    onChange={onChoose}
                />
            ))}

            {pickers.length === 0 && unsupported.length === 0 && (
                <label className="bys-include">
                    <input type="checkbox" checked={Boolean(choices)} onChange={onToggle} />
                    {' '}Add this item to my set
                </label>
            )}

            {variant && !variant.inStock && (
                <p className="bys-step__warning" role="alert">This combination is out of stock. Please choose another.</p>
            )}

            {unsupported.length > 0 && (
                <p className="bys-step__warning" role="alert">
                    This product needs input this page can&apos;t collect
                    ({unsupported.map(option => option.name).join(', ')}). Pick a different product in Page Builder.
                </p>
            )}
        </li>
    );
}`}</CodeFile>
          <p>
            The image and price follow the selected variant when it&rsquo;s in the fetched list,
            and fall back to the product&rsquo;s own. Modifier price adjustments (such as gift wrap)
            aren&rsquo;t included here. The cart always shows the authoritative price.
          </p>
        </Task>
      </Section>

      <Section id="build-your-set" title="7. BuildYourSet: state, summary and add to cart">
        <Task title="Task 5.7: BuildYourSet.js">
          <CodeFile name="assets/js/theme/custom/react/build-your-set/BuildYourSet.js">{`import { useEffect, useState } from 'react';
import { fetchProducts } from '../../api/products';
import AddToCartButton from '../AddToCartButton';
import SetProduct from './SetProduct';
import { isProductComplete, toLineItem } from './selection';

const SET_SIZE = 3;

export default function BuildYourSet({ token, productIds, cartUrl }) {
    const [load, setLoad] = useState({ status: 'loading', products: [], error: null });
    const [selections, setSelections] = useState({});
    const [added, setAdded] = useState(false);

    useEffect(() => {
        if (productIds.length !== SET_SIZE) {
            setLoad({ status: 'misconfigured', products: [], error: null });
            return undefined;
        }

        let cancelled = false;

        // variantCount 250 (the maximum) so the selected variant's image, price and stock can be shown
        fetchProducts(token, productIds, { variantCount: 250 })
            .then(products => {
                if (cancelled) return;
                setLoad(products.length === SET_SIZE
                    ? { status: 'ready', products, error: null }
                    : { status: 'misconfigured', products: [], error: null });
            })
            .catch(error => {
                if (!cancelled) setLoad({ status: 'error', products: [], error });
            });

        return () => {
            cancelled = true;
        };
    }, [token, productIds]);

    if (load.status === 'loading') return <p>Loading your set…</p>;
    if (load.status === 'error') return <p role="alert">Sorry, the set couldn&apos;t load: {load.error.message}</p>;
    if (load.status === 'misconfigured') {
        return (
            <p role="alert">
                Build Your Set needs {SET_SIZE} visible product IDs. Check the &quot;Build Your Set product IDs&quot;
                setting in Page Builder › Theme Styles.
            </p>
        );
    }

    const { products } = load;
    const completeCount = products.filter(product => isProductComplete(product, selections[product.id])).length;
    const allComplete = completeCount === products.length;
    const lineItems = products.map(product => toLineItem(product, selections[product.id]));

    const choose = (productId, optionId, valueId) => {
        setAdded(false);
        setSelections(current => ({
            ...current,
            [productId]: { ...current[productId], [optionId]: valueId },
        }));
    };

    // for products without options: include / exclude the item
    const toggle = productId => {
        setAdded(false);
        setSelections(current => {
            const next = { ...current };
            if (next[productId]) {
                delete next[productId];
            } else {
                next[productId] = {};
            }
            return next;
        });
    };

    return (
        <div className="bys">
            <ol className="bys-steps">
                {products.map((product, index) => (
                    <SetProduct
                        key={product.id}
                        step={index + 1}
                        product={product}
                        choices={selections[product.id]}
                        onChoose={(optionId, valueId) => choose(product.id, optionId, valueId)}
                        onToggle={() => toggle(product.id)}
                    />
                ))}
            </ol>

            <aside className="bys-summary" aria-labelledby="bys-summary-title">
                <h2 id="bys-summary-title" className="bys-summary__title">Your set</h2>
                <p className="bys-summary__progress">
                    {completeCount} of {products.length} selected
                </p>
                <progress max={products.length} value={completeCount} />

                <AddToCartButton
                    lineItems={lineItems}
                    disabled={!allComplete}
                    label="Add set to cart"
                    onAdded={() => setAdded(true)}
                />

                {!allComplete && (
                    <p className="bys-summary__hint">Choose the options for all {products.length} products to add the set.</p>
                )}
                {added && <a className="button" href={cartUrl}>View cart</a>}
            </aside>
        </div>
    );
}`}</CodeFile>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>
              <C>selections</C> is the single source of truth. Completion, the progress count and
              the line items are all <em>derived</em> from it on each render, so they can&rsquo;t
              drift out of sync.
            </li>
            <li>
              The button is the Day 4 <C>AddToCartButton</C>, disabled until{" "}
              <C>allComplete</C>. It sends all three line items in <strong>one</strong>{" "}
              <C>addLineItems</C> call: one request, one success or failure to handle.
            </li>
            <li>
              All hooks run before the early <C>return</C>s, which is a React rule. The helper
              functions after them are plain functions, not hooks.
            </li>
          </ul>
        </Task>
      </Section>

      <Section id="page-class" title="8. Mount it from the page class">
        <Task title="Task 5.8: build-your-set.js">
          <CodeFile name="assets/js/theme/custom/build-your-set.js">{`import { StrictMode } from 'react';
import PageManager from '../page-manager';
import mount from './react/mount';
import BuildYourSet from './react/build-your-set/BuildYourSet';

// "111, 112,113" -> [111, 112, 113]
const parseIds = value => String(value || '')
    .split(',')
    .map(id => parseInt(id.trim(), 10))
    .filter(Number.isInteger);

export default class BuildYourSetPage extends PageManager {
    onReady() {
        mount(
            'build-your-set-root',
            <StrictMode>
                <BuildYourSet
                    token={this.context.storefrontToken}
                    productIds={parseIds(this.context.buildYourSetProductIds)}
                    cartUrl={this.context.urls.cart}
                />
            </StrictMode>,
        );
    }
}`}</CodeFile>
          <p>
            <C>this.context.urls</C> is injected by Cornerstone&rsquo;s <C>base.html</C>, so{" "}
            <C>urls.cart</C> always points at the store&rsquo;s real cart URL.
          </p>
        </Task>
      </Section>

      <Section id="styles" title="9. Styles">
        <Task title="Task 5.9: _build-your-set.scss">
          <p>
            Create the file and add <C>@import &quot;custom/build-your-set&quot;;</C> to{" "}
            <C>assets/scss/theme.scss</C>, next to your Day 1 and Day 3 imports:
          </p>
          <CodeFile name="assets/scss/custom/_build-your-set.scss">{`.bys {
    display: grid;
    gap: 2rem;
    align-items: start;
    margin: 2rem 0;

    @include breakpoint("medium") {
        grid-template-columns: 1fr 18rem;
    }
}

.bys-steps {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
    margin: 0;
    list-style: none;
}

.bys-step {
    border: 2px solid stencilColor("container-border-global-color-base");
    padding: 1rem;

    &.is-complete {
        border-color: stencilColor("color-success");
    }
}

.bys-step__number { margin: 0 0 0.5rem; font-weight: 700; text-transform: uppercase; font-size: 0.8em; }
.bys-step__done { color: stencilColor("color-success"); }
.bys-step__image { width: 100%; height: auto; margin-bottom: 0.75rem; }
.bys-step__title { margin: 0; font-size: 1.1rem; }
.bys-step__warning { color: stencilColor("color-error"); font-size: 0.85em; }

.bys-option { border: 0; margin: 1rem 0 0; padding: 0; }
.bys-option__legend { font-weight: 700; margin-bottom: 0.5rem; }
.bys-option__values { display: flex; flex-wrap: wrap; gap: 0.5rem; }

.bys-chip {
    position: relative;
    border: 1px solid stencilColor("container-border-global-color-base");
    padding: 0.35rem 0.75rem;
    cursor: pointer;

    input {
        position: absolute;
        opacity: 0;
        pointer-events: none;
    }

    &:focus-within { outline: 2px solid stencilColor("color-primary"); outline-offset: 2px; }
    &.is-selected { border-color: stencilColor("color-primary"); font-weight: 700; }
}

.bys-summary {
    position: sticky;
    top: 1rem;
    border: 1px solid stencilColor("container-border-global-color-base");
    padding: 1rem;

    progress { width: 100%; margin-bottom: 1rem; }
    .button { margin-top: 0.75rem; }
}

.bys-summary__title { margin-top: 0; }
.bys-summary__hint { font-size: 0.85em; }`}</CodeFile>
          <Checkpoint>
            <C>http://localhost:3000/build-your-set/</C> shows three product steps, each with
            option chips, and a summary reading &ldquo;0 of 3 selected&rdquo; with a disabled{" "}
            <strong>Add set to cart</strong> button.
          </Checkpoint>
        </Task>
      </Section>

      <Section id="qa" title="10. Test it like QA would">
        <p>
          Go through every row yourself, on desktop <em>and</em> at phone width, with the DevTools
          Console and Network tabs open:
        </p>
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 dark:bg-gray-950 dark:text-gray-400">
              <tr className="divide-x divide-gray-200 dark:divide-gray-800">
                <th className="px-4 py-2 font-medium">Scenario</th>
                <th className="px-4 py-2 font-medium">Expected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-600 dark:divide-gray-800 dark:text-gray-300">
              <Row a="Page loads" b="Three steps, no console errors, button disabled, '0 of 3 selected'." />
              <Row a="Complete product 1 only" b="Step 1 shows 'Selected' with a green border; '1 of 3'; button still disabled." />
              <Row a="Complete all three" b="'3 of 3'; button enabled; the hint text disappears." />
              <Row a="Change an option after completing" b="The selection updates, the image/price follow the variant, and the button stays enabled." />
              <Row a="Pick an out-of-stock combination" b="Warning shown; that step is incomplete; button disabled." />
              <Row a="Click Add set to cart" b="Exactly one GET carts and one POST (carts or carts/{id}/items) containing 3 lineItems; 'Added to cart.'; header count +3; 'View cart' link." />
              <Row a="Open the cart" b="All three products are listed with the option values you picked." />
              <Row a="Keyboard only" b="Tab into each option group, use the arrow keys to change the value, reach and press the button." />
              <Row a="Set only 2 IDs in Page Builder" b="The misconfiguration message is shown instead of a broken page." />
              <Row a="Block /api/storefront in DevTools (request blocking)" b="The button shows an error message and stays usable." />
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="ship" title="11. Ship it">
        <Task title="Task 5.10: Live on the sandbox">
          <Steps>
            <li>
              <C>git status</C> must show no secrets. Commit, then:
              <Code>{`stencil pull
stencil bundle        # catch schema/config errors before pushing
stencil push -a Light`}</Code>
            </li>
            <li>
              <strong>Storefront › Web Pages</strong> › Build Your Set › <strong>Template layout
              file</strong>: <C>build-your-set</C>. Save.
            </li>
            <li>
              <strong>Page Builder › Theme Styles › Quick Start</strong>: set the three product
              IDs and <strong>Publish</strong>. Then run <C>stencil pull</C> again so the value is
              in your repo.
            </li>
            <li>
              Run the QA table again on the live URL, then place a test order through checkout
              using the sandbox&rsquo;s test payment gateway, and confirm the three items and
              their options under <strong>Orders</strong> (see the{" "}
              <Link href={`${ADMIN_GUIDE_HREF}#customers-orders`} className={link}>
                Admin guide
              </Link>
              ).
            </li>
            <li>
              Open a pull request describing the feature, with a screen recording, and ask a
              senior developer to review it. That&rsquo;s how every Codinative feature ships.
            </li>
          </Steps>
          <Checkpoint>
            A merchant can change the set in Page Builder without a developer, and a shopper can add
            a complete set to the cart in one click on the live sandbox.
          </Checkpoint>
        </Task>
      </Section>

      <Section id="security" title="Security recap">
        <SecurityAlert title="What this feature must never do">
          <ul className="ml-5 list-disc space-y-1">
            <li>
              Use any token other than <C>{`{{settings.storefront_api.token}}`}</C> in the browser,
              or call <C>api.bigcommerce.com</C> from theme code (Day 4).
            </li>
            <li>
              Try to set or discount prices from JavaScript. The cart API calculates prices on
              BigCommerce&rsquo;s side. A &ldquo;set discount&rdquo; belongs in{" "}
              <strong>Marketing › Promotions</strong>, never in client code.
            </li>
            <li>
              Render store data with <C>dangerouslySetInnerHTML</C>. React escapes text for you, so
              keep it that way.
            </li>
          </ul>
          <p>
            Product IDs in a theme setting are public information and safe to expose. The cart API
            validates every option and value, so a tampered request can&rsquo;t add anything a
            shopper couldn&rsquo;t add normally.
          </p>
        </SecurityAlert>
      </Section>

      <Section id="stretch" title="Stretch goals (if you finish early)">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            Add a quantity selector per product, and a &ldquo;Reset set&rdquo; button.
          </li>
          <li>
            Create a <strong>Promotion</strong> in the control panel that discounts the three
            products when bought together, and show the saving in the summary.
          </li>
          <li>
            Replace the radio chips with swatches when <C>displayStyle</C> is a swatch type.
          </li>
          <li>
            Write Jest tests for <C>selection.js</C> (add <C>@babel/preset-react</C> to{" "}
            <C>babel.config.js</C> first, as in Day 2) and run them with <C>npx jest</C>.
          </li>
          <li>
            Lighthouse the page, and make sure React&rsquo;s chunk only loads on{" "}
            <C>/build-your-set/</C>.
          </li>
        </ul>
      </Section>

      <Section id="done" title="Day 5 checklist">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>Every point in the brief is met on the live sandbox.</li>
          <li>Every row of the QA table passes.</li>
          <li>The product IDs are a Page Builder setting and are pulled into <C>config.json</C>.</li>
          <li>ESLint is clean, no secrets are committed, and a PR is open for review.</li>
        </ul>
        <DayComplete day={5} />
        <Callout tone="success">
          <strong>You finished the Stencil Quick Start.</strong> You can now set up a theme, write
          JS and React in it, query GraphQL, use the REST APIs safely, and ship a real feature.
          Keep going with the{" "}
          <Link href="/docs/bigcommerce-developer-onboarding/guided-coursework" className={link}>
            Guided Coursework
          </Link>
          , and watch the{" "}
          <Link href={QUICK_START_HREF} className={link}>
            Quick Start hub
          </Link>{" "}
          for the Widget Builder and App tracks.
        </Callout>
      </Section>
    </DocLayout>
  );
}

function Row({ a, b }: { a: string; b: string }) {
  return (
    <tr className="divide-x divide-gray-200 dark:divide-gray-800">
      <td className="px-4 py-2 align-top font-medium text-gray-800 dark:text-gray-200">{a}</td>
      <td className="px-4 py-2 align-top">{b}</td>
    </tr>
  );
}
