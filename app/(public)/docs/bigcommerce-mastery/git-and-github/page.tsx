import type { Metadata } from "next";
import {
  DocLayout,
  Section,
  Code,
  C,
  Callout,
  Steps,
  DocLink,
  type TocItem,
} from "@/components/public/doc";
import { Diagram, Flow, FlowStep } from "@/components/public/diagram";

export const metadata: Metadata = {
  title: "Git & GitHub - BigCommerce Onboarding - Codinative Developers",
};

const TOC: TocItem[] = [
  { id: "what", title: "Git & GitHub" },
  { id: "setup", title: "One-time setup" },
  { id: "flow", title: "The everyday flow" },
  { id: "branches", title: "Branches & merging" },
  { id: "conflicts", title: "Resolving conflicts" },
  { id: "stash-rebase", title: "Stashing & rebasing" },
  { id: "at-codinative", title: "How we use it here" },
  { id: "references", title: "Learn Git & GitHub" },
];

export default function GitAndGitHub() {
  return (
    <DocLayout
      title="Git & GitHub"
      intro="Every piece of code at Codinative lives in Git and is shared through GitHub. You don't need to be an expert - just comfortable enough to work day to day. This is the practical minimum to get there."
      toc={TOC}
    >
      <Section id="what" title="What they are">
        <p>
          <strong>Git</strong> is a version-control system: it records snapshots of your
          project over time so you can review history, undo mistakes, and work on features
          in isolation. <strong>GitHub</strong> hosts Git repositories online and adds
          collaboration on top - pull requests, code review, and issues. In short: Git is
          the tool on your machine; GitHub is where the team&rsquo;s code lives and gets
          reviewed.
        </p>
      </Section>

      <Section id="setup" title="One-time setup">
        <p>Install Git, then tell it who you are (this stamps your commits):</p>
        <Code>{`git --version                       # check it's installed
git config --global user.name  "Your Name"
git config --global user.email "you@codinative.com"`}</Code>
        <p>
          Get a repo onto your machine by <strong>cloning</strong> it from GitHub:
        </p>
        <Code>{`git clone https://github.com/Codinative/<repo>.git`}</Code>
      </Section>

      <Section id="flow" title="The everyday flow">
        <p>
          Ninety percent of Git is one loop: edit files, <strong>stage</strong> what you
          want to keep, <strong>commit</strong> it as a snapshot, and <strong>push</strong>{" "}
          it to GitHub. Changes move through four places:
        </p>

        <Diagram caption="How a change travels from your editor to GitHub">
          <Flow>
            <FlowStep title="Working directory" desc="your edited files" />
            <FlowStep title="Staging area" desc="git add" tone="accent" />
            <FlowStep title="Local repo" desc="git commit" />
            <FlowStep title="GitHub" desc="git push" />
          </Flow>
        </Diagram>

        <Code>{`git status                    # what has changed?
git add index.html            # stage one file
git add .                     # stage everything changed
git commit -m "Fix header spacing on mobile"
git push                      # send your commits to GitHub
git pull                      # get teammates' commits`}</Code>

        <Callout>
          <strong>Commit small and often, with clear messages.</strong> A commit should be
          one logical change; the message should say what it does (e.g.{" "}
          <C>Add sticky add-to-cart to product page</C>), not &ldquo;update&rdquo;.
        </Callout>
      </Section>

      <Section id="branches" title="Branches & merging">
        <p>
          A <strong>branch</strong> is an isolated line of work. You never build directly on{" "}
          <C>main</C> - you branch off, do your work, then merge it back once it&rsquo;s
          reviewed. This keeps <C>main</C> stable and lets several people work at once.
        </p>
        <Code>{`git switch -c feat/sticky-atc     # create + switch to a new branch
# ...edit, add, commit as usual...
git push -u origin feat/sticky-atc  # publish the branch to GitHub

git switch main                   # switch back to main
git merge feat/sticky-atc         # merge the branch into main (locally)`}</Code>
        <p>
          In practice you rarely merge locally. Instead you push the branch and open a{" "}
          <strong>Pull Request (PR)</strong> on GitHub - a place for teammates to review the
          change and discuss it before it&rsquo;s merged into <C>main</C>.
        </p>
        <Callout>
          Name branches by intent: <C>feat/…</C> for features, <C>fix/…</C> for bug fixes,{" "}
          <C>chore/…</C> for maintenance.
        </Callout>
      </Section>

      <Section id="conflicts" title="Resolving conflicts">
        <p>
          A <strong>merge conflict</strong> happens when two branches change the same lines
          and Git can&rsquo;t decide which to keep. It pauses and marks the spot in the file:
        </p>
        <Code>{`<<<<<<< HEAD
color: red;        // the change already on your branch
=======
color: blue;       // the incoming change
>>>>>>> feat/new-theme`}</Code>
        <Steps>
          <li>Open each marked file and edit it to the correct final result.</li>
          <li>
            Delete the <C>{"<<<<<<<"}</C>, <C>=======</C>, and <C>{">>>>>>>"}</C> marker
            lines.
          </li>
          <li>
            Stage the resolved files and finish: <C>git add .</C> then <C>git commit</C>{" "}
            (or <C>git merge --continue</C> / <C>git rebase --continue</C>).
          </li>
        </Steps>
        <Callout>
          Most editors (VS Code) show conflicts with &ldquo;Accept Current / Incoming /
          Both&rdquo; buttons - use those rather than editing markers by hand.
        </Callout>
      </Section>

      <Section id="stash-rebase" title="Stashing & rebasing">
        <p>
          <strong>Stash</strong> shelves your uncommitted changes so you can switch tasks
          with a clean working directory, then bring them back later:
        </p>
        <Code>{`git stash            # shelve your current changes
git switch main      # do something else
git stash pop        # reapply the shelved changes`}</Code>
        <p>
          <strong>Rebase</strong> replays your branch&rsquo;s commits on top of the latest{" "}
          <C>main</C>, giving a clean, linear history. It&rsquo;s the tidy way to update a
          feature branch:
        </p>
        <Code>{`git switch feat/sticky-atc
git pull --rebase origin main    # replay your work on top of the latest main`}</Code>
        <Callout tone="warn">
          Only rebase branches that are <strong>yours and not yet shared</strong>. Never
          rebase or force-push a branch other people are working on, and don&rsquo;t rewrite{" "}
          <C>main</C> - on shared branches, prefer a normal <C>merge</C>.
        </Callout>
      </Section>

      <Section id="at-codinative" title="How we use it here">
        <Callout tone="warn">
          <strong>TODO (Codinative):</strong> document our workflow - branch naming, who
          reviews PRs, the merge strategy (squash / merge / rebase), and any protected
          branches - so new devs match the team&rsquo;s conventions.
        </Callout>
      </Section>

      <Section id="references" title="Learn Git & GitHub">
        <p>
          Pick the hands-on course to build the habit, and keep the reference docs handy;
          you&rsquo;ll learn the rest by doing.
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <DocLink href="https://skills.github.com/">GitHub Skills</DocLink> -
            GitHub&rsquo;s own interactive, hands-on courses on Git, GitHub, and pull
            requests.
          </li>
          <li>
            <DocLink href="https://docs.github.com/en/get-started">
              GitHub Docs - Get started
            </DocLink>{" "}
            - the official guide to Git basics and working on GitHub.
          </li>
          <li>
            <DocLink href="https://git-scm.com/book/en/v2">Pro Git book</DocLink> - the
            free, official Git book; the definitive reference.
          </li>
        </ul>
      </Section>
    </DocLayout>
  );
}
