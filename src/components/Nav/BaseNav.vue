<template>
  <nav class="nav">
    <div class="left">
      <RouterLink to="/" class="navButton homeLink">VENNT</RouterLink>
    </div>
    <div v-if="!accountInfoStore.isLoggedIn" class="right">
      <RouterLink to="/login" class="login navButton rightItem notMobile">
        LOGIN
      </RouterLink>
      <RouterLink to="/signup" class="signup navButton rightItem notMobile">
        SIGNUP
      </RouterLink>
      <!-- TODO: Update this link to be a dropdown with more items (instead of just linking to the login page) -->
      <RouterLink to="/login" class="login navButton rightItem mobileOnly">
        <span class="material-icons dropDownLink">menu</span>
      </RouterLink>
    </div>
    <div v-else class="right">
      <div class="logout rightItem">
        <button @click="accountInfoStore.postLogOut()" class="navButton btn">
          LOGOUT
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAccountInfoStore } from "@/stores/accountInfo";
import { RouterLink } from "vue-router";

const accountInfoStore = useAccountInfoStore();
</script>

<style scoped>
.nav {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  background-color: var(--nav-background);
  font-size: 18pt;
}

.homeLink {
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 0px;
  padding-bottom: 0px;
  font-family: var(--logo-font);
  font-weight: 500;
  font-size: 30pt;
}
.homeLink:hover {
  color: var(--home-button-hover);
  background-color: var(--nav-background);
}
.homeLink:active {
  color: var(--home-button-active);
  background-color: var(--nav-background);
}

.right {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.rightItem {
  margin-right: 10px;
}

.dropDownLink {
  font-size: 36px;
}

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
}
</style>
