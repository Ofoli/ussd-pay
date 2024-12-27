import fsPromises from "fs/promises";
import { FAILED_STATUS } from "../config/constants";
import {
  getSessionPath,
  findSession,
  persistSessionData,
  addSessionToDelete,
} from "../utils/sessions";

async function createSession(sessionId: string) {
  const timeStamp = JSON.stringify(new Date()).slice(1, 11);
  const key = `${sessionId}_${timeStamp}`;
  const sessionStorePath = getSessionPath(`${key}.txt`);
  const response = await persistSessionData(sessionStorePath, {
    sessionId,
    data: ["*920*411"],
  });
  return response;
}

function getSession(sessionId: string) {
  const sessionData = findSession(sessionId);
  if (sessionData.status === FAILED_STATUS) return sessionData;
  return sessionData.session;
}

async function updateSession(sessionData: Record<string, string>) {
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
async function deleteSession(sessionId: string) {
  const sessionData = findSession(sessionId);
  if (sessionData.status === FAILED_STATUS) {
    await addSessionToDelete(sessionData.sessionFullPath);
    return;
  }
  await fsPromises.rm(sessionData.sessionFullPath);
}

export { createSession, getSession, updateSession, deleteSession };
