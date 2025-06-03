const scrapeData = require("./scrape.js");
setInterval(async () => {
  console.log(await scrapeData());
}, 3000);
