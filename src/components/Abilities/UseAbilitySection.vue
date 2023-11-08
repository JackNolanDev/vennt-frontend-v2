<template>
  <div v-if="castingDice" class="card mt-8 padded thin column">
    <ToggleableDiceSectionCopyable
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
  <AbilityTinkerItem
    v-if="ability.custom_fields?.build_dc"
    :ability="ability"
  ></AbilityTinkerItem>
</template>

<script setup lang="ts">
import { useDiceStore } from "@/stores/dice";
import { useEntityStore } from "@/stores/entity";
import { defaultDice, type FullEntityAbility } from "vennt-library";
import { computed } from "vue";
import ToggleableDiceSectionCopyable from "../Dice/ToggleableDiceSectionCopyable.vue";
import UseAbilityButton from "./UseAbilityButton.vue";
import AbilityTinkerItem from "./AbilityTinkerItem.vue";

const props = defineProps<{ ability: FullEntityAbility }>();
const entityStore = useEntityStore();
const diceStore = useDiceStore();

const diceComment = computed(() => `Casting ${props.ability.name}`);
const castingDice = computed(() => {
  if (!props.ability.custom_fields?.cast_dl) {
    return false;
  }
  return defaultDice(
    entityStore.computedAttributes,
    "casting",
    diceStore.defaultDiceSettings,
    entityStore.diceToggles,
    diceComment.value,
  );
});
const showUseButton = computed(
  () =>
    ((props.ability.custom_fields?.cost &&
      !props.ability.custom_fields.cost.passive) ||
      props.ability.uses?.heal) &&
    !props.ability.uses?.hide_default_use_button,
);
</script>
