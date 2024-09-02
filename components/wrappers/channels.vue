<template>
  <div>
    <h2 class="chart-titles">Canales</h2>
    <div class="flex justify-start gap-2 text-2xs">
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
    </div>

    <DataTableBaseTable :columns="columns" :data="dataForTable" />
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

const dataForTable = computed(() => {
  return props.channelsData.map((chan) => {
    // lets sum all the durations of the topics in chan.topics grouped by chan.topics.topic

    const aggrData = rollups(
      chan.topics,
      (v) => sum(v, (d) => d.duration),
      (d) => d.topic
    );
    // get top 5 topics

    const topTopics = aggrData.sort((a, b) => b[1] - a[1]).slice(0, 5);

    return {
      name: chan.name,
      total_duration: chan.total_duration,
      tagged_duration: chan.tagged_duration,
      sdgs: topTopics.map((topic) => topic[0] as SdgTopic),
    };
  });
});
</script>

<style></style>
