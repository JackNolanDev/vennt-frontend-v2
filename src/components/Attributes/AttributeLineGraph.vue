<template>
  <div v-if="show" class="card border">
    <AttributeLineGraphDiscrete :attr="attr"></AttributeLineGraphDiscrete>
  </div>
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import { ATTRIBUTES, type EntityAttribute, getMaxAttr } from "vennt-library";
import { computed, onBeforeMount } from "vue";
import AttributeLineGraphDiscrete from "./AttributeLineGraphDiscrete.vue";

const props = defineProps<{
  attr: EntityAttribute;
  scale?: "DISCRETE" | "TIME";
  alwaysShow?: boolean;
}>();
const entityStore = useEntityStore();

onBeforeMount(() => {
  entityStore.fetchChangelog(props.attr);

  const maxAttr = getMaxAttr(props.attr);
  if (maxAttr) {
    entityStore.fetchChangelog(maxAttr);
  }
});

const show = computed(() => {
  if (props.alwaysShow) {
    return true;
  }
  return [
    "hp",
    "vim",
    "mp",
    "hero",
    "xp",
    "sp",
    "alerts",
    "actions",
    "reactions",
    "recovery_shock",
  ]
    .concat(ATTRIBUTES)
    .includes(props.attr);
});
</script>
