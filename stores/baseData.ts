export const useBaseData = defineStore("baseData", () => {
  const channelsData = ref<StatsChannel[] | null>(null);
  const sdgData = ref<StatsSdg[] | null>(null);
  const programsData = ref<StatsPrograms[] | null>(null);

  return { channelsData, sdgData, programsData };
});