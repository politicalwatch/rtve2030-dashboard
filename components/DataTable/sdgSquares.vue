<template>
  <div class="flex gap-2 flex-wrap">
    <TooltipProvider :delayDuration="0">
      <Tooltip v-for="sdg in sdgs" :key="sdg">
        <TooltipTrigger as-child>
          <div
            class="w-2 h-2 z-10 block"
            :style="{
              'background-color': `${STYLES.topics[sdg]?.color}`,
            }"
          ></div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{{ sdg }}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  sdgs: SdgTopic[];
}
const props = withDefaults(defineProps<Props>(), {});
</script>

<style></style>
