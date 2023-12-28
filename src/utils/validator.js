const ERROR_MESSAGES = {
  DEFAULT: "You entered an invalid input",
  STAGE_ONE: "Name cannot be less than 5 characters",
};

const PASSED_RESPONSE = { error: false, message: "" };
const FAILED_RESPONSE = { error: true, message: ERROR_MESSAGES.DEFAULT };

function validateUserData(stage, data) {
  if (!data || !stage || stage < 1) return FAILED_RESPONSE;

  if (stage === 1) {
    if (!isValidLength(data)) {
      const message = ERROR_MESSAGES.STAGE_ONE;
      return { ...FAILED_RESPONSE, message };
    }
    return PASSED_RESPONSE;
  }

  if (isStringedNumber(data)) return PASSED_RESPONSE;
  return FAILED_RESPONSE;
}

const isValidLength = (str) => str.length >= 5;
const isStringedNumber = (str) => !isNaN(str) && !isNaN(parseFloat(str));

module.exports = validateUserData;
