<template>
  <div>
    <h2 class="chart-titles">Programas y episodios</h2>
    <DataTableBaseTable :columns="columns" :data="dataForTable" />
  </div>
</template>

<script lang="ts" setup>
import { _grayscale } from '#twcss/theme';
import type { StatsPrograms, SdgTopic } from '../../types/apiTypes';
import { columns } from '../DataTable/programColumns'
import {rollups, sum} from 'd3';


const filtersStore = useFiltersStore();
const { channels: filterChannels } = storeToRefs(filtersStore);
interface Props {
  programsData: Array<StatsPrograms>;
}

const props = withDefaults(defineProps<Props>(), {});

const maxTotalDuration = computed(() => {
  return Math.max(...props.programsData.map((prg) => prg.total_duration));
});

const dataForTable = computed(() => {
  return props.programsData.map((chan) => {
    
    const aggrData= rollups(chan.topics, (v) => sum(v, (d) => d.duration), (d) => d.topic)
    // get top 5 topics
    const topTopics = aggrData.sort((a,b) => b[1]-a[1]).slice(0,5)
    return {
      name: chan.name,
      total_duration: chan.total_duration,
      tagged_duration: chan.tagged_duration,
      episode_count: chan.episode_count,
      sdgs: topTopics.map((topic) => topic[0] as SdgTopic),
      maxTotalDuration: maxTotalDuration.value,
    };
  });

});
</script>

<style></style>
