import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Lock } from "lucide-react";
import { auth } from "@/lib/auth";
import {
  DocLayout,
  Section,
  C,
  Callout,
  Steps,
  type TocItem,
} from "@/components/public/doc";

export const metadata: Metadata = {
  title: "Development Process - BigCommerce Onboarding - Codinative Developers",
};

const TOC: TocItem[] = [
  { id: "overview", title: "Overview" },
  { id: "mental-model", title: "The mental model" },
  { id: "prerequisites", title: "Prerequisites" },
  { id: "assumptions", title: "Assumptions" },
  { id: "day-0", title: "Day 0 setup" },
  { id: "tasks", title: "Giving Claude a task" },
  { id: "adherence", title: "Following the docs" },
  { id: "dod", title: "QA — Definition of Done" },
  { id: "complete", title: "Marking a task complete" },
  { id: "review", title: "Code review (PR)" },
  { id: "release", title: "Creating a release" },
  { id: "git", title: "Git & consent" },
  { id: "hard-rules", title: "Hard rules" },
  { id: "habits", title: "Positive habits" },
  { id: "process-updates", title: "Updating the process" },
  { id: "troubleshooting", title: "Troubleshooting" },
];

// Team-only: gated by middleware; this guard is defense in depth.
export default async function DevelopmentProcess() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <DocLayout
      title="The Codinative Development Process"
      intro="How we actually build BigCommerce themes at Codinative - the .claude process kit and Claude Code workflow that keeps every codebase consistent, high-quality, and professionally reviewed. Read it once before your first project; after that the process runs itself."
      toc={TOC}
    >
      <Callout>
        <span className="inline-flex items-center gap-1.5">
          <Lock className="h-3.5 w-3.5" />
          <strong>Internal &middot; Codinative team only.</strong>
        </span>{" "}
        This is the full guide to working on a theme with the <C>.claude/</C> process kit. The rules
        surface automatically and Claude follows them; your job is to give clear tasks, run the
        checks only a human can, get your work reviewed via PR, and approve the git/deploy steps.
      </Callout>

      <Callout tone="warn">
        <strong>Process repo:</strong> <C>&lt;https://github.com/Codinative/bigcommerce-theme-customization-process.git&gt;</C> &mdash; clone it to
        use the kit and browse the latest rules. (Placeholder &mdash; fill this in.)
      </Callout>

      <Section id="overview" title="What this is (and why)">
        <p>
          At Codinative, theme customization isn&rsquo;t ad-hoc. Every project runs on one shared,
          version-controlled process &mdash; a <C>.claude/</C> kit that pairs each developer with
          Claude Code and a fixed set of standards. <strong>You</strong> decide what to build and own
          the quality calls a machine can&rsquo;t make; <strong>Claude</strong> implements to those
          standards, runs the machine checks, and proposes each git step for your approval. The result
          is that a first-week developer and a five-year veteran ship work that looks like it came from
          the same hand.
        </p>
        <p>
          <strong>How it&rsquo;s built:</strong> the standard itself &mdash; folder structure, CSS /
          HTML / JS conventions, accessibility, SEO, performance, git hygiene, and QA &mdash; is written
          once as machine-readable rules that load automatically in Claude Code and are scoped to the
          file you&rsquo;re editing (touch a <C>.scss</C> file and the CSS rules surface; touch{" "}
          <C>.html</C> and the HTML + SEO rules do). Those rules are backed by hard lint gates and a
          written Definition of Done, so &ldquo;done&rdquo; is a checklist, not a feeling. The kit lives
          in one central repo and is copied into every theme &mdash; so improving it in one place
          upgrades every project at once.
        </p>
        <p>
          <strong>Why it&rsquo;s worth it:</strong> quality is enforced twice &mdash; once by the
          machine (lint + the DoD) and once by a human (a paired teammate who reviews your PR) &mdash;
          and every state-changing action is consent-gated, so nothing is committed, merged, pushed, or
          deployed, and no credential is ever touched, without your explicit go-ahead. What you get:
          consistency across projects, faster and safer onboarding, and a git history where every change
          is traceable and reviewed. The sections below walk the whole lifecycle, from Day-0 setup to
          cutting a release.
        </p>
      </Section>

      <Section id="mental-model" title="1. The mental model (read this first)">
        <p>There are two actors, and the whole process is built on the split between them:</p>
        <ul className="ml-5 list-disc space-y-1">
          <li>
            <strong>You, the developer &mdash; the decision-maker and a quality gate.</strong> You
            choose what to build, run the checks a machine can&rsquo;t (visual, cart/checkout,
            Lighthouse), get your work reviewed by your pair, and approve every state-changing
            git/deploy step.
          </li>
          <li>
            <strong>Claude &mdash; the executor and advisor, consent-gated.</strong> It implements to
            the standards, runs the machine checks, and <em>proposes</em> each git step &mdash; but it
            never commits, merges, tags, pushes, deploys, or touches credentials on its own.
          </li>
        </ul>
        <Callout>
          The one-line rule: <strong>Claude proposes, you approve.</strong> Its companion:{" "}
          <strong>quality is enforced twice</strong> &mdash; by the machine (lint + the Definition of
          Done) and by a human (your paired PR reviewer).
        </Callout>
        <p>
          Why this exists: the <C>.claude/</C> kit encodes the Codinative standard (structure,
          CSS/HTML/JS rules, accessibility, SEO, performance, git hygiene, QA) as machine-readable
          rules that surface automatically &mdash; so every codebase we touch looks and behaves like
          one team built it.
        </p>
      </Section>

      <Section id="prerequisites" title="2. Prerequisites — a properly set-up theme">
        <p>
          The kit assumes a working Stencil theme dev environment. These are <strong>your</strong>{" "}
          responsibility &mdash; Claude flags what&rsquo;s missing at Day-0 but will not install
          tooling or touch credentials for you.
        </p>
        <Table
          head={["Prerequisite", "Why", "Check"]}
          rows={[
            ["Node at the theme's version", "Everything runs on it", ".nvmrc present → nvm use; matches package.json engines"],
            ["Stencil CLI (theme-compatible)", "preview, bundle, push", "stencil --version; install: npm install -g @bigcommerce/stencil-cli"],
            ["A git repo", "git is the record of every change", "git status works; if not, git init"],
            ["npm install run", "lint/build need node_modules", "node_modules/ exists"],
            ["stencil init run", "creates secrets.stencil.json for stencil start", "file exists, and is gitignored"],
            ["The kit copied in", "the process itself", ".claude/, scripts/, CLAUDE.md, lint configs present"],
          ]}
        />
        <Callout tone="warn">
          <strong>Security, non-negotiable:</strong> <C>secrets.stencil.json</C>, <C>.stencil</C>, and{" "}
          <C>.env</C> are credentials &mdash; never committed, and Claude will never read or write
          them. <C>stencil init</C> is always something <strong>you</strong> run with your own
          Themes-scoped token.
        </Callout>
      </Section>

      <Section id="assumptions" title="3. Assumptions the docs make">
        <ul className="ml-5 list-disc space-y-1">
          <li>
            <strong>A BigCommerce Stencil theme</strong> &mdash; Handlebars templates, SCSS using the
            theme&rsquo;s <C>stencil*</C> helpers, Stencil&rsquo;s page-class JS system.
          </li>
          <li>
            <strong>Fork-and-own</strong> &mdash; edit stock files in place; add new code as
            page-grouped components; no <C>custom/</C> override tree.
          </li>
          <li>
            <strong>Git is the change record</strong> &mdash; one baseline tag per project + focused,
            conventional commits.
          </li>
          <li>
            <strong>Two quality gates</strong> &mdash; the machine (lint + DoD) and a human PR reviewer
            (your pair). There is no unreviewed path to <C>main</C>.
          </li>
          <li>
            <strong>The lint stack is wired</strong> &mdash; Stylelint + ESLint via the kit&rsquo;s
            configs and the <C>npm run</C> scripts.
          </li>
          <li>
            <strong>The theme&rsquo;s existing design system is the source of truth for styling</strong>{" "}
            &mdash; never off-system magic values unless you explicitly decide otherwise.
          </li>
        </ul>
        <p>
          If your project can&rsquo;t meet an assumption, tell Claude &mdash; it adapts and flags the
          gap rather than pretend.
        </p>
      </Section>

      <Section id="day-0" title="4. Day 0 — first-time setup on a project">
        <p>
          Do this once per project, before any feature work.{" "}
          <em>Nobody writes feature code until Day-0 is done.</em>
        </p>
        <Steps>
          <li>
            <strong>Get the kit and copy it in</strong> &mdash; clone the process repo, then copy the
            kit file set into the theme repo.
          </li>
          <li>
            <strong>Open the theme in Claude Code and say:</strong>{" "}
            <em>&ldquo;Run the Day-0 setup.&rdquo;</em>
          </li>
          <li>
            Claude runs <C>npm run day0</C> &mdash; the safe, mechanical wiring: merges the lint npm
            scripts + devDependencies into <C>package.json</C>, stamps the measured <C>!important</C>{" "}
            baseline, fills the theme identity into <C>CLAUDE.md</C>, creates <C>.nvmrc</C>. It then
            reports the steps that are yours.
          </li>
          <li>
            <strong>You run / approve</strong> (Claude proposes; you decide): <C>npm install</C> (you
            run it); tag the baseline (Claude proposes <C>git tag base-theme-v&lt;version&gt;</C>, you
            approve &mdash; must be before any customization); record the branch-flow choice; and{" "}
            <C>stencil init</C> (you run it &mdash; credential).
          </li>
          <li>
            <strong>Fill-ins</strong> Claude completes with you: the layout map in{" "}
            <C>philosophy-and-structure.md</C>, and the <C>!important</C> per-file breakdown + count in{" "}
            <C>important-baseline.md</C>.
          </li>
        </Steps>
        <p>
          When Claude reports <strong>&ldquo;Day-0 complete,&rdquo;</strong> you&rsquo;re ready to
          build.
        </p>
      </Section>

      <Section id="tasks" title="5. Giving Claude a task">
        <p>
          Describe the outcome in plain language &mdash; you don&rsquo;t need to cite rules; they
          surface automatically.
        </p>
        <Callout tone="warn">
          <strong>Always do tasks on a feature branch.</strong> Every task runs on a <C>feat/</C> /{" "}
          <C>fix/</C> / <C>refactor/</C> / <C>chore/</C> branch, created at the start of the task
          (Claude proposes <C>git checkout -b &hellip;</C> before it edits anything). Working directly
          on <C>main</C> is only for the recorded direct-to-main early-build-out exception (&sect;13).
          No branch, no PR.
        </Callout>
        <p className="font-medium text-gray-700 dark:text-gray-200">
          Good task prompts are specific about intent:
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>
            &ldquo;Add a &lsquo;Why choose us&rsquo; section to the home page: three icon+text
            columns, using the theme&rsquo;s card styles, below the hero.&rdquo;
          </li>
          <li>&ldquo;The mobile menu doesn&rsquo;t close when you tap a link &mdash; fix it.&rdquo;</li>
          <li>&ldquo;Match this Figma section on the product page&rdquo; (share the design reference).</li>
        </ul>
        <p className="font-medium text-gray-700 dark:text-gray-200">
          What Claude does automatically:
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>
            <strong>Classifies</strong> &mdash; Type A (modify existing → edit the stock file in
            place) vs Type B (new → page-grouped component), reusing the closest existing page folder.
          </li>
          <li>
            <strong>Asks when genuinely ambiguous</strong> &mdash; which page a component belongs to,
            or brand <em>content</em> vs code <em>identifier</em>.
          </li>
          <li>
            <strong>Applies the standards for every file it touches</strong> &mdash; the matching rule
            surfaces on each edit.
          </li>
          <li>
            <strong>Asks before any state-changing git</strong> &mdash; e.g. creating the feature
            branch.
          </li>
        </ul>
        <p>One task per conversation where practical keeps context lean and the diff focused.</p>
      </Section>

      <Section id="adherence" title="6. Making sure Claude follows the docs">
        <p>
          Adherence is mostly automatic &mdash; <C>CLAUDE.md</C> is always loaded, the rules are
          path-scoped (editing <C>.scss</C> surfaces <C>css.md</C>; <C>.html</C> surfaces{" "}
          <C>html.md</C> + <C>seo.md</C>), and the lint gates are hard.
        </p>
        <Callout>
          <strong>Always run Claude in &ldquo;Edit Automatically&rdquo; mode</strong> (auto-accept
          edits) + the read-only Bash allowlist shipped in <C>.claude/settings.json</C>. File edits
          flow without click-approving each one, while <strong>every git/deploy command still prompts
          you</strong>. Never use full &ldquo;Auto/bypass&rdquo; mode &mdash; it removes the hard stop
          on git (&sect;13).
        </Callout>
        <p>
          If Claude ever seems to skip a standard (e.g. reports &ldquo;done&rdquo; after only applying
          HTML/CSS rules), ask it to{" "}
          <em>&ldquo;walk the full Definition of Done and report each category.&rdquo;</em>
        </p>
      </Section>

      <Section id="dod" title="7. QA — the Definition of Done">
        <p>
          &ldquo;Done&rdquo; is a checklist, not a feeling. At the end of every task Claude walks the
          full DoD in <C>qa.md</C> and reports each category &mdash; passed / failed / needs-your-eyes:
        </p>
        <ol className="ml-5 list-decimal space-y-1">
          <li><strong>Build &amp; lint</strong> &mdash; Stylelint, ESLint, <C>npm run check:important</C>, theme builds.</li>
          <li><strong>Responsive</strong> &mdash; the five viewports (320px → ≥1920px).</li>
          <li><strong>Functional</strong> &mdash; realistic data (long names, empty states, out-of-stock, guest vs logged-in).</li>
          <li><strong>Cart/checkout smoke test</strong> &mdash; mandatory for anything touching header, product, cart, or global code.</li>
          <li><strong>Page Builder</strong> &mdash; uploads cleanly, settings apply, all theme variations.</li>
          <li><strong>SEO</strong> &middot; <strong>Accessibility</strong> &middot; <strong>Performance (Lighthouse)</strong>.</li>
          <li><strong>Commit</strong> &mdash; the terminal step (&sect;9).</li>
        </ol>
        <p className="font-medium text-gray-700 dark:text-gray-200">
          Handling checks Claude can&rsquo;t run (expected, not a failure)
        </p>
        <p>
          Claude cannot see rendered pixels, click through cart/checkout, or run Lighthouse against
          your store. It will say so explicitly and hand those to you:
        </p>
        <Steps>
          <li>Claude implements + runs machine checks + reports the DoD, flagging the human-only items.</li>
          <li>
            <strong>You run them</strong> &mdash; the five viewports, add-to-cart → cart → checkout,
            Lighthouse on the page type.
          </li>
          <li>If something&rsquo;s wrong, tell Claude → it fixes → you re-verify.</li>
          <li>When the human checks pass, the task is verifiable-done and ready to commit.</li>
        </Steps>
        <Callout tone="warn">
          <strong>Never accept a blanket &ldquo;done.&rdquo;</strong> A proper report tells you exactly
          what Claude verified and what it&rsquo;s handing to you.
        </Callout>
      </Section>

      <Section id="complete" title="8. Marking a task complete">
        <p>
          A task ends verified and committed to the feature branch &mdash; and the commit is gated:
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>The commit happens only after every DoD category has passed, including the human checks.</li>
          <li>
            Claude <strong>proposes</strong> the commit (conventional message, explicit{" "}
            <C>git add &lt;files&gt;</C>, focused diff); you approve. You may commit now, or defer to
            batch several finished tasks into one commit.
          </li>
          <li>
            A task never touches <C>CHANGELOG.md</C>, the <C>config.json</C> version, tags, or{" "}
            <C>main</C> &mdash; those are release-time (&sect;11).
          </li>
        </ul>
      </Section>

      <Section id="review" title="9. Code review via pull request (pair review)">
        <p>
          <strong>Every feature reaches <C>main</C> through a GitHub pull request reviewed by your
          paired teammate &mdash; never a direct merge.</strong> The second set of eyes on the diff,
          against the standards, is how we keep quality and rule-adherence honest.
        </p>
        <Steps>
          <li>Get the feature to a verified, committed state on its branch (&sect;8).</li>
          <li>Push the branch to the remote (Claude proposes <C>git push</C>; you consent).</li>
          <li>
            Open a PR into <C>main</C> &mdash; Claude can run <C>gh pr create</C> on your consent, or
            open it in the GitHub UI.
          </li>
          <li>
            Your paired reviewer reviews the diff &mdash; structure (Type A/B), the DoD, the standards
            &mdash; and requests changes or approves. Address feedback on the branch; re-request review.
          </li>
          <li>
            On approval, merge via the PR. <strong>Never</strong> bypass it with a local{" "}
            <C>git merge</C> into <C>main</C>.
          </li>
          <li>Delete or keep the branch (Claude asks; &sect;12).</li>
        </Steps>
        <Callout tone="warn">
          <strong>PR flow tutorial:</strong> <C>&lt;https://www.youtube.com/watch?v=GubUV_nLdY8&gt;</C> &mdash; our
          exact PR + pair-review process (opening the PR, assigning the reviewer, the checklist,
          merge/squash settings, branch cleanup). Placeholder &mdash; fill this in.
        </Callout>
      </Section>

      <Section id="release" title="10. Creating a release (developer-driven, from main)">
        <p>A release is not per-task &mdash; it bundles everything since the last release. Rules:</p>
        <ul className="ml-5 list-disc space-y-1">
          <li>
            Releases are cut from <C>main</C> &mdash; from the state where the reviewed PRs have
            already merged.
          </li>
          <li>
            Never release from a feature branch unless it is explicitly required and a senior has
            approved it first (&sect;12, Hard rules). A rare, deliberate exception, not a shortcut.
          </li>
        </ul>
        <p>
          When ready, tell Claude <em>&ldquo;Let&rsquo;s cut a release.&rdquo;</em> It walks this in
          order, proposing each step and running it only on your consent:
        </p>
        <Steps>
          <li>Confirm the reviewed features are merged into <C>main</C> (via their PRs &mdash; &sect;9).</li>
          <li>
            <strong>Bump <C>config.json</C></strong> &mdash; <C>version</C> (semver) and <C>name</C>{" "}
            (<C>[project]-v[version]-[date]</C>).
          </li>
          <li>One combined <C>CHANGELOG.md</C> entry covering all changes since the last release.</li>
          <li>Commit the release prep.</li>
          <li>Tag and push.</li>
          <li>
            <C>stencil bundle</C> → verify → <C>stencil push</C> (or the deploy pipeline).
          </li>
          <li>Branch cleanup (delete/keep, per branch).</li>
        </Steps>
        <p>
          Every version then maps to an exact commit; rollback = re-push the previous tag&rsquo;s
          bundle.
        </p>
      </Section>

      <Section id="git" title="11. Git & consent — quick reference">
        <ul className="ml-5 list-disc space-y-1">
          <li>
            <strong>Read-only is free</strong> (<C>git status/diff/log/show</C>, listing
            branches/tags). Everything state-changing is gated &mdash; branch, add, commit, push, tag,
            and any deploy. Consent is per command.
          </li>
          <li>Feature branches are the default; they reach <C>main</C> only via a reviewed PR (&sect;9).</li>
          <li>A feature branch may be pushed to the remote with your consent (multi-day work, PRs, backup).</li>
          <li>The baseline tag is sacred &mdash; one per project, tagged at Day 0, never rewritten.</li>
        </ul>
      </Section>

      <Section id="hard-rules" title="12. Hard rules — NEVER do these">
        <p>
          These are non-negotiable. Breaking any one undermines the standard the whole kit exists to
          enforce.
        </p>
        <Callout tone="warn">
          <ul className="ml-5 list-disc space-y-1.5">
            <li>
              <strong>NEVER cut a release from a feature branch</strong> unless explicitly required and
              a senior has approved it first. Releases are cut from <C>main</C>.
            </li>
            <li>
              <strong>NEVER merge a feature branch directly into <C>main</C>.</strong> Every change
              reaches <C>main</C> through a pull request reviewed by your pair (&sect;9).
            </li>
            <li>
              <strong>NEVER change the process yourself.</strong> Don&rsquo;t edit the <C>.claude/</C>{" "}
              rules, <C>CLAUDE.md</C>, the scripts, or the lint configs in a project. Found a gap? Post
              it in Discord <C>#suggestion-hub</C> &mdash; the process is improved in one place (the kit
              repo, via PR) and copied everywhere.
            </li>
            <li>
              <strong>ALWAYS run Claude in &ldquo;Edit Automatically&rdquo; mode</strong> + the
              read-only allowlist. Never full &ldquo;Auto/bypass&rdquo; (it drops the git safety gate).
            </li>
            <li>
              <strong>NEVER accept &ldquo;done&rdquo; on unverified work</strong> &mdash; no commit
              while any DoD category is pending or failing.
            </li>
            <li>
              <strong>NEVER put <C>CHANGELOG.md</C>, a <C>config.json</C> version bump, a tag, or a
              merge into a per-task commit</strong> &mdash; those are release-time only.
            </li>
            <li>
              <strong>NEVER skip or rewrite the baseline tag</strong>, and never bypass it
              (<C>git add .</C>, force-push, history rewrites).
            </li>
            <li>
              <strong>NEVER hardcode off-design-system values</strong> (raw hex/px that duplicate a
              theme token) &mdash; extend the theme&rsquo;s design system instead.
            </li>
            <li>
              <strong>NEVER commit or expose credentials</strong> (<C>secrets.stencil.json</C>,{" "}
              <C>.stencil</C>, <C>.env</C>) or let Claude read/write them.
            </li>
            <li>
              <strong>NEVER install a base-theme or marketplace vendor update over a customized
              theme</strong> &mdash; that&rsquo;s a scoped re-implementation project, not a merge.
            </li>
            <li>
              <strong>NEVER add a new <C>!important</C></strong> beyond the grandfathered baseline, and
              never strip a load-bearing one just to lower the count.
            </li>
          </ul>
        </Callout>
      </Section>

      <Section id="habits" title="13. Do these (the positive habits)">
        <ul className="ml-5 list-disc space-y-1">
          <li>Give clear, single-intent tasks; share design references for parity work.</li>
          <li>Read the DoD report and run the human-only checks before pushing for review.</li>
          <li>Review your pair&rsquo;s PRs as carefully as you&rsquo;d want yours reviewed.</li>
          <li>Keep the baseline tag, and let Claude drive the <C>!important</C> count down over time.</li>
          <li>
            Raise anything that doesn&rsquo;t fit in <C>#suggestion-hub</C> &mdash; improve the standard
            for everyone.
          </li>
        </ul>
      </Section>

      <Section id="process-updates" title="14. Updating the process">
        <p>
          Improvements land in the kit repo (never in a project &mdash; &sect;12). To pull them into a
          project: <C>git pull</C> your local clone of the kit, then re-copy only the generic files
          that changed (most of <C>rules/</C>, <C>docs/tooling.md</C>, <C>scripts/</C>).{" "}
          <strong>Do not</strong> blindly re-copy everything &mdash; you&rsquo;d clobber per-project
          fill-ins (<C>CLAUDE.md</C> identity, <C>important-baseline.md</C> counts).
        </p>
      </Section>

      <Section id="troubleshooting" title="15. Troubleshooting">
        <Table
          head={["Symptom", "Cause / fix"]}
          rows={[
            ["stylelint-changed: baseline ref 'base-theme-v…' not found", "The baseline tag doesn't exist yet — tag it (Day 0), or set STYLELINT_BASE=<ref> for a one-off."],
            ["check:important FAILED — found N, baseline is M", "A new !important was introduced. Remove it (see css.md); only the grandfathered baseline is allowed."],
            ["Lint floods with indentation noise on stock files", "Expected — the scripts lint only new files vs the baseline; your editor's extension flags in-place edits live."],
            ["Claude reports “done” but only listed lint", "Ask it to walk the full Definition of Done and report every category."],
            ["Claude tried to stencil init / read a secret", "It shouldn't — that's a hard rule. Decline and run credentials yourself."],
            ["Can't clone the kit repo", "It's private — clone over your authenticated GitHub access (SSH or gh); see the README."],
          ]}
        />
        <Callout>
          Questions, or a rule that doesn&rsquo;t fit your project? Do not fix it locally &mdash; raise
          it in Discord <C>#suggestion-hub</C> and open a PR on the kit repo. The process is a living
          standard, improved in one place and copied everywhere.
        </Callout>
      </Section>
    </DocLayout>
  );
}

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-50 text-left dark:bg-gray-900/40">
            {head.map((h, j) => (
              <th
                key={h}
                className={`border-b border-gray-200 px-4 py-2.5 font-semibold text-gray-700 dark:border-gray-800 dark:text-gray-200 ${
                  j > 0 ? "border-l" : ""
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="align-top text-gray-600 dark:text-gray-300">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`border-gray-200 px-4 py-2.5 dark:border-gray-800 ${
                    i > 0 ? "border-t" : ""
                  } ${j > 0 ? "border-l" : ""}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
