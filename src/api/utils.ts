import { AxiosResponse } from "axios";
import { z } from "zod";

export const parseResponse = <T extends z.ZodTypeAny>(
  response: AxiosResponse,
  validator: T
): z.infer<T> => {
  if (response.data.success) {
    return validator.parse(response.data.result);
  } else if (response.data.error) {
    throw new Error(response.data.error);
  }
  throw new Error(response.statusText);
};
