<template>
  <div id="campaign-map-wrapper"></div>
</template>

<script setup lang="ts">
import { Application, Graphics, Polygon, type ICanvas } from "pixi.js";
import { onBeforeMount, onMounted, onUnmounted, watch } from "vue";
import { defineHex, Grid, rectangle, Hex } from "honeycomb-grid";
import { Viewport } from "pixi-viewport";
import { useMapBuilder } from "@/stores/mapBuilder";
import { validate } from "uuid";

const mapBuilder = useMapBuilder();

let app: Application<ICanvas> | null = null;
let backgroundGraphics: Graphics | null = null;
let draggedImageId: string | null = null;

onBeforeMount(() => {
  // TODO remove listeners
  window.addEventListener("dragstart", dragstartListener);
  window.addEventListener("dragend", dragendListener);
  window.addEventListener("dragover", dragoverListener);
  window.addEventListener("drop", dropListener);
});

onMounted(() => {
  const bodyDetails = document
    .getElementById("campaign-map-wrapper")
    ?.getBoundingClientRect();

  app = new Application({
    resolution: window.devicePixelRatio || 1,
    width: bodyDetails?.width,
    height: bodyDetails?.height,
    antialias: true,
    backgroundColor: "#1d1d1d",
  });
  // @ts-expect-error id sets element id
  app.view.id = "campaign-map";
  // @ts-expect-error app.view is valid apparently
  document.getElementById("campaign-map-wrapper")?.appendChild(app.view);

  // create viewport
  const viewport = new Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    worldWidth: bodyDetails?.width,
    worldHeight: bodyDetails?.height,
    events: app.renderer.events,
  });

  // add the viewport to the stage
  app.stage.addChild(viewport);

  // activate plugins
  viewport.drag().pinch().wheel().decelerate();
  // need to add clamp & zoomClamp
  // https://davidfig.github.io/pixi-viewport/jsdoc/Viewport.html#clampZoom

  backgroundGraphics = new Graphics();
  drawBackgroundHexGrid(backgroundGraphics, {
    width: mapBuilder.width,
    height: mapBuilder.height,
  });
  viewport.addChild(backgroundGraphics);
});

onUnmounted(() => {
  if (app) {
    app.destroy();
  }
  window.removeEventListener("dragstart", dragstartListener);
  window.removeEventListener("dragend", dragendListener);
  window.removeEventListener("dragover", dragoverListener);
  window.removeEventListener("drop", dropListener);
});

watch(
  () => [mapBuilder.width, mapBuilder.height],
  () => {
    if (!backgroundGraphics) {
      return;
    }
    backgroundGraphics.clear();
    drawBackgroundHexGrid(backgroundGraphics, {
      width: mapBuilder.width,
      height: mapBuilder.height,
    });
  }
);

const dragstartListener = (event: DragEvent) => {
  // @ts-expect-error id does exist on target
  const draggedId: string | undefined = event.target?.id;
  if (draggedId && validate(draggedId)) {
    draggedImageId = draggedId;
  }
};

const dragendListener = () => {
  // runs after drop event, so safe to reset image id
  draggedImageId = null;
};

const dragoverListener = (event: DragEvent) => {
  // @ts-expect-error id does exist on target
  if (event.target?.id === "campaign-map") {
    event.preventDefault();
  }
};

const dropListener = (event: DragEvent) => {
  event.preventDefault();
  event.stopPropagation();
  if (draggedImageId) {
    console.log(draggedImageId);
  } else {
    // files has content when new item is dragged in, and no content otherwise
    console.log("drop", event.dataTransfer?.files);
  }
};

const drawBackgroundHexGrid = (
  graphics: Graphics,
  hexGridOptions: { width: number; height: number }
) => {
  const Tile = defineHex({ dimensions: 30, origin: "topLeft" });
  const grid = new Grid(Tile, rectangle(hexGridOptions));

  drawBackground(graphics, {
    width: grid.pixelWidth,
    height: grid.pixelHeight,
  });
  drawHexagonsGrid(graphics, grid);
};

const drawBackground = (
  graphics: Graphics,
  backgroundOptions: { width: number; height: number }
) => {
  const { width, height } = backgroundOptions;
  graphics.beginFill("#303030");
  graphics.drawRect(0, 0, width, height);
  graphics.endFill();
};

const drawHexagonsGrid = (graphics: Graphics, grid: Grid<Hex>) => {
  graphics.lineStyle(1, 0x999999);
  grid.forEach((hex) => {
    graphics.drawShape(new Polygon(hex.corners));
  });
};
</script>

<style>
#campaign-map,
#campaign-map-wrapper {
  width: 100%;
  height: 100%;
}
</style>
