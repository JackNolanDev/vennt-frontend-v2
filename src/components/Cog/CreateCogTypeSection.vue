<template>
  <BaseRadioButtons
    :selected="cogCreateStore.options.type"
    :options="cogTypeOptions"
    @selected-updated="updateType"
  ></BaseRadioButtons>
  <BaseDropDown title="Attribute Level Overrides" class="mt-8">
    <div class="attrOverrideGrid gap mt-8 mb-8 ml-8 mr-8">
      <div v-for="attr in ATTRIBUTES" :key="attr" class="alignRow gap">
        <label :for="overrideDropDownId(attr)" class="labelText attrLabel">
          {{ attrShortName(attr) }}:
        </label>
        <select
          v-model="cogCreateStore.options.attrOverrides[attr]"
          class="input"
          :id="overrideDropDownId(attr)"
          @blur="cogCreateStore.saveToLocalStorage()"
        >
          <option :value="undefined">Use Default</option>
          <option
            v-for="option in COG_ATTRIBUTE_LEVELS"
            :key="option"
            :value="option"
          >
            {{ option }}
          </option>
        </select>
      </div>
    </div>
  </BaseDropDown>
</template>

<script setup lang="ts">
import { useCogCreateStore } from "@/stores/cogCreate";
import { COG_ATTRIBUTE_LEVELS } from "vennt-library";
import { cogTypeOptions } from "@/utils/copy/createCogTypeOptions";
import BaseDropDown from "../Base/BaseDropDown.vue";
import BaseRadioButtons from "../Base/BaseRadioButtons.vue";
import { ATTRIBUTES, type BaseEntityAttribute } from "vennt-library";
import { attrShortName } from "@/utils/attributeUtils";

const cogCreateStore = useCogCreateStore();

const updateType = (type: string) => {
  cogCreateStore.options.type = type;
  cogCreateStore.options.attrOverrides = {}; // reset overrides
  cogCreateStore.saveToLocalStorage();
};

const overrideDropDownId = (attr: BaseEntityAttribute) =>
  `create-cog-override-${attr}`;
</script>

<style scoped>
.attrLabel {
  min-width: 56px;
}
.attrOverrideGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr [col-start]);
}

@container page (max-width: 600px) {
  .attrOverrideGrid {
    grid-template-columns: repeat(2, 1fr [col-start]);
  }
}
@container page (max-width: 450px) {
  .attrOverrideGrid {
    grid-template-columns: repeat(1, 1fr [col-start]);
  }
}
</style>
