import type { Metadata } from "next";
import {
  DocLayout,
  Section,
  Callout,
  DocLink,
  type TocItem,
} from "@/components/public/doc";
import { LearningPath, type PathPhase } from "@/components/public/learning-path";

export const metadata: Metadata = {
  title: "Guided Coursework - BigCommerce Onboarding - Codinative Developers",
};

const TOC: TocItem[] = [
  { id: "prerequisites", title: "Prerequisites" },
  { id: "why-learn", title: "BigCommerce Learn" },
  { id: "the-path", title: "The Codinative path" },
  { id: "how", title: "How to work through it" },
  { id: "references", title: "Learn resources" },
];

const COURSE_BASE = "https://docs.bigcommerce.com/developer/learn/courses";
const PLAN_BASE = "https://docs.bigcommerce.com/developer/learn/learning-plans";

const PHASES: PathPhase[] = [
  {
    title: "Foundations - front-end first",
    tag: "Developer Foundations - part 1",
    sourceLabel: "Developer Foundations",
    sourceHref: `${PLAN_BASE}/developer-foundations`,
    accent: "slate",
    courses: [
      {
        title: "Intro to BigCommerce Development",
        lessons: 12,
        duration: "4h 20min",
        desc: "Familiarize yourself with the key concepts and tools involved with custom development on BigCommerce.",
        href: `${COURSE_BASE}/intro-to-bc-development/overview/course-overview`,
      },
      {
        title: "Storefront Foundations",
        lessons: 16,
        duration: "6h 50min",
        desc: "Explore the key front-end development principles for both Stencil and Catalyst storefronts.",
        href: `${COURSE_BASE}/storefront-foundations/overview/course-overview`,
      },
    ],
  },
  {
    title: "Become a Stencil developer",
    tag: "Stencil Developer",
    sourceLabel: "Stencil Developer",
    sourceHref: `${PLAN_BASE}/stencil-developer`,
    accent: "blue",
    courses: [
      {
        title: "Stencil Core",
        lessons: 16,
        duration: "6h 20min",
        desc: "Learn the fundamentals of Stencil, BigCommerce's default theme engine, and the Cornerstone base theme.",
        href: `${COURSE_BASE}/stencil-core/overview/course-overview`,
      },
      {
        title: "Stencil Advanced",
        lessons: 28,
        duration: "10h 50min",
        desc: "Dive deeper into Stencil's technology stack, advanced customization, and deployment workflows.",
        href: `${COURSE_BASE}/stencil-advanced/overview/course-overview`,
      },
    ],
  },
  {
    title: "Build with the APIs",
    tag: "APIs",
    sourceLabel: "Developer Foundations & Stencil Developer",
    sourceHref: PLAN_BASE,
    accent: "teal",
    note: "With Stencil and storefronts behind you, learn the APIs that power widgets, catalog data, and shopper-facing storefronts.",
    courses: [
      {
        title: "Widgets REST API",
        lessons: 22,
        duration: "9h 25min",
        desc: "Learn to create and manage widgets, templates, and placements using the Widgets REST API.",
        href: `${COURSE_BASE}/widgets-rest-api/overview/course-overview`,
      },
      {
        title: "Catalog REST API",
        lessons: 21,
        duration: "9h 5min",
        desc: "Learn to interact with the Catalog API to manage products, categories, brands, and more.",
        href: `${COURSE_BASE}/catalog-rest-api/overview/course-overview`,
      },
      {
        title: "GraphQL Storefront API",
        lessons: 28,
        duration: "12h 40min",
        desc: "Learn how to interact with the GraphQL Storefront API to enable shopper-facing workflows.",
        href: `${COURSE_BASE}/graphql-storefront-api/overview/course-overview`,
      },
    ],
  },
  {
    title: "B2B development",
    tag: "B2B Developer - all courses",
    sourceLabel: "B2B Developer",
    sourceHref: `${PLAN_BASE}/b2b-developer`,
    accent: "emerald",
    courses: [
      {
        title: "B2B Core",
        lessons: 19,
        duration: "8h",
        desc: "Learn the key capabilities of BigCommerce B2B Edition and how to use the REST Management API.",
        href: `${COURSE_BASE}/b2b-core/overview/course-overview`,
      },
      {
        title: "GraphQL for B2B",
        lessons: 18,
        duration: "8h 35min",
        desc: "Learn to use the B2B GraphQL API to manage companies, quotes, shopping lists, orders, and invoices.",
        href: `${COURSE_BASE}/b2b-graphql/overview/course-overview`,
      },
      {
        title: "B2B Buyer Portal",
        lessons: 25,
        duration: "8h 15min",
        desc: "Learn the architecture and customization strategies for the shopper-facing Buyer Portal app.",
        href: `${COURSE_BASE}/b2b-buyer-portal/overview/course-overview`,
      },
    ],
  },
];

export default function LearningPathModule() {
  return (
    <DocLayout
      title="Guided Coursework"
      intro="Your structured path through BigCommerce's official developer training - which courses to take, in the order that works best at Codinative, with your progress tracked as you go."
      toc={TOC}
    >
      <Section id="prerequisites" title="Prerequisites">
        <p>
          The courses assume you&rsquo;re already comfortable with core web development.
          If any of the essentials below are shaky, spend a little time leveling up first -
          the material will move much faster.
        </p>
        <p className="font-medium text-gray-700 dark:text-gray-200">You should already know:</p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <strong>HTML</strong> - semantic markup and document structure.
          </li>
          <li>
            <strong>CSS</strong> - selectors, the box model, and layout with flexbox &amp;
            grid, plus responsive design. (Sass/SCSS is a plus - it&rsquo;s what Stencil
            themes are built in.)
          </li>
          <li>
            <strong>JavaScript (ES6+)</strong> - variables, functions, promises and
            async/await, the DOM, and the Fetch API.
          </li>
          <li>
            <strong>Node.js &amp; npm basics</strong> - you&rsquo;ll install and run the
            Stencil CLI with them. New to this? Start with{" "}
            <a
              href="/docs/environment-setup"
              className="font-medium text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-300"
            >
              Environment setup
            </a>
            .
          </li>
          <li>
            <strong>HTTP, JSON &amp; REST fundamentals</strong> - requests and responses,
            status codes, and headers.
          </li>
        </ul>
        <p className="font-medium text-gray-700 dark:text-gray-200">
          Helpful, but you&rsquo;ll pick these up along the way:
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <strong>Handlebars</strong> templating - taught in Stencil Core.
          </li>
          <li>
            <strong>React / Next.js</strong> - needed later for Catalyst and app
            development.
          </li>
          <li>
            <strong>GraphQL</strong> basics - covered in the API courses.
          </li>
        </ul>
      </Section>

      <Section id="why-learn" title="BigCommerce Learn">
        <p>
          The <strong>Learn</strong> tab in the BigCommerce developer docs is where the
          official training lives. It is organised into <strong>learning plans</strong> -
          multi-course journeys tied to developer certifications - and individual{" "}
          <strong>courses</strong>, each with structured lessons, hands-on exercises, and
          assessments.
        </p>
        <p>
          Three learning plans form the backbone of this path:{" "}
          <strong>Developer Foundations</strong>, <strong>Stencil Developer</strong>, and{" "}
          <strong>B2B Developer</strong>. The phases below draw from them in the sequence
          that builds your skills fastest - front-end first, then Stencil, then the APIs,
          and finally B2B.
        </p>
      </Section>

      <Section id="the-path" title="The Codinative coursework path">
        <p>
          Work through the phases top to bottom - each one builds on the last. Check a
          course off when you finish it; the next course unlocks only once the current one
          is done, and your progress is saved in this browser.
        </p>
        <LearningPath phases={PHASES} totalLessons={205} totalHours="~84h" />
      </Section>

      <Section id="how" title="How to work through it">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <strong>Go in order.</strong> Each phase assumes the one before it. The tracker
            keeps you on sequence - the next course unlocks only when you complete the
            current one.
          </li>
          <li>
            <strong>Do it on a sandbox.</strong> Pair each course with a developer sandbox
            store so you&rsquo;re building, not just watching.
          </li>
          <li>
            <strong>Then move on to Beyond the Courses.</strong> Once the courses are done,
            work through the essential follow-up modules -{" "}
            <DocLink href="/docs/bigcommerce-developer-onboarding/customization-surfaces">
              Customization Surfaces
            </DocLink>
            ,{" "}
            <DocLink href="/docs/bigcommerce-developer-onboarding/apps-and-integrations">
              Apps &amp; Integrations
            </DocLink>
            ,{" "}
            <DocLink href="/docs/bigcommerce-developer-onboarding/catalyst-and-headless">
              Catalyst &amp; Headless
            </DocLink>
            , and{" "}
            <DocLink href="/docs/bigcommerce-developer-onboarding/using-the-bigcommerce-docs">Using the BigCommerce Docs</DocLink>{" "}
            - which tie the courses to how Codinative actually builds.
          </li>
        </ul>
        <Callout>
          <strong>Aim to finish the coursework within your first month.</strong> It&rsquo;s
          roughly 84 hours, so treat it as your main focus early on. And whenever you&rsquo;re
          stuck - a concept, your setup, or a course exercise - <strong>ask the senior
          developers</strong>; that&rsquo;s exactly what they&rsquo;re here for.
        </Callout>
      </Section>

      <Section id="references" title="BigCommerce Learn resources">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <DocLink href="https://docs.bigcommerce.com/developer/learn/overview">
              Learn - overview
            </DocLink>{" "}
            and{" "}
            <DocLink href="https://docs.bigcommerce.com/developer/learn/learning-plans">
              all learning plans
            </DocLink>
            .
          </li>
          <li>
            <DocLink href={`${PLAN_BASE}/developer-foundations`}>Developer Foundations</DocLink>{" "}
            &middot;{" "}
            <DocLink href={`${PLAN_BASE}/stencil-developer`}>Stencil Developer</DocLink>{" "}
            &middot; <DocLink href={`${PLAN_BASE}/b2b-developer`}>B2B Developer</DocLink>.
          </li>
        </ul>
      </Section>
    </DocLayout>
  );
}
