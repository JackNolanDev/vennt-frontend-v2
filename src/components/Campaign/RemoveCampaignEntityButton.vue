<template>
  <ConfirmationModal
    trigger-icon="person_remove"
    :id="`campaign-rm-${entity.entity_id}`"
    @main-button="removeCampaignEntity"
    ><template #title
      >Remove {{ titleText(entity.type) }} from Campaign</template
    ><template #mainButton>Remove</template>Are you sure you want to remove
    {{ entity.name }} from this campaign? Once removed, you can add this entity
    back.
  </ConfirmationModal>
</template>

<script setup lang="ts">
import { titleText, type CampaignEntity } from "vennt-library";
import ConfirmationModal from "../Base/ConfirmationModal.vue";
import { useCampaignStore } from "@/stores/campaign";

const props = defineProps<{ entity: CampaignEntity }>();
const campaignStore = useCampaignStore();

const removeCampaignEntity = () => {
  campaignStore.removeEntityFromCampaign(props.entity.entity_id);
};
</script>
