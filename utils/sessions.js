const path = require("path");
const fs = require("fs");
const fsPromises = require("fs/promises");
const { SUCCESS_STATUS, FAILED_STATUS } = require("../data/constants");

const sessionDirPath = path.join(__dirname, "..", "sessions");
const errorSessionDirPath = path.join(__dirname, "..", "sessions_to_delete");
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

  if (error || data.length === 0) {
    const err = error ? error : "Session Not Found";
    return {
      status: FAILED_STATUS,
      session: null,
      sessionFullPath: "",
      message: err,
    };
  }

  const sessionFileName = data.find((file) => file.split("_")[0] === sessionId);
  const sessionFullPath = getSessionPath(sessionFileName);

  const sessionText = fs.readFileSync(sessionFullPath);
  const session = JSON.parse(sessionText);

  return { status: SUCCESS_STATUS, session, sessionFullPath, message: "" };
};
const persistSessionData = async (filePath, data) => {
  const session = createSessionData(data);
  try {
    await fsPromises.writeFile(filePath, session);
    return { status: SUCCESS_STATUS };
  } catch (err) {
    return { status: FAILED_STATUS, message: err.message };
  }
};

const addSessionToDelete = async (path) => {
  try {
    await fsPromises.writeFile(errorSessionDirPath, path);
  } catch (err) {
    return console.log("Unable to save session path");
  }
};
module.exports = {
  getSessionPath,
  findSession,
  persistSessionData,
  addSessionToDelete,
};
