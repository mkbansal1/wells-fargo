/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-resource
 * Base block: cards
 * Source: https://www.wellsfargo.com/mortgage/
 * Selector: .small-promo-combined .mark-small-promo-simpletext
 * Structure: 2-column layout - icon | heading + description + link per row
 * Note: This block has a simpler structure than cards-icon (no icon container wrapper)
 */
export default function parse(element, { document }) {
  const cells = [];

  // The element itself is a single .mark-small-promo-simpletext item
  // Multiple instances will be parsed individually by the importer

  // Column 1: icon/image (first direct img or background img)
  const icon = element.querySelector(':scope > img');

  // Column 2: heading + description + link from .ps-marketing-text
  const textContainer = element.querySelector('.ps-marketing-text');
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

    // Use desktop link (ps-marketing-promo-link) or mobile fallback
    const link = element.querySelector('.ps-marketing-promo-link a, .learn-more-mobile a');
    if (link) {
      contentCell.push(link);
    }
  }

  if (icon || contentCell.length > 0) {
    cells.push([icon || '', contentCell.length > 0 ? contentCell : '']);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-resource', cells });
  element.replaceWith(block);
}
