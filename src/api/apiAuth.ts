import { accountInfoValidator } from "@/utils/backendTypes";
import type {
  SignupRequest,
  AccountInfo,
  LoginRequest,
} from "@/utils/backendTypes";
import api from "./apiInstance";
import { wrapAPI } from "./utils";

export const signupApi = (request: SignupRequest): Promise<AccountInfo> => {
  return wrapAPI(() => api.post("/auth/signup", request), accountInfoValidator);
};

export const loginApi = (request: LoginRequest): Promise<AccountInfo> => {
  return wrapAPI(() => api.post("/auth/login", request), accountInfoValidator);
};

export const logoutApi = () => {
  wrapAPI(() => api.post("/auth/logout"));
};

export const getAccountApi = () => {
  return wrapAPI(() => api.get("/auth/account"), accountInfoValidator);
};
