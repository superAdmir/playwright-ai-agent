// tools/playwrightTools.js
const { chromium } = require('playwright');

let browser, context, page;

// ===== INIT & CLOSE =====
async function init() {
  browser = await chromium.launch({ headless: false });
  context = await browser.newContext();
  page = await context.newPage();
  console.log('🌐 Browser launched');
}

async function close() {
  await page.close();
  await context.close();
  await browser.close();
  console.log('🌐 Browser closed');
}

// ===== SELF-HEALING LOCATOR FUNCTION =====
async function findElement(selector, options = {}) {
  const { alternatives = [] } = options;

  // Try primary selector first
  if (await page.locator(selector).count() > 0) {
    return page.locator(selector);
  }

  // Try alternatives
  for (const alt of alternatives) {
    if (await page.locator(alt).count() > 0) {
      console.warn(`⚠️ Self-healing: Using alternative selector "${alt}" instead of "${selector}"`);
      return page.locator(alt);
    }
  }

  // Optional: fallback using text matching
  const textLocator = page.locator(`text=${selector}`);
  if (await textLocator.count() > 0) {
    console.warn(`⚠️ Self-healing: Using text locator "text=${selector}"`);
    return textLocator;
  }

  throw new Error(`❌ Element not found: ${selector}`);
}

// ===== TOOL FUNCTIONS =====
async function navigate({ url }) {
  console.log(`➡️ Navigating to ${url}`);
  await page.goto(url);
  return `Navigated to ${url}`;
}

async function click({ selector, alternatives }) {
  const element = await findElement(selector, { alternatives });
  await element.click();
  return `Clicked element "${selector}"`;
}

async function type({ selector, text, alternatives }) {
  const element = await findElement(selector, { alternatives });
  await element.fill(text);
  return `Typed "${text}" into "${selector}"`;
}

async function getDOM() {
  const content = await page.content();
  return content;
}

async function screenshot({ path = `tmp/screenshot-${Date.now()}.png` } = {}) {
  await page.screenshot({ path });
  return `Screenshot saved in ${path}`;
}

module.exports = {
  init,
  close,
  navigate,
  click,
  type,
  getDOM,
  screenshot,
};