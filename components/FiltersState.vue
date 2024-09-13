<template>
  <div class="space-y-2 border-t border-black">
    <div class="flex justify-between">
      <h2 class="chart-titles">filtros activos</h2>
      <div class="text-sm text-gray-500">{{ mouseoverText }}</div>
    </div>

    <!-- SDG Filters -->
    <div class="border-t border-gray-300 h-5 py-1">
      <div v-if="activeSDGFilters.length" class="flex flex-wrap gap-2">
        <div v-for="sdg in activeSDGFilters" :key="sdg" class="relative group">
          <div
            class="w-4 h-4"
            :style="{ backgroundColor: sdgColors(sdg) }"
         
          ></div>
          <button
            @click="removeSdgFilter(sdg); mouseoverText = ''"
               @mouseover="mouseoverText =  sdg"
            @mouseleave="mouseoverText = ''"
            class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ✕
          </button>
        </div>
      </div>
    </div>

    <!-- Channel Filters -->
    <div class="border-t border-gray-300 h-5 py-1">
      <div v-if="activeChannelFilters.length" class="flex flex-wrap gap-2">
        <div
          v-for="channel in activeChannelFilters"
          :key="channel"
          class="relative group"
        >
          <DataTableChannelIconName :canal="channel" :showName="false" />

          <button
            @click="removeChannelFilter(channel); mouseoverText = ''"
            @mouseover="mouseoverText = channel"
            @mouseleave="mouseoverText = ''"
            class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
    <!-- Program Filters -->
    <div class="border-t border-gray-300 pt-2">
      <div v-if="activeProgramFilters.length" class="flex flex-wrap gap-2">
        <div
          v-for="program in activeProgramFilters"
          :key="program"
          class="relative group"
        >
          <div class="px-2 py-1 bg-gray-200 rounded-md text-sm">
            {{ program }}
          </div>
          <button
            @click="removeProgramFilter(program)"
            @mouseover="mouseoverText = program"
            @mouseleave="mouseoverText = ''"
            class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-md"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const filterStore = useFiltersStore();

const activeSDGFilters = computed(() => filterStore.sdgActive);
const activeChannelFilters = computed(() => filterStore.channels);
const activeProgramFilters = computed(() => filterStore.programs);

function sdgColors(topic: SdgTopic) {
  return STYLES.topics[topic].color;
}
// Example: 'SDG1': '#FF0000',

const getChannelIcon = (channel: string): string => {
  // Return the URL or path to the channel icon
  // Example: return `/icons/${channel}.png`
  return "";
};

const removeSdgFilter = (value: SdgTopic) => {
  filterStore.removeSdgFilter(value);
};

const removeChannelFilter = (value: Channels) => {
  filterStore.removeChannelFilter(value);
};

const removeProgramFilter = (value: string) => {
  filterStore.removeProgramFilter(value);
};

/** mouseover text */
const mouseoverText = ref("");
</script>

<style></style>
