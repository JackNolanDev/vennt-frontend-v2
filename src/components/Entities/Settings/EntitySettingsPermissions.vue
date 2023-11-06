<template>
  <BaseDropDown
    v-if="entityStore.entity && entityStore.isOwner"
    title="Permissions Settings"
  >
    <div class="mt-8 mb-8 ml-8 mr-8">
      <div class="alignRow gap">
        <BaseCheckBox
          @click="toggleEntityPublic"
          :checked="entityStore.entity.entity.public"
          :highlight="true"
          class="wide"
          >Anyone with the link can view</BaseCheckBox
        >
        <BaseCopyButton v-if="entityStore.entity.entity.public" :text="link"
          >Entity Link</BaseCopyButton
        >
      </div>
      <div v-if="entityStore.entity.entity.public">
        <div v-for="text in entityStore.entity.text" :key="text.id">
          <BaseCheckBox
            @click="toggleEntityTextPublic(text.key, !text.public)"
            :checked="text.public"
            :highlight="true"
            class="wide"
            >{{ text.key }} is public</BaseCheckBox
          >
        </div>
      </div>
    </div>
  </BaseDropDown>
</template>

<script setup lang="ts">
import BaseCheckBox from "@/components/Base/BaseCheckBox.vue";
import BaseCopyButton from "@/components/Base/BaseCopyButton.vue";
import { useEntityStore } from "@/stores/entity";
import type { EntityTextKey } from "vennt-library";
import { computed } from "vue";
import BaseDropDown from "../../Base/BaseDropDown.vue";

const entityStore = useEntityStore();

const link = computed(
  () => `${window.location.origin}/entity/${entityStore.entity?.entity.id}`
);

const toggleEntityPublic = () => {
  if (entityStore.entity) {
    entityStore.updateEntity({ public: !entityStore.entity.entity.public });
  }
};

const toggleEntityTextPublic = (key: EntityTextKey, newPermission: boolean) => {
  entityStore.updateTextPermission(key, newPermission);
};
</script>
