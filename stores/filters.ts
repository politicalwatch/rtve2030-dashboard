export const useFiltersStore = defineStore("filters", () => {
  const timespan = ref<[Date, Date]>([new Date(initDateString), new Date()]);

  function updateTimespan(newTimespan: [Date, Date]) {
    timespan.value = newTimespan;
  }

  const sdgActive = ref<SdgTopic[]>([]);
  const channels = ref<Channels[]>([]);
  const programs = ref<string[]>([]);
  // New getter
  const hasActiveFilters = computed(() => {
    return sdgActive.value.length > 0 || channels.value.length > 0;
  });

  function removeSdgFilter(value: SdgTopic) {
    sdgActive.value = sdgActive.value.filter((sdg) => sdg !== value);
  }

  function removeChannelFilter(value: Channels) {
    channels.value = channels.value.filter((channel) => channel !== value);
  }

  function removeProgramFilter(value: string) {
    programs.value = programs.value.filter((program) => program !== value);
  }

  return {
    timespan: readonly(timespan),
    updateTimespan,
    sdgActive,
    channels,
    hasActiveFilters,
    programs,
    removeSdgFilter,
    removeChannelFilter,
    removeProgramFilter,
  };
});
