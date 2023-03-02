const {
  getSession,
  createSession,
  updateSession,
  deleteSession,
} = require("../models/session-crud");
const { SUCCESS_STATUS, FAILED_STATUS } = require("../data/constants");

const handleUSSDRequests = async (req, res) => {
  const { MSGTYPE } = req.body;
  if (MSGTYPE) return await handleInitialDials(req, res);
  return await handleSubsequentDials(req, res);
};

const handleInitialDials = async (req, res) => {
  const { SESSIONID, USERID, MSISDN } = req.body;
  //create a unique record for the session
  const createResponse = await createSession(SESSIONID);
  if (createResponse.status === FAILED_STATUS) return;

  const response = {
    USERID: USERID,
    MSISDN: MSISDN,
    MSG: "Welcome to My USSD App.\nPlease enter your name",
    MSGTYPE: true,
  };
  return res.json(response);
};

const handleSubsequentDials = async (req, res) => {
  const { SESSIONID, USERID, MSISDN, USERDATA } = req.body;

  const sessionData = getSession(SESSIONID);
  if (sessionData.status === FAILED_STATUS) console.log(FAILED_STATUS);

  //update session data
  const updatedData = [...sessionData.data, USERDATA];
  const updatedSessionData = { ...sessionData, data: updatedData };
  const updateResponse = await updateSession(updatedSessionData);

  if (updateResponse.status === FAILED_STATUS) {
    console.log("SESSION_UPDATED_FAILED", updateResponse.message);
  }

  const response = {
    USERID: USERID,
    MSISDN: MSISDN,
    MSG: "",
    MSGTYPE: false,
  };

  switch (sessionData.data.length) {
    case 1: {
      const message = "How are you feeling?";
      return res.json({ ...response, MSG: message });
    }
    case 2: {
      const name = sessionData.data[1];
      const feeling = USERDATA;
      const message = `Dear ${name}, you are feeling ${feeling}`;
      return res.json({ ...response, MSG: message, MSGTYPE: true });
    }
    default:
      return res.status(500).send({ message: "This is not possible" });
  }
};

module.exports = handleUSSDRequests;
