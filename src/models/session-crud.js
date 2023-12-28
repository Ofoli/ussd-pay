const fsPromises = require("fs/promises");
const { SUCCESS_STATUS, FAILED_STATUS } = require("../data/constants");
const {
  getSessionPath,
  findSession,
  persistSessionData,
  addSessionToDelete,
} = require("../utils/sessions");

async function createSession(sessionId) {
  const timeStamp = JSON.stringify(new Date()).slice(1, 11);
  const key = `${sessionId}_${timeStamp}`;
  const sessionStorePath = getSessionPath(`${key}.txt`);
  const response = await persistSessionData(sessionStorePath, {
    sessionId,
    data: ["*920*411"],
  });
  return response;
}

function getSession(sessionId) {
  const sessionData = findSession(sessionId);
  if (sessionData.status === FAILED_STATUS) return sessionData;
  return sessionData.session;
}

async function updateSession(sessionData) {
  const { sessionId } = sessionData;
  const findResponse = findSession(sessionId);

  if (findResponse.status === FAILED_STATUS) return findResponse;

  const { session, sessionFullPath } = findResponse;
  const updatedSession = { ...session, ...sessionData };
  const updateResponse = await persistSessionData(
    sessionFullPath,
    updatedSession
  );
  return updateResponse;
}
async function deleteSession(sessionId) {
  const sessionData = findSession(sessionId);
  if (sessionData.status === FAILED_STATUS) {
    await addSessionToDelete(sessionData.sessionFullPath);
    return;
  }
  await fsPromises.rm(sessionData.sessionFullPath);
}

module.exports = { createSession, getSession, updateSession, deleteSession };
