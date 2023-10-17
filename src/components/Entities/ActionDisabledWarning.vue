<template>
  <div v-if="disabledAction && disabledAction.length > 0">
    <strong class="mb-4">This Action is disabled!</strong>
    <div
      v-for="{ msg, icon } in disabledAction"
      :key="msg"
      class="alignRow gap mb-4"
    >
      <span v-if="icon" class="material-symbols-outlined">{{ icon }}</span>
      <p class="mt-0 mb-0">
        {{ msg }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import { computed } from "vue";

const props = defineProps<{ action: string }>();
const entityStore = useEntityStore();

const disabledAction = computed(
  () =>
    (entityStore.entity?.entity.other_fields.disabled_actions ?? {})[
      props.action
    ]
);
</script>
