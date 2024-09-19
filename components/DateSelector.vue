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
          @update:model-value="updateModelValue"
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
          @update:model-value="updateModelValue"
        />
      </PopoverContent>
    </Popover>
  </div>
</template>

<script setup lang="js">
import { CalendarDate, DateFormatter, getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { toDate } from "radix-vue/date";
import { Calendar } from "@/components/ui/calendar";
const placeholder = ref('')
const initDate = ref(parseDate(initDateString))
const endDate = ref(today(getLocalTimeZone()))
const filtersStore = useFiltersStore();
const isProgrammaticChange = ref(false);

// function updateModelValue(){
//   console.log('updateModelValue')
//   filters.timespan=[initDate.value.toDate(getLocalTimeZone()), endDate.value.toDate(getLocalTimeZone())]
// }

watch(initDate, (newValue, oldValue) => {
  if (isProgrammaticChange.value) {
    isProgrammaticChange.value = false;
    return;
  } else {
    isProgrammaticChange.value = true;
    filtersStore.updateTimespan([initDate.value.toDate(getLocalTimeZone()), endDate.value.toDate(getLocalTimeZone())] )
  }
});

watch(
  () => filtersStore.timespan,
  (value) => {
    if (isProgrammaticChange.value) {
      isProgrammaticChange.value = false;
      return;
    }
    if (value) {
      isProgrammaticChange.value = true;
      initDate.value = new CalendarDate(value[0].getFullYear(), value[0].getMonth()+1, value[0].getDate())
      endDate.value = new CalendarDate(value[1].getFullYear(), value[1].getMonth()+1, value[1].getDate())
    }
  }
);

</script>

<style scoped></style>
