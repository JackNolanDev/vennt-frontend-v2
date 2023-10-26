<template>
  <div class="alignRow" v-bind:class="warningClass">
    <div class="number">{{ top }}</div>
    <div v-if="Number.isInteger(bottom)" class="alignRow">
      <div class="slash ml-2 mr-2">/</div>
      <div class="number">{{ bottom }}</div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    top: { type: Number },
    bottom: { type: Number },
    noWarning: { type: Boolean, default: false },
    successWhenOver: { type: Boolean, default: false },
  },
  computed: {
    warningClass() {
      return {
        errorText:
          this.top &&
          this.bottom &&
          ((!this.successWhenOver && this.top > this.bottom) || this.top < 0) &&
          !this.noWarning,
        successText:
          this.top &&
          this.bottom &&
          this.successWhenOver &&
          this.top > this.bottom &&
          !this.noWarning,
      };
    },
  },
};
</script>

<style scoped>
.slash {
  font-size: 1.563em;
  font-weight: 300;
}
</style>
