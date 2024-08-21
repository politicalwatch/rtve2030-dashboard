export const useFiltersStore = defineStore("filters", () => {
  const timespan = ref<[Date,Date]>([new Date(initDate), new Date()]);

  return { timespan };
});
