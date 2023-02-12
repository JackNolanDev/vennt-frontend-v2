import { accountTokenValidator, type AccountToken } from "@/utils/backendTypes";
import type { SignupRequest, LoginRequest } from "@/utils/backendTypes";
import api from "./apiInstance";
import { wrapAPI } from "./utils";

export const signupApi = (request: SignupRequest): Promise<AccountToken> => {
  return wrapAPI(
    () => api.post("/auth/signup", request),
    accountTokenValidator
  );
};

export const loginApi = (request: LoginRequest): Promise<AccountToken> => {
  return wrapAPI(() => api.post("/auth/login", request), accountTokenValidator);
};
