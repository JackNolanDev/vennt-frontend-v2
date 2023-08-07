<template>
  <Line :data="data" :options="options"></Line>
</template>

<script setup lang="ts">
import { useEntityStore } from "@/stores/entity";
import { attrShortName, getMaxAttr } from "@/utils/attributeUtils";
import { entityColor } from "@/utils/entityUtils";
import type { EntityAttribute } from "@/utils/backendTypes";
import {
  Filler,
  type ChartData,
  type ChartDataset,
  type Point,
} from "chart.js";
import { computed } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

Chart.register(
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Filler
);

const props = defineProps<{
  attr: EntityAttribute;
}>();
const entityStore = useEntityStore();

const maxAttr = computed(() => getMaxAttr(props.attr));
const data = computed((): ChartData<"line", (number | Point | null)[]> => {
  const changelog = entityStore.changelogs[props.attr]?.changelog ?? [];
  const changelogValues = changelog
    .map((el) => el.prev ?? null)
    .concat([entityStore.entityAttributes[props.attr]?.base ?? null]);
  const color = entityColor(entityStore.entity?.entity);
  const datasets: ChartDataset<"line", (number | Point | null)[]>[] = [
    {
      label: attrShortName(props.attr),
      data: changelogValues,
      fill: true,
      borderColor: color,
      backgroundColor: color + "40",
      tension: 0.1,
      pointStyle: false,
    },
  ];

  if (maxAttr.value) {
    const val = entityStore.entityAttributes[maxAttr.value]?.val;
    if (val) {
      const maxData = Array(changelogValues.length).fill(null);
      maxData[0] = val;
      maxData[maxData.length - 1] = val;
      datasets.push({
        label: attrShortName(maxAttr.value),
        data: maxData,
        borderColor: "#d66260",
        borderDash: [5, 15],
        spanGaps: true,
        pointStyle: false,
      });
    }
  }

  return {
    labels: changelogValues.map(
      (_val, idx) => idx - changelogValues.length + 1
    ),
    datasets,
  };
});

const options = {
  scales: {
    y: {
      suggestedMin: 0,
    },
  },
  aspectRatio: 1.225,
};
</script>
