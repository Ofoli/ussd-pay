import path from "path";
import fs from "fs";
import fsPromises from "fs/promises";

export async function logger(message: string, filename: string) {
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
