export const isValidLength = (str: string) => str.length >= 3;
export const isStringedNumber = (str: string) =>
  !isNaN(parseInt(str)) && !isNaN(parseFloat(str));
