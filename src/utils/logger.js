const path = require("path");
const fs = require("fs");
const fsPromises = require("fs/promises");

async function logger(message, filename) {
  const timeStamp = new Date().toISOString();
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
