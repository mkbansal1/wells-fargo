/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-banner
 * Base block: hero
 * Source: https://www.wellsfargo.com/mortgage/
 * Selector: .rsk-marquee-container
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract background image from marquee container
  const bgImage = element.querySelector('.rsk-marquee-img-container img');
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Extract heading from marquee content area
  const heading = element.querySelector('.rsk-marquee-content h2, .rsk-marquee-content h1');
  const contentCell = [];
  if (heading) {
    contentCell.push(heading);
  }

  // Extract description text if present
  const description = element.querySelector('.rsk-marquee-content p');
  if (description) {
    contentCell.push(description);
  }

  // Extract CTA links if present
  const ctaLinks = element.querySelectorAll('.rsk-marquee-content a');
  ctaLinks.forEach((link) => {
    contentCell.push(link);
  });

  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
