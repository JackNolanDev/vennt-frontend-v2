<template>
  <BaseLayout class="nav">
    <template #nav><BaseNav></BaseNav></template>
    <PageLayout class="medium">
      <form v-if="!accountInfoStore.isLoggedIn">
        <h1>LOG IN</h1>
        <div>
          <label for="login-username" class="labelText">
            Enter your username:
          </label>
          <input
            type="text"
            name="username"
            id="login-username"
            placeholder="Username"
            autocomplete="username"
            autocorrect="off"
            autocapitalize="none"
            v-model="state.username"
            class="input mt-4 wide"
            :class="{ invalid: usernameInvalid }"
          />
          <p v-if="usernameInvalid" class="mt-8 mb-0 errorText">
            {{ usernameInvalid }}
          </p>
        </div>
        <div class="mt-16">
          <label for="login-password" class="labelText">
            Enter your password:
          </label>
          <input
            type="password"
            name="password"
            id="login-password"
            placeholder="Password"
            autocomplete="current-password"
            v-model="state.password"
            class="input mt-4 wide"
            :class="{ invalid: passwordInvalid }"
          />
          <p v-if="passwordInvalid" class="mt-8 mb-0 errorText">
            {{ passwordInvalid }}
          </p>
        </div>
        <p v-if="accountInfoStore.loginError" class="errorText">
          {{ accountInfoStore.loginError }}
        </p>
        <BaseButton
          @click="loginButton"
          :disabled="buttonInvalid"
          class="mt-64 primary wide center bold"
        >
          LOG IN
        </BaseButton>
      </form>
      <p v-else class="text-center">You are already signed in. Log out?</p>
    </PageLayout>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from "@/components/Base/BaseLayout.vue";
import PageLayout from "@/components/Base/PageLayout.vue";
import BaseNav from "@/components/Base/BaseNav.vue";
import { computed, reactive } from "vue";
import {
  passwordValidator,
  nameValidator,
  loginRequestValidator,
} from "@/utils/backendTypes";
import { fieldValidator } from "@/utils/inputType";
import { useAccountInfoStore } from "@/stores/accountInfo";
import BaseButton from "@/components/Base/BaseButton.vue";

const state = reactive({
  username: "",
  password: "",
});

const accountInfoStore = useAccountInfoStore();

const usernameInvalid = computed(() => {
  return fieldValidator(nameValidator, state.username, "");
});

const passwordInvalid = computed(() => {
  return fieldValidator(passwordValidator, state.password, "");
});

const buttonInvalid = computed(() => {
  return usernameInvalid.value ||
    passwordInvalid.value ||
    state.username === "" ||
    state.password === ""
    ? true
    : false;
});

const loginButton = () => {
  const request = loginRequestValidator.safeParse({
    username: state.username,
    password: state.password,
  });
  if (request.success) {
    accountInfoStore.postLogin(request.data);
  }
};
</script>
