<template>
  <form class="combat-stats-panel ml-16 mr-16 mb-64">
    <div class="centeredText">
      <h2>Map Builder</h2>
    </div>
    <div class="separator mt-8 mb-8"></div>
    <div class="alignRow gap">
      <label for="map-builder-size" class="label-text nowrap">Map Size</label>
      <select
        v-model="state.size"
        @change="sizeSelectorUpdated"
        id="map-builder-size"
        class="input"
      >
        <option v-for="(_, size) in mapSizeOptions" :key="size">
          {{ size }}
        </option>
      </select>
    </div>
    <BaseDropDown title="Backgrounds" class="mt-8">
      <div
        v-for="background in BACKGROUNDS"
        :key="background.id"
        :id="background.id"
        draggable="true"
        class="alignRow top gap grabbable mt-8"
      >
        <img
          :src="background.url"
          :alt="background.name"
          draggable="false"
          class="background-img"
        />
        <p>{{ background.name }}</p>
      </div>
    </BaseDropDown>
  </form>
</template>

<script setup lang="ts">
import { useMapBuilder } from "@/stores/mapBuilder";
import { reactive } from "vue";
import BaseDropDown from "../Base/BaseDropDown.vue";
import { BACKGROUNDS } from "@/utils/map/backgrounds";

const mapSizeOptions = {
  small: { height: 20, width: 20 },
  large: { height: 50, width: 50 },
};

const state = reactive<{ size: keyof typeof mapSizeOptions }>({
  size: "small",
});
const mapBuilder = useMapBuilder();

const sizeSelectorUpdated = () => {
  const options = mapSizeOptions[state.size];
  mapBuilder.height = options.height;
  mapBuilder.width = options.width;
};
</script>

<style scoped>
.background-img {
  width: 50%;
  max-height: 200px;
}

.grabbable {
  cursor: grab;
  background-color: var(--background-highlight);
}
.grabbable:active {
  cursor: grabbing;
}
</style>
