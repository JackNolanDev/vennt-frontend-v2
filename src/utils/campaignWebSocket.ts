import { BASE_WS_URL } from "@/api/utils";
import { TOKEN_LOCAL_STORAGE } from "./constants";
import {
  CONNECTION_AUTHORIZED_MSG,
  campaignWSMessageValidator,
  CHAT_TYPE,
  OLD_CHAT_TYPE,
  UPDATE_CHAT_TYPE,
  DELETE_CHAT_TYPE,
  type OldChatMessages,
  type UpdatedChatMessage,
  type DeleteChatMessage,
  type DiceRollResult,
  type StoredMessage,
  DICE_ROLL_RESULT_TYPE,
} from "vennt-library";
import { useCampaignStore } from "@/stores/campaign";
import { useDiceStore } from "@/stores/dice";

export class CampaignWebSocket {
  campaignId: string;
  ws: WebSocket;
  authenticated = false;
  preAuthQueue: string[] = [];

  constructor(campaignId: string) {
    this.campaignId = campaignId;
    const authToken = localStorage.getItem(TOKEN_LOCAL_STORAGE);
    if (!authToken) {
      throw new Error("Not logged in");
    }
    this.ws = new WebSocket(`${BASE_WS_URL}/campaign/${campaignId}/ws`);

    this.ws.onopen = () => {
      this.ws.send(authToken);
    };

    this.ws.onmessage = ({ data }) => {
      if (!this.authenticated && data === CONNECTION_AUTHORIZED_MSG) {
        this.authenticated = true;
        this.preAuthQueue.forEach((msg) => this.ws.send(msg));
        this.preAuthQueue = [];
      } else {
        // console.log(data);
        const msg = campaignWSMessageValidator.parse(JSON.parse(data));

        switch (msg.type) {
          case CHAT_TYPE:
            handleChatMessage(msg);
            break;
          case DICE_ROLL_RESULT_TYPE:
            handleDiceRollResultMessage(msg);
            break;
          case OLD_CHAT_TYPE:
            handleOldChatMessage(msg);
            break;
          case UPDATE_CHAT_TYPE:
            handleUpdateChatMessage(msg);
            break;
          case DELETE_CHAT_TYPE:
            handleDeleteChatMessage(msg);
            break;
        }
      }
    };
  }

  send(msg: Record<string, unknown>) {
    const stringified = JSON.stringify(msg);
    if (this.authenticated) {
      this.ws.send(stringified);
    } else {
      this.preAuthQueue.push(stringified);
    }
  }

  close() {
    this.ws.close();
  }
}

const handleChatMessage = (msg: StoredMessage) => {
  const campaignStore = useCampaignStore();
  if (campaignStore.chat === null) {
    campaignStore.chat = [msg];
  } else {
    campaignStore.chat.unshift(msg);
  }
};

const handleDiceRollResultMessage = (msg: DiceRollResult) => {
  const diceStore = useDiceStore();
  if (msg.request_id && diceStore.pendingRolls[msg.request_id]) {
    const result = JSON.parse(msg.result);
    diceStore.rolls[diceStore.pendingRolls[msg.request_id]] = result;
    delete diceStore.pendingRolls[msg.request_id];
  }
  handleChatMessage(msg);
};

const handleOldChatMessage = (msg: OldChatMessages) => {
  const campaignStore = useCampaignStore();
  if (campaignStore.chat === null) {
    campaignStore.chat = msg.message;
  } else {
    campaignStore.chat.push(...msg.message);
  }
  if (msg.cursor) {
    campaignStore.chatCursor = msg.cursor;
  }
};

const handleUpdateChatMessage = (msg: UpdatedChatMessage) => {
  const campaignStore = useCampaignStore();
  const found = campaignStore.chat?.find((chat) => chat.id === msg.id);
  if (found) {
    found.message = msg.message;
    found.updated = msg.updated;
  }
};

const handleDeleteChatMessage = (msg: DeleteChatMessage) => {
  const campaignStore = useCampaignStore();
  if (!campaignStore.chat) {
    return;
  }
  campaignStore.chat = campaignStore.chat.filter((chat) => chat.id !== msg.id);
};
