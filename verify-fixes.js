const { chromium } = require("playwright");
const fs = require("fs");

async function verifyFixes() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log("\n========== VERIFICATION: MOBILE (375px) ==========\n");

  // Mobile Velasca
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("https://www.velasca.com/", {
    waitUntil: "networkidle",
    timeout: 30000,
  });
  await page.waitForTimeout(1000);

  const velascaMobileH2 = await page.evaluate(() => {
    const el = document.querySelector('h2[class*="SerifTitlestyles__Title"]');
    if (!el) return null;
    const cs = window.getComputedStyle(el);
    return {
      fontSize: cs.fontSize,
      marginBottom: cs.marginBottom,
    };
  });

  const velascaMobileH3 = await page.evaluate(() => {
    const elements = document.querySelectorAll(
      'h3[class*="SansTitlestyles__Title"]',
    );
    if (elements.length === 0) return null;
    const cs = window.getComputedStyle(elements[0]);
    return {
      fontSize: cs.fontSize,
      lineHeight: cs.lineHeight,
    };
  });

  console.log("Velasca Mobile (375px):");
  console.log(
    "  H2 font-size:",
    velascaMobileH2.fontSize,
    "| margin-bottom:",
    velascaMobileH2.marginBottom,
  );
  console.log(
    "  H3 font-size:",
    velascaMobileH3.fontSize,
    "| line-height:",
    velascaMobileH3.lineHeight,
  );

  // Mobile Local
  try {
    await page.goto("http://localhost:5500", {
      waitUntil: "networkidle",
      timeout: 10000,
    });
  } catch {
    await page.goto("http://localhost:3000", {
      waitUntil: "networkidle",
      timeout: 10000,
    });
  }
  await page.waitForTimeout(1000);

  const localMobileH2 = await page.evaluate(() => {
    const el =
      document.querySelector("h2") ||
      Array.from(document.querySelectorAll("h2")).find((e) =>
        e.textContent.includes("inspired"),
      );
    if (!el) return null;
    const cs = window.getComputedStyle(el);
    return {
      fontSize: cs.fontSize,
      marginBottom: cs.marginBottom,
    };
  });

  const localMobileH3 = await page.evaluate(() => {
    const elements = document.querySelectorAll("h3");
    if (elements.length === 0) return null;
    const cs = window.getComputedStyle(elements[0]);
    return {
      fontSize: cs.fontSize,
      lineHeight: cs.lineHeight,
    };
  });

  console.log("\nLocal Mobile (375px):");
  console.log(
    "  H2 font-size:",
    localMobileH2.fontSize,
    "| margin-bottom:",
    localMobileH2.marginBottom,
  );
  console.log(
    "  H3 font-size:",
    localMobileH3.fontSize,
    "| line-height:",
    localMobileH3.lineHeight,
  );

  const mobileH2Match =
    velascaMobileH2.fontSize === localMobileH2.fontSize &&
    velascaMobileH2.marginBottom === localMobileH2.marginBottom;
  const mobileH3Match =
    velascaMobileH3.fontSize === localMobileH3.fontSize &&
    velascaMobileH3.lineHeight === localMobileH3.lineHeight;

  console.log("\n  H2 Match:", mobileH2Match ? "✓ YES" : "❌ NO");
  console.log("  H3 Match:", mobileH3Match ? "✓ YES" : "❌ NO");

  // Tablet verification
  console.log("\n\n========== VERIFICATION: TABLET (768px) ==========\n");

  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("https://www.velasca.com/", {
    waitUntil: "networkidle",
    timeout: 30000,
  });
  await page.waitForTimeout(1000);

  const velascaTabletH2 = await page.evaluate(() => {
    const el = document.querySelector('h2[class*="SerifTitlestyles__Title"]');
    if (!el) return null;
    const cs = window.getComputedStyle(el);
    return {
      fontSize: cs.fontSize,
      marginBottom: cs.marginBottom,
    };
  });

  const velascaTabletH3 = await page.evaluate(() => {
    const elements = document.querySelectorAll(
      'h3[class*="SansTitlestyles__Title"]',
    );
    if (elements.length === 0) return null;
    const cs = window.getComputedStyle(elements[0]);
    return {
      fontSize: cs.fontSize,
      lineHeight: cs.lineHeight,
    };
  });

  console.log("Velasca Tablet (768px):");
  console.log(
    "  H2 font-size:",
    velascaTabletH2.fontSize,
    "| margin-bottom:",
    velascaTabletH2.marginBottom,
  );
  console.log(
    "  H3 font-size:",
    velascaTabletH3.fontSize,
    "| line-height:",
    velascaTabletH3.lineHeight,
  );

  // Tablet Local
  await page.setViewportSize({ width: 768, height: 1024 });
  try {
    await page.goto("http://localhost:5500", {
      waitUntil: "networkidle",
      timeout: 10000,
    });
  } catch {
    await page.goto("http://localhost:3000", {
      waitUntil: "networkidle",
      timeout: 10000,
    });
  }
  await page.waitForTimeout(1000);

  const localTabletH2 = await page.evaluate(() => {
    const el =
      document.querySelector("h2") ||
      Array.from(document.querySelectorAll("h2")).find((e) =>
        e.textContent.includes("inspired"),
      );
    if (!el) return null;
    const cs = window.getComputedStyle(el);
    return {
      fontSize: cs.fontSize,
      marginBottom: cs.marginBottom,
    };
  });

  const localTabletH3 = await page.evaluate(() => {
    const elements = document.querySelectorAll("h3");
    if (elements.length === 0) return null;
    const cs = window.getComputedStyle(elements[0]);
    return {
      fontSize: cs.fontSize,
      lineHeight: cs.lineHeight,
    };
  });

  console.log("\nLocal Tablet (768px):");
  console.log(
    "  H2 font-size:",
    localTabletH2.fontSize,
    "| margin-bottom:",
    localTabletH2.marginBottom,
  );
  console.log(
    "  H3 font-size:",
    localTabletH3.fontSize,
    "| line-height:",
    localTabletH3.lineHeight,
  );

  const tabletH2Match =
    velascaTabletH2.fontSize === localTabletH2.fontSize &&
    velascaTabletH2.marginBottom === localTabletH2.marginBottom;
  const tabletH3Match =
    velascaTabletH3.fontSize === localTabletH3.fontSize &&
    velascaTabletH3.lineHeight === localTabletH3.lineHeight;

  console.log("\n  H2 Match:", tabletH2Match ? "✓ YES" : "❌ NO");
  console.log("  H3 Match:", tabletH3Match ? "✓ YES" : "❌ NO");

  // Summary
  console.log("\n\n========== SUMMARY ==========");
  if (mobileH2Match && mobileH3Match && tabletH2Match && tabletH3Match) {
    console.log("✓ ALL FIXES VERIFIED - Your site now matches velasca.com!");
  } else {
    console.log("⚠ Some issues remain - see details above");
  }

  await browser.close();
}

verifyFixes().catch(console.error);
