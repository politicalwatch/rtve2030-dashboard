<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const filtersStore = useFiltersStore();
const { yearCompare } = storeToRefs(filtersStore);

const computedYearOptions = computed(() => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: currentYear - 2016 }, (_, i) => String(2016 + i));
});
</script>

<template>
  <Select v-model:modelValue="yearCompare">
    <SelectTrigger>
      <SelectValue placeholder="Selecciona el año para comparar" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem v-for="year in computedYearOptions" :key="year" :value="year">
        {{ year }}
      </SelectItem>
    </SelectContent>
  </Select>
</template>
