import {
  addCollectedEntityApi,
  addItemsApi,
  fetchCollectedEntityApi,
  filterEntityChangelogApi,
  updateEntityAttributesApi,
} from "@/api/apiEntity";
import router, { ENTITY_ITEMS_ROUTE } from "@/router";
import type {
  ConsolidatedItem,
  FilterChangelogBody,
  FullCollectedEntity,
  PartialEntityItem,
  UncompleteCollectedEntity,
  UncompleteEntityItem,
  UpdateEntityAttributes,
} from "@/utils/backendTypes";
import { consolidateItemList } from "@/utils/itemUtils";
import { entityAttributesMap } from "@/utils/attributeUtils";
import { defineStore } from "pinia";
import { useCharacterCreateStore } from "./characterCreate";
import { deleteItemApi, updateItemApi } from "@/api/apiItems";

type EntityState = {
  entity: undefined | FullCollectedEntity;
  showNotes: boolean;
  levelsToProcess: number;
};

type AddCollectedEntityOptions = {
  redirectName: string;
  clearCharacterCreation: boolean;
};

export const useEntityStore = defineStore("entity", {
  state: (): EntityState => {
    return {
      entity: undefined,
      showNotes: false,
      levelsToProcess: 0,
    };
  },
  getters: {
    consolidatedItems: (state) =>
      state.entity ? consolidateItemList(state.entity.items) : [],
    entityAttributes: (state) =>
      state.entity ? entityAttributesMap(state.entity) : {},
  },
  actions: {
    toggleNotes() {
      this.showNotes = !this.showNotes;
    },
    async addCollectedEntity(
      request: UncompleteCollectedEntity,
      options?: Partial<AddCollectedEntityOptions>
    ) {
      this.entity = await addCollectedEntityApi(request);
      if (options?.redirectName) {
        router.push({
          name: options.redirectName,
          params: { id: this.entity.entity.id },
        });
      }
      if (options?.clearCharacterCreation) {
        useCharacterCreateStore().clearCharacter();
      }
    },
    async fetchCollectedEntity(id: string) {
      this.entity = await fetchCollectedEntityApi(id);
    },
    async updateEntityAttributes(id: string, request: UpdateEntityAttributes) {
      // TODO: may want to pre-apply the change
      await updateEntityAttributesApi(id, request);
      // this sucks - but also I was running into a weird vue error
      await this.fetchCollectedEntity(id);
    },
    async filterChangelog(id: string, request: FilterChangelogBody) {
      if (this.entity) {
        this.entity.changelog = this.entity.changelog.filter(
          (log) => !request.attributes.includes(log.attr)
        );
      }
      await filterEntityChangelogApi(id, request);
    },
    async addItems(
      items: UncompleteEntityItem[],
      redirectToInventory?: boolean
    ) {
      if (items.length > 0 && this.entity) {
        const newItems = await addItemsApi(this.entity.entity.id, items);
        this.entity.items.push(...newItems);
        if (redirectToInventory && newItems.length > 0) {
          router.push({
            name: ENTITY_ITEMS_ROUTE,
            params: {
              ...router.currentRoute.value.params,
              detail: newItems[0].id,
            },
            query: router.currentRoute.value.query,
          });
        }
      }
    },
    async updateItem(itemId: string, item: PartialEntityItem) {
      if (this.entity) {
        const currentItemIdx = this.entity.items.findIndex(
          (search) => search.id === itemId
        );
        if (currentItemIdx >= 0) {
          this.entity.items[currentItemIdx] = await updateItemApi(itemId, item);
        }
      }
    },
    async deleteItem(item: ConsolidatedItem, closeSidebar?: boolean) {
      const itemId = item.ids[item.ids.length - 1];
      if (this.entity) {
        if (
          closeSidebar &&
          router.currentRoute.value.params.detail === itemId
        ) {
          const routeParams = { ...router.currentRoute.value.params };
          delete routeParams.detail;
          router.push({
            name: router.currentRoute.value.name ?? ENTITY_ITEMS_ROUTE,
            params: routeParams,
            query: router.currentRoute.value.query,
          });
        }
        this.entity.items = this.entity.items.filter(
          (item) => item.id !== itemId
        );
        await deleteItemApi(itemId);
      }
    },
  },
});
