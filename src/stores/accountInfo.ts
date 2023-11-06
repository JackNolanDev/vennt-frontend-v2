import { loginApi, signupApi } from "@/api/apiAuth";
import router, { HOME_ROUTE } from "@/router";
import {
  accountInfoValidator,
  type AccountInfo,
  type LoginRequest,
  type SignupRequest,
} from "vennt-library";
import { TOKEN_LOCAL_STORAGE } from "@/utils/constants";
import { AxiosError } from "axios";
import { defineStore } from "pinia";
import jwt_decode from "jwt-decode";
import { useEntityStore } from "./entity";
import { useEntityNotesStore } from "./entityNotes";
import { useHomeStore } from "./home";
import { useCampaignStore } from "./campaign";

interface AccountInfoStore {
  accountInfo: undefined | false | AccountInfo;
  loginError: string;
  signupError: string;
}

export const useAccountInfoStore = defineStore("accountInfo", {
  state: (): AccountInfoStore => {
    return {
      accountInfo: false,
      loginError: "",
      signupError: "",
    };
  },
  getters: {
    isLoggedIn(state) {
      return state.accountInfo !== false; // treat undefined as logged in because we are not explicitly logged out
    },
  },
  actions: {
    tryUseToken(token: string, save = false) {
      try {
        const parsed = accountInfoValidator.safeParse(jwt_decode(token));
        if (parsed.success) {
          this.accountInfo = parsed.data;
          if (save) {
            localStorage.setItem(TOKEN_LOCAL_STORAGE, token);
          }
        }
      } catch (err) {
        localStorage.removeItem(TOKEN_LOCAL_STORAGE);
      }
    },
    loadAccountInfo() {
      const token = localStorage.getItem(TOKEN_LOCAL_STORAGE);
      if (token) {
        this.tryUseToken(token);
      }
    },
    async postSignup(SignupRequest: SignupRequest) {
      try {
        const tokenResponse = await signupApi(SignupRequest);
        this.tryUseToken(tokenResponse.token, true);
        router.push({ name: HOME_ROUTE });
      } catch (err) {
        if (
          err instanceof AxiosError &&
          err.response &&
          err.response.data.error
        ) {
          this.signupError = err.response.data.error;
        }
      }
    },
    async postLogin(loginRequest: LoginRequest) {
      try {
        const tokenResponse = await loginApi(loginRequest);
        this.tryUseToken(tokenResponse.token, true);
        router.push({ name: HOME_ROUTE });
      } catch (err) {
        if (err instanceof Error) {
          console.log(err);
          if (
            err instanceof AxiosError &&
            err.response &&
            err.response.data.error
          ) {
            this.loginError = err.response.data.error;
          }
        }
      }
    },
    async postLogOut() {
      localStorage.removeItem(TOKEN_LOCAL_STORAGE);
      this.accountInfo = false;
      if (router.currentRoute.value.name !== HOME_ROUTE) {
        router.push({ name: HOME_ROUTE });
      }
      useHomeStore().reset();
      useEntityStore().clearLocalEntity();
      useEntityNotesStore().reset();
      useCampaignStore().reset();
    },
  },
});
