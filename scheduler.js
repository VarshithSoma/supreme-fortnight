const { CronJob } = require("cron");
const scrapeAndSave = require("./scrape.js");
// */10 * * * * *
// seconds 10
//* * * * *
//minutes hours days (every day of week) and (month)
const job = new CronJob("*/10 * * * * *", async () => {
  scrapeAndSave();
});
job.start();
//it runs tasks at exact times (like “every day at 6 AM”),
//  even if the system or app was restarted in between. so used cron intead of setInterval
/*
 0  0  23  *  *   6,0
 minute (0)
 hour (23 = 11 PM)
 day of month (* = every day)
 month (* = every month)
 day of week (6 = Saturday, 0 = Sunday)


 field          allowed values
-----          --------------
second         0-59
minute         0-59
hour           0-23
day of month   1-31
month          1-12 (or names, see below)
day of week    0-7 (0 or 7 is Sunday, or use names)
*/
