/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-promo
 * Base block: cards
 * Source: https://www.wellsfargo.com/mortgage/
 * Selector: .card-container.three-card
 * Structure: 2-column layout - image | heading + description + link per row
 */
export default function parse(element, { document }) {
  const cells = [];

  // Each three-card-content div is one card item
  const items = element.querySelectorAll('.three-card-content');

  items.forEach((item) => {
    // Column 1: card image
    const image = item.querySelector('img');

    // Column 2: heading + description + CTA link
    const contentCell = [];

    const heading = item.querySelector('.title2-SemiBold h3');
    if (heading) {
      contentCell.push(heading);
    }

    const description = item.querySelector('.subheadline-regular');
    if (description) {
      // Clone to avoid modifying original, remove footnote superscripts for cleaner content
      const descClone = description.cloneNode(true);
      contentCell.push(descClone);
    }

    const link = item.querySelector('.enhanced-txt-body > p > a, .ps-btn-text');
    if (link) {
      contentCell.push(link);
    }

    if (image || contentCell.length > 0) {
      cells.push([image || '', contentCell.length > 0 ? contentCell : '']);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-promo', cells });
  element.replaceWith(block);
}
