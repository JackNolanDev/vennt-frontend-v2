<template>
  <form>
    <h2 v-if="givenItem">Edit "{{ givenItem?.name }}"</h2>
    <h2 v-else>New Item</h2>
    <label for="new-item-name" class="labelText">Name:</label>
    <input
      type="text"
      v-model="state.name"
      placeholder="Donut"
      title="Enter the name of your item"
      id="new-item-name"
      class="input wide mt-4 mb-16"
    />
    <label for="new-item-bulk" class="labelText">
      {{ state.type === ITEM_TYPE_CONTAINER ? "Storage Capacity" : "Bulk" }}:
    </label>
    <input
      type="number"
      inputmode="numeric"
      v-model="state.bulk"
      placeholder="0"
      title="Enter the bulk of your item"
      id="new-item-bulk"
      class="input wide mt-4 mb-16"
    />
    <label class="labelText">Description:</label>
    <BaseInlineTextEditor
      v-model="state.desc"
      placeholder="Just a donut"
      class="mt-4 mb-16"
    ></BaseInlineTextEditor>
    <label for="new-item-type" class="labelText">Type</label>
    <select
      v-model="state.type"
      id="new-item-type"
      class="input wide mt-4 mb-16"
    >
      <option v-for="(str, key) in itemTypeOptions" :key="key" :value="key">
        {{ str }}
      </option>
    </select>
    <div
      v-if="state.type === ITEM_TYPE_ARMOR"
      class="card column padded thin mb-16"
    >
      <h3 class="mt-0 mb-16">Armor Options</h3>
      <label for="new-item-armor-armor" class="labelText">Armor:</label>
      <input
        type="number"
        inputmode="numeric"
        v-model="state.armorArmor"
        placeholder="1"
        title="Armor this item grants when used"
        id="new-item-armor-armor"
        class="input wide mt-4 mb-16"
      />
      <label for="new-item-armor-burden" class="labelText">Burden:</label>
      <input
        type="number"
        inputmode="numeric"
        v-model="state.armorBurden"
        placeholder="1"
        title="Burden caused by using this item"
        id="new-item-armor-burden"
        class="input wide mt-4 mb-16"
      />
    </div>
    <div
      v-if="state.type === ITEM_TYPE_SHIELD"
      class="card column padded thin mb-16"
    >
      <h3 class="mt-0 mb-16">Shield Options</h3>
      <label for="new-item-shield-shield" class="labelText">Shield:</label>
      <input
        type="number"
        inputmode="numeric"
        v-model="state.shieldShield"
        placeholder="1"
        title="Shield this item grants when used"
        id="new-item-shield-shield"
        class="input wide mt-4 mb-16"
      />
      <label for="new-item-shield-burden" class="labelText">Burden:</label>
      <input
        type="number"
        inputmode="numeric"
        v-model="state.shieldBurden"
        placeholder="1"
        title="Burden caused by using this item"
        id="new-item-shield-burden"
        class="input wide mt-4 mb-16"
      />
    </div>
    <div
      v-if="state.type === ITEM_TYPE_WEAPON"
      class="card column padded thin mb-16"
    >
      <h3 class="mt-0 mb-16">Weapon Options</h3>
      <label for="new-item-weapon-attr" class="labelText">Attribute:</label>
      <input
        type="text"
        v-model="state.weaponAttr"
        placeholder="dex + str"
        title="attribute for the weapon - can also be a formula involving attributes"
        id="new-item-weapon-attr"
        class="input wide mt-4 mb-16"
      />
      <label for="new-item-weapon-dmg" class="labelText">Damage:</label>
      <input
        type="text"
        v-model="state.weaponDmg"
        placeholder="1d6+5"
        title="weapon's damage dice"
        id="new-item-weapon-dmg"
        class="input wide mt-4 mb-16"
      />
      <label for="new-item-weapon-range" class="labelText">Range:</label>
      <input
        type="text"
        v-model="state.weaponRange"
        placeholder="15m"
        title="weapon's damage dice"
        id="new-item-weapon-range"
        class="input wide mt-4 mb-16"
      />
      <div v-if="weaponCategoryOptions">
        <label for="new-item-weapon-cat" class="labelText">Category:</label>
        <select
          v-model="state.weaponCategory"
          id="new-item-weapon-cat"
          class="input wide mt-4 mb-16"
        >
          <option
            v-for="weaponType in weaponCategoryOptions"
            :key="weaponType"
            :value="weaponType"
          >
            {{ weaponType }}
          </option>
        </select>
      </div>
      <label for="new-item-weapon-type" class="labelText">Weapon type:</label>
      <input
        type="text"
        v-model="state.weaponType"
        placeholder="Melee"
        title="weapon's damage dice"
        id="new-item-weapon-type"
        class="input wide mt-4 mb-16"
      />
    </div>
    <BaseDropDown class="mb-16">
      <template #closedTitle>Show additional options</template>
      <template #openTitle>Hide additional options</template>
      <div class="mt-8 mb-8 ml-8 mr-8">
        <label for="new-item-courses" class="labelText">Courses:</label>
        <textarea
          v-model="state.courses"
          placeholder="Combat"
          id="new-item-courses"
          class="input mt-4 mb-16"
        ></textarea>
        <label for="new-item-special" class="labelText">Special:</label>
        <textarea
          v-model="state.special"
          :placeholder="specialPlaceholder"
          id="new-item-special"
          class="input mt-4 mb-16"
        ></textarea>
        <label class="labelText">Comment:</label>
        <BaseInlineTextEditor
          v-model="state.comment"
          placeholder="notes about item"
          class="mt-4 mb-16"
        ></BaseInlineTextEditor>
      </div>
      <BaseCheckBox
        :checked="state.defineActive"
        :useToggle="true"
        :highlight="true"
        @click="state.defineActive = !state.defineActive"
        >Ignore default behavior</BaseCheckBox
      >
      <BaseCheckBox
        :checked="itemActive"
        :disabled="!state.defineActive"
        :highlight="true"
        @click="state.active = !state.active"
        >Item Active</BaseCheckBox
      >
    </BaseDropDown>
    <BaseButton
      :disabled="buttonDisabled"
      @click="addItemButton"
      class="primary center wide"
    >
      {{ givenItem ? "Edit" : "Add" }} item
    </BaseButton>
    <div v-if="showPreview">
      <div class="separator mt-16 mb-16"></div>
      <h2>Item Preview:</h2>
      <div class="card column padded thin">
        <DisplayUncompleteItemFull :item="newItem"></DisplayUncompleteItemFull>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import {
  itemValidator,
  type EntityItemType,
  type UncompleteEntityItem,
  ITEM_TYPE_CONTAINER,
  ITEM_TYPE_ARMOR,
  ITEM_TYPE_SHIELD,
  ITEM_TYPE_WEAPON,
  type UsesMap,
  type FullEntityItem,
} from "@/utils/backendTypes";
import { computed, reactive } from "vue";
import BaseButton from "../Base/BaseButton.vue";
import BaseInlineTextEditor from "../Base/BaseInlineTextEditor.vue";
import { useEntityStore } from "@/stores/entity";
import BaseDropDown from "../Base/BaseDropDown.vue";
import { itemActiveDirectFields } from "@/utils/itemUtils";
import BaseCheckBox from "../Base/BaseCheckBox.vue";
import DisplayUncompleteItemFull from "./DisplayUncompleteItemFull.vue";
import { useJsonStore } from "@/stores/jsonStorage";
import { editorEmpty } from "@/utils/textUtils";

// TODO: support editing uses

const props = defineProps<{ givenItem?: FullEntityItem }>();

interface NewItemState {
  name: string;
  desc: string;
  bulk: string;
  type: EntityItemType;
  armorArmor: string;
  armorBurden: string;
  shieldShield: string;
  shieldBurden: string;
  weaponAttr: string;
  weaponDmg: string;
  weaponRange: string;
  weaponCategory: string;
  weaponType: string;
  courses: string;
  special: string;
  comment: string;
  defineActive: boolean;
  active: boolean;
}

const initialState: NewItemState = {
  name: props.givenItem?.name ?? "",
  desc: props.givenItem?.desc ?? "",
  bulk: props.givenItem?.bulk.toString() ?? "0",
  type: props.givenItem?.type ?? "equipment",
  armorArmor: props.givenItem?.uses?.adjust?.attr.armor?.toString() ?? "",
  armorBurden: props.givenItem?.uses?.adjust?.attr.burden?.toString() ?? "",
  shieldShield: props.givenItem?.uses?.adjust?.attr.shield?.toString() ?? "",
  shieldBurden: props.givenItem?.uses?.adjust?.attr.burden?.toString() ?? "",
  weaponAttr: props.givenItem?.custom_fields?.attr ?? "",
  weaponDmg: props.givenItem?.custom_fields?.dmg ?? "",
  weaponRange: props.givenItem?.custom_fields?.range ?? "",
  weaponCategory: props.givenItem?.custom_fields?.category ?? "",
  weaponType: props.givenItem?.custom_fields?.weapon_type ?? "",
  courses: props.givenItem?.custom_fields?.courses ?? "",
  special: props.givenItem?.custom_fields?.special ?? "",
  comment: props.givenItem?.comment ?? "",
  defineActive: false,
  active: props.givenItem?.active ?? false,
};

const state = reactive({ ...initialState });
const emit = defineEmits<{ (e: "submitted"): void }>();
const entityStore = useEntityStore();
const jsonStorage = useJsonStore();
jsonStorage.fetchWeaponTypes();

const itemTypeOptions: Record<EntityItemType, string> = {
  equipment: "Equipment",
  consumable: "Consumable",
  container: "Container",
  armor: "Armor",
  shield: "Shield",
  weapon: "Weapon",
};

const weaponCategoryOptions = computed(() =>
  jsonStorage.weaponTypes
    .map((type) => type.category)
    .filter((category) => category)
);

const itemActive = computed(() =>
  state.defineActive
    ? state.active
    : itemActiveDirectFields(
        state.type,
        state.weaponCategory,
        entityStore.entity
      )
);

const specialPlaceholder = computed(() => {
  switch (state.type) {
    case ITEM_TYPE_ARMOR:
    case ITEM_TYPE_SHIELD:
      return "# of hands to wield";
    case ITEM_TYPE_WEAPON:
      return "# of hands to wield and special effects of using this weapon";
    default:
      return "Special details about the item";
  }
});

const baseUses = computed((): UsesMap => {
  if (state.type === ITEM_TYPE_ARMOR) {
    return {
      adjust: {
        time: "permanent",
        attr: {
          armor: parseInt(state.armorArmor),
          burden: parseInt(state.armorBurden),
        },
      },
    };
  } else if (state.type === ITEM_TYPE_SHIELD) {
    return {
      adjust: {
        time: "permanent",
        attr: {
          shield: parseInt(state.shieldShield),
          burden: parseInt(state.shieldShield),
        },
      },
    };
  }
  return {};
});

const newItem = computed((): UncompleteEntityItem => {
  const item: UncompleteEntityItem = {
    name: state.name,
    bulk: parseInt(state.bulk),
    desc: state.desc,
    type: state.type,
    active: itemActive.value,
    comment: state.comment,
    custom_fields: {
      courses: state.courses,
      special: state.special,
    },
    uses: baseUses.value,
  };
  if (item.custom_fields && state.type === ITEM_TYPE_WEAPON) {
    item.custom_fields.attr = state.weaponAttr;
    item.custom_fields.dmg = state.weaponDmg;
    item.custom_fields.category = state.weaponCategory;
    item.custom_fields.range = state.weaponRange;
    item.custom_fields.weapon_type = state.weaponType;
  }
  return item;
});
const buttonDisabled = computed(
  () => !itemValidator.safeParse(newItem.value).success
);
const showPreview = computed(() => !editorEmpty(state.name));

const addItemButton = () => {
  if (props.givenItem) {
    entityStore.updateItem(props.givenItem.id, newItem.value);
  } else {
    entityStore.addItems([newItem.value], true);
  }
  emit("submitted");
  Object.entries(initialState).forEach(([key, val]) => {
    // @ts-ignore
    state[key] = val;
  });
};
</script>
