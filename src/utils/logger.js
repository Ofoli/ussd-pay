const path = require("path");
const fs = require("fs");
const fsPromises = require("fs/promises");
const { format } = require("date-fns");

async function logger(message, filename) {
  const timeStamp = `${format(new Date(), "yyyy-MM-dd\tHH:mm:ss")}`;
  const logMessage = `${timeStamp}\t${message}\n`;
  const dirPath = path.join(__dirname, "..", "..", "logs");
  const logPath = path.join(dirPath, filename);

  try {
    if (!fs.existsSync(dirPath)) await fsPromises.mkdir(dirPath);
    await fsPromises.appendFile(logPath, logMessage);
  } catch (err) {
    console.log(err);
  }
}

module.exports = logger;
