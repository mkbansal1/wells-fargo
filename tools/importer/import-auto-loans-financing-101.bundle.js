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

  // tools/importer/import-auto-loans-financing-101.js
  var import_auto_loans_financing_101_exports = {};
  __export(import_auto_loans_financing_101_exports, {
    default: () => import_auto_loans_financing_101_default
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

  // tools/importer/parsers/cards.js
  function parse2(element, { document }) {
    const cells = [];
    cells.push(["Cards"]);
    const items = element.querySelectorAll(".enhanced-txt-cm");
    items.forEach((item) => {
      const img = item.querySelector("img");
      const heading = item.querySelector(".title2-SemiBold");
      const description = item.querySelector(".subheadline-regular");
      const link = item.querySelector(".enhanced-txt-body a");
      const contentCell = document.createElement("div");
      if (heading) {
        const h3 = document.createElement("h3");
        h3.textContent = heading.textContent;
        contentCell.append(h3);
      }
      if (description) {
        const p = document.createElement("p");
        p.textContent = description.textContent;
        contentCell.append(p);
      }
      if (link) {
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = link.textContent;
        contentCell.append(a);
      }
      if (img) {
        const picture = document.createElement("picture");
        const imgEl = document.createElement("img");
        imgEl.src = img.src;
        imgEl.alt = img.alt || "";
        picture.append(imgEl);
        cells.push([picture, contentCell]);
      } else {
        cells.push([contentCell]);
      }
    });
    const block = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-icon.js
  function parse3(element, { document }) {
    const cells = [];
    const items = element.querySelectorAll(".ps-marketing-small-promo-item");
    items.forEach((item) => {
      const icon = item.querySelector(".ps-marketing-icon img");
      const textContainer = item.querySelector(".ps-marketing-text");
      const contentCell = [];
      if (textContainer) {
        const heading = textContainer.querySelector("h3");
        if (heading) {
          contentCell.push(heading);
        }
        const description = textContainer.querySelector(".ps-marketing-text-content");
        if (description) {
          contentCell.push(description);
        }
        const link = item.querySelector(".ps-marketing-promo-link a, .learn-more-mobile a");
        if (link) {
          contentCell.push(link);
        }
      }
      if (icon || contentCell.length > 0) {
        cells.push([icon || "", contentCell.length > 0 ? contentCell : ""]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "Cards (icon)", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse4(element, { document }) {
    const cells = [];
    const summary = element.querySelector("summary");
    let questionText = "";
    if (summary) {
      const titleLink = summary.querySelector(".show-hide-title-text a");
      const titleSpan = summary.querySelector(".show-hide-title-text .hidden");
      if (titleLink) {
        questionText = titleLink.textContent.trim();
      } else if (titleSpan) {
        questionText = titleSpan.textContent.trim();
      } else {
        questionText = summary.textContent.trim();
      }
    }
    const answerContainer = element.querySelector(".show-hide-content-text-wrapper-collapsible");
    if (questionText || answerContainer) {
      cells.push([questionText || "", answerContainer || ""]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-promo.js
  function parse5(element, { document }) {
    const cells = [];
    cells.push(["Columns (promo)"]);
    const img = element.querySelector(".ps-promo-full-image img");
    const heading = element.querySelector(".ps-promo-full-content h2");
    const description = element.querySelector(".ps-promo-full-content p");
    const link = element.querySelector(".ps-promo-full-links a");
    const leftCol = document.createElement("div");
    if (img) {
      const picture = document.createElement("picture");
      const imgEl = document.createElement("img");
      imgEl.src = img.src;
      imgEl.alt = img.alt || "";
      picture.append(imgEl);
      leftCol.append(picture);
    }
    const rightCol = document.createElement("div");
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent;
      rightCol.append(h2);
    }
    if (description) {
      const p = document.createElement("p");
      p.textContent = description.textContent;
      rightCol.append(p);
    }
    if (link) {
      const a = document.createElement("a");
      a.href = link.href || "#";
      a.textContent = link.textContent;
      rightCol.append(a);
    }
    cells.push([leftCol, rightCol]);
    const block = WebImporter.DOMUtils.createTable(cells, document);
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

  // tools/importer/import-auto-loans-financing-101.js
  var parsers = {
    "hero-banner": parse,
    "cards": parse2,
    "cards-icon": parse3,
    "accordion-faq": parse4,
    "columns-promo": parse5
  };
  var PAGE_TEMPLATE = {
    name: "auto-loans-financing-101",
    description: "Auto loans vehicle financing guide page with educational content",
    urls: ["https://www.wellsfargo.com/auto-loans/vehicle-financing-101/"],
    blocks: [
      { name: "hero-banner", instances: [".rsk-marquee-container"] },
      { name: "accordion-faq", instances: ["details.show-hide-content-wrapper", ".ps-responsive-tab details.tab-mobile-item"] },
      { name: "columns-promo", instances: [".ps-large-promo-full-container"] },
      { name: "cards", instances: [".card-container.three-card"] },
      { name: "cards-icon", instances: [".ps-marketing-small-promo-items"] }
    ],
    sections: [
      { id: "section-1", name: "Hero", selector: ".rsk-marquee-container", style: null, blocks: ["hero-banner"], defaultContent: [] },
      { id: "section-2", name: "What to Know", selector: "main > .ps-responsive-tab:nth-of-type(1)", style: null, blocks: ["accordion-faq"], defaultContent: [".ps-mid-page-title"] },
      { id: "section-3", name: "Credit Approval", selector: ".ps-large-promo-full-container", style: null, blocks: ["columns-promo"], defaultContent: [".ps-mid-page-title"] },
      { id: "section-4", name: "Before You Buy", selector: ".card-container.three-card", style: null, blocks: ["cards"], defaultContent: [".ps-mid-page-title"] },
      { id: "section-5", name: "Evaluate Vehicles", selector: "main > .ps-responsive-tab:nth-of-type(2)", style: null, blocks: ["accordion-faq"], defaultContent: [".ps-mid-page-title"] },
      { id: "section-6", name: "FAQ", selector: "main > .card-background-white:has(+ details)", style: null, blocks: ["accordion-faq"], defaultContent: [".ps-mid-page-title", ".ps-btn-secondary"] },
      { id: "section-7", name: "Resources", selector: ".ps-marketing-small-promo-items", style: null, blocks: ["cards-icon"], defaultContent: [".ps-mid-page-title"] },
      { id: "section-8", name: "Footnotes", selector: "main > .ps-footnote", style: null, blocks: [], defaultContent: [] }
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
  var import_auto_loans_financing_101_default = {
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
  return __toCommonJS(import_auto_loans_financing_101_exports);
})();
