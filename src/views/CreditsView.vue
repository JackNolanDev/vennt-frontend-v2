<template>
  <BaseLayout>
    <template #nav><BaseNav></BaseNav></template>
    <PageLayout class="small">
      <h1>Credits</h1>
      <p>
        This website was built by
        <a href="https://github.com/JackNolanDev" target="_blank" class="link">
          Jack Nolan
        </a>
        and
        <a href="http://joshaaronmiller.com/" target="_blank" class="link">
          Josh Aaron Miller</a
        >!
      </p>
      <p>
        Some icons by
        <a href="https://game-icons.net/" target="_blank" class="link">
          game-icons.net
        </a>
        were used under the
        <a
          href="https://creativecommons.org/licenses/by/3.0/"
          target="_blank"
          class="link"
        >
          CC BY 3.0
        </a>
        license.
      </p>
    </PageLayout>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from "@/components/Base/BaseLayout.vue";
import PageLayout from "@/components/Base/PageLayout.vue";
import BaseNav from "@/components/Base/BaseNav.vue";
</script>
