<template>
  <div class="container">
    <section class="grid grid-cols-5 gap-8 items-center my-4">
      <DateSelector />
      <div>
        <select>
          <option>choose date</option>
        </select>
      </div>
      <div class="col-span-3">
        <chartsSimpleAreaChart
          v-if="evolutionData != null"
          :statsData="evolutionData"
        ></chartsSimpleAreaChart>

      </div>
    </section>
    <div class="grid grid-cols-5 gap-8">
      <div>
        <chartsNumberCounter
          v-if="counterData != null"
          :varValue="msToHours(counterData.total_duration)"
          :maxValue="msToHours(counterData.total_duration)"
        >
          horas analizadas
        </chartsNumberCounter>
      </div>

      <div>
        <chartsNumberCounter
          v-if="counterData != null"
          :varValue="msToHours(counterData.tagged_duration)"
          :maxValue="msToHours(counterData.tagged_duration)"
        >
          horas Agenda 2030
        </chartsNumberCounter>
      </div>

      <div>
        <chartsNumberCounter
          v-if="counterData != null"
          :varValue="counterData.tagged_duration / counterData.total_duration"
          :maxValue="1"
          :formatter="format.PCT"
        >
          % agenda 2030
        </chartsNumberCounter>
      </div>

      <div>
        <chartsNumberCounter
          v-if="counterData != null"
          :varValue="counterData.programs_count"
          :maxValue="counterData.programs_count"
        >
          programas
        </chartsNumberCounter>
      </div>

      <div>
        <chartsNumberCounter
          v-if="counterData != null"
          :varValue="counterData.episodes_count"
          :maxValue="counterData.episodes_count"
        >
          episodios
        </chartsNumberCounter>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { $api } = useNuxtApp();
const userRepo = dashboardApiRepo($api);

const { data: counterData } = await useAsyncData(() =>
  userRepo.getStatsCounter()
);
const { data: evolutionData } = await useAsyncData(() =>
  userRepo.getEvolution()
);

const data = ref<Stat[] | null>(null);
// const counterData = ref<StatsCounter|null> (null)

onMounted(async () => {
  console.log($api);
  data.value = await userRepo.getStats();
  console.log(data.value);
});
</script>

<style></style>
