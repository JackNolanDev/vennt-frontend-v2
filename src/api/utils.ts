import router, { LOGIN_ROUTE } from "@/router";
import { AxiosError, type AxiosResponse } from "axios";
import type { z } from "zod";

export const wrapAPI = async <T extends z.ZodTypeAny>(
  api: () => Promise<AxiosResponse>,
  validator?: T
): Promise<z.infer<T>> => {
  try {
    const response = await api();
    if (response.data.success) {
      if (validator) {
        return validator.parse(response.data.result);
      } else {
        return;
      }
    } else if (response.data.error) {
      throw new Error(response.data.error);
    }
    throw new Error(response.statusText);
  } catch (err) {
    // handle generic errors first
    if (err instanceof AxiosError) {
      if (err.response && err.response.status === 401) {
        if (router.currentRoute.value.name !== LOGIN_ROUTE) {
          router.push({ name: LOGIN_ROUTE });
        }
      }
    }
    throw err;
  }
};
