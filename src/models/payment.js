const fsPromises = require("fs/promises");
const path = require("path");
const { SUCCESS_STATUS, FAILED_STATUS } = require("../data/constants");

const DB_PATH = path.join(
  __dirname,
  "..",
  "..",
  "transactions",
  "transactions.json"
);

const getTransactions = async () => {
  const transactions = await fsPromises.readFile(DB_PATH, { encoding: "utf8" });
  return JSON.parse(transactions);
};

const addTransaction = async (data) => {
  try {
    const transactions = await getTransactions();
    const id = transactions.length + 1;
    const updatedTransactions = [...transactions, { id, ...data }];
    await fsPromises.writeFile(DB_PATH, JSON.stringify(updatedTransactions));
    return { status: SUCCESS_STATUS, data: { id, ...data } };
  } catch (err) {
    return { status: FAILED_STATUS, data: err.message };
  }
};

const updateTransaction = async (data) => {
  try {
    const { updatedAt, status, invoice } = data;
    const transactions = await getTransactions();
    const transaction = transactions.find((t) => t.invoice === invoice);

    if (!transaction) return { status: FAILED_STATUS, data: "Not Found" };

    const updatedTransaction = { ...transaction, updatedAt, status };
    const updatedTransactions = transactions.map((trans) =>
      trans.invoice === data.invoice ? updatedTransaction : trans
    );
    await fsPromises.writeFile(DB_PATH, JSON.stringify(updatedTransactions));
    return { status: SUCCESS_STATUS, data: updatedTransaction };
  } catch (err) {
    return { status: FAILED_STATUS, data: err.message };
  }
};
module.exports = { addTransaction, updateTransaction };
