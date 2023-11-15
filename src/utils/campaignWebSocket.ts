import { BASE_WS_URL } from "@/api/utils";
import { TOKEN_LOCAL_STORAGE } from "./constants";
import {
  CONNECTION_AUTHORIZED_MSG,
  SEND_CHAT_TYPE,
  campaignWSMessageValidator,
  type SendChatMessage,
  CHAT_TYPE,
  OLD_CHAT_TYPE,
  UPDATE_CHAT_TYPE,
  DELETE_CHAT_TYPE,
  type ChatMessage,
  type OldChatMessages,
  type UpdatedChatMessage,
  type DeleteChatMessage,
} from "vennt-library";
import { useCampaignStore } from "@/stores/campaign";

export class CampaignWebSocket {
  ws: WebSocket;
  authenticated = false;
  preAuthQueue: string[] = [];

  constructor(campaignId: string) {
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

  sendChatMessage(msg: string) {
    const chat: SendChatMessage = {
      type: SEND_CHAT_TYPE,
      message: msg,
    };
    this.send(JSON.stringify(chat));
  }

  send(msg: string) {
    if (this.authenticated) {
      this.ws.send(msg);
    } else {
      this.preAuthQueue.push(msg);
    }
  }

  close() {
    this.ws.close();
  }
}

const handleChatMessage = (msg: ChatMessage) => {
  const campaignStore = useCampaignStore();
  if (campaignStore.chat === null) {
    campaignStore.chat = [msg];
  } else {
    campaignStore.chat.push(msg);
  }
};

const handleOldChatMessage = (msg: OldChatMessages) => {
  const campaignStore = useCampaignStore();
  // reverse the messages since they are sorted by descending time by default
  msg.message.reverse();
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
