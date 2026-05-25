/* eslint-disable */
/* global WebImporter */

import heroBannerParser from './parsers/hero-banner.js';
import cardsParser from './parsers/cards.js';
import cardsIconParser from './parsers/cards-icon.js';
import columnsPromoParser from './parsers/columns-promo.js';
import columnsContactParser from './parsers/columns-contact.js';

import cleanupTransformer from './transformers/cleanup.js';
import sectionsTransformer from './transformers/sections.js';

const parsers = {
  'hero-banner': heroBannerParser,
  'cards': cardsParser,
  'cards-icon': cardsIconParser,
  'columns-promo': columnsPromoParser,
  'columns-contact': columnsContactParser,
};

const PAGE_TEMPLATE = {
  name: 'mortgage-learn',
  description: 'Mortgage learning center page with educational article cards and resources',
  urls: ['https://www.wellsfargo.com/mortgage/learn/'],
  blocks: [
    { name: 'hero-banner', instances: ['.internal-navigation-wrapper'] },
    { name: 'cards', instances: ['.card-container.four-card'] },
    { name: 'cards-icon', instances: ['.ps-marketing-small-promo-items'] },
    { name: 'columns-promo', instances: ['.ps-large-promo-full-container'] },
    { name: 'columns-contact', instances: ['.card-container.three-card'] },
  ],
  sections: [
    { id: 'section-1', name: 'Hero', selector: '.internal-navigation-wrapper', style: null, blocks: ['hero-banner'], defaultContent: ['.ps-page-title h1'] },
    { id: 'section-2', name: 'Preparing to Buy', selector: 'main > .card-background-white:nth-of-type(1)', style: null, blocks: ['cards'], defaultContent: ['.ps-mid-page-title'] },
    { id: 'section-3', name: 'Mortgage Process', selector: 'main > .horizontal-card-container:nth-of-type(1)', style: null, blocks: ['cards'], defaultContent: ['.ps-mid-page-title'] },
    { id: 'section-4', name: 'Owning and Refinancing', selector: 'main > .horizontal-card-container:nth-of-type(2)', style: null, blocks: ['cards'], defaultContent: ['.ps-mid-page-title'] },
    { id: 'section-5', name: 'Budget Promo', selector: '.ps-large-promo-full-container', style: null, blocks: ['columns-promo'], defaultContent: [] },
    { id: 'section-6', name: 'Resources', selector: '.ps-marketing-small-promo-items', style: null, blocks: ['cards-icon'], defaultContent: [] },
    { id: 'section-7', name: 'Contact', selector: 'main > .card-background-white:has(.three-card)', style: null, blocks: ['columns-contact'], defaultContent: ['.ps-mid-page-title'] },
    { id: 'section-8', name: 'Disclaimers', selector: 'main > .enhanced-txt-cm.text-aligned-left', style: null, blocks: [], defaultContent: [] },
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
