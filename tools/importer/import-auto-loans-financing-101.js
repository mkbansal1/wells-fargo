/* eslint-disable */
/* global WebImporter */

import heroBannerParser from './parsers/hero-banner.js';
import cardsParser from './parsers/cards.js';
import cardsIconParser from './parsers/cards-icon.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import columnsPromoParser from './parsers/columns-promo.js';

import cleanupTransformer from './transformers/cleanup.js';
import sectionsTransformer from './transformers/sections.js';

const parsers = {
  'hero-banner': heroBannerParser,
  'cards': cardsParser,
  'cards-icon': cardsIconParser,
  'accordion-faq': accordionFaqParser,
  'columns-promo': columnsPromoParser,
};

const PAGE_TEMPLATE = {
  name: 'auto-loans-financing-101',
  description: 'Auto loans vehicle financing guide page with educational content',
  urls: ['https://www.wellsfargo.com/auto-loans/vehicle-financing-101/'],
  blocks: [
    { name: 'hero-banner', instances: ['.rsk-marquee-container'] },
    { name: 'accordion-faq', instances: ['details.show-hide-content-wrapper', '.ps-responsive-tab details.tab-mobile-item'] },
    { name: 'columns-promo', instances: ['.ps-large-promo-full-container'] },
    { name: 'cards', instances: ['.card-container.three-card'] },
    { name: 'cards-icon', instances: ['.ps-marketing-small-promo-items'] },
  ],
  sections: [
    { id: 'section-1', name: 'Hero', selector: '.rsk-marquee-container', style: null, blocks: ['hero-banner'], defaultContent: [] },
    { id: 'section-2', name: 'What to Know', selector: 'main > .ps-responsive-tab:nth-of-type(1)', style: null, blocks: ['accordion-faq'], defaultContent: ['.ps-mid-page-title'] },
    { id: 'section-3', name: 'Credit Approval', selector: '.ps-large-promo-full-container', style: null, blocks: ['columns-promo'], defaultContent: ['.ps-mid-page-title'] },
    { id: 'section-4', name: 'Before You Buy', selector: '.card-container.three-card', style: null, blocks: ['cards'], defaultContent: ['.ps-mid-page-title'] },
    { id: 'section-5', name: 'Evaluate Vehicles', selector: 'main > .ps-responsive-tab:nth-of-type(2)', style: null, blocks: ['accordion-faq'], defaultContent: ['.ps-mid-page-title'] },
    { id: 'section-6', name: 'FAQ', selector: 'main > .card-background-white:has(+ details)', style: null, blocks: ['accordion-faq'], defaultContent: ['.ps-mid-page-title', '.ps-btn-secondary'] },
    { id: 'section-7', name: 'Resources', selector: '.ps-marketing-small-promo-items', style: null, blocks: ['cards-icon'], defaultContent: ['.ps-mid-page-title'] },
    { id: 'section-8', name: 'Footnotes', selector: 'main > .ps-footnote', style: null, blocks: [], defaultContent: [] },
  ],
};

const transformers = [
  cleanupTransformer,
  sectionsTransformer,
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
