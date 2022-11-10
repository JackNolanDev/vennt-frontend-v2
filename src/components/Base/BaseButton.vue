<template>
  <button class="btn basicBtn">
    <div class="basicBtnContents">
      <span v-if="props.icon" class="material-icons space">
        {{ props.icon }}
      </span>
      <span>
        <slot></slot>
      </span>
    </div>
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{ icon?: string }>();
</script>

<style scoped>
.selected .material-icons {
  color: var(--main-button);
}
.selected.basicBtn:disabled .material-icons {
  color: var(--basic-button-disabled);
}
</style>
