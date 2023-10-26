<template>
  <BaseCheckBox
    v-for="toggle in relevantToggles"
    :key="toggle.name"
    :checked="toggle.toggled"
    :use-toggle="true"
    :highlight="true"
    :title="`From ${toggle.name}`"
    @click="optionToggled(toggle)"
    class="wide"
    ><div class="wrap">
      {{
        toggle.label ? `(${toggle.name}) ${toggle.label}` : `Use ${toggle.name}`
      }}
    </div></BaseCheckBox
  >
</template>

<script setup lang="ts">
import { useDiceStore } from "@/stores/dice";
import { useEntityStore } from "@/stores/entity";
import type { DiceToggle, EntityAttribute } from "@/utils/backendTypes";
import { computed } from "vue";
import BaseCheckBox from "../Base/BaseCheckBox.vue";

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
            toggle.default
        );
        acc.push({ ...toggle, name: key, toggled });
      }
      return acc;
    },
    []
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
