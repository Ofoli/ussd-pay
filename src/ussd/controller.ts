import { UssdApp } from "../ussd-core";
import { StageHandlerMapping } from "../ussd-core/stage-handler";
import { NameStage } from "./menus/name";
import { AgeStage } from "./menus/age";
import { LastStage } from "./menus/last";
import type { UssdData } from "../ussd-core/types";
import type { Request, Response } from "express";

const handlers = [new NameStage(), new AgeStage(), new LastStage()];

export const testUssdCore = (req: Request, res: Response) => {
  const data = req.body as UssdData;
  const mapping = new StageHandlerMapping(handlers);
  const response = UssdApp.run(data, mapping);
  res.json(response);
};
