<template>
  <div
    v-if="castingDice && ability.custom_fields?.cast_dl"
    class="card mt-8 padded thin column"
  >
    <ToggleableDiceSectionCopyable
      v-if="ability.custom_fields?.cast_dl"
      :dice="castingDice"
      :attr="'casting'"
      :header="true"
      :comment="diceComment"
    ></ToggleableDiceSectionCopyable>
  </div>
  <div v-if="ability.custom_fields?.mp_cost">
    <UseAbilityButton :ability="ability" :spell-idx="0"></UseAbilityButton>
    <UseAbilityButton :ability="ability" :spell-idx="1"></UseAbilityButton>
    <UseAbilityButton :ability="ability" :spell-idx="2"></UseAbilityButton>
  </div>
  <UseAbilityButton
    v-else-if="showUseButton"
    :ability="ability"
  ></UseAbilityButton>
</template>

<script setup lang="ts">
import { useDiceStore } from "@/stores/dice";
import { useEntityStore } from "@/stores/entity";
import type { FullEntityAbility } from "@/utils/backendTypes";
import { defaultDice } from "@/utils/diceUtils";
import { computed } from "vue";
import ToggleableDiceSectionCopyable from "../Dice/ToggleableDiceSectionCopyable.vue";
import UseAbilityButton from "./UseAbilityButton.vue";

const props = defineProps<{ ability: FullEntityAbility }>();
const entityStore = useEntityStore();
const diceStore = useDiceStore();

const diceComment = computed(() => `Casting ${props.ability.name}`);
const castingDice = computed(() => {
  return defaultDice(
    entityStore.entityAttributes,
    "casting",
    diceStore.defaultDiceSettings,
    {}, // TODO: fetch diceToggles from character store, probably
    diceComment.value
  );
});
const showUseButton = computed(
  () =>
    props.ability.custom_fields?.cost &&
    !props.ability.custom_fields.cost.passive
);
</script>
