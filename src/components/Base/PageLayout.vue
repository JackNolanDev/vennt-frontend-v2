<template>
  <div class="page-container">
    <div class="page">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  display: flex;
  justify-content: center;
}
.page {
  width: 100%;
  margin-left: 20px;
  margin-right: 20px;
  max-width: var(--page-layout-large);
  container-type: inline-size;
  container-name: page;
}
.page-container.small > .page {
  max-width: var(--page-layout-small);
}
.page-container.medium > .page {
  max-width: var(--page-layout-medium);
}
.page-container.large > .page {
  max-width: var(--page-layout-large);
}
@media screen and (max-width: 400px) {
  .page {
    margin-left: 8px;
    margin-right: 8px;
  }
}
</style>
