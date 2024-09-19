<template>
  <div class="ml-8 text-xs">
    <div class="flex" v-for="goal in sortedGoals">
      <div class="w-10">
        <div class="">
          {{ spliceGoalName(goal.goal)[0] }}
        </div>
      </div>
      <div class="w-[230px]">
        <div class="flex-grow-0" :style="{ width: maxWidthScaled*100 + '%' }">
          <MiniBarSdg
            :base_duration="goal.duration"
            :maxTotalDuration="parentDuration"
            :query_duration="0"
            :isSubTopic="true"
            :name="goal.goal"
          />
        </div>
      </div>
      <div class="w-auto flex-grow text-gray-500 text-right">
        {{ spliceGoalName(goal.goal)[1] }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MiniBarSdg from "./MiniBarSdg.vue";

interface Props {
  data: StatsGoal[];
  maxTotalDuration: number;
  parentDuration: number;
}

function spliceGoalName(goal: string) {
  let byword = goal.split(" ");
  return [byword[0], byword.slice(1).join(" ")];
}

const sortedGoals = computed(() => {
  return props.data.sort((a, b) => b.duration - a.duration);
});

// available width for the mini bar is the width of the parent base_duration
const maxWidthScaled = computed(() => {
  return props.parentDuration / props.maxTotalDuration;
});

const props = withDefaults(defineProps<Props>(), {});
</script>

<style scoped></style>
