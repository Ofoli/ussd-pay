import path from "path";
import fs from "fs";
import type { UssdSession } from "./types";

export abstract class BaseSessionStore {
  abstract get(key: string): UssdSession | null;
  abstract set(key: string, session: UssdSession): void;
  abstract destroy(key: string): void;
}

export class MemoryBasedSessionStore extends BaseSessionStore {
  private store: Map<string, UssdSession> = new Map();

  get(key: string): UssdSession | null {
    return this.store.get(key) ?? null;
  }

  set(key: string, session: UssdSession): void {
    this.store.set(key, session);
  }

  destroy(key: string): void {
    this.store.delete(key);
  }
}

export class FileBasedSessionStore extends BaseSessionStore {
  private sessionDirPath = path.join(__dirname, "..", "..", "sessions");
  getSessionPath = (key: string) =>
    path.join(this.sessionDirPath, `${key}.txt`);

  get(key: string): UssdSession | null {
    const sessionFilePath = this.getSessionPath(key);
    if (!fs.existsSync(sessionFilePath)) return null;

    const sessionText = fs.readFileSync(sessionFilePath, {
      encoding: "utf-8",
    }) as unknown;
    const session = JSON.parse(sessionText as string) as UssdSession;
    return session;
  }

  set(key: string, session: UssdSession): void {
    const sessionData = JSON.stringify(session);
    const sessionFilePath = this.getSessionPath(key);

    try {
      fs.writeFileSync(sessionFilePath, sessionData);
    } catch (err) {
      const { message } = err as Error;
      console.log({ ERROR: message });
    }
  }

  destroy(key: string): void {
    const sessionFilePath = this.getSessionPath(key);
    if (!fs.existsSync(sessionFilePath)) return;
    fs.unlinkSync(sessionFilePath);
  }
}
