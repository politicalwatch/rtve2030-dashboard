<template>
  <div class="container">
    <section class="grid grid-cols-5 gap-8 items-center my-4">
      <DateSelector />
      <div>
        <PeriodSelector></PeriodSelector>
      </div>
      <div class="col-span-3">
        <chartsSimpleAreaChart
          v-if="evolutionData != null"
          :statsData="evolutionData"
          :time-span="filters.timespan"
        ></chartsSimpleAreaChart>
      </div>
    </section>
    <div class="grid grid-cols-5 gap-8">
      <div>
        <chartsNumberCounter
          v-if="globalCounterData != null && timeSpanCounterData != null"
          :varValue="msToHours(timeSpanCounterData.total_duration)"
          :maxValue="msToHours(globalCounterData.total_duration)"
        >
          horas analizadas
        </chartsNumberCounter>
      </div>

      <div>
        <chartsNumberCounter
          v-if="globalCounterData != null && timeSpanCounterData != null"
          :varValue="msToHours(timeSpanCounterData.tagged_duration)"
          :maxValue="msToHours(globalCounterData.tagged_duration)"
        >
          horas Agenda 2030
        </chartsNumberCounter>
      </div>

      <div>
        <chartsNumberCounter
          v-if="globalCounterData != null && timeSpanCounterData != null"
          :varValue="
            timeSpanCounterData.tagged_duration /
            timeSpanCounterData.total_duration
          "
          :maxValue="1"
          :formatter="format.PCT"
        >
          % agenda 2030
        </chartsNumberCounter>
      </div>

      <div>
        <chartsNumberCounter
          v-if="globalCounterData != null && timeSpanCounterData != null"
          :varValue="timeSpanCounterData.programs_count"
          :maxValue="globalCounterData.programs_count"
        >
          programas
        </chartsNumberCounter>
      </div>

      <div>
        <chartsNumberCounter
          v-if="globalCounterData != null && timeSpanCounterData != null"
          :varValue="timeSpanCounterData.episodes_count"
          :maxValue="globalCounterData.episodes_count"
        >
          episodios
        </chartsNumberCounter>
      </div>
    </div>

    <div class="mt-8">
      <WrappersSdgWr
        v-if="sdgData != null && baseDataStore.sdgData != null"
        :sdgData="sdgData"
        :baseData="baseDataStore.sdgData"
      >
      </WrappersSdgWr>
    </div>

    <div class="mt-8 grid grid-cols-5 gap-8" >
      <div class="col-span-2">
        <WrappersChannels
          v-if="channelsData != null && baseDataStore.channelsData != null"
          :channelsData="channelsData"
          :baseData="baseDataStore.channelsData"
          :hasActiveFilters="filters.hasActiveFilters"
        >
        </WrappersChannels>
      </div>
      <div class="col-span-3">
        <WrappersProgramsWr
          v-if="programsData != null && baseDataStore.programsData != null"
          :programsData="programsData"
          :baseData="baseDataStore.programsData"
          :hasActiveFilters="filters.hasActiveFilters"
        >
        </WrappersProgramsWr>
      </div>
    </div>

    <div class="mt-8">
      <WrappersTagsWr
        v-if="tagsData != null && baseDataStore.tagsData != null"
        :tagsData="tagsData"
        :baseData="baseDataStore.tagsData"
        :hasActiveFilters="filters.hasActiveFilters"
      >
      </WrappersTagsWr>
    </div>
    <!-- frequency chart
     <FrequencyChart
          :topicsStyles="STYLES"
          :topic="topic"
          :dataset="topicsByWeek"
          :aggreagatedDataset="allTopicsByWeek"
          :loadingDynamicData="loadingDynamicData"
          @update:showComparativeMode="getAllTopicsByWeek()"
          v-if="topicsByWeek != null"
        />

        -->
  </div>
</template>

<script lang="ts" setup>
import { cloneDeep } from "lodash";

const { $api } = useNuxtApp();
const filters = useFiltersStore();
const baseDataStore = useBaseData();
const apiRepo = dashboardApiRepo($api);

/* status flag */
const mustLoadBase = ref({
  globalCounterData: true,
  evolutionData: true,
  timeSpanCounterData: true,
  sdgData: true,
  programsData: true,
  channelsData: true,
  tagsData: true,
});

/** following data depends only on timespan***/
const { timespan, channels, sdgActive } = storeToRefs(filters);

const { data: globalCounterData } = await useAsyncData(() =>
  apiRepo.getStatsCounter()
);

const { data: evolutionData } = await useAsyncData(() =>
  apiRepo.getEvolution()
);

const { data: timeSpanCounterData } = await useAsyncData(
  `stats${jsDatetoApiString(timespan.value[0])}-${jsDatetoApiString(
    timespan.value[0]
  )}`,
  () =>
    apiRepo.getStatsCounter(
      jsDatetoApiString(timespan.value[0]),
      jsDatetoApiString(timespan.value[1])
    ),
  {
    immediate: true,
    watch: [timespan],
  }
);

/** following data depends on filters ***/

const { data: sdgData } = await useAsyncData(() => apiRepo.getOdsAndGoals());

const { data: programsData } = await useAsyncData(
  `stats${jsDatetoApiString(timespan.value[0])}-${jsDatetoApiString(
    timespan.value[0]
  )}-programs${channels.value.join("-")}
  -sdg${sdgActive.value.join("-")}`,
  () =>
    apiRepo.getPrograms(
      jsDatetoApiString(timespan.value[0]),
      jsDatetoApiString(timespan.value[1]),
      channels.value,
      sdgActive.value
    ),
  {
    immediate: true,
    watch: [timespan, channels, sdgActive],
  }
);

const { data: channelsData } = await useAsyncData(
  `stats${jsDatetoApiString(timespan.value[0])}-${jsDatetoApiString(
    timespan.value[0]
  )}
  -sdg${filters.sdgActive.join("-")}`,
  () =>
    apiRepo.getChannels(
      jsDatetoApiString(timespan.value[0]),
      jsDatetoApiString(timespan.value[1]),
      sdgActive.value
    ),
  {
    immediate: true,
    watch: [timespan, channels, sdgActive],
  }
);

// ------------------ tags (terms) --------------------// 

const { data: tagsData } = await useAsyncData(() => apiRepo.getTags(
  jsDatetoApiString(timespan.value[0]),
  jsDatetoApiString(timespan.value[1]),
  sdgActive.value,
  channels.value
));



onMounted(async () => {
 
});

const isDataReady = computed(
  () =>
    globalCounterData != null &&
    evolutionData != null &&
    timeSpanCounterData != null &&
    sdgData != null
);

/** this part of the code is in charge of "updating the store with the base data"
 * Base data means the data used for charts when no filter is applied
 * It is important because data availabie in this page is  always updated with filters
 *  */
watch(timespan, () => {
  console.log("timestamp updated");
  mustLoadBase.value.globalCounterData = true;
  mustLoadBase.value.evolutionData = true;
  mustLoadBase.value.timeSpanCounterData = true;
  mustLoadBase.value.sdgData = true;
  mustLoadBase.value.programsData = true;
  mustLoadBase.value.channelsData = true;
});

// this block is in charge of updating the base data store with the data from the api
// it is updated only with mustLoadBase flag is true, and it is only true when the timespan changes
// BUG: when filters are active, the base data is not correct since base data should be the data without filters applied
watch(programsData, () => {
  if (mustLoadBase.value.programsData) {
    baseDataStore.programsData = cloneDeep(programsData.value);
    mustLoadBase.value.programsData = false;
  }
}, { deep: true, immediate:true });

watch(channelsData, () => {
  if (mustLoadBase.value.channelsData) {
    baseDataStore.channelsData = cloneDeep(channelsData.value);
    mustLoadBase.value.channelsData = false;
  }
}, { deep: true, immediate:true });

watch(sdgData, () => {
  if (mustLoadBase.value.sdgData) {
    baseDataStore.sdgData = cloneDeep(sdgData.value);
    mustLoadBase.value.sdgData = false;
  }
}, { deep: true, immediate:true });

watch(tagsData, () => {
  if (mustLoadBase.value.tagsData) {
    baseDataStore.tagsData = cloneDeep(tagsData.value);
    mustLoadBase.value.tagsData = false;
  }
}, { deep: true, immediate:true });

/* loading  */
const loading = ref(false);
useNuxtApp().hook("page:start", () => {
  loading.value = true;
});

useNuxtApp().hook("page:finish", () => {
  loading.value = false;
});


</script>

<style></style>
