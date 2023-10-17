<template>
  <ConfirmationModal
    @main-button="saveGift"
    @exit-modal="resetState"
    :id="modalId"
    triggerClass="wide"
  >
    <template #triggerButton
      >Edit {{ field === "second_gift" ? "secondary" : "" }} gift</template
    >
    <template #title>Choose a different gift</template>
    <template #mainButton>Save new gift</template>
    <p class="labelText mt-0 mb-4">
      Current gift: <b>{{ entityStore.entity?.entity.other_fields[field] }}</b>
    </p>
    <BaseRadioButtons
      :options="giftOptions"
      :selected="state.gift"
      :unselectable="true"
      @selected-updated="giftSelection"
    ></BaseRadioButtons>
  </ConfirmationModal>
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import {
  CHARACTER_GIFTS,
  type CharacterGift,
  type EntityFields,
  type HTMLString,
} from "@/utils/backendTypes";
import { giftCopy } from "@/utils/copy/giftCopy";
import { reactive } from "vue";
import BaseRadioButtons from "../../Base/BaseRadioButtons.vue";
import ConfirmationModal from "../../Base/ConfirmationModal.vue";

const props = defineProps<{
  field: keyof Pick<EntityFields, "gift" | "second_gift">;
}>();

const modalId = `entity-update-${props.field}-modal`;

const entityStore = useEntityStore();
interface EntitySettingsGiftState {
  gift: CharacterGift | "";
}
const initialState = (): EntitySettingsGiftState => ({
  gift: entityStore.entity?.entity.other_fields[props.field] ?? "",
});
const state = reactive<EntitySettingsGiftState>(initialState());

const giftOptions: Partial<Record<CharacterGift, HTMLString>> = {};
CHARACTER_GIFTS.forEach((gift) => {
  giftOptions[gift] = giftCopy[gift].title;
});

const giftSelection = (gift: string) => {
  state.gift = gift as CharacterGift;
};

const saveGift = () => {
  if (!entityStore.entity) {
    return;
  }
  const other_fields = entityStore.entity?.entity.other_fields;
  other_fields[props.field] = state.gift !== "" ? state.gift : undefined;
  entityStore.updateEntity({ other_fields });
};

const resetState = () => {
  state.gift = entityStore.entity?.entity.other_fields[props.field] ?? "";
};
</script>
