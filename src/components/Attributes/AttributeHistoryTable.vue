<template>
  <div v-if="hasHistory" class="card column border history-table">
    <div class="alignRow tableData tableHeader sticky noBtn">
      <div class="logPrev headerFont">
        <b v-if="showDiff">Change</b>
        <b v-else>Prev Val</b>
      </div>
      <div class="logMsg headerFont">
        <b>Message</b>
      </div>
    </div>
    <div
      v-for="(log, idx) in parsedChangelog"
      v-bind:key="idx"
      v-bind:title="`Updated at ${log.time}`"
      class="alignRow tableItems"
    >
      <div class="tableData">
        <div v-if="showDiff" class="logPrev">
          {{ log.diff > 0 ? `+${log.diff}` : log.diff }}
        </div>
        <div v-else class="logPrev">
          {{ typeof log.prev === "number" ? log.prev : "-" }}
        </div>
        <div class="logMsg">{{ log.msg }}</div>
      </div>
    </div>
  </div>
  <p v-else class="mt-0 mb-8 mutedText">This Attribute has no history yet.</p>
</template>

<script setup lang="ts">
import type {
  CollectedEntity,
  EntityAttribute,
  EntityChangelog,
  FullEntityChangelog,
} from "@/utils/backendTypes";
import { computed } from "vue";

const props = defineProps<{
  entity: CollectedEntity;
  changelog: EntityChangelog[];
  attr: EntityAttribute;
}>();

type FullEntityChangelogWithDiff = FullEntityChangelog & {
  diff: number;
};

const diffAttrs = new Set<EntityAttribute>([
  "hp",
  "vim",
  "mp",
  "hero",
  "xp",
  "sp",
  "alerts",
]);
const showDiff = computed(() => diffAttrs.has(props.attr));
const parsedChangelog = computed(() => {
  const changelog = props.changelog.map((log) => {
    const timeLog = log as FullEntityChangelogWithDiff;
    if (!timeLog.time) {
      timeLog.time = new Date().toLocaleString();
    }
    return timeLog;
  });
  if (showDiff.value) {
    changelog.reduceRight((prev, log) => {
      const lastPrev = typeof prev !== "number" ? 0 : prev;
      const newPrev = typeof log.prev !== "number" ? 0 : log.prev;
      log.diff = lastPrev - newPrev;
      return newPrev;
    }, props.entity.entity.attributes[props.attr]);
  }
  return changelog;
});
const hasHistory = computed(() => parsedChangelog.value.length > 0);
</script>

<style scoped>
.history-table {
  max-height: 480px;
  overflow-y: auto;
}
.logPrev {
  width: 30%;
}
.logMsg {
  width: 70%;
}
</style>
