import { FAILED_STATUS } from "../config/constants";
import { validateUserData } from "./validator";
import { firePayment } from "../controllers/payment-handler";
import type { Request, Response } from "express";

const {
  getSession,
  createSession,
  updateSession,
  deleteSession,
} = require("../models/session-crud");

const DONATION_TYPES = ["offering", "tithe", "thanksgiving", "donation"];
const MESSAGES = {
  STAGE_ONE: "Welcome to luxstek payment collector.\nPlease enter your name",
  STAGE_TWO:
    "Select contribution type\n 1.Offering\n 2.Tithes\n 3.Thanksgiving\n 4.Donation",
  STAGE_THREE: (type: string) => `Enter ${type} amount`,
  STAGE_FOUR: (type: string, amount: string) =>
    `You are about to pay GHS ${amount} as ${type} to luxstek.\n 1.Confirm\n 2.Cancel`,
  STAGE_FIVE: {
    cancel: "You have terminated the contribution process",
    proceed:
      "Thank you for your contribution. Kindly approve the next popup to make the payment.",
  },
};

export const handleUSSDRequests = async (req: Request, res: Response) => {
  const { MSGTYPE } = req.body;
  if (MSGTYPE) return await handleInitialDials(req, res);
  return await handleSubsequentDials(req, res);
};

const handleInitialDials = async (req: Request, res: Response) => {
  const { SESSIONID, USERID, MSISDN } = req.body;
  //create a unique record for the session
  const createResponse = await createSession(SESSIONID);
  if (createResponse.status === FAILED_STATUS) return;

  const response = {
    USERID: USERID,
    MSISDN: MSISDN,
    MSG: MESSAGES.STAGE_ONE,
    MSGTYPE: true,
  };
  res.json(response);
};

const handleSubsequentDials = async (req: Request, res: Response) => {
  const { SESSIONID, USERID, MSISDN, USERDATA, NETWORK } = req.body;

  const response = {
    USERID: USERID,
    MSISDN: MSISDN,
    MSG: "Not Allowed",
    MSGTYPE: true,
  };

  const sessionData = getSession(SESSIONID);
  if (sessionData.status === FAILED_STATUS) return handleInitialDials(req, res);

  //validate userdata
  const validate = validateUserData(sessionData.data.length, USERDATA);
  if (validate.error) {
    await deleteSession(SESSIONID);
    res.json({ ...response, MSG: validate.message, MSGTYPE: false });
    return;
  }
  //update session data
  const updatedData = [...sessionData.data, USERDATA];
  const updatedSessionData = { ...sessionData, data: updatedData };
  const updateResponse = await updateSession(updatedSessionData);

  if (updateResponse.status === FAILED_STATUS) {
    console.log("SESSION_UPDATED_FAILED", updateResponse.message);
  }

  switch (sessionData.data.length) {
    case 1: {
      const message = MESSAGES.STAGE_TWO;
      res.json({ ...response, MSG: message });
    }
    case 2: {
      const userOption = parseInt(USERDATA);
      const donationType = DONATION_TYPES[userOption - 1];
      const message = MESSAGES.STAGE_THREE(donationType);
      res.json({ ...response, MSG: message });
    }
    case 3: {
      const userOption = parseInt(sessionData.data[2]);
      const donationType = DONATION_TYPES[userOption - 1];
      const amount = USERDATA;
      const message = MESSAGES.STAGE_FOUR(donationType, amount);
      res.json({ ...response, MSG: message });
    }
    case 4: {
      const proceedWithPayment = USERDATA === "1";
      const { proceed, cancel } = MESSAGES.STAGE_FIVE;
      await deleteSession(SESSIONID);

      res.json({
        ...response,
        MSG: proceedWithPayment ? proceed : cancel,
        MSGTYPE: false,
      });

      if (proceedWithPayment) {
        const [_, customer, donationIdx, amount] = updatedData;
        const donation = DONATION_TYPES[donationIdx - 1];
        const paymentData = {
          amount,
          name: `Luxstek_${customer}`,
          description: `Luxstek ${donation} contribution`,
          number: MSISDN,
          network: NETWORK,
        };
        await firePayment(paymentData);
      }

      break;
    }
    default:
      await deleteSession(SESSIONID);
      res.json({ ...response, MSGTYPE: false });
  }
};
