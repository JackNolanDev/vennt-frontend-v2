<template>
  <BaseLayout>
    <template #nav><BaseNav></BaseNav></template>
    <PageLayout class="medium">
      <form>
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
            :class="usernameInvalid ? 'invalid' : ''"
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
            :class="passwordInvalid ? 'invalid' : ''"
          />
          <p v-if="passwordInvalid" class="mt-8 mb-0 errorText">
            {{ passwordInvalid }}
          </p>
        </div>
        <button
          type="button"
          @click="loginButton"
          :disabled="buttonInvalid"
          class="mt-64 btn roundedButton wide noSelect"
        >
          LOG IN
        </button>
      </form>
    </PageLayout>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from "@/components/Base/BaseLayout.vue";
import PageLayout from "@/components/Base/PageLayout.vue";
import BaseNav from "@/components/Nav/BaseNav.vue";
import { computed, reactive } from "vue";
import {
  passwordValidator,
  usernameValidator,
  loginRequestValidator,
} from "@/utils/backendTypes";
import { fieldValidator } from "@/utils/inputType";
import { useAccountInfoStore } from "@/stores/accountInfo";

const state = reactive({
  username: "",
  password: "",
});

const accountInfoStore = useAccountInfoStore();

const usernameInvalid = computed(() => {
  return fieldValidator(usernameValidator, state.username, "");
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
