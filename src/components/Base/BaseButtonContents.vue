<template>
  <div class="basicBtnContents">
    <span v-if="icon" class="material-symbols-outlined space">
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
.selected .material-symbols-outlined {
  color: var(--main-button);
}
.selected.basicBtn:disabled .material-symbols-outlined {
  color: var(--basic-button-disabled);
}

.basicBtnContents:has(> .text-contents:empty) > .space {
  margin-right: 0px;
}

.small-icon .material-symbols-outlined {
  font-size: 24px;
}
.tiny-icon .material-symbols-outlined {
  font-size: 20px;
}

.wrap .nowrap {
  white-space: inherit;
}
</style>
