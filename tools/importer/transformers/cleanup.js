/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Wells Fargo cleanup.
 * Removes non-authorable content (header, footer, nav, modals, widgets, overlays, footnotes).
 * All selectors validated against captured DOM in migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie consent banner (found: div#onetrust-consent-sdk)
    // Remove external-link modals (found: div.ep-modal)
    // Remove language preference popup (found: div#lang-pref-pop-up)
    // Remove lightbox overlay (found: div.rsk-lightbox-container)
    // Remove bottom sheet footnote dialog (found: div#bottom-sheet-container)
    // Remove Nuance chat widgets (found: div#nuanChatStage, div#nuance-chat-anchored, etc.)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '.ep-modal',
      '#lang-pref-pop-up',
      '.rsk-lightbox-container',
      '#bottom-sheet-container',
      '#nuanChatStage',
      '#nuance-chat-anchored',
      '#nuance-chat-anchored-2',
      '#nuance-chat-anchored-mobile',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove site header (found: header.ps-masthead)
    // Remove site footer (found: footer.ps-responsive-footer)
    // Remove breadcrumb nav (found: div.ps-rsk-breadcrumb-container)
    // Remove fat navigation overlay and menu (found: div.ps-fat-nav-overlay, div.ps-fat-nav-outer)
    // Remove support/help dropdown overlay (found: div.ps-support-dropdown-overlay-container, div.ps-support-dropdown-overlay)
    // Remove mobile L3 nav container (found: div#containerL3Mobile)
    // Remove feedback survey widget (found: div#feedbackSurvey)
    // Remove footnotes section (found: div.ps-footnote)
    // Remove tracking pixel container (found: div.visuallyHidden)
    // Remove ad blocker detection div (found: div.pub_300x250)
    // Remove skip-to-content link (found: a.hidden[href="#skip"])
    // Remove stray iframes and link elements
    WebImporter.DOMUtils.remove(element, [
      'header.ps-masthead',
      'footer.ps-responsive-footer',
      '.ps-rsk-breadcrumb-container',
      '.ps-fat-nav-overlay',
      '.ps-fat-nav-outer',
      '.ps-support-dropdown-overlay-container',
      '.ps-support-dropdown-overlay',
      '#containerL3Mobile',
      '#feedbackSurvey',
      '.ps-footnote',
      '.visuallyHidden',
      '.pub_300x250',
      'a.hidden[href="#skip"]',
      'iframe',
      'link',
      'noscript',
    ]);
  }
}
