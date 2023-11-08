<template>
  <BaseLayout class="nav">
    <template #nav><BaseNav></BaseNav></template>
    <PageLayout class="medium">
      <h1>Create a new Campaign</h1>
      <form>
        <div class="alignRow gap mb-16">
          <label for="new-campaign-name" class="labelText nowrap"
            >Campaign Name:</label
          >
          <input
            type="text"
            v-model="state.name"
            placeholder="Broken Frontiers"
            title="Enter the name of your campaign"
            id="new-campaign-name"
            class="input wide"
          />
        </div>
        <label class="labelText nowrap">Campaign Description:</label>
        <BaseFullFeaturedTextEditor
          v-model="state.desc"
          placeholder="Basic description of your campaign"
          class="mt-4 mb-64"
        ></BaseFullFeaturedTextEditor>
        <BaseButton
          @click="createCampaign"
          :disabled="requestInvalid"
          class="primary bold wide"
          >Create Campaign</BaseButton
        >
      </form>
    </PageLayout>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseButton from "@/components/Base/BaseButton.vue";
import BaseFullFeaturedTextEditor from "@/components/Base/BaseFullFeaturedTextEditor.vue";
import BaseLayout from "@/components/Base/BaseLayout.vue";
import BaseNav from "@/components/Base/BaseNav.vue";
import PageLayout from "@/components/Base/PageLayout.vue";
import { useCampaignStore } from "@/stores/campaign";
import { editorEmpty } from "@/utils/textUtils";
import { computed, reactive } from "vue";

const campaignStore = useCampaignStore();
const state = reactive({ name: "", desc: "" });
const requestInvalid = computed(
  () => state.name.length === 0 || editorEmpty(state.desc),
);

const createCampaign = () => {
  campaignStore.addCampaign({ ...state }, true);
};
</script>
