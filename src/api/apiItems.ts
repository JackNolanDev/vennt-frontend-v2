import api from "./apiInstance";
import {
  type PartialEntityItem,
  type PatchItemResponse,
  patchItemResponseValidator,
  optionalComputedAttributesResponseValidator,
  type OptionalComputedAttributesResponse,
} from "vennt-library";
import { authConfig, wrapAPI } from "./utils";

export const updateItemApi = (
  itemId: string,
  item: PartialEntityItem,
  campaign_id?: string,
): Promise<PatchItemResponse> => {
  return wrapAPI(
    () =>
      api.patch(
        `/item/${itemId}`,
        item,
        authConfig({ params: { campaign_id } }),
      ),
    patchItemResponseValidator,
  );
};

export const deleteItemApi = (
  itemId: string,
  campaign_id?: string,
): Promise<OptionalComputedAttributesResponse> => {
  return wrapAPI(
    () =>
      api.delete(`/item/${itemId}`, authConfig({ params: { campaign_id } })),
    optionalComputedAttributesResponseValidator,
  );
};
