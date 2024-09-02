<template>
  <div>
    <h2 class="chart-titles">Objetivos y metas</h2>
    <div class="flex justify-start gap-2 text-2xs ">
      <button
        v-for="(longname, code, i) in SdgTopic"
        class="border-b-4 w-5 text-center hover:border-b-2"
        :style="{
          'border-color':noSdgSelection || sdgActive.includes(longname)
            ? `${STYLES.topics[longname]?.color}`
            : '',
        }"
        @click="sdgClickHandler(longname)"
      >
        {{ i + 1}}
      </button>
    </div>

    <div class="grid grid-cols-5">
    <ChartsScannerRadialOds
    class="col-span-2"
      v-if="sdgData != null"
      :result="sdgData"
      :styles="STYLES"
      :only-ods="noSdgSelection"
      :sdgActive="sdgActive"
      @update:clickedElement="(element) => {
        sdgClickHandler(element.name);
      }"
    >
    
    </ChartsScannerRadialOds>
    <DataTableBaseTable :columns="columns" :data="sdgData" class="col-span-3"/>

    </div>

    


  </div>
</template>

<script setup lang="ts">
import { useElementSize } from "@vueuse/core";
const filtersStore = useFiltersStore();
const { sdgActive } = storeToRefs(filtersStore);
const noSdgSelection = computed(() => sdgActive.value.length === 0);
import { columns } from '../DataTable/sdgColumns';

interface Props {
  sdgData: Array<StatsSdg>;
  timeSpan?: [Date, Date];
}

function sdgClickHandler(sdgId: SdgTopic) {
  if (sdgActive.value.length === 0) {
    sdgActive.value = [sdgId];
  } else {
    if (sdgActive.value.includes(sdgId)) {
      sdgActive.value.splice(sdgActive.value.indexOf(sdgId), 1);
    } else {
      sdgActive.value.push(sdgId);
    }
  }
}

const props = withDefaults(defineProps<Props>(), {});


</script>

<style scoped></style>
