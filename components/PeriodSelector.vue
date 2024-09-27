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

const filtersStore = useFiltersStore();

const selectedPeriod = ref(
  datesToPeriod(filtersStore.timespan[0], filtersStore.timespan[1])
);
const isProgrammaticChange = ref(false);

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

function datesToPeriod(initDate: Date, endDate: Date): string {
  const today = new Date();
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);

  const lastMonth = new Date(today);
  lastMonth.setMonth(today.getMonth() - 1);

  const lastQuarter = new Date(today);
  lastQuarter.setMonth(today.getMonth() - 3);

  const lastHalfYear = new Date(today);
  lastHalfYear.setMonth(today.getMonth() - 6);

  const lastYear = new Date(today);
  lastYear.setFullYear(today.getFullYear() - 1);

  if (
    initDate.toDateString() === lastWeek.toDateString() &&
    endDate.toDateString() === today.toDateString()
  ) {
    return "lastweek";
  }
  if (
    initDate.toDateString() === lastMonth.toDateString() &&
    endDate.toDateString() === today.toDateString()
  ) {
    return "lastmonth";
  }
  if (
    initDate.toDateString() === lastQuarter.toDateString() &&
    endDate.toDateString() === today.toDateString()
  ) {
    return "lastquarter";
  }
  if (
    initDate.toDateString() === lastHalfYear.toDateString() &&
    endDate.toDateString() === today.toDateString()
  ) {
    return "lastsemester";
  }
  if (
    initDate.toDateString() === lastYear.toDateString() &&
    endDate.toDateString() === today.toDateString()
  ) {
    return "lastyear";
  }
  return "custom";
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
