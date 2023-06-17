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
.page-layout {
  display: grid;
  grid-template-columns: min(var(--sidebar-width), 50vw) auto min(
      var(--sidebar-width),
      50vw
    );
  grid-template-rows: var(--nav-height) var(--sub-nav-height) auto;
  justify-items: stretch;
  align-items: stretch;
  min-height: var(--full-page-height);
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
  height: var(--full-page-height);
}

.sidebar-body,
.sidebar-right-body {
  background-color: var(--background-sidebar);
}

.page-layout.nav > .nav-body {
  grid-area: 1 / 1 / 2 / 4;
  display: block;
}
.page-layout.sub-nav > .sub-nav-body {
  grid-area: 2 / 1 / 3 / 4;
  display: block;
}
.page-layout.sidebar > .sidebar-body {
  grid-area: 1 / 1 / 4 / 2;
  display: block;
}
.page-layout.sidebar-right > .sidebar-right-body {
  grid-area: 1 / 3 / 4 / 4;
  display: block;
}
.page-layout > .main-body {
  grid-area: 1 / 1 / 4 / 4;
  display: block;
}

.page-layout.nav > .main-body,
.page-layout.nav > .sidebar-body,
.page-layout.nav > .sidebar-right-body {
  grid-row-start: 2;
  height: var(--page-height);
}
.page-layout.sub-nav > .main-body,
.page-layout.sub-nav > .sidebar-body,
.page-layout.sub-nav > .sidebar-right-body {
  grid-row-start: 3;
  height: var(--sub-nav-page-height);
}
.page-layout.sidebar > .main-body {
  grid-column-start: 2;
}
.page-layout.sidebar-right > .main-body {
  grid-column-end: 3;
}

@media screen and (max-width: 1200px) {
  /* Collapse main, maintain right sidebar */
  .page-layout.sidebar.sidebar-right > .main-body {
    display: none;
  }
  .page-layout.sidebar.sidebar-right > .sidebar-right-body {
    grid-column-start: 2;
  }
}

@media screen and (max-width: 760px) {
  /* Collapse left sidebar, maintain right sidebar */
  .page-layout.sidebar.sidebar-right > .sidebar-body {
    display: none;
  }
  .page-layout.sidebar.sidebar-right > .sidebar-right-body {
    grid-column-start: 1;
  }
  /* Collapse left sidebar, maintain main */
  .page-layout.sidebar:not(.sidebar-right):not(.prefers-sidebar)
    > .sidebar-body {
    display: none;
  }
  .page-layout.sidebar:not(.sidebar-right):not(.prefers-sidebar) > .main-body {
    grid-column-start: 1;
  }
  /* Collapse main, maintain left sidebar when .prefers-sidebar */
  .page-layout.prefers-sidebar.sidebar:not(.sidebar-right) > .sidebar-body {
    grid-column-end: 4;
  }
  .page-layout.prefers-sidebar.sidebar:not(.sidebar-right) > .main-body {
    display: none;
  }
  /* Collapse main, maintain right sidebar */
  .page-layout.sidebar-right:not(.sidebar) > .sidebar-right-body {
    grid-column-start: 1;
  }
  .page-layout.sidebar-right:not(.sidebar) > .main-body {
    display: none;
  }

  /* FIX: DO NOT USE GRID ON MOBILE (causes weird double scrollbars) */

  .page-layout {
    display: block;
    min-height: unset;
  }
  .sidebar-body,
  .sidebar-right-body,
  .main-body {
    /* !important to override higher specificity above */
    height: unset !important;
  }

  .page-layout.nav > .sidebar-body,
  .page-layout.nav > .sidebar-right-body,
  .page-layout.nav > .main-body {
    margin-top: var(--nav-height);
  }
  .page-layout.sub-nav > .sidebar-body,
  .page-layout.sub-nav > .sidebar-right-body,
  .page-layout.sub-nav > .main-body {
    margin-top: var(--total-nav-height);
  }

  .nav-body {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 4;
  }
  .sub-nav-body {
    position: fixed;
    top: var(--nav-height);
    left: 0;
    right: 0;
    z-index: 5;
  }
}
</style>
