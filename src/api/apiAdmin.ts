import { wrapAPI } from "./utils";
import api from "./apiInstance";
import type { JsonStorageKey } from "@/utils/backendTypes";

export const triggerWebscraperApi = (key: JsonStorageKey) => {
  wrapAPI(() => api.post(`/admin/storage/${key}`));
};

export const configureStorageBucketApi = () => {
  wrapAPI(() => api.post(`admin/bucket/configure/storage`));
};
