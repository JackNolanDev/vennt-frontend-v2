import {
  fullCollectedEntityValidator,
  fullEntityValidator,
  type FullCollectedEntity,
  type FullEntity,
  type UncompleteCollectedEntity,
  type UpdateEntityAttributes,
} from "@/utils/backendTypes";
import api from "./apiInstance";
import { wrapAPI } from "./utils";

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
  return wrapAPI(() => api.patch(`/entity/${id}/attributes`, request));
};
