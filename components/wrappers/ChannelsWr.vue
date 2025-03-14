<template>
  <div>

    <!-- head -->
    <div class="grid grid-cols-[32px_1fr] gap-4 ">
      <img src="/img/rtve.svg" alt="rtve" class="h-[32px] w-auto mt-1" :class="filtersStore.channels.length ? 'opacity-100': 'opacity-20'">
      <div class="border-t border-black pt-2">
        <div class="flex justify-between">
          <h2 class="chart-titles-big">Canales</h2>

          <div class="flex gap-3">
            <div class="flex gap-1 items-center text-2xs font-mono">
              <Switch v-model:checked="relativeMode" /> relativo
            </div>

            <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                
                  <Icon
                    name="ooui:info"
                    class="hover:shadow-lg  cursor-pointer w-6 h-6"
                  >
                  </Icon>
                
          </TooltipTrigger>
          <TooltipContent
            class="max-w-96 bg-white text-sm shadow-md ring-1 ring-darkCream"
          >
            <slot name="description">
              <ContentQuery path="help/channels" find="one" v-slot="{ data }">
                <ContentRenderer :value="data" class="prose prose-sm" />
              </ContentQuery>
            </slot>
          </TooltipContent>
        </Tooltip>
            </TooltipProvider>

           
          </div>

        </div>
        
      </div>
    </div>

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
import { Switch } from "@/components/ui/switch";

const filtersStore = useFiltersStore();
const { channels: filterChannels } = storeToRefs(filtersStore);
interface Props {
  channelsData: Array<StatsChannel>;
  baseData: Array<StatsChannel>;
  hasActiveFilters: boolean;
}

const props = withDefaults(defineProps<Props>(), {});

const noChannelSelection = computed(() => filterChannels.value.length === 0);

const relativeMode = ref(false);
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
    const latestChanData = props.channelsData.find(
      (chan2) => chan.name === chan2.name
    );

    // lets sum all the durations of the topics in chan.topics grouped by chan.topics.topic
    // const aggrData = rollups(
    //   latestChanData==undefined?chan.topics:latestChanData.topics,
    //   (v) => sum(v, (d) => d.duration),
    //   (d) => d.topic
    // );
    // get top 5 topics
    const alltopics =
      latestChanData == undefined ? chan.topics : latestChanData.topics;
    const topTopics = alltopics
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 5);

    // get latest value, not base value
    // compute the sum for all topics
    let queryDurationTopics = 0;
    if (latestChanData !== undefined) {
      queryDurationTopics = sum(latestChanData?.topics, (d) => d.duration);
    }

    const baseTaggedDuration = sum(chan.topics, (d) => d.duration);

    const result = {
      maxTotalDuration: relativeMode.value
        ? chan.total_duration
        : maxTotalDuration.value,
      basePrograms: props.baseData.find((chan2) => chan.name === chan2.name)
        ?.program_count as number,
      programs: props.channelsData.find((chan2) => chan.name === chan2.name)
        ?.program_count as number,
      queryDuration:
        filtersStore.sdgActive.length > 0
          ? queryDurationTopics
          : chan.tagged_duration,
      name: chan.name,
      total_duration: chan.total_duration,
      tagged_duration: chan.tagged_duration,
      sdgs: topTopics.map((topic) => topic.topic),
      showQueryDuration: filtersStore.sdgActive.length > 0,
    };

    return result;
  });
});
</script>

<style></style>
