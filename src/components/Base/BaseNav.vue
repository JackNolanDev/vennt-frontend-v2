<template>
  <nav class="nav alignRow split">
    <div>
      <RouterLink :to="{ name: HOME_ROUTE }" class="navButton navLogo"
        >VENNT</RouterLink
      >
    </div>
    <div v-if="!accountInfoStore.isLoggedIn" class="alignRow gap mr-8">
      <BaseButton :to="{ name: LOGIN_ROUTE }" class="skinny bold notMobile">
        LOG IN
      </BaseButton>
      <BaseButton :to="{ name: SIGNUP_ROUTE }" class="skinny bold notMobile">
        SIGN UP
      </BaseButton>
      <BaseButton
        @click="toggleDropdown"
        icon="menu"
        class="skinny mobileOnly"
      ></BaseButton>
    </div>
    <div v-else class="alignRow gap mr-8">
      <div>
        <BaseButton @click="accountInfoStore.postLogOut()" class="skinny bold">
          LOGOUT
        </BaseButton>
      </div>
    </div>
  </nav>
  <div v-if="state.dropdownOpen" class="nav-dropdown">
    <div class="separator"></div>
    <nav class="mt-8 mb-8 ml-8 mr-8">
      <BaseButton :to="{ name: LOGIN_ROUTE }" class="skinny bold">
        LOG IN
      </BaseButton>
      <BaseButton :to="{ name: SIGNUP_ROUTE }" class="skinny bold">
        SIGN UP
      </BaseButton>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { HOME_ROUTE, LOGIN_ROUTE, SIGNUP_ROUTE } from "@/router";
import { useAccountInfoStore } from "@/stores/accountInfo";
import { reactive } from "vue";
import { RouterLink } from "vue-router";
import BaseButton from "./BaseButton.vue";

const state = reactive({ dropdownOpen: false });
const accountInfoStore = useAccountInfoStore();

const toggleDropdown = () => {
  state.dropdownOpen = !state.dropdownOpen;
};
</script>

<style scoped>
/* Mobile Styles */
.mobileOnly {
  display: none;
}

@media screen and (max-width: 400px) {
  .notMobile {
    display: none;
  }
  .mobileOnly {
    display: flex;
  }

  .nav-dropdown {
    width: 100%;
  }
}
</style>
