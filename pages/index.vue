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
            timeSpanCounterData.tagged_duration / timeSpanCounterData.total_duration
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
  </div>
</template>

<script lang="ts" setup>
const { $api } = useNuxtApp();
const filters = useFiltersStore();
const userRepo = dashboardApiRepo($api);

const { timespan } = storeToRefs(filters);

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

const data = ref<Stat[] | null>(null);
// const globalCounterData = ref<StatsCounter|null> (null)

onMounted(async () => {
  console.log($api);
  data.value = await userRepo.getStats();
  console.log(data.value);
});

const isDataReady=computed(()=>globalCounterData!=null && evolutionData!=null && timeSpanCounterData!=null)

</script>

<style></style>
