<template>
  <BaseDropDown
    v-if="entityStore.entity?.entity.type === 'COG'"
    title="Cog Settings"
  >
    <div class="mt-8 mb-8 ml-8 mr-8">
      <BaseButton
        v-if="entityStore.entity.entity.other_fields.cog_creation_options"
        :to="{
          name: CREATE_NEW_COG_ROUTE,
          query: { edit: entityStore.entity.entity.id },
        }"
        class="wide"
        >Edit this cog in the Cog Editor</BaseButton
      >
    </div></BaseDropDown
  >
</template>

<script setup lang="ts">
import BaseButton from "@/components/Base/BaseButton.vue";
import BaseDropDown from "@/components/Base/BaseDropDown.vue";
import { CREATE_NEW_COG_ROUTE } from "@/router";
import { useEntityStore } from "@/stores/entity";

const entityStore = useEntityStore();
</script>
