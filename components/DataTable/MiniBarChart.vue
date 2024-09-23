<script setup lang="ts">
const props = defineProps<{
  total_duration: number;
  tagged_duration: number;
  queryDuration?: number;
  maxTotalDuration: number;
  showQueryDuration: boolean;
}>();

const totalTimePercentage = computed(() => {
  return ((props.total_duration / props.maxTotalDuration) * 100).toFixed(2);
});

const taggedTimePercentage = computed(() => {
  return ((props.tagged_duration / props.maxTotalDuration) * 100).toFixed(2);
});

const filteredTaggedTimePercentage = computed(() => {
  if (props.queryDuration) {
    return (
      (props.queryDuration / props.maxTotalDuration) *
      100
    ).toFixed(2);
  }
  else {
    return 0;
  }
});
</script>

<template>
  
    <div class="w-full h-5 bg-gray-50 relative">
      <TooltipProvider :delayDuration="0">
      <!-- <Tooltip>
        <TooltipTrigger as-child>
          <div
            class="h-full absolute bg-gray-200"
            :style="{ width: maxAvailableWidth + '%' }"
          ></div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Tiempo analizado: {{ format.N(msToHours(maxTotalDuration)) }} horas</p>
        </TooltipContent>
      </Tooltip> -->

      <!-- this is the bar for the tagged duration -->

      <!-- this is the bar for the total duration -->
      <Tooltip>
        <TooltipTrigger as-child>
          <div
            class="h-full absolute bg-gray-200"
            :style="{ width: totalTimePercentage + '%' }"
          ></div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Horas analizadas: {{ format.N(msToHours(total_duration)) }} horas</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger as-child>
          <div
            class="h-full absolute bg-gray-400 z-10"
            :style="{ width: taggedTimePercentage + '%' }"
          ></div>
        </TooltipTrigger>
        <TooltipContent>
          <p> Horas de agenda ODS detectada: {{ format.N(msToHours(tagged_duration)) }} horas</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip v-if="queryDuration && showQueryDuration">
        <TooltipTrigger as-child>
          <div
            class="h-full absolute bg-gray-800 z-20"
            :style="{ width: filteredTaggedTimePercentage + '%' }"
          ></div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{{ format.N(msToHours(queryDuration)) }} horas de contenido con los filtros aplicados</p>
        </TooltipContent>
      </Tooltip>
        </TooltipProvider>

    </div>
</template>
