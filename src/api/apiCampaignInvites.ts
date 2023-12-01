import {
  type PostCampaignInvite,
  type CampaignInvite,
  campaignInviteValidator,
  type CampaignInviteWithDetails,
  campaignInviteWithDetailsValidator,
} from "vennt-library";
import { wrapAPI, authConfig } from "./utils";
import api from "./apiInstance";
import { z } from "zod";

export const addCampaignInviteApi = (
  request: PostCampaignInvite,
): Promise<CampaignInvite> => {
  return wrapAPI(
    () => api.post("/campaign_invite", request, authConfig()),
    campaignInviteValidator,
  );
};

export const listUsersCampaignInvitesApi = (): Promise<
  CampaignInviteWithDetails[]
> => {
  return wrapAPI(
    () => api.get("/campaign_invite", authConfig()),
    campaignInviteWithDetailsValidator.array(),
  );
};

export const acceptCampaignInviteApi = (inviteId: string): Promise<boolean> => {
  return wrapAPI(
    () => api.post(`/campaign_invite/${inviteId}`, undefined, authConfig()),
    z.boolean(),
  );
};

export const declineCampaignInviteApi = (
  inviteId: string,
): Promise<boolean> => {
  return wrapAPI(
    () => api.delete(`/campaign_invite/${inviteId}`, authConfig()),
    z.boolean(),
  );
};
