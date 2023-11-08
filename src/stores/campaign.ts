import {
  addCampaignApi,
  addCampaignEntityApi,
  fetchCampaignDetailsApi,
  putCampaignDescApi,
  removeCampaignEntityApi,
} from "@/api/apiCampaigns";
import router, { CAMPAIGN_ROUTE } from "@/router";
import type {
  CampaignDesc,
  CampaignRole,
  FullCampaignDetails,
  PostCampaign,
  PostCampaignEntity,
  PostCampaignInvite,
} from "vennt-library";
import { defineStore } from "pinia";
import { useAccountInfoStore } from "./accountInfo";
import {
  addCampaignInviteApi,
  declineCampaignInviteApi,
} from "@/api/apiCampaignInvites";

interface CampaignState {
  details: FullCampaignDetails | undefined;
}

export const useCampaignStore = defineStore("campaign", {
  state: (): CampaignState => ({ details: undefined }),
  getters: {
    role(): CampaignRole {
      const { accountInfo } = useAccountInfoStore();
      if (accountInfo) {
        const campaignMember = this.details?.members.find(
          (member) => member.account_id === accountInfo.id,
        );
        if (campaignMember) {
          return campaignMember.role;
        }
      }
      return "SPECTATOR";
    },
  },
  actions: {
    async addCampaign(request: PostCampaign, redirectToCampaign?: boolean) {
      this.details = await addCampaignApi(request);
      if (redirectToCampaign) {
        router.push({
          name: CAMPAIGN_ROUTE,
          params: { id: this.details.campaign.id },
        });
      }
    },
    async fetchCampaign(campaignId: string, doNotRefetch?: boolean) {
      if (doNotRefetch && campaignId === this.details?.campaign.id) {
        return;
      }
      this.details = await fetchCampaignDetailsApi(campaignId);
    },
    async putCampaignDesc(request: CampaignDesc) {
      if (!this.details) {
        return;
      }
      this.details.campaign.desc = request.desc;
      await putCampaignDescApi(this.details.campaign.id, request);
    },
    async addEntityToCampaign(request: PostCampaignEntity) {
      if (!this.details) {
        return;
      }
      const addedEntity = await addCampaignEntityApi(
        this.details.campaign.id,
        request,
      );
      this.details.entities.push(addedEntity);
    },
    async removeEntityFromCampaign(entityId: string) {
      if (!this.details) {
        return;
      }
      this.details.entities = this.details.entities.filter(
        (entity) => entity.entity_id !== entityId,
      );
      await removeCampaignEntityApi(this.details.campaign.id, entityId);
    },
    async adminSendInvite(request: Omit<PostCampaignInvite, "campaign_id">) {
      if (!this.details) {
        return;
      }
      const sentInvite = await addCampaignInviteApi({
        ...request,
        campaign_id: this.details.campaign.id,
      });
      this.details.invites?.push(sentInvite);
    },
    async adminDeleteInvite(inviteId: string) {
      if (this.details?.invites) {
        this.details.invites = this.details.invites.filter(
          (invite) => invite.id !== inviteId,
        );
      }
      await declineCampaignInviteApi(inviteId);
    },
    reset() {
      this.details = undefined;
    },
  },
});
