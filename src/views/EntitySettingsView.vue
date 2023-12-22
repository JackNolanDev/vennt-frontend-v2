<template>
  <PageLayout>
    <h1>Settings</h1>
    <EntitySettingsCogs class="mb-8"></EntitySettingsCogs>
    <EntitySettingsGeneralDropdown class="mb-8"></EntitySettingsGeneralDropdown>
    <EntitySettingsPermissions class="mb-8"></EntitySettingsPermissions>
    <EntitySettingsDangerous class="mb-8"></EntitySettingsDangerous>
    <EntityDownload></EntityDownload>
  </PageLayout>
</template>

<script setup lang="ts">
import EntityDownload from "@/components/Entities/Settings/EntityDownload.vue";
import EntitySettingsCogs from "@/components/Entities/Settings/EntitySettingsCogs.vue";
import EntitySettingsDangerous from "@/components/Entities/Settings/EntitySettingsDangerous.vue";
import EntitySettingsGeneralDropdown from "@/components/Entities/Settings/EntitySettingsGeneralDropdown.vue";
import EntitySettingsPermissions from "@/components/Entities/Settings/EntitySettingsPermissions.vue";
import PageLayout from "@/components/Base/PageLayout.vue";
</script>
