const playwright = require("playwright");
const fs = require("fs");

(async () => {
  const browser = await playwright.chromium.launch({ headless: false });
  const results = {
    velasca: {},
    local: {},
  };

  try {
    // ═══════════════════════════════════════════════════════════════════
    // STEP 1: Extract from VELASCA.COM
    // ═══════════════════════════════════════════════════════════════════

    console.log("\n🌐 Opening velasca.com...");
    const pageVelasca = await browser.newPage();
    await pageVelasca.setViewportSize({ width: 375, height: 812 });
    await pageVelasca.goto("https://www.velasca.com/", {
      waitUntil: "networkidle",
      timeout: 30000,
    });

    await pageVelasca.waitForTimeout(1500);

    // Find and click hamburger
    let hamburger = null;
    const selectors = [
      'button[aria-label*="menu" i]',
      'button[class*="Burger"]',
      'button[data-testid*="mobile"]',
    ];

    for (const selector of selectors) {
      try {
        const button = await pageVelasca.$(selector);
        if (button) {
          console.log("✅ Found hamburger:", selector);
          await button.click();
          await pageVelasca.waitForTimeout(1000);
          hamburger = button;
          break;
        }
      } catch (e) {}
    }

    // Extract root font-size
    results.velasca.rootFontSetup = await pageVelasca.evaluate(() => {
      return {
        htmlFontSize: window.getComputedStyle(document.documentElement)
          .fontSize,
        bodyFontSize: window.getComputedStyle(document.body).fontSize,
        oneRem: (() => {
          const div = document.createElement("div");
          div.style.cssText = "width:1rem;position:absolute;visibility:hidden;";
          document.body.appendChild(div);
          const w = div.getBoundingClientRect().width;
          document.body.removeChild(div);
          return w + "px";
        })(),
      };
    });

    console.log(
      "📊 Velasca root fonts:",
      JSON.stringify(results.velasca.rootFontSetup, null, 2),
    );

    // Extract main nav fonts
    results.velasca.mainNav = await pageVelasca.evaluate(() => {
      const menuTitles = document.querySelectorAll('span[class*="MenuTitle"]');
      return Array.from(menuTitles)
        .slice(0, 12)
        .map((el) => {
          const cs = window.getComputedStyle(el);
          return {
            text: el.textContent.trim().substring(0, 25),
            fontFamily: cs.fontFamily,
            fontSize: cs.fontSize,
            fontWeight: cs.fontWeight,
            fontStyle: cs.fontStyle,
            lineHeight: cs.lineHeight,
            letterSpacing: cs.letterSpacing,
            textTransform: cs.textTransform,
          };
        });
    });

    console.log(
      "📊 Velasca main nav:",
      JSON.stringify(results.velasca.mainNav, null, 2),
    );

    // Extract lower menu fonts
    results.velasca.lowerMenu = await pageVelasca.evaluate(() => {
      const items = document.querySelectorAll(
        '[class*="LowerMenuListItem"] span.text, [class*="LowerMenuTitle"] .text',
      );
      return Array.from(items)
        .slice(0, 6)
        .map((el) => {
          const cs = window.getComputedStyle(el);
          return {
            text: el.textContent.trim().substring(0, 25),
            fontFamily: cs.fontFamily,
            fontSize: cs.fontSize,
            fontWeight: cs.fontWeight,
            fontStyle: cs.fontStyle,
            lineHeight: cs.lineHeight,
            letterSpacing: cs.letterSpacing,
          };
        });
    });

    console.log(
      "📊 Velasca lower menu:",
      JSON.stringify(results.velasca.lowerMenu, null, 2),
    );

    await pageVelasca.close();

    // ═══════════════════════════════════════════════════════════════════
    // STEP 2: Extract from LOCAL SITE
    // ═══════════════════════════════════════════════════════════════════

    console.log("\n🏠 Opening local site...");
    const pageLocal = await browser.newPage();
    await pageLocal.setViewportSize({ width: 375, height: 812 });

    try {
      await pageLocal.goto("http://localhost:5500", {
        waitUntil: "networkidle",
        timeout: 15000,
      });
    } catch (e) {
      console.error("⚠️  Could not connect to localhost:5500");
      console.error("Error:", e.message);
      throw e;
    }

    await pageLocal.waitForTimeout(800);

    // Open drawer
    const localMenu = await pageLocal.$(".menu-toggle");
    if (localMenu) {
      await localMenu.click();
      await pageLocal.waitForTimeout(1000);
      console.log("✅ Drawer opened");
    }

    // Extract root font-size
    results.local.rootFontSetup = await pageLocal.evaluate(() => {
      return {
        htmlFontSize: window.getComputedStyle(document.documentElement)
          .fontSize,
        bodyFontSize: window.getComputedStyle(document.body).fontSize,
        panelFontSize: window.getComputedStyle(
          document.querySelector(".mobile-drawer__panel"),
        ).fontSize,
        oneRem: (() => {
          const div = document.createElement("div");
          div.style.cssText = "width:1rem;position:absolute;visibility:hidden;";
          document.body.appendChild(div);
          const w = div.getBoundingClientRect().width;
          document.body.removeChild(div);
          return w + "px";
        })(),
      };
    });

    console.log(
      "📊 Local root fonts:",
      JSON.stringify(results.local.rootFontSetup, null, 2),
    );

    // Extract main nav fonts
    results.local.mainNav = await pageLocal.evaluate(() => {
      const links = document.querySelectorAll(".mobile-drawer__nav a");
      return Array.from(links)
        .slice(0, 12)
        .map((el) => {
          const cs = window.getComputedStyle(el);
          return {
            text: el.textContent.trim().substring(0, 25),
            fontFamily: cs.fontFamily,
            fontSize: cs.fontSize,
            fontWeight: cs.fontWeight,
            fontStyle: cs.fontStyle,
            lineHeight: cs.lineHeight,
            letterSpacing: cs.letterSpacing,
            textTransform: cs.textTransform,
          };
        });
    });

    console.log(
      "📊 Local main nav:",
      JSON.stringify(results.local.mainNav, null, 2),
    );

    // Extract lower menu fonts
    results.local.lowerMenu = await pageLocal.evaluate(() => {
      const items = document.querySelectorAll(
        ".mobile-drawer__lower-menu a, .mobile-drawer__lower-title .text",
      );
      return Array.from(items)
        .slice(0, 6)
        .map((el) => {
          const cs = window.getComputedStyle(el);
          return {
            text: el.textContent.trim().substring(0, 25),
            fontFamily: cs.fontFamily,
            fontSize: cs.fontSize,
            fontWeight: cs.fontWeight,
            fontStyle: cs.fontStyle,
            lineHeight: cs.lineHeight,
            letterSpacing: cs.letterSpacing,
          };
        });
    });

    console.log(
      "📊 Local lower menu:",
      JSON.stringify(results.local.lowerMenu, null, 2),
    );

    await pageLocal.close();

    // ═══════════════════════════════════════════════════════════════════
    // SAVE RESULTS
    // ═══════════════════════════════════════════════════════════════════

    fs.writeFileSync(
      "drawer-fonts-comparison.json",
      JSON.stringify(results, null, 2),
    );
    console.log("\n✅ Results saved to drawer-fonts-comparison.json");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await browser.close();
  }
})();
