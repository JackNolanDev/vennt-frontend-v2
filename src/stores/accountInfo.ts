import { getAccountApi, loginApi, logoutApi, signupApi } from "@/api/apiAuth";
import router, { HOME_ROUTE } from "@/router";
import type {
  AccountInfo,
  LoginRequest,
  SignupRequest,
} from "@/utils/backendTypes";
import { defineStore } from "pinia";

interface AccountInfoStore {
  accountInfo: undefined | false | AccountInfo;
}

export const useAccountInfoStore = defineStore("accountInfo", {
  state: (): AccountInfoStore => {
    return {
      accountInfo: undefined,
    };
  },
  getters: {
    isLoggedIn(state) {
      return state.accountInfo !== false; // treat undefined as logged in because we are not explicitly logged out
    },
  },
  actions: {
    async fetchCurrentAccount() {
      try {
        this.accountInfo = await getAccountApi();
      } catch (err) {
        this.accountInfo = false;
        //console.error(err);
      }
    },
    async postSignup(SignupRequest: SignupRequest) {
      this.accountInfo = await signupApi(SignupRequest);
      router.push({ name: HOME_ROUTE });
    },
    async postLogin(loginRequest: LoginRequest) {
      this.accountInfo = await loginApi(loginRequest);
      router.push({ name: HOME_ROUTE });
    },
    async postLogOut() {
      await logoutApi();
      this.accountInfo = false;
      router.push({ name: HOME_ROUTE });
    },
  },
});
