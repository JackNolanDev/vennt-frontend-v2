<template>
  <BaseCheckBox
    v-for="(html, key) in props.options"
    :key="key"
    :checked="props.checked.has(key as string)"
    :disabled="props.disabled && props.disabled.has(key as string)"
    @click="toggled(key as string)"
    :class="props.checked.has(key as string) ? 'selected' : ''"
    class="wide"
  >
    <span v-html="html"></span>
  </BaseCheckBox>
</template>

<script setup lang="ts">
import BaseCheckBox from "./BaseCheckBox.vue";

interface BaseCheckBoxArrayProps {
  options: {
    [key: string]: string;
  };
  checked: Set<string>;
  disabled?: Set<string>;
}

const props = defineProps<BaseCheckBoxArrayProps>();

const toggled = (key: string): void => {
  if (props.checked.has(key)) {
    props.checked.delete(key);
  } else {
    props.checked.add(key);
  }
};
</script>
