/* eslint-disable */
/* global WebImporter */

import heroBannerParser from './parsers/hero-banner.js';
import columnsContactParser from './parsers/columns-contact.js';

import cleanupTransformer from './transformers/cleanup.js';
import sectionsTransformer from './transformers/sections.js';

const parsers = {
  'hero-banner': heroBannerParser,
  'columns-contact': columnsContactParser,
};

const PAGE_TEMPLATE = {
  name: 'equity-landing',
  description: 'Home equity landing page with loan options and resources',
  urls: ['https://www.wellsfargo.com/equity/'],
  blocks: [
    { name: 'hero-banner', instances: ['.rsk-marquee-container'] },
    { name: 'columns-contact', instances: ['.card-container.three-card'] },
  ],
  sections: [
    { id: 'section-1', name: 'Hero', selector: '.rsk-marquee-container', style: null, blocks: ['hero-banner'], defaultContent: [] },
    { id: 'section-2', name: 'Article Body', selector: 'main > .enhanced-txt-cm.text-aligned-left', style: null, blocks: [], defaultContent: [] },
    { id: 'section-3', name: 'CTA Banner', selector: '.card-background-gray', style: 'grey', blocks: [], defaultContent: ['.ps-mid-page-title', '.ps-btn-secondary'] },
    { id: 'section-4', name: 'Contact', selector: '.card-background-white:has(.three-card)', style: null, blocks: ['columns-contact'], defaultContent: ['.ps-mid-page-title'] },
    { id: 'section-5', name: 'Footnotes', selector: 'main > .ps-footnote', style: null, blocks: [], defaultContent: [] },
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
