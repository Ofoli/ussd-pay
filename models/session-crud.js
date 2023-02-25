const fsPromises = require("fs/promises");
const {
  getSessionPath,
  findSession,
  persistSessionData,
} = require("../utils/sessions");

async function createSession(sessionId) {
  const timeStamp = JSON.stringify(new Date()).slice(1, 11);
  const key = `${sessionId}_${timeStamp}`;
  const sessionStorePath = getSessionPath(`${key}.txt`);
  const response = await persistSessionData(sessionStorePath, { sessionId });
  return response;
}
function getSession(sessionId) {
  const sessionData = findSession(sessionId);
  if (sessionData.status) return sessionData;
  return sessionData.session;
}
async function updateSession(sessionData) {
  const { sessionId } = sessionData;
  const findResponse = findSession(sessionId);

  if (findResponse.status) return findResponse;

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
  if (sessionData.status) return sessionData;
  await fsPromises.rm(sessionData.sessionFullPath);
  return { status: "SUCCESS", message: "Session data deleted" };
}

const test = async () => {
  const sessionId = "mytestsession";
  const createRes = await createSession(sessionId);
  console.log({ GET_SESSION_00: getSession(sessionId) });
  const updateRes = await updateSession({ sessionId, number: "7827645378345" });
  console.log({ GET_SESSION_01: getSession(sessionId) });

  console.log({ DELETE_SESSION: await deleteSession(sessionId) });
  //   console.log(session);
};

test();
