/* eslint-disable */
/* global WebImporter */

export default function parse(element, { document }) {
  const cells = [];
  cells.push(['Cards']);

  const items = element.querySelectorAll('.enhanced-txt-cm');

  items.forEach((item) => {
    const img = item.querySelector('img');
    const heading = item.querySelector('.title2-SemiBold');
    const description = item.querySelector('.subheadline-regular');
    const link = item.querySelector('.enhanced-txt-body a');

    const contentCell = document.createElement('div');
    if (heading) {
      const h3 = document.createElement('h3');
      h3.textContent = heading.textContent;
      contentCell.append(h3);
    }
    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent;
      contentCell.append(p);
    }
    if (link) {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent;
      contentCell.append(a);
    }

    if (img) {
      const picture = document.createElement('picture');
      const imgEl = document.createElement('img');
      imgEl.src = img.src;
      imgEl.alt = img.alt || '';
      picture.append(imgEl);
      cells.push([picture, contentCell]);
    } else {
      cells.push([contentCell]);
    }
  });

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
