<template>
  <div class="border-t border-black">
    <h2 class="chart-titles">términos</h2>
    <div class="grid grid-cols-5 gap-8">
      <DataTableBaseTable
        :columns="columns"
        :data="dataForTable"
        class="col-span-2"
      />

      <div class="col-span-3">Tag cloud</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { columns } from "../DataTable/termsColumns";
import { groups, rollups, rollup, sum } from "d3";
interface Props {
  tagsData: Array<StatsTags>;
  baseData: Array<StatsTags>;
  hasActiveFilters: boolean;
}

const props = withDefaults(defineProps<Props>(), {});

const maxTotalCountTags = computed(() => {
  return Math.max(...props.baseData.map((tag) => tag.occurrences));
});

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

const dataForTable = computed(() => {
  return tagsDataAggregatedByTag.value.map((tag) => ({
    name: tag.tag,
    total_occurrences: basetagsDataAggregatedByTag.value.find(
      (tag2) => tag2.tag === tag.tag
    )?.occurrences,
    filtered_occurrences: tag.occurrences,
    maxTotalOccurrences: maxTotalCountTags.value,
    sdgs: tag.subtopics.map((subtopic) => subtopicToTopic(subtopic)),
    hasActiveFilters: props.hasActiveFilters,
  }));
});

/* this function takes a subtopic with the format "X.Y  name" and returns the SdgTopic with number X */
function subtopicToTopic(subtopic: string) {
  const topicNumber = subtopic.split(".")[0]
  const key = "ODS" + topicNumber;  // CHECK IF key is in SdgTopic enum
    return SdgTopic[key];
  
  
  return null;
}
</script>

<style></style>
