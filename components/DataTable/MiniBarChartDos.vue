<script setup lang="ts">
// mini bar chart used only for terms
const props = defineProps<{
  total: number;
  filtered?: number;
  maxTotal: number;
  hasActiveFilters: boolean;
}>();

const totalTimePercentage = computed(() => {
  return ((props.total / props.maxTotal) * 100).toFixed(2);
});

const filteredTaggedTimePercentage = computed(() => {
  if (props.filtered) {
    return ((props.filtered / props.maxTotal) * 100).toFixed(2);
  } else {
    return 0;
  }
});
</script>

<template>
  <div class="w-full h-5 bg-gray-50 relative">
    <TooltipProvider :delayDuration="0">
      <Tooltip>
        <TooltipTrigger as-child>
          <div
            class="h-full absolute bg-gray-200"
            :style="{ width: totalTimePercentage + '%' }"
          ></div>
        </TooltipTrigger>
        <TooltipContent>
          <div>Horas de duración de este tag: {{ format.msToTime(total) }}</div>
        </TooltipContent>
      </Tooltip>

      <Tooltip v-if="filtered && hasActiveFilters">
        <TooltipTrigger as-child>
          <div
            class="h-full absolute bg-gray-600 z-20"
            :style="{ width: filteredTaggedTimePercentage + '%' }"
          ></div>
        </TooltipTrigger>
        <TooltipContent>
          <div>
            <span class="font-bold">{{ format.msToTime(filtered) }} </span> horas detectadas según filtros
            
            <span v-if="total">({{ format.PCT(filtered / total) }})</span>

          </div>

        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
</template>
