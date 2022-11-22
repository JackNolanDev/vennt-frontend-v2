<template>
  <BaseButton
    @click="copyCommand"
    :title="command"
    icon="content_copy"
    class="wide"
    >{{ text }}</BaseButton
  >
</template>

<script lang="ts">
import BaseButton from "../Base/BaseButton.vue";

export default {
  name: "DiceCopyButton",
  props: { dice: String, text: { type: String, default: "Roll command" } },
  computed: {
    command() {
      return `/roll ${this.dice}`;
    },
  },
  methods: {
    copyCommand() {
      navigator.clipboard.writeText(this.command);
    },
  },
  components: { BaseButton },
};
</script>
