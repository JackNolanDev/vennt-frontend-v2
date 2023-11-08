<template>
  <div :id="WRAPPER_ID"></div>
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
  DisplayObject,
} from "pixi.js";
import { onBeforeMount, onMounted, onUnmounted, watch } from "vue";
import { defineHex, Grid, rectangle, Hex } from "honeycomb-grid";
import { Viewport } from "pixi-viewport";
import { useMapBuilder } from "@/stores/mapBuilder";
import { validate } from "uuid";
import { BACKGROUNDS } from "@/utils/map/backgrounds";

const WRAPPER_ID = "campaign-map-wrapper";
const MAP_IP = "campaign-map";

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
let uiContainer: Container | null = null;
let resizeActiveImageContainer: Container | null = null;
let activeImage: Sprite | null = null;

let draggedImageId: string | null = null;

let ignoreClick = false;

onBeforeMount(() => {
  window.addEventListener("click", clickListener);
  window.addEventListener("keydown", keydownListener);
  window.addEventListener("dragstart", dragstartListener);
  window.addEventListener("dragend", dragendListener);
  window.addEventListener("dragover", dragoverListener);
  window.addEventListener("drop", dropListener);
});

onMounted(() => {
  const wrapper = document.getElementById(WRAPPER_ID);
  const bodyDetails = wrapper?.getBoundingClientRect();

  app = new Application({
    resolution: window.devicePixelRatio || 1,
    width: bodyDetails?.width,
    height: bodyDetails?.height,
    resizeTo: wrapper ?? undefined,
    antialias: true,
    backgroundColor: "#1d1d1d",
  });
  // @ts-expect-error id sets element id
  app.view.id = MAP_IP;
  // @ts-expect-error app.view is valid apparently
  wrapper?.appendChild(app.view);

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
  uiContainer = new Container();
  resizeActiveImageContainer = new Container();

  drawBackgroundHexGrid({
    width: mapBuilder.width,
    height: mapBuilder.height,
  });

  baseContainer.addChild(backgroundGraphics);
  baseContainer.addChild(backgroundsContainer);
  baseContainer.addChild(backgroundsDetailsContainer);
  baseContainer.addChild(hexGridGraphics);
  baseContainer.addChild(entitiesContainer);

  uiContainer.addChild(resizeActiveImageContainer);

  // need to add as child to mask is relative
  baseContainer.addChild(backgroundMaskGraphics);
  baseContainer.mask = backgroundMaskGraphics;

  viewport.addChild(baseContainer);
  viewport.addChild(uiContainer);
});

onUnmounted(() => {
  app?.destroy();
  window.removeEventListener("click", clickListener);
  window.removeEventListener("keydown", keydownListener);
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
  },
);

const clickListener = () => {
  if (ignoreClick) {
    ignoreClick = false;
    return;
  }
  clearActiveImage();
};

const clearActiveImage = () => {
  if (activeImage) {
    activeImage.cursor = "default";
    activeImage = null;
  }
  cleanupResizeImageContainer();
};

const cleanupResizeImageContainer = () => {
  const removedUIElements = resizeActiveImageContainer?.removeChildren();
  removedUIElements?.forEach((element: DisplayObject) => {
    // cleanup elements
    element.destroy();
  });
};

const keydownListener = (event: KeyboardEvent) => {
  if (activeImage) {
    if (event.key === "Backspace" || event.key === "Delete") {
      activeImage.destroy();
      activeImage = null;
      cleanupResizeImageContainer();
    }
  }
};

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
  if (event.target?.id === MAP_IP) {
    event.preventDefault();
  }
};

const dropListener = async (event: DragEvent) => {
  event.preventDefault();
  event.stopPropagation();
  if (draggedImageId) {
    const background = BACKGROUNDS.find(
      (background) => background.id === draggedImageId,
    );
    if (
      !viewport ||
      !backgroundGraphics ||
      !backgroundsContainer ||
      !backgroundsDetailsContainer ||
      !backgroundMaskGraphics ||
      !uiContainer ||
      !background
    ) {
      return;
    }
    const { x, y } = viewport.toWorld(event.offsetX, event.offsetY);
    const backgroundSprite = Sprite.from(background.url);
    backgroundSprite.anchor.set(0.5, 0.5);
    backgroundSprite.mask = backgroundMaskGraphics;
    backgroundSprite.x = x;
    backgroundSprite.y = y;
    if (background.width) {
      backgroundSprite.width = background.width;
    }
    if (background.height) {
      backgroundSprite.height = background.height;
    }
    if (background.type === "background") {
      backgroundsContainer.addChild(backgroundSprite);
    } else {
      backgroundsDetailsContainer.addChild(backgroundSprite);
    }

    const highlightGraphics = new Graphics();
    uiContainer.addChild(highlightGraphics);

    /* **** DRAGGING LOGIC **** */
    let dragging = false;
    let lastPoint: { x: number; y: number } | null = null;
    const draggingHandler = (event: FederatedPointerEvent) => {
      if (!viewport || !lastPoint || !resizeActiveImageContainer) {
        return;
      }
      const newPoint = viewport.toWorld(event.x, event.y);
      const xDiff = newPoint.x - lastPoint.x;
      const yDiff = newPoint.y - lastPoint.y;
      backgroundSprite.x += xDiff;
      backgroundSprite.y += yDiff;
      resizeActiveImageContainer.children.forEach((uiElements) => {
        uiElements.x += xDiff;
        uiElements.y += yDiff;
      });
      lastPoint = newPoint;
    };
    const dragStartHandler = (event: FederatedPointerEvent) => {
      if (activeImage === backgroundSprite && viewport) {
        dragging = true;
        lastPoint = viewport.toWorld(event.x, event.y);
        backgroundSprite.on("mousemove", draggingHandler);
        backgroundSprite.cursor = "grabbing";
        viewport.pause = true;
      }
    };
    const dragEndHandler = () => {
      if (activeImage === backgroundSprite && dragging && viewport) {
        dragging = false;
        lastPoint = null;
        backgroundSprite.removeEventListener("mousemove", draggingHandler);
        backgroundSprite.cursor = "grab";
        viewport.pause = false;
      }
    };
    /* **** END DRAGGING LOGIC **** */

    // TODO: in real map this should only be TRUE for GMs
    backgroundSprite.eventMode = "static";
    // could potentially change to mouseover / mouseout
    backgroundSprite.on("mouseenter", () => {
      if (activeImage !== backgroundSprite) {
        highlightGraphics.lineStyle(2, "#26A2FC"); // 26A2FC is lighter version?
        highlightGraphics.drawRect(
          backgroundSprite.x - backgroundSprite.width / 2,
          backgroundSprite.y - backgroundSprite.height / 2,
          backgroundSprite.width,
          backgroundSprite.height,
        );
      }
    });
    backgroundSprite.on("mouseleave", () => {
      highlightGraphics.clear();
      if (dragging) {
        dragEndHandler();
      }
    });
    backgroundSprite.on("click", () => {
      ignoreClick = true;
      clearActiveImage();
      activeImage = backgroundSprite;
      highlightGraphics.clear();
      backgroundSprite.cursor = "grab";

      drawResizeUIComponents(backgroundSprite).forEach((element) => {
        resizeActiveImageContainer?.addChild(element);
      });
    });
    // TODO: Switch from background sprite event handler, to more generic one
    backgroundSprite.on("mousedown", dragStartHandler);
    backgroundSprite.on("mouseup", dragEndHandler);
  } else {
    // files has content when new item is dragged in, and no content otherwise
    console.log("drop", event.dataTransfer?.files);
  }
};

/*
idx locations:
0 1 2
3   4
5 6 7
*/

const drawResizeUIComponents = (element: Sprite): Graphics[] => {
  const outline = new Graphics();
  outline.name = "outline";
  outline.lineStyle(2, "#2E67E6");
  outline.drawRect(
    element.x - element.width / 2,
    element.y - element.height / 2,
    element.width,
    element.height,
  );
  const graphics: Graphics[] = [outline];
  for (let idx = 0; idx <= 7; idx++) {
    graphics.push(drawResizeUIComponent(element, idx));
  }
  return graphics;
};

const drawResizeUIComponent = (element: Sprite, idx: number): Graphics => {
  const ui = new Graphics();
  const { x, y } = resizeUIComponentPoint(element, idx);
  ui.name = idx.toString();
  ui.beginFill("#2E67E6");
  ui.drawCircle(x, y, 5);
  ui.eventMode = "static";
  ui.cursor = resizeUIComponentCursor(idx);

  const map = document.getElementById(MAP_IP);

  let lastPoint: { x: number; y: number } | null = null;
  const getUIDragHandler = (): ((event: MouseEvent) => void) => {
    let handler: (xDiff: number, yDiff: number) => void = () => {
      // empty on default
    };
    // add function for describing which nodes move at half speed / full speed
    // can simplify with helper function then
    switch (idx) {
      case 0:
        handler = uiDragHandlerFun({
          element,
          elYDiffMult: 1,
          elHeightDiffMult: -1,
          uiYFull: ["0", "1", "2"],
          uiYHalf: ["3", "4"],
          elXDiffMult: 1,
          elWidthDiffMult: -1,
          uiXFull: ["0", "3", "5"],
          uiXHalf: ["1", "6"],
        });
        break;
      case 1:
        handler = uiDragHandlerFun({
          element,
          elYDiffMult: 1,
          elHeightDiffMult: -1,
          uiYFull: ["0", "1", "2"],
          uiYHalf: ["3", "4"],
        });
        break;
      case 2:
        handler = uiDragHandlerFun({
          element,
          elYDiffMult: 1,
          elHeightDiffMult: -1,
          uiYFull: ["0", "1", "2"],
          uiYHalf: ["3", "4"],
          elXDiffMult: 1,
          elWidthDiffMult: 1,
          uiXFull: ["2", "4", "7"],
          uiXHalf: ["1", "6"],
        });
        break;
      case 3:
        handler = uiDragHandlerFun({
          element,
          elXDiffMult: 1,
          elWidthDiffMult: -1,
          uiXFull: ["0", "3", "5"],
          uiXHalf: ["1", "6"],
        });
        break;
      case 4:
        handler = uiDragHandlerFun({
          element,
          elXDiffMult: 1,
          elWidthDiffMult: 1,
          uiXFull: ["2", "4", "7"],
          uiXHalf: ["1", "6"],
        });
        break;
      case 5:
        handler = uiDragHandlerFun({
          element,
          elXDiffMult: 1,
          elWidthDiffMult: -1,
          uiXFull: ["0", "3", "5"],
          uiXHalf: ["1", "6"],
          elYDiffMult: 1,
          elHeightDiffMult: 1,
          uiYFull: ["5", "6", "7"],
          uiYHalf: ["3", "4"],
        });
        break;
      case 6:
        handler = uiDragHandlerFun({
          element,
          elYDiffMult: 1,
          elHeightDiffMult: 1,
          uiYFull: ["5", "6", "7"],
          uiYHalf: ["3", "4"],
        });
        break;
      case 7:
        handler = uiDragHandlerFun({
          element,
          elXDiffMult: 1,
          elWidthDiffMult: 1,
          uiXFull: ["2", "4", "7"],
          uiXHalf: ["1", "6"],
          elYDiffMult: 1,
          elHeightDiffMult: 1,
          uiYFull: ["5", "6", "7"],
          uiYHalf: ["3", "4"],
        });
        break;
    }
    return (event: MouseEvent) => {
      if (!viewport || !lastPoint) {
        return;
      }
      // TODO: rely on event.shiftKey to maintain image aspect ratio
      const newPoint = viewport.toWorld(event.x, event.y);
      const xDiff = newPoint.x - lastPoint.x;
      const yDiff = newPoint.y - lastPoint.y;
      handler(xDiff, yDiff);
      lastPoint = newPoint;
    };
  };
  const uiDragHandler = getUIDragHandler();
  const uiDragEndHandler = () => {
    map?.removeEventListener("mousemove", uiDragHandler);
    map?.removeEventListener("mouseup", uiDragEndHandler);
    if (!viewport) {
      return;
    }
    lastPoint = null;
    viewport.pause = false;
    const outline = resizeActiveImageContainer?.getChildByName("outline");
    if (outline instanceof Graphics) {
      outline.lineStyle(2, "#2E67E6");
      outline.drawRect(
        element.x - element.width / 2,
        element.y - element.height / 2,
        element.width,
        element.height,
      );
    }
  };
  ui.on("mousedown", (event) => {
    if (!viewport) {
      return;
    }
    ignoreClick = true;
    map?.addEventListener("mousemove", uiDragHandler);
    map?.addEventListener("mouseup", uiDragEndHandler);
    viewport.pause = true;
    lastPoint = viewport.toWorld(event.x, event.y);
  });
  return ui;
};

const uiDragHandlerFun = ({
  element,
  elXDiffMult = 0,
  elWidthDiffMult = 0,
  elYDiffMult = 0,
  elHeightDiffMult = 0,
  uiXFull = [],
  uiXHalf = [],
  uiYFull = [],
  uiYHalf = [],
}: {
  element: Sprite;
  elXDiffMult?: number;
  elWidthDiffMult?: number;
  elYDiffMult?: number;
  elHeightDiffMult?: number;
  uiXFull?: string[];
  uiXHalf?: string[];
  uiYFull?: string[];
  uiYHalf?: string[];
}): ((xDiff: number, yDiff: number) => void) => {
  return (xDiff, yDiff) => {
    element.x += (xDiff / 2) * elXDiffMult;
    element.width += xDiff * elWidthDiffMult;
    element.y += (yDiff / 2) * elYDiffMult;
    element.height += yDiff * elHeightDiffMult;
    resizeActiveImageContainer?.children.forEach((uiElement) => {
      if (uiElement instanceof Graphics && uiElement.name) {
        if (uiElement.name === "outline") {
          uiElement.clear();
          return;
        }
        if (uiXFull.includes(uiElement.name)) {
          uiElement.x += xDiff;
        } else if (uiXHalf.includes(uiElement.name)) {
          uiElement.x += xDiff / 2;
        }
        if (uiYFull.includes(uiElement.name)) {
          uiElement.y += yDiff;
        } else if (uiYHalf.includes(uiElement.name)) {
          uiElement.y += yDiff / 2;
        }
      }
    });
  };
};

const resizeUIComponentPoint = (
  element: Sprite,
  idx: number,
): { x: number; y: number } => {
  let x = element.x;
  let y = element.y;

  if ([0, 3, 5].includes(idx)) {
    x -= element.width / 2;
  } else if ([2, 4, 7].includes(idx)) {
    x += element.width / 2;
  }

  if (idx <= 2) {
    y -= element.height / 2;
  } else if (idx >= 5) {
    y += element.height / 2;
  }

  return { x, y };
};

const resizeUIComponentCursor = (idx: number): string => {
  switch (idx) {
    case 0:
    case 7:
      return "nwse-resize";
    case 1:
    case 6:
      return "ns-resize";
    case 2:
    case 5:
      return "nesw-resize";
    case 3:
    case 4:
      return "ew-resize";
    default:
      return "default";
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
