<template>
  <div>
    <!-- head -->
    <div class="grid grid-cols-[32px_1fr] gap-4 ">
      <img src="/img/programas.svg" alt="programas" class="h-auto w-full " :class="filtersStore.programs.length ? 'opacity-100': 'opacity-20'">
      <div class="border-t border-black pt-2">
        <div class="flex justify-between">
          <h2 class="chart-titles-big">Programas y episodios</h2>
          <!-- the rest on the right -->
          <div class="flex gap-3">
           
            <div class="flex gap-1 items-center text-2xs font-mono">
              <Switch v-model:checked="relativeMode" /> relativo
            </div>

            <div id="programs-search-input"></div>

            <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
           
              
              <Icon
                    name="ooui:info"
                    class="hover:shadow-lg  cursor-pointer w-6 h-6"
                  >
              </Icon>
           
          </TooltipTrigger>
          <TooltipContent
            class="max-w-96 bg-white text-sm shadow-md ring-1 ring-darkCream"
          >
            <slot name="description">
              <ContentQuery path="help/programs" find="one" v-slot="{ data }">
                <ContentRenderer :value="data" class="prose prose-sm" />
              </ContentQuery>
            </slot>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

          </div>
      </div>

      </div>
    </div>

    <DataTableBaseTable
      :columns="columns"
      :data="dataForTable"
      :searchColumnName="'name'"
      teleportTarget="#programs-search-input"
      rowId="name"
      :syncWithFilters="true"
      filterField="programs"
      filterFlagField="programRemovedFlag"
    />
  </div>
</template>

<script lang="ts" setup>
import { _grayscale } from "#twcss/theme";
import type { StatsPrograms, SdgTopic } from "../../types/apiTypes";
import { columns } from "../DataTable/programColumns";
import { rollups, sum } from "d3";

const filtersStore = useFiltersStore();
interface Props {
  programsData: Array<StatsPrograms>;
  baseData: Array<StatsPrograms>;
  hasActiveFilters: boolean;
}

const props = withDefaults(defineProps<Props>(), {});

const maxTotalDuration = computed(() => {
  return Math.max(...props.baseData.map((prg) => prg.total_duration));
});

const relativeMode = ref(false);

const dataForTable = computed(() => {
  return props.baseData
    .map((prgBase) => {
      const filteredEquivalent = props.programsData.find(
        (prg2) => prgBase.name === prg2.name
      );
      if (!filteredEquivalent) return null;

      const alltopics =
        filteredEquivalent == undefined
          ? prgBase.topics
          : filteredEquivalent.topics;

      // get top 5 topics
      const topTopics = alltopics
        .sort((a, b) => b.duration - a.duration)
        .slice(0, 5);
      const queryDuration = props.hasActiveFilters
        ? sum(filteredEquivalent.topics, (d) => d.duration)
        : 0;

      return {
        hasActiveFilters: props.hasActiveFilters,
        canal: prgBase.channel,
        name: prgBase.name,
        queryDuration: queryDuration,
        total_duration: prgBase.total_duration,
        tagged_duration: prgBase.tagged_duration,
        episode_count: prgBase.episode_count,
        sdgs: topTopics.map((topic) => topic.topic),
        maxTotalDuration: relativeMode.value
          ? prgBase.total_duration
          : maxTotalDuration.value,
      };
    })
    .filter((prg) => prg !== null);
});
</script>

<style></style>
