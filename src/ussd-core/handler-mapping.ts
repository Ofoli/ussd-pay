import { AgeStage, NameStage, LastStage } from "./handler";

export const StageMapping = {
  Age: new AgeStage(),
  "": new NameStage(),
  Last: new LastStage(),
};
