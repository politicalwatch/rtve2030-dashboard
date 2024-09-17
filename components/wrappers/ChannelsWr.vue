<template>
  <div>
    <div class="flex justify-between items-center h-9">
      <h2 class="chart-titles">Canales</h2>
    </div>
    <!-- <div class="flex justify-start gap-2 text-2xs">
      <button
        v-for="chan in Channels"
        class="w-6 text-center hover:brightness-150 hover:shadow-md"
        :class="[
          noChannelSelection || filterChannels.includes(chan)
            ? ''
            : 'grayscale',
        ]"
        @click="channelClickHandler(chan)"
      >
        <img :src="`/img/channels/${chan}.png`" :alt="'channel-icon' + chan" />
      </button>
    </div> -->

    <DataTableBaseTable
      :columns="columns"
      :data="dataForTable"
      rowId="name"

      :syncWithFilters="true"
      filterField="channels"
      filterFlagField="channelRemovedFlag"
    />
  </div>
</template>

<script lang="ts" setup>
import { _grayscale } from "#twcss/theme";
import { columns } from "../DataTable/channelColumns";
import { rollups, sum } from "d3";

const filtersStore = useFiltersStore();
const { channels: filterChannels } = storeToRefs(filtersStore);
interface Props {
  channelsData: Array<StatsChannel>;
  baseData: Array<StatsChannel>;
  hasActiveFilters: boolean;
}

const props = withDefaults(defineProps<Props>(), {});

const noChannelSelection = computed(() => filterChannels.value.length === 0);

function channelClickHandler(channel: Channels) {
  if (filterChannels.value.length === 0) {
    filterChannels.value = [channel];
  } else {
    if (filterChannels.value.includes(channel)) {
      filterChannels.value.splice(filterChannels.value.indexOf(channel), 1);
    } else {
      filterChannels.value.push(channel);
    }
  }
}
const maxTotalDuration = computed(() => {
  return Math.max(...props.baseData.map((chan) => chan.total_duration));
});

const dataForTable = computed(() => {
  return props.baseData.map((chan) => {
    // lets sum all the durations of the topics in chan.topics grouped by chan.topics.topic
    const aggrData = rollups(
      chan.topics,
      (v) => sum(v, (d) => d.duration),
      (d) => d.topic
    );
    // get top 5 topics

    const topTopics = aggrData.sort((a, b) => b[1] - a[1]).slice(0, 5);

    const result = {
      maxTotalDuration: maxTotalDuration.value,
      basePrograms: props.baseData.find((chan2) => chan.name === chan2.name)
        ?.program_count,
      programs: props.channelsData.find((chan2) => chan.name === chan2.name)
        ?.program_count,
      filteredTaggedDuration: props.hasActiveFilters
        ? props.channelsData.find((chan2) => chan.name === chan2.name)
            ?.tagged_duration
        : undefined,
      name: chan.name,
      total_duration: chan.total_duration,
      tagged_duration: chan.tagged_duration,
      sdgs: topTopics.map((topic) => topic[0] as SdgTopic),
    };
    if (result.filteredTaggedDuration === undefined) {
      delete result.filteredTaggedDuration;
    }

    return result;
  });
});
</script>

<style></style>
