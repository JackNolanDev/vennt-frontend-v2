import api from "./apiInstance";
import {
  fullItemValidator,
  type FullEntityItem,
  type PartialEntityItem,
} from "vennt-library";
import { authConfig, wrapAPI } from "./utils";

export const updateItemApi = (
  itemId: string,
  item: PartialEntityItem,
  campaign_id?: string
): Promise<FullEntityItem> => {
  return wrapAPI(
    () =>
      api.patch(
        `/item/${itemId}`,
        item,
        authConfig({ params: { campaign_id } })
      ),
    fullItemValidator
  );
};

export const deleteItemApi = (itemId: string, campaign_id?: string) => {
  wrapAPI(() =>
    api.delete(`/item/${itemId}`, authConfig({ params: { campaign_id } }))
  );
};
