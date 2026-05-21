/* eslint-disable */
/* global WebImporter */

import heroBannerParser from './parsers/hero-banner.js';
import cardsIconParser from './parsers/cards-icon.js';
import cardsPromoParser from './parsers/cards-promo.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import columnsAppPromoParser from './parsers/columns-app-promo.js';

import cleanupTransformer from './transformers/cleanup.js';
import sectionsTransformer from './transformers/sections.js';

const parsers = {
  'hero-banner': heroBannerParser,
  'cards-icon': cardsIconParser,
  'cards-promo': cardsPromoParser,
  'accordion-faq': accordionFaqParser,
  'columns-app-promo': columnsAppPromoParser,
};

const PAGE_TEMPLATE = {
  name: 'auto-loans-landing',
  description: 'Auto loans product landing page with financing options and resources',
  urls: ['https://www.wellsfargo.com/auto-loans/'],
  blocks: [
    { name: 'hero-banner', instances: ['.rsk-marquee-container'] },
    { name: 'cards-icon', instances: ['.small-promo-combined-white .ps-marketing-small-promo-items', '.small-promo-combined .ps-marketing-small-promo-items'] },
    { name: 'columns-app-promo', instances: ['.ps-native-app-container'] },
    { name: 'cards-promo', instances: ['.card-container.three-card'] },
    { name: 'accordion-faq', instances: ['details.show-hide-content-wrapper'] },
  ],
  sections: [
    { id: 'section-1', name: 'Hero', selector: '.rsk-marquee-container', style: null, blocks: ['hero-banner'], defaultContent: [] },
    { id: 'section-2', name: 'Benefits', selector: '.small-promo-combined-white', style: null, blocks: ['cards-icon'], defaultContent: ['.ps-mid-page-title'] },
    { id: 'section-3', name: 'App Promo', selector: '.ps-native-app-container', style: 'teal', blocks: ['columns-app-promo'], defaultContent: [] },
    { id: 'section-4', name: 'Auto Loan Journey', selector: '.card-background-white:has(.three-card)', style: null, blocks: ['cards-promo'], defaultContent: ['.ps-mid-page-title'] },
    { id: 'section-5', name: 'FAQ', selector: '.card-background-white:has(.show-hide-content-wrapper)', style: null, blocks: ['accordion-faq'], defaultContent: ['.ps-mid-page-title', '.ps-btn-secondary'] },
    { id: 'section-6', name: 'Customer Support', selector: 'main > .small-promo-combined', style: null, blocks: ['cards-icon'], defaultContent: ['.ps-mid-page-title'] },
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
