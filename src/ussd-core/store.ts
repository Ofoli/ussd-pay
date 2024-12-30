import type { UssdSession } from "./types";

export abstract class BaseSessionStore {
  abstract get(key: string): UssdSession | null;
  abstract set(key: string, session: UssdSession): void;
  abstract destroy(key: string): void;
}

export class MemoryBaseSessionStore extends BaseSessionStore {
  private store: Map<string, UssdSession> = new Map();

  get(key: string): UssdSession | null {
    console.log({ store: JSON.stringify(this.store) });
    return this.store.get(key) ?? null;
  }

  set(key: string, session: UssdSession): void {
    this.store.set(key, session);
  }

  destroy(key: string): void {
    this.store.delete(key);
  }
}
