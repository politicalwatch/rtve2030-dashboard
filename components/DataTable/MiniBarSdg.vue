<script setup lang="ts">
interface MiniBarSdgProps {
  base_duration: number;
  query_duration: number;
  maxTotalDuration: number;
  isSubTopic?: boolean;
  name: string;
}

const props = withDefaults(defineProps<MiniBarSdgProps>(), {
  query_duration: undefined,
  isSubTopic: false
});

const baseTimePercentage = computed(() => {
  return (props.base_duration / props.maxTotalDuration) * 100;
});

const queryTagPercentage = computed(() => {
  return (props.query_duration / props.maxTotalDuration) * 100;
});


</script>

<template>
  <div class="w-full h-8  relative"
  :class="!isSubTopic?'-mt-1 -mb-1':''">

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
            class="h-full absolute bg-gray-50 w-full"
            
          ></div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            Horas con ODS detectadas: {{ format.msToTime(maxTotalDuration) }} horas
          </p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger as-child>
          <div
            class="h-full absolute bg-gray-400 z-10"
            :style="{ width: Math.min(baseTimePercentage, 100) + '%' }"
          ></div>
          <div
            class="absolute text-left text-xs font-normal "
            :style="{ left: Math.min(baseTimePercentage  + 5,90) + '%', top: '2px' }"
          >
            {{ format.msToTime(base_duration) }}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            ODS {{ getSdgNumberFromName(name) }}: 
            {{ format.N(msToHours(base_duration)) }} horas
          </p>
        </TooltipContent>
      </Tooltip>

      <Tooltip v-if="query_duration">
        <TooltipTrigger as-child>
          <div
            class="h-full absolute bg-gray-800 z-20"
            :style="{ width: queryTagPercentage + '%' }"
          ></div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{{ format.N(msToHours(query_duration)) }} horas</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
</template>
