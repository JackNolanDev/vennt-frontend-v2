<template>
  <AbilityTable
    :abilities="BASIC_ACTIONS"
    :attrs="entityStore.entityAttributes"
  ></AbilityTable>
</template>

<script setup lang="ts">
import type { FullEntityAbility } from "@/utils/backendTypes";
import AbilityTable from "../../Abilities/AbilityTable.vue";
import { useEntityStore } from "@/stores/entity";

const entityStore = useEntityStore();

const BASIC_ACTIONS: FullEntityAbility[] = [
  {
    id: "move",
    entity_id: "",
    name: "Move",
    effect:
      "By spending 1 Action, you can move up to your {{speed}} in hexes. You can Move multiple times per turn.",
    custom_fields: { activation: "1 Action" },
    active: false,
  },
  {
    id: "assist",
    entity_id: "",
    name: "Assist",
    effect:
      "To assist, explain how you help an ally with a check and roll the same check as the ally you're helping. You may spend X MP or twice as much Vim (as narratively appropriate) to gain +Xd6 to your roll. If you roll equal to or higher than your ally, they gain +3 to their check. If you roll lower, they lose -3",
    custom_fields: { activation: "X MP OR 2X Vim" },
    active: false,
  },
  {
    id: "attack",
    entity_id: "",
    name: "Attack",
    effect: "Make a basic attack using an equipped weapon",
    custom_fields: { activation: "2 Actions" },
    active: false,
  },
  {
    id: "delay",
    entity_id: "",
    name: "Delay",
    effect:
      "On your turn, while you still have Actions to spend, you may postpone the remainder of your turn, moving yourself down in the turn order to a position you specify when Delaying.",
    custom_fields: { activation: "Free Action" },
    active: false,
  },
];
</script>
