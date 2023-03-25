<template>
  <h1>Settings</h1>
  <EntitySettingsCogs class="mb-8"></EntitySettingsCogs>
  <EntitySettingsGeneralDropdown class="mb-8"></EntitySettingsGeneralDropdown>
  <EntitySettingsDangerous></EntitySettingsDangerous>
</template>

<script setup lang="ts">
import EntitySettingsCogs from "@/components/Entities/Settings/EntitySettingsCogs.vue";
import EntitySettingsDangerous from "@/components/Entities/Settings/EntitySettingsDangerous.vue";
import EntitySettingsGeneralDropdown from "@/components/Entities/Settings/EntitySettingsGeneralDropdown.vue";
</script>
