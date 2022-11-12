import { accountInfoValidator } from "@/utils/backendTypes";
import type {
  SignupRequest,
  AccountInfo,
  LoginRequest,
} from "@/utils/backendTypes";
import api from "./apiInstance";
import { parseResponse } from "./utils";

export const signupApi = async (
  request: SignupRequest
): Promise<AccountInfo> => {
  return parseResponse(
    await api.post("/auth/signup", request),
    accountInfoValidator
  );
};

export const loginApi = async (request: LoginRequest): Promise<AccountInfo> => {
  return parseResponse(
    await api.post("/auth/login", request),
    accountInfoValidator
  );
};

export const logoutApi = async () => {
  api.post("/auth/logout");
};

export const getAccountApi = async () => {
  return parseResponse(await api.get("/auth/account"), accountInfoValidator);
};
