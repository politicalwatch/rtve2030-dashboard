<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h2 class="chart-titles">Programas y episodios</h2>

      <div class="flex flex-col gap-2 items-end">
        <div class="flex gap-1 items-center text-2xs font-mono">
          <Switch v-model:checked="relativeMode" /> relativo
        </div>
        <div id="programs-search-input"></div>
      </div>
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
interface Props {
  programsData: Array<StatsPrograms>;
  baseData: Array<StatsPrograms>;
  hasActiveFilters: boolean;
}

const props = withDefaults(defineProps<Props>(), {});

const maxTotalDuration = computed(() => {
  return Math.max(...props.baseData.map((prg) => prg.total_duration));
});

const relativeMode = ref(false);

const dataForTable = computed(() => {
  return props.baseData
    .map((prgBase) => {
      const filteredEquivalent = props.programsData.find(
        (prg2) => prgBase.name === prg2.name
      );
      if (!filteredEquivalent) return null;

      const alltopics =
        filteredEquivalent == undefined
          ? prgBase.topics
          : filteredEquivalent.topics;

      // get top 5 topics
      const topTopics = alltopics
        .sort((a, b) => b.duration - a.duration)
        .slice(0, 5);
      const queryDuration = props.hasActiveFilters
        ? sum(filteredEquivalent.topics, (d) => d.duration)
        : 0;

      return {
        hasActiveFilters: props.hasActiveFilters,
        canal: prgBase.channel,
        name: prgBase.name,
        queryDuration: queryDuration,
        total_duration: prgBase.total_duration,
        tagged_duration: prgBase.tagged_duration,
        episode_count: prgBase.episode_count,
        sdgs: topTopics.map((topic) => topic.topic),
        maxTotalDuration: relativeMode.value
          ? prgBase.total_duration
          : maxTotalDuration.value,
      };
    })
    .filter((prg) => prg !== null);
});
</script>

<style></style>
