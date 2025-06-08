const express = require("express");
const app = express();
app.get("/", async (req, res) => {
  res.send("hello");
});
app.get("/contests", (req, res) => {
  const dataFile = "contests_cache.json";
  const rawData = fs.readFileSync(dataFile, "utf-8");
  const data = JSON.parse(rawData);
  res.json(data);
});
app.listen(3000, () => {
  console.log("server running at port 3000");
});
