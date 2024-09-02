<template>
  <div class="ml-8 text-xs">
    <div class="grid grid-cols-3 gap-4" v-for="goal in data">
      <div>
        {{ spliceGoalName(goal.goal)[0] }}
      </div>
      <div class="w-24">
        <MiniBarChart :total_duration="goal.total_duration" :tagged_duration="goal.tagged_duration" />
      </div>
      <div>{{ spliceGoalName(goal.goal)[1]}}</div>
      <div>
        {{ goal.total_duration }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MiniBarChart from './miniBarChart.vue';

interface Props {
  data: StatsGoal[];
}

function spliceGoalName(goal: string) {

  let byword= goal.split(' ');
  return [byword[0], byword.slice(1).join(' ')]
}

const props = withDefaults(defineProps<Props>(), {});
</script>

<style scoped></style>
