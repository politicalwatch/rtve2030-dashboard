<template>
  <div>
    <div class="grid grid-cols-5 gap-8">
      <div class="col-span-2">
        <h2 class="chart-titles">Objetivos y metas</h2>
        <div class="flex justify-start gap-2 text-2xs">
          <button
            v-for="(longname, code, i) in SdgTopic"
            class="border-b-4 w-5 text-center hover:border-b-2"
            :style="{
              'border-color':
                noSdgSelection || sdgActive.includes(longname)
                  ? `${STYLES.topics[longname]?.color}`
                  : '',
            }"
            @click="sdgClickHandler(longname)"
          >
            {{ i + 1 }}
          </button>
        </div>

        <ChartsScannerRadialOds
          v-if="sdgData != null"
          :result="sdgData"
          :styles="STYLES"
          :only-ods="noSdgSelection"
          :sdgActive="sdgActive"
          @update:clickedElement="
            (element) => {
              sdgClickHandler(element.name);
            }
          "
        >
        </ChartsScannerRadialOds>
      </div>

      <div class="col-span-3">
        <DataTableBaseTable
          :columns="columns"
          :data="dataForTables"
          v-if="sdgActive.length === 0"
        />
        <DataTableBaseTable
          :columns="goalColumns"
          :data="dataForTableGoals"
          v-else
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { sum,max } from "d3";
const filtersStore = useFiltersStore();
const { sdgActive } = storeToRefs(filtersStore);
const noSdgSelection = computed(() => sdgActive.value.length === 0);
import { columns } from "../DataTable/sdgColumns";
import { goalColumns } from "../DataTable/goalColumns";
import { parseDuration } from "@internationalized/date";


interface Props {
  sdgData: Array<StatsSdg>;
  baseData: Array<StatsSdg>;
  baseTaggedDuration: number;
  hasActiveFilters: boolean;
}

function sdgClickHandler(sdgId: SdgTopic) {
  if (sdgActive.value.length === 0) {
    sdgActive.value = [sdgId];
  } else {
    if (sdgActive.value.includes(sdgId)) {
      sdgActive.value.splice(sdgActive.value.indexOf(sdgId), 1);
    } else {
      sdgActive.value.push(sdgId);
    }
  }
}

const props = withDefaults(defineProps<Props>(), {});
const maxTotalDuration = computed(() => {
  return Math.max(...props.baseData.map((sdg) => sdg.duration));
});

const globalDuration = computed(() => {
  return sum(props.sdgData, (d) => d.duration);
});

const dataForTables = computed<TableSdg[]>(() => {
  return props.sdgData.map((sdg) => {
    return {
      sdg: sdg.sdg,
      base_duration: props.baseData.find((d) => d.sdg === sdg.sdg)?.duration,
      query_duration: props.hasActiveFilters ? sdg.duration : 0,
      maxBaseDuration: maxTotalDuration.value,
      occurrences: sdg.occurrences,
      queryGoals: sdg.goals,
      baseGoals: props.baseData.find((d) => d.sdg === sdg.sdg)?.goals,
      hasActiveFilters: props.hasActiveFilters,
    };
  });
});

const dataForTableGoals = computed<TableGoals[]>(() => {
  // get the sdgData that matches the sdgActive

  const sdgDataFiltered = props.sdgData.filter((sdg) =>
    sdgActive.value.includes(sdg.sdg)
  );

  const sdgBaseDataFiltered = props.baseData.filter((sdg) =>
    sdgActive.value.includes(sdg.sdg)
  );
  const filteredGoals = sdgDataFiltered.flatMap((sdg) => sdg.goals);

  const filteredBaseGoals = sdgBaseDataFiltered.flatMap((sdg) => sdg.goals);

  const maxfilteredBaseGoals = max(filteredBaseGoals, (d) => d.duration) ?? 0;
  // get the targets
  // For each target we need:
  // - goal // name
  // - duration
  // - occurrences
  // - Parent Sdg duration
  // maxParent Sdg duration
  const goalsData: TableGoals[] = [];


  function findParentFromGoal(goal: string) {
    return sdgDataFiltered.find((sdg) => sdg.goals.find((g) => g.goal === goal));
  }
  return filteredGoals.map((goal) => {
    return {
      goal: goal.goal,
      base_duration: filteredBaseGoals.find((d) => d.goal === goal.goal)
        ?.duration,
      query_duration: goal.duration,
      maxGoalDuration: maxfilteredBaseGoals,
      parentSdg: findParentFromGoal(goal.goal)?.sdg,
      hasActiveFilters: props.hasActiveFilters,
    };
  });
  
  // sdgDataFiltered.forEach((sdg) => {k
  //   const parentSdgDuration = sdg.duration;
  //   const maxParentSdgDuration = maxTotalDurationQuerySdg;

  //   sdg.goals.forEach((goal) => {
  //     goalsData.push({
  //       goal: goal.goal,
  //       duration: goal.duration,
  //       occurrences: goal.occurrences,
  //       parentSdgDuration: parentSdgDuration,
  //       maxParentSdgDuration: maxParentSdgDuration,
  //       parentSdg: sdg.sdg,
  //     });
  //   });
  // });

  return goalsData;
});
</script>

<style scoped></style>
