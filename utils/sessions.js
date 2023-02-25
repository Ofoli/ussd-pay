const path = require("path");
const fs = require("fs");
const fsPromises = require("fs/promises");

const sessionDirPath = path.join(__dirname, "..", "sessions");
const getSessionPath = (key) => path.join(__dirname, "..", "sessions", key);
const createSessionData = (data) => JSON.stringify(data);
const getAllSessionFiles = () => {
  try {
    const files = fs.readdirSync(sessionDirPath);
    return { error: false, data: files };
  } catch (err) {
    return { error: true, data: err };
  }
};
const findSession = (sessionId) => {
  const { error, data } = getAllSessionFiles();
  if (error) return { status: "FAILED", message: data };

  const sessionFileName = data.find((file) => file.split("_")[0] === sessionId);
  const sessionFullPath = getSessionPath(sessionFileName);

  const sessionText = fs.readFileSync(sessionFullPath);
  const session = JSON.parse(sessionText);

  return { session, sessionFullPath };
};
const persistSessionData = async (filePath, data) => {
  const session = createSessionData(data);
  try {
    await fsPromises.writeFile(filePath, session);
    return { message: "SUCCESS" };
  } catch (err) {
    return { message: err.message };
  }
};

module.exports = { getSessionPath, findSession, persistSessionData };
