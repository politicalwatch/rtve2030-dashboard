export const useFiltersStore = defineStore("filters", () => {
  const timespan = ref<[Date, Date]>([new Date(initDateString), new Date()]);

  function updateTimespan(newTimespan: [Date, Date]) {
    timespan.value = newTimespan;
  }

  const sdgActive = ref<SdgTopic[]>([]);
  const channels = ref<Channels[]>([]);

  // New getter
  const hasActiveFilters = computed(() => {
    return sdgActive.value.length > 0 || channels.value.length > 0;
  });

  return {
    timespan: readonly(timespan),
    updateTimespan,
    sdgActive,
    channels,
    hasActiveFilters,
  };
});
