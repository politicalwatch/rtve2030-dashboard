<template>
  <div class="dashboard-content">
    <header class="container bg-white mb-2">
      <div class="flex justify-start items-center gap-16">
        <img src="/img/logo.svg" alt="logo" class="h-16" />
        <div class="flex gap-4">
          <img src="/img/tve.svg" alt="logo" class="h-6" />
          <img src="/img/rne.svg" alt="logo" class="h-6" />
        </div>
      </div>
    </header>
    <section class="bg-gray-50 border-b border-gray-500">
      <div class="container py-4">
        <h1 class="text-sm uppercase font-bold font-mono">
          vista global y selección de periodo de estudio
        </h1>
        <div class="grid grid-cols-5 gap-8 items-center my-4">
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
        </div>

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
      </div>
    </section>
    <!--- end of global stats  -->
    <section class="mt-12">
      <div class="container mb-4">
        <h1 class="text-sm uppercase font-bold font-mono">
          datos del periodo seleccionado
        </h1>
      </div>
      <div
        class="container sticky top-0 z-40 bg-white border-b border-gray-500 pb-4"
      >
        <div class="pt-4 grid grid-cols-5 gap-8">
          <FiltersState class="col-span-2" />
          <div>
            <chartsNumberCounter
              v-if="globalCounterData != null && timeSpanCounterData != null"
              :varValue="msToHours(filteredTotalDuration)"
              :maxValue="msToHours(timeSpanCounterData.total_duration)"
            >
              horas analizadas
            </chartsNumberCounter>
          </div>
          <div>
            <chartsNumberCounter
              v-if="globalCounterData != null && timeSpanCounterData != null"
              :varValue="filteredProgramsCount"
              :maxValue="timeSpanCounterData.programs_count"
            >
              Programas
            </chartsNumberCounter>
          </div>
          <div>
            <chartsNumberCounter
              v-if="globalCounterData != null && timeSpanCounterData != null"
              :varValue="filteredEpisodesCount"
              :maxValue="timeSpanCounterData.episodes_count"
            >
              Episodios
            </chartsNumberCounter>
          </div>
        </div>
      </div>
      <!---- evolution in detail-->
      <div class="container">
        <WrappersFrequencyWr
          v-if="evolutionStackedData != null"
          :evoData="evolutionStackedData"
          :hasActiveFilters="filters.hasActiveFilters"
        />

        <div class="mt-16">
          <WrappersSdgWr
            v-if="sdgData != null && baseDataStore.sdgData != null"
            :sdgData="sdgData"
            :baseData="baseDataStore.sdgData"
            :baseTaggedDuration="baseTaggedDuration"
          >
          </WrappersSdgWr>
        </div>

        <div class="mt-8 grid grid-cols-5 gap-8 border-t border-black pt-2">
          <div class="col-span-2">
            <WrappersChannelsWr
              v-if="channelsData != null && baseDataStore.channelsData != null"
              :channelsData="channelsData"
              :baseData="baseDataStore.channelsData"
              :hasActiveFilters="filters.hasActiveFilters"
            >
            </WrappersChannelsWr>
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
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ["auth-user"],
});

import { cloneDeep } from "lodash";
import { sum } from "d3";
const { $api } = useNuxtApp();
const filters = useFiltersStore();
const baseDataStore = useBaseData();
const apiRepo = dashboardApiRepo($api);
const nuxtApp = useNuxtApp();
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
    timespan.value[1]
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

/** ------------ the following data depends on filters ----------- ***/
const evolutionStackedQueryString = computed(() => {
  return `stats/evolution-stacked${jsDatetoApiString(
    timespan.value[0]
  )}-${jsDatetoApiString(timespan.value[1])}-channels-${filters.channels.join(
    "-"
  )}-sdg${filters.sdgActive.join("-")}-programs${filters.programs.join("-")}`;
});

const { data: evolutionStackedData } = await useAsyncData(
  evolutionStackedQueryString.value,
  () =>
    apiRepo.getEvolutionStacked(
      jsDatetoApiString(timespan.value[0]),
      jsDatetoApiString(timespan.value[1]),
      filters.sdgActive,
      filters.channels,
      filters.programs
    ),
  {
    immediate: true,
    watch: [evolutionStackedQueryString],
    transform: (data) => {
      // let's transform all dates into javascript date objects considering that the date format in the api is YYYY-MM-DD
      data.hoursPeriod.forEach((item) => {
        item.dateObj = new Date(item.date);
      });
      data.initObj = new Date(data.init);
      data.endObj = new Date(data.end);
      return data;
    },
  }
);

const sdgQueryString = computed(() => {
  return `stats${jsDatetoApiString(timespan.value[0])}-${jsDatetoApiString(
    timespan.value[1]
  )}
  -programs${filters.programs.join("-")}
  -channels${filters.channels.join("-")}`;
});

const { data: sdgData } = await useAsyncData(
  sdgQueryString.value,
  () =>
    apiRepo.getOdsAndGoals(
      jsDatetoApiString(timespan.value[0]),
      jsDatetoApiString(timespan.value[1]),
      filters.channels
    ),
  {
    immediate: true,
    getCachedData: (key) => {
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    },
    watch: [sdgQueryString],
  }
);

const programasQueryString = computed(() => {
  return `stats/programas${jsDatetoApiString(
    timespan.value[0]
  )}-${jsDatetoApiString(timespan.value[1])}-channels-${filters.channels.join(
    "-"
  )}
  -sdg${sdgActive.value.join("-")}`;
});

const { data: programsData } = await useAsyncData(
  programasQueryString.value,
  () => {
    return apiRepo.getPrograms(
      jsDatetoApiString(timespan.value[0]),
      jsDatetoApiString(timespan.value[1]),
      channels.value,
      sdgActive.value
    );
  },
  {
    immediate: true,
    getCachedData: (key) => {
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    },
    watch: [programasQueryString],
  }
);

const channelsQueryString = computed(() => {
  return `stats/channels/${jsDatetoApiString(
    timespan.value[0]
  )}-${jsDatetoApiString(timespan.value[1])}-channels-${filters.channels.join(
    "-"
  )}
  -sdg${sdgActive.value.join("-")}`;
});

const { data: channelsData } = await useAsyncData(
  channelsQueryString.value,
  () =>
    apiRepo.getChannels(
      jsDatetoApiString(timespan.value[0]),
      jsDatetoApiString(timespan.value[1]),
      sdgActive.value
    ),
  {
    immediate: true,
    getCachedData: (key) => {
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    },
    watch: [channelsQueryString],
  }
);
// ------------------ tags (terms) --------------------//

const tagsQueryString = computed(() => {
  return `stats/tags${jsDatetoApiString(timespan.value[0])}-${jsDatetoApiString(
    timespan.value[1]
  )}-channels-${filters.channels.join("-")}
  -sdg${sdgActive.value.join("-")}`;
});

const { data: tagsData } = await useAsyncData(
  tagsQueryString.value,
  () =>
    apiRepo.getTags(
      jsDatetoApiString(timespan.value[0]),
      jsDatetoApiString(timespan.value[1]),
      filters.sdgActive,
      filters.channels
    ),
  {
    immediate: true,
    getCachedData: (key) => {
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    },
    watch: [tagsQueryString],
  }
);

const isDataReady = computed(
  () =>
    globalCounterData != null &&
    evolutionData != null &&
    timeSpanCounterData != null &&
    sdgData != null
);

/* computed data for the counters depending on filters */
const filteredTotalDuration = computed(() => {
  if (channelsData.value == null) return 0;
  return sum(channelsData.value, (d) => d.total_duration);
});
const filteredTaggedDuration = computed(() => {
  if (channelsData.value == null) return 0;
  return sum(channelsData.value, (d) => d.tagged_duration);
});

const filteredProgramsCount = computed(() => {
  if (programsData.value == null) return 0;
  else return programsData.value.length;
});

const filteredEpisodesCount = computed(() => {
  if (programsData.value == null) return 0;
  return sum(programsData.value, (d) => d.episode_count);
});

const baseTaggedDuration = computed(() => {
  if (baseDataStore.channelsData == null) return 0;
  return sum(baseDataStore.channelsData, (d) => d.tagged_duration);
});

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
watch(
  programsData,
  () => {
    if (mustLoadBase.value.programsData) {
      baseDataStore.programsData = cloneDeep(programsData.value);
      mustLoadBase.value.programsData = false;
    }
  },
  { deep: true, immediate: true }
);

watch(
  channelsData,
  () => {
    if (mustLoadBase.value.channelsData) {
      baseDataStore.channelsData = cloneDeep(channelsData.value);
      mustLoadBase.value.channelsData = false;
    }
  },
  { deep: true, immediate: true }
);

watch(
  sdgData,
  () => {
    if (mustLoadBase.value.sdgData) {
      baseDataStore.sdgData = cloneDeep(sdgData.value);
      mustLoadBase.value.sdgData = false;
    }
  },
  { deep: true, immediate: true }
);

watch(
  tagsData,
  () => {
    if (mustLoadBase.value.tagsData) {
      baseDataStore.tagsData = cloneDeep(tagsData.value);
      mustLoadBase.value.tagsData = false;
    }
  },
  { deep: true, immediate: true }
);

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
