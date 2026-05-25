/* eslint-disable */
/* global WebImporter */

export default function parse(element, { document }) {
  const cells = [];
  cells.push(['Columns (promo)']);

  const img = element.querySelector('.ps-promo-full-image img');
  const heading = element.querySelector('.ps-promo-full-content h2');
  const description = element.querySelector('.ps-promo-full-content p');
  const link = element.querySelector('.ps-promo-full-links a');

  const leftCol = document.createElement('div');
  if (img) {
    const picture = document.createElement('picture');
    const imgEl = document.createElement('img');
    imgEl.src = img.src;
    imgEl.alt = img.alt || '';
    picture.append(imgEl);
    leftCol.append(picture);
  }

  const rightCol = document.createElement('div');
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent;
    rightCol.append(h2);
  }
  if (description) {
    const p = document.createElement('p');
    p.textContent = description.textContent;
    rightCol.append(p);
  }
  if (link) {
    const a = document.createElement('a');
    a.href = link.href || '#';
    a.textContent = link.textContent;
    rightCol.append(a);
  }

  cells.push([leftCol, rightCol]);

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
