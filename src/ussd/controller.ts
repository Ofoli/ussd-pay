import { UssdApp } from "../ussd-core";
import { StageHandlerMapping } from "../ussd-core/stage-handler";
import { NameStage } from "./menus/name";
import { ContributionStage } from "./menus/contribution";
import { AmountStage } from "./menus/amount";
import { ConfirmStage } from "./menus/confirm";
import { PromptStage } from "./menus/prompt";
import type { UssdData } from "../ussd-core/types";
import type { Request, Response } from "express";

const handlers = [
  new NameStage(),
  new ContributionStage(),
  new AmountStage(),
  new ConfirmStage(),
  new PromptStage(),
];

export const handleUssdRequests = (req: Request, res: Response) => {
  const data = req.body as UssdData;
  const mapping = new StageHandlerMapping(handlers);
  const response = UssdApp.run(data, mapping);
  res.json(response);
};
