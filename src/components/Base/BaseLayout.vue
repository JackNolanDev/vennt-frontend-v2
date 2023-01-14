<template>
  <div class="page-layout">
    <div class="nav-body"><slot name="nav"></slot></div>
    <div class="sub-nav-body"><slot name="sub-nav"></slot></div>
    <div class="sidebar-body"><slot name="sidebar"></slot></div>
    <div class="sidebar-right-body"><slot name="sidebar-right"></slot></div>
    <div class="main-body"><slot></slot></div>
  </div>
</template>

<style scoped>
/* prefers-sidebar class causes the left sidebar to stay after the main content folds on small screens */
/* Welcome to CSS hell, right here */
.page-layout {
  display: grid;
  grid-template-columns: min(var(--sidebar-width), 50vw) auto min(
      var(--sidebar-width),
      50vw
    );
  grid-template-rows: var(--nav-height) var(--sub-nav-height) auto;
  justify-items: stretch;
  align-items: stretch;
  min-height: 100vh;
}
.page-layout > .nav-body,
.page-layout > .sub-nav-body,
.page-layout > .sidebar-body,
.page-layout > .sidebar-right-body {
  display: none;
}

.sidebar-body,
.sidebar-right-body,
.main-body {
  overflow-y: scroll;
  height: 100vh;
}

.sidebar-body,
.sidebar-right-body {
  background-color: var(--background-sidebar);
}

.page-layout > .nav-body:not(:empty) {
  grid-area: 1 / 1 / 2 / 4;
  display: block;
}
.page-layout > .sub-nav-body:not(:empty) {
  grid-area: 2 / 1 / 3 / 4;
  display: block;
}
.page-layout > .sidebar-body:not(:empty) {
  grid-area: 1 / 1 / 4 / 2;
  display: block;
}
.page-layout > .sidebar-right-body:not(:empty) {
  grid-area: 1 / 3 / 4 / 4;
  display: block;
}
.page-layout > .main-body {
  grid-area: 1 / 1 / 4 / 4;
  display: block;
}

.page-layout:has(.nav-body:not(:empty)) > .main-body,
.page-layout:has(.nav-body:not(:empty)) > .sidebar-body,
.page-layout:has(.nav-body:not(:empty)) > .sidebar-right-body {
  grid-row-start: 2;
  height: var(--page-height);
}
.page-layout:has(.sub-nav-body:not(:empty)) > .main-body,
.page-layout:has(.sub-nav-body:not(:empty)) > .sidebar-body,
.page-layout:has(.sub-nav-body:not(:empty)) > .sidebar-right-body {
  grid-row-start: 3;
  height: var(--sub-nav-page-height);
}
.page-layout:has(.sidebar-body:not(:empty)) > .main-body {
  grid-column-start: 2;
}
.page-layout:has(.sidebar-right-body:not(:empty)) > .main-body {
  grid-column-end: 3;
}

@media screen and (max-width: 1200px) {
  /* Collapse main, maintain right sidebar */
  .page-layout:has(.sidebar-body:not(:empty)):has(
      .sidebar-right-body:not(:empty)
    )
    > .main-body {
    display: none;
  }
  .page-layout:has(.sidebar-body:not(:empty)):has(
      .sidebar-right-body:not(:empty)
    )
    > .sidebar-right-body {
    grid-column-start: 2;
  }
}

@media screen and (max-width: 760px) {
  /* Collapse left sidebar, maintain right sidebar */
  .page-layout:has(.sidebar-body:not(:empty)):has(
      .sidebar-right-body:not(:empty)
    )
    > .sidebar-body {
    display: none;
  }
  .page-layout:has(.sidebar-body:not(:empty)):has(
      .sidebar-right-body:not(:empty)
    )
    > .sidebar-right-body {
    grid-column-start: 1;
  }
  /* Collapse left sidebar, maintain main */
  .page-layout:not(.prefers-sidebar):has(.sidebar-body:not(:empty)):has(
      .sidebar-right-body:empty
    )
    > .sidebar-body {
    display: none;
  }
  .page-layout:not(.prefers-sidebar):has(.sidebar-body:not(:empty)):has(
      .sidebar-right-body:empty
    )
    > .main-body {
    grid-column-start: 1;
  }
  /* Collapse main, maintain left sidebar when .prefers-sidebar */
  .page-layout.prefers-sidebar:has(.sidebar-body:not(:empty)):has(
      .sidebar-right-body:empty
    )
    > .sidebar-body {
    grid-column-end: 4;
  }
  .page-layout.prefers-sidebar:has(.sidebar-body:not(:empty)):has(
      .sidebar-right-body:empty
    )
    > .main-body {
    display: none;
  }
  /* Collapse main, maintain right sidebar */
  .page-layout:has(.sidebar-body:empty):has(.sidebar-right-body:not(:empty))
    > .sidebar-right-body {
    grid-column-start: 1;
  }
  .page-layout:has(.sidebar-body:empty):has(.sidebar-right-body:not(:empty))
    > .main-body {
    display: none;
  }
}
</style>
