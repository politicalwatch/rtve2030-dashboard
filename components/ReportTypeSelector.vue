<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const filtersStore = useFiltersStore();
const { reportType } = storeToRefs(filtersStore);

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
</script>

<template>
  <Select v-model:modelValue="reportType">
    <SelectTrigger>
      <SelectValue placeholder="Selecciona un tipo de informe" />
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
