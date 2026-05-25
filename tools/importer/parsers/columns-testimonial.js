/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-testimonial
 * Base block: columns
 * Source: https://www.wellsfargo.com/mortgage/
 * Selector: .card-container.two-card
 * Structure: Single row with 2 columns - one testimonial per column
 */
export default function parse(element, { document }) {
  const cells = [];

  // Each .two-card-content or .enhanced-txt-cm within the two-card container is a column
  const columns = element.querySelectorAll('.two-card-content, :scope > .enhanced-txt-cm');
  const row = [];

  columns.forEach((col) => {
    // Extract the testimonial content (quote text + attribution)
    const contentBody = col.querySelector('.enhanced-txt-body, .subheadline-regular');
    if (contentBody) {
      row.push(contentBody);
    } else {
      row.push(col);
    }
  });

  if (row.length > 0) {
    cells.push(row);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns (testimonial)', cells });
  element.replaceWith(block);
}
