<template>
  <div class="w-full h-5 bg-gray-200 relative">
    <div class="h-full absolute bg-black" :style="{ width: taggedTimePercentage + '%' }"></div>
    <div class="h-full absolute bg-gray-500" :style="{ width: totalTimePercentage + '%' }"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { defineProps } from 'vue';

const props = defineProps<{
  total_duration: number;
  tagged_duration: number;
}>();

const totalTimePercentage = computed(() => {
  return ((props.total_duration / (props.total_duration + props.tagged_duration)) * 100).toFixed(2);
});

const taggedTimePercentage = computed(() => {
  return ((props.tagged_duration / (props.total_duration + props.tagged_duration)) * 100).toFixed(2);
});

</script>