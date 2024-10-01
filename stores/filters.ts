export const useFiltersStore = defineStore("filters", () => {
  const timespan = ref<[Date, Date]>([new Date(initDateString), new Date()]);

  function updateTimespan(newTimespan: [Date, Date]) {
    timespan.value = newTimespan;
  }

  const sdgActive = ref<SdgTopic[]>([]);
  const channels = ref<Channels[]>([]);
  const programs = ref<string[]>([]);
  const programRemovedFlag = ref(false);
  const channelRemovedFlag = ref(false);
  // New getter
  const hasActiveFilters = computed(() => {
    return (
      sdgActive.value.length > 0 ||
      channels.value.length > 0 ||
      programs.value.length > 0
    );
  });

  function removeSdgFilter(value: SdgTopic) {
    sdgActive.value = sdgActive.value.filter((sdg) => sdg !== value);
  }

  function removeChannelFilter(value: Channels) {
    channelRemovedFlag.value = true;
    channels.value = channels.value.filter((channel) => channel !== value);
  }

  function removeProgramFilter(value: string) {
    programRemovedFlag.value = true;
    programs.value = programs.value.filter((program) => program !== value);
  }

  const showPercentage = ref(false);

  const reportType = ref<string>("einf");

  function updateReportType(newReportType: string) {
    reportType.value = newReportType;
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
    programRemovedFlag,
    channelRemovedFlag,
    reportType: readonly(reportType),
    updateReportType,
    showPercentage,
  };
});
