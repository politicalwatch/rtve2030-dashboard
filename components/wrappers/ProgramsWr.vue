<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h2 class="chart-titles">Programas y episodios</h2>
      <div id="programs-search-input"></div>
    </div>
    <DataTableBaseTable
      :columns="columns"
      :data="dataForTable"
      :searchColumnName="'name'"
      teleportTarget="#programs-search-input"
      rowId="name"
      :syncWithFilters="true"
      filterField="programs"
      filterFlagField="programRemovedFlag"
    />
  </div>
</template>

<script lang="ts" setup>
import { _grayscale } from "#twcss/theme";
import type { StatsPrograms, SdgTopic } from "../../types/apiTypes";
import { columns } from "../DataTable/programColumns";
import { rollups, sum } from "d3";

const filtersStore = useFiltersStore();
const { channels: filterChannels } = storeToRefs(filtersStore);
interface Props {
  programsData: Array<StatsPrograms>;
  baseData: Array<StatsPrograms>;
  hasActiveFilters: boolean;
}

const props = withDefaults(defineProps<Props>(), {});

const maxTotalDuration = computed(() => {
  return Math.max(...props.baseData.map((prg) => prg.total_duration));
});


const dataForTable = computed(() => {
  return props.baseData.map((prg) => {
    const filteredEquivalent= props.programsData.find((prg2) => prg.name === prg2.name)
    if (!filteredEquivalent) return null;
    const aggrData = rollups(
      prg.topics,
      (v) => sum(v, (d) => d.duration),
      (d) => d.topic
    );
    // get top 5 topics
    const topTopics = aggrData.sort((a, b) => b[1] - a[1]).slice(0, 5);
    return {
      canal: prg.channel,
      name: prg.name,
      filteredTaggedDuration: props.hasActiveFilters
        ? filteredEquivalent
            ?.tagged_duration
        : undefined,
      total_duration: prg.total_duration,
      tagged_duration: prg.tagged_duration,
      episode_count: prg.episode_count,
      sdgs: topTopics.map((topic) => topic[0] as SdgTopic),
      maxTotalDuration: maxTotalDuration.value,
    };
  })
  .filter((prg) => prg !== null);
});

</script>

<style></style>
