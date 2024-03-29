import router, { LOGIN_ROUTE } from "@/router";
import { useAccountInfoStore } from "@/stores/accountInfo";
import { TOKEN_LOCAL_STORAGE } from "@/utils/constants";
import { AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios";
import type { z } from "zod";

export const authConfig = (config?: AxiosRequestConfig): AxiosRequestConfig => {
  const token = localStorage.getItem(TOKEN_LOCAL_STORAGE);
  if (token) {
    return {
      ...config,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }
  return { ...config };
};

export const wrapAPI = async <T extends z.ZodTypeAny>(
  api: () => Promise<AxiosResponse>,
  validator?: T,
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
        useAccountInfoStore().postLogOut();
        if (
          router.currentRoute.value.meta.loggedInOnly &&
          router.currentRoute.value.name !== LOGIN_ROUTE
        ) {
          router.push({ name: LOGIN_ROUTE });
        }
      }
    }
    throw err;
  }
};

const BASE_URL =
  import.meta.env.VITE_API_URL ??
  (process.env.NODE_ENV === "development"
    ? "localhost:5001" // local server
    : "vennt.up.railway.app"); // railway deployment of backend

const PROTOCOL_SEPARATOR = "://";

const BASE_HTTP_PROTOCOL =
  import.meta.env.VITE_API_URL || process.env.NODE_ENV !== "development"
    ? "https"
    : "http";
const BASE_WS_PROTOCOL =
  import.meta.env.VITE_API_URL || process.env.NODE_ENV !== "development"
    ? "wss"
    : "ws";

export const BASE_HTTP_URL = BASE_HTTP_PROTOCOL + PROTOCOL_SEPARATOR + BASE_URL;
export const BASE_WS_URL = BASE_WS_PROTOCOL + PROTOCOL_SEPARATOR + BASE_URL;
