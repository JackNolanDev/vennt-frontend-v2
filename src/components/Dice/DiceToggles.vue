<template>
  <div
    v-for="toggle in relevantToggles"
    :key="toggle.name"
    class="alignRow split"
  >
    <BaseCheckBox
      :checked="toggle.toggled"
      :use-toggle="true"
      :highlight="true"
      :title="`From ${toggle.name}`"
      @click="optionToggled(toggle)"
      class="wide small-text"
      ><div class="wrap">
        {{
          toggle.label
            ? `(${toggle.name}) ${toggle.label}`
            : `Use ${toggle.name}`
        }}
      </div></BaseCheckBox
    ><BaseButton
      v-if="toggle.src?.ability_id"
      :to="{
        name: fallbackEntitySidebarPage($route.name, ENTITY_ABILITIES_ROUTE),
        params: { ...$route.params, detail: toggle.src.ability_id },
        query: $route.query,
      }"
      title="Open this ability"
      icon="info"
      class="small-icon"
    ></BaseButton>
    <BaseButton
      v-if="toggle.src?.item_id"
      :to="{
        name: fallbackEntitySidebarPage($route.name, ENTITY_ITEMS_ROUTE),
        params: { ...$route.params, detail: toggle.src.item_id },
        query: $route.query,
      }"
      title="Open this item"
      icon="info"
      class="small-icon"
    ></BaseButton>
  </div>
</template>

<script setup lang="ts">
import { useDiceStore } from "@/stores/dice";
import { useEntityStore } from "@/stores/entity";
import type { DiceToggle, EntityAttribute } from "vennt-library";
import { computed } from "vue";
import BaseCheckBox from "../Base/BaseCheckBox.vue";
import BaseButton from "../Base/BaseButton.vue";
import { fallbackEntitySidebarPage } from "@/utils/routerUtils";
import { ENTITY_ABILITIES_ROUTE, ENTITY_ITEMS_ROUTE } from "@/router";

const props = defineProps<{ attrs?: EntityAttribute[]; skipKey?: string }>();

const entityStore = useEntityStore();
const diceStore = useDiceStore();

type Toggle = DiceToggle & { name: string; toggled: boolean };

const relevantToggles = computed(() => {
  if (!props.attrs) {
    return [];
  }
  return Object.entries(entityStore.diceToggles).reduce<Toggle[]>(
    (acc, [key, toggle]) => {
      if (
        key !== props.skipKey &&
        (!toggle.attr || props.attrs?.includes(toggle.attr))
      ) {
        const toggled = Boolean(
          (diceStore.defaultDiceSettings.otherToggles ?? {})[key]?.toggled ||
            toggle.default,
        );
        acc.push({ ...toggle, name: key, toggled });
      }
      return acc;
    },
    [],
  );
});

const optionToggled = (toggle: Toggle) => {
  if (!diceStore.defaultDiceSettings.otherToggles) {
    diceStore.defaultDiceSettings.otherToggles = {
      [toggle.name]: { toggled: !toggle.toggled },
    };
  } else {
    diceStore.defaultDiceSettings.otherToggles[toggle.name] = {
      toggled: !toggle.toggled,
    };
  }
};
</script>
