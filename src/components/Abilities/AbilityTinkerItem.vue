<template>
  <BaseButton
    @click="buildItem"
    title="Tinker up that ability into an item!"
    class="primary center wide mt-8"
    >{{ prefixName(ability.name, "Build", true) }}</BaseButton
  >
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import type { FullEntityAbility, UncompleteEntityItem } from "vennt-library";
import { prefixName } from "@/utils/textUtils";
import BaseButton from "../Base/BaseButton.vue";

const props = defineProps<{ ability: FullEntityAbility }>();
const entityStore = useEntityStore();

const buildItem = () => {
  const dcStr = props.ability.custom_fields?.build_dc;
  const dc = dcStr ? parseInt(dcStr) : 0;
  // TODO: Figure out ways to get more precise details here
  const item: UncompleteEntityItem = {
    name: props.ability.name,
    type: "equipment",
    active: false,
    desc: props.ability.effect,
    bulk: dc,
    custom_fields: {
      dc_cost: dc,
    },
  };
  entityStore.addItems([item], true);
};
</script>
