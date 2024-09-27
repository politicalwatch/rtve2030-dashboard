<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { filter } from "d3";

const filtersStore = useFiltersStore();

const reportTypeOptions = [
  {
    id: "einf",
    name: "EINF",
  },
  {
    id: "sprsc",
    name: "Memoria Servicio Público y RSC",
  },
  {
    id: "sostenibilidad",
    name: "Memoria de Sostenibilidad",
  },
  {
    id: "aenor",
    name: "Sello AENOR",
  },
  {
    id: "sepi",
    name: "Objetivos SEPI",
  },
];

const selectedPeriod = ref(filtersStore.reportType);

watch(selectedPeriod, (newValue, oldValue) => {
  filtersStore.updateReportType(newValue);
});
</script>

<template>
  <Select v-model:modelValue="selectedPeriod">
    <SelectTrigger>
      <SelectValue placeholder="Select a fruit" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem
        v-for="reportType in reportTypeOptions"
        :key="reportType.id"
        :value="reportType.id"
      >
        {{ reportType.name }}
      </SelectItem>
    </SelectContent>
  </Select>
</template>
