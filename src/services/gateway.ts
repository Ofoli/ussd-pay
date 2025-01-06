import { Gateway } from "../payment/types";
import { config } from "../config/env";

export const NaloPaymentGateway: Gateway = config.payment.nalo;
