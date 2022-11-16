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
  max-width: 1050px;
  container-type: inline-size;
  container-name: page;
}
.page-container.small > .page {
  max-width: 300px;
}
.page-container.medium > .page {
  max-width: 500px;
}
.page-container.large > .page {
  max-width: 1050px;
}
</style>
