<template>
  <BaseLayout>
    <template #nav><BaseNav></BaseNav></template>
    <PageLayout class="medium">
      <form v-if="!accountInfoStore.isLoggedIn">
        <h1>SIGN UP</h1>
        <div>
          <label for="signup-username" class="labelText">
            Enter a username:
          </label>
          <input
            type="text"
            name="username"
            id="signup-username"
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
          <label for="signup-email" class="labelText">Enter an email:</label>
          <input
            type="email"
            name="email"
            id="signup-email"
            placeholder="Email"
            autocomplete="email"
            autocorrect="off"
            autocapitalize="none"
            v-model="state.email"
            class="input mt-4 wide"
            :class="{ invalid: emailInvalid }"
          />
          <p v-if="emailInvalid" class="mt-8 mb-0 errorText">
            {{ emailInvalid }}
          </p>
        </div>
        <div class="mt-16">
          <label for="signup-password1" class="labelText">
            Enter a password:
          </label>
          <input
            type="password"
            name="password1"
            id="signup-password1"
            placeholder="Password"
            autocomplete="new-password"
            v-model="state.password1"
            class="input mt-4 wide"
            :class="{ invalid: password1Invalid }"
          />
          <p v-if="password1Invalid" class="mt-8 mb-0 errorText">
            {{ password1Invalid }}
          </p>
        </div>
        <div class="mt-16">
          <label for="signup-password2" class="labelText">
            Verify your password:
          </label>
          <input
            type="password"
            name="password2"
            id="signup-password2"
            placeholder="Verify Password"
            autocomplete="new-password"
            v-model="state.password2"
            class="input mt-4 wide"
            :class="{ invalid: password2Invalid }"
          />
          <p v-if="password2Invalid" class="mt-8 mb-0 errorText">
            {{ password2Invalid }}
          </p>
        </div>
        <p v-if="accountInfoStore.signupError" class="errorText">
          {{ accountInfoStore.signupError }}
        </p>
        <BaseButton
          @click="signupButton"
          :disabled="buttonInvalid"
          class="mt-64 primary wide center bold"
        >
          SIGN UP
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
import { computed, onMounted, reactive } from "vue";
import {
  emailValidator,
  passwordValidator,
  signupRequestValidator,
  nameValidator,
} from "@/utils/backendTypes";
import { fieldValidator } from "@/utils/inputType";
import { useAccountInfoStore } from "@/stores/accountInfo";
import BaseButton from "@/components/Base/BaseButton.vue";

onMounted(() => {
  if (document.requestStorageAccess) {
    document.requestStorageAccess().then(
      () => {
        console.log("access granted");
      },
      () => {
        console.log("access denied");
      }
    );
  }
});

const state = reactive({
  username: "",
  email: "",
  password1: "",
  password2: "",
});

const accountInfoStore = useAccountInfoStore();

const usernameInvalid = computed(() => {
  return fieldValidator(nameValidator, state.username, "");
});

const emailInvalid = computed(() => {
  return fieldValidator(emailValidator, state.email, "");
});

const password1Invalid = computed(() => {
  return fieldValidator(passwordValidator, state.password1, "");
});

const password2Invalid = computed(() => {
  if (state.password1 !== state.password2) {
    return "Password fields must match";
  }
  return false;
});

const buttonInvalid = computed(() => {
  return usernameInvalid.value ||
    emailInvalid.value ||
    password1Invalid.value ||
    password2Invalid.value ||
    state.username === "" ||
    state.email === "" ||
    state.password1 === ""
    ? true
    : false;
});

const signupButton = () => {
  const request = signupRequestValidator.safeParse({
    username: state.username,
    email: state.email,
    password: state.password1,
  });
  if (request.success) {
    accountInfoStore.postSignup(request.data);
  }
};
</script>
