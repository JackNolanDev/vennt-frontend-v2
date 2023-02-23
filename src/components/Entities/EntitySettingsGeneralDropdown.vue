<template>
  <BaseDropDown title="Attribute Settings">
    <div class="mt-8 mb-8 ml-8 mr-8 alignRow column gap top">
      <EntitySettingsAttributes></EntitySettingsAttributes>
      <EntitySettingsName></EntitySettingsName>
      <EntitySettingsGift field="gift"></EntitySettingsGift>
      <EntitySettingsGift field="second_gift"></EntitySettingsGift>
    </div>
  </BaseDropDown>
</template>

<script setup lang="ts">
import BaseDropDown from "../Base/BaseDropDown.vue";
import EntitySettingsAttributes from "./EntitySettingsAttributes.vue";
import EntitySettingsGift from "./EntitySettingsGift.vue";
import EntitySettingsName from "./EntitySettingsName.vue";
</script>
