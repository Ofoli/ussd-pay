const express = require("express");
const logger = require("./utils/logger");
const { PORT, USSD_ENPOINT } = require("./data/constants");
const handleUSSDRequests = require("./controllers/ussd-handler");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("App is working");
});

app.post(USSD_ENPOINT, handleUSSDRequests);

app.listen(PORT, () => {
  console.log(`Started USSD app on port ${PORT}`);
});
