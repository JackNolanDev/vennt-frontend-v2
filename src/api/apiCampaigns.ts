import {
  fullCampaignDetailsValidator,
  type FullCampaignDetails,
  type PostCampaign,
  type CampaignWithRole,
  campaignWithRoleValidator,
  type PostCampaignEntity,
  type CampaignEntity,
  campaignEntityValidator,
  type CampaignDesc,
  type CampaignRole,
  campaignRoleValidator,
} from "@/utils/backendTypes";
import { wrapAPI, authConfig } from "./utils";
import api from "./apiInstance";
import { z } from "zod";

export const addCampaignApi = (
  request: PostCampaign
): Promise<FullCampaignDetails> => {
  return wrapAPI(
    () => api.post("/campaign", request, authConfig()),
    fullCampaignDetailsValidator
  );
};

export const listUsersCampaignsApi = (): Promise<CampaignWithRole[]> => {
  return wrapAPI(
    () => api.get("/campaign", authConfig()),
    campaignWithRoleValidator.array()
  );
};

export const fetchCampaignDetailsApi = (
  campaignId: string
): Promise<FullCampaignDetails> => {
  return wrapAPI(
    () => api.get(`/campaign/${campaignId}`, authConfig()),
    fullCampaignDetailsValidator
  );
};

export const putCampaignDescApi = (
  campaignId: string,
  request: CampaignDesc
): Promise<boolean> => {
  return wrapAPI(
    () => api.put(`/campaign/${campaignId}/desc`, request, authConfig()),
    z.boolean()
  );
};

export const addCampaignEntityApi = (
  campaignId: string,
  request: PostCampaignEntity
): Promise<CampaignEntity> => {
  return wrapAPI(
    () => api.post(`/campaign/${campaignId}/entity`, request, authConfig()),
    campaignEntityValidator
  );
};

export const removeCampaignEntityApi = (
  campaignId: string,
  entityId: string
): Promise<boolean> => {
  return wrapAPI(
    () =>
      api.delete(`/campaign/${campaignId}/entity/${entityId}`, authConfig()),
    z.boolean()
  );
};

export const updateCampaignMemberRoleApi = (
  campaignId: string,
  memberId: string,
  role: CampaignRole
): Promise<CampaignRole> => {
  return wrapAPI(
    () =>
      api.put(
        `/campaign/${campaignId}/entity/${memberId}/role`,
        role,
        authConfig()
      ),
    campaignRoleValidator
  );
};

export const removeCampaignMemberApi = (
  campaignId: string,
  memberId: string
): Promise<boolean> => {
  return wrapAPI(
    () =>
      api.delete(`/campaign/${campaignId}/member/${memberId}`, authConfig()),
    z.boolean()
  );
};
