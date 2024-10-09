<template>
  <div class="relative">
    <svg class="radialView" :width="width" :height="canvasHeight">
      <g :transform="`translate(${width / 2}, ${canvasHeight / 2})`">
        <path
          v-for="d in dataHierarchy
            .descendants()
            .filter((d) => d.depth > 0 && d.depth <= maxLevel)"
          :key="d.name"
          :d="arcGenerator(d)"
          :fill="d.data.color"
          :stroke="d.depth === 3 ? '#fff' : 'transparent'"
          :class="`depth-` + d.depth + ' ' + getClassesForHovered(d)"
          @mouseover="onMouseOver($event, d)"
          @mouseleave="onMouseOut($event, null)"
          @click="onClick($event, d)"
        ></path>
        <text
          v-for="d in dataHierarchy
            .descendants()
            .filter(
              (d) =>
                d.depth < maxLevel &&
                showText(d) &&
                !isNaN(arcGenerator.centroid(d)[0])
            )"
          :key="d.name"
          :transform="`translate(${arcGenerator.centroid(d)})`"
          :dy="0"
          :dx="0"
          text-anchor="middle"
          :font-size="d.depth === 1 ? '14px' : '10px'"
          fill="#fff"
          font-weight="600"
          pointer-events="none"
        >
          {{ d.data.code }}
        </text>
      </g>
    </svg>

    <div>
      <!-- 
        suma de la duracion desde las metas: {{ Math.round(msToHours(dataHierarchy.value)) }},--- , suma de todos los SDG.duration:{{  Math.round(msToHours(totalSdgDurationCalculated)) }}
        -->
    </div>

    <Teleport to="body">
      <div
        class="simple-tooltip shadow-lg outline-gray-500 px-4 py-2"
        v-show="hoveredItem"
        :style="{
          top: tooltipPosition.y + 'px',
          left: tooltipPosition.x + 'px',
        }"
      >
        <div v-if="hoveredItem">
          <div class="tooltip-content">
            <div class="codes-indicators">
              <div
                class="ods-number"
                :style="{
                  'background-color': hoveredItem.data.color,
                }"
              >
                {{ hoveredItem.data.level1 }}
              </div>
              <div
                v-if="hoveredItem.depth > 1"
                class="meta-number"
                :style="{
                  'background-color': hoveredItem.data.color,
                }"
              >
                {{ hoveredItem.data.level2 }}
              </div>
            </div>
            <div class="codes-labels">
              <div>{{ hoveredItem.parent.tag }}</div>
              <div>{{ hoveredItem.data.name }}</div>
            </div>
            <div class="font-semibold">
              <template v-if="showPercentage">
                  {{ format.PCT (hoveredItem.data.apiDuration/totalSdgDurationCalculated) }}
              </template>
              <template v-else>
                {{ format.msToTime(hoveredItem.data.apiDuration) }} horas
              </template>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
// d3 functions coming from : https://observablehq.com/@yieldtactics/radial-stacked-bar-chart
import { hsl, hierarchy, partition, scaleRadial, scaleLinear, arc,sum } from "d3";

const props = defineProps({
  result: {
    // type StatsSdg
    type: Array || null,
    required: true,
  },
  onlyOds: {
    type: Boolean,
    default: true,
  },
  styles: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  availableWidth: {
    type: Number,
    default: 400,
  },
  mouseOverElement: {
    type: Object || null,
    default: null,
  },
  sdgActive: {
    type: Array,
    default: () => [],
  }
});

const showPercentage = inject("showPercentage");
const queryDuration = inject("queryDuration");


const noSdgSelection = computed(() => props.sdgActive.length === 0);

const emits = defineEmits(["update:mouseOverElement", "update:clickedElement"]);

const width = computed(() => {
  return Math.min(props.availableWidth, 500);
});
const canvasHeight = computed(() => {
  return width.value;
});

const maxLevel = computed(() => {
  return props.onlyOds ? 2 : 3;
});
function getBaseOdsList() {
  const odsList = [];
  Object.keys(props.styles.topics).forEach((ods) => {
    if (noSdgSelection.value == false && !props.sdgActive.includes(ods)) return;

    if (ods == "no-topic") {
      return;
    }
    odsList.push({
      tag: ods,
      times: 0,
      children: [],
      odsIndex: parseInt(ods.split(" ")[1]),
      color: props.styles.topics[ods].color,
    });
  });
  // sort the odsList by field tag:

  odsList.sort((a, b) => (a.odsIndex > b.odsIndex ? 1 : -1));
  return odsList;
}
// data preparation: I need to craate an array with the 17 ods. Each ods will have a value (the number of tags) and a color (the color of the ods)
// each ods will also have a list of childrens, each child is a subtopic with a value ( the times field of the tag) and a color (the color of the subtopic)
const dataHierarchy = computed(() => {
  const odsList = getBaseOdsList();
  // iterate over results.tags and add each tag to the correct ods (tag.topic) but we are not adding the same tag twice, we are actually adding the tag.subtopic
  props.result.forEach((sdg) => {
    const ods = odsList.find((ods) => ods.tag === sdg.sdg);
    if (ods === undefined) return; // if the ods is not selected, we skip it
    ods.name = ods.tag;
    ods.code = ods.odsIndex + "";
    ods.level1 = ods.code;
    ods.level2 = "";
    ods.apiDuration = sdg.duration;
    ods.value = sdg.duration;
    if (!ods) return;
    for (let goal of sdg.goals) {
      // add subtopic to ods
      ods.children.push({
        code: goal.goal.split(" ")[0],
        level1: ods.code,
        level2: goal.goal.split(" ")[0].split(".")[1],
        name: goal.goal,
        subtopic: goal.goal,
        apiDuration: goal.duration,
        duration: goal.duration,
        value: goal.duration,
      });
    }
  });

  // add a colour scale to each ods that will be used to color the subtopics.
  // the color scale takes the hue of the ods and creates a new scale around it according to the number of subtopics
  // the colour range moves from the hue of the ods -30% lightness to the hue of the ods +30% lightness
  odsList.forEach((ods) => {
    const colorScale = scaleLinear()
      .domain([0, Math.max(ods.children.length, 2)])
      .range([hsl(ods.color).darker(0.4), hsl(ods.color).brighter(0.4)]);
    ods.children.forEach((subtopic, index) => {
      subtopic.color = colorScale(index);
    });
  });

  // remove ods with no children from odslist
  const newOdsList = odsList.filter((ods) => ods.children.length > 0);

  const odsRoot = {
    name: "root",
    children: newOdsList,
    odsIndex: 0,
    color: "white",
  };

  const newroot = hierarchy(odsRoot)//.sum((d) => d.duration); 
  newroot.eachAfter((d) => {
    d.value = d.data.value?? sum(d.children, (d) => d.value);
  });
  
  console.log(newroot)
  // we are creating a sunburst chart and we want to add the init and end radius to each element in the hierarchy
  const partitionGen = partition().size([2 * Math.PI, radius.value.level2]);
  partitionGen(newroot);

  return newroot;
});

// build chart:
const radius = computed(() => {
  if (props.onlyOds)
    return {
      inner: ((70 / 180) * width.value) / 2,
      level1: ((135 / 180) * width.value) / 2,
      level2: ((135 / 180) * width.value) / 2,
    };
  return {
    inner: ((45 / 180) * width.value) / 2,
    level1: ((105 / 180) * width.value) / 2,
    level2: ((135 / 180) * width.value) / 2,
  };
});
const radiusArray = computed(() => [
  radius.value.inner,
  radius.value.level1,
  radius.value.level2,
]);

const arcGenerator = computed(() =>
  arc()
    .startAngle(function (d) {
      return d.x0;
    })
    .endAngle(function (d) {
      return d.x1;
    })
    .innerRadius(function (d) {
      return radiusArray.value[d.depth - 1];
    })
    .outerRadius(function (d) {
      return radiusArray.value[d.depth];
    })
);

function showText(d) {
  //console.log(d);
  if (d === undefined || d.x1 === undefined || d.x0 === undefined) return false;
  return d.x1 - d.x0 > 0.2;
}

const totalSdgDurationCalculated = computed(() => {
  return sum(props.result, (d) => d.duration);
});
// interactivity
const hoveredItem = ref(null);
const tooltipPosition = ref({ x: 0, y: 0 });

function onMouseOver(event, d) {
  console.log(d)
  hoveredItem.value = d;
  tooltipPosition.value = {x:event.pageX, y:event.pageY}; // { x: event.pageX, y: event.pageY };
  emits("update:mouseOverElement", {
    name: d.data.name,
    level: d.depth,
    level1: d.data.level1,
    level2: d.data.level2,
    source: "radial",
  });
}
// this function considers the screen width and height and adjusts the tooltip position to avoid it to be cut by the screen
function onMouseOut(event, d) {
  hoveredItem.value = null;
  emits("update:mouseOverElement", null);
}
function onClick(event, d) {
  if (d.depth != 1) return;
  // hoveredItem.value = d;
  // //  tooltipPosition.value = { x: event.pageX, y: event.pageY };
  // tooltipPosition.value = {x:event.pageX, y:event.pageY}; // { x: event.pageX, y: event.pageY };

  emits("update:clickedElement", {
    name: d.data.name,
    level: d.depth,
    level1: d.data.level1,
    level2: d.data.level2,
    source: "radial",
  });
}

function getClassesForHovered(d) {
  // nothing selected
  let classes = "";
  if (!props.mouseOverElement && !props.sdgActive.length) {
    if (d.depth === 3) return "hoveredOut";
    else return "";
  }

  if (props.mouseOverElement) {
    const level = props.mouseOverElement.level;
    if (level === 1) {
      if (props.mouseOverElement.level1 === d.data.level1) return "hovered";
    }
    if (level === 2) {
      if (
        props.mouseOverElement.level2 === d.data.level2 &&
        props.mouseOverElement.level1 === d.data.level1
      )
        return "hovered";
    }
    if (level === 3) {
      if (d.data.name == props.mouseOverElement.name) {
        return "hovered";
      }
    }

    classes += " hoveredOut";
  }
  return classes;
}
</script>

<style lang="css" scoped>
.radialView path.depth-1 {
  cursor: pointer;
}

.radialView path {
}

path:hover,
path.hovered {
  
  opacity: 0.8;
}

path.active {
  filter: brightness(1.2);
  stroke: rgba(0, 0, 0, 0.1);
  stroke-width: 2px;
}

.simple-tooltip {
   position: absolute;
  z-index: 100;
  transition: all 0.3s ease;
  background: #fff;
  pointer-events: none;
  color: #222;

  
  
}
.simple-tooltip .tooltip-content {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
  margin-bottom: 8px;
}

.simple-tooltip .codes-indicators {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}
.simple-tooltip .codes-labels {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  font-weight: 600;
  max-width: 400px;
}

.simple-tooltip .ods-number {
  display: flex;
  width: 32px;
  height: 32px;
  display: flex;
  color:white;
  justify-content: center; /* align horizontal */
  align-items: center; /* align vertical */
  line-height: 32px;
}
.simple-tooltip .meta-number {
  display: flex;
  width: 32px;
  height: 32px;
  justify-content: center; /* align horizontal */
  align-items: center; /* align vertical */
  border-radius: 100%;
  line-height: 32px;
}

.hoveredOut,
.inactive {
  fill: #efefef !important;
}
</style>
