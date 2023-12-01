import {
  type CampaignInviteLink,
  type PostCampaignInviteLink,
  campaignInviteLinkValidator,
  type Campaign,
  campaignValidator,
  type CampaignMember,
  campaignMemberValidator,
} from "vennt-library";
import { wrapAPI, authConfig } from "./utils";
import api from "./apiInstance";
import { z } from "zod";

export const addCampaignInviteLinkApi = (
  request: PostCampaignInviteLink,
): Promise<CampaignInviteLink> => {
  return wrapAPI(
    () => api.post("/campaign_invite_link", request, authConfig()),
    campaignInviteLinkValidator,
  );
};

export const fetchCampaignByCampaignInviteLinkApi = (
  hash: string,
): Promise<Campaign> => {
  return wrapAPI(
    () => api.get(`/campaign_invite_link/${hash}`, authConfig()),
    campaignValidator,
  );
};

export const joinCampaignUsingInviteLinkApi = (
  hash: string,
): Promise<CampaignMember> => {
  return wrapAPI(
    () => api.post(`/campaign_invite_link/${hash}`, null, authConfig()),
    campaignMemberValidator,
  );
};

export const deleteCampaignInviteLinkApi = (
  campaignId: string,
  id: string,
): Promise<boolean> => {
  return wrapAPI(
    () => api.delete(`/campaign_invite_link/${campaignId}/${id}`, authConfig()),
    z.boolean(),
  );
};
