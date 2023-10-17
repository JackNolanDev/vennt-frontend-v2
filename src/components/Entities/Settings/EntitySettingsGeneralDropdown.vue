<template>
  <BaseDropDown title="Attribute Settings">
    <div class="mt-8 mb-8 ml-8 mr-8 alignRow column top">
      <EntitySettingsAttributes></EntitySettingsAttributes>
      <EntitySettingsCustomAttribute></EntitySettingsCustomAttribute>
      <EntitySettingsName></EntitySettingsName>
      <EntitySettingsGift field="gift"></EntitySettingsGift>
      <EntitySettingsGift field="second_gift"></EntitySettingsGift>
      <EntitySettingsGiftBoon></EntitySettingsGiftBoon>
      <EntitySettingsDisabledActions></EntitySettingsDisabledActions>
    </div>
  </BaseDropDown>
</template>

<script setup lang="ts">
import BaseDropDown from "../../Base/BaseDropDown.vue";
import EntitySettingsAttributes from "./EntitySettingsAttributes.vue";
import EntitySettingsCustomAttribute from "./EntitySettingsCustomAttribute.vue";
import EntitySettingsDisabledActions from "./EntitySettingsDisabledActions.vue";
import EntitySettingsGift from "./EntitySettingsGift.vue";
import EntitySettingsGiftBoon from "./EntitySettingsGiftBoon.vue";
import EntitySettingsName from "./EntitySettingsName.vue";
</script>
