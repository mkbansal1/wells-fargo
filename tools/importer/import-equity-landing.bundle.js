/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-equity-landing.js
  var import_equity_landing_exports = {};
  __export(import_equity_landing_exports, {
    default: () => import_equity_landing_default
  });

  // tools/importer/parsers/hero-banner.js
  function parse(element, { document }) {
    const cells = [];
    const bgImage = element.querySelector(".rsk-marquee-img-container img");
    if (bgImage) {
      cells.push([bgImage]);
    }
    const heading = element.querySelector(".rsk-marquee-content h2, .rsk-marquee-content h1");
    const contentCell = [];
    if (heading) {
      contentCell.push(heading);
    }
    const description = element.querySelector(".rsk-marquee-content p");
    if (description) {
      contentCell.push(description);
    }
    const ctaLinks = element.querySelectorAll(".rsk-marquee-content a");
    ctaLinks.forEach((link) => {
      contentCell.push(link);
    });
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "Hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-contact.js
  function parse2(element, { document }) {
    const cells = [];
    const columns = element.querySelectorAll(":scope > .enhanced-txt-cm");
    const row = [];
    columns.forEach((col) => {
      const contentCell = [];
      const heading = col.querySelector(".title2-SemiBold h3");
      if (heading) {
        contentCell.push(heading);
      }
      const body = col.querySelector(".subheadline-regular");
      if (body) {
        contentCell.push(body);
      }
      if (contentCell.length > 0) {
        row.push(contentCell);
      } else {
        row.push(col);
      }
    });
    if (row.length > 0) {
      cells.push(row);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "Columns (contact)", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        ".ep-modal",
        "#lang-pref-pop-up",
        ".rsk-lightbox-container",
        "#bottom-sheet-container",
        "#nuanChatStage",
        "#nuance-chat-anchored",
        "#nuance-chat-anchored-2",
        "#nuance-chat-anchored-mobile"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header.ps-masthead",
        "footer.ps-responsive-footer",
        ".ps-rsk-breadcrumb-container",
        ".ps-fat-nav-overlay",
        ".ps-fat-nav-outer",
        ".ps-support-dropdown-overlay-container",
        ".ps-support-dropdown-overlay",
        "#containerL3Mobile",
        "#feedbackSurvey",
        ".ps-footnote",
        ".visuallyHidden",
        ".pub_300x250",
        'a.hidden[href="#skip"]',
        "iframe",
        "link",
        "noscript"
      ]);
    }
  }

  // tools/importer/transformers/sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
      const doc = element.ownerDocument || document;
      const sections = [...template.sections].reverse();
      sections.forEach((section) => {
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) return;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        const isFirst = template.sections[0].id === section.id;
        if (!isFirst) {
          const hr = doc.createElement("hr");
          sectionEl.before(hr);
        }
      });
    }
  }

  // tools/importer/import-equity-landing.js
  var parsers = {
    "hero-banner": parse,
    "columns-contact": parse2
  };
  var PAGE_TEMPLATE = {
    name: "equity-landing",
    description: "Home equity landing page with loan options and resources",
    urls: ["https://www.wellsfargo.com/equity/"],
    blocks: [
      { name: "hero-banner", instances: [".rsk-marquee-container"] },
      { name: "columns-contact", instances: [".card-container.three-card"] }
    ],
    sections: [
      { id: "section-1", name: "Hero", selector: ".rsk-marquee-container", style: null, blocks: ["hero-banner"], defaultContent: [] },
      { id: "section-2", name: "Article Body", selector: "main > .enhanced-txt-cm.text-aligned-left", style: null, blocks: [], defaultContent: [] },
      { id: "section-3", name: "CTA Banner", selector: ".card-background-gray", style: "grey", blocks: [], defaultContent: [".ps-mid-page-title", ".ps-btn-secondary"] },
      { id: "section-4", name: "Contact", selector: ".card-background-white:has(.three-card)", style: null, blocks: ["columns-contact"], defaultContent: [".ps-mid-page-title"] },
      { id: "section-5", name: "Footnotes", selector: "main > .ps-footnote", style: null, blocks: [], defaultContent: [] }
    ]
  };
  var transformers = [
    transform,
    transform2
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
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
            section: blockDef.section || null
          });
        });
      });
    });
    return pageBlocks;
  }
  var import_equity_landing_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_equity_landing_exports);
})();
