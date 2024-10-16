<template>
    <div class="bg-grayyy-200 h-full bg-[url('/img/grid.svg')] bg-repeat">
        
        <div v-if="activeProgramFilters.length" class="flex flex-wrap gap-x-2 gap-y-0.5 ">
          <div
            v-for="program in activeProgramFilters"
            :key="program"
            class="relative group mt-0.5"
          >
            <div class="px-2 py-1 bg-gray-100 rounded-md text-xs">
              {{ nameShorter(program) }}
            </div>

            <button
              @click="removeProgramFilter(program)"
              class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-md"
            >
              ✕
            </button>
          </div>
        </div>

    </div>
</template>

<script lang="ts" setup>
    const filterStore = useFiltersStore();
    const activeProgramFilters = computed(() => filterStore.programs);

    const removeProgramFilter = (value: string) => {
        filterStore.removeProgramFilter(value);
    };

    const nameShorter = (str: string) => {
        return (str.length > 18) ? str.slice(0, 18-1) + '…' : str;
    }


</script>