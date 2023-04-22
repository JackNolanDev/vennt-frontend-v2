<template>
  <ConfirmationModal :no-main-button="true" :id="MODAL_ID" triggerClass="wide">
    <template #triggerButton>Add Gift Boon</template>
    <template #title>Choose a gift boon</template>
    <p class="labelText mt-0 mb-4">
      Current gift: <b>{{ entityStore.entity?.entity.other_fields.gift }}</b>
    </p>
    <BaseButton
      v-for="(giftBoon, choice) in giftBoonCopy"
      :key="choice"
      @click="addGiftBoon(giftBoon.ability)"
      class="wide"
    >
      Add {{ choice }}<span class="muted-text ml-4">({{ giftBoon.gift }})</span>
    </BaseButton>
  </ConfirmationModal>
</template>

<script setup lang="ts">
import BaseButton from "@/components/Base/BaseButton.vue";
import ConfirmationModal from "@/components/Base/ConfirmationModal.vue";
import { useEntityStore } from "@/stores/entity";
import type { EntityAbility } from "@/utils/backendTypes";
import { giftBoonCopy } from "@/utils/copy/giftBoonsCopy";

const entityStore = useEntityStore();

const MODAL_ID = "entity-update-gift-boon-modal";

const addGiftBoon = (boon: EntityAbility) => {
  entityStore.addAbilities([boon]);
  const dialog = document.getElementById(MODAL_ID) as HTMLDialogElement | null;
  dialog?.close();
};
</script>
