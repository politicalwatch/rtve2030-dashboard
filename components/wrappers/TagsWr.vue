<template>
  <div class="border-t border-black">
    <div class="grid grid-cols-5 gap-8">
      <div class="col-span-3">
        <div class="flex justify-between my-4">
          <h2 class="chart-titles">términos</h2>
          <div id="terms-search-input"></div>
        </div>
        <DataTableBaseTable
          :columns="columns"
          :data="dataForTable"
          :searchColumnName="'name'"
          teleportTarget="#terms-search-input"
        />
      </div>

      <div class="col-span-2" ref="wordcloudContainer">
        <VueWordCloud
          :words="topWords"
          :color="colorfn"
          :style="{
            width: width - padding.left - padding.right + 'px',
            height: height - padding.top - padding.bottom + 'px',
            'margin-left': padding.left + 'px',
            'margin-top': padding.top + 'px',
          }"
          v-if="width > 0 && height > 0"
          :fontFamily="'Roboto'"
          :font-size-ratio="4"
          :enter-animation="enterAnimation"
          :leave-animation="leaveAnimation"
          :animation-duration="700"
        >
          <template #default="{ text, weight, word }">
            <div
              :title="weight"
              class="cursor-pointer hover:font-bold pointer-events-auto"
              @mouseover="onWordMouseover($event, word)"
              @mouseleave="onWordMouseleave($event)"
            >
              {{ text }}
            </div>
          </template>
        </VueWordCloud>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { columns } from "../DataTable/termsColumns";
import { groups, rollups, rollup, sum } from "d3";
import VueWordCloud from "vuewordcloud";
import { scaleSequential, interpolate } from "d3";
import { useElementSize, useElementVisibility } from "@vueuse/core";
import { _300 as green300, _700 as green700 } from "#twcss/theme/colors/green";
import { _400, _800 } from "#twcss/theme/colors/gray";
const padding = { top: 0, right: 10, bottom: 0, left: 50 };
interface Props {
  tagsData: Array<StatsTags>;
  baseData: Array<StatsTags>;
  hasActiveFilters: boolean;
}

const props = withDefaults(defineProps<Props>(), {});



// return type is like statTags but contains also tagCount and subtopic is an array of subtopics
const basetagsDataAggregatedByTag = computed(() => {
  const tags = rollups(
    props.baseData,
    (v) => ({
      occurrences: sum(v, (d) => d.occurrences),
      duration: sum(v, (d) => d.duration),
      subtopics: v.map((d) => d.subtopic),
      tagCount: v.length,
      tag: v[0].tag,
    }),
    (d) => d.tag
  );
  return tags.map((tag) => tag[1]); // returns t
});

const tagsDataAggregatedByTag = computed(() => {
  const tags = rollups(
    props.tagsData,
    (v) => ({
      occurrences: sum(v, (d) => d.occurrences),
      duration: sum(v, (d) => d.duration),
      subtopics: v.map((d) => d.subtopic),
      tagCount: v.length,
      tag: v[0].tag,
    }),
    (d) => d.tag
  );
  return tags.map((tag) => tag[1]);
});

const maxTotalCountTags = computed(() => {
  // get baseTagsData but only if the tag is in the tagsData
  let baseTagsDataExistingTags = basetagsDataAggregatedByTag.value
  if(tagsDataAggregatedByTag){
    baseTagsDataExistingTags = basetagsDataAggregatedByTag.value.filter((tag) =>
      tagsDataAggregatedByTag.value.some((tag2) => tag2.tag === tag.tag)
    );
  }
  
  return Math.max(...baseTagsDataExistingTags.map((tag) => tag.occurrences));
});

const dataForTable = computed<TableTags[]>(() => {
  return tagsDataAggregatedByTag.value.map((tag) => {
     const equivalentBase=basetagsDataAggregatedByTag.value.find((tag2) => tag2.tag === tag.tag)
    return {
      name: tag.tag,
      total_occurrences: equivalentBase?.occurrences ?? 0,
      filtered_occurrences: tag.occurrences,
      maxTotalOccurrences: maxTotalCountTags.value, // max total occurrences in base data
      sdgs: tag.subtopics
        .map((subtopic) => subtopicToTopic(subtopic))
        .filter((topic): topic is SdgTopic => topic !== null),
      hasActiveFilters: props.hasActiveFilters,
    };
  });
});

/* this function takes a subtopic with the format "X.Y  name" and returns the SdgTopic with number X */
function subtopicToTopic(subtopic: string) {
  const topicNumber = subtopic.split(".")[0];
  const key = "ODS" + topicNumber; // CHECK IF key is in SdgTopic enum
  return SdgTopic[key];

  return null;
}
// -------------- WORDCLOUD --------------
// get top words for wordcloud. top 50
const topWords = computed(() => {
  return dataForTable.value
    .sort((a, b) => b.filtered_occurrences - a.filtered_occurrences)
    .slice(0, 40)
    .map((tag) => [tag.name, tag.filtered_occurrences]);
});

// create a sequential color scale using d3. It must use two green colors and interpolate between them
const colorScale = computed(() => {
  const minColor = _400; // Light green
  const maxColor = _800; //8Dark green
  const minValue = Math.min(...topWords.value.map((d) => d[1]));
  const maxValue = Math.max(...topWords.value.map((d) => d[1]));

  return scaleSequential()
    .domain([minValue, maxValue])
    .interpolator(interpolate(minColor, maxColor));
});
const colorfn = (
  [word, weight]: [string, number],
  fontSize: number,
  colorPalette: string[]
) => {
  return colorScale.value(weight);
};

const wordcloudContainer = ref(null);

const { width, height } = useElementSize(wordcloudContainer);
const wordCloudIsVisible = useElementVisibility(wordcloudContainer);
const wordCloudHasBeenVisible = ref(false);

// watch(wordCloudIsVisible, (isVisible) => {
//   if (isVisible) {
//     wordCloudHasBeenVisible.value = true;
//   }
// });

/*function getRotation() {
  if (Math.random() < 0.25) return 0;
  else if (Math.random() < 0.5) return 1 / 8;
  else if (Math.random() < 0.75) return 3 / 4;
  else return 7 / 8;
}*/
function getRotation() {
  if (Math.random() < 0.7) return 0;
  else return 0;
}

const updatedWordCloud = ref<[string, number][]>([]);
const animationInterval = ref<any>(null);

// const startWordCloudAnimation = () => {
//   let index = 0;
//   updatedWordCloud.value = [];

//   animationInterval.value = setInterval(() => {
//     if (index < topWords.value.length) {
//       updatedWordCloud.value.push(topWords.value[index]);
//       index++;
//     } else {
//       clearInterval(animationInterval.value);
//     }
//   }, 50);
// };

// this is trigger on visilibty of the wordcloud container
// watch(wordCloudHasBeenVisible, (isVisible) => {
//   if (isVisible) {
//     nextTick(() => {
//       startWordCloudAnimation();
//     });
//   }
// });

// this is trigger on the topWords array change: required when the filters change
// watch(topWords, (words) => {
//   clearInterval(animationInterval.value);
//   console.log("topWords", words);
//   updatedWordCloud.value = topWords.value.map((word) => [word[0], word[1]]);
// },
// {deep:true}
// );

onBeforeUnmount(() => {
  if (animationInterval.value) {
    clearInterval(animationInterval.value);
  }
});

let enterAnimation = { opacity: 0 };
let leaveAnimation = { opacity: 0 };

/*** interaction */

function onWordMouseover(event: MouseEvent, word: string) {
  const element = event.target as HTMLElement;
  const color = getColorForWord(word);
  element.style.color = color;
}

function onWordMouseleave(event: MouseEvent) {
  const element = event.target as HTMLElement;
  element.style.color = "";
}

function getColorForWord(word: string) {
  const tagObject = dataForTable.value.find((tag) => tag.name === word[0]);
  if (tagObject && tagObject.sdgs.length > 0) {
    const sdg = tagObject.sdgs[0];
    return STYLES.topics[sdg].color;
  }
  return "#000";
}

// Remove the hoveredWord ref as it's no longer needed
// const hoveredWord = ref<string | null>(null);
</script>

<style></style>
