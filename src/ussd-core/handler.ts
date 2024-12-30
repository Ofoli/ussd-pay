import type { MenuResponse } from "./types";
import { UssdSessionContext } from "./session";

export abstract class StageHandler {
  abstract stage: string;
  abstract getMenu(session: UssdSessionContext): MenuResponse;
  abstract getNext(session: UssdSessionContext): StageHandler;
}

export class StageHandlerMapping<K extends string | number | symbol> {
  mapping: Record<K, StageHandler>;

  constructor(mapping: Record<K, StageHandler>) {
    this.mapping = mapping;
  }
  get(name: K): StageHandler {
    const handler = this.mapping[name];
    if (!handler) throw new Error("Handler Not Found");
    return handler;
  }
}

export class LastStage extends StageHandler {
  stage: string = "Last";

  getMenu(session: UssdSessionContext): MenuResponse {
    const age = session.retrieve("age");
    const name = session.retrieve("name");

    const message = `Hello ${name},\n You are ${age} years old`;
    return { message, continueSession: false };
  }

  getNext(session: UssdSessionContext): StageHandler {
    return this;
  }
}

export class AgeStage extends StageHandler {
  stage: string = "Age";

  getMenu(session: UssdSessionContext): MenuResponse {
    const message = "Please enter your age";
    return { message, continueSession: false };
  }

  getNext(session: UssdSessionContext): StageHandler {
    const age = session.getUssdData().userData;
    session.update("age", age);

    return new LastStage();
  }
}

export class NameStage extends StageHandler {
  stage: string = "";

  getMenu(session: UssdSessionContext): MenuResponse {
    const message = "Please enter your name";
    return { message, continueSession: false };
  }

  getNext(session: UssdSessionContext): StageHandler {
    const ussd = session.getUssdData();
    if (ussd.isFirstMenu) return this;

    const data = ussd.userData;
    session.update("name", data);

    return new AgeStage();
  }
}
