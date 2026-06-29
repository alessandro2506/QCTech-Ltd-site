---
title: "Website Accessibility & WCAG 2.2: A Practical Guide for UK Businesses"
date: "2026-06-29"
author: "QC Tech"
authorRole: "Digital Studio — Bishop's Stortford, UK"
excerpt: "WCAG 2.2 is now the benchmark for web accessibility in the UK. Here's what it means for your business, your legal exposure, and your bottom line."
tags: ["website accessibility", "WCAG 2.2", "UK web compliance", "inclusive design"]
readTime: "9 min read"
---

# Website Accessibility & WCAG 2.2: A Practical Guide for UK Businesses

Roughly 16 million people in the UK live with a disability. That figure, from the Department for Work and Pensions' Family Resources Survey 2023/24, represents approximately 24% of the UK population — and a significant share of your potential customers. If your website cannot be used by a meaningful portion of the population, you are not just leaving revenue on the table; you may also be in breach of the Equality Act 2010.

WCAG 2.2 — the Web Content Accessibility Guidelines published by the W3C in October 2023 — is now the de facto international standard, and it is the benchmark UK regulators, procurement teams, and courts reference when assessing whether a website is accessible. This guide explains exactly what it requires, what it means for UK businesses legally and commercially, and how to bring your site into compliance without wasting budget.

---

## What Is WCAG 2.2 and Why Does It Replace 2.1?

WCAG 2.2 builds on version 2.1 rather than replacing it wholesale. All 2.1 success criteria remain in place; the new version adds nine new criteria and removes one (4.1.1 Parsing, which became redundant as modern browsers handle HTML errors more gracefully).

The additions focus primarily on three areas that reflect how people actually use the web today:

- **Keyboard and focus navigation** — clearer, more visible focus indicators so users who cannot use a mouse can track where they are on-screen
- **Dragging movements** — alternatives must be provided for any functionality that requires a drag gesture, covering users with motor impairments and touchscreen users with limited dexterity
- **Cognitive and authentication accessibility** — removing memory-based CAPTCHAs and cognitive tests from login flows unless an accessible alternative is offered

If your site was WCAG 2.1 AA compliant, you are not automatically WCAG 2.2 AA compliant. You will need to audit against the new criteria.

---

## The Three Conformance Levels Explained

| Level | Description | Typical Requirement |
|-------|-------------|---------------------|
| **A** | Minimum accessibility — removes the most severe barriers | Legal baseline for most regulated sectors |
| **AA** | Mid-range — the standard referenced by UK law, government procurement and most legal frameworks | Target for all UK commercial websites |
| **AAA** | Enhanced — not required for entire sites; applied selectively to specific content types | Specialist services, government portals, healthcare |

**For the vast majority of UK businesses, WCAG 2.2 Level AA is your target.** This is the level the Public Sector Bodies Accessibility Regulations 2018 (SI 2018/952) mandates for government and publicly funded organisations, and it is the level courts and the Equality and Human Rights Commission (EHRC) use as a reference point when assessing reasonable adjustments under the Equality Act.

---

## The Legal Position for UK Businesses in 2026

### Equality Act 2010

The Equality Act places a duty on service providers — which includes anyone running a commercial website — to make "reasonable adjustments" to ensure disabled people can access services. The Act does not explicitly reference WCAG, but tribunals and courts have consistently used it as the technical measure of what is reasonable.

Claims can be brought to the county court or employment tribunal. Compensation awards for injury to feelings in service provider cases typically range from **£1,100 to £33,000** under the Vento bands (updated April 2024), plus any direct loss suffered. While large class-action suits of the kind seen in the United States are less common in the UK, individual and EHRC-backed enforcement actions are increasing.

### Public Sector Bodies Accessibility Regulations (PSBAR)

If you supply software, websites, or digital services to the public sector — including NHS trusts, local authorities, schools, and government agencies — your clients are required to meet WCAG 2.2 AA. In practice, this means their procurement teams will increasingly require suppliers to demonstrate compliance. Failing an accessibility audit can now cost you a contract.

### The Business Risk Beyond Legal Claims

A 2024 survey by AbilityNet found that **71% of users with a disability will leave a website immediately if it is not accessible**, and 82% say they would spend more with businesses that prioritise accessibility. The commercial case is straightforward: accessibility is not a cost centre, it is a conversion rate issue.

---

## The Nine New WCAG 2.2 Criteria: What They Mean Practically

### Focus Appearance (2.4.11 — AA)

Focus indicators — the visual outline shown when a user tabs through a page — must now meet minimum size and contrast requirements. A thin, low-contrast dotted border no longer passes. Practically, this means reviewing your CSS `:focus` styles and ensuring the focus indicator has a minimum area of the perimeter of the focused component multiplied by 2 CSS pixels, with a 3:1 contrast ratio against adjacent colours.

**What to fix:** Replace default browser focus outlines with custom, high-contrast focus rings across all interactive elements.

### Dragging Movements (2.5.7 — AA)

Any functionality that uses a drag-and-drop interaction — carousel sliders, kanban boards, custom sort orders — must offer a single-pointer alternative (typically a click or tap with directional buttons).

**What to fix:** Audit custom UI components. Add keyboard-accessible alternatives to all drag interactions.

### Target Size (Minimum) (2.5.8 — AA)

Clickable targets must be at least 24×24 CSS pixels, unless adequate spacing is provided around them. This is less stringent than the AAA criterion (44×44px) but catches many icon-only buttons and closely spaced navigation links.

**What to fix:** Review all touch targets, particularly on mobile. Icon buttons, close buttons, and pagination links are the most common failures.

### Accessible Authentication (2.5.6 — AA and AAA variants)

Login and authentication processes cannot require users to solve a cognitive function test — such as a puzzle CAPTCHA, a memory test, or transcribing distorted text — unless an alternative is provided. Email magic links, passkeys, or copy-paste-friendly one-time codes are acceptable alternatives.

**What to fix:** Audit your login, checkout, and form flows. Replace reCAPTCHA v2 with v3 (risk-based, invisible) or an accessible alternative.

### Consistent Help (3.2.6 — A)

If a help mechanism — such as a contact link, chatbot, or phone number — appears on multiple pages of a website, it must appear in the same relative location on each page.

**What to fix:** Audit header and footer templates to ensure support links are positionally consistent across your entire site.

---

## How to Conduct a WCAG 2.2 Audit

### Automated Testing: The Starting Point, Not the Finish Line

Automated tools — including Axe, WAVE, Lighthouse, and Deque's browser extensions — can detect roughly **30–40% of WCAG failures** reliably. They catch missing alt text, insufficient colour contrast, missing form labels, and some structural issues. They cannot assess the quality of alt text, logical reading order, or the usability of a screen reader experience.

**Recommended free tools:**

- [Axe DevTools browser extension](https://www.deque.com/axe/) — most accurate automated scanner
- [WAVE](https://wave.webaim.org/) — visual overlay, good for quick audits
- Google Lighthouse — built into Chrome DevTools, covers basic accessibility alongside performance

### Manual Testing

Manual testing should cover:

- **Keyboard-only navigation** — tab through every interactive element on your site; nothing should be unreachable
- **Screen reader testing** — use NVDA (free, Windows) with Firefox, or VoiceOver (built into macOS/iOS) to experience the site as a visually impaired user would
- **Zoom testing** — increase browser zoom to 200% and 400%; content must reflow without horizontal scrolling on a 320px viewport
- **Colour contrast checks** — use the Paciello Group's Colour Contrast Analyser (free desktop tool) to verify all text and UI component contrast ratios

### User Testing with Disabled Participants

Automated and expert manual audits will miss usability issues that only emerge when people with real disabilities use your site. Budget permitting, recruit through organisations such as AbilityNet or Scope, or use a specialist accessibility testing agency. Expect to pay **£2,000–£6,000** for a professional accessibility audit covering a medium-complexity commercial website in 2026.

---

## Common Failures UK Business Websites Make

- **Missing or poor-quality image alt text** — decorative images left with meaningful alt text, meaningful images with empty alt attributes, or generic descriptions like "image1.jpg"
- **Form fields without associated labels** — placeholder text is not a substitute for a `<label>` element
- **Auto-playing video or audio** — content that plays automatically without user control
- **Inaccessible PDF documents** — untagged PDFs, scanned documents without OCR, no accessible HTML alternative
- **Insufficient colour contrast** — particularly grey text on white backgrounds, common in minimalist design trends
- **No skip navigation link** — keyboard users must tab through the entire header on every page without a "skip to main content" link
- **Session timeouts without warning** — users must be warned before a session expires and given the option to extend it

---

## Cost of Compliance vs Cost of Inaction

| Scenario | Estimated Cost (2026) |
|----------|-----------------------|
| Professional WCAG 2.2 audit (medium site) | £2,000 – £6,000 |
| Remediation development work (medium site) | £3,000 – £15,000 |
| Ongoing monitoring & annual re-audit | £800 – £2,500/year |
| County court claim — injury to feelings award | £1,100 – £33,000 |
| Lost public sector contract (average SME contract) | £25,000 – £250,000+ |
| Reputational damage (unquantifiable) | — |

The numbers make the decision straightforward: proactive compliance costs a fraction of reactive remediation under legal pressure, and a fraction of a lost procurement opportunity.

---

## Building Accessibility Into Your Process Going Forward

The most expensive approach to accessibility is bolting it on after a site is built. The most efficient approach is to treat it as a design and development requirement from day one — the same way you treat mobile responsiveness or page speed.

At Quantum Code Technologies Ltd, accessibility compliance is embedded into our web design and development workflow as standard, not an optional extra — because our clients increasingly operate in regulated sectors or supply to the public sector where it is a contractual requirement.

Key process changes that reduce long-term cost:

- **Add WCAG 2.2 AA to your design system** — document accessible colour palettes, typography scales, focus styles, and component patterns
- **Include accessibility acceptance criteria in every development ticket** — not a separate QA phase
- **Automate Axe checks in your CI/CD pipeline** — catch regressions before they reach production
- **Publish an accessibility statement** — legally required for public sector bodies; best practice for all commercial sites, and a signal of trustworthiness to users

---

## Next Steps

Accessibility compliance is not a one-time project. WCAG guidelines continue to evolve — WCAG 3.0 is in active development — and your site changes constantly, introducing new potential failures with every update.

Here is a practical sequence for UK businesses starting from scratch in 2026:

1. **Run an automated audit today** — use Axe or WAVE on your five most-visited pages and identify the quick wins
2. **Commission a professional WCAG 2.2 AA audit** — get a prioritised list of failures with severity ratings
3. **Remediate critical and high failures first** — focus on anything that prevents task completion (forms, checkout, navigation)
4. **Publish an accessibility statement** — even an honest one that acknowledges known issues and your remediation timeline demonstrates good faith
5. **Schedule a re-audit annually** — or after any significant redesign or platform migration
6. **Train your content team** — most ongoing failures are introduced by non-technical staff uploading images without alt text, or pasting inaccessible PDFs

The Equality Act 2010 has always applied to digital services. WCAG 2.2 simply gives you — and the courts — a clear, measurable standard to work against. Businesses that treat accessibility as a compliance checkbox will spend more money, more reactively, than those that build it into their culture and workflow.

The 16 million people in the UK living with a disability are not an edge case. They are your customers.