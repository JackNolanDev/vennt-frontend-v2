<template>
  <img
    :src="`/images/weapons/${srcImgName}.light.svg`"
    alt=""
    width="40"
    height="40"
  />
</template>

<script setup lang="ts">
import type { EntityItem, ShopItem } from "@/utils/backendTypes";
import { computed } from "vue";

const props = defineProps<{ item: EntityItem | ShopItem }>();

const srcImgName = computed(() => {
  const category =
    (props.item as EntityItem).custom_fields?.category ??
    (props.item as ShopItem).category;
  switch (category) {
    case "Aggressive":
      return "mace-head";
    case "Arcane":
      return "magic-swirl";
    case "Balanced":
      return "two-handed-sword";
    case "Blade":
      return "switchblade";
    case "Bow":
      return "high-shot";
    case "Brawling":
      return "brass-knuckles";
    case "Brutal":
      return "battle-axe";
    case "Cannon":
      return "crossbow";
    case "Great":
      return "broadsword";
    case "Grenade":
      return "grenade";
    case "Hookwhip":
      return "hook-whip";
    case "Improvised":
      return "wooden-chair-askew";
    case "Polearm":
      return "spear-hook";
    case "Protector":
      return "spiked-shield";
    case "Rifle":
      return "musket";
    case "Shotgun":
      return "blunderbuss";
    case "Sidearm":
      return "revolver";
    case "Thrown":
      return "shuriken";
    case "Tinkertech":
      return "gears";
    case "Unarmed":
      return "punch";
    case "Whip":
      return "whip";
  }
  const weaponType =
    (props.item as EntityItem).custom_fields?.weapon_type ??
    (props.item as ShopItem).weapon_type;
  if (weaponType?.includes("Ranged")) {
    return "revolver";
  }
  return "broadsword";
});
</script>
