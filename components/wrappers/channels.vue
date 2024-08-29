<template>
  <div>
    <h2 class="chart-titles">Canales</h2>
    <div class="flex justify-start gap-2 text-2xs">
      <button
        v-for="chan in Channels"
        class=" w-6 text-center hover:brightness-150 hover:shadow-md"
        :class="[noChannelSelection || filterChannels.includes(chan)?'':'grayscale']"
        @click="channelClickHandler(chan)"
      >
        <img :src="`/img/channels/${chan}.png`" :alt="'channel-icon'+chan"  />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { _grayscale } from '#twcss/theme';

const filtersStore = useFiltersStore();
const { channels: filterChannels } = storeToRefs(filtersStore);
interface Props {
  channelsData: Array<any>;
}

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
</script>

<style></style>
