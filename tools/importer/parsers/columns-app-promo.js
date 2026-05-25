/* global WebImporter */

export default function parse(element, { document }) {
  const cells = [];
  cells.push(['Columns (app-promo)']);

  const img = element.querySelector('.native-app-carousel img');
  const heading = element.querySelector('.native-app-header h2');
  const description = element.querySelector('.native-app-header p');
  const appleLink = element.querySelector('.ps-button-applestore');
  const googleLink = element.querySelector('.ps-button-googleplay');

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
  if (appleLink) {
    const a = document.createElement('a');
    a.href = appleLink.href;
    const appleImg = appleLink.querySelector('img');
    if (appleImg) {
      const pic = document.createElement('picture');
      const i = document.createElement('img');
      i.src = appleImg.src;
      i.alt = 'Download on the App Store';
      pic.append(i);
      a.append(pic);
    } else {
      a.textContent = 'Download on the App Store';
    }
    rightCol.append(a);
  }
  if (googleLink) {
    const a = document.createElement('a');
    a.href = googleLink.href;
    const googleImg = googleLink.querySelector('img');
    if (googleImg) {
      const pic = document.createElement('picture');
      const i = document.createElement('img');
      i.src = googleImg.src;
      i.alt = 'Get it on Google Play';
      pic.append(i);
      a.append(pic);
    } else {
      a.textContent = 'Get it on Google Play';
    }
    rightCol.append(a);
  }

  cells.push([leftCol, rightCol]);

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
