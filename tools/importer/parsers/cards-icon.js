/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-icon
 * Base block: cards
 * Source: https://www.wellsfargo.com/mortgage/
 * Selector: .small-promo-combined .ps-marketing-small-promo-items
 * Structure: 2-column layout - icon | heading + description + link per row
 */
export default function parse(element, { document }) {
  const cells = [];

  // Each promo item becomes a row in the cards block
  const items = element.querySelectorAll('.ps-marketing-small-promo-item');

  items.forEach((item) => {
    // Column 1: icon image from the marketing icon container
    const icon = item.querySelector('.ps-marketing-icon img');

    // Column 2: heading + description + link
    const textContainer = item.querySelector('.ps-marketing-text');
    const contentCell = [];

    if (textContainer) {
      const heading = textContainer.querySelector('h3');
      if (heading) {
        contentCell.push(heading);
      }

      const description = textContainer.querySelector('.ps-marketing-text-content');
      if (description) {
        contentCell.push(description);
      }

      // Use the desktop link (learn-more) or fallback to mobile link
      const link = item.querySelector('.ps-marketing-promo-link a, .learn-more-mobile a');
      if (link) {
        contentCell.push(link);
      }
    }

    if (icon || contentCell.length > 0) {
      cells.push([icon || '', contentCell.length > 0 ? contentCell : '']);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards (icon)', cells });
  element.replaceWith(block);
}
