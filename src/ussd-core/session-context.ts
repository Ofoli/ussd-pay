import type {
  UssdData,
  UssdSession,
  MenuResponse,
  UssdInputData,
} from "./types";
import { BaseSessionStore, MemoryBasedSessionStore } from "./session-store";

export class UssdSessionContext {
  private store: BaseSessionStore;
  private nextStageKey = "_next_stage";
  private data: UssdInputData | null = null;

  constructor(sessionStore: BaseSessionStore = new MemoryBasedSessionStore()) {
    this.store = sessionStore;
  }

  private getCurrentSession(): UssdSession {
    return this.store.get(this.data!.sessionId) ?? {};
  }

  initialize(data: UssdData): void {
    this.data = this.toInternal(data);
    if (this.data.isFirstMenu) {
      this.store.set(this.data.sessionId, {});
    }
  }

  retrieve(key: string): string {
    const session = this.getCurrentSession();
    return session[key];
  }

  update(key: string, value: string) {
    const session = this.getCurrentSession();
    session[key] = value;
    this.store.set(this.data!.sessionId, session);
  }

  nextStage(stage: string = ""): string {
    const session = this.getCurrentSession();
    if (!stage) stage = session[this.nextStageKey] ?? "";
    this.update(this.nextStageKey, stage);
    return stage;
  }

  getUssdData(): UssdInputData {
    return this.data!;
  }

  getResponse(menu: MenuResponse): Record<string, string | boolean> {
    if (!menu.continueSession) this.store.destroy(this.data!.sessionId);
    return {
      USERID: this.data!.userId,
      MSISDN: this.data!.msisdn,
      MSG: menu.message,
      MSGTYPE: menu.continueSession,
    };
  }

  toInternal(data: UssdData): UssdInputData {
    return {
      sessionId: data.SESSIONID,
      userData: data.USERDATA,
      msisdn: data.MSISDN,
      network: data.NETWORK,
      isFirstMenu: data.MSGTYPE,
      userId: data.USERID,
    };
  }
}
