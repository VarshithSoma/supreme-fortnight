const { CronJob } = require("cron");
const scrapeData = require("./scrape.js");
// */10
// seconds 10
//* * * * *
//minutes hours days (every day of week) and (month)
const job = new CronJob("*/10 * * * * *", async () => {
  scrapeData();
});
job.start();
