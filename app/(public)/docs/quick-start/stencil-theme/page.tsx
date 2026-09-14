import type { Metadata } from "next";
import Link from "next/link";
import {
  DocLayout,
  Section,
  C,
  Callout,
  Steps,
  DocLink,
  type TocItem,
} from "@/components/public/doc";
import { Diagram, Flow, FlowStep } from "@/components/public/diagram";
import { DaySyllabus } from "@/components/public/QuickStartDays";
import { ADMIN_GUIDE_HREF, STENCIL_DAYS } from "@/components/public/quick-start";

export const metadata: Metadata = {
  title: "Stencil Theme Development in 5 Days - Quick Start - Codinative Developers",
};

const TOC: TocItem[] = [
  { id: "outcome", title: "What you'll build" },
  { id: "how", title: "How this works" },
  { id: "before", title: "Before Day 1" },
  { id: "syllabus", title: "The 5 days" },
  { id: "stuck", title: "When you get stuck" },
];

export default function StencilQuickStart() {
  return (
    <DocLayout
      title="Stencil Theme Development in 5 Days"
      intro="A guided week that takes you from an empty laptop to a working, custom BigCommerce storefront feature. No slide decks: every day is a list of tasks you perform on a real sandbox store, with a checkpoint that tells you you've got it right."
      toc={TOC}
    >
      <Section id="outcome" title="What you'll build">
        <p>
          By Friday you&rsquo;ll have a custom <strong>Build Your Set</strong> page running on
          your sandbox store: a shopper picks options for three products, the add-to-cart button
          unlocks once all three are chosen, and one click puts the whole set into the cart.
          Building it touches every core skill of Stencil work:
        </p>
        <Diagram caption="Each day adds one layer; Day 5 stacks them into a real feature">
          <Flow>
            {STENCIL_DAYS.map((d) => (
              <FlowStep
                key={d.slug}
                title={`Day ${d.day}`}
                desc={d.short}
                tone={d.day === 5 ? "accent" : "default"}
              />
            ))}
          </Flow>
        </Diagram>
      </Section>

      <Section id="how" title="How this works">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <strong>Do, don&rsquo;t just read.</strong> Each day has numbered steps and{" "}
            <strong>Task</strong> boxes. Type the commands and write the code yourself. Avoid
            copy-pasting whole files: typing it is how it sticks.
          </li>
          <li>
            <strong>Hit every checkpoint.</strong> A day is done when every checkpoint passes on
            your machine, not when you reach the bottom of the page.
          </li>
          <li>
            <strong>Commit as you go.</strong> Keep your theme in a Git repo and commit after each
            task. By Friday your history tells the story of the week, and your reviewer can
            follow it.
          </li>
          <li>
            <strong>Mark the day complete</strong> at the bottom of each page. Progress is saved
            in your browser, and every day stays open for reference.
          </li>
        </ul>
        <Callout>
          Budget roughly <strong>6 focused hours per day</strong>. Days 1 and 2 are mostly setup
          and wiring, and they are the days most likely to run long. If they do, finish them
          before moving on, because every later day builds on them.
        </Callout>
      </Section>

      <Section id="before" title="Before Day 1">
        <Steps>
          <li>
            <strong>A laptop with admin rights</strong>, plus a terminal you&rsquo;re comfortable
            in (Terminal / iTerm on macOS, PowerShell or Windows Terminal on Windows).
          </li>
          <li>
            <strong>Git and a GitHub account</strong>. If Git is new to you, skim{" "}
            <Link
              href="/docs/bigcommerce-developer-onboarding/git-and-github"
              className="font-medium text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-300"
            >
              Git &amp; GitHub
            </Link>{" "}
            first.
          </li>
          <li>
            <strong>A code editor</strong>. VS Code is recommended; add a Handlebars syntax
            extension.
          </li>
          <li>
            <strong>Sandbox store credentials.</strong> You&rsquo;ll get a BigCommerce sandbox
            store URL and a login for its control panel. If they weren&rsquo;t in your onboarding
            email, <strong>ask a senior developer for sandbox credentials</strong>. Never
            practise on a client&rsquo;s live store.
          </li>
          <li>
            <strong>A first look at the control panel.</strong> Keep the{" "}
            <Link
              href={ADMIN_GUIDE_HREF}
              className="font-medium text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-300"
            >
              Admin panel guide
            </Link>{" "}
            open in a tab; the days link to it whenever you need to click through the admin.
          </li>
        </Steps>
        <Callout tone="warn">
          Your sandbox needs <strong>at least 3 products that have options</strong> (for example,
          a T-shirt with Size and Color) for Days 3 to 5. Most sandboxes come with sample
          products. If yours doesn&rsquo;t, the Admin panel guide shows how to create them.
        </Callout>
      </Section>

      <Section id="syllabus" title="The 5 days">
        <DaySyllabus />
      </Section>

      <Section id="stuck" title="When you get stuck">
        <Steps>
          <li>
            <strong>Read the error.</strong> Read the whole message in the terminal <em>and</em>{" "}
            the browser DevTools console. Most Stencil errors name the exact file and line.
          </li>
          <li>
            <strong>Check the official docs.</strong> Every day links to the relevant{" "}
            <DocLink href="https://developer.bigcommerce.com/docs/storefront/stencil">
              BigCommerce developer docs
            </DocLink>
            . Their Ask AI search is good at explaining error messages.
          </li>
          <li>
            <strong>Timebox it.</strong> If you&rsquo;ve been blocked for{" "}
            <strong>30 minutes</strong>, ask. Post the command you ran, the full error, and what
            you already tried in the team channel. That&rsquo;s expected, not a failure.
          </li>
        </Steps>
        <p>
          Never paste an access token, <C>secrets.stencil.json</C>, or a store password into chat
          or an AI tool. Share the error, not the credentials.
        </p>
      </Section>
    </DocLayout>
  );
}
