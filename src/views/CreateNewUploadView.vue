<template>
  <BaseLayout class="nav">
    <template #nav><BaseNav></BaseNav></template>
    <PageLayout class="large">
      <h1 class="centeredText">UPLOAD ENTITY</h1>
      <form class="mb-256">
        <div class="card column padded">
          <label for="new-entity-file-upload" class="labelText mb-4"
            >Choose an entity JSON file</label
          >
          <input
            @change="fileChange"
            type="file"
            accept=".json"
            id="new-entity-file-upload"
          />
          <p v-if="state.errorMsg" class="errorText">{{ state.errorMsg }}</p>
        </div>
        <div v-if="state.entity" class="card column padded mt-16">
          <ConfirmationModal
            @mainButton="uploadEntity"
            triggerIcon="file_upload"
            triggerClass="wide"
            id="upload-entity-modal"
          >
            <template #triggerButton>Upload Entity</template>
            <template #mainButton>Upload Entity</template>
            <template #title>Complete entity upload</template>
            <p class="mt-0 mb-0">
              This will save a new entity to the server based on the values
              uploaded here. No other entities on the server will be affected.
            </p>
          </ConfirmationModal>
          <h3>Example of data in entity:</h3>
          <pre><code>{{ entityText }}</code></pre>
        </div>
      </form>
    </PageLayout>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from "@/components/Base/BaseLayout.vue";
import BaseNav from "@/components/Base/BaseNav.vue";
import ConfirmationModal from "@/components/Base/ConfirmationModal.vue";
import PageLayout from "@/components/Base/PageLayout.vue";
import { ENTITY_ROUTE } from "@/router";
import { useEntityStore } from "@/stores/entity";
import { entityAttributesMap } from "@/utils/attributeUtils";
import {
  fullCollectedEntityWithChangelogValidator,
  type FullCollectedEntityWithChangelog,
} from "@/utils/backendTypes";
import { getCopyableCogText } from "@/utils/entityUtils";
import { computed, reactive } from "vue";

const state = reactive<{
  entity?: FullCollectedEntityWithChangelog;
  errorMsg?: string;
}>({});

const entityStore = useEntityStore();

const reader = new FileReader();

const fileChange = async (e: Event) => {
  /* @ts-ignore */
  const file: File | undefined = e.target?.files[0];
  if (!file) {
    state.entity = undefined;
    state.errorMsg = "No file selected";
    return;
  }
  state.errorMsg = undefined;
  reader.readAsText(file);
  reader.addEventListener("loadend", fileLoaded, false);
};

const fileLoaded = () => {
  reader.removeEventListener("loadend", fileLoaded, false);
  const result = reader.result;
  if (typeof result !== "string") {
    state.errorMsg = "File did not upload correctly";
    return;
  }
  let parsedObject = null;
  try {
    parsedObject = JSON.parse(result);
  } catch {
    state.errorMsg = "File was not a valid JSON file";
    return;
  }
  const parsed =
    fullCollectedEntityWithChangelogValidator.safeParse(parsedObject);
  if (parsed.success) {
    state.entity = parsed.data;
  } else {
    state.entity = undefined;
    state.errorMsg = parsed.error.message;
  }
};

const entityText = computed(() => {
  if (!state.entity) {
    return "";
  }
  const entityAttrs = entityAttributesMap(state.entity);
  return getCopyableCogText(state.entity, entityAttrs);
});

const uploadEntity = () => {
  if (!state.entity) {
    return;
  }
  entityStore.addCollectedEntity(state.entity, { redirectName: ENTITY_ROUTE });
};
</script>
