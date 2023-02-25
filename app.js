const express = require("express");
const logger = require("./utils/logger");
const { PORT, USSD_ENPOINT } = require("./data/constants");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("App is working");
});

app.post(USSD_ENPOINT, async (req, res) => {
  const { body: data } = req;
  await logger(data, "requests.log");
  res.json({ message: "success", data });
});

app.listen(PORT, () => {
  console.log(`Started USSD app on port ${PORT}`);
});
