import api from "./apiInstance";
import {
  fullItemValidator,
  type FullEntityItem,
  type PartialEntityItem,
} from "@/utils/backendTypes";
import { wrapAPI } from "./utils";

export const updateItemApi = (
  itemId: string,
  item: PartialEntityItem
): Promise<FullEntityItem> => {
  return wrapAPI(() => api.patch(`/item/${itemId}`, item), fullItemValidator);
};

export const deleteItemApi = (itemId: string) => {
  wrapAPI(() => api.delete(`/item/${itemId}`));
};
