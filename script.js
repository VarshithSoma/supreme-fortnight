const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled"
    ]
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "webdriver", {
      get: () => false,
    });
  });

  console.log("Navigating to LeetCode contests page...");
  try {
    await page.goto("https://leetcode.com/contest/", {
      waitUntil: "domcontentloaded", 
      timeout: 30000, 
    });
  } catch (error) {
    console.error(" Navigation error:", error);
    await browser.close();
    return;
  }

  try {
    await page.waitForSelector("div.flex.items-center", { timeout: 10000 });
    console.log("Contest elements found.");
  } catch (e) {
    fs.writeFileSync("page.html", await page.content());
    await browser.close();
    process.exit(1);
  }

  let data = await page.evaluate(() => {
    const contestElements = document.querySelectorAll("div.flex.items-center");
    return Array.from(contestElements).map((element) => {
      const title =
        element.querySelector("span.transition-colors")?.textContent || "N/A";
      const date =
        element.querySelector("div.text-label-2")?.textContent || "N/A";
      if (date === "N/A" || title === "N/A") return null;
      return { title, date };
    });
  });

  data = data.filter((el) => el !== null);
  await browser.close();
  console.log("Scraped Contests:");
  console.log(data);
})();

