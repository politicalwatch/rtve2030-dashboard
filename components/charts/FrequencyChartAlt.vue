<template>
  <div class="relative w-full h-full">
    
    <svg :width="availableWidth" :height="availableHeight">
      
      <!--  axis -->
      <!-- cutted from here now on the top -->

      
      <g
        class="axis xaxis"
        :transform="`translate(${margin.left},${margin.top})`"
      >
        <!-- horizontal line for x axis-->
        <line
          :y1="height"
          :y2="height"
          :x1="0"
          :x2="width"
          stroke="black"
          stroke-width="1"
        ></line>
   
        
      </g>
     

      <!-- bars -->
      <g class="rects" :transform="`translate(${margin.left}, ${margin.top})`">
        <g v-for="(bar, index) in bars" :key="bar.index">
          <!-- a "background rect" invisible ocupying full height above each one of the previous rects useful only for interaction-->
          <rect
            :x="xTimeScale(bar.firstDay)"
            :y="0"
            :width="(xTimeScale(bar.endDay) - xTimeScale(bar.firstDay)) > 0 ? (xTimeScale(bar.endDay) - xTimeScale(bar.firstDay)) : oneDayWidth"
            :height="height"
            class="bar-background"
            @mouseover="activeBar = bar"
            @mouseout="activeBar = null"
          ></rect>

          <!-- visible-->
          <!-- first rect with the analized time total_duration-->
          <rect
            :x="xTimeScale(bar.firstDay)"
            :width="(xTimeScale(bar.endDay) - xTimeScale(bar.firstDay)) > 0 ? (xTimeScale(bar.endDay) - xTimeScale(bar.firstDay)) : oneDayWidth"
            :height="height - yScale(bar.total_duration)"
            :y="yScale(bar.total_duration)"
            :class="{ '!fill-red-100': activeBar && activeBar.index === bar.index }"
            class="bar fill-gray-50"
          />
          <!-- seccond rect with the tagged time total_duration-->
          <rect
            :x="xTimeScale(bar.firstDay)"
            :width="(xTimeScale(bar.endDay) - xTimeScale(bar.firstDay)) > 0 ? (xTimeScale(bar.endDay) - xTimeScale(bar.firstDay)) : oneDayWidth"
            :height="afterNextTick ? height - yScale(bar.tagged_duration) : 0"
            :y="afterNextTick ? yScale(bar.tagged_duration) : height"
             :class="{ '!fill-red-300': activeBar && activeBar.index === bar.index }"
            class="bar fill-gray-300"
          />

          <!-- third rect with the tagged time total_duration-->
          <rect
            :x="xTimeScale(bar.firstDay)"
            :width="(xTimeScale(bar.endDay) - xTimeScale(bar.firstDay)) > 0 ? (xTimeScale(bar.endDay) - xTimeScale(bar.firstDay)) : oneDayWidth"
            :height="afterNextTick ? height - yScale(bar.query_duration) : 0"
            :y="afterNextTick ? yScale(bar.query_duration) : height"
             :class="{ '!fill-red-500': activeBar && activeBar.index === bar.index }"
            class="bar fill-gray-500"
          />

          <!-- a line above the rect on its top side-->
          <line
            :x1="xTimeScale(bar.firstDay)"
            :x2="(xTimeScale(bar.endDay) - xTimeScale(bar.firstDay)) > 0 ? xTimeScale(bar.endDay)  : xTimeScale(bar.firstDay) + oneDayWidth"
            y1="0"
            y2="0"
            :transform="`translate(0, ${
              afterNextTick ? yScale(hasActiveFilters ? bar.query_duration : bar.tagged_duration) : height
            })`"
            class="transition-all duration-1000 ease-in-out"
            stroke="black"
            stroke-width="2"
          ></line>
        </g>
      </g>

      <!-- top text -->
      <g class="top-text" :transform="`translate(${margin.left},10 )`">
        <text
          v-if="activeBar"
          font-size="0.8rem"
          font-weight="light"
          fill="#333"
          class="font-mono"
          :text-anchor="
            xScale(activeBar.index) < 50
              ? 'start'
              : xScale(activeBar.index) > width - 130
              ? 'end'
              : 'start'
          "
        >
          <tspan :x="xScale(activeBar.index)" :y="margin.top / 2">
            {{
              activeBar.firstDay.toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "short",
              })
            }}-{{
              activeBar.endDay.toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "short",
              })
            }}
          </tspan>
          <tspan dy="1.2em" :x="xScale(activeBar.index)" :y="margin.top / 2">Analizadas:
            <tspan font-weight="bold">
              {{ format.F(msToHours(activeBar.total_duration)) }} horas
            </tspan>
          </tspan>
          <tspan dy="2.4em" :x="xScale(activeBar.index)" :y="margin.top / 2">
            Agenda 2030:
            <tspan font-weight="bold">
              {{ format.F(msToHours(activeBar.tagged_duration)) }} horas
            </tspan>
          </tspan>
        </text>
      </g>

    <!-- bottom line -->
        <line
        x1="0"
        :x2="availableWidth"
        :y1="yScale(0) + margin.top"
        :y2="yScale(0) + margin.top"
        stroke="#000"
       />
     
       <!-- y axis -->
      <g
        class="axis yaxis"
        :transform="`translate(${margin.left - MARGIN_AXIS + MARGIN_AXIS}, ${margin.top})`"
      >
      
        <g
          class="tick"
          v-for="(tick, index) in yScale.nice().ticks(5)"
          :key="index"
          :transform="`translate(0, ${yScale(tick)})`"
        >
          <line x1="-6" :x2="availableWidth" class="ticks" />
          <text :x="availableWidth" dy="-0.333em" dx="-0.5em" text-anchor="end" class="font-mono">
            {{ format.N(msToHours(tick)) }}h
          </text>
        </g>
      </g>
    
    </svg>
      
  </div>
</template>

<script setup>


import {
  min,
  max,
  range,
  scaleBand,
  timeFormat,
  timeWeek,
  timeMonth,
  scaleLinear,
  scaleTime,
} from "d3";

const props = defineProps({
  availableWidth: {
    type: Number,
    default: 800,
  },
  availableHeight: {
    type: Number,
    default: 400,
  },
  topicsStyles: {
    type: Object,
    required: true,
  },
  /* 
  dataset is an array of objects with the format {week: '2021-01', initiatives: 10}
  It is the dataset for the selected topic
  if dataset is provided as null value, component might fail
  if dataset is provided as an empty array, component will generate a random dataset
  */
  dataset: {
    type: Object,
    default: () => ({
      initObj: new Date(),
      endObj: new Date(),
      groupedData: [],
    }),
  },

  hasActiveFilters: {
    type: Boolean,
    default: false,
  },
});

const margin = { top: 30, right: 60, bottom: 40, left: 0 };
const MARGIN_AXIS = 10;

/* chart size inside the axis*/
const width = computed(() => props.availableWidth - margin.left - margin.right );
const height = computed(
  () => props.availableHeight - margin.top - margin.bottom + margin.bottom
);

//**** end of size block**************** ***/

const data = computed(() => {
  return props.dataset.groupedData;
});

/*** blocks analyze the different datasets and compute analytics ************************/

/* analytics for all years ****/
const datasetAnalytics = computed(() => {
  // data.value contais the an array of objects with the format {week: '2021-01', initiatives: 10}
  const a = {
    initDate: props.dataset.initObj,
    endDate: props.dataset.endObj,
    firstYear: props.dataset.initObj.getFullYear(),
    lastYear: props.dataset.endObj.getFullYear(),
    maxTimeTotal: max(data.value, (d) => d.total_duration),
    maxTimeTagged: min(data.value, (d) => d.tagged_duration),
    maxTimeQuery: min(data.value, (d) => d.query_duration),
  };
  // allyears is an array going from firstYear to lastYear (both included)
  a.countYears = parseInt(a.lastYear) - parseInt(a.firstYear);

  a.allYears = range(parseInt(a.firstYear), parseInt(a.lastYear) + 1);
  return a;
});

/*** scales for charts
 * To set the domains we take into account the mode (multiYearMode) and if aggregated data is also on the chart
 */

// xScale is a band scale with the weeks as domain
const xScale = computed(() =>
  scaleBand()
    .domain(props.dataset.groupedData.map((d) => d.index))
    .range([0, width.value])
    .padding(0)
);

    const lastDay = computed(()=> {
        // one extra day
        const day = 60 * 60 * 24 * 1000;
        const dday = props.dataset.groupedData[props.dataset.groupedData.length -1].endDay
        return dday.getTime() + day;
        // return props.dataset.groupedData[props.dataset.groupedData.length -1].endDay;
    })

    const firstDay = computed(()=> {
        return props.dataset.groupedData[0].firstDay;
    })

    // d3.scaleTime([new Date(2000, 0, 1), new Date(2000, 0, 2)], [0, 960]);
    const xTimeScale = computed(()=> {
        return scaleTime([firstDay.value, lastDay.value], [0, width.value]);
    })
    
    const oneDayWidth = computed(()=> {
        const day = 60 * 60 * 24 * 1000;
        const nextFirstDay = firstDay.value.getTime() + day;
        // const nextFirstDay = firstDay.value
        return xTimeScale.value(nextFirstDay) - xTimeScale.value(firstDay.value)
    })

// ticks for xScale:
// Generate 10 ticks for xScale using d3 functions
/*
const xTicks = computed(() => {
  const allTicks = xScale.value.domain();
  const tickCount = 10;
  const step = Math.ceil(allTicks.length / tickCount);
  return allTicks.filter((_, i) => i % step === 0);
});
*/

const yScale = computed(() =>
  scaleLinear()
    .domain([0, datasetAnalytics.value.maxTimeTotal])
    .range([height.value, 0])
);

// const barWidth = computed(() => xScale.value.bandwidth());
const bars = computed(() => data.value);

//** interaction block*/
const activeBar = ref(null);
const forceSingleYearMode = ref(true);

// multiYearMode is true if there is more than one year in the dataset and forceSingleYearMode is false.
const availableMultiYearOptions = computed(
  () => datasetAnalytics.value.countYears > 1
);
const multiYearMode = computed(
  () => availableMultiYearOptions.value && !forceSingleYearMode.value
);

const theme = ref({
  lightGray: "#9cb0bf",
});

// relative view
const emit = defineEmits(["update:showComparativeMode"]);

const showComparativeMode = ref(false);
watch(showComparativeMode, (newValue, oldValue) => {
  emit("update:showComparativeMode", newValue);
});

const isRelativeModeReady = computed(
  () =>
    showComparativeMode.value === true && props.aggreagatedDataset?.length > 0
);

function firstDayToTick(tick, index) {
  const date = data.value.find((d) => d.index === tick).firstDay 
  if (props.dataset.groupingBy === 30) {
    // display only month and year like 01-2021 but display year only if it's different from the previous tick
    const previousTick = xTicks.value[index - 1];
    const previousTickDate = data.value.find((d) => d.index === previousTick);

    if (
      index === 0 ||
      (previousTickDate &&
        date.getFullYear() !== previousTickDate.firstDay.getFullYear())
    ) {
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
      });
    } else {
      return date.toLocaleDateString("es-ES", {
        month: "short",
      });
    }
  } else {
    // display day, month and year numeric like 2021-01-01
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
}
const afterNextTick = ref(false);

onMounted(() => {
  setTimeout(() => {
    afterNextTick.value = true;
  }, 100);
});

onMounted(() => {});

</script>

<style scoped>
.bar {
  stroke-opacity: 0.05;
  pointer-events: none;
  transition: transform 0.8s ease-in-out, fill 0.1s;
}
.bar:hover,
.bar.active {
  stroke-opacity: 1;
}
.bar-background {
  fill: transparent;
}
.bar-background.active {
  fill: #f8f8f8;
  transition: 0.1s;
}


.axis text {
  font-size: 0.8rem;
  font-weight: light;
  /*fill: v-bind("theme.lightGray");*/
  fill: #333;
}
.axis line {
   /*stroke: v-bind("theme.lightGray");*/
  stroke: rgba(0,0,0,.1)
}
.axis line.ticks {
  /*stroke-opacity: 0.5;*/
  
}

.tick_hor line{
  stroke: #333;
 
}

.yearSelectors {
  display: flex;
  justify-content: center;

  gap: 2px;
}
.yearSelectors a:first-child {
  border-radius: 0.4rem 0 0 0.4rem;
}
.yearSelectors a:last-child {
  border-radius: 0 0.4rem 0.4rem 0;
}
.yearSelectors a {
  border-radius: 0;
}

.controls-container {
  align-items: center;
  margin-top: 0rem;
}
.frequency-chart-wrapper {
  margin-bottom: 1rem;
}

.custom-tipi-loader-styles {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.5;
  z-index: 100;
}
</style>
