<template>
  <nav class="nav alignRow split">
    <div>
      <BaseButton :to="{ name: CAMPAIGN_ROUTE }" icon="arrow_back"
        >Back to Campaign</BaseButton
      >
    </div>
    <BaseButton @click="openDropdown" icon="menu" class="skinny"></BaseButton>
  </nav>
  <div v-if="state.dropdownOpen" class="nav-dropdown">
    <div class="separator"></div>
    <nav class="mt-8 mb-8 ml-8 mr-8">
      <BaseButton
        :to="{ name: HOME_ROUTE }"
        icon="home"
        class="skinny bold wide"
      >
        Home
      </BaseButton>
      <BaseButton
        @click="accountInfoStore.postLogOut()"
        icon="logout"
        class="skinny bold wide"
      >
        Log out
      </BaseButton>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { CAMPAIGN_ROUTE, HOME_ROUTE } from "@/router";
import { useAccountInfoStore } from "@/stores/accountInfo";
import { reactive } from "vue";
import BaseButton from "../Base/BaseButton.vue";

const state = reactive({ dropdownOpen: false });
const accountInfoStore = useAccountInfoStore();

const openDropdown = () => {
  if (state.dropdownOpen) return;
  state.dropdownOpen = true;
  setTimeout(() => {
    window.addEventListener("click", closeDropDown);
  }, 50);
};

const closeDropDown = () => {
  state.dropdownOpen = false;
  window.removeEventListener("click", closeDropDown);
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
