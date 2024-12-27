import path from "path";
import fs from "fs";
import fsPromises from "fs/promises";
import { SUCCESS_STATUS, FAILED_STATUS } from "../config/constants";

const sessionDirPath = path.join(__dirname, "..", "..", "sessions");
const getSessionPath = (key: string) => path.join(sessionDirPath, key);
const createSessionData = (data: Record<string, string | string[]>) =>
  JSON.stringify(data);

const getAllSessionFiles = (): { error: boolean; data: string[] | string } => {
  try {
    const files = fs.readdirSync(sessionDirPath);
    return { error: false, data: files };
  } catch (err) {
    const { message } = err as Error;
    return { error: true, data: message };
  }
};
const findSession = (sessionId: string) => {
  let { error, data } = getAllSessionFiles();
  const isSessionFile = (file: string) => !file.includes("delete");

  if (
    error ||
    (typeof data !== "string" && data.filter(isSessionFile).length === 0)
  ) {
    const err = error ? error : "Session Not Found";
    return {
      status: FAILED_STATUS,
      session: null,
      sessionFullPath: "",
      message: err,
    };
  }
  data = data as string[];
  const sessionFileName = data.find(
    (file) => file.split("_")[0] === sessionId
  )!;
  const sessionFullPath = getSessionPath(sessionFileName);

  const sessionText = fs.readFileSync(sessionFullPath) as unknown;
  const session = JSON.parse(sessionText as string);

  return { status: SUCCESS_STATUS, session, sessionFullPath, message: "" };
};
const persistSessionData = async (
  filePath: string,
  data: Record<string, string | string[]>
) => {
  const session = createSessionData(data);
  try {
    await fsPromises.writeFile(filePath, session);
    return { status: SUCCESS_STATUS };
  } catch (err) {
    const { message } = err as Error;
    return { status: FAILED_STATUS, message };
  }
};

const addSessionToDelete = async (path: string) => {
  try {
    const filePath = getSessionPath("sessions_to_delete.txt");
    await fsPromises.writeFile(filePath, path);
  } catch (err) {
    const { message } = err as Error;
    return console.log("Unable to save session path", message);
  }
};
export { getSessionPath, findSession, persistSessionData, addSessionToDelete };
