import { MediaType } from "~/types/appTypes";

export const useFiltersStore = defineStore("filters", () => {
  const timespan = ref<[Date, Date]>([new Date(initDateString), new Date()]);

  function updateTimespan(newTimespan: [Date, Date]) {
    resetFilters();
    timespan.value = newTimespan;
  }


  const radioOrTV = ref<MediaType>(MediaType.ALL);

  function updateRadioOrTV(newRadioOrTV: MediaType) {
    resetFilters();
    if (newRadioOrTV === MediaType.ALL) {
      radioOrTV.value = newRadioOrTV;
    } else if (radioOrTV.value === newRadioOrTV) {
      radioOrTV.value = MediaType.ALL;
    } else {
      radioOrTV.value = newRadioOrTV;
    }
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

  const yearCompare = ref<string>(String(new Date().getFullYear() - 1));

  function resetFilters() {
    sdgActive.value = [];
    channels.value = [];
    programs.value = [];
    programRemovedFlag.value = false;
    channelRemovedFlag.value = false;
  }

  return {
    timespan: readonly(timespan),
    updateTimespan,
    radioOrTV,
    sdgActive,
    channels,
    hasActiveFilters,
    programs,
    removeSdgFilter,
    removeChannelFilter,
    removeProgramFilter,
    resetFilters,
    updateRadioOrTV,
    programRemovedFlag,
    channelRemovedFlag,
    reportType,
    yearCompare,
    showPercentage,
    
  };
});
