<script setup lang="ts">
import {
  scaleLinear,
  scalePoint,
  max,
  area,
  line,
  curveCatmullRom,
  curveMonotoneX,
  scaleTime,
  bisect,
  range,
} from "d3";

import { useElementSize } from "@vueuse/core";

interface Props {
  statsData: StatsEvolution;
  formatter?: Function;
}

const props = withDefaults(defineProps<Props>(), {
  formatter: (value: number) => Math.round(value),
});

// ---------------------------------- dom templates and sizes -------------------
const svgContainer = ref(null);
const svg = ref(null);
// con esta función availableWidth es una variable reactiva que siempre tiene el tamaño del contenedor aunque se redimensione la ventana
const { width: availableWidth, height: availableHeight } =
  useElementSize(svgContainer);

watch(availableWidth, (newValue, oldValue) => {
  // SI  HAY QUE HACER ALGO AL REESCALAR SE PONDRÍA AQUÍ
  // console.log("availableWidth changed", newValue, oldValue);
});

const canvasWidth = computed(() => {
  return availableWidth.value;
});

const canvasHeight = computed(() => {
  return 100;
});
const padding = { top: 0, right: 0, bottom: 0, left: 0 };
const xAxisHeight = 20; // space for the x axis below //  168
const yAxisWidthLeft = 0;
const yAxisWidthRight = 0; // 320

const availableHeighForBars = computed(() => {
  return canvasHeight.value - padding.top - padding.bottom - xAxisHeight;
});

const availableWidthForBars = computed(() => {
  return (
    availableWidth.value -
    padding.left -
    padding.right -
    yAxisWidthLeft -
    yAxisWidthRight
  );
});

const globalData = computed(() => {
  return props.statsData.hoursPeriod;
});
// scales
const maxData = computed(() => {
  const maxCount = max(
    averagedData.value,
    (d: DateDuration) => d.total_duration
  );
  return maxCount;
  // return max(globalData.value, (d) => d.count);
});

const timeScale = computed(() => {
  return scaleTime(
    [new Date(props.statsData.init), new Date(props.statsData.end)],
    [0, availableWidthForBars.value]
  );
});

const heightScale = computed(() => {
  return scaleLinear()
    .domain([0, maxData.value * 1.03])
    .range([availableHeighForBars.value, 0]);
});

function movingAverage(values: number[], N: number): number[] {
  let i = 0;
  let sum = 0;
  const means = new Float64Array(values.length).fill(NaN);
  for (let n = Math.min(N - 1, values.length); i < n; ++i) {
    sum += values[i];
  }
  for (let n = values.length; i < n; ++i) {
    sum += values[i];
    means[i] = sum / N;
    sum -= values[i - N + 1];
  }
  return Array.from(means);
}

const averagedData = computed(() => {
  return movingAverage(
    globalData.value.map((d) => d.total_duration),
    14
  )
    .filter((d) => !isNaN(d))
    .map((d, i) => ({ date: globalData.value[i].date, total_duration: d }));
});

// generators
const areaGenerator = computed(() => {
  return area()
    .x((d) => timeScale.value(new Date(d.date)))
    .y0((d) => heightScale.value(0))
    .y1((d) => heightScale.value(d.total_duration));
});

/** intraction */

const mouseXPosition = ref(0);

const mouseXPositionAdjusted = computed(() => {
  return mouseXPosition.value - padding.left;
});

const setMouseXPosition = (event: MouseEvent) => {
  mouseXPosition.value = event.offsetX;
};
const onMouseExitCanvas = () => {
  mouseXPosition.value = 0;
};
</script>

<template>
  <div>
    <div ref="svgContainer" class="w-full">
      <svg
        ref="svg"
        class="stroke-black border-2"
        :width="canvasWidth"
        :height="canvasHeight"
        @mousemove="setMouseXPosition($event)"
        @mouseleave="onMouseExitCanvas"
      >
        <g
          :transform="`translate(${padding.left},${padding.top})`"
          class="chart-content"
        >
          <g class="area-canvas" :transform="`translate(0,0)`">
            <!--- area C -->
            <path
              fill="#333"
              stroke="none"
              :d="areaGenerator(averagedData)"
            ></path>

            <!-- <path
              stroke="#000"
              :stroke-width="1"
              fill="none"
              :d="lineGenerator(averagedData)"
            ></path> -->
          </g>
          <!-- x axis -->
          <g id="axis" :transform="`translate(0,${availableHeighForBars})`">
            <g
              v-for="(d, i) in timeScale.ticks(6)"
              :key="i"
              :transform="`translate( ${timeScale(d)},0)`"
            >
             <line
              x1="0"
              y1="0"
              x2="0"
              y2="4"
              stroke="#000"
              stroke-width="1"              
            />
            <text
              x="0"
              :y="xAxisHeight*0.66"              
              text-anchor="middle"
              class="text-2xs font-thin fill-neutral-500"
            >
          {{ d.getFullYear()}}
            </text>
            </g>
          </g>
        </g>
      </svg>
    </div>
  </div>
</template>

<style scoped></style>
