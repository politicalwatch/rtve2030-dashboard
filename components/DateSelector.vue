<template>
  <div class="flex justify-between w-full">
    <Popover>
      <PopoverTrigger >
        <div class="hover:underline">Desde   <div class="text-sm">{{ initDate.toString() }} </div></div>
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
      <PopoverTrigger >
        <div class="hover:underline">Hasta: <div class="text-sm"> {{ endDate.toString() }} </div> </div>
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
const initDate = ref(parseDate('2022-01-01'))
const endDate = ref(today(getLocalTimeZone()))
const filters = useFiltersStore()

function updateModelValue(){
  console.log('updateModelValue')
  filters.timespan=[initDate.value.toDate(getLocalTimeZone()), endDate.value.toDate(getLocalTimeZone())]
}

// watch(() => filters.timespan, (value) => {
//   if (value) {
//     initDate.value = parseDate(value[0])
//     endDate.value = parseDate(value[1])
//   }
// })
</script>

<style scoped></style>
