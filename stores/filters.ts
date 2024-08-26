export const useFiltersStore = defineStore("filters", () => {
  const timespan = ref<[Date,Date]>([new Date(initDateString), new Date()]);

   function updateTimespan(newTimespan: [Date, Date]) {
     timespan.value = newTimespan;
   }

   const sdgActive= ref < SdgTopic []>([]);

  return { timespan: readonly(timespan), updateTimespan, sdgActive };
});
