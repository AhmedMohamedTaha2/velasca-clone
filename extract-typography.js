const { chromium } = require("playwright");
const fs = require("fs");

const VIEWPORTS = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];

async function extractFromVelasca() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const results = {
    velasca: {},
    local: {},
  };

  // ============ VELASCA.COM EXTRACTION ============
  console.log("\n========== EXTRACTING FROM VELASCA.COM ==========\n");

  for (const vp of VIEWPORTS) {
    console.log(`\n--- Velasca at ${vp.name} (${vp.width}x${vp.height}) ---`);

    await page.setViewportSize({ width: vp.width, height: vp.height });

    try {
      await page.goto("https://www.velasca.com/", {
        waitUntil: "networkidle",
        timeout: 30000,
      });
      await page.waitForTimeout(2000);

      // Extract H2 "Get inspired"
      const h2Data = await page.evaluate(() => {
        const el = document.querySelector(
          'h2[class*="SerifTitlestyles__Title"]',
        );
        if (!el) return null;
        const cs = window.getComputedStyle(el);
        return {
          text: el.textContent.trim(),
          fontFamily: cs.fontFamily,
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          lineHeight: cs.lineHeight,
          letterSpacing: cs.letterSpacing,
          color: cs.color,
          textTransform: cs.textTransform,
          marginTop: cs.marginTop,
          marginBottom: cs.marginBottom,
          marginLeft: cs.marginLeft,
          marginRight: cs.marginRight,
          paddingTop: cs.paddingTop,
          paddingBottom: cs.paddingBottom,
          paddingLeft: cs.paddingLeft,
          paddingRight: cs.paddingRight,
          display: cs.display,
          textAlign: cs.textAlign,
        };
      });

      if (h2Data) {
        console.log('✓ H2 "Get inspired" found');
        console.log("  Font-size:", h2Data.fontSize);
        console.log("  Font-weight:", h2Data.fontWeight);
        console.log("  Line-height:", h2Data.lineHeight);
        console.log("  Letter-spacing:", h2Data.letterSpacing);
        results.velasca[`h2_${vp.name}`] = h2Data;
      } else {
        console.log('✗ H2 "Get inspired" not found');
      }

      // Extract H3 category titles
      const h3Data = await page.evaluate(() => {
        const elements = document.querySelectorAll(
          'h3[class*="SansTitlestyles__Title"]',
        );
        return Array.from(elements)
          .slice(0, 1)
          .map((el) => {
            const cs = window.getComputedStyle(el);
            return {
              text: el.textContent.trim(),
              fontFamily: cs.fontFamily,
              fontSize: cs.fontSize,
              fontWeight: cs.fontWeight,
              lineHeight: cs.lineHeight,
              letterSpacing: cs.letterSpacing,
              color: cs.color,
              textTransform: cs.textTransform,
              marginTop: cs.marginTop,
              marginBottom: cs.marginBottom,
              marginLeft: cs.marginLeft,
              marginRight: cs.marginRight,
              paddingTop: cs.paddingTop,
              paddingBottom: cs.paddingBottom,
              textDecoration: cs.textDecoration,
            };
          });
      });

      if (h3Data.length > 0) {
        console.log(`✓ H3 category titles found (${h3Data.length} elements)`);
        console.log("  Font-size:", h3Data[0].fontSize);
        console.log("  Font-weight:", h3Data[0].fontWeight);
        console.log("  Line-height:", h3Data[0].lineHeight);
        console.log("  Letter-spacing:", h3Data[0].letterSpacing);
        results.velasca[`h3_${vp.name}`] = h3Data[0];
      } else {
        console.log("✗ H3 category titles not found");
      }

      // Extract container padding
      const containerData = await page.evaluate(() => {
        const container =
          document.querySelector('div[class*="CategoriesGrid"]') ||
          document.querySelector('section[class*="CategoriesGrid"]') ||
          document.querySelector('[class*="CollectionCard"]').parentElement;
        if (!container) return null;
        const cs = window.getComputedStyle(container);
        return {
          paddingTop: cs.paddingTop,
          paddingBottom: cs.paddingBottom,
          paddingLeft: cs.paddingLeft,
          paddingRight: cs.paddingRight,
          marginTop: cs.marginTop,
          marginBottom: cs.marginBottom,
        };
      });

      if (containerData) {
        console.log("✓ Container padding found");
        console.log("  Padding-top:", containerData.paddingTop);
        console.log("  Padding-bottom:", containerData.paddingBottom);
        results.velasca[`container_${vp.name}`] = containerData;
      }
    } catch (error) {
      console.log("✗ Error extracting from velasca.com:", error.message);
    }
  }

  // ============ LOCAL SITE EXTRACTION ============
  console.log("\n\n========== EXTRACTING FROM LOCAL SITE ==========\n");

  for (const vp of VIEWPORTS) {
    console.log(`\n--- Local at ${vp.name} (${vp.width}x${vp.height}) ---`);

    await page.setViewportSize({ width: vp.width, height: vp.height });

    try {
      // Try common local server ports
      let url = "http://localhost:5500";
      try {
        await page.goto(url, { waitUntil: "networkidle", timeout: 10000 });
      } catch {
        url = "http://localhost:3000";
        await page.goto(url, { waitUntil: "networkidle", timeout: 10000 });
      }

      await page.waitForTimeout(1000);

      // Extract H2 "Get inspired"
      const h2Data = await page.evaluate(() => {
        const el =
          document.querySelector("h2") ||
          document.querySelector('[class*="inspired"]') ||
          Array.from(document.querySelectorAll("h2")).find((e) =>
            e.textContent.includes("inspired"),
          );
        if (!el) return null;
        const cs = window.getComputedStyle(el);
        return {
          text: el.textContent.trim(),
          fontFamily: cs.fontFamily,
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          lineHeight: cs.lineHeight,
          letterSpacing: cs.letterSpacing,
          color: cs.color,
          textTransform: cs.textTransform,
          marginTop: cs.marginTop,
          marginBottom: cs.marginBottom,
          marginLeft: cs.marginLeft,
          marginRight: cs.marginRight,
          paddingTop: cs.paddingTop,
          paddingBottom: cs.paddingBottom,
          paddingLeft: cs.paddingLeft,
          paddingRight: cs.paddingRight,
          display: cs.display,
          textAlign: cs.textAlign,
        };
      });

      if (h2Data) {
        console.log('✓ H2 "Get inspired" found');
        console.log("  Font-size:", h2Data.fontSize);
        console.log("  Font-weight:", h2Data.fontWeight);
        console.log("  Line-height:", h2Data.lineHeight);
        console.log("  Letter-spacing:", h2Data.letterSpacing);
        results.local[`h2_${vp.name}`] = h2Data;
      } else {
        console.log('✗ H2 "Get inspired" not found');
      }

      // Extract H3 category titles
      const h3Data = await page.evaluate(() => {
        const elements = document.querySelectorAll("h3");
        return Array.from(elements)
          .slice(0, 1)
          .map((el) => {
            const cs = window.getComputedStyle(el);
            return {
              text: el.textContent.trim(),
              fontFamily: cs.fontFamily,
              fontSize: cs.fontSize,
              fontWeight: cs.fontWeight,
              lineHeight: cs.lineHeight,
              letterSpacing: cs.letterSpacing,
              color: cs.color,
              textTransform: cs.textTransform,
              marginTop: cs.marginTop,
              marginBottom: cs.marginBottom,
              marginLeft: cs.marginLeft,
              marginRight: cs.marginRight,
              paddingTop: cs.paddingTop,
              paddingBottom: cs.paddingBottom,
              textDecoration: cs.textDecoration,
            };
          });
      });

      if (h3Data.length > 0) {
        console.log(`✓ H3 category titles found (${h3Data.length} elements)`);
        console.log("  Font-size:", h3Data[0].fontSize);
        console.log("  Font-weight:", h3Data[0].fontWeight);
        console.log("  Line-height:", h3Data[0].lineHeight);
        console.log("  Letter-spacing:", h3Data[0].letterSpacing);
        results.local[`h3_${vp.name}`] = h3Data[0];
      }
    } catch (error) {
      console.log("✗ Error extracting from local site:", error.message);
    }
  }

  await browser.close();

  // Save results
  fs.writeFileSync(
    "typography-extraction.json",
    JSON.stringify(results, null, 2),
  );
  console.log("\n✓ Results saved to typography-extraction.json\n");

  return results;
}

extractFromVelasca().catch(console.error);
