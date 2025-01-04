import { CONTRIBUTION_TYPES } from "../ussd/constants";
import { STATUSES } from "./constants";
export type PaymentData = {
  name: string;
  amount: number;
  number: string;
  network: string;
  contribution: (typeof CONTRIBUTION_TYPES)[number];
};

export type TransData = Omit<PaymentData, "network"> & {
  orderId?: string;
  invoice?: string;
  status?: (typeof STATUSES)[number];
  createdAt?: string;
  updatedAt?: string;
};

export type UpdateTransData = {
  invoice: string;
  orderId: string;
  status?: (typeof STATUSES)[number];
};

export type Gateway = {
  url: string;
  merchant: string;
  username: string;
  password: string;
  callbackUrl: string;
};
