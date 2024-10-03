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
    return ((props.queryDuration / props.maxTotalDuration) * 100).toFixed(2);
  } else {
    return 0;
  }
});
</script>

<template>
  <div class="w-full h-5 bg-gray-50 relative">
    <TooltipProvider :delayDuration="0">
      <!-- this is the bar for the total duration -->
      <Tooltip>
        <TooltipTrigger as-child>
          <div
            class="h-full absolute bg-gray-200"
            :style="{ width: totalTimePercentage + '%' }"
          ></div>
        </TooltipTrigger>
        <TooltipContent>
          <div>
            Horas analizadas:
            <div class="font-bold">{{ format.msToTime(total_duration) }}</div>
          </div>
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
          <div>
            Horas de agenda ODS detectada:
            <div>
              <span class="font-semibold"
                >{{ format.msToTime(tagged_duration) }}
              </span>

              <span class="">
                ({{ format.PCT(tagged_duration / total_duration) }})
              </span>
            </div>
          </div>
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
          <div>
            {{ format.msToTime(queryDuration) }} horas de contenido con los
            filtros aplicados
            <div>
              <span class="font-semibold"
                >({{ format.PCT(queryDuration / tagged_duration) }}
              </span>
              de todo lo etiquetado)
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
</template>
