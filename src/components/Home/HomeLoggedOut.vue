<template>
  <div class="mediumPageWidth centeredText">
    <h1 class="logo">VENNT</h1>
    <RouterLink :to="{ name: LOGIN_ROUTE }" class="btn roundedButton mb-8">
      LOGIN
    </RouterLink>
    <RouterLink
      :to="{ name: SIGNUP_ROUTE }"
      class="btn roundedButton clear mb-8"
    >
      SIGNUP
    </RouterLink>
    <p>
      The wiki can be found
      <a
        href="https://vennt.fandom.com/wiki/Vennt_Wiki"
        target="_blank"
        class="link"
      >
        here!
      </a>
    </p>
    <p><RouterLink to="/credits" class="link">Credits</RouterLink></p>
  </div>
</template>

<script setup lang="ts">
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/router";
import { RouterLink } from "vue-router";
</script>

<style scoped>
.logo {
  font-size: 100pt;
  font-weight: 300;
  color: var(--logo-color);
}

@media screen and (max-width: 500px) {
  /* Make logo scale with page width if the page gets too small */
  .logo {
    font-size: 25vw;
  }
}
</style>
