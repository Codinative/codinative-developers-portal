import type { Metadata } from "next";
import {
  DocLayout,
  Section,
  Code,
  CodeFile,
  C,
  Callout,
  Checkpoint,
  Steps,
  Task,
  DocLink,
  type TocItem,
} from "@/components/public/doc";
import { Diagram, Flow, FlowStep } from "@/components/public/diagram";
import { DayComplete, DayTabs } from "@/components/public/QuickStartDays";

export const metadata: Metadata = {
  title: "Day 2: JavaScript & React - Stencil Quick Start - Codinative Developers",
};

const TOC: TocItem[] = [
  { id: "goals", title: "Today's goals" },
  { id: "how-js-loads", title: "1. How theme JS loads" },
  { id: "page-manager", title: "2. PageManager & context" },
  { id: "plain-js", title: "3. Render text with JS" },
  { id: "where-not", title: "4. Where not to put JS" },
  { id: "react-install", title: "5. Add React to the build" },
  { id: "react-component", title: "6. Your first component" },
  { id: "react-mount", title: "7. Mount it on the page" },
  { id: "lint", title: "8. ESLint & tests (optional)" },
  { id: "ship", title: "9. Ship it to the sandbox" },
  { id: "troubleshooting", title: "Troubleshooting" },
  { id: "done", title: "Day 2 checklist" },
];

export default function Day2() {
  return (
    <DocLayout
      header={<DayTabs />}
      title="Day 2: JavaScript & React in Stencil"
      intro="Today you learn exactly where theme JavaScript lives and how it gets onto a page. You'll render text with plain JS, then add React to Cornerstone's webpack build and mount a component on your Quick Start Lab page, loaded only on that page."
      toc={TOC}
    >
      <Section id="goals" title="Today's goals">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>Understand the path from <C>app.js</C> to a page-specific JavaScript class.</li>
          <li>Pass data from Handlebars into JavaScript with <C>inject</C>.</li>
          <li>Render text into <C>/quick-start-lab/</C> with plain JavaScript.</li>
          <li>Install React, configure Babel, and render a React component on that page.</li>
        </ul>
        <Callout>
          Start from where Day 1 ended: <C>stencil start</C> running, and the{" "}
          <C>templates/pages/custom/page/quick-start-lab.html</C> template containing{" "}
          <C>#quickstart-js-root</C> and <C>#quickstart-react-root</C>.
        </Callout>
      </Section>

      <Section id="how-js-loads" title="1. How theme JavaScript gets onto a page">
        <p>
          All theme JavaScript is <strong>ES modules under <C>assets/js/</C></strong>, compiled by
          webpack and Babel into <C>assets/dist/theme-bundle.main.js</C> (plus smaller chunks). You
          never add <C>{`<script>`}</C> tags per file. Instead:
        </p>
        <Diagram caption="From page request to your code running">
          <Flow>
            <FlowStep title="base.html" desc='stencilBootstrap("{{page_type}}", {{jsContext}})' />
            <FlowStep title="app.js" desc="Global.load(context) runs on every page" />
            <FlowStep title="pageClasses[pageType]" desc="product, category, cart…" />
            <FlowStep title="customClasses[context.template]" desc="your custom template's class" tone="accent" />
          </Flow>
        </Diagram>
        <p>This is the heart of <C>assets/js/app.js</C>:</p>
        <CodeFile name="assets/js/app.js (Cornerstone, abridged)">{`const pageClasses = {
    cart: () => import('./theme/cart'),
    category: () => import('./theme/category'),
    page: noop,                        // regular web pages have no JS class
    product: () => import('./theme/product'),
    // ...
};

const customClasses = {};             // <- you'll register custom templates here

window.stencilBootstrap = function stencilBootstrap(pageType, contextJSON = null, loadGlobal = true) {
    const context = JSON.parse(contextJSON || '{}');
    return {
        load() {
            $(() => {
                if (loadGlobal) { Global.load(context); }

                const importPromises = [];
                const pageClassImporter = pageClasses[pageType];
                if (typeof pageClassImporter === 'function') { importPromises.push(pageClassImporter()); }

                const customTemplateImporter = customClasses[context.template];
                if (typeof customTemplateImporter === 'function') { importPromises.push(customTemplateImporter()); }

                Promise.all(importPromises).then(imports => {
                    imports.forEach(imported => { imported.default.load(context); });
                });
            });
        },
    };
};`}</CodeFile>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <C>pageType</C> is the BigCommerce page type. Your Quick Start Lab is a web page, so
            its type is <C>page</C>, which maps to <C>noop</C> (no JS).
          </li>
          <li>
            <C>context.template</C> is the template that rendered the page. For your custom
            template it&rsquo;s <C>pages/custom/page/quick-start-lab</C>, and{" "}
            <C>customClasses</C> is the hook that lets you run JS for exactly that template.
          </li>
          <li>
            Each <C>() =&gt; import(...)</C> is a <strong>dynamic import</strong>: webpack splits
            it into its own chunk, loaded only on pages that need it. That&rsquo;s why adding React
            to one page won&rsquo;t slow down the rest of the store.
          </li>
        </ul>
        <Callout>
          Check the real value: open <C>http://localhost:3000/quick-start-lab/?debug=context</C>{" "}
          and search for <C>&quot;template&quot;</C>.
        </Callout>
      </Section>

      <Section id="page-manager" title="2. PageManager and this.context">
        <p>Every page class extends Cornerstone&rsquo;s tiny base class:</p>
        <CodeFile name="assets/js/theme/page-manager.js (complete)">{`export default class PageManager {
    constructor(context) {
        this.context = context;
    }

    type() {
        return this.constructor.name;
    }

    onReady() {
    }

    static load(context) {
        const page = new this(context);

        $(document).ready(() => {
            page.onReady.bind(page)();
        });
    }
}`}</CodeFile>
        <p>
          You override <C>onReady()</C>; it runs once the DOM is ready.{" "}
          <C>this.context</C> holds the <strong>jsContext</strong>: every value a template
          published with <C>{`{{inject 'key' value}}`}</C>. Cornerstone&rsquo;s{" "}
          <C>base.html</C> already injects some (for example <C>urls</C>, <C>cartId</C>,{" "}
          <C>template</C>), and you can add your own from any template.
        </p>
      </Section>

      <Section id="plain-js" title="3. Render text with plain JavaScript">
        <Task title="Task 2.1: Hello from JavaScript">
          <Steps>
            <li>
              <strong>Publish data from the template.</strong> In{" "}
              <C>templates/pages/custom/page/quick-start-lab.html</C>, add this as the first line
              inside <C>{`{{#partial "page"}}`}</C>:
              <Code>{`{{inject 'quickstartStoreName' settings.store_name}}`}</Code>
            </li>
            <li>
              <strong>Create the page class:</strong>
              <CodeFile name="assets/js/theme/custom/quick-start-lab.js">{`import PageManager from '../page-manager';

export default class QuickStartLab extends PageManager {
    onReady() {
        this.renderJsMessage();
    }

    renderJsMessage() {
        const root = document.getElementById('quickstart-js-root');
        if (!root) return;

        const message = document.createElement('p');
        message.className = 'quickstart-js-message';
        // textContent (not innerHTML) so store data can never inject HTML
        message.textContent = \`Hello from JavaScript! You are on \${this.context.quickstartStoreName}.\`;
        root.appendChild(message);
    }
}`}</CodeFile>
            </li>
            <li>
              <strong>Register it</strong> in <C>assets/js/app.js</C> by replacing{" "}
              <C>{`const customClasses = {};`}</C> with:
              <CodeFile name="assets/js/app.js (replace the customClasses line)">{`const getQuickStartLab = () => import('./theme/custom/quick-start-lab');

const customClasses = {
    'pages/custom/page/quick-start-lab': getQuickStartLab,
    // stencil start on Windows builds template paths with backslashes
    'pages\\\\custom\\\\page\\\\quick-start-lab': getQuickStartLab,
};`}</CodeFile>
            </li>
            <li>
              Save. <C>stencil start</C> rebuilds automatically; reload{" "}
              <C>http://localhost:3000/quick-start-lab/</C>.
            </li>
          </Steps>
          <Checkpoint>
            The page shows &ldquo;Hello from JavaScript! You are on <em>your store name</em>.&rdquo;
            The browser console has no errors, and <C>typeof window.stencilBootstrap</C> in the
            console returns <C>&quot;function&quot;</C>. Other pages don&rsquo;t show the message.
            Commit.
          </Checkpoint>
        </Task>
        <Callout>
          <strong>jQuery</strong> is available everywhere in Cornerstone as <C>$</C> (webpack
          provides it automatically), and you&rsquo;ll see it all over existing code. For new code,
          plain DOM APIs like the ones above are preferred.
        </Callout>
      </Section>

      <Section id="where-not" title="4. Where not to put JavaScript">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <strong>Inline <C>{`<script>`}</C> blocks in templates</strong>: they skip Babel, can&rsquo;t{" "}
            <C>import</C> modules, and must carry <C>{`nonce="{{nonce}}"`}</C> or the
            store&rsquo;s Content Security Policy may block them. Use them only for tiny bootstraps.
          </li>
          <li>
            <strong>Script Manager</strong>: for third-party tags (analytics, pixels, chat), not
            feature code. It isn&rsquo;t version-controlled or reviewed.
          </li>
          <li>
            <strong>The control-panel Code Editor</strong>: it can&rsquo;t run webpack, so JS edits
            there don&rsquo;t compile. Theme JS changes always go through the CLI.
          </li>
        </ul>
      </Section>

      <Section id="react-install" title="5. Add React to Cornerstone's build">
        <p>
          React components are written in <strong>JSX</strong>, which browsers can&rsquo;t run.
          Cornerstone&rsquo;s webpack already sends every <C>.js</C> file under{" "}
          <C>assets/js</C> through Babel, so we only need to (1) install React and (2) teach Babel
          JSX. This follows BigCommerce&rsquo;s official{" "}
          <DocLink href="https://docs.bigcommerce.com/developer/docs/storefront/stencil/themes/foundations/react">
            React in Stencil
          </DocLink>{" "}
          guide.
        </p>
        <Task title="Task 2.2: Install and configure">
          <Steps>
            <li>
              Stop <C>stencil start</C> (<C>Ctrl + C</C>). Then, in the theme root:
              <Code>{`npm install react@19 react-dom@19
npm install --save-dev @babel/preset-react@7`}</Code>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                The <C>@7</C> matters: Cornerstone uses Babel 7, and a preset from a newer Babel
                major would fail with a peer-dependency error.
              </span>
            </li>
            <li>
              Open <C>webpack.common.js</C>, find the <C>babel-loader</C> rule, and add the React
              preset <strong>after</strong> <C>@babel/preset-env</C> in the <C>presets</C> array:
              <CodeFile name="webpack.common.js">{`{
    test: /\\.js$/,
    include: /(assets\\/js|assets\\\\js|stencil-utils)/,
    use: {
        loader: 'babel-loader',
        options: {
            plugins: [
                '@babel/plugin-syntax-dynamic-import',
                'lodash',
            ],
            presets: [
                ['@babel/preset-env', {
                    loose: true,
                    modules: false,
                    useBuiltIns: 'entry',
                    corejs: '^3.6.5',
                }],
                ['@babel/preset-react', { runtime: 'automatic' }], // <- add this line
            ],
        },
    },
},`}</CodeFile>
            </li>
            <li>
              Start again with <C>stencil start</C>. The webpack config is only read at startup.
            </li>
          </Steps>
          <Callout>
            <strong>Why these choices?</strong> <C>runtime: &apos;automatic&apos;</C> means you
            don&rsquo;t need <C>import React from &apos;react&apos;</C> at the top of every JSX
            file. We keep JSX in <C>.js</C> files, as the official guide does, because the loader
            rule only matches <C>.js</C>. If your team prefers <C>.jsx</C>, you must also change{" "}
            <C>{`test`}</C> to <C>{`/\\.jsx?$/`}</C> and add{" "}
            <C>{`resolve: { extensions: ['.js', '.jsx'] }`}</C> to the webpack config.
          </Callout>
        </Task>
      </Section>

      <Section id="react-component" title="6. Write your first component">
        <Task title="Task 2.3: HelloReact">
          <Steps>
            <li>
              Create a small, reusable mount helper:
              <CodeFile name="assets/js/theme/custom/react/mount.js">{`import { createRoot } from 'react-dom/client';

/**
 * Render a React element into the element with the given id.
 * Returns the root (or null when the element isn't on this page).
 */
export default function mount(elementId, element) {
    const container = document.getElementById(elementId);
    if (!container) return null;

    const root = createRoot(container);
    root.render(element);
    return root;
}`}</CodeFile>
            </li>
            <li>
              Create the component:
              <CodeFile name="assets/js/theme/custom/react/HelloReact.js">{`import { useState } from 'react';

export default function HelloReact({ storeName }) {
    const [count, setCount] = useState(0);

    return (
        <div className="quickstart-react">
            <p>Hello from React! This component is rendering on {storeName}.</p>
            <button
                type="button"
                className="button button--small"
                onClick={() => setCount(count + 1)}
            >
                Clicked {count} {count === 1 ? 'time' : 'times'}
            </button>
        </div>
    );
}`}</CodeFile>
            </li>
          </Steps>
        </Task>
      </Section>

      <Section id="react-mount" title="7. Mount it from the page class">
        <Task title="Task 2.4: Render React on /quick-start-lab/">
          <Steps>
            <li>
              Update the page class:
              <CodeFile name="assets/js/theme/custom/quick-start-lab.js">{`import { StrictMode } from 'react';
import PageManager from '../page-manager';
import mount from './react/mount';
import HelloReact from './react/HelloReact';

export default class QuickStartLab extends PageManager {
    onReady() {
        this.renderJsMessage();
        this.renderReact();
    }

    renderJsMessage() {
        const root = document.getElementById('quickstart-js-root');
        if (!root) return;

        const message = document.createElement('p');
        message.className = 'quickstart-js-message';
        message.textContent = \`Hello from JavaScript! You are on \${this.context.quickstartStoreName}.\`;
        root.appendChild(message);
    }

    renderReact() {
        mount(
            'quickstart-react-root',
            <StrictMode>
                <HelloReact storeName={this.context.quickstartStoreName} />
            </StrictMode>,
        );
    }
}`}</CodeFile>
            </li>
            <li>Save and reload the lab page.</li>
          </Steps>
          <Checkpoint>
            <p>
              Under the JavaScript message you see the React paragraph, and the button counter
              increases when clicked. Open DevTools › <strong>Network</strong>, filter by{" "}
              <strong>JS</strong>, and reload: a separate chunk containing React loads on this page,
              but not on the home page.
            </p>
            <p>
              Optional: install the <em>React Developer Tools</em> browser extension and find{" "}
              <C>HelloReact</C> in its Components tab. Commit.
            </p>
          </Checkpoint>
        </Task>
        <Callout>
          Where files go from here on: page classes in <C>assets/js/theme/custom/</C>, React
          components in <C>assets/js/theme/custom/react/</C>, API helpers (Days 3 &amp; 4) in{" "}
          <C>assets/js/theme/custom/api/</C>. Keeping custom code in its own folder makes future
          Cornerstone upgrades far easier to merge.
        </Callout>
      </Section>

      <Section id="lint" title="8. ESLint & Jest with JSX (optional)">
        <p>
          <C>stencil start</C> and <C>stencil bundle</C> don&rsquo;t run ESLint, so JSX never
          breaks the build. But Cornerstone&rsquo;s ESLint config only knows{" "}
          <C>@babel/preset-env</C>, so running <C>npx eslint assets/js</C> will report parsing
          errors on JSX. It also flags components used only in JSX as &ldquo;defined but never
          used&rdquo;. If your project lints (most Codinative projects do), make these two changes
          in <C>.eslintrc</C>. <C>eslint-plugin-react</C> is already installed in Cornerstone.
        </p>
        <CodeFile name=".eslintrc (changes)">{`"parserOptions": {
    "requireConfigFile": false,
    "babelOptions": {
        "presets": [
            "@babel/preset-env",
            "@babel/preset-react"
        ]
    }
},
"plugins": ["react"],
"rules": {
    "react/jsx-uses-vars": "error",
    // ...keep all of Cornerstone's existing rules
},`}</CodeFile>
        <p>
          All the code in this Quick Start passes <C>npx eslint assets/js/theme/custom</C> with
          these settings.
        </p>
        <p>
          For Jest tests of components, add{" "}
          <C>{`['@babel/preset-react', { runtime: 'automatic' }]`}</C> to the <C>presets</C> in{" "}
          <C>babel.config.js</C> too.
        </p>
      </Section>

      <Section id="ship" title="9. Ship it to the sandbox">
        <Code>{`stencil pull          # never overwrite Page Builder changes
stencil push -a Light`}</Code>
        <Checkpoint>
          The live sandbox <C>/quick-start-lab/</C> page shows both the JavaScript and the React
          output.
        </Checkpoint>
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
              <Row
                a="Module parse failed: Unexpected token '<'"
                b="Babel isn't transforming JSX. Check the preset is in the babel-loader presets, the file ends in .js and lives under assets/js, and that you restarted stencil start."
              />
              <Row
                a="ERESOLVE / peer dependency error installing the preset"
                b="A Babel 8 preset was installed against Babel 7. Install @babel/preset-react@7."
              />
              <Row
                a="ReferenceError: React is not defined"
                b="The preset is in classic mode. Add { runtime: 'automatic' } or import React in the file."
              />
              <Row
                a="Nothing renders and there are no errors"
                b="The customClasses key doesn't match context.template. Compare it with ?debug=context (watch for typos and the trailing file name). On Windows, make sure the backslash key is present."
              />
              <Row
                a="Target container is not a DOM element"
                b="You called createRoot directly on a missing element. Use the mount helper, which checks first, and confirm the id in the template."
              />
              <Row
                a="Invalid hook call"
                b="Two copies of React are bundled, or you called a hook outside a component. Run npm ls react. There should be exactly one version."
              />
              <Row
                a="Works locally, not live"
                b="You didn't push, or the live web page isn't using the quick-start-lab template layout file (Day 1, Task 1.4)."
              />
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="done" title="Day 2 checklist">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>You can explain how <C>pageClasses</C> and <C>customClasses</C> choose which JS runs.</li>
          <li>
            Data flows from the template to JS through <C>inject</C> → <C>this.context</C>.
          </li>
          <li>The plain-JS message and the React counter both work, locally and live.</li>
          <li>React loads only on the Quick Start Lab page.</li>
          <li>Everything committed.</li>
        </ul>
        <DayComplete day={2} />
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
