import type { MenuResponse } from "./types";
import { UssdSessionContext } from "./session-context";

export abstract class StageHandler {
  abstract stage: string;
  abstract getMenu(session: UssdSessionContext): MenuResponse;
  abstract getNext(session: UssdSessionContext): StageHandler;
}

export class StageHandlerMapping {
  mapping: Map<string, StageHandler>;

  constructor(handlers: StageHandler[]) {
    this.mapping = new Map(
      handlers.map((handler) => {
        return [handler.stage, handler];
      })
    );
  }
  get(name: string): StageHandler {
    const handler = this.mapping.get(name);
    if (!handler) throw new Error("Handler Not Found");
    return handler;
  }
}
