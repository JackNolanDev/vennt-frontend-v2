<template>
  <BaseLayout class="nav sidebar">
    <template #nav><BaseNav></BaseNav></template>
    <template #sidebar><CampaignMapBuilder></CampaignMapBuilder></template>
    <CampaignMap></CampaignMap>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from "@/components/Base/BaseLayout.vue";
import BaseNav from "@/components/Base/BaseNav.vue";
import CampaignMap from "@/components/Campaign/CampaignMap.vue";
import CampaignMapBuilder from "@/components/Campaign/CampaignMapBuilder.vue";
import { TOKEN_LOCAL_STORAGE } from "@/utils/constants";

const wsTest = async () => {
  const authToken = localStorage.getItem(TOKEN_LOCAL_STORAGE);
  if (!authToken) {
    return;
  }
  let preAuthQueue: string[] = [];
  const baseURL =
    process.env.NODE_ENV === "development"
      ? "ws://localhost:5001" // local server
      : "wss://vennt.up.railway.app"; // railway deployment of backend
  const ws = new WebSocket(
    `${baseURL}/campaign/9a143f4c-9ba2-4805-9c06-8893f0194bf8/ws`,
  );
  let authenticated = false;
  let received = 0;
  const attemptToSend = (msg: string) => {
    if (authenticated) {
      if (preAuthQueue.length > 0) {
        preAuthQueue.forEach((preAuthMsg) => {
          ws.send(preAuthMsg);
        });
        preAuthQueue = [];
      }
      ws.send(msg);
    } else {
      preAuthQueue.push(msg);
    }
  };
  ws.onopen = (event) => {
    ws.send(authToken);
    console.log(event);
  };
  ws.onmessage = (event) => {
    if (event.data === "listening") {
      authenticated = true;
    }
    console.log(event);
    if (received > 5) {
      ws.close();
    }
    received++;
  };

  attemptToSend("Here's some text that the server is urgently awaiting!");
  await new Promise((r) => setTimeout(r, 1000));
  attemptToSend("msg 2");
};

wsTest();
</script>
