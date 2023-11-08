import {
  addAbilitiesApi,
  addCollectedEntityApi,
  addEntityTextApi,
  addFluxApi,
  addItemsApi,
  deleteFluxApi,
  fetchCollectedEntityApi,
  updateEntityAttributesApi,
  updateEntityTextApi,
  updateFluxApi,
  deleteEntityApi,
  updateEntityApi,
  updateEntityTextPermissionApi,
  fetchEntityChangelogApi,
  filterEntityChangelogApi,
} from "@/api/apiEntity";
import router, {
  ENTITY_ABILITIES_ROUTE,
  ENTITY_ITEMS_ROUTE,
  HOME_ROUTE,
} from "@/router";
import {
  computeAttributes,
  diceTogglesForEntity,
  type ComputedAttributes,
  type ConsolidatedItem,
  type DiceToggles,
  type EntityAttribute,
  type EntityTextKey,
  type FullCollectedEntity,
  type FullEntityChangelog,
  type PartialEntity,
  type PartialEntityAbility,
  type PartialEntityFlux,
  type PartialEntityItem,
  type UncompleteCollectedEntityWithChangelog,
  type UncompleteEntityAbility,
  type UncompleteEntityFlux,
  type UncompleteEntityItem,
  type UpdateEntityAttributes,
} from "vennt-library";
import { sortAbilities, actualXPCost } from "@/utils/abilityUtils";
import { consolidateItemList } from "@/utils/itemUtils";
import { defineStore } from "pinia";
import { useCharacterCreateStore } from "./characterCreate";
import { deleteItemApi, updateItemApi } from "@/api/apiItems";
import { deleteAbilityApi, updateAbilityApi } from "@/api/apiAbilities";
import { useAccountInfoStore } from "./accountInfo";
import {
  defaultEntityTextPermission,
  getEntityText,
} from "@/utils/entityUtils";
import { useEntityNotesStore } from "./entityNotes";
import { useCogCreateStore } from "./cogCreate";
import { useCampaignStore } from "./campaign";

const setInitialNotes = (entity: FullCollectedEntity) => {
  const foundNotes = getEntityText("NOTES", entity);
  if (foundNotes) {
    useEntityNotesStore().setInitialNotes(foundNotes);
  }
};

interface EntityState {
  entity: undefined | FullCollectedEntity;
  levelsToProcess: number;
  recoveryShockSrc?: string[];
  apisInFlight: Record<string, boolean>;
  changelogs: Record<
    EntityAttribute,
    { fetched: boolean; changelog: FullEntityChangelog[] }
  >;
}

interface AddCollectedEntityOptions {
  redirectName: string;
  clearCharacterCreation: boolean;
  clearCogCreation: boolean;
}

export const useEntityStore = defineStore("entity", {
  state: (): EntityState => {
    return {
      entity: undefined,
      levelsToProcess: 0,
      apisInFlight: {},
      changelogs: {},
    };
  },
  getters: {
    consolidatedItems: (state) =>
      state.entity ? consolidateItemList(state.entity.items) : [],
    computedAttributes: (state): ComputedAttributes => {
      if (!state.entity) {
        return {};
      }
      if (state.entity.entity.computed_attributes) {
        return state.entity.entity.computed_attributes;
      }
      return computeAttributes(state.entity);
    },
    sortedAbilities: (state) =>
      state.entity ? sortAbilities(state.entity.abilities) : [],
    abilityNames: (state) =>
      state.entity ? state.entity.abilities.map((ability) => ability.name) : [],
    isOwner: (state) => {
      const accountInfoStore = useAccountInfoStore();
      return (
        state.entity &&
        accountInfoStore.accountInfo &&
        state.entity.entity.owner === accountInfoStore.accountInfo.id
      );
    },
    canEdit: (state) => {
      const accountInfoStore = useAccountInfoStore();
      const campaignStore = useCampaignStore();
      return (
        state.entity &&
        accountInfoStore.accountInfo &&
        (state.entity.entity.owner === accountInfoStore.accountInfo.id ||
          campaignStore.role === "GM")
      );
    },
    inCombat: (state) => {
      const campaignStore = useCampaignStore();
      return (
        state.entity?.entity.other_fields.in_combat ||
        campaignStore.details?.campaign.in_combat
      );
    },
    backstory: (state) => getEntityText("BACKSTORY", state.entity),
    description: (state) => getEntityText("DESC", state.entity),
    diceToggles(): DiceToggles {
      if (!this.entity) {
        return {};
      }
      return diceTogglesForEntity(this.entity, this.computedAttributes);
    },
    spentXP(): number {
      if (!this.entity) {
        return 0;
      }
      return this.entity.abilities.reduce(
        (sum, ability) =>
          sum + actualXPCost(ability, this.computedAttributes, this.entity),
        0,
      );
    },
  },
  actions: {
    clearLocalEntity() {
      this.entity = undefined;
      this.levelsToProcess = 0;
      this.apisInFlight = {};
      this.changelogs = {};
    },
    async addCollectedEntity(
      request: UncompleteCollectedEntityWithChangelog,
      options?: Partial<AddCollectedEntityOptions>,
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
      if (options?.clearCogCreation) {
        useCogCreateStore().clearCog();
      }
      setInitialNotes(this.entity);
    },
    async fetchCollectedEntity(id: string, campaignId?: string) {
      if (campaignId) {
        useCampaignStore().fetchCampaign(campaignId, true);
      }
      this.entity = await fetchCollectedEntityApi(id, campaignId);
      setInitialNotes(this.entity);
    },
    async updateEntity(request: PartialEntity) {
      if (this.entity) {
        const campaignId = useCampaignStore().details?.campaign.id;
        this.entity.entity = await updateEntityApi(
          this.entity.entity.id,
          request,
          campaignId,
        );
      }
    },
    async deleteEntity() {
      if (this.entity) {
        deleteEntityApi(this.entity.entity.id);
        this.clearLocalEntity();
        router.push({ name: HOME_ROUTE });
      }
    },
    async updateEntityAttributes(id: string, request: UpdateEntityAttributes) {
      if (!this.entity) {
        return;
      }
      // 1. Run updates optimistically
      if (request.message) {
        Object.keys(request.attributes).forEach((attr) => {
          const row: FullEntityChangelog = {
            id: "mock",
            attr,
            time: new Date().toISOString(),
            entity_id: this.entity!.entity.id,
            msg: request.message!,
            prev: this.entity?.entity.attributes[attr],
          };
          const changelog = this.changelogs[attr];
          if (changelog) {
            changelog.changelog.push(row);
          } else {
            this.changelogs[attr] = { fetched: false, changelog: [row] };
          }
        });
      }
      this.entity.entity.attributes = {
        ...this.entity.entity.attributes,
        ...request.attributes,
      };
      // 2. Get real results & use proper values
      const campaignId = useCampaignStore().details?.campaign.id;
      const updatedBaseEntity = await updateEntityAttributesApi(
        id,
        request,
        campaignId,
      );
      this.entity = { ...this.entity, entity: updatedBaseEntity };
    },
    async fetchChangelog(attr: EntityAttribute, force?: boolean) {
      const key = `changelog_${attr}`;
      if (
        !this.entity ||
        this.apisInFlight[key] ||
        (!force && this.changelogs[attr]?.fetched)
      ) {
        return;
      }
      this.apisInFlight[key] = true;
      const campaignId = useCampaignStore().details?.campaign.id;
      const changelog = await fetchEntityChangelogApi(
        this.entity.entity.id,
        attr,
        campaignId,
      );
      this.changelogs[attr] = { fetched: true, changelog };
      this.apisInFlight[key] = false;
    },
    clearChangelog(attrs: EntityAttribute[]) {
      if (!this.entity) {
        return;
      }
      attrs.forEach((attr) => {
        this.changelogs[attr] = { fetched: false, changelog: [] };
      });
      const campaignId = useCampaignStore().details?.campaign.id;
      filterEntityChangelogApi(
        this.entity.entity.id,
        { attributes: attrs },
        campaignId,
      );
    },
    async addAbilities(
      abilities: UncompleteEntityAbility[],
      redirectToAbilities?: boolean,
    ) {
      if (!this.entity || abilities.length <= 0) return;
      const campaignId = useCampaignStore().details?.campaign.id;
      const { abilities: newAbilities, computed_attributes: newAttrs } =
        await addAbilitiesApi(this.entity.entity.id, abilities, campaignId);
      if (newAttrs) {
        this.entity.entity.computed_attributes = newAttrs;
      }
      this.entity.abilities.push(...newAbilities);
      if (redirectToAbilities && newAbilities.length > 0) {
        const query = { ...router.currentRoute.value.query };
        if (query.new === "ability") {
          delete query.new;
        }
        router.push({
          name: ENTITY_ABILITIES_ROUTE,
          params: {
            ...router.currentRoute.value.params,
            detail: newAbilities[0].id,
          },
          query,
        });
      }
    },
    async updateAbility(abilityId: string, ability: PartialEntityAbility) {
      if (this.entity) {
        const currentAbilityIdx = this.entity.abilities.findIndex(
          (search) => search.id === abilityId,
        );
        if (currentAbilityIdx >= 0) {
          const campaignId = useCampaignStore().details?.campaign.id;
          const { ability: updatedAbility, computed_attributes: newAttrs } =
            await updateAbilityApi(abilityId, ability, campaignId);
          if (newAttrs) {
            this.entity.entity.computed_attributes = newAttrs;
          }
          this.entity.abilities[currentAbilityIdx] = updatedAbility;
        }
      }
    },
    async deleteAbility(abilityId: string, closeSidebar?: boolean) {
      if (
        closeSidebar &&
        this.entity &&
        router.currentRoute.value.params.detail === abilityId
      ) {
        const routeParams = { ...router.currentRoute.value.params };
        delete routeParams.detail;
        router.push({
          name: router.currentRoute.value.name ?? ENTITY_ABILITIES_ROUTE,
          params: routeParams,
          query: router.currentRoute.value.query,
        });
      }
      if (!this.entity) return;

      this.entity.abilities = this.entity.abilities.filter(
        (ability) => ability.id !== abilityId,
      );

      const campaignId = useCampaignStore().details?.campaign.id;
      const { computed_attributes: newAttrs } = await deleteAbilityApi(
        abilityId,
        campaignId,
      );
      if (newAttrs) {
        this.entity.entity.computed_attributes = newAttrs;
      }
    },
    async addItems(
      items: UncompleteEntityItem[],
      redirectToInventory?: boolean,
    ) {
      if (!this.entity || items.length <= 0) return;
      const campaignId = useCampaignStore().details?.campaign.id;
      const { items: newItems, computed_attributes: newAttrs } =
        await addItemsApi(this.entity.entity.id, items, campaignId);
      if (newAttrs) {
        this.entity.entity.computed_attributes = newAttrs;
      }
      this.entity.items.push(...newItems);
      if (redirectToInventory && newItems.length > 0) {
        const query = { ...router.currentRoute.value.query };
        if (query.new === "item") {
          delete query.new;
        }
        router.push({
          name: ENTITY_ITEMS_ROUTE,
          params: {
            ...router.currentRoute.value.params,
            detail: newItems[0].id,
          },
          query,
        });
      }
    },
    async updateItem(itemId: string, item: PartialEntityItem) {
      if (!this.entity) return;
      const currentItemIdx = this.entity.items.findIndex(
        (search) => search.id === itemId,
      );
      if (currentItemIdx >= 0) {
        const campaignId = useCampaignStore().details?.campaign.id;
        const { item: updatedItem, computed_attributes: newAttrs } =
          await updateItemApi(itemId, item, campaignId);
        if (newAttrs) {
          this.entity.entity.computed_attributes = newAttrs;
        }
        this.entity.items[currentItemIdx] = updatedItem;
      }
    },
    deleteItem(item: ConsolidatedItem, closeSidebar?: boolean) {
      const itemId = item.ids[item.ids.length - 1];
      if (closeSidebar && router.currentRoute.value.params.detail === itemId) {
        const routeParams = { ...router.currentRoute.value.params };
        delete routeParams.detail;
        router.push({
          name: router.currentRoute.value.name ?? ENTITY_ITEMS_ROUTE,
          params: routeParams,
          query: router.currentRoute.value.query,
        });
      }
      this.deleteItemById(itemId);
    },
    async deleteItemById(itemId: string) {
      if (!this.entity) return;
      this.entity.items = this.entity.items.filter(
        (item) => item.id !== itemId,
      );
      const campaignId = useCampaignStore().details?.campaign.id;
      const { computed_attributes: newAttrs } = await deleteItemApi(
        itemId,
        campaignId,
      );
      if (newAttrs) {
        this.entity.entity.computed_attributes = newAttrs;
      }
    },
    async saveText(key: EntityTextKey, text: string) {
      if (!this.entity) return;
      const foundIdx = this.entity.text.findIndex(
        (search) => search.key === key,
      );
      if (foundIdx < 0) {
        this.apisInFlight[key] = true;
        this.entity.text.push(
          await addEntityTextApi(this.entity.entity.id, {
            key,
            text,
            public: defaultEntityTextPermission(key),
          }),
        );
        this.apisInFlight[key] = false;
      } else {
        if (this.entity.text[foundIdx].text !== text) {
          this.entity.text[foundIdx].text = text;
          this.apisInFlight[key] = true;
          const campaignId = useCampaignStore().details?.campaign.id;
          await updateEntityTextApi(
            this.entity.entity.id,
            key,
            text,
            campaignId,
          );
          this.apisInFlight[key] = false;
        }
      }
    },
    async updateTextPermission(key: EntityTextKey, newPermission: boolean) {
      if (!this.entity) return;
      const foundIdx = this.entity.text.findIndex(
        (search) => search.key === key,
      );
      if (this.entity.text[foundIdx].public !== newPermission) {
        this.entity.text[foundIdx].public = newPermission;
        await updateEntityTextPermissionApi(
          this.entity.entity.id,
          key,
          newPermission,
        );
      }
    },
    async saveFlux(request: UncompleteEntityFlux) {
      if (!this.entity) return;
      const campaignId = useCampaignStore().details?.campaign.id;
      const newFlux = await addFluxApi(
        this.entity.entity.id,
        request,
        campaignId,
      );
      this.entity.flux.push(newFlux);
    },
    updateFlux(fluxId: string, request: PartialEntityFlux) {
      if (!this.entity) return;
      const foundIdx = this.entity.flux.findIndex((flux) => flux.id === fluxId);
      if (foundIdx >= 0) {
        this.entity.flux[foundIdx] = {
          ...this.entity.flux[foundIdx],
          ...request,
        };
      }
      const campaignId = useCampaignStore().details?.campaign.id;
      updateFluxApi(this.entity.entity.id, fluxId, request, campaignId);
    },
    deleteFlux(fluxId: string) {
      if (!this.entity) return;
      this.entity.flux = this.entity.flux.filter((flux) => flux.id !== fluxId);
      const campaignId = useCampaignStore().details?.campaign.id;
      deleteFluxApi(this.entity.entity.id, fluxId, campaignId);
    },
  },
});
