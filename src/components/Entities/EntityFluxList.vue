<template>
  <div v-if="entityStore.entity" class="card column padded">
    <h3 class="mt-0 mb-16">{{ pluralizeName(typeLabel) }}</h3>
    <div v-for="(flux, idx) in state.flux" :key="type + idx">
      <BaseStealthTextEditor
        :display-only="!entityStore.canEdit"
        :placeholder="`${typeLabel} ${idx + 1}`"
        :save-button="true"
        :delete-button="true"
        :delete-subject="type"
        :editor-id="`${type}-${idx}-editor`"
        v-model="flux.text"
        @cancel="cancelEditFlux(flux, idx)"
        @save="editFlux(flux)"
        @delete="deleteFlux(flux)"
        class="wide"
      ></BaseStealthTextEditor>
    </div>
    <div v-if="entityStore.canEdit">
      <BaseButton
        v-if="!state.newFlux"
        @click="showNewFlux"
        icon="add"
        class="primary wide mt-8"
      >
        Add New {{ typeLabel }}
      </BaseButton>
      <div v-else>
        <div class="separator mt-8 mb-8"></div>
        <label class="labelText mb-4">New {{ typeLabel }}</label>
        <BaseFullFeaturedTextEditor
          v-model="state.newFluxText"
          :focus-on-change="state.focusOnNewFlux"
          :placeholder="`New ${typeLabel}`"
          :editor-id="`${type}-new-editor`"
        ></BaseFullFeaturedTextEditor>
        <div class="alignRow gap end mt-4">
          <BaseButton @click="cancelNewFlux" icon="close" class="clear"
            >Cancel</BaseButton
          >
          <BaseButton
            @click="saveNewFlux"
            :disabled="saveFluxDisabled"
            icon="save"
            class="primary"
            >Save</BaseButton
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import { editorEmpty, pluralizeName } from "@/utils/textUtils";
import BaseStealthTextEditor from "../Base/BaseStealthTextEditor.vue";
import type { EntityFluxType, FullEntityFlux } from "@/utils/backendTypes";
import { computed, onBeforeMount, reactive, watch } from "vue";
import BaseButton from "../Base/BaseButton.vue";
import BaseFullFeaturedTextEditor from "../Base/BaseFullFeaturedTextEditor.vue";

const props = defineProps<{ type: EntityFluxType }>();
const entityStore = useEntityStore();

interface EntityFluxState {
  newFlux: boolean;
  newFluxText: string;
  flux: FullEntityFlux[];
  focusOnNewFlux: number;
}

const state = reactive<EntityFluxState>({
  newFlux: false,
  newFluxText: "",
  flux: [],
  focusOnNewFlux: 0,
});

onBeforeMount(() => {
  if (entityStore.entity) {
    state.flux = entityStore.entity.flux
      .filter((flux) => flux.type === props.type)
      .map((flux) => ({ open: false, ...flux }));
  }
});

watch(
  () => entityStore.entity?.flux.length,
  () => {
    if (!entityStore.entity) return;
    const newFlux = entityStore.entity.flux
      .filter((entityFlux) =>
        state.flux.every((flux) => entityFlux.id !== flux.id)
      )
      .map((newFlux) => ({ ...newFlux, open: false }));
    state.flux = state.flux
      .filter(
        (flux) =>
          !entityStore.entity?.flux.every(
            (entityFlux) => entityFlux.id !== flux.id
          )
      )
      .concat(newFlux);
  }
);

const typeLabel = computed(() => {
  const lowercased = props.type.toLowerCase();
  return lowercased[0].toUpperCase() + lowercased.substring(1);
});

const saveFluxDisabled = computed(() => editorEmpty(state.newFluxText));

const cancelEditFlux = (flux: FullEntityFlux, idx: number) => {
  const currentFlux = entityStore.entity?.flux.find(
    (searchFlux) => searchFlux.id === flux.id
  );
  if (currentFlux) {
    state.flux[idx] = currentFlux;
  }
};

const editFlux = (flux: FullEntityFlux) => {
  entityStore.updateFlux(flux.id, { text: flux.text });
};

const deleteFlux = (flux: FullEntityFlux) => {
  entityStore.deleteFlux(flux.id);
};

const showNewFlux = () => {
  state.newFlux = true;
  setTimeout(() => {
    state.focusOnNewFlux++;
  }, 0);
};

const hideNewFlux = () => {
  state.newFlux = false;
};

const cancelNewFlux = () => {
  state.newFluxText = "";
  hideNewFlux();
};

const saveNewFlux = () => {
  entityStore.saveFlux({ type: props.type, text: state.newFluxText });
  state.newFluxText = "";
  hideNewFlux();
};
</script>
