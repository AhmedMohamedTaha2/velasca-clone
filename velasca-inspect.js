const playwright = require("playwright");

(async () => {
  const browser = await playwright.chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Set viewport and open velasca
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("https://www.velasca.com/", {
      waitUntil: "networkidle",
      timeout: 30000,
    });

    // Wait a bit and try clicking hamburger
    await page.waitForTimeout(2000);

    // First, let's see what buttons exist
    const buttons = await page.$$("button");
    console.log(`Found ${buttons.length} buttons`);

    // Try to find the menu button by looking for aria-label or class containing "menu"
    for (let i = 0; i < Math.min(5, buttons.length); i++) {
      const ariaLabel = await buttons[i].getAttribute("aria-label");
      const classes = await buttons[i].getAttribute("class");
      console.log(
        `Button ${i}: aria-label="${ariaLabel}", classes="${classes}"`,
      );

      if (ariaLabel && ariaLabel.toLowerCase().includes("menu")) {
        console.log(`✅ Found menu button at index ${i}, clicking...`);
        await buttons[i].click();
        await page.waitForTimeout(1500);
        break;
      }
    }

    // Now try to find the drawer/menu content
    console.log("\n🔍 Looking for drawer structure...");

    const panelContent = await page.evaluate(() => {
      // Try various selectors for the drawer panel
      const results = {};

      // Look for any divs with role="navigation" or containing menu items
      const nav = document.querySelector('nav[role="navigation"]');
      if (nav) {
        results.navigation = 'Found nav with role="navigation"';
      }

      // Look for elements with MenuTitle in class
      const menuTitles = document.querySelectorAll('[class*="MenuTitle"]');
      results.menuTitleCount = menuTitles.length;
      if (menuTitles.length > 0) {
        results.menuTitleSample = Array.from(menuTitles)
          .slice(0, 3)
          .map((el) => ({
            text: el.textContent.trim().substring(0, 20),
            classes: el.className.substring(0, 100),
          }));
      }

      // Look for elements with LowerMenu in class
      const lowerMenuItems = document.querySelectorAll('[class*="LowerMenu"]');
      results.lowerMenuCount = lowerMenuItems.length;

      // Look for all spans
      const allSpans = document.querySelectorAll("span");
      const capitalizedSpans = Array.from(allSpans).filter((s) =>
        /^[A-Z]/.test(s.textContent),
      );
      results.capitalSpanCount = capitalizedSpans.length;

      return results;
    });

    console.log(JSON.stringify(panelContent, null, 2));

    // Try to extract fonts from whatever we can find
    const fontData = await page.evaluate(() => {
      const results = {
        mainNav: [],
        lowerMenu: [],
      };

      // Get everything with "MenuTitle" class
      const allMenuTitles = document.querySelectorAll('[class*="MenuTitle"]');
      allMenuTitles.forEach((el, i) => {
        if (i < 10) {
          const cs = window.getComputedStyle(el);
          results.mainNav.push({
            text: el.textContent.trim().substring(0, 20),
            fontSize: cs.fontSize,
            fontWeight: cs.fontWeight,
            fontFamily: cs.fontFamily,
            fontStyle: cs.fontStyle,
            lineHeight: cs.lineHeight,
            letterSpacing: cs.letterSpacing,
            textTransform: cs.textTransform,
          });
        }
      });

      // Get everything with "LowerMenu" class that contains text
      const allLowerMenu = document.querySelectorAll('[class*="LowerMenu"] *');
      allLowerMenu.forEach((el, i) => {
        if (
          i < 8 &&
          el.textContent.trim().length > 2 &&
          el.textContent.trim().length < 30
        ) {
          const cs = window.getComputedStyle(el);
          const existing = results.lowerMenu.some(
            (r) => r.text === el.textContent.trim(),
          );
          if (!existing) {
            results.lowerMenu.push({
              text: el.textContent.trim(),
              fontSize: cs.fontSize,
              fontWeight: cs.fontWeight,
              fontFamily: cs.fontFamily,
              fontStyle: cs.fontStyle,
              lineHeight: cs.lineHeight,
              letterSpacing: cs.letterSpacing,
            });
          }
        }
      });

      return results;
    });

    console.log("\n📊 Extracted fonts:");
    console.log(JSON.stringify(fontData, null, 2));
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    // Keep browser open for 30 seconds so we can see the page
    await page.waitForTimeout(30000);
    await browser.close();
  }
})();
