import axios, { type AxiosError } from "axios";

export type SuccessResponse = {
  status: true;
  data: Record<string, unknown>;
};

type ErrorResponse = {
  status: false;
  message: Record<string, string> | string;
};

export class Request {
  static async post<T extends Record<string, unknown>>(
    url: string,
    values: T
  ): Promise<SuccessResponse | ErrorResponse> {
    try {
      const { data } = await axios.post(url, values);
      return { status: true, data };
    } catch (err) {
      const { response } = err as AxiosError;
      const { message } = err as Error;
      return {
        status: false,
        message: response?.data ?? message,
      } as ErrorResponse;
    }
  }
}
