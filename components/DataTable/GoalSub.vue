<template>
  <div class="ml-8 text-xs">
    <div class="flex" v-for="goal in sortedGoals">
      <div class="w-10">
        <div class="">
        {{ spliceGoalName(goal.goal)[0] }}</div>
      </div>
      <div class="flex-grow-0" :style="{width: maxWidthScaled*100+'%'}">
        <MiniBarSdg
          :total_duration="goal.duration"
          :maxTotalDuration="sdgTotalTaggedDuration"
          :tagged_duration="goal.duration"
          :isSubTopic="true"
          :name="goal.goal"
        />
      </div>
      <div class="w-auto flex-grow text-gray-500 text-right">{{ spliceGoalName(goal.goal)[1] }}</div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import MiniBarSdg from "./MiniBarSdg.vue";

interface Props {
  data: StatsGoal[];
  sdgTotalTaggedDuration: number;
  maxParentWidth: number;
}


function spliceGoalName(goal: string) {
  let byword = goal.split(" ");
  return [byword[0], byword.slice(1).join(" ")];
}

const sortedGoals = computed(() => {
  return props.data.sort((a, b) => b.duration - a.duration);
});

// available width for the mini bar is the width of the parent 
const maxWidthScaled = computed(() => {
  return props.sdgTotalTaggedDuration / props.maxParentWidth;
});

const props = withDefaults(defineProps<Props>(), {});
</script>

<style scoped></style>
