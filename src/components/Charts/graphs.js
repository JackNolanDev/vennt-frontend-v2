import { createTypedChart } from "vue-chartjs";
import { Tooltip, LineElement, PointElement, LinearScale } from "chart.js";
import {
  DendrogramController,
  ForceDirectedGraphController,
  EdgeLine,
  TreeController,
} from "chartjs-chart-graph";

const deps = [
  Tooltip,
  LineElement,
  PointElement,
  DendrogramController,
  ForceDirectedGraphController,
  EdgeLine,
  TreeController,
  LinearScale,
];

export const Tree = createTypedChart("tree", deps);
export const Dendrogram = createTypedChart("dendrogram", deps);
export const ForceDirectedGraph = createTypedChart("forceDirectedGraph", deps);
