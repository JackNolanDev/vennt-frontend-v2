import {
  fullAbilityValidator,
  type FullEntityAbility,
  type PartialEntityAbility,
} from "@/utils/backendTypes";
import api from "./apiInstance";
import { authConfig, wrapAPI } from "./utils";

export const updateAbilityApi = (
  abilityId: string,
  ability: PartialEntityAbility,
  campaign_id?: string
): Promise<FullEntityAbility> => {
  return wrapAPI(
    () =>
      api.patch(
        `/ability/${abilityId}`,
        ability,
        authConfig({ params: { campaign_id } })
      ),
    fullAbilityValidator
  );
};

export const deleteAbilityApi = (abilityId: string, campaign_id?: string) => {
  wrapAPI(() =>
    api.delete(`/ability/${abilityId}`, authConfig({ params: { campaign_id } }))
  );
};
