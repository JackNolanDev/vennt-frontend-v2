<template>
  <span
    v-if="state === 'EDITING'"
    class="material-symbols-outlined defaultSize mutedText"
    :title="`${subject} getting saved on the server`"
  >
    keyboard_alt
  </span>
  <span
    v-else-if="state === 'SAVING'"
    class="material-symbols-outlined defaultSize mutedText"
    :title="`${subject} getting saved on the server`"
  >
    sync
  </span>
  <span
    v-else
    class="material-symbols-outlined defaultSize mutedText"
    :title="`${subject} up to date on the server`"
  >
    check
  </span>
</template>

<script setup lang="ts">
import type { SaveState } from "vennt-library";

defineProps<{ state: SaveState; subject: string }>();
</script>
