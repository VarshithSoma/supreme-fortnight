const puppeteer = require("puppeteer");
const fs = require("fs");

async function scrapeAndSave() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
    ],
  });

  try {
    const page = await browser.newPage();

    // Spoof user agent and remove webdriver flag
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "webdriver", {
        get: () => false,
      });
    });

    console.log("Navigating to LeetCode contests page...");
    await page.goto("https://leetcode.com/contest/", {
      waitUntil: "domcontentloaded",
      timeout: 0,
    });

    await page.waitForSelector("div.flex.items-center", { timeout: 10000 });

    console.log("Extracting contest data...");
    const data = await page.evaluate(() => {
      const contestElements = document.querySelectorAll(
        "div.flex.items-center"
      );
      return Array.from(contestElements)
        .map((element) => {
          const title =
            element.querySelector("span.transition-colors")?.textContent ||
            "N/A";
          const date =
            element.querySelector("div.text-label-2")?.textContent || "N/A";
          if (title === "N/A" || date === "N/A") return null;
          return { title, date };
        })
        .filter((el) => el !== null);
    });

    console.log(`Scraped ${data.length} contests. Saving to cache...`);
    fs.writeFileSync("contests_cache.json", JSON.stringify(data, null, 2));

    console.log("Scraping and saving done.");
  } catch (error) {
    console.error("Error during scraping:", error);
    throw error;
  } finally {
    await browser.close();
  }
}

module.exports = scrapeAndSave;
