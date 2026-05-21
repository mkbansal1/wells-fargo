/* eslint-disable */
/* global WebImporter */

import heroBannerParser from './parsers/hero-banner.js';
import cardsIconParser from './parsers/cards-icon.js';
import cardsPromoParser from './parsers/cards-promo.js';
import cardsResourceParser from './parsers/cards-resource.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import columnsTestimonialParser from './parsers/columns-testimonial.js';
import columnsContactParser from './parsers/columns-contact.js';

import cleanupTransformer from './transformers/cleanup.js';
import sectionsTransformer from './transformers/sections.js';

const parsers = {
  'hero-banner': heroBannerParser,
  'cards-icon': cardsIconParser,
  'cards-promo': cardsPromoParser,
  'cards-resource': cardsResourceParser,
  'accordion-faq': accordionFaqParser,
  'columns-testimonial': columnsTestimonialParser,
  'columns-contact': columnsContactParser,
};

const PAGE_TEMPLATE = {
  name: 'mortgage-landing',
  description: 'Mortgage product landing page with loan options, rates, and home buying resources',
  urls: ['https://www.wellsfargo.com/mortgage/'],
  blocks: [
    { name: 'hero-banner', instances: ['.rsk-marquee-container'] },
    { name: 'cards-icon', instances: ['.small-promo-combined .ps-marketing-small-promo-items'] },
    { name: 'cards-promo', instances: ['.card-container.three-card'] },
    { name: 'cards-resource', instances: ['.small-promo-combined .mark-small-promo-simpletext'] },
    { name: 'accordion-faq', instances: ['details.show-hide-content-wrapper'] },
    { name: 'columns-testimonial', instances: ['.card-container.two-card'] },
    { name: 'columns-contact', instances: ['.card-container.four-card'] },
  ],
  sections: [
    { id: 'section-1', name: 'Hero', selector: '.rsk-marquee-container', style: null, blocks: ['hero-banner'], defaultContent: ['.enhanced-txt-cm.text-aligned-center'] },
    { id: 'section-2', name: 'Homebuying', selector: 'main .small-promo-combined:nth-of-type(1)', style: null, blocks: ['cards-icon'], defaultContent: ['.ps-mid-page-title', '.ps-padding .ps-btn-secondary'] },
    { id: 'section-3', name: 'Refinancing', selector: 'main .small-promo-combined:nth-of-type(2)', style: null, blocks: ['cards-icon'], defaultContent: ['.ps-mid-page-title', '.ps-padding .ps-btn-secondary'] },
    { id: 'section-4', name: 'Get More', selector: '.card-background-white:has(.three-card)', style: null, blocks: ['cards-promo'], defaultContent: ['.ps-mid-page-title'] },
    { id: 'section-5', name: 'Mortgage Tools', selector: 'main .small-promo-combined:nth-of-type(3)', style: null, blocks: ['cards-resource'], defaultContent: ['.ps-mid-page-title'] },
    { id: 'section-6', name: 'FAQ', selector: '.card-background-white:has(.show-hide-content-wrapper)', style: null, blocks: ['accordion-faq'], defaultContent: ['.ps-mid-page-title', '.ps-padding .ps-btn-secondary'] },
    { id: 'section-7', name: 'Testimonials', selector: '.card-background-white:has(.two-card)', style: null, blocks: ['columns-testimonial'], defaultContent: ['.ps-mid-page-title'] },
    { id: 'section-8', name: 'Contact', selector: '.card-background-white:has(.four-card)', style: null, blocks: ['columns-contact'], defaultContent: ['.ps-mid-page-title'] },
    { id: 'section-9', name: 'Quick Help', selector: 'main > .enhanced-txt-cm.text-aligned-left', style: null, blocks: [], defaultContent: ['.title2-SemiBold h3', '.link-list-desc', '.subheadline-regular p'] },
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
