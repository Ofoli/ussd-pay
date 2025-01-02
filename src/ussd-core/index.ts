import { UssdSessionContext } from "./session-context";
import { StageHandlerMapping } from "./stage-handler";
import type { UssdData } from "./types";

class UssdCoreApp {
  private session: UssdSessionContext;

  constructor(session: UssdSessionContext) {
    this.session = session;
  }

  run(data: UssdData, handlers: StageHandlerMapping) {
    this.session.initialize(data);
    const stage = this.session.nextStage();
    const handler = handlers.get(stage);
    const nextHandler = handler.getNext(this.session);
    const menu = nextHandler.getMenu(this.session);

    this.session.nextStage(nextHandler.stage);
    return this.session.getResponse(menu);
  }
}

const ussdContext = new UssdSessionContext();
export const UssdApp = new UssdCoreApp(ussdContext);
