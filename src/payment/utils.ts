export function validateCallbackData(data: Record<string, string>) {
  const response = { status: false, message: "Data is required" };
  if (!data) return response;

  const keys = ["Status", "Order_id", "InvoiceNo"];
  for (let key of keys) {
    if (!(key in data)) {
      response.message = `${key} is required`;
      return response;
    }

    if (typeof data[key] !== "string") {
      response.message = `${key} should be of type string`;
      return response;
    }
  }

  return { status: true, message: "" };
}
