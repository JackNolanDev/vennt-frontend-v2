<template>
  <LevelUpModal v-if="entityStore.levelsToProcess > 0"></LevelUpModal>
  <RecoveryShockModal
    v-else-if="(entityStore.recoveryShockSrc?.length ?? 0) > 0"
  ></RecoveryShockModal>
  <AttributeModal
    v-else-if="showAttrModal"
    :attr="(attrToEdit as EntityAttribute)"
  ></AttributeModal>
</template>

<script setup lang="ts">
import router from "@/router";
import {
  attributeNameValidator,
  type EntityAttribute,
} from "@/utils/backendTypes";
import { computed } from "vue";
import AttributeModal from "../Attributes/AttributeModal.vue";
import LevelUpModal from "../Attributes/LevelUpModal.vue";
import { useEntityStore } from "@/stores/entity";
import RecoveryShockModal from "./RecoveryShockModal.vue";

const entityStore = useEntityStore();

const attrToEdit = computed(() => router.currentRoute.value.query.attr);
const showAttrModal = computed(
  () =>
    entityStore.entity &&
    attributeNameValidator.safeParse(attrToEdit.value).success
);
</script>
