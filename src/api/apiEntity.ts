import {
  fullCollectedEntityValidator,
  fullEntityValidator,
  type FullCollectedEntity,
  type FullEntity,
  type UncompleteCollectedEntity,
  type UpdateEntityAttributes,
  type FilterChangelogBody,
  type UncompleteEntityItem,
  type FullEntityItem,
  fullItemValidator,
} from "@/utils/backendTypes";
import api from "./apiInstance";
import { wrapAPI } from "./utils";
import { z } from "zod";

export const addCollectedEntityApi = (
  request: UncompleteCollectedEntity
): Promise<FullCollectedEntity> => {
  return wrapAPI(
    () => api.post("/entity", request),
    fullCollectedEntityValidator
  );
};

export const fetchCollectedEntityApi = (
  id: string
): Promise<FullCollectedEntity> => {
  return wrapAPI(() => api.get(`/entity/${id}`), fullCollectedEntityValidator);
};

export const listEntitiesApi = (): Promise<FullEntity[]> => {
  return wrapAPI(() => api.get(`/entity`), fullEntityValidator.array());
};

export const updateEntityAttributesApi = (
  id: string,
  request: UpdateEntityAttributes
): Promise<FullEntity> => {
  return wrapAPI(
    () => api.patch(`/entity/${id}/attributes`, request),
    fullEntityValidator
  );
};

export const filterEntityChangelogApi = (
  id: string,
  request: FilterChangelogBody
): Promise<boolean> => {
  return wrapAPI(
    () => api.patch(`/entity/${id}/changelog`, request),
    z.boolean()
  );
};

export const addItemsApi = (
  id: string,
  request: UncompleteEntityItem[]
): Promise<FullEntityItem[]> => {
  return wrapAPI(
    () => api.post(`/entity/${id}/items`, request),
    fullItemValidator.array()
  );
};
