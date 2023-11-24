import {
  addCampaignApi,
  addCampaignEntityApi,
  fetchCampaignDetailsApi,
  putCampaignDescApi,
  removeCampaignEntityApi,
} from "@/api/apiCampaigns";
import router, { CAMPAIGN_ROUTE } from "@/router";
import {
  REQUEST_CHAT_TYPE,
  type CampaignDesc,
  type CampaignRole,
  type FullCampaignDetails,
  type PostCampaign,
  type PostCampaignEntity,
  type PostCampaignInvite,
  type RequestOldChatMessages,
  type RequestUpdateChatMessage,
  REQUEST_UPDATE_CHAT_TYPE,
  type DeleteChatMessage,
  DELETE_CHAT_TYPE,
  type StoredMessage,
} from "vennt-library";
import { defineStore } from "pinia";
import { useAccountInfoStore } from "./accountInfo";
import {
  addCampaignInviteApi,
  declineCampaignInviteApi,
} from "@/api/apiCampaignInvites";
import { CampaignWebSocket } from "@/utils/campaignWebSocket";

interface CampaignState {
  details: FullCampaignDetails | null;
  ws: CampaignWebSocket | null;
  chat: StoredMessage[] | null;
  chatCursor: string | null;
  outStandingWSRequests: string[];
}

export const useCampaignStore = defineStore("campaign", {
  state: (): CampaignState => ({
    details: null,
    ws: null,
    chat: null,
    chatCursor: null,
    outStandingWSRequests: [],
  }),
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
          params: { campaignId: this.details.campaign.id },
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
      if (!this.details) return;
      this.details.campaign.desc = request.desc;
      await putCampaignDescApi(this.details.campaign.id, request);
    },
    async addEntityToCampaign(request: PostCampaignEntity) {
      if (!this.details) return;
      const addedEntity = await addCampaignEntityApi(
        this.details.campaign.id,
        request,
      );
      this.details.entities.push(addedEntity);
    },
    async removeEntityFromCampaign(entityId: string) {
      if (!this.details) return;
      this.details.entities = this.details.entities.filter(
        (entity) => entity.entity_id !== entityId,
      );
      await removeCampaignEntityApi(this.details.campaign.id, entityId);
    },
    async adminSendInvite(request: Omit<PostCampaignInvite, "campaign_id">) {
      if (!this.details) return;
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
    connectToWebsocket(campaignId: string) {
      if (this.ws) {
        if (this.ws.campaignId === campaignId) return;
        this.disconnectWebsocket();
      }

      this.ws = new CampaignWebSocket(campaignId);
    },
    disconnectWebsocket() {
      this.ws?.close();
      this.ws = null;
      this.chat = null;
      this.chatCursor = null;
      this.outStandingWSRequests = [];
    },
    sendChatMessage(msg: string) {
      this.ws?.sendChatMessage(msg);
    },
    requestDiceRoll() {},
    requestOlderMessages() {
      if (!this.ws || !this.chatCursor) return;
      const request: RequestOldChatMessages = {
        type: REQUEST_CHAT_TYPE,
        cursor: this.chatCursor,
      };
      // set chatCursor to null so we don't duplicate requests for now
      // TODO: Add some sort of ticketing system for websocket requests, probably using a requestId, which we can send back with the websocket response
      this.chatCursor = null;
      this.ws.send(request);
    },
    updateChatMessage(messageId: string, message: string) {
      if (!this.ws) return;
      const request: RequestUpdateChatMessage = {
        type: REQUEST_UPDATE_CHAT_TYPE,
        id: messageId,
        message,
      };
      this.ws.send(request);
    },
    deleteChatMessage(messageId: string) {
      if (!this.ws) return;
      const request: DeleteChatMessage = {
        type: DELETE_CHAT_TYPE,
        id: messageId,
      };
      this.ws.send(request);
    },
    reset() {
      this.details = null;
      this.chat = null;
      this.chatCursor = null;
      this.outStandingWSRequests = [];
    },
  },
});
