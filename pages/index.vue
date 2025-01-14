<template>
  <div class="dashboard-content mt-6">
    <header class="container flex justify-between bg-white mb-2">
      <div class="flex justify-start items-center gap-16">
        <img src="/img/logo.svg" alt="logo" class="h-16" />
        <div class="flex gap-4">
          <button
            type="button"
            aria-label="Cambio a modo TV"
            class="cursor-pointer transition-all duration-200"
            :class="{
              'opacity-20 h-5': filters.radioOrTV === MediaType.RADIO,
              'h-8': filters.radioOrTV === MediaType.TV
            }"
            @click="filters.radioOrTV = MediaType.TV"
          >
            <img 
              src="/img/tve.svg" 
              alt="TVE logo"
              class="transition-all duration-200"
              :class="{
                'h-5': filters.radioOrTV === MediaType.RADIO,
                'h-8': filters.radioOrTV === MediaType.TV
              }"
            />
          </button>
          <button
            type="button" 
            aria-label="Cambio a modo Radio"
            class="cursor-pointer transition-all duration-200"
            :class="{
              'opacity-20 h-5': filters.radioOrTV === MediaType.TV,
              'h-8': filters.radioOrTV === MediaType.RADIO
            }"
            @click="filters.radioOrTV = MediaType.RADIO"
          >
            <img
              src="/img/rne.svg"
              alt="RNE logo"
              class="transition-all duration-200"
              :class="{
                'h-5': filters.radioOrTV === MediaType.TV,
                'h-8': filters.radioOrTV === MediaType.RADIO
              }"
            />
          </button>
        </div>
      </div>
      <div class="flex items-center">
        <NuxtLink
          to="/reports"
          class="flex items-center font-mono text-sm hover:text-gray-600"
        >
          <FileSpreadsheet :size="16" class="mr-2" /> ver informes
        </NuxtLink>
      </div>
    </header>

    <section class="">
      <div class="container py-4">
        <!--
        <h1 class="text-sm uppercase font-bold font-mono">
          vista global y selección de periodo de estudio
        </h1>
        -->

        <div class="grid grid-cols-5 gap-8 my-4">
          <div class="border-t border-black">
            <DateSelector />
          </div>

          <div class="border-t pt-4 border-black">
            <p class="font-mono text-xs mb-2">periodo de estudio:</p>
            <PeriodSelector></PeriodSelector>
          </div>

          <div class="col-span-3 border-t border-black pt-4">
            <chartsSimpleAreaChart
              v-if="evolutionData != null"
              :statsData="evolutionData"
              :timespan="filters.timespan"
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

        <div class="w-full my-6">
          <WrappersFrequencyWr
            v-if="evolutionStackedData != null"
            :evoData="evolutionStackedData"
            :hasActiveFilters="filters.hasActiveFilters"
          />
         
        </div>
      </div>
    </section>
    <!--- end of global stats  -->

    <section class="mt-6">
      <!--
      <div class="container mb-1">
        <h1 class="text-sm uppercase font-bold font-mono">
          datos del periodo seleccionado 
        </h1>
      </div>
      -->

      <div class="container sticky top-0 z-40 bg-white">
        <!-- first row-->
        <div class="pt-4 grid grid-cols-5 gap-8">
          <div class="col-span-2">
            <div class="flex justify-between">
              <p class="font-mono text-sm">
                desde el
                <span class="font-sans font-bold">{{
                  format.dottedDate(jsDateToCalendarDate(timespan[0]))
                }}</span>
                hasta el
                <span class="font-sans font-bold">{{
                  format.dottedDate(jsDateToCalendarDate(timespan[1]))
                }}</span>
              </p>
              <div
                class="text-xs flex justify-end items-center gap-2 font-mono"
              >
                <p>mostrar porcentajes</p>
                <Switch v-model:checked="showPercentage" />
                
              </div>
            </div>
          </div>

          <div class="col-span-3">
            <FiltersInline></FiltersInline>
          </div>
        </div>

        <!-- second row -->
        <div class="py-4 grid grid-cols-5 gap-8">
          <div>
            <chartsNumberCounter
              v-if="globalCounterData != null && timeSpanCounterData != null"
              :varValue="msToHours(queryTotalDurationFromTimeline)"
              :maxValue="msToHours(timeSpanCounterData.total_duration)"
            >
              horas analizadas
            </chartsNumberCounter>
          </div>

          <!-- horas OR % agenda 2030 -->
          <div v-if=" showPercentage">
            <chartsNumberCounter
              v-if="globalCounterData != null && timeSpanCounterData != null"
              :varValue="queryDuration / queryTotalDurationFromTimeline"
              :maxValue="1"
              :formatter="format.PCT"
            >
              % Agenda 2030
            </chartsNumberCounter>


          </div>

          <div v-else>
            <chartsNumberCounter
                v-if="globalCounterData != null && timeSpanCounterData != null"
                :varValue="msToHours(queryDuration)"
                :maxValue="msToHours(timeSpanCounterData.tagged_duration)"
              >
                horas Agenda 2030
              </chartsNumberCounter>
          </div>

          <div>
              <chartsNumberCounter
                v-if="globalCounterData != null && timeSpanCounterData != null"
                :varValue="filteredProgramsCount"
                :maxValue="timeSpanCounterData.programs_count"
              >
                programas
              </chartsNumberCounter>
            </div>
            <div>
              <chartsNumberCounter
                v-if="globalCounterData != null && timeSpanCounterData != null"
                :varValue="filteredEpisodesCount"
                :maxValue="timeSpanCounterData.episodes_count"
              >
                episodios
              </chartsNumberCounter>
            </div>

            <div>
              <FiltersArea></FiltersArea>
            </div>

        </div>
        <!-- end second row -->

  
      </div>

      <!---- evolution in detail-->
      <div class="container">
        <!--
       frequency
        -->

        <div class="mt-16">
          <WrappersSdgWr
            v-if="sdgData != null && baseDataStore.sdgData != null"
            :sdgData="sdgData"
            :baseData="baseDataStore.sdgData"
            :baseTaggedDuration="baseTaggedDuration"
            :hasActiveFilters="
              filters.channels.length > 0 || filters.programs.length > 0
            "
          >
          </WrappersSdgWr>
        </div>

        <div class="mt-16 grid grid-cols-5 gap-8">
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

        <div class="mt-12">
          <WrappersTermsWr
            v-if="tagsData != null && baseDataStore.tagsData != null"
            :tagsData="tagsData"
            :baseData="baseDataStore.tagsData"
            :hasActiveFilters="filters.hasActiveFilters"
          >
          </WrappersTermsWr>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ["auth-user"],
});
import { FileSpreadsheet } from "lucide-vue-next";
import { MediaType } from "~/types/appTypes";
import { cloneDeep } from "lodash";
import { sum } from "d3";
const { $api } = useNuxtApp();
const filters = useFiltersStore();
const baseDataStore = useBaseData();
const apiRepo = dashboardApiRepo($api);
const nuxtApp = useNuxtApp();
const cache = simpleCache();
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
const { timespan, channels, sdgActive, programs, showPercentage } =
  storeToRefs(filters);

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
  async () => {
    const key = evolutionStackedQueryString.value;
    const cacheData = cache.get(key);
    if (cacheData) {
      return cacheData;
    }
    const newData = await apiRepo.getEvolutionStacked(
      jsDatetoApiString(timespan.value[0]),
      jsDatetoApiString(timespan.value[1]),
      filters.sdgActive,
      filters.channels,
      filters.programs
    );
    cache.add(key, newData);
    return newData;
  },
  {
    immediate: true,
    getCachedData: (key) => {
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    },
    watch: [evolutionStackedQueryString],
    transform: (data) => {
      // let's transform all dates into javascript date objects considering that the date format in the api is YYYY-MM-DD
      if (data.transformed) return data;
      data.hoursPeriod.forEach((item) => {
        item.dateObj = new Date(item.date);
      });
      data.initObj = new Date(data.init);
      data.endObj = new Date(data.end);
      data.transformed = true;
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
      filters.channels,
      filters.programs
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
  -sdg${sdgActive.value.join("-")}
  -programs${filters.programs.join("-")}`;
});

const { data: tagsData } = await useAsyncData(
  tagsQueryString.value,
  async () => {
    const key = tagsQueryString.value;
    const cacheData = cache.get(key);
    if (cacheData) {
      return cacheData;
    }
    const newData = await apiRepo.getTags(
      jsDatetoApiString(timespan.value[0]),
      jsDatetoApiString(timespan.value[1]),
      filters.sdgActive,
      filters.channels,
      filters.programs
    );
    cache.add(key, newData);
    return newData;
  },

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

const queryDuration = computed(() => {
  if (evolutionStackedData.value?.hoursPeriod == null) return 0;
  if (filters.hasActiveFilters)
    return sum(evolutionStackedData.value.hoursPeriod, (d) => d.query_duration);
  else
    return sum(
      evolutionStackedData.value.hoursPeriod,
      (d) => d.tagged_duration
    );
});

const queryTotalDurationFromTimeline = computed(() => {
  if (evolutionStackedData.value?.hoursPeriod == null) return 0;
  if (filters.hasActiveFilters)
    return sum(
      evolutionStackedData.value.hoursPeriod,
      (d) => d.query_total_duration
    );
  else
    return sum(evolutionStackedData.value.hoursPeriod, (d) => d.total_duration);
});

const filteredProgramsCount = computed(() => {
  if (programsData.value == null) return 0;
  else if (filters.programs.length === 0) return programsData.value.length;
  else return filters.programs.length;
});

const filteredEpisodesCount = computed(() => {
  if (programsData.value == null) return 0;
  else if (filters.programs.length === 0)
    return sum(programsData.value, (d) => d.episode_count);
  // return the episodes of the programs that are in the filters
  else
    return sum(programsData.value, (d) => {
      if (filters.programs.includes(d.name)) return d.episode_count;
      else return 0;
    });
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

// --- inject data to children ---
provide("queryDuration", queryDuration);
provide("showPercentage", showPercentage);

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
