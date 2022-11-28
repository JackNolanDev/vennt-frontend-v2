import {
  fullCollectedEntityValidator,
  fullEntityValidator,
  type FullCollectedEntity,
  type FullEntity,
  type UncompleteCollectedEntity,
} from "@/utils/backendTypes";
import api from "./apiInstance";
import { parseResponse } from "./utils";

export const addCollectedEntityApi = async (
  request: UncompleteCollectedEntity
): Promise<FullCollectedEntity> => {
  return parseResponse(
    await api.post("/entity/", request),
    fullCollectedEntityValidator
  );
};

export const fetchCollectedEntityApi = async (
  id: string
): Promise<FullCollectedEntity> => {
  return parseResponse(
    await api.get(`/entity/${id}`),
    fullCollectedEntityValidator
  );
};

export const listEntitiesApi = async (): Promise<FullEntity[]> => {
  return parseResponse(
    await api.get(`/entity/list`),
    fullEntityValidator.array()
  );
};
