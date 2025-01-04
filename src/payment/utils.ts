import crypto from "crypto";
import { PAYMENT_CALLBACK_ENDPOINT } from "../config/constants";

const generateOrderId = () => `order_${Date.now()}`;
const generateKey = () => {
  const digits = Array.from({ length: 4 }, () =>
    Math.floor(Math.random() * 10)
  );
  return digits.join("");
};

const createMD5Hash = (str: string) => {
  const md5Hash = crypto.createHash("md5");
  md5Hash.update(str, "utf-8");
  return md5Hash.digest("hex");
};

const generateSecrete = (key: string) => {
  const username = process.env.MERCHANT_USERNAME!;
  const password = process.env.MERCHANT_PASSWORD!;

  const hashedPassword = createMD5Hash(password);
  const secreteString = username + key + hashedPassword;
  const secrete = createMD5Hash(secreteString);
  return secrete;
};
const getCallbackEndpoint = () => {
  // let base = BASE_URL_DEV + process.env.PORT;
  let base = "BASE_URL_PROD";
  if (process.env.NODE_ENV === "production") base = "BASE_URL_PROD";
  return base + PAYMENT_CALLBACK_ENDPOINT;
};

const generatePaymentPayload = (data: Record<string, string>) => {
  const { name, amount, description, number, network } = data;
  const orderId = generateOrderId();
  const key = generateKey();
  const secrete = generateSecrete(key);
  const isVodaNetwork = network === "VODAFONE";
  const callbackEndpoint = getCallbackEndpoint();

  return {
    merchant_id: process.env.MERCHANT_ID,
    secrete: secrete,
    key: key,
    order_id: orderId,
    customerName: name,
    amount: parseFloat(amount),
    item_desc: description,
    customerNumber: parseInt(number),
    payby: network,
    isussd: true,
    newVodaPayment: isVodaNetwork,
    callback: callbackEndpoint,
  };
};

const formatCallbackResponse = (data: Record<string, string>) => {
  const { Timestamp, InvoiceNo, Order_id, Status } = data;
  return {
    updatedAt: Timestamp,
    createdAt: Timestamp,
    invoice: InvoiceNo,
    orderId: Order_id,
    status: Status,
  };
};

export { generatePaymentPayload, formatCallbackResponse };
