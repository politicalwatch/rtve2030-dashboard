<template>
  <div class="ml-8 text-xs">
    <div class="flex" v-for="baseGoal in sortedGoals">
      <div class="w-10">
        <div class="">
          {{ spliceGoalName(baseGoal.goal)[0] }}
        </div>
      </div>
      <div
        :style="{
          width: MAX_WIDTH_SDG_BAR + 'px',
        }"
      >
        <div class="flex-grow-0 w-full">
          <MiniBarSdg
            :base_duration="baseGoal.duration"
            :maxTotalDuration="maxSdgDuration"
            :query_duration="goalMap.get(baseGoal)?.duration"
            :isSubTopic="true"
            :name="baseGoal.goal"
            :showQueryDuration="hasActiveFilters"
          />
        </div>
      </div>
      <div class="w-auto flex-grow text-gray-500 text-right">
        {{ spliceGoalName(baseGoal.goal)[1] }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MiniBarSdg from "./MiniBarSdg.vue";
import { max } from "d3";
interface Props {
  baseGoals: StatsGoal[];
  queryGoals: StatsGoal[];
  maxTotalDuration: number;
  hasActiveFilters: boolean;
}

const maxSdgDuration = computed(() => {
  return max(props.baseGoals, (d) => d.duration) ?? 0;
});

function spliceGoalName(goal: string) {
  let byword = goal.split(" ");
  return [byword[0], byword.slice(1).join(" ")];
}

const sortedGoals = computed(() => {
  return props.baseGoals.sort((a, b) => a.goal.localeCompare(b.goal));
});

const goalMap = computed(() => {
  const map = new WeakMap();
  props.baseGoals.forEach((baseGoal) => {
    const queryGoal = props.queryGoals.find((qg) => qg.goal === baseGoal.goal);
    if (queryGoal) {
      map.set(baseGoal, queryGoal);
    }
  });
  return map;
});

// available width for the mini bar is the width of the parent base_duration
const maxWidthScaled = computed(() => {
  return props.parentDuration / props.maxTotalDuration;
});

const props = withDefaults(defineProps<Props>(), {});
</script>

<style scoped></style>
