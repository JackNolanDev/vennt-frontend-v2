import {
  acceptCampaignInviteApi,
  declineCampaignInviteApi,
  listUsersCampaignInvitesApi,
} from "@/api/apiCampaignInvites";
import { listUsersCampaignsApi } from "@/api/apiCampaigns";
import { listEntitiesApi } from "@/api/apiEntity";
import router, { CAMPAIGN_ROUTE } from "@/router";
import type {
  FullEntity,
  CampaignWithRole,
  CampaignInviteWithDetails,
} from "vennt-library";
import { defineStore } from "pinia";

interface HomeState {
  entities: FullEntity[];
  campaigns: CampaignWithRole[];
  campaignInvitations: CampaignInviteWithDetails[];
}

export const useHomeStore = defineStore("home", {
  state: (): HomeState => ({
    entities: [],
    campaigns: [],
    campaignInvitations: [],
  }),
  getters: {
    characters: (state) =>
      state.entities.filter((entity) => entity.type === "CHARACTER"),
    cogs: (state) => state.entities.filter((entity) => entity.type === "COG"),
  },
  actions: {
    fetchHomeData() {
      this.listEntities();
      this.listCampaigns();
      this.listCampaignInvitations();
    },
    async listEntities() {
      this.entities = await listEntitiesApi();
    },
    async listCampaigns() {
      this.campaigns = await listUsersCampaignsApi();
    },
    async listCampaignInvitations() {
      this.campaignInvitations = await listUsersCampaignInvitesApi();
    },
    async acceptCampaignInvitation(invite: CampaignInviteWithDetails) {
      await acceptCampaignInviteApi(invite.id);
      router.push({ name: CAMPAIGN_ROUTE, params: { id: invite.campaign_id } });
    },
    declineCampaignInvite(invite: CampaignInviteWithDetails) {
      this.campaignInvitations = this.campaignInvitations.filter(
        (invitation) => invitation.id !== invite.id,
      );
      declineCampaignInviteApi(invite.id);
    },
    reset() {
      this.entities = [];
      this.campaigns = [];
      this.campaignInvitations = [];
    },
  },
});
