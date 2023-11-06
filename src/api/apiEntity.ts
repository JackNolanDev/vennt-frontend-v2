import {
  fullCollectedEntityValidator,
  fullEntityValidator,
  type FullCollectedEntity,
  type FullEntity,
  type UpdateEntityAttributes,
  type FilterChangelogBody,
  type UncompleteEntityItem,
  type FullEntityItem,
  fullItemValidator,
  type UncompleteEntityAbility,
  type FullEntityAbility,
  fullAbilityValidator,
  type EntityAttribute,
  type FullEntityChangelog,
  fullAttributeChangelogValidator,
  type UncompleteCollectedEntityWithChangelog,
  type PartialEntity,
  type UncompleteEntityText,
  type FullEntityText,
  fullEntityTextValidator,
  type EntityTextKey,
  type FullEntityFlux,
  type PartialEntityFlux,
  type UncompleteEntityFlux,
  fullEntityFluxValidator,
  fullCollectedEntityWithChangelogValidator,
  type FullCollectedEntityWithChangelog,
} from "vennt-library";
import api from "./apiInstance";
import { authConfig, wrapAPI } from "./utils";
import { z } from "zod";

export const addCollectedEntityApi = (
  request: UncompleteCollectedEntityWithChangelog
): Promise<FullCollectedEntity> => {
  return wrapAPI(
    () => api.post("/entity", request, authConfig()),
    fullCollectedEntityValidator
  );
};

export const listEntitiesApi = (): Promise<FullEntity[]> => {
  return wrapAPI(
    () => api.get(`/entity`, authConfig()),
    fullEntityValidator.array()
  );
};

export const fetchCollectedEntityApi = (
  entityId: string,
  campaign_id?: string
): Promise<FullCollectedEntity> => {
  return wrapAPI(
    () =>
      api.get(`/entity/${entityId}`, authConfig({ params: { campaign_id } })),
    fullCollectedEntityValidator
  );
};

export const fetchCollectedEntityFullApi = (
  entityId: string,
  campaign_id?: string
): Promise<FullCollectedEntityWithChangelog> => {
  return wrapAPI(
    () =>
      api.get(
        `/entity/${entityId}/full`,
        authConfig({ params: { campaign_id } })
      ),
    fullCollectedEntityWithChangelogValidator
  );
};

export const updateEntityApi = (
  entityId: string,
  request: PartialEntity,
  campaign_id?: string
): Promise<FullEntity> => {
  return wrapAPI(
    () =>
      api.patch(
        `/entity/${entityId}`,
        request,
        authConfig({ params: { campaign_id } })
      ),
    fullEntityValidator
  );
};

export const deleteEntityApi = (entityId: string): Promise<boolean> => {
  return wrapAPI(
    () => api.delete(`/entity/${entityId}`, authConfig()),
    z.boolean()
  );
};

export const updateEntityAttributesApi = (
  entityId: string,
  request: UpdateEntityAttributes,
  campaign_id?: string
): Promise<FullEntity> => {
  return wrapAPI(
    () =>
      api.patch(
        `/entity/${entityId}/attributes`,
        request,
        authConfig({ params: { campaign_id } })
      ),
    fullEntityValidator
  );
};

export const filterEntityChangelogApi = (
  entityId: string,
  request: FilterChangelogBody,
  campaign_id?: string
): Promise<boolean> => {
  return wrapAPI(
    () =>
      api.patch(
        `/entity/${entityId}/changelog`,
        request,
        authConfig({ params: { campaign_id } })
      ),
    z.boolean()
  );
};

export const fetchEntityChangelogApi = (
  entityId: string,
  attr: EntityAttribute,
  campaign_id?: string
): Promise<FullEntityChangelog[]> => {
  return wrapAPI(
    () =>
      api.get(
        `/entity/${entityId}/changelog/${attr}`,
        authConfig({ params: { campaign_id } })
      ),
    fullAttributeChangelogValidator.array()
  );
};

export const addAbilitiesApi = (
  entityId: string,
  request: UncompleteEntityAbility[],
  campaign_id?: string
): Promise<FullEntityAbility[]> => {
  return wrapAPI(
    () =>
      api.post(
        `/entity/${entityId}/abilities`,
        request,
        authConfig({ params: { campaign_id } })
      ),
    fullAbilityValidator.array()
  );
};

export const addItemsApi = (
  entityId: string,
  request: UncompleteEntityItem[],
  campaign_id?: string
): Promise<FullEntityItem[]> => {
  return wrapAPI(
    () =>
      api.post(
        `/entity/${entityId}/items`,
        request,
        authConfig({ params: { campaign_id } })
      ),
    fullItemValidator.array()
  );
};

export const addEntityTextApi = (
  entityId: string,
  request: UncompleteEntityText,
  campaign_id?: string
): Promise<FullEntityText> => {
  return wrapAPI(
    () =>
      api.post(
        `/entity/${entityId}/text`,
        request,
        authConfig({ params: { campaign_id } })
      ),
    fullEntityTextValidator
  );
};

export const updateEntityTextApi = (
  entityId: string,
  key: EntityTextKey,
  text: string,
  campaign_id?: string
): Promise<boolean> => {
  return wrapAPI(
    () =>
      api.put(
        `/entity/${entityId}/text/${key}`,
        { text },
        authConfig({ params: { campaign_id } })
      ),
    z.boolean()
  );
};

export const updateEntityTextPermissionApi = (
  entityId: string,
  key: EntityTextKey,
  newPermission: boolean,
  campaign_id?: string
): Promise<boolean> => {
  return wrapAPI(
    () =>
      api.put(
        `/entity/${entityId}/text/${key}/permission`,
        {
          public: newPermission,
        },
        authConfig({ params: { campaign_id } })
      ),
    z.boolean()
  );
};

export const deleteEntityTextApi = (
  entityId: string,
  key: EntityTextKey,
  campaign_id?: string
): Promise<boolean> => {
  return wrapAPI(
    () =>
      api.delete(
        `/entity/${entityId}/text/${key}`,
        authConfig({ params: { campaign_id } })
      ),
    z.boolean()
  );
};

export const addFluxApi = (
  entityId: string,
  request: UncompleteEntityFlux,
  campaign_id?: string
): Promise<FullEntityFlux> => {
  return wrapAPI(
    () =>
      api.post(
        `/entity/${entityId}/flux`,
        request,
        authConfig({ params: { campaign_id } })
      ),
    fullEntityFluxValidator
  );
};

export const updateFluxApi = (
  entityId: string,
  fluxId: string,
  request: PartialEntityFlux,
  campaign_id?: string
): Promise<FullEntityFlux> => {
  return wrapAPI(
    () =>
      api.patch(
        `/entity/${entityId}/flux/${fluxId}`,
        request,
        authConfig({ params: { campaign_id } })
      ),
    fullEntityFluxValidator
  );
};

export const deleteFluxApi = (
  entityId: string,
  fluxId: string,
  campaign_id?: string
): Promise<boolean> => {
  return wrapAPI(
    () =>
      api.delete(
        `/entity/${entityId}/flux/${fluxId}`,
        authConfig({ params: { campaign_id } })
      ),
    z.boolean()
  );
};
