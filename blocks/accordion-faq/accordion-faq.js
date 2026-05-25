export default function decorate(block) {
  [...block.children].forEach((row) => {
    const cell = row.children[0];
    if (!cell) return;

    // First child element is the question (bold text, heading, or first paragraph)
    const firstEl = cell.firstElementChild;
    if (!firstEl) return;

    const summary = document.createElement('summary');
    summary.className = 'accordion-faq-item-label';
    summary.textContent = firstEl.textContent;
    firstEl.remove();

    const body = document.createElement('div');
    body.className = 'accordion-faq-item-body';
    body.append(...cell.childNodes);

    const details = document.createElement('details');
    details.className = 'accordion-faq-item';
    details.append(summary, body);
    row.replaceWith(details);
  });
}
