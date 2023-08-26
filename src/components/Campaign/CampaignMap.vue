<template>
  <div id="campaign-map-wrapper"></div>
</template>

<script setup lang="ts">
import {
  Application,
  Graphics,
  Polygon,
  type ICanvas,
  Sprite,
  FederatedPointerEvent,
  Container,
} from "pixi.js";
import { onBeforeMount, onMounted, onUnmounted, watch } from "vue";
import { defineHex, Grid, rectangle, Hex } from "honeycomb-grid";
import { Viewport } from "pixi-viewport";
import { useMapBuilder } from "@/stores/mapBuilder";
import { validate } from "uuid";
import { BACKGROUNDS } from "@/utils/map/backgrounds";

const mapBuilder = useMapBuilder();

let app: Application<ICanvas> | null = null;
let viewport: Viewport | null = null;
let baseContainer: Container | null = null;
let backgroundGraphics: Graphics | null = null;
let backgroundMaskGraphics: Graphics | null = null;
let backgroundsContainer: Container | null = null;
let backgroundsDetailsContainer: Container | null = null;
let hexGridGraphics: Graphics | null = null;
let entitiesContainer: Container | null = null;

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

  viewport = new Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    worldWidth: bodyDetails?.width,
    worldHeight: bodyDetails?.height,
    events: app.renderer.events,
  });
  app.stage.addChild(viewport);

  // activate plugins
  viewport.drag().pinch().wheel().decelerate();
  // need to add clamp & zoomClamp
  // https://davidfig.github.io/pixi-viewport/jsdoc/Viewport.html#clampZoom

  baseContainer = new Container();
  backgroundMaskGraphics = new Graphics();
  backgroundGraphics = new Graphics();
  hexGridGraphics = new Graphics();
  backgroundsContainer = new Container();
  backgroundsDetailsContainer = new Container();
  entitiesContainer = new Container();

  drawBackgroundHexGrid({
    width: mapBuilder.width,
    height: mapBuilder.height,
  });

  baseContainer.addChild(backgroundGraphics);
  baseContainer.addChild(backgroundsContainer);
  baseContainer.addChild(backgroundsDetailsContainer);
  baseContainer.addChild(hexGridGraphics);
  baseContainer.addChild(entitiesContainer);

  // need to add as child to mask is relative
  baseContainer.addChild(backgroundMaskGraphics);
  baseContainer.mask = backgroundMaskGraphics;

  viewport.addChild(baseContainer);
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
    drawBackgroundHexGrid({
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

const dropListener = async (event: DragEvent) => {
  event.preventDefault();
  event.stopPropagation();
  if (draggedImageId) {
    const background = BACKGROUNDS.find(
      (background) => background.id === draggedImageId
    );
    if (
      !viewport ||
      !backgroundGraphics ||
      !backgroundsContainer ||
      !backgroundMaskGraphics ||
      !background
    ) {
      return;
    }
    const { x, y } = viewport.toWorld(event.offsetX, event.offsetY);
    const backgroundSprite = Sprite.from(background.url);
    backgroundSprite.mask = backgroundMaskGraphics;
    backgroundSprite.x = x;
    backgroundSprite.y = y;
    if (background.width) {
      backgroundSprite.width = background.width;
    }
    if (background.height) {
      backgroundSprite.height = background.height;
    }
    backgroundsContainer.addChild(backgroundSprite);

    // TODO: in real map this should only be TRUE for GMs
    backgroundSprite.eventMode = "static";
    backgroundSprite.on("click", (event: FederatedPointerEvent) => {
      console.log(event);
    });
    console.log(backgroundSprite);
  } else {
    // files has content when new item is dragged in, and no content otherwise
    console.log("drop", event.dataTransfer?.files);
  }
};

const drawBackgroundHexGrid = (hexGridOptions: {
  width: number;
  height: number;
}) => {
  const Tile = defineHex({ dimensions: 30, origin: "topLeft" });
  const grid = new Grid(Tile, rectangle(hexGridOptions));

  drawBackground({
    width: grid.pixelWidth,
    height: grid.pixelHeight,
  });
  drawHexagonsGrid(grid);
};

const drawBackground = (backgroundOptions: {
  width: number;
  height: number;
}) => {
  const { width, height } = backgroundOptions;
  backgroundGraphics?.beginFill("#303030");
  backgroundGraphics?.drawRect(0, 0, width, height);
  backgroundGraphics?.endFill();

  backgroundMaskGraphics?.beginFill("#ffffff");
  backgroundMaskGraphics?.drawRect(0, 0, width, height);
  backgroundMaskGraphics?.endFill();
};

const drawHexagonsGrid = (grid: Grid<Hex>) => {
  hexGridGraphics?.lineStyle(1, 0x999999, 0.8);
  grid.forEach((hex) => {
    hexGridGraphics?.drawShape(new Polygon(hex.corners));
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
