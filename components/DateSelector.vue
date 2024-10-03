<template>
  <div class="flex justify-between w-full mt-4">
    <img src="/img/calendar.svg" alt="calendar" class="h-8 w-auto">

    <div>
      <p class="text-xs font-mono">desde</p>
      <Popover>
        <PopoverTrigger>
          <div class="hover:underline">
            <div class="text-sm font-bold oldstyle-nums">{{ format.dottedDate(initDate) }}</div>
          </div>
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0">
          <CalendarCustom
            :pagedNavigation="true"
            v-model="initDate"
            calendar-label="Fecha de inicio"
            initial-focus
            :min-value="new CalendarDate(2015, 1, 1)"
            :max-value="today(getLocalTimeZone())"
            :preventDeselect="true"
          />
        </PopoverContent>
      </Popover>
    </div>
   
  <div>
      <p class="text-xs font-mono text-right">hasta</p>
    <Popover>
      <PopoverTrigger>
        <div class="hover:underline">
          <div class="text-sm oldstyle-nums font-bold">{{ format.dottedDate(endDate) }}</div>
        </div>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0">
        <CalendarCustom
          :pagedNavigation="true"
          v-model="endDate"
          calendar-label="Fecha de fin"
          initial-focus
          :min-value="initDate"
          :max-value="today(getLocalTimeZone())"
          :preventDeselect="true"
        />
      </PopoverContent>
    </Popover>
    </div>

  </div>
</template>

<script setup lang="js">
import { CalendarDate, DateFormatter, getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { Calendar } from "@/components/ui/calendar";

const filtersStore = useFiltersStore();
const { timespan } = storeToRefs(filtersStore);

const initDate = ref(jsDateToCalendarDate(filtersStore.timespan[0]))
const endDate = ref(jsDateToCalendarDate(filtersStore.timespan[1]))
const isProgrammaticChange = ref(false);


watch([initDate, endDate], (newValue, oldValue) => {
  if (isProgrammaticChange.value) {
    isProgrammaticChange.value = false;
    return;
  } else {
    isProgrammaticChange.value = true;
    filtersStore.updateTimespan([initDate.value.toDate(getLocalTimeZone()), endDate.value.toDate(getLocalTimeZone())] )
  }
});

watch(
  timespan,
  (value) => {
    if (isProgrammaticChange.value) {
      isProgrammaticChange.value = false;
      return;
    }
    if (value) {
      isProgrammaticChange.value = true;
      initDate.value = jsDateToCalendarDate(filtersStore.timespan[0])
      endDate.value = jsDateToCalendarDate(filtersStore.timespan[1])
    }
  }
);
</script>

<style scoped></style>
