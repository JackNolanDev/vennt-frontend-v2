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
/*
interface BaseCheckBoxArrayProps {
  options: {
    [key: string]: string;
  };
  checked: string[];
  disabled?: string[];
}
*/

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

/*
const emit = defineEmits<{ (e: "update", value: string[]): void }>();

const toggled = (key: string): void => {
  const initLen = props.checked.length;
  const newList = props.checked.filter((item) => item !== key);
  if (newList.length === initLen) {
    newList.push(key);
  }
  emit("update", newList);
};
*/
</script>
