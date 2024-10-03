<script setup lang="ts">
interface MiniBarSdgProps {
  base_duration: number;
  query_duration: number;
  maxTotalDuration: number;
  isSubTopic?: boolean;
  name: string;
  showQueryDuration?: boolean;
  parentDuration?: number;
}

const props = withDefaults(defineProps<MiniBarSdgProps>(), {
  query_duration: undefined,
  isSubTopic: false,
});

const INshowPercentage = inject("showPercentage") as Ref<boolean>;
const INqueryDuration = inject("queryDuration") as Ref<number>;

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
            <template v-if="INshowPercentage">
              {{ format.PCT(base_duration / INqueryDuration) }}
            </template>
            <template v-else> {{ format.msToTime(base_duration) }}</template>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div>
            <div class="font-bold">
              {{ isSubTopic?`Meta ${name}`:`ODS  ${getSdgNumberFromName(name)}` }}
            </div>
            <div class="ml-2">{{ format.msToTime(base_duration) }} horas</div>
            <div class="ml-2">
              {{ format.PCT(base_duration / INqueryDuration) }} del todo el
              tiempo etiquetado
            </div>
            <div class="ml-2" v-if="props.parentDuration && isSubTopic">
              {{ format.PCT(base_duration / props.parentDuration) }} del ODS
            </div>
          </div>
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
            <template v-if="INshowPercentage">
              {{ format.PCT(base_duration / INqueryDuration) }}
            </template>
            <template v-else> {{ format.msToTime(query_duration) }}</template>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div>
            <div class="font-bold">Según filtros</div>
            <div class="ml-2">{{ format.msToTime(query_duration) }} horas</div>
            <div class="ml-2">
              {{ format.PCT(query_duration / base_duration) }} del total
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
</template>
