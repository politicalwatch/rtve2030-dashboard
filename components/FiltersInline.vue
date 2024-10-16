<template>
    <div class="grid grid-cols-3 gap-8">

        <!-- SDG -->
        <div class="flex justify-between">
            <div v-if="activeSDGFilters.length" class="flex flex-wrap gap-1">
          <div v-for="sdg in activeSDGFilters" :key="sdg" class="relative group">
            <div
              class="w-4 h-4"
              :style="{ backgroundColor: sdgColors(sdg) }"
            ></div>
            <button
              @click="removeSdgFilter(sdg)"
              class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        </div>

        <div v-else>
            <p class="font-mono text-sm text-gray-400">todos los ODS</p>
        </div>

            <img src="/img/ods_icon.svg" alt="ods" class="h-5 w-auto" :class="activeSDGFilters.length ? ' opacity-100' : 'opacity-30'">
        </div>

        <!-- Canales -->
        <div>
            <div class="flex justify-between">

                <div v-if="activeChannelFilters.length" class="flex flex-wrap gap-1">
                    <div
                        v-for="channel in activeChannelFilters"
                        :key="channel"
                        class="relative group"
                    >
                    <DataTableChannelIconName :canal="channel" :showName="false" />

                    <button
                        @click="removeChannelFilter(channel)"
                        class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        ✕
                    </button>
                    </div>
                </div>

                <div v-else>
                    <p class="font-mono text-sm text-gray-400">todos los canales</p>
                </div>

               

                <img src="/img/rtve.svg" alt="ods" class="w-5 h-auto mt-2" :class="activeChannelFilters.length ? ' opacity-100' : 'opacity-30'">
            </div>
        </div>

        <!-- Programas (head) -->
        <div>
            <div class="flex justify-between">

                <div >
                    <p v-if="!activeProgramFilters.length" class="font-mono text-sm text-gray-400">todos los programas</p>

                    <p v-else class="font-mono text-sm text-gray-400"> {{ activeProgramFilters.length }} programas:</p>
                </div>
                

                <img src="/img/programas.svg" alt="ods" class="h-4 w-auto mt-1" :class="activeProgramFilters.length ? ' opacity-100' : 'opacity-30'">
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

    const removeSdgFilter = (value: SdgTopic) => {
        filterStore.removeSdgFilter(value);
    };

    const removeChannelFilter = (value: Channels) => {
        filterStore.removeChannelFilter(value);
    };

</script>