import {
  fullAbilityValidator,
  type FullEntityAbility,
  type PartialEntityAbility,
} from "@/utils/backendTypes";
import api from "./apiInstance";
import { wrapAPI } from "./utils";

export const updateAbilityApi = (
  abilityId: string,
  ability: PartialEntityAbility
): Promise<FullEntityAbility> => {
  return wrapAPI(
    () => api.patch(`/ability/${abilityId}`, ability),
    fullAbilityValidator
  );
};

export const deleteAbilityApi = (abilityId: string) => {
  wrapAPI(() => api.delete(`/ability/${abilityId}`));
};
