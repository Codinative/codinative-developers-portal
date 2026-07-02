import type { Metadata } from "next";
import { DocLayout, Section, C, Callout, Steps, type TocItem } from "@/components/public/doc";

export const metadata: Metadata = {
  title: "Web accessibility and compliance - Codinative Developers",
};

const TOC: TocItem[] = [
  { id: "what", title: "What it is" },
  { id: "who", title: "Who it helps" },
  { id: "wcag", title: "WCAG (the standard)" },
  { id: "pour", title: "The 4 principles (POUR)" },
  { id: "levels", title: "Levels: A, AA, AAA" },
  { id: "laws", title: "The laws" },
  { id: "notices", title: "Who gets notices" },
  { id: "ignore", title: "If you ignore it" },
  { id: "barriers", title: "Common barriers" },
  { id: "overlays", title: "The overlay myth" },
  { id: "fix", title: "How to fix a site" },
  { id: "tools", title: "Tools" },
  { id: "stay", title: "Staying compliant" },
  { id: "ecom", title: "E-commerce / BigCommerce" },
  { id: "glossary", title: "Glossary" },
  { id: "faq", title: "FAQ" },
  { id: "resources", title: "Sources" },
];

export default function AccessibilityDocs() {
  return (
    <DocLayout
      title="Web accessibility and compliance"
      intro="A plain-language guide to what web accessibility is, the WCAG standard, the laws behind ADA demand letters, and how a site is actually brought into compliance."
      toc={TOC}
    >
      <Callout>
        <strong>The 30-second version.</strong> Websites must be usable by people with disabilities -
        blind users on screen readers, people who cannot use a mouse, and others. The international
        rulebook is <strong>WCAG</strong>. In the U.S., the <strong>ADA</strong> (a civil-rights law)
        is used to sue businesses whose sites do not meet it. Thousands of businesses get{" "}
        <strong>legal demand letters</strong> every year, often triggered by an automated scan. The
        real fix is <strong>changing the website&rsquo;s code</strong> - not installing a
        &ldquo;quick-fix&rdquo; widget, which does not work and can make you a bigger target.
      </Callout>

      <Section id="what" title="What is web accessibility?">
        <p>
          Web accessibility means building a site so that{" "}
          <strong>people with disabilities can perceive, understand, navigate, and use it</strong> -
          with the same success as everyone else.
        </p>
        <p>
          Think of it like a wheelchair ramp for a building. A physical store adds ramps, wide doors,
          and braille signage so everyone can shop. A website needs the digital equivalent: text a
          screen reader can read aloud, menus you can operate with a keyboard, captions on videos, and
          colors with enough contrast to read.
        </p>
        <p>
          When those things are missing, real people get locked out. A blind customer literally cannot
          complete a purchase if the &ldquo;Add to Cart&rdquo; error is not read aloud. That is the
          digital version of a locked front door, which is exactly why the law gets involved.
        </p>
      </Section>

      <Section id="who" title="Who does it help?">
        <p>
          Accessibility is not a niche concern. Roughly <strong>1 in 4 adults</strong> in the U.S.
          lives with some disability, and it covers far more than blindness:
        </p>
        <Table>
          <thead>
            <tr>
              <Th>Type</Th>
              <Th>Examples</Th>
              <Th>What the site must do</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>Visual</Td>
              <Td>Blindness, low vision, color blindness</Td>
              <Td>Work with screen readers, have alt text, strong contrast, resizable text</Td>
            </tr>
            <tr>
              <Td>Motor / physical</Td>
              <Td>Cannot use a mouse, tremors, paralysis</Td>
              <Td>Be fully operable by keyboard; large, clear clickable areas</Td>
            </tr>
            <tr>
              <Td>Auditory</Td>
              <Td>Deaf or hard of hearing</Td>
              <Td>Captions and transcripts for audio/video</Td>
            </tr>
            <tr>
              <Td>Cognitive</Td>
              <Td>Dyslexia, ADHD, memory, learning</Td>
              <Td>Clear language, consistent layout, helpful error messages</Td>
            </tr>
          </tbody>
        </Table>
        <Callout>
          <strong>Bonus: it helps everyone.</strong> Captions help in noisy places. Good contrast
          helps in bright sunlight. Keyboard support helps power users. Clear structure helps Google
          rank you. Accessibility overlaps heavily with good <strong>SEO</strong> and{" "}
          <strong>usability</strong>, so the work pays off beyond compliance.
        </Callout>
      </Section>

      <Section id="wcag" title="What is WCAG?">
        <p>
          <strong>WCAG</strong> stands for <strong>Web Content Accessibility Guidelines</strong> - the
          globally accepted technical rulebook, published by the <strong>W3C</strong> through its Web
          Accessibility Initiative (WAI). It is a long checklist of testable &ldquo;success
          criteria&rdquo; (for example, <em>every image that conveys meaning must have a text
          alternative</em>). Laws and courts point to WCAG as the definition of an accessible site,
          even when the law itself does not spell out the details.
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <strong>WCAG 2.0</strong> (2008) - the original, still referenced by some laws.
          </li>
          <li>
            <strong>WCAG 2.1</strong> (2018) - adds mobile, low-vision, and cognitive criteria.{" "}
            <strong>This is today&rsquo;s practical legal target.</strong>
          </li>
          <li>
            <strong>WCAG 2.2</strong> (2023) - the current version; adds a few more criteria. Smart to
            aim for, as it is where the standard is heading.
          </li>
          <li>
            <strong>WCAG 3.0</strong> - an early draft, years from being a requirement. Do not worry
            about it yet.
          </li>
        </ul>
      </Section>

      <Section id="pour" title="The four principles: POUR">
        <p>
          All of WCAG is organized under four ideas. If you remember nothing else, remember{" "}
          <strong>POUR</strong>:
        </p>
        <Table>
          <thead>
            <tr>
              <Th>Principle</Th>
              <Th>Means</Th>
              <Th>Example failure</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>Perceivable</Td>
              <Td>Users can sense the content (see or hear it)</Td>
              <Td>An image with no alt text - a blind user perceives nothing</Td>
            </tr>
            <tr>
              <Td>Operable</Td>
              <Td>Users can operate the controls</Td>
              <Td>A menu that only opens on mouse hover - a keyboard user is stuck</Td>
            </tr>
            <tr>
              <Td>Understandable</Td>
              <Td>Content and behavior are clear</Td>
              <Td>An error appears but does not explain what went wrong</Td>
            </tr>
            <tr>
              <Td>Robust</Td>
              <Td>Works with assistive tech now and later</Td>
              <Td>Custom buttons a screen reader cannot tell are buttons</Td>
            </tr>
          </tbody>
        </Table>
      </Section>

      <Section id="levels" title="Conformance levels: A, AA, AAA">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <strong>A - Minimum.</strong> The most basic must-haves. Failing these is severe.
          </li>
          <li>
            <strong>AA - The target.</strong> What laws, courts, and settlements almost always
            require. <strong>&ldquo;WCAG 2.1 AA&rdquo; is the phrase you will see everywhere.</strong>
          </li>
          <li>
            <strong>AAA - Highest.</strong> Gold standard; not expected for an entire site and rarely
            legally required.
          </li>
        </ul>
        <Callout>
          <strong>The number to remember.</strong> When someone says &ldquo;make the site
          compliant,&rdquo; they almost always mean <strong>WCAG 2.1 Level AA</strong> - which
          includes all Level A criteria plus all Level AA criteria.
        </Callout>
      </Section>

      <Section id="laws" title="The laws behind the legal notices">
        <p>
          WCAG is a technical standard, not a law. The legal force comes from disability civil-rights
          laws that <em>point to</em> WCAG. Which one applies depends on where you and your customers
          are.
        </p>
        <Table>
          <thead>
            <tr>
              <Th>Law</Th>
              <Th>Where</Th>
              <Th>Applies to</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>ADA (Americans with Disabilities Act)</Td>
              <Td>USA</Td>
              <Td>
                The big one for private business. Courts treat the sites of businesses open to the
                public as covered &ldquo;places of public accommodation.&rdquo;
              </Td>
            </tr>
            <tr>
              <Td>Section 508</Td>
              <Td>USA (federal)</Td>
              <Td>U.S. government agencies and many of their vendors.</Td>
            </tr>
            <tr>
              <Td>State laws (e.g. Unruh Act, CA)</Td>
              <Td>USA (state)</Td>
              <Td>Often added on top of ADA - California and New York are hotspots.</Td>
            </tr>
            <tr>
              <Td>AODA</Td>
              <Td>Ontario, Canada</Td>
              <Td>Provincial accessibility requirements.</Td>
            </tr>
            <tr>
              <Td>European Accessibility Act</Td>
              <Td>EU</Td>
              <Td>Enforced from June 2025; covers e-commerce selling into the EU.</Td>
            </tr>
            <tr>
              <Td>Equality Act 2010</Td>
              <Td>UK</Td>
              <Td>Requires reasonable adjustments for disabled users.</Td>
            </tr>
          </tbody>
        </Table>
        <Callout tone="warn">
          <strong>Why the ADA hits online stores.</strong> The ADA (1990) predates the web, so it
          never mentions websites. But U.S. courts have repeatedly ruled that a retailer&rsquo;s site
          is an extension of its &ldquo;public accommodation,&rdquo; and in 2022 the Department of
          Justice reaffirmed that the ADA applies to the web. Because the ADA lists no technical spec,
          courts fill the gap with <strong>WCAG 2.1 AA</strong>. That combination - broad law plus
          specific standard - is what plaintiffs use.
        </Callout>
      </Section>

      <Section id="notices" title="Who gets legal notices - and why">
        <p>
          This surprises most first-timers. You usually do not get sued because a specific customer
          complained. A whole legal ecosystem actively looks for non-compliant sites.
        </p>
        <Steps>
          <li>
            <strong>Automated scanning.</strong> Law firms and plaintiffs run free or commercial
            scanners (AudioEye is one example) across thousands of sites to flag accessibility errors
            - missing alt text, unlabeled buttons, keyboard traps.
          </li>
          <li>
            <strong>A demand letter arrives.</strong> A formal legal notice (often before any lawsuit)
            alleging the site violates the ADA, listing example barriers, and asking you to fix them
            and frequently to pay a settlement.
          </li>
          <li>
            <strong>&ldquo;Illustrative and not exhaustive.&rdquo;</strong> The letter lists a few
            barriers but says there are more - so fixing only the named ones is not enough; the whole
            site must be brought into conformance.
          </li>
          <li>
            <strong>Deadline / settlement pressure.</strong> These are usually settled rather than
            litigated, because fighting costs more than fixing.
          </li>
        </Steps>
        <Callout>
          <strong>Who the targets are.</strong> Mostly e-commerce and consumer-facing businesses of
          every size - not just big brands. Smaller stores are common targets precisely because they
          are less likely to have remediated and more likely to settle quickly. Industry trackers
          report 4,000-5,000+ such claims in the U.S. every year, concentrated in New York,
          California, and Florida courts.
        </Callout>
        <p>
          It is rarely personal. If your site has machine-detectable barriers and sells to the public,
          it can show up in a scan. Keyboard-inaccessible menus, duplicate image alt text, and
          unannounced form errors are classic, easily-scanned patterns that appear on a large share of
          stores.
        </p>
      </Section>

      <Section id="ignore" title="What happens if you ignore it">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <strong>It escalates.</strong> A demand letter can become a filed lawsuit.
          </li>
          <li>
            <strong>Settlements plus legal fees.</strong> Even &ldquo;small&rdquo; cases commonly
            settle in the thousands to tens of thousands of dollars, plus your own legal costs.
          </li>
          <li>
            <strong>You still have to fix it.</strong> Settlements almost always require the
            remediation anyway - so ignoring it means paying <em>and</em> fixing.
          </li>
          <li>
            <strong>Repeat exposure.</strong> If the site stays non-compliant, a different plaintiff
            can target it again.
          </li>
        </ul>
        <Callout tone="warn">
          <strong>The trap to avoid.</strong> Do not panic-install an &ldquo;accessibility
          widget&rdquo; and assume you are covered. As the next section explains, that often makes
          things worse legally. The reliable response is: get proper legal counsel for the letter, and
          fix the actual code.
        </Callout>
      </Section>

      <Section id="barriers" title="Common accessibility barriers">
        <p>Here are the issues that show up most often, mapped to the WCAG principle they break.</p>
        <Table>
          <thead>
            <tr>
              <Th>Barrier</Th>
              <Th>Principle</Th>
              <Th>The fix (in code)</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>Menus that need a mouse</Td>
              <Td>Operable</Td>
              <Td>Make dropdowns work with Enter/Space/Escape/arrow keys, with a visible focus outline</Td>
            </tr>
            <tr>
              <Td>Images with no / duplicate alt text</Td>
              <Td>Perceivable</Td>
              <Td>Give each meaningful image unique, descriptive alt text; mark decorative ones to be ignored</Td>
            </tr>
            <tr>
              <Td>Errors not announced</Td>
              <Td>Understandable / Robust</Td>
              <Td>
                Use ARIA live regions / <C>{`role="alert"`}</C> so screen readers speak the message
              </Td>
            </tr>
            <tr>
              <Td>Icon buttons with no label</Td>
              <Td>Robust</Td>
              <Td>
                Add an accessible name via visible text or <C>aria-label</C>
              </Td>
            </tr>
            <tr>
              <Td>Form fields with no label</Td>
              <Td>Understandable</Td>
              <Td>
                Connect each input to a <C>{`<label>`}</C> so its purpose is announced
              </Td>
            </tr>
            <tr>
              <Td>Low color contrast</Td>
              <Td>Perceivable</Td>
              <Td>Ensure text/background contrast meets 4.5:1 (3:1 for large text)</Td>
            </tr>
            <tr>
              <Td>Icon-only / empty links</Td>
              <Td>Operable</Td>
              <Td>Give links descriptive text a screen reader can read</Td>
            </tr>
          </tbody>
        </Table>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          A single automated scan on a typical store routinely flags dozens of these - unnamed SVG
          icons, unlabeled buttons and fields, vague buttons, empty links - on top of the few barriers
          a demand letter names by hand.
        </p>
      </Section>

      <Section id="overlays" title="The overlay-widget myth">
        <p>
          You will be tempted by cheap plug-ins (accessiBe, UserWay, AudioEye, EqualWeb) that promise
          instant compliance with one line of JavaScript.{" "}
          <strong>They do not make you compliant, and they can increase your legal risk.</strong>
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <strong>They do not fix the code.</strong> An overlay layers scripts on top of the page.
            Screen readers and keyboards read the underlying source code, which the overlay does not
            change. The real barriers remain.
          </li>
          <li>
            <strong>Regulators have cracked down.</strong> In 2025 the U.S. FTC ordered accessiBe to
            pay $1,000,000 for deceptive advertising that its widget made sites WCAG-compliant.
          </li>
          <li>
            <strong>They attract lawsuits.</strong> In 2025 roughly one in four businesses sued over
            accessibility already had an overlay installed. Courts have not accepted &ldquo;we
            installed a widget&rdquo; as a defense.
          </li>
        </ul>
        <Callout>
          <strong>What an overlay can legitimately do.</strong> Provide optional display preferences -
          let a visitor enlarge text, switch to high-contrast, or change fonts. That is a nice
          convenience, but it is not what brings a site into conformance. The page&rsquo;s own
          structure, alt text, keyboard support, and contrast still have to be correct in the code.
        </Callout>
      </Section>

      <Section id="fix" title="How to actually fix a site">
        <p>Real remediation is a process, not a button. A defensible program has three phases:</p>
        <Table>
          <thead>
            <tr>
              <Th>Phase</Th>
              <Th>What happens</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>1 &middot; Audit</Td>
              <Td>
                Run automated scanners <em>and</em> do manual testing (keyboard-only plus screen
                reader) on every page type to produce a confirmed, prioritized list of real issues.
              </Td>
            </tr>
            <tr>
              <Td>2 &middot; Remediate</Td>
              <Td>
                Fix the issues in the theme&rsquo;s HTML/CSS/JavaScript: keyboard support, alt text,
                ARIA, labels, contrast. Priority paths (navigation, product pages, checkout) first.
              </Td>
            </tr>
            <tr>
              <Td>3 &middot; Validate</Td>
              <Td>
                Re-test with real assistive technology (NVDA, VoiceOver, keyboard), check for
                regressions, and write a short conformance report for your records and counsel.
              </Td>
            </tr>
          </tbody>
        </Table>
        <Callout tone="warn">
          <strong>Automated scans are not the whole story.</strong> Automated tools reliably catch
          only about 30-40% of WCAG issues. The keyboard-and-screen-reader manual pass is what proves
          the site works - and what holds up if challenged. Beware anyone promising &ldquo;100%
          compliant&rdquo; from a scan alone.
        </Callout>
      </Section>

      <Section id="tools" title="Tools you will hear about">
        <p className="font-medium text-gray-700 dark:text-gray-200">Automated testers (find issues fast)</p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <strong>axe DevTools</strong> (Deque) - browser extension, industry standard.
          </li>
          <li>
            <strong>WAVE</strong> (WebAIM) - visual, beginner-friendly browser extension.
          </li>
          <li>
            <strong>Lighthouse</strong> - built into Chrome DevTools; gives an accessibility score.
          </li>
          <li>
            <strong>Pa11y</strong> - command-line tool you can run in a build pipeline.
          </li>
          <li>
            <strong>WebAIM Contrast Checker</strong> - paste two colors to test the 4.5:1 ratio.
          </li>
        </ul>
        <p className="font-medium text-gray-700 dark:text-gray-200">Screen readers (test like a real user)</p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <strong>NVDA</strong> - free, Windows. The most common testing screen reader.
          </li>
          <li>
            <strong>VoiceOver</strong> - built into macOS and iPhone/iPad (free).
          </li>
          <li>
            <strong>JAWS</strong> - Windows, paid; widely used by blind professionals.
          </li>
          <li>
            <strong>TalkBack</strong> - built into Android.
          </li>
        </ul>
        <Callout>
          <strong>Try it yourself in 2 minutes.</strong> Open the site and, without touching the
          mouse, press <C>Tab</C> repeatedly. Can you reach and open every menu, and always{" "}
          <em>see</em> where you are? Then turn on VoiceOver (Mac: <C>Cmd+F5</C>) and try to add a
          product to the cart. You will feel the barriers immediately.
        </Callout>
      </Section>

      <Section id="stay" title="How to stay compliant after the fix">
        <p>
          Conformance is a snapshot in time - it drifts as you add products and change code. Keep it
          with a light maintenance layer:
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <strong>Periodic audits:</strong> automated scan monthly/quarterly; a manual plus
            screen-reader audit annually or after any major redesign.
          </li>
          <li>
            <strong>Catch regressions in the build:</strong> add an automated check (axe-core /
            pa11y-ci) so a change that breaks accessibility fails before it ships.
          </li>
          <li>
            <strong>New-product checklist:</strong> unique alt text on every image, proper heading
            order, descriptive link text, labeled options, sufficient contrast on banner text.
          </li>
          <li>
            <strong>Publish an Accessibility Statement</strong> page with a contact method - viewed
            favorably and gives users a path other than a lawsuit.
          </li>
          <li>
            <strong>Vet third-party apps</strong> before installing; many re-introduce barriers.
          </li>
          <li>
            <strong>Train whoever adds content</strong> with a one-page guideline.
          </li>
        </ul>
      </Section>

      <Section id="ecom" title="Notes for e-commerce and BigCommerce">
        <p>
          Online stores are the most-targeted category because the checkout funnel is where exclusion
          costs a sale. A few platform-specific realities:
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <strong>The theme is where most fixes live.</strong> On BigCommerce (Stencil),
            accessibility lives in the theme&rsquo;s Handlebars templates, SCSS, and JavaScript - not
            in a setting you can toggle. There is no &ldquo;make me compliant&rdquo; switch.
          </li>
          <li>
            <strong>Alt text is partly content work.</strong> Product image alt text is usually
            entered per-image in the store admin, so fixing it is part code (templates) and part
            content (writing good descriptions).
          </li>
          <li>
            <strong>Checkout matters most.</strong> Navigation, product pages, cart, and checkout are
            the priority paths - a barrier there blocks revenue and is what plaintiffs test first.
          </li>
        </ul>
        <Callout>
          <strong>How Codinative handles an active demand.</strong> We pair this guide with a
          store-specific <strong>audit</strong>, a <strong>remediation proposal</strong> (concrete
          scope and timeline), and a plain-language <strong>Q&amp;A</strong> for the client - turning
          the general picture above into a fix plan for one storefront.
        </Callout>
      </Section>

      <Section id="glossary" title="Glossary">
        <dl className="space-y-3">
          <Term t="Accessibility (a11y)">
            Designing so people with disabilities can use a product. &ldquo;a11y&rdquo; = &ldquo;a&rdquo;
            + 11 letters + &ldquo;y.&rdquo;
          </Term>
          <Term t="ADA">
            Americans with Disabilities Act - the U.S. civil-rights law used in most web-accessibility
            lawsuits.
          </Term>
          <Term t="WCAG">
            Web Content Accessibility Guidelines - the technical standard (by the W3C) that defines an
            accessible site.
          </Term>
          <Term t="Level AA">The middle, &ldquo;target&rdquo; tier of WCAG that laws and courts require.</Term>
          <Term t="POUR">The four WCAG principles: Perceivable, Operable, Understandable, Robust.</Term>
          <Term t="Screen reader">
            Software that reads a page aloud for blind/low-vision users (NVDA, VoiceOver, JAWS).
          </Term>
          <Term t="Alt text">A text description of an image that a screen reader announces.</Term>
          <Term t="ARIA">
            Accessible Rich Internet Applications - extra HTML attributes that tell assistive tech what
            a custom control is or when something changed.
          </Term>
          <Term t="Overlay / widget">
            A third-party script claiming to auto-fix accessibility. It does not change the underlying
            code.
          </Term>
          <Term t="Demand letter">
            A formal legal notice alleging violations and usually seeking a fix and a settlement.
          </Term>
          <Term t="Remediation">The actual work of fixing accessibility issues in the code.</Term>
          <Term t="VPAT">
            Voluntary Product Accessibility Template - a document reporting how a product conforms to
            accessibility standards.
          </Term>
          <Term t="Conformance">
            Meeting a defined set of WCAG success criteria at a chosen level (e.g. conforms to WCAG 2.1
            AA).
          </Term>
        </dl>
      </Section>

      <Section id="faq" title="FAQ">
        <Faq q="Is there a single setting or app that makes my store compliant?">
          No. Compliance comes from correct code across the site. Any product promising instant
          compliance is overstating - that is exactly what the FTC fined accessiBe for.
        </Faq>
        <Faq q="If the letter lists only 3 problems, can I just fix those 3?">
          No. These letters say the list is &ldquo;illustrative and not exhaustive.&rdquo; You need the
          whole site brought to WCAG 2.1 AA, which is why a full audit comes first.
        </Faq>
        <Faq q="Do I really need a lawyer?">
          For an active demand letter, yes - engage ADA-experienced counsel to handle deadlines and the
          legal response. Developers fix the site; lawyers handle the claim.
        </Faq>
        <Faq q="My site looks fine to me. How can it be inaccessible?">
          Most barriers are invisible to sighted mouse users. They only appear when you navigate by
          keyboard or listen with a screen reader - which is how disabled users (and the scanners)
          experience your site.
        </Faq>
        <Faq q="How long does fixing it take?">
          For a typical custom store, a few weeks of focused development plus testing. The exact scope
          depends on the audit.
        </Faq>
        <Faq q="Once fixed, am I done forever?">
          No - every new product or code change can introduce new issues. That is why ongoing checks and
          a launch checklist matter.
        </Faq>
      </Section>

      <Section id="resources" title="Sources and further reading">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <DocLink href="https://www.w3.org/WAI/fundamentals/accessibility-intro/">
              W3C WAI - Introduction to Web Accessibility
            </DocLink>{" "}
            (the official starting point)
          </li>
          <li>
            <DocLink href="https://webaim.org/intro/">WebAIM - Introduction to Web Accessibility</DocLink>
          </li>
          <li>
            <DocLink href="https://www.w3.org/WAI/standards-guidelines/wcag/">W3C WAI - WCAG Overview</DocLink>
          </li>
          <li>
            <DocLink href="https://www.w3.org/WAI/WCAG22/quickref/?versions=2.1">
              WCAG Quick Reference (filtered to 2.1)
            </DocLink>{" "}
            - the full, testable checklist
          </li>
          <li>
            <DocLink href="https://www.ada.gov/resources/web-guidance/">
              ADA.gov - Guidance on Web Accessibility and the ADA
            </DocLink>{" "}
            (U.S. DOJ)
          </li>
          <li>
            <DocLink href="https://www.section508.gov/">Section508.gov</DocLink> - U.S. federal
            accessibility law and resources
          </li>
          <li>
            <DocLink href="https://www.w3.org/WAI/policies/">
              W3C WAI - Web Accessibility Laws and Policies worldwide
            </DocLink>
          </li>
          <li>
            <DocLink href="https://www.deque.com/axe/">Deque axe DevTools</DocLink> &middot;{" "}
            <DocLink href="https://wave.webaim.org/">WAVE</DocLink> &middot;{" "}
            <DocLink href="https://www.nvaccess.org/">NVDA</DocLink> &middot;{" "}
            <DocLink href="https://webaim.org/resources/contrastchecker/">WebAIM Contrast Checker</DocLink>
          </li>
          <li>
            <DocLink href="https://developer.bigcommerce.com/docs/storefront/stencil/themes/accessibility/wcag-compliance-levels">
              BigCommerce - WCAG compliance levels for Stencil themes
            </DocLink>
          </li>
        </ul>
        <Callout tone="warn">
          <strong>Disclaimer.</strong> This is an educational, plain-language overview prepared by
          Codinative. It explains technical concepts and general industry practice - it is{" "}
          <strong>not legal advice</strong>. Laws vary by jurisdiction and change over time. For any
          specific legal demand, deadline, or risk question, consult a qualified attorney experienced
          in ADA / accessibility law.
        </Callout>
      </Section>
    </DocLayout>
  );
}

function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="border border-gray-200 bg-gray-50 px-3 py-2 text-left font-semibold text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td className="border border-gray-200 px-3 py-2 align-top text-gray-600 dark:border-gray-800 dark:text-gray-300">
      {children}
    </td>
  );
}

function Term({ t, children }: { t: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="font-semibold text-gray-900 dark:text-gray-100">{t}</dt>
      <dd className="mt-0.5 text-gray-600 dark:text-gray-300">{children}</dd>
    </div>
  );
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-medium text-gray-900 dark:text-gray-100">{q}</p>
      <p className="mt-1">{children}</p>
    </div>
  );
}

function DocLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-indigo-600 underline-offset-2 transition hover:underline dark:text-indigo-300"
    >
      {children}
    </a>
  );
}
