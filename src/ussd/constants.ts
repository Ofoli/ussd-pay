export const CONTRIBUTION_TYPES = [
  "offering",
  "tithe",
  "thanksgiving",
  "donation",
] as const;
export const MESSAGES = {
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
