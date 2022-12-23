import { wrapAPI } from "./utils";
import api from "./apiInstance";
import type { JsonStorageKey } from "@/utils/backendTypes";

export const triggerWebscraperApi = (key: JsonStorageKey) => {
  wrapAPI(() => api.post(`/storage/${key}`));
};
