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
          v-if="globalCounterData != null || timeSpanCounterData != null"
          :varValue="msToHours(timeSpanCounterData.total_duration)"
          :maxValue="msToHours(globalCounterData.total_duration)"
        >
          horas analizadas
        </chartsNumberCounter>
      </div>

      <div>
        <chartsNumberCounter
          v-if="globalCounterData != null || timeSpanCounterData != null"
          :varValue="msToHours(timeSpanCounterData.tagged_duration)"
          :maxValue="msToHours(globalCounterData.tagged_duration)"
        >
          horas Agenda 2030
        </chartsNumberCounter>
      </div>

      <div>
        <chartsNumberCounter
          v-if="globalCounterData != null || timeSpanCounterData != null"
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
          v-if="globalCounterData != null || timeSpanCounterData != null"
          :varValue="timeSpanCounterData.programs_count"
          :maxValue="globalCounterData.programs_count"
        >
          programas
        </chartsNumberCounter>
      </div>

      <div>
        <chartsNumberCounter
          v-if="globalCounterData != null || timeSpanCounterData != null"
          :varValue="timeSpanCounterData.episodes_count"
          :maxValue="globalCounterData.episodes_count"
        >
          episodios
        </chartsNumberCounter>
      </div>
    </div>

    <div class="mt-8">
      <WrappersSdg v-if="sdgData != null" :sdgData="sdgData"> </WrappersSdg>
    </div>

    <div class="mt-8">
      <WrappersChannels v-if="Channels != null" :channelData="channelsData"> </WrappersChannels>
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
const { $api } = useNuxtApp();
const filters = useFiltersStore();
const userRepo = dashboardApiRepo($api);

/** following data depends only on timespan***/
const { timespan, channels,sdgActive } = storeToRefs(filters);
const { data: globalCounterData } = await useAsyncData(() =>
  userRepo.getStatsCounter()
);

const { data: evolutionData } = await useAsyncData(() =>
  userRepo.getEvolution()
);

const { data: timeSpanCounterData } = await useAsyncData(
  `stats${jsDatetoApiString(timespan.value[0])}-${jsDatetoApiString(
    timespan.value[0]
  )}`,
  () =>
    userRepo.getStatsCounter(
      jsDatetoApiString(timespan.value[0]),
      jsDatetoApiString(timespan.value[1])
    ),
  {
    immediate: true,
    watch: [timespan],
  }
);

/** following data depends on filters ***/

const { data: sdgData } = await useAsyncData(() => userRepo.getOdsAndGoals());

const { data: programsData } = await useAsyncData(
`stats${jsDatetoApiString(timespan.value[0])}-${jsDatetoApiString(
    timespan.value[0]
  )}-programs${channels.value.join("-")}
  -sdg${sdgActive.value.join("-")}`,
  () =>
  userRepo.getPrograms(
    jsDatetoApiString(timespan.value[0]),
    jsDatetoApiString(timespan.value[1]),
    channels.value,
    sdgActive.value 
  ),
  {
    immediate: true,
    watch: [timespan, channels, sdgActive ],
  }
);

const { data: channelsData } = await useAsyncData(
`stats${jsDatetoApiString(timespan.value[0])}-${jsDatetoApiString(
    timespan.value[0]
  )}
  -sdg${filters.sdgActive.join("-")}`,
  () =>
  userRepo.getChannels(
    jsDatetoApiString(timespan.value[0]),
    jsDatetoApiString(timespan.value[1]),
    sdgActive.value
  ),
  {
    immediate: true,
    watch: [timespan, channels, sdgActive],
  }
);



const data = ref<Stat[] | null>(null);
// const globalCounterData = ref<StatsCounter|null> (null)

onMounted(async () => {
  console.log($api);
  data.value = await userRepo.getStats();
  console.log(data.value);
});

const isDataReady = computed(
  () =>
    globalCounterData != null &&
    evolutionData != null &&
    timeSpanCounterData != null &&
    sdgData != null
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
