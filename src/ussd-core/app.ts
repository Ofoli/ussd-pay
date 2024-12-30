import { UssdSessionContext } from "./session";
import { StageHandlerMapping } from "./handler";
import type { UssdData } from "./types";

class UssdCoreApp {
  private session: UssdSessionContext;

  constructor(session: UssdSessionContext) {
    this.session = session;
  }

  run<Q extends string | number | symbol>(
    data: UssdData,
    handlers: StageHandlerMapping<Q>
  ) {
    this.session.initialize(data);
    const stage = this.session.nextStage() as Q;
    const handler = handlers.get(stage);
    const nextHandler = handler.getNext(this.session);
    const menu = nextHandler.getMenu(this.session);

    this.session.nextStage(nextHandler.stage);
    return this.session.getResponse(menu);
  }
}

const ussdContext = new UssdSessionContext();
export const UssdApp = new UssdCoreApp(ussdContext);
