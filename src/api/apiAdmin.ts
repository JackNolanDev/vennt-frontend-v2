import { authConfig, wrapAPI } from "./utils";
import api from "./apiInstance";
import type { JsonStorageKey } from "vennt-library";

export const triggerWebscraperApi = (key: JsonStorageKey) => {
  wrapAPI(() => api.post(`/admin/storage/${key}`, undefined, authConfig()));
};

export const triggerUpdateUses = (key: JsonStorageKey) => {
  wrapAPI(() =>
    api.post(`/admin/storage/${key}/uses`, undefined, authConfig())
  );
};

export const configureStorageBucketApi = () => {
  wrapAPI(() =>
    api.post(`admin/bucket/configure/storage`, undefined, authConfig())
  );
};
