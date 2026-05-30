const playwright = require("playwright");
const fs = require("fs");

(async () => {
  const browser = await playwright.chromium.launch({ headless: false });

  try {
    // ═══════════════════════════════════════════════════════════════════
    // Capture LOCAL drawer screenshot
    // ═══════════════════════════════════════════════════════════════════

    console.log("\n📸 Capturing local drawer...");
    const pageLocal = await browser.newPage();
    await pageLocal.setViewportSize({ width: 375, height: 812 });

    try {
      await pageLocal.goto("http://localhost:5500", {
        waitUntil: "networkidle",
        timeout: 15000,
      });
    } catch (e) {
      console.error("❌ Could not connect to localhost:5500");
      throw e;
    }

    await pageLocal.waitForTimeout(600);

    // Open drawer
    const menuToggle = await pageLocal.$(".menu-toggle");
    if (menuToggle) {
      await menuToggle.click();
      await pageLocal.waitForTimeout(800);
      console.log("✅ Local drawer opened");
    }

    // Take screenshot
    await pageLocal.screenshot({
      path: "screenshots/local-drawer-after-fix.png",
      fullPage: false,
    });
    console.log("✅ Screenshot saved: screenshots/local-drawer-after-fix.png");

    await pageLocal.close();

    // ═══════════════════════════════════════════════════════════════════
    // Capture VELASCA drawer screenshot
    // ═══════════════════════════════════════════════════════════════════

    console.log("\n📸 Capturing velasca drawer...");
    const pageVelasca = await browser.newPage();
    await pageVelasca.setViewportSize({ width: 375, height: 812 });
    await pageVelasca.goto("https://www.velasca.com/", {
      waitUntil: "networkidle",
      timeout: 30000,
    });

    await pageVelasca.waitForTimeout(1500);

    // Find and click hamburger menu
    const buttons = await pageVelasca.$$("button");
    for (const button of buttons) {
      try {
        const ariaLabel = await button.getAttribute("aria-label");
        if (ariaLabel && ariaLabel.toLowerCase().includes("menu")) {
          console.log("✅ Found velasca menu button");
          await button.click();
          await pageVelasca.waitForTimeout(1000);
          break;
        }
      } catch (e) {}
    }

    // Take screenshot
    await pageVelasca.screenshot({
      path: "screenshots/velasca-drawer-reference.png",
      fullPage: false,
    });
    console.log(
      "✅ Screenshot saved: screenshots/velasca-drawer-reference.png",
    );

    await pageVelasca.close();

    console.log("\n✅ Screenshot comparison complete!");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await browser.close();
  }
})();
