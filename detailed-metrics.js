const playwright = require("playwright");

(async () => {
  const browser = await playwright.chromium.launch({ headless: false });

  try {
    // ═══════════════════════════════════════════════════════════════════
    // Capture LOCAL drawer with scrolling
    // ═══════════════════════════════════════════════════════════════════

    console.log("\n📸 Capturing local drawer content...");
    const pageLocal = await browser.newPage();
    await pageLocal.setViewportSize({ width: 375, height: 812 });

    await pageLocal.goto("http://localhost:5500", {
      waitUntil: "networkidle",
      timeout: 15000,
    });
    await pageLocal.waitForTimeout(600);

    // Open drawer
    const menuToggle = await pageLocal.$(".menu-toggle");
    if (menuToggle) {
      await menuToggle.click();
      await pageLocal.waitForTimeout(1000);
      console.log("✅ Local drawer opened");

      // Wait for drawer animation to complete and menu to render
      await pageLocal.waitForTimeout(500);

      // Get drawer panel element and screenshot it
      const drawerPanel = await pageLocal.$(".mobile-drawer__panel");
      if (drawerPanel) {
        const box = await drawerPanel.boundingBox();
        console.log("Drawer panel bounds:", box);

        // Take full page screenshot
        await pageLocal.screenshot({
          path: "screenshots/local-drawer-content.png",
        });
        console.log("✅ Local drawer screenshot saved");
      }
    }

    await pageLocal.close();

    // ═══════════════════════════════════════════════════════════════════
    // Extract specific font metrics from both
    // ═══════════════════════════════════════════════════════════════════

    console.log("\n🔍 Extracting detailed metrics...");

    // Get exact pixel measurements from local
    const pageLocal2 = await browser.newPage();
    await pageLocal2.setViewportSize({ width: 375, height: 812 });
    await pageLocal2.goto("http://localhost:5500", {
      waitUntil: "networkidle",
      timeout: 15000,
    });
    await pageLocal2.waitForTimeout(600);

    const menuToggle2 = await pageLocal2.$(".menu-toggle");
    if (menuToggle2) {
      await menuToggle2.click();
      await pageLocal2.waitForTimeout(1000);

      const metrics = await pageLocal2.evaluate(() => {
        const items = [];

        // Main nav items
        const navLinks = document.querySelectorAll(".mobile-drawer__nav a");
        navLinks.forEach((link, i) => {
          if (i < 5) {
            const title = link.querySelector(".mobile-drawer__menu-title");
            if (title) {
              const cs = window.getComputedStyle(title);
              items.push({
                type: "main_nav",
                text: title.textContent.trim(),
                computed: {
                  fontSize: cs.fontSize,
                  fontWeight: cs.fontWeight,
                  lineHeight: cs.lineHeight,
                  letterSpacing: cs.letterSpacing,
                  textTransform: cs.textTransform,
                  fontStyle: cs.fontStyle,
                  fontFamily: cs.fontFamily,
                },
              });
            }
          }
        });

        // Lower menu items
        const lowerMenu = document.querySelectorAll(
          ".mobile-drawer__lower-menu a",
        );
        lowerMenu.forEach((link, i) => {
          if (i < 3) {
            const cs = window.getComputedStyle(link);
            items.push({
              type: "lower_menu",
              text: link.textContent.trim().substring(0, 20),
              computed: {
                fontSize: cs.fontSize,
                fontWeight: cs.fontWeight,
                lineHeight: cs.lineHeight,
                letterSpacing: cs.letterSpacing,
              },
            });
          }
        });

        return items;
      });

      console.log("\n📊 LOCAL DRAWER METRICS:");
      console.log(JSON.stringify(metrics, null, 2));
    }

    await pageLocal2.close();
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await browser.close();
  }
})();
