<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const periods = [
  {
    id: "lastweek",
    name: "Última semana",
  },
  {
    id: "lastmonth",
    name: "Último mes",
  },
  {
    id: "lastquarter",
    name: "Último trimestre",
  },
  {
    id: "lastsemester",
    name: "Último semestre",
  },
  {
    id: "lastyear",
    name: "Último año",
  },
  {
    id: "custom",
    name: "Personalizado",
  },
];

const selectedPeriod = ref("custom");
const isProgrammaticChange = ref(false);

const filtersStore = useFiltersStore();
watch(selectedPeriod, (newValue, oldValue) => {
  if (isProgrammaticChange.value) {
    isProgrammaticChange.value = false;
    return;
  } else {
    const [initDate, endDate] = periodToDates(newValue);
    isProgrammaticChange.value = true;
    filtersStore.updateTimespan([initDate, endDate]);
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
      selectedPeriod.value = "custom";
    }
  }
);

/* returns init and end date for the selected period */
function periodToDates(period: string): [Date, Date] {
  const today = new Date();
  switch (period) {
    case "lastweek":
      return [new Date(today.setDate(today.getDate() - 7)), new Date()];
    case "lastmonth":
      return [new Date(today.setMonth(today.getMonth() - 1)), new Date()];
    case "lastquarter":
      return [new Date(today.setMonth(today.getMonth() - 3)), new Date()];
    case "lastsemester":
      return [new Date(today.setMonth(today.getMonth() - 6)), new Date()];
    case "lastyear":
      return [new Date(today.setFullYear(today.getFullYear() - 1)), new Date()];
  }
  // custom:
  return [new Date(), new Date()];
}
</script>

<template>
  <Select v-model:modelValue="selectedPeriod">
    <SelectTrigger>
      <SelectValue placeholder="Select a fruit" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem
        v-for="period in periods"
        :key="period.id"
        :value="period.id"
        :disabled="period.id === 'custom'"
      >
        {{ period.name }}
      </SelectItem>
    </SelectContent>
  </Select>
</template>
