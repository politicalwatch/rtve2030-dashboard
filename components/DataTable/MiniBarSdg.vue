<script setup lang="ts">
interface MiniBarSdgProps {
  base_duration: number;
  query_duration: number;
  maxTotalDuration: number;
  totalSdgDurationCalculatedQuery: number; // aggregated duration of all sdgs
  totalSdgDurationCalculatedBase: number;
  isSubTopic?: boolean; // true when the component is used in a nested subtopic
  isGoal?: boolean; // true when the component is a goal. false when it is a SDG
  name: string;
  showQueryDuration?: boolean;
  parentDuration?: number;
}

const props = withDefaults(defineProps<MiniBarSdgProps>(), {
  query_duration: undefined,
  isSubTopic: false,
  isGoal: false,
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
      <!-- main bar-->

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
            class="absolute text-left text-xs font-normal z-20 pointer-events-none"
            :class="textColorClass"
            :style="{
              left: textPosition + '%',
              top: isSubTopic ? '2px' : '6px',
            }"
          >
            <template v-if="INshowPercentage">
              {{ format.PCT(base_duration / totalSdgDurationCalculatedBase) }}
            </template>
            <template v-else> {{ format.msToTime(base_duration) }}</template>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div v-if="isSubTopic">
            <div class="font-bold">
              {{ `Meta ${name}` }}
            </div>
            <div class="ml-2">{{ format.msToTime(base_duration) }} horas</div>
            <div class="ml-2">
              {{
                format.PCT(base_duration / totalSdgDurationCalculatedBase)
              }}
              del todo el tiempo etiquetado
            </div>
            <div class="ml-2" v-if="props.parentDuration">
              {{ format.PCT(base_duration / props.parentDuration) }} del ODS
            </div>
          </div>
          <div v-else>
            <div class="font-bold">
              <template v-if="!isGoal">
                {{ `ODS  ${getSdgNumberFromName(name)}` }}</template
              >
              <template v-else> {{ `Meta ${name}` }}</template>
            </div>
            <div class="ml-2">{{ format.msToTime(base_duration) }} horas</div>
            <div class="ml-2">
              {{
                format.PCT(base_duration / totalSdgDurationCalculatedBase)
              }}
              del todo el tiempo etiquetado
            </div>
          </div>
        </TooltipContent>
      </Tooltip>

      <!-- query bar-->
      <Tooltip v-if="showQueryDuration && query_duration">
        <TooltipTrigger as-child>
          <div
            class="h-full absolute bg-gray-800 z-20 transtition-all"
            :class="!isSubTopic ? '' : ' opacity-50'"
            :style="{ width: queryTagPercentage + '%' }"
          ></div>
          <div
            v-if="showQueryDuration === true"
            class="absolute text-left text-xs font-normal z-20 pointer-events-none"
            :class="textQueryColorClass"
            :style="{
              left: textPositionQuery + '%',
              top: isSubTopic ? '2px' : '6px',
            }"
          >
            <template v-if="INshowPercentage">
              {{ format.PCT(query_duration / totalSdgDurationCalculatedQuery) }}
            </template>
            <template v-else> {{ format.msToTime(query_duration) }}</template>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div v-if="isSubTopic">
            <div class="font-bold">Según filtros:</div>
            <div class="ml-2">{{ format.msToTime(query_duration) }} horas</div>
            <div class="ml-2">
              {{ format.PCT(query_duration / base_duration) }} de la meta sin filtrar
            </div>
            <div class="ml-2">
              {{
                format.PCT(query_duration / totalSdgDurationCalculatedQuery)
              }}
              de todos los ODS
            </div>
          </div>
          <div v-else>

          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
</template>
