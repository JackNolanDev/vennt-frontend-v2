<template>
  <Tree v-if="showTree" :options="chartOptions" :data="chartData"></Tree>
  <ForceDirectedGraph
    v-else
    :options="chartOptions"
    :data="chartData"
  ></ForceDirectedGraph>
</template>

<script setup>
import router, { WIKI_PATHS_SPECIFIC_ROUTE } from "@/router";
import { useJsonStore } from "@/stores/jsonStorage";
import { stringToLinkID } from "@/utils/textUtils";
import { Tree, ForceDirectedGraph } from "../Charts/graphs";

// TODO: Add toggle option, figure out how to make chart fit better vertically maybe figure out how to zoom in?
// figure out how to push route on clicking on data point

defineProps({ showTree: Boolean });
const jsonStorage = useJsonStore();

const serialized = jsonStorage.pathGraph.serialize();
const labels = serialized.nodes
  .map(({ id }) => id)
  .filter(
    (node) =>
      jsonStorage.pathGraph.indegree(node) > 0 ||
      jsonStorage.pathGraph.outdegree(node) > 0
  );
const edges = serialized.links.map(({ source, target }) => ({
  source: labels.indexOf(source),
  target: labels.indexOf(target),
}));

const chartData = {
  labels,
  datasets: [
    {
      borderColor: "#4b4a67",
      borderWidth: 1,
      pointBackgroundColor: "#d66260",
      pointRadius: 5,
      pointBorderWidth: 0,
      directed: true,
      data: labels.map(() => ({})),
      edges,
    },
  ],
};

// output type: ChartOptions
const chartOptions = {
  aspectRatio: 1.6,
  // maintainAspectRatio: false,
  onClick: (_event, elements) => {
    const [first] = elements;
    if (!first) {
      return;
    }

    router.push({
      name: WIKI_PATHS_SPECIFIC_ROUTE,
      params: { path: stringToLinkID(labels[first.index]) },
      query: router.currentRoute.value.query,
    });
  },
};
</script>
