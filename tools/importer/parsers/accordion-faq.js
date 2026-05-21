/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion-faq
 * Base block: accordion
 * Source: https://www.wellsfargo.com/mortgage/
 * Selector: details.show-hide-content-wrapper
 * Structure: 2-column layout - question title | answer content per row
 */
export default function parse(element, { document }) {
  const cells = [];

  // The element is a single <details> element
  // Column 1: question title from <summary>
  const summary = element.querySelector('summary');
  let questionText = '';
  if (summary) {
    // Get the visible link text or span text for the question title
    const titleLink = summary.querySelector('.show-hide-title-text a');
    const titleSpan = summary.querySelector('.show-hide-title-text .hidden');
    if (titleLink) {
      questionText = titleLink.textContent.trim();
    } else if (titleSpan) {
      questionText = titleSpan.textContent.trim();
    } else {
      questionText = summary.textContent.trim();
    }
  }

  // Column 2: answer content from the collapsible wrapper
  const answerContainer = element.querySelector('.show-hide-content-text-wrapper-collapsible');

  if (questionText || answerContainer) {
    cells.push([questionText || '', answerContainer || '']);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
