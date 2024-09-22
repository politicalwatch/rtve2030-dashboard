<script setup lang="ts">
interface MiniBarSdgProps {
  base_duration: number;
  query_duration: number;
  maxTotalDuration: number;
  isSubTopic?: boolean;
  name: string;
  showQueryDuration?: boolean;
}

const props = withDefaults(defineProps<MiniBarSdgProps>(), {
  query_duration: undefined,
  isSubTopic: false,
});

const baseTimePercentage = computed(() => {
  return (props.base_duration / props.maxTotalDuration) * 100;
});

const queryTagPercentage = computed(() => {
  return (props.query_duration / props.maxTotalDuration) * 100;
});

const textPosition = computed(() => {
  if (baseTimePercentage.value < 80) {
    return baseTimePercentage.value + 2;
  } else {
    return baseTimePercentage.value - 20;
  }
});

const textColorClass = computed(() => {
  if (baseTimePercentage.value < 80) {
    return "text-black";
  } else {
    return "text-white";
  }
});

const textPositionQuery = computed(() => {
  if (queryTagPercentage.value < 80) {
    return queryTagPercentage.value + 2;
  } else {
    return queryTagPercentage.value - 20;
  }
});

const textQueryColorClass = computed(() => {
  if (queryTagPercentage.value < 80) {
    return "text-black";
  } else {
    return "text-white";
  }
});
</script>

<template>
  <div
    class="w-full relative"
    :class="!isSubTopic ? '-mt-1 -mb-1 h-8' : 'mb-0.5 h-5 '"
  >
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
            class="h-full absolute bg-gray-400 z-10 transtiion-all"
            :class="
              !isSubTopic ? '' : 'border-dashed border-black border opacity-50'
            "
            :style="{ width: Math.min(baseTimePercentage, 100) + '%' }"
          ></div>
          <div
            v-if="showQueryDuration === false"
            class="absolute text-left text-xs font-normal z-20"
            :class="textColorClass"
            :style="{
              left: textPosition + '%',
              top: isSubTopic ? '2px' : '6px',
            }"
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

      <Tooltip v-if="showQueryDuration && query_duration">
        <TooltipTrigger as-child>
          <div
            class="h-full absolute bg-gray-800 z-20 transtition-all"
            :class="!isSubTopic ? '' : ' opacity-50'"
            :style="{ width: queryTagPercentage + '%' }"
          ></div>
          <div
            v-if="showQueryDuration === true"
            class="absolute text-left text-xs font-normal z-20"
            :class="textQueryColorClass"
            :style="{
              left: textPositionQuery + '%',
              top: isSubTopic ? '2px' : '6px',
            }"
          >
            {{ format.msToTime(query_duration) }}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{{ format.N(msToHours(query_duration)) }} horas</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
</template>
