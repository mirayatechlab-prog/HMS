import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const BASE_URL = process.env.PREVIEW_URL || 'http://localhost:5173';
const PROD_URL = process.env.PROD_PREVIEW_URL || 'http://localhost:4173';
const SCREENSHOT_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../docs/reports/phase-0a/screenshots',
);

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

const ROUTES = [
  { path: '/previews/command-center', name: '01-command-center', heading: 'Hospital Command Center' },
  { path: '/previews/infrastructure', name: '02-infrastructure', heading: 'Dynamic Hospital Infrastructure' },
  { path: '/previews/bed-board', name: '03-bed-board', heading: 'Live Bed Board' },
  { path: '/previews/reception', name: '04-reception', heading: 'Reception Workspace' },
  { path: '/previews/doctor', name: '05-doctor', heading: 'Doctor Consultation Workspace' },
  { path: '/previews/pharmacy', name: '06-pharmacy', heading: 'In-House Pharmacy Workspace' },
  { path: '/previews/laboratory', name: '07-laboratory', heading: 'External Laboratory & Sample Collection' },
  { path: '/previews/setup-wizard', name: '08-setup-wizard', heading: 'Hospital Setup Wizard' },
  { path: '/previews/design-system', name: '09-design-system', heading: 'MediCore Design System Gallery' },
];

const VIEWPORTS = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'laptop-1280', width: 1280, height: 800 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'mobile-390', width: 390, height: 844 },
];

async function run() {
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });

  const report = {
    routesChecked: [],
    viewportOverflowChecks: [],
    interactions: {},
    a11yChecks: [],
    productionGateChecks: [],
    consoleErrors: [],
    pageErrors: [],
  };

  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        report.consoleErrors.push(msg.text());
      }
    });
    page.on('pageerror', (err) => {
      report.pageErrors.push(err.message);
    });

    // 1. Check all 9 routes on Desktop 1440x900 + capture screenshots + basic a11y checks
    for (const r of ROUTES) {
      await page.goto(`${BASE_URL}${r.path}`, { waitUntil: 'networkidle' });
      await page.getByRole('heading', { name: new RegExp(r.heading, 'i') }).waitFor({ timeout: 10000 });
      const bannerVisible = await page
        .getByText(/PHASE 0 DEMONSTRATION PREVIEW/i)
        .isVisible();

      const a11y = await page.evaluate(() => {
        const hasMain = Boolean(document.querySelector('main'));
        const hasNav = Boolean(document.querySelector('nav'));
        const h1Count = document.querySelectorAll('h1').length;
        const overflow = document.documentElement.scrollWidth > window.innerWidth;
        const brokenImages = Array.from(document.querySelectorAll('img')).filter(
          (img) => !img.complete || img.naturalWidth === 0,
        ).length;
        return { hasMain, hasNav, h1Count, overflow, brokenImages };
      });

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, `${r.name}-desktop.png`),
        fullPage: false,
      });

      report.routesChecked.push({ route: r.path, bannerVisible, ...a11y });
      report.a11yChecks.push({ route: r.path, ...a11y });
    }

    // 2. Check responsive viewports (laptop, tablet, mobile) on key routes
    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      for (const r of [ROUTES[0], ROUTES[1], ROUTES[2], ROUTES[7]]) {
        await page.goto(`${BASE_URL}${r.path}`, { waitUntil: 'networkidle' });
        await page.getByRole('heading', { name: new RegExp(r.heading, 'i') }).waitFor();
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > window.innerWidth,
        );
        report.viewportOverflowChecks.push({ viewport: vp.name, route: r.path, overflow });
      }
    }
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `01-command-center-mobile-390.png`),
      fullPage: false,
    });

    // 3. Exercise dynamic infrastructure interactions (0 beds -> 30 beds -> add room -> remove bed)
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/previews/infrastructure`, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: '0 Beds', exact: true }).click();
    await page.getByText(/Zero beds configured/i).waitFor();
    const zeroTextVisible = await page.getByText(/Zero beds configured/i).isVisible();

    await page.getByRole('button', { name: '30 Beds', exact: true }).click();
    await page.getByText(/Configured Individual Beds \(30\)/i).waitFor();

    await page.getByLabel('Room number').fill('401');
    await page.getByLabel('Beds in room').fill('3');
    await page.getByRole('button', { name: 'Room' }).click();
    await page.getByText(/Configured Individual Beds \(33\)/i).waitFor();

    await page.getByRole('button', { name: 'Remove bed 401-B1' }).click();
    await page.getByText(/Configured Individual Beds \(32\)/i).waitFor();
    report.interactions.dynamicInfrastructure = {
      zeroBedEmptyState: zeroTextVisible,
      afterAddRoom: 33,
      afterRemoveBed: 32,
    };

    // 4. Exercise Setup Wizard navigation & Design System dialog + keyboard Escape
    await page.goto(`${BASE_URL}/previews/setup-wizard`, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Next' }).click();
    const wizardStep2Visible = await page.getByText('Step 2 of 9').isVisible();
    report.interactions.setupWizardStep2 = wizardStep2Visible;

    await page.goto(`${BASE_URL}/previews/design-system`, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Open Modal Dialog' }).click();
    const dialogVisible = await page.getByRole('dialog').isVisible();
    await page.keyboard.press('Escape');
    const dialogClosed = !(await page.getByRole('dialog').isVisible());
    report.interactions.designSystemDialog = { dialogVisible, dialogClosed };

    // 5. Verify Production Build Preview Gate (even with direct URL access)
    for (const r of ['/previews/command-center', '/previews/infrastructure', '/previews/bed-board']) {
      await page.goto(`${PROD_URL}${r}`, { waitUntil: 'networkidle' });
      const fallbackVisible = await page
        .getByText('Phase 0 demonstration previews are disabled in production builds.')
        .isVisible();
      const demoBannerPresent = await page
        .getByText('PHASE 0 DEMONSTRATION PREVIEW — Fictional data only.')
        .count();
      report.productionGateChecks.push({
        route: r,
        fallbackVisible,
        demoBannerPresent,
      });
    }
  } finally {
    await browser.close();
  }

  console.log(JSON.stringify(report, null, 2));
  if (report.consoleErrors.length > 0 || report.pageErrors.length > 0) {
    process.exitCode = 1;
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
