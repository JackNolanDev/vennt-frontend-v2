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
} from "@/utils/backendTypes";
import api from "./apiInstance";
import { wrapAPI } from "./utils";
import { z } from "zod";

export const addCollectedEntityApi = (
  request: UncompleteCollectedEntityWithChangelog
): Promise<FullCollectedEntity> => {
  return wrapAPI(
    () => api.post("/entity", request),
    fullCollectedEntityValidator
  );
};

export const fetchCollectedEntityApi = (
  entityId: string
): Promise<FullCollectedEntity> => {
  return wrapAPI(
    () => api.get(`/entity/${entityId}`),
    fullCollectedEntityValidator
  );
};

export const listEntitiesApi = (): Promise<FullEntity[]> => {
  return wrapAPI(() => api.get(`/entity`), fullEntityValidator.array());
};

export const updateEntityAttributesApi = (
  entityId: string,
  request: UpdateEntityAttributes
): Promise<FullEntity> => {
  return wrapAPI(
    () => api.patch(`/entity/${entityId}/attributes`, request),
    fullEntityValidator
  );
};

export const filterEntityChangelogApi = (
  entityId: string,
  request: FilterChangelogBody
): Promise<boolean> => {
  return wrapAPI(
    () => api.patch(`/entity/${entityId}/changelog`, request),
    z.boolean()
  );
};

export const fetchEntityChangelogApi = (
  entityId: string,
  attr: EntityAttribute
): Promise<FullEntityChangelog[]> => {
  return wrapAPI(
    () => api.get(`/entity/${entityId}/changelog/${attr}`),
    fullAttributeChangelogValidator.array()
  );
};

export const addAbilitiesApi = (
  entityId: string,
  request: UncompleteEntityAbility[]
): Promise<FullEntityAbility[]> => {
  return wrapAPI(
    () => api.post(`/entity/${entityId}/abilities`, request),
    fullAbilityValidator.array()
  );
};

export const addItemsApi = (
  entityId: string,
  request: UncompleteEntityItem[]
): Promise<FullEntityItem[]> => {
  return wrapAPI(
    () => api.post(`/entity/${entityId}/items`, request),
    fullItemValidator.array()
  );
};
