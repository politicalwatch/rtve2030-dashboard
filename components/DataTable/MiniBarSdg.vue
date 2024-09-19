<script setup lang="ts">
interface MiniBarSdgProps {
  total_duration: number;
  tagged_duration: number;
  queryDuration?: number;
  maxTotalDuration: number;
  isSubTopic?: boolean;
  name: string;
}

const props = withDefaults(defineProps<MiniBarSdgProps>(), {
  queryDuration: undefined,
  isSubTopic: false
});

const totalTimePercentage = computed(() => {
  return (props.total_duration / props.maxTotalDuration) * 100;
});

const taggedTimePercentage = computed(() => {
  return (props.tagged_duration / props.maxTotalDuration) * 100;
});

const filteredTaggedTimePercentage = computed(() => {
  if (props.queryDuration) {
    return (
      (props.queryDuration / props.maxTotalDuration) *
      100
    ).toFixed(2);
  } else {
    return 0;
  }
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
            class="h-full absolute bg-gray-200"
            :style="{ width: totalTimePercentage + '%' }"
          ></div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            Horas con ODS detectadas: {{ format.N(msToHours(total_duration)) }} horas
          </p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger as-child>
          <div
            class="h-full absolute bg-gray-400 z-10"
            :style="{ width: Math.min(taggedTimePercentage, 100) + '%' }"
          ></div>
          <div
            class="absolute text-left text-xs font-normal "
            :style="{ left: Math.min(taggedTimePercentage  + 5,90) + '%', top: '2px' }"
          >
            {{ format.msToTime(tagged_duration) }}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            ODS {{ getSdgNumberFromName(name) }}: 
            {{ format.N(msToHours(tagged_duration)) }} horas
          </p>
        </TooltipContent>
      </Tooltip>

      <Tooltip v-if="queryDuration">
        <TooltipTrigger as-child>
          <div
            class="h-full absolute bg-gray-800 z-20"
            :style="{ width: filteredTaggedTimePercentage + '%' }"
          ></div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{{ format.N(msToHours(queryDuration)) }} horas</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
</template>
