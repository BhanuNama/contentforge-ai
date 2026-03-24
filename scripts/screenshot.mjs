import puppeteer from "puppeteer";
import { mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "../screenshots");
mkdirSync(outDir, { recursive: true });

const PAGES = [
  { name: "landing", url: "http://localhost:3000", fullPage: true },
  { name: "landing-features", url: "http://localhost:3000", fullPage: true, scrollY: 800 },
  { name: "landing-pricing", url: "http://localhost:3000", fullPage: true, scrollY: 2200 },
  { name: "sign-up", url: "http://localhost:3000/sign-up", fullPage: false },
  { name: "sign-in", url: "http://localhost:3000/sign-in", fullPage: false },
];

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--force-dark-mode"],
  defaultViewport: { width: 1440, height: 900 },
});

for (const page of PAGES) {
  const tab = await browser.newPage();

  // Set dark mode preference
  await tab.emulateMediaFeatures([{ name: "prefers-color-scheme", value: "dark" }]);

  // Add dark class to html before page load
  await tab.evaluateOnNewDocument(() => {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  });

  await tab.goto(page.url, { waitUntil: "networkidle2", timeout: 15000 });
  await new Promise((r) => setTimeout(r, 1500));

  // Force dark mode after load
  await tab.evaluate(() => {
    document.documentElement.classList.add("dark");
  });
  await new Promise((r) => setTimeout(r, 300));

  if (page.scrollY) {
    await tab.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), page.scrollY);
    await new Promise((r) => setTimeout(r, 400));
  }

  const path = join(outDir, `${page.name}.png`);
  await tab.screenshot({
    path,
    fullPage: page.fullPage && !page.scrollY,
    clip: page.scrollY ? { x: 0, y: page.scrollY, width: 1440, height: 900 } : undefined,
  });

  console.log(`✅ ${page.name} → ${path}`);
  await tab.close();
}

await browser.close();
console.log("\nAll screenshots saved to ./screenshots/");
