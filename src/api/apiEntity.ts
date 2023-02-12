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
} from "@/utils/backendTypes";
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
  entityId: string
): Promise<FullCollectedEntity> => {
  return wrapAPI(
    () => api.get(`/entity/${entityId}`, authConfig()),
    fullCollectedEntityValidator
  );
};

export const updateEntity = (
  entityId: string,
  request: PartialEntity[]
): Promise<FullEntity> => {
  return wrapAPI(
    () => api.patch(`/entity/${entityId}`, request, authConfig()),
    fullEntityValidator
  );
};

export const deleteEntity = (entityId: string): Promise<boolean> => {
  return wrapAPI(
    () => api.delete(`/entity/${entityId}`, authConfig()),
    z.boolean()
  );
};

export const updateEntityAttributesApi = (
  entityId: string,
  request: UpdateEntityAttributes
): Promise<FullEntity> => {
  return wrapAPI(
    () => api.patch(`/entity/${entityId}/attributes`, request, authConfig()),
    fullEntityValidator
  );
};

export const filterEntityChangelogApi = (
  entityId: string,
  request: FilterChangelogBody
): Promise<boolean> => {
  return wrapAPI(
    () => api.patch(`/entity/${entityId}/changelog`, request, authConfig()),
    z.boolean()
  );
};

export const fetchEntityChangelogApi = (
  entityId: string,
  attr: EntityAttribute
): Promise<FullEntityChangelog[]> => {
  return wrapAPI(
    () => api.get(`/entity/${entityId}/changelog/${attr}`, authConfig()),
    fullAttributeChangelogValidator.array()
  );
};

export const addAbilitiesApi = (
  entityId: string,
  request: UncompleteEntityAbility[]
): Promise<FullEntityAbility[]> => {
  return wrapAPI(
    () => api.post(`/entity/${entityId}/abilities`, request, authConfig()),
    fullAbilityValidator.array()
  );
};

export const addItemsApi = (
  entityId: string,
  request: UncompleteEntityItem[]
): Promise<FullEntityItem[]> => {
  return wrapAPI(
    () => api.post(`/entity/${entityId}/items`, request, authConfig()),
    fullItemValidator.array()
  );
};

export const addEntityTextApi = (
  entityId: string,
  request: UncompleteEntityText
): Promise<FullEntityText> => {
  return wrapAPI(
    () => api.post(`/entity/${entityId}/text`, request, authConfig()),
    fullEntityTextValidator
  );
};

export const updateEntityTextApi = (
  entityId: string,
  key: EntityTextKey,
  text: string
): Promise<boolean> => {
  return wrapAPI(
    () => api.put(`/entity/${entityId}/text/${key}`, { text }, authConfig()),
    z.boolean()
  );
};

export const updateEntityTextPermissionApi = (
  entityId: string,
  key: EntityTextKey,
  newPermission: boolean
): Promise<boolean> => {
  return wrapAPI(
    () =>
      api.put(
        `/entity/${entityId}/text/${key}/permission`,
        {
          public: newPermission,
        },
        authConfig()
      ),
    z.boolean()
  );
};

export const deleteEntityTextApi = (
  entityId: string,
  key: EntityTextKey
): Promise<boolean> => {
  return wrapAPI(
    () => api.delete(`/entity/${entityId}/text/${key}`, authConfig()),
    z.boolean()
  );
};

export const addFluxApi = (
  entityId: string,
  request: UncompleteEntityFlux
): Promise<FullEntityFlux> => {
  return wrapAPI(
    () => api.post(`/entity/${entityId}/flux`, request, authConfig()),
    fullEntityFluxValidator
  );
};

export const updateFluxApi = (
  entityId: string,
  fluxId: string,
  request: PartialEntityFlux
): Promise<FullEntityFlux> => {
  return wrapAPI(
    () =>
      api.patch(`/entity/${entityId}/flux/${fluxId}`, request, authConfig()),
    fullEntityFluxValidator
  );
};

export const deleteFluxApi = (
  entityId: string,
  fluxId: string
): Promise<boolean> => {
  return wrapAPI(
    () => api.delete(`/entity/${entityId}/flux/${fluxId}`, authConfig()),
    z.boolean()
  );
};
