<template>
  <div class="flex justify-between w-full">
    <Popover>
      <PopoverTrigger>
        <div class="hover:underline">
          Desde
          <div class="text-sm">{{ initDate.toString() }}</div>
        </div>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0">
        <Calendar
          :pagedNavigation="true"
          v-model="initDate"
          calendar-label="Date of birth"
          initial-focus
          :min-value="new CalendarDate(1900, 1, 1)"
          :max-value="today(getLocalTimeZone())"
          :preventDeselect="true"
        />
      </PopoverContent>
    </Popover>

    <Popover>
      <PopoverTrigger>
        <div class="hover:underline">
          Hasta:
          <div class="text-sm">{{ endDate.toString() }}</div>
        </div>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0">
        <Calendar
          :pagedNavigation="true"
          v-model="endDate"
          calendar-label="Date of birth"
          initial-focus
          :min-value="initDate"
          :max-value="today(getLocalTimeZone())"
          :preventDeselect="true"
        />
      </PopoverContent>
    </Popover>
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
