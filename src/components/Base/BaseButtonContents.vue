<template>
  <div class="basicBtnContents">
    <span v-if="icon" class="material-icons space">
      {{ icon }}
    </span>
    <slot name="customIcon"></slot>
    <span class="nowrap alignRow text-contents">
      <slot></slot>
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{ icon?: string }>();
</script>

<style scoped>
.selected .material-icons {
  color: var(--main-button);
}
.selected.basicBtn:disabled .material-icons {
  color: var(--basic-button-disabled);
}

.basicBtnContents:has(> .text-contents:empty) > .space {
  margin-right: 0px;
}
</style>
