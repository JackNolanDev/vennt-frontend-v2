import {
  patchAbilityResponseValidator,
  type PartialEntityAbility,
  type PatchAbilityResponse,
  type OptionalComputedAttributesResponse,
  optionalComputedAttributesResponseValidator,
} from "vennt-library";
import api from "./apiInstance";
import { authConfig, wrapAPI } from "./utils";

export const updateAbilityApi = (
  abilityId: string,
  ability: PartialEntityAbility,
  campaign_id?: string,
): Promise<PatchAbilityResponse> => {
  return wrapAPI(
    () =>
      api.patch(
        `/ability/${abilityId}`,
        ability,
        authConfig({ params: { campaign_id } }),
      ),
    patchAbilityResponseValidator,
  );
};

export const deleteAbilityApi = (
  abilityId: string,
  campaign_id?: string,
): Promise<OptionalComputedAttributesResponse> => {
  return wrapAPI(
    () =>
      api.delete(
        `/ability/${abilityId}`,
        authConfig({ params: { campaign_id } }),
      ),
    optionalComputedAttributesResponseValidator,
  );
};
