/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-contact
 * Base block: columns
 * Source: https://www.wellsfargo.com/mortgage/
 * Selector: .card-container.four-card
 * Structure: Single row with 4 columns - one contact option per column
 */
export default function parse(element, { document }) {
  const cells = [];

  // Each .enhanced-txt-cm within the four-card container is a column
  const columns = element.querySelectorAll(':scope > .enhanced-txt-cm');
  const row = [];

  columns.forEach((col) => {
    // Build content cell with heading + body content
    const contentCell = [];

    const heading = col.querySelector('.title2-SemiBold h3');
    if (heading) {
      contentCell.push(heading);
    }

    const body = col.querySelector('.subheadline-regular');
    if (body) {
      contentCell.push(body);
    }

    if (contentCell.length > 0) {
      row.push(contentCell);
    } else {
      row.push(col);
    }
  });

  if (row.length > 0) {
    cells.push(row);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns (contact)', cells });
  element.replaceWith(block);
}
