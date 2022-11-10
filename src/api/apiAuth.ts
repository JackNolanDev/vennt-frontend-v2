import { accountInfoValidator } from "@/utils/backendTypes";
import type {
  SignupRequest,
  AccountInfo,
  LoginRequest,
} from "@/utils/backendTypes";
import api from "./apiInstance";
import { parseResponse } from "./utils";

export const signup = async (request: SignupRequest): Promise<AccountInfo> => {
  return parseResponse(
    await api.post("/auth/signup", JSON.stringify(request)),
    accountInfoValidator
  );
};

export const login = async (request: LoginRequest): Promise<AccountInfo> => {
  return parseResponse(
    await api.post("/auth/login", JSON.stringify(request)),
    accountInfoValidator
  );
};

export const logout = async () => {
  api.post("/auth/logout");
};

export const getAccount = async () => {
  return parseResponse(await api.post("/auth/account"), accountInfoValidator);
};
